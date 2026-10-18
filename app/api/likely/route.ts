import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { groqChat, groqConfigured, type ChatMsg } from "@/lib/groq";

// Likely-questions trend workspace. Gated: unlocks ≤7 days before exam date.
// Evidence comes ONLY from real bank metadata (predicted flags, topic frequency,
// class-wide miss rates) — never invented years.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  const db = await getDb();
  const profile = await db.prepare('SELECT exam, exam_start AS "examStart", dates_confirmed AS "datesConfirmed" FROM profiles WHERE user_id = ?').get(userId) as
    | { exam: string; examStart: string | null; datesConfirmed: number | null }
    | undefined;
  const confirmed = Number(profile?.datesConfirmed ?? 1) !== 0;
  const start = confirmed ? profile?.examStart ?? null : null;
  const daysLeft = start ? Math.ceil((Date.parse(start) - Date.now()) / 86400000) : null;
  if (daysLeft !== null && daysLeft > 7) {
    return NextResponse.json({ locked: true, reason: "countdown", daysLeft, exam: profile?.exam });
  }

  // Evidence pack: predicted-repeat topics with bank depth + cohort miss rates.
  const examName = profile?.exam ?? "JAMB";
  const topics = await db
    .prepare(
      `SELECT q.subject AS subject, q.topic AS topic,
              SUM(CASE WHEN q.predicted_repeat = 1 THEN 1 ELSE 0 END) AS flagged,
              COUNT(*) AS bank,
              ROUND(AVG(CASE WHEN a.id IS NOT NULL THEN a.correct END) * 100) AS "cohortAcc"
       FROM questions q
       LEFT JOIN attempts a ON a.question_id = q.id
       WHERE q.exam = ?
       GROUP BY q.subject, q.topic
       ORDER BY flagged DESC, bank DESC`
    )
    .all(examName) as { subject: string; topic: string; flagged: number; bank: number; cohortAcc: number | null }[];
  const hot = topics.filter((t) => t.flagged > 0).slice(0, 8);
  const picks = (hot.length ? hot : topics.slice(0, 8)).map((t) => ({ subject: t.subject, topic: t.topic }));

  // Representative questions (flagged first, unattempted by this student preferred).
  const recs: { id: string; subject: string; topic: string; type: string; stem: string; optionsJson: string }[] = [];
  for (const p of picks) {
    const q = await db
      .prepare(
        `SELECT id, subject, topic, type, stem, options_json AS "optionsJson" FROM questions
         WHERE exam = ? AND subject = ? AND topic = ?
         AND id NOT IN (SELECT question_id FROM attempts WHERE user_id = ?)
         ORDER BY predicted_repeat DESC, id LIMIT 2`
      )
      .all(examName, p.subject, p.topic, userId) as { id: string; subject: string; topic: string; type: string; stem: string; optionsJson: string }[];
    recs.push(...q);
    if (recs.length >= 10) break;
  }

  // Groq writes the narrative from the evidence — facts stay ours.
  let analysis = "";
  let engine: "groq" | "local" = "local";
  const evidence = hot.map((t) => `${t.subject}/${t.topic}: ${t.flagged} likely-repeat flags in ${t.bank} banked questions`).join("; ");
  const countdown = daysLeft === null ? "whose exam dates are not yet confirmed" : `with ${Math.max(daysLeft, 0)} day(s) left`;
  if (groqConfigured() && hot.length) {
    const messages: ChatMsg[] = [{
      role: "system",
      content: `You are EduPal, a study-buddy tutor. A ${profile?.exam} candidate ${countdown}. Here is REAL bank evidence (do not invent years, numbers, or topics outside it): ${evidence}. In Simple English, 3–5 sentences: name the 2–3 highest-yield topics and one examiner trap per topic. Encouraging tone.`
    }, { role: "user", content: "What should I cram in my final week?" }];
    try {
      analysis = await groqChat(messages);
      engine = "groq";
    } catch {
      analysis = "";
    }
  }
  if (!analysis && hot.length) {
    analysis = `Final-week focus: ${hot.slice(0, 3).map((t) => `${t.topic} (${t.subject})`).join(", ")}. These carry the most likely-repeat flags in your bank — attempt each below, then discuss traps with the AI tutor.`;
  }

  return NextResponse.json({
    locked: false, daysLeft: daysLeft === null ? null : Math.max(daysLeft, 0), exam: profile?.exam,
    unconfirmed: daysLeft === null,
    analysis, engine, questions: recs.slice(0, 10)
  });
}
