import type { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";
import { QUESTIONS } from "./question-bank.mjs";

// Fills an empty bank (fresh serverless disks). No-op when questions exist.
export function ensureSeeded(db: DatabaseSync): void {
  const n = (db.prepare("SELECT COUNT(*) AS n FROM questions").get() as { n: number }).n;
  if (n > 0) return;
  const insert = db.prepare(
    `INSERT OR IGNORE INTO questions
     (id, exam, subject, topic, type, stem, options_json, answer_key, marking_rubric, source, predicted_repeat)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  for (const raw of QUESTIONS as Array<{
    exam: string; subject: string; topic: string; type: string; stem: string;
    options: string[]; answer: string; rubric: string; source: string; predicted: number;
  }>) {
    const q = raw;
    insert.run(
      randomUUID(), q.exam, q.subject, q.topic, q.type, q.stem,
      JSON.stringify(q.options), q.answer, q.rubric, q.source, q.predicted
    );
  }
}
