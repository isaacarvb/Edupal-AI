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
  },
  // NOTE: below are AI-template placeholders (source AI). Replace with licensed
  // real past questions before the pilot. Same shape, so no code changes needed.
  {
    exam: "JAMB", subject: "Mathematics", topic: "Linear equations", type: "MCQ",
    stem: "If 3x + 5 = 20, find x.",
    options: ["3", "5", "7", "15"],
    answer: "5", rubric: "3x = 15, so x = 5.", source: "AI", predicted: 1
  },
  {
    exam: "JAMB", subject: "Mathematics", topic: "Percentages", type: "MCQ",
    stem: "What is 20% of 250?",
    options: ["25", "40", "50", "75"],
    answer: "50", rubric: "0.20 x 250 = 50.", source: "AI", predicted: 1
  },
  {
    exam: "WAEC", subject: "Mathematics", topic: "Quadratic equations", type: "THEORY",
    stem: "Solve x^2 - 5x + 6 = 0 by factorisation, showing all steps.",
    options: [], answer: "(x-2)(x-3) = 0, so x = 2 or x = 3",
    rubric: "Correct factors (2), correct solutions (2).", source: "AI", predicted: 0
  },
  {
    exam: "WAEC", subject: "English", topic: "Synonyms", type: "MCQ",
    stem: "Choose the word nearest in meaning to BRAVE.",
    options: ["Timid", "Courageous", "Weak", "Gentle"],
    answer: "Courageous", rubric: "Brave = showing courage.", source: "AI", predicted: 0
  },
  {
    exam: "JAMB", subject: "English", topic: "Antonyms", type: "MCQ",
    stem: "Choose the word opposite in meaning to SCARCE.",
    options: ["Rare", "Abundant", "Costly", "Little"],
    answer: "Abundant", rubric: "Scarce = in short supply; opposite is abundant.", source: "AI", predicted: 1
  },
  {
    exam: "WAEC", subject: "English", topic: "Tenses", type: "MCQ",
    stem: "She ___ to school every day.",
    options: ["go", "goes", "going", "gone"],
    answer: "goes", rubric: "Third-person singular present takes -s.", source: "AI", predicted: 0
  },
  {
    exam: "JAMB", subject: "English", topic: "Comprehension", type: "THEORY",
    stem: "In two sentences, explain the main idea of a passage about exam preparation.",
    options: [], answer: "Model answer: preparation beats cramming; targeted practice fixes weak topics.",
    rubric: "Main idea stated (2), supporting detail (2).", source: "AI", predicted: 0
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
