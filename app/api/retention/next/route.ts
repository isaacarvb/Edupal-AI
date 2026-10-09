import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// Retention refresh: stalest STRONG topic first (prevents skill decay).
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  const db = await getDb();
  const topic = await db
    .prepare(
      `SELECT m.subject, m.topic, MAX(a.created_at) AS last
       FROM topic_mastery m
       LEFT JOIN attempts a ON a.user_id = m.user_id
         AND a.question_id IN (SELECT id FROM questions q WHERE q.subject = m.subject AND q.topic = m.topic)
       WHERE m.user_id = ? AND m.label = 'STRONG'
       GROUP BY m.subject, m.topic
       ORDER BY last ASC NULLS LAST
       LIMIT 1`
    )
    .get(userId) as { subject: string; topic: string; last: string | null } | undefined;
  if (!topic) return NextResponse.json({ question: null, reason: "No Strong topics yet — earn one first." });
  const q = await db
    .prepare(
      `SELECT id, exam, subject, topic, type, stem, options_json AS optionsJson
       FROM questions WHERE subject = ? AND topic = ? ORDER BY RANDOM() LIMIT 1`
    )
    .get(topic.subject, topic.topic);
  return NextResponse.json({ question: q, topic, reason: `${topic.topic} is Strong — quick refresh keeps it there.` });
}
