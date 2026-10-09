import { NextResponse } from "next/server";
import { getDb, uid } from "@/lib/db";
import { getWallet } from "@/lib/credits";
import { gradeTheory } from "@/lib/ai";

// Past paper mode (paid): full paper under time, submitted whole, scored at end.
// Answers are NEVER sent to the client before submit.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const exam = searchParams.get("exam") ?? "WAEC";
  const subject = searchParams.get("subject") ?? "English";
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  const db = await getDb();
  const wallet = await getWallet(db, userId);
  if (!wallet || wallet.plan !== "UNLIMITED") {
    return NextResponse.json({ error: "past paper mode needs Unlimited", needsUpgrade: true }, { status: 402 });
  }
  const rows = await db
    .prepare(
      `SELECT id, subject, topic, type, stem, options_json AS optionsJson
       FROM questions WHERE exam = ? AND subject = ? ORDER BY id LIMIT 10`
    )
    .all(exam, subject);
  if (!rows.length) return NextResponse.json({ error: "no paper for this exam/subject yet" }, { status: 404 });
  return NextResponse.json({ questions: rows, seconds: rows.length * 60 });
}

export async function POST(req: Request) {
  const { userId, answers } = await req.json() as {
    userId: string; answers: { questionId: string; response: string }[];
  };
  if (!userId || !Array.isArray(answers)) {
    return NextResponse.json({ error: "userId + answers required" }, { status: 400 });
  }
  const db = await getDb();
  const wallet = await getWallet(db, userId);
  if (!wallet || wallet.plan !== "UNLIMITED") {
    return NextResponse.json({ error: "past paper mode needs Unlimited", needsUpgrade: true }, { status: 402 });
  }
  const profile = await db.prepare("SELECT language FROM profiles WHERE user_id = ?").get(userId) as
    | { language: "SIMPLE" | "PIDGIN" }
    | undefined;
  const language = profile?.language ?? "SIMPLE";
  const now = new Date().toISOString();

  let correct = 0;
  const perTopic: Record<string, { correct: number; total: number; subject: string }> = {};
  for (const a of answers) {
    const q = await db
      .prepare("SELECT id, subject, topic, type, answer_key AS answerKey, marking_rubric AS markingRubric FROM questions WHERE id = ?")
      .get(a.questionId) as
      | { id: string; subject: string; topic: string; type: "MCQ" | "THEORY"; answerKey: string; markingRubric: string }
      | undefined;
    if (!q) continue;
    let ok = 0;
    let score: number | null = null;
    if (q.type === "MCQ") {
      ok = (a.response ?? "").trim().toLowerCase() === q.answerKey.trim().toLowerCase() ? 1 : 0;
    } else {
      const g = gradeTheory(a.response ?? "", q.answerKey, q.markingRubric, language);
      score = g.score;
      ok = g.score >= 6 ? 1 : 0;
    }
    correct += ok;
    await db.prepare(
      "INSERT INTO attempts (id, user_id, question_id, response, correct, theory_score, feedback_json, credits_spent, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)"
    ).run(uid(), userId, q.id, a.response ?? "", ok, score, JSON.stringify({ pastPaper: true }), now);
    const t = (perTopic[q.topic] ??= { correct: 0, total: 0, subject: q.subject });
    t.correct += ok;
    t.total += 1;
  }

  const total = answers.length;
  return NextResponse.json({
    score: correct,
    total,
    pct: total ? Math.round((correct / total) * 100) : 0,
    topics: Object.entries(perTopic).map(([topic, v]) => ({
      topic, subject: v.subject, correct: v.correct, total: v.total,
      pct: Math.round((v.correct / v.total) * 100)
    }))
  });
}
