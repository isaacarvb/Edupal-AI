import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

const DIAGNOSTIC_CAP = 10;

// Next unattempted question, difficulty-adapted: 3 correct in a row → HARD,
// 2 wrong in a row → EASY, else MEDIUM. Tiers are derived per topic
// (first third EASY, middle MEDIUM, last HARD), so this works on any bank
// with zero data migration.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const subject = searchParams.get("subject");
  if (!userId || !subject) {
    return NextResponse.json({ error: "userId + subject required" }, { status: 400 });
  }
  const db = await getDb();
  const wallet = await db.prepare("SELECT plan FROM wallets WHERE user_id = ?").get(userId) as { plan: string } | undefined;
  const freeOnly = wallet?.plan !== "UNLIMITED";
  const done = await db
    .prepare(
      `SELECT COUNT(*) AS n FROM attempts a
       JOIN questions q ON q.id = a.question_id
       WHERE a.user_id = ? AND q.subject = ?`
    )
    .get(userId, subject) as { n: number };
  if (done.n >= DIAGNOSTIC_CAP) return NextResponse.json({ done: true, answered: done.n });

  const recent = await db
    .prepare(
      `SELECT a.correct AS correct FROM attempts a
       JOIN questions q ON q.id = a.question_id
       WHERE a.user_id = ? AND q.subject = ?
       ORDER BY a.created_at DESC LIMIT 3`
    )
    .all(userId, subject) as { correct: number }[];
  let target: "EASY" | "MEDIUM" | "HARD" = "MEDIUM";
  if (recent.length >= 3 && recent.every((r) => r.correct === 1)) target = "HARD";
  else if (recent.length >= 2 && recent.slice(0, 2).every((r) => r.correct === 0)) target = "EASY";

  const pick = async (tier: string) =>
    await db
      .prepare(
        `WITH ranked AS (
           SELECT id, exam, subject, topic, type, stem, options_json AS "optionsJson",
                  predicted_repeat AS "predictedRepeat", source,
                  ROW_NUMBER() OVER (PARTITION BY topic ORDER BY id) AS rn,
                  COUNT(*) OVER (PARTITION BY topic) AS n,
                  ROW_NUMBER() OVER (PARTITION BY subject ORDER BY stem) AS bank_idx
           FROM questions WHERE subject = ?
         ),
         tiered AS (
           SELECT *, CASE WHEN rn * 3 <= n THEN 'EASY'
                          WHEN rn * 3 <= n * 2 THEN 'MEDIUM'
                          ELSE 'HARD' END AS difficulty
           FROM ranked
         )
         SELECT id, exam, subject, topic, type, stem, "optionsJson", "predictedRepeat", difficulty
         FROM tiered
         WHERE difficulty = ? AND id NOT IN (SELECT question_id FROM attempts WHERE user_id = ?)
          ${freeOnly ? "AND bank_idx <= 10" : ""}
         ORDER BY CASE WHEN source = 'CURATED' THEN 0 ELSE 1 END, id
         LIMIT 1`
      )
      .get(subject, tier, userId);

  const q = (await pick(target)) ?? (await pick("MEDIUM")) ?? (await pick("EASY")) ?? (await pick("HARD"));
  if (!q) return NextResponse.json({ done: true, answered: done.n });
  return NextResponse.json({ done: false, answered: done.n, difficulty: target, question: q });
}
