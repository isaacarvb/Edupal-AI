import { randomUUID } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

// Self-contained (no TS imports): opens ./dev.db, applies db/schema.sql, seeds 2 curated questions.
const root = process.cwd();
const db = new DatabaseSync(path.join(root, process.env.DB_FILE ?? "dev.db"));
db.exec("PRAGMA journal_mode = WAL;");
db.exec(fs.readFileSync(path.join(root, "db", "schema.sql"), "utf8"));

const seed = [
  {
    exam: "JAMB", subject: "Mathematics", topic: "Quadratic equations", type: "MCQ",
    stem: "Solve: x^2 - 5x + 6 = 0",
    options: ["2, 3", "1, 6", "-2, -3", "5, 6"],
    answer: "2, 3", rubric: "Factorise to (x-2)(x-3).", source: "CURATED", predicted: 1
  },
  {
    exam: "WAEC", subject: "English", topic: "Comprehension", type: "MCQ",
    stem: "Choose the correctly spelt word.",
    options: ["Occassion", "Occasion", "Ocassion", "Ocasion"],
    answer: "Occasion", rubric: "Standard spelling.", source: "CURATED", predicted: 0
  }
];

const insert = db.prepare(
  `INSERT OR IGNORE INTO questions
   (id, exam, subject, topic, type, stem, options_json, answer_key, marking_rubric, source, predicted_repeat)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
);

let added = 0;
for (const q of seed) {
  const r = insert.run(
    randomUUID(), q.exam, q.subject, q.topic, q.type, q.stem,
    JSON.stringify(q.options), q.answer, q.rubric, q.source, q.predicted
  );
  added += Number(r.changes);
}
console.log(`Seed done: ${added} new question(s).`);
db.close();
