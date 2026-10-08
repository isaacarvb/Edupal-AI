import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";

// Profile self-service: avatar (small data URL, local disk), language, password change.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  const db = getDb();
  const u = db
    .prepare(
      `SELECT u.name, u.email, u.avatar, u.level, p.exam, p.exam_date AS examDate, p.language
       FROM users u LEFT JOIN profiles p ON p.user_id = u.id WHERE u.id = ?`
    )
    .get(userId);
  if (!u) return NextResponse.json({ error: "unknown user" }, { status: 404 });
  return NextResponse.json({ profile: u });
}

export async function POST(req: Request) {
  const { userId, avatar, language, currentPassword, newPassword } = await req.json();
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  const db = getDb();
  if (avatar !== undefined) {
    if (typeof avatar !== "string" || !avatar.startsWith("data:image/") || avatar.length > 200000) {
      return NextResponse.json({ error: "avatar must be an image under ~200KB" }, { status: 400 });
    }
    db.prepare("UPDATE users SET avatar = ? WHERE id = ?").run(avatar, userId);
  }
  if (language !== undefined) {
    if (!["SIMPLE", "PIDGIN"].includes(language)) return NextResponse.json({ error: "bad language" }, { status: 400 });
    db.prepare("UPDATE profiles SET language = ? WHERE user_id = ?").run(language, userId);
  }
  if (newPassword !== undefined) {
    if (!currentPassword || newPassword.length < 6) {
      return NextResponse.json({ error: "current password + 6-char new password required" }, { status: 400 });
    }
    const row = db.prepare("SELECT password_hash AS h FROM users WHERE id = ?").get(userId) as { h: string | null } | undefined;
    if (!row?.h || !verifyPassword(currentPassword, row.h)) {
      return NextResponse.json({ error: "current password is wrong" }, { status: 401 });
    }
    db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(hashPassword(newPassword), userId);
  }
  return NextResponse.json({ ok: true });
}
