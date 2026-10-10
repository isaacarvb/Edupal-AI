import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// Student reports a wrong/confusing explanation (48h review SLA).
// Admin resolves via ?resolve=<attemptId> or { resolve } body.
export async function POST(req: Request) {
  const { userId, questionId, attemptId, resolve } = await req.json();
  const db = await getDb();
  if (resolve || attemptId) {
    const id = (resolve || attemptId) as string;
    await db.prepare("UPDATE attempts SET flagged = 0 WHERE id = ?").run(id);
    return NextResponse.json({ ok: true, resolved: id });
  }
  if (!userId || !questionId) {
    return NextResponse.json({ error: "userId + questionId required" }, { status: 400 });
  }
  const latest = await db
    .prepare("SELECT id FROM attempts WHERE user_id = ? AND question_id = ? ORDER BY created_at DESC LIMIT 1")
    .get(userId, questionId) as { id: string } | undefined;
  if (!latest) return NextResponse.json({ error: "no attempt found" }, { status: 404 });
  await db.prepare("UPDATE attempts SET flagged = 1 WHERE id = ?").run(latest.id);
  return NextResponse.json({ ok: true, flagged: latest.id });
}

export async function GET() {
  const db = await getDb();
  const rows = await db
    .prepare(
      `SELECT a.id, a.response, a.correct, a.created_at AS at, q.subject, q.topic, q.stem, q.answer_key AS "answerKey",
              u.email AS student
       FROM attempts a
       JOIN questions q ON q.id = a.question_id
       LEFT JOIN users u ON u.id = a.user_id
       WHERE a.flagged = 1 ORDER BY a.created_at DESC`
    )
    .all();
  return NextResponse.json({ flags: rows });
}
