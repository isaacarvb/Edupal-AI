import { NextResponse } from "next/server";
import { getDb, uid } from "@/lib/db";

function owner(db: ReturnType<typeof getDb>, classId: string, userId: string): boolean {
  const c = db.prepare("SELECT teacher_id AS t FROM classes WHERE id = ?").get(classId) as { t: string } | undefined;
  return c?.t === userId;
}

// Owner assigns a topic + note to the class.
export async function POST(req: Request) {
  const { userId, classId, subject, topic, note } = await req.json();
  if (!userId || !classId || !subject || !topic) {
    return NextResponse.json({ error: "userId, classId, subject, topic required" }, { status: 400 });
  }
  const db = getDb();
  if (!owner(db, classId, userId)) return NextResponse.json({ error: "class owner only" }, { status: 403 });
  const id = uid();
  db.prepare("INSERT INTO assignments (id, class_id, subject, topic, note) VALUES (?, ?, ?, ?, ?)").run(
    id, classId, subject, topic, note ?? ""
  );
  return NextResponse.json({ ok: true, id });
}
