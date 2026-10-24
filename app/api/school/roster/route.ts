import { NextResponse } from "next/server";
import { getDb, uid } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { requireSchoolAdmin, countMembers, syntheticEmail, generatePassword } from "@/lib/schools";

// Roster management for the school staff login.
// GET ?userId= — current roster (names, classes, login emails; passwords are
//   never retrievable — shown once at upload time).
// POST {userId, students: [{name, class}]} — create school-issued logins.
//   800-row uploads run as one loop; partial failures are reported per row.

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const db = await getDb();
  try {
    const { school } = await requireSchoolAdmin(db, userId);
    const roster = (await db
      .prepare(
        `SELECT u.id AS "userId", u.name, u.email, sm.class_name AS "className", sm.created_at AS "joinedAt"
         FROM school_members sm JOIN users u ON u.id = sm.user_id
         WHERE sm.school_id = ? ORDER BY sm.class_name, u.name`
      )
      .all(school.id)) as Array<{ userId: string; name: string | null; email: string | null; className: string; joinedAt: string }>;
    return NextResponse.json({ roster: roster.map((r) => ({ ...r, name: r.name ?? "" })), total: roster.length });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: e instanceof Error && e.message.includes("forbidden") ? 403 : 500 });
  }
}

export async function POST(req: Request) {
  const b = await req.json();
  const db = await getDb();
  try {
    const { school } = await requireSchoolAdmin(db, String(b?.userId ?? ""));

    const rows = (Array.isArray(b?.students) ? b.students : [])
      .map((s: { name?: unknown; class?: unknown; className?: unknown }) => ({
        name: String(s?.name ?? "").trim().slice(0, 80),
        className: String(s?.class ?? s?.className ?? "").trim().slice(0, 40)
      }));
    const valid = rows.filter((s: { name: string }) => s.name.length >= 2);
    if (!valid.length) return NextResponse.json({ error: "no valid rows — expected lines of: Full Name, Class" }, { status: 400 });
    if (valid.length > 2000) return NextResponse.json({ error: "too many rows (max 2000 per upload)" }, { status: 400 });

    const used = await countMembers(db, school.id);
    if (used + valid.length > school.maxSeats) {
      return NextResponse.json(
        { error: `seat limit reached — ${used}/${school.maxSeats} used, this upload has ${rows.length}. Raise the school's seat limit first.` },
        { status: 409 }
      );
    }

    // Uniqueness against existing users AND within this upload.
    const taken = new Set(
      ((await db.prepare("SELECT email FROM users").all()) as Array<{ email: string }>).map((r) => String(r.email ?? "").toLowerCase())
    );
    const existingMembers = new Set(
      ((await db.prepare("SELECT user_id AS id FROM school_members WHERE school_id = ?").all(school.id)) as Array<{ id: string }>).map((r) => r.id)
    );

    const credentials: Array<{ name: string; className: string; email: string; password: string }> = [];
    const skipped: Array<{ name: string; reason: string }> = rows
      .filter((s: { name: string }) => s.name.length < 2)
      .map((s: { name: string }) => ({ name: s.name || "(blank)", reason: "name too short" }));
    const now = new Date().toISOString();

    for (const row of valid) {
      const email = syntheticEmail(row.name, school.code, taken);
      const password = generatePassword();
      const id = uid();
      try {
        await db
          .prepare("INSERT INTO users (id, name, email, password_hash, role, level) VALUES (?, ?, ?, ?, 'STUDENT', 'SECONDARY')")
          .run(id, row.name, email, hashPassword(password));
        await db.prepare("INSERT INTO wallets (user_id, credits_left, reset_at, plan) VALUES (?, 10, ?, 'FREE')").run(id, now);
        await db.prepare("INSERT INTO streaks (user_id) VALUES (?)").run(id);
        if (!existingMembers.has(id)) {
          await db.prepare("INSERT INTO school_members (id, school_id, user_id, class_name) VALUES (?, ?, ?, ?)").run(uid(), school.id, id, row.className);
          existingMembers.add(id);
        }
        credentials.push({ name: row.name, className: row.className, email, password });
      } catch (e) {
        skipped.push({ name: row.name, reason: e instanceof Error ? e.message.slice(0, 120) : "failed" });
      }
    }

    return NextResponse.json({ created: credentials.length, skipped, credentials, total: used + credentials.length, maxSeats: school.maxSeats });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: e instanceof Error && e.message.includes("forbidden") ? 403 : 500 });
  }
}
