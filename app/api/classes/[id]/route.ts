import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// Class detail: members with accuracy (owner) or own view (member),
// assignments, sessions. Owner sees all; members see shared parts.
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  const db = await getDb();
  const cls = await db
    .prepare("SELECT id, teacher_id AS teacherId, name, invite_code AS inviteCode, term, plan FROM classes WHERE id = ?")
    .get(id) as
    | { id: string; teacherId: string; name: string; inviteCode: string; term: string; plan: string }
    | undefined;
  if (!cls) return NextResponse.json({ error: "unknown class" }, { status: 404 });
  const isOwner = cls.teacherId === userId;
  const isMember = !!await db
    .prepare("SELECT 1 FROM class_members WHERE class_id = ? AND student_id = ?")
    .get(id, userId);
  if (!isOwner && !isMember) return NextResponse.json({ error: "not your class" }, { status: 403 });

  const members = isOwner
    ? (await db
        .prepare(
          `SELECT u.id, u.name, u.email,
                  ROUND(AVG(a.correct) * 100) AS accuracy,
                  COUNT(a.id) AS attempts
           FROM class_members m JOIN users u ON u.id = m.student_id
           LEFT JOIN attempts a ON a.user_id = u.id
           WHERE m.class_id = ? GROUP BY u.id ORDER BY accuracy ASC`
        )
        .all(id) as { id: string; name: string; email: string; accuracy: number | null; attempts: number }[])
    : [];
  const assignments = await db
    .prepare("SELECT id, subject, topic, note, created_at AS at FROM assignments WHERE class_id = ? ORDER BY created_at DESC")
    .all(id);
  const sessions = await db
    .prepare("SELECT id, title, starts_at AS startsAt, meet_url AS meetUrl FROM class_sessions WHERE class_id = ? ORDER BY starts_at ASC")
    .all(id);
  return NextResponse.json({ class: cls, isOwner, members, assignments, sessions });
}
