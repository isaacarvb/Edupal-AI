import { NextResponse } from "next/server";
import { getDb, uid } from "@/lib/db";
import { explainAnswer, gradeTheory, type TheoryGrade } from "@/lib/ai";
import { getWallet, getSubjectLeft, consumeSubject } from "@/lib/credits";
import { todayQuestion } from "@/lib/qotd";
import { consumeBonus } from "@/lib/referral";

const COST = { MCQ: 1, THEORY: 3 } as const;

function labelFor(acc: number): "WEAK" | "NEEDS_WORK" | "STRONG" {
  if (acc >= 75) return "STRONG";
  if (acc >= 50) return "NEEDS_WORK";
  return "WEAK";
}

// Grades an answer, spends credits, updates mastery + streak.
export async function POST(req: Request) {
  const { userId, questionId, response, timed, secondsUsed, qotd } = await req.json();
  if (!userId || !questionId) {
    return NextResponse.json({ error: "userId + questionId required" }, { status: 400 });
  }
  const db = await getDb();
  const q = await db
    .prepare('SELECT id, subject, topic, type, stem, answer_key AS "answerKey", marking_rubric AS "markingRubric" FROM questions WHERE id = ?')
    .get(questionId) as
    | { id: string; subject: string; topic: string; type: "MCQ" | "THEORY"; stem: string; answerKey: string; markingRubric: string }
    | undefined;
  if (!q) return NextResponse.json({ error: "unknown question" }, { status: 404 });

  const cost = COST[q.type];
  // Idempotency: ignore accidental double-submits (double-clicks) within 60s.
  const minuteAgo = new Date(Date.now() - 60000).toISOString();
  const dupe = await db
    .prepare("SELECT id FROM attempts WHERE user_id = ? AND question_id = ? AND created_at >= ? LIMIT 1")
    .get(userId, questionId, minuteAgo);
  if (dupe) return NextResponse.json({ error: "already answered", duplicate: true }, { status: 409 });
  const wallet = await getWallet(db, userId);
  // Question of the Day bypasses the counter — but only today's real pick.
  const isQotd = !!qotd && (await todayQuestion(db))?.id === questionId;
  // Per-subject daily free limits (UNLIMITED bypasses). Other subjects stay open.
  // Referral bonus covers the cost when the subject budget is out (capped daily).
  let usedBonus = false;
  if (!isQotd && wallet && wallet.plan === "FREE" && await getSubjectLeft(db, userId, q.subject, "FREE") < cost) {
    if (await consumeBonus(db, userId, cost)) {
      usedBonus = true;
    } else {
      return NextResponse.json(
        { error: "subject limit reached", subjectLimit: true, subject: q.subject, creditsLeft: 0 },
        { status: 402 }
      );
    }
  }
  if (!wallet) {
    return NextResponse.json({ error: "no wallet", creditsLeft: 0 }, { status: 402 });
  }

  const profile = await db.prepare("SELECT language FROM profiles WHERE user_id = ?").get(userId) as
    | { language: "SIMPLE" | "PIDGIN" }
    | undefined;
  const language = profile?.language ?? "SIMPLE";

  let correct = 0;
  let theoryScore: number | null = null;
  let theory: TheoryGrade | null = null;
  let feedback: string;
  if (q.type === "MCQ") {
    correct = (response ?? "").trim().toLowerCase() === q.answerKey.trim().toLowerCase() ? 1 : 0;
    feedback = await explainAnswer({
      subject: q.subject, topic: q.topic, question: q.stem, answer: response ?? "",
      correctAnswer: q.answerKey, rubric: q.markingRubric, wasCorrect: Boolean(correct), language
    });
  } else {
    theory = gradeTheory(response ?? "", q.answerKey, q.markingRubric, language);
    theoryScore = theory.score;
    correct = theory.score >= 6 ? 1 : 0;
    feedback = `${theory.score}/${theory.maxScore} — ${theory.hits.length} point(s) hit, ${theory.misses.length} missed.`;
  }

  const now = new Date().toISOString();
  const today = now.slice(0, 10);
  await db.prepare(
    "INSERT INTO attempts (id, user_id, question_id, response, correct, theory_score, feedback_json, credits_spent, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).run(uid(), userId, questionId, response ?? "", correct, theoryScore, JSON.stringify({ feedback, theory, timed: !!timed, secondsUsed: secondsUsed ?? null, qotd: isQotd, usedBonus }), wallet.plan === "FREE" && !isQotd && !usedBonus ? cost : 0, now);
  if (wallet.plan === "FREE" && !isQotd && !usedBonus) {
    await consumeSubject(db, userId, q.subject, cost);
  }

  // Recompute mastery: accuracy + consecutive-correct level-up + hysteresis.
  const rows = await db
    .prepare(
      `SELECT a.correct AS correct FROM attempts a
       JOIN questions qq ON qq.id = a.question_id
       WHERE a.user_id = ? AND qq.subject = ? AND qq.topic = ?`
    )
    .all(userId, q.subject, q.topic) as { correct: number }[];
  const acc = rows.length ? (rows.reduce((s, r) => s + r.correct, 0) / rows.length) * 100 : 0;
  const prev = await db
    .prepare("SELECT label, consecutive_correct AS consec, overridden FROM topic_mastery WHERE user_id = ? AND subject = ? AND topic = ?")
    .get(userId, q.subject, q.topic) as
    | { label: "WEAK" | "NEEDS_WORK" | "STRONG"; consec: number; overridden: number }
    | undefined;
  const consec = correct ? (prev?.consec ?? 0) + 1 : 0;
  // STRONG needs 75%+ AND 3 in a row; hysteresis keeps STRONG above 65%.
  let label = labelFor(acc);
  if (label === "STRONG" && !(acc >= 75 && consec >= 3)) label = acc >= 50 ? "NEEDS_WORK" : "WEAK";
  if (prev?.label === "STRONG" && acc >= 65 && label === "NEEDS_WORK") label = "STRONG";
  if (prev?.overridden) label = prev.label; // manual override sticks
  const rank = { WEAK: 0, NEEDS_WORK: 1, STRONG: 2 } as const;
  const leveledUp = !!prev && rank[label] > rank[prev.label];
  await db.prepare(
    `INSERT INTO topic_mastery (id, user_id, subject, topic, accuracy, label, streak_count, consecutive_correct, overridden, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(user_id, subject, topic)
     DO UPDATE SET accuracy = excluded.accuracy, label = excluded.label,
       streak_count = topic_mastery.streak_count + ?, consecutive_correct = excluded.consecutive_correct,
       updated_at = excluded.updated_at`
  ).run(uid(), userId, q.subject, q.topic, acc, label, correct, consec, prev?.overridden ?? 0, now, correct);

  // Streak: +1 per active day; a missed day consumes the monthly freeze instead of resetting.
  const st = await db.prepare('SELECT "current", longest, last_study_date AS last, freeze_available AS freeze FROM streaks WHERE user_id = ?').get(userId) as
    | { current: number; longest: number; last: string | null; freeze: number }
    | undefined;
  let freezeUsed = false;
  if (st && st.last?.slice(0, 10) !== today) {
    const lastDay = st.last ? st.last.slice(0, 10) : null;
    const month = today.slice(0, 7);
    let freeze = st.freeze;
    if (freeze === 0 && lastDay?.slice(0, 7) !== month) freeze = 1; // monthly restore
    let current: number;
    if (!lastDay) {
      current = 1;
    } else {
      const gap = Math.round((Date.parse(today) - Date.parse(lastDay)) / 86400000);
      if (gap <= 1) {
        current = st.current + 1;
      } else if (freeze === 1) {
        freeze = 0;
        freezeUsed = true;
        current = st.current + 1; // freeze bridges the gap
      } else {
        current = 1; // streak lost
      }
    }
    const longest = Math.max(st.longest, current);
    await db.prepare('UPDATE streaks SET "current" = ?, longest = ?, last_study_date = ?, freeze_available = ? WHERE user_id = ?').run(
      current,
      longest,
      now,
      freeze,
      userId
    );
  }

  const creditsLeft = wallet.plan === "UNLIMITED" ? wallet.creditsLeft : await getSubjectLeft(db, userId, q.subject, "FREE");
  return NextResponse.json({
    correct: Boolean(correct),
    correctAnswer: q.answerKey,
    feedback,
    theory,
    creditsLeft,
    leveledUp,
    freezeUsed,
    usedBonus,
    subject: q.subject,
    mastery: { subject: q.subject, topic: q.topic, accuracy: Math.round(acc), label }
  });
}
