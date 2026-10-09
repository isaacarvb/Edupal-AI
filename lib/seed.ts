import { createHash } from "node:crypto";
import { QUESTIONS } from "./question-bank.mjs";

// Stable IDs = sha256(stem), so every fresh disk seeds IDENTICAL rows.
// (Random IDs broke serverless: instance A served a question instance B never saw.)
export function questionId(stem: string): string {
  return `q-${createHash("sha256").update(stem).digest("hex").slice(0, 16)}`;
}

// Fills an empty bank (fresh disks). No-op when questions exist.
export async function ensureSeeded(db: { prepare: (sql: string) => { get: (...p: unknown[]) => Promise<unknown>; run: (...p: unknown[]) => Promise<unknown> } }): Promise<void> {
  const row = (await db.prepare("SELECT COUNT(*) AS n FROM questions").get()) as { n: number };
  if (Number(row.n) > 0) return;
  const insert = await db.prepare(
    `INSERT INTO questions
     (id, exam, subject, topic, type, stem, options_json, answer_key, marking_rubric, source, predicted_repeat)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT DO NOTHING`
  );
  for (const raw of QUESTIONS as Array<{
    exam: string; subject: string; topic: string; type: string; stem: string;
    options: string[]; answer: string; rubric: string; source: string; predicted: number;
  }>) {
    const q = raw;
    await insert.run(
      questionId(q.stem), q.exam, q.subject, q.topic, q.type, q.stem,
      JSON.stringify(q.options), q.answer, q.rubric, q.source, q.predicted
    );
  }
}
