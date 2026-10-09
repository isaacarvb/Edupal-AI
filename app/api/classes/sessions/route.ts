import { NextResponse } from "next/server";
import { getDb, uid } from "@/lib/db";

// Owner schedules a live session (Meet/Jitsi link pasted, not hosted).
export async function POST(req: Request) {
  const { userId, classId, title, startsAt, meetUrl } = await req.json();
  if (!userId || !classId || !title?.trim() || !startsAt) {
    return NextResponse.json({ error: "userId, classId, title, startsAt required" }, { status: 400 });
  }
  const db = await getDb();
  const c = await db.prepare("SELECT teacher_id AS t FROM classes WHERE id = ?").get(classId) as { t: string } | undefined;
  if (c?.t !== userId) return NextResponse.json({ error: "class owner only" }, { status: 403 });
  const id = uid();
  await db.prepare("INSERT INTO class_sessions (id, class_id, title, starts_at, meet_url) VALUES (?, ?, ?, ?, ?)").run(
    id, classId, title.trim(), startsAt, meetUrl ?? ""
  );
  return NextResponse.json({ ok: true, id });
}
