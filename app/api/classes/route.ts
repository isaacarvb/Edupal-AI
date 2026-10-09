import { NextResponse } from "next/server";
import { getDb, uid, type Db } from "@/lib/db";

function makeCode(): string {
  const abc = "ABCDEFGHJKMNPQRSTUVWXYZ";
  const num = "23456789";
  const pick = (s: string, n: number) => Array.from({ length: n }, () => s[Math.floor(Math.random() * s.length)]).join("");
  return `${pick(abc, 3)}-${pick(num, 4)}`;
}

async function roleOf(db: Db, userId: string): Promise<string> {
  const r = await db.prepare("SELECT role FROM users WHERE id = ?").get(userId) as { role: string } | undefined;
  return r?.role ?? "STUDENT";
}

// Teacher: own classes with member counts. Student: joined classes + live sessions.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  const db = await getDb();
  const role = await roleOf(db, userId);
  if (role === "TEACHER") {
    const classes = await db
      .prepare(
        `SELECT c.id, c.name, c.invite_code AS inviteCode, c.term, c.plan,
                (SELECT COUNT(*) FROM class_members m WHERE m.class_id = c.id) AS members
         FROM classes c WHERE c.teacher_id = ? ORDER BY c.created_at DESC`
      )
      .all(userId);
    return NextResponse.json({ role, classes });
  }
  const classes = await db
    .prepare(
      `SELECT c.id, c.name, c.term, u.name AS teacher,
              (SELECT COUNT(*) FROM assignments a WHERE a.class_id = c.id) AS assignments
       FROM class_members m JOIN classes c ON c.id = m.class_id
       LEFT JOIN users u ON u.id = c.teacher_id
       WHERE m.student_id = ? ORDER BY c.created_at DESC`
    )
    .all(userId);
  const twoHoursAgo = new Date(Date.now() - 2 * 3600000).toISOString();
  const live = await db
    .prepare(
      `SELECT s.title, s.starts_at AS startsAt, s.meet_url AS meetUrl, c.name AS className
       FROM class_sessions s JOIN classes c ON c.id = s.class_id
       JOIN class_members m ON m.class_id = c.id
       WHERE m.student_id = ? AND s.starts_at >= ?
       ORDER BY s.starts_at ASC LIMIT 5`
    )
    .all(userId, twoHoursAgo);
  return NextResponse.json({ role, classes, live });
}

// Teacher creates a class → invite code.
export async function POST(req: Request) {
  const { userId, name, term } = await req.json();
  if (!userId || !name?.trim()) return NextResponse.json({ error: "userId + name required" }, { status: 400 });
  const db = await getDb();
  if ((await roleOf(db, userId)) !== "TEACHER") {
    return NextResponse.json({ error: "teachers only" }, { status: 403 });
  }
  let code = makeCode();
  for (let i = 0; i < 5; i++) {
    const clash = await db.prepare("SELECT 1 FROM classes WHERE invite_code = ?").get(code);
    if (!clash) break;
    code = makeCode();
  }
  const id = uid();
  await db.prepare("INSERT INTO classes (id, teacher_id, name, invite_code, term) VALUES (?, ?, ?, ?, ?)").run(
    id, userId, name.trim(), code, term || "First Term"
  );
  return NextResponse.json({ ok: true, id, inviteCode: code });
}
