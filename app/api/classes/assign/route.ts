import { NextResponse } from "next/server";
import { getDb, uid, type Db } from "@/lib/db";

async function owner(db: Db, classId: string, userId: string): Promise<boolean> {
  const c = await db.prepare("SELECT teacher_id AS t FROM classes WHERE id = ?").get(classId) as { t: string } | undefined;
  return c?.t === userId;
}

// Owner assigns a topic + note to the class.
export async function POST(req: Request) {
  const { userId, classId, subject, topic, note } = await req.json();
  if (!userId || !classId || !subject || !topic) {
    return NextResponse.json({ error: "userId, classId, subject, topic required" }, { status: 400 });
  }
  const db = await getDb();
  if (!(await owner(db, classId, userId))) return NextResponse.json({ error: "class owner only" }, { status: 403 });
  const id = uid();
  await db.prepare("INSERT INTO assignments (id, class_id, subject, topic, note) VALUES (?, ?, ?, ?, ?)").run(
    id, classId, subject, topic, note ?? ""
  );
  return NextResponse.json({ ok: true, id });
}
