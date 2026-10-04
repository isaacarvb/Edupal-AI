import { randomUUID } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { QUESTIONS } from "../lib/question-bank.mjs";

// Self-contained (no TS imports): opens ./dev.db, applies db/schema.sql, seeds shared bank.
const root = process.cwd();
const db = new DatabaseSync(path.join(root, process.env.DB_FILE ?? "dev.db"));
db.exec("PRAGMA journal_mode = WAL;");
db.exec(fs.readFileSync(path.join(root, "db", "schema.sql"), "utf8"));

const insert = db.prepare(
  `INSERT OR IGNORE INTO questions
   (id, exam, subject, topic, type, stem, options_json, answer_key, marking_rubric, source, predicted_repeat)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
);

let added = 0;
for (const q of QUESTIONS) {
  const r = insert.run(
    randomUUID(), q.exam, q.subject, q.topic, q.type, q.stem,
    JSON.stringify(q.options), q.answer, q.rubric, q.source, q.predicted
  );
  added += Number(r.changes);
}
console.log(`Seed done: ${added} new question(s).`);
db.close();
