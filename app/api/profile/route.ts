import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";

// Profile self-service: avatar (small data URL, local disk), language, password change.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  const db = await getDb();
  const u = await db
    .prepare(
      `SELECT u.name, u.email, u.avatar, u.level, p.exam, p.exam_date AS "examDate",
              p.exam_start AS "examStart", p.exam_end AS "examEnd",
              p.dates_confirmed AS "datesConfirmed", p.department, p.language
       FROM users u LEFT JOIN profiles p ON p.user_id = u.id WHERE u.id = ?`
    )
    .get(userId);
  if (!u) return NextResponse.json({ error: "unknown user" }, { status: 404 });
  return NextResponse.json({ profile: u });
}

export async function POST(req: Request) {
  const { userId, name, avatar, language, currentPassword, newPassword, examStart, examEnd, datesConfirmed, department } = await req.json();
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  const db = await getDb();
  if (name !== undefined) {
    if (!String(name).trim()) return NextResponse.json({ error: "name can't be empty" }, { status: 400 });
    await db.prepare("UPDATE users SET name = ? WHERE id = ?").run(String(name).trim(), userId);
  }
  if (avatar !== undefined) {
    if (typeof avatar !== "string" || !avatar.startsWith("data:image/") || avatar.length > 200000) {
      return NextResponse.json({ error: "avatar must be an image under ~200KB" }, { status: 400 });
    }
    await db.prepare("UPDATE users SET avatar = ? WHERE id = ?").run(avatar, userId);
  }
  if (language !== undefined) {
    if (!["SIMPLE", "PIDGIN"].includes(language)) return NextResponse.json({ error: "bad language" }, { status: 400 });
    await db.prepare("UPDATE profiles SET language = ? WHERE user_id = ?").run(language, userId);
  }
  if (newPassword !== undefined) {
    if (!currentPassword || newPassword.length < 6) {
      return NextResponse.json({ error: "current password + 6-char new password required" }, { status: 400 });
    }
    const row = await db.prepare("SELECT password_hash AS h FROM users WHERE id = ?").get(userId) as { h: string | null } | undefined;
    if (!row?.h || !verifyPassword(currentPassword, row.h)) {
      return NextResponse.json({ error: "current password is wrong" }, { status: 401 });
    }
    await db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(hashPassword(newPassword), userId);
  }
  // Examination schedule (Settings → Examination schedule). Independent of profile.
  if (examStart !== undefined || examEnd !== undefined || datesConfirmed !== undefined || department !== undefined) {
    const cur = (await db.prepare("SELECT exam, department, exam_start AS examStart, exam_end AS examEnd, dates_confirmed AS datesConfirmed FROM profiles WHERE user_id = ?").get(userId)) as
      | { exam: string; department: string; examStart: string | null; examEnd: string | null; datesConfirmed: number }
      | undefined;
    const confirmed = datesConfirmed === undefined ? Number(cur?.datesConfirmed ?? 1) !== 0 : !!datesConfirmed;
    const start = examStart === undefined ? cur?.examStart ?? null : (examStart || null);
    const end = examEnd === undefined ? cur?.examEnd ?? null : (examEnd || null);
    if (confirmed && start && end && end < start) {
      return NextResponse.json({ error: "end date cannot be before start date" }, { status: 400 });
    }
    const dept = department === undefined ? cur?.department ?? "" : String(department);
    if (cur?.exam && cur.exam !== "Others" && dept && !["Science", "Commercial", "Arts"].includes(dept)) {
      return NextResponse.json({ error: "department must be Science, Commercial or Arts" }, { status: 400 });
    }
    await db.prepare(
      "UPDATE profiles SET exam_start = ?, exam_end = ?, exam_date = ?, dates_confirmed = ?, department = COALESCE(NULLIF(?, ''), department) WHERE user_id = ?"
    ).run(confirmed ? start : null, confirmed ? end : null, confirmed ? start : null, confirmed ? 1 : 0, dept, userId);
  }
  return NextResponse.json({ ok: true });
}
