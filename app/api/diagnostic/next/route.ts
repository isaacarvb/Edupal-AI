import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

const DIAGNOSTIC_CAP = 10;

// Next unattempted question in a subject (curated first). Caps at 10 per subject.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const subject = searchParams.get("subject");
  if (!userId || !subject) {
    return NextResponse.json({ error: "userId + subject required" }, { status: 400 });
  }
  const db = getDb();
  const done = db
    .prepare(
      `SELECT COUNT(*) AS n FROM attempts a
       JOIN questions q ON q.id = a.question_id
       WHERE a.user_id = ? AND q.subject = ?`
    )
    .get(userId, subject) as { n: number };
  if (done.n >= DIAGNOSTIC_CAP) return NextResponse.json({ done: true, answered: done.n });
  const q = db
    .prepare(
      `SELECT id, exam, subject, topic, type, stem, options_json AS optionsJson,
              predicted_repeat AS predictedRepeat
       FROM questions
       WHERE subject = ? AND id NOT IN (SELECT question_id FROM attempts WHERE user_id = ?)
       ORDER BY CASE WHEN source = 'CURATED' THEN 0 ELSE 1 END, id
       LIMIT 1`
    )
    .get(subject, userId);
  if (!q) return NextResponse.json({ done: true, answered: done.n });
  return NextResponse.json({ done: false, answered: done.n, question: q });
}
