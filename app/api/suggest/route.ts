import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// Smart next-topic: weakest accuracy first, predicted-repeat topics prioritised.
// Student can override via POST /api/topics/override.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT m.subject, m.topic, m.accuracy, m.label,
              MAX(CASE WHEN q.predicted_repeat = 1 THEN 1 ELSE 0 END) AS hot
       FROM topic_mastery m
       LEFT JOIN questions q ON q.subject = m.subject AND q.topic = m.topic
       WHERE m.user_id = ?
       GROUP BY m.subject, m.topic, m.accuracy, m.label
       ORDER BY CASE m.label WHEN 'WEAK' THEN 0 WHEN 'NEEDS_WORK' THEN 1 ELSE 2 END,
                hot DESC, m.accuracy ASC
       LIMIT 1`
    )
    .all(userId);
  if (!rows.length) {
    return NextResponse.json({ suggestion: null, reason: "Practice first — answer a few questions and I'll pick your weakest topic." });
  }
  const s = rows[0] as { subject: string; topic: string; accuracy: number; label: string; hot: number };
  const reason =
    s.label === "WEAK"
      ? `${s.topic} is your weakest (${Math.round(s.accuracy)}%). Fix this first.`
      : `Strongest gains live in ${s.topic} (${Math.round(s.accuracy)}%).`;
  return NextResponse.json({ suggestion: s, reason });
}
