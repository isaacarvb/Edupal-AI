import { NextResponse } from "next/server";
import { getDb, uid } from "@/lib/db";
import { explainAnswer, gradeTheory, type TheoryGrade } from "@/lib/ai";

const COST = { MCQ: 1, THEORY: 3 } as const;

function labelFor(acc: number): "WEAK" | "NEEDS_WORK" | "STRONG" {
  if (acc >= 80) return "STRONG";
  if (acc >= 50) return "NEEDS_WORK";
  return "WEAK";
}

// Grades an answer, spends credits, updates mastery + streak.
export async function POST(req: Request) {
  const { userId, questionId, response } = await req.json();
  if (!userId || !questionId) {
    return NextResponse.json({ error: "userId + questionId required" }, { status: 400 });
  }
  const db = getDb();
  const q = db
    .prepare("SELECT id, subject, topic, type, stem, answer_key AS answerKey, marking_rubric AS markingRubric FROM questions WHERE id = ?")
    .get(questionId) as
    | { id: string; subject: string; topic: string; type: "MCQ" | "THEORY"; stem: string; answerKey: string; markingRubric: string }
    | undefined;
  if (!q) return NextResponse.json({ error: "unknown question" }, { status: 404 });

  const cost = COST[q.type];
  const wallet = db.prepare("SELECT credits_left AS left FROM wallets WHERE user_id = ?").get(userId) as
    | { left: number }
    | undefined;
  if (!wallet || wallet.left < cost) {
    return NextResponse.json({ error: "credits exhausted", creditsLeft: wallet?.left ?? 0 }, { status: 402 });
  }

  const profile = db.prepare("SELECT language FROM profiles WHERE user_id = ?").get(userId) as
    | { language: "SIMPLE" | "PIDGIN" }
    | undefined;
  const language = profile?.language ?? "SIMPLE";

  let correct = 0;
  let theoryScore: number | null = null;
  let theory: TheoryGrade | null = null;
  let feedback: string;
  if (q.type === "MCQ") {
    correct = (response ?? "").trim().toLowerCase() === q.answerKey.trim().toLowerCase() ? 1 : 0;
    feedback = await explainAnswer({ subject: q.subject, question: q.stem, answer: response ?? "", language });
  } else {
    theory = gradeTheory(response ?? "", q.answerKey, q.markingRubric, language);
    theoryScore = theory.score;
    correct = theory.score >= 6 ? 1 : 0;
    feedback = `${theory.score}/${theory.maxScore} — ${theory.hits.length} point(s) hit, ${theory.misses.length} missed.`;
  }

  const now = new Date().toISOString();
  const today = now.slice(0, 10);
  db.prepare(
    "INSERT INTO attempts (id, user_id, question_id, response, correct, theory_score, feedback_json, credits_spent, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).run(uid(), userId, questionId, response ?? "", correct, theoryScore, JSON.stringify({ feedback, theory }), cost, now);
  db.prepare("UPDATE wallets SET credits_left = credits_left - ? WHERE user_id = ?").run(cost, userId);

  // Recompute mastery from all attempts on this topic.
  const rows = db
    .prepare(
      `SELECT a.correct AS correct FROM attempts a
       JOIN questions qq ON qq.id = a.question_id
       WHERE a.user_id = ? AND qq.subject = ? AND qq.topic = ?`
    )
    .all(userId, q.subject, q.topic) as { correct: number }[];
  const acc = rows.length ? (rows.reduce((s, r) => s + r.correct, 0) / rows.length) * 100 : 0;
  const label = labelFor(acc);
  db.prepare(
    `INSERT INTO topic_mastery (id, user_id, subject, topic, accuracy, label, streak_count, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(user_id, subject, topic)
     DO UPDATE SET accuracy = excluded.accuracy, label = excluded.label,
       streak_count = topic_mastery.streak_count + ?, updated_at = excluded.updated_at`
  ).run(uid(), userId, q.subject, q.topic, acc, label, correct, now, correct);

  // Streak: +1 per active day.
  const st = db.prepare("SELECT current, longest, last_study_date AS last FROM streaks WHERE user_id = ?").get(userId) as
    | { current: number; longest: number; last: string | null }
    | undefined;
  if (st && st.last?.slice(0, 10) !== today) {
    const current = st.current + 1;
    db.prepare("UPDATE streaks SET current = ?, longest = MAX(longest, ?), last_study_date = ? WHERE user_id = ?").run(
      current,
      current,
      now,
      userId
    );
  }

  const creditsLeft = (wallet.left - cost);
  return NextResponse.json({
    correct: Boolean(correct),
    correctAnswer: q.answerKey,
    feedback,
    theory,
    creditsLeft,
    mastery: { subject: q.subject, topic: q.topic, accuracy: Math.round(acc), label }
  });
}
