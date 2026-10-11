// Owner-run question factory: Groq drafts from docs/notes files -> draft_questions (pending).
// Usage: node scripts/generate-questions.mjs --subject English [--per-topic 6] [--exam WAEC]
// Writes to Supabase when DATABASE_URL is set, else local dev.db. Review in /admin.
import { createHash, randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const ROOT = "C:/Users/Isaac Areo/OneDrive/Desktop/EduPal AI";
const args = Object.fromEntries(process.argv.slice(2).map((a, i, arr) => a.startsWith("--") ? [a.slice(2), arr[i + 1] && !arr[i + 1].startsWith("--") ? arr[i + 1] : "1"] : []).filter((x) => x.length));
const FILTER_SUBJECT = (args.subject || "").toLowerCase();
const FILTER_TOPIC = (args.topic || "").toLowerCase();
const PER_TOPIC = Math.min(Number(args["per-topic"] || 6), 10);
const EXAM = (args.exam || "WAEC").toUpperCase();

const GROQ_KEY = process.env.GROQ_API_KEY;
if (!GROQ_KEY) {
  console.error("GROQ_API_KEY missing — add it to .env.local first.");
  process.exit(1);
}
const MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

let db;
let pg = null;
if (process.env.DATABASE_URL) {
  const { Pool } = await import("pg");
  pg = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }, max: 2 });
  const tr = (sql) => {
    let i = 0;
    return sql.replace(/\?/g, () => `$${++i}`);
  };
  db = {
    get: async (sql, ...p) => (await pg.query(tr(sql), p)).rows[0],
    run: async (sql, ...p) => {
      await pg.query(tr(sql), p);
    }
  };
} else {
  const { DatabaseSync } = await import("node:sqlite");
  const lite = new DatabaseSync(path.join(ROOT, "dev.db"));
  lite.exec("PRAGMA journal_mode = WAL;");
  lite.exec(fs.readFileSync(path.join(ROOT, "db", "schema.sql"), "utf8"));
  db = {
    get: async (sql, ...p) => lite.prepare(sql).get(...p) ?? undefined,
    run: async (sql, ...p) => {
      lite.prepare(sql).run(...p);
    }
  };
}

async function groq(messages) {
  const models = [MODEL, "llama-3.3-70b-versatile", "openai/gpt-oss-120b"];
  let last = 0;
  for (const model of [...new Set(models)]) {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${GROQ_KEY}` },
      body: JSON.stringify({ model, messages, temperature: 0.5, max_tokens: 2000, response_format: { type: "json_object" } })
    });
    if (res.ok) {
      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content?.trim();
      if (text) return text;
      throw new Error("empty Groq reply");
    }
    last = res.status;
    console.error(`groq ${res.status} on ${model}`);
    if (res.status !== 400 && res.status !== 404) break;
  }
  throw new Error(`groq failed (${last})`);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const files = fs.readdirSync(path.join(ROOT, "docs", "notes")).filter((f) => f.startsWith("sss_") && f.endsWith(".json"));
let made = 0;
let skipped = 0;

for (const f of files) {
  const doc = JSON.parse(fs.readFileSync(path.join(ROOT, "docs", "notes", f), "utf8"));
  const subject = String(doc.subject || "").replace(/ language$/i, "").replace(/^literature in english$/i, "Literature").trim();
  const appSubject = /literature/i.test(subject) ? "Literature" : subject;
  if (FILTER_SUBJECT && appSubject.toLowerCase() !== FILTER_SUBJECT) continue;
  for (const t of doc.topics || []) {
    if (FILTER_TOPIC && String(t.topic || "").toLowerCase() !== FILTER_TOPIC) continue;
    const topic = t.topic;
    const note = String(t.content || "").slice(0, 3000);
    const prompt = `You write Nigerian secondary exam practice questions (WAEC/JAMB style) from this study note on "${topic}" (${appSubject}).\n\nNOTE:\n${note}\n\nReturn ONLY valid JSON: {"questions":[{"type":"MCQ"|"THEORY","stem":"...","options":["a","b","c","d"],"answer":"exact correct option text or model answer","rubric":"one-line marking note"}]} — exactly ${PER_TOPIC} questions, at most 1 THEORY. Rules: syllabus-aligned, one unambiguous answer, options similar length, no trick phrasing, plain English.`;
    let list;
    try {
      const raw = await groq([
        { role: "system", content: "You output only valid JSON matching the requested schema." },
        { role: "user", content: prompt }
      ]);
      const parsed = JSON.parse(raw);
      list = Array.isArray(parsed.questions) ? parsed.questions : [];
    } catch (e) {
      console.error(`skip ${appSubject}/${topic}:`, String(e).slice(0, 100));
      await sleep(2500);
      continue;
    }
    for (const q of list.slice(0, PER_TOPIC)) {
      if (!q || !q.stem || !q.answer) continue;
      const type = q.type === "THEORY" ? "THEORY" : "MCQ";
      const opts = type === "MCQ" ? (Array.isArray(q.options) ? q.options.filter(Boolean).slice(0, 4) : []) : [];
      if (type === "MCQ" && (opts.length < 2 || !opts.includes(q.answer))) continue;
      const id = "d-" + createHash("sha256").update(q.stem).digest("hex").slice(0, 16);
      const exists = await db.get("SELECT 1 FROM draft_questions WHERE id = ?", id);
      const dup = await db.get("SELECT 1 FROM questions WHERE stem = ?", q.stem);
      if (exists || dup) {
        skipped++;
        continue;
      }
      await db.run(
        "INSERT INTO draft_questions (id, exam, subject, topic, type, stem, options_json, answer_key, marking_rubric, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')",
        id, EXAM, appSubject, topic, type, q.stem, JSON.stringify(opts), q.answer, String(q.rubric || "")
      );
      made++;
    }
    console.log(`${appSubject} / ${topic}: staged (total made: ${made}, skipped dupes: ${skipped})`);
    await sleep(2500);
  }
}
console.log(`DONE — drafted: ${made}, skipped (dupes): ${skipped}. Review in /admin.`);
if (pg) await pg.end();
