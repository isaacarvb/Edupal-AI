// scripts/import-questions.mjs
// Import past-question CSVs into the questions table.
// Usage: node scripts/import-questions.mjs
//
// Reads docs/questions/*.csv, canonicalizes subject names to match
// lib/syllabus.ts, inserts with source = 'PAST_QUESTIONS'.
// Skips duplicates by stable stem hash (same ID = same question).
//
// Reads from DATABASE_URL (Postgres/Supabase) if set, else local dev.db.
// Exports importQuestions() for use by scripts/seed.mjs.

import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

// Load .env.local if DATABASE_URL not already in environment (plain Node.js
// doesn't auto-load env files like Next.js does)
if (!process.env.DATABASE_URL) {
  const envLocal = path.join(ROOT, ".env.local");
  if (fs.existsSync(envLocal)) {
    for (const line of fs.readFileSync(envLocal, "utf8").split(/\r?\n/)) {
      const m = line.match(/^([A-Z_]+)=(.*)$/);
      if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}

const CSV_DIR = path.join(ROOT, "docs", "questions");

// Canonical subject mapping -> syllabus.ts canonical names
// Covers JSS, SSS, and mixed CSV subject spellings.
const CANON_SUBJECT = {
  // JSS tier
  "english language": "English",
  english: "English",
  mathematics: "Mathematics",
  "physical & health education": "Physical Health Education",
  "physical health education": "Physical Health Education",
  "physical and health education": "Physical Health Education",
  "digital technologies": "Digital Technologies (Computer Studies/ICT)",
  "digital technologies (computer studies/ict)": "Digital Technologies (Computer Studies/ICT)",
  "business studies": "Business Studies",
  "basic science & technology": "Intermediate Science (Basic Science and Technology)",
  "basic science and technology": "Intermediate Science (Basic Science and Technology)",
  "intermediate science": "Intermediate Science (Basic Science and Technology)",
  "integrated science": "Intermediate Science (Basic Science and Technology)",
  "social studies": "Social and Citizenship Education",
  "social & citizenship education": "Social and Citizenship Education",
  "social and citizenship education": "Social and Citizenship Education",
  "nigerian history": "Nigerian History",
  // SSS tier
  "english": "English",
  "english language": "English",
  "literature in english": "Literature in English",
  "mathematics": "Mathematics",
  physics: "Physics",
  chemistry: "Chemistry",
  biology: "Biology",
  commerce: "Commerce",
  accounting: "Accounting",
  marketing: "Marketing",
  economics: "Economics",
  government: "Government",
  // Mixed CSV
  "citizenship education": "Social and Citizenship Education",
};

function canonicalSubject(raw) {
  const key = String(raw ?? "").trim().toLowerCase();
  return CANON_SUBJECT[key] ?? raw;
}

// Encoding cleanup: CSV files are UTF-8, but some older rows may carry
// mojibake from legacy sources. Clean the most common artifacts.
function cleanEncoding(text) {
  if (!text) return text;
  return String(text)
    // Multiplication: ×
    .replace(/A-/g, "×")
    // Squared: ²
    .replace(/A\uFFFD/g, "²")
    // Cubed: ³
    .replace(/A3/g, "³")
    // Square root: √
    .replace(/\uFFFD\^s/g, "√")
    // Pi: π
    .replace(/I\?/g, "π")
    // Ohms: Ω
    .replace(/Ic/g, "Ω")
    // Up/down arrows
    .replace(/\uFFFD\+'/g, "↑")
    .replace(/\uFFFD²/g, "↓")
    // Therefore: ∴
    .replace(/\uFFFD\?'/g, "∴")
    // Remove any remaining replacement chars
    .replace(/\uFFFD/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Simple CSV parser: handles quoted fields with embedded commas
function parseCSVLine(line) {
  const fields = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        fields.push(current);
        current = "";
      } else {
        current += ch;
      }
    }
  }
  fields.push(current);
  return fields;
}

function questionId(stem) {
  return `q-${createHash("sha256").update(stem).digest("hex").slice(0, 16)}`;
}

// Build a parsed row object from a CSV line
function buildRow(line) {
  const fields = parseCSVLine(line);
  if (fields.length < 10) return null;
  const [exam, year, rawSubject, rawTopic, type, stem, optionsStr, answer, rubric, predicted] = fields;
  const subject = canonicalSubject(rawSubject);
  const stemClean = cleanEncoding(stem);
  const topicClean = cleanEncoding(rawTopic);
  const answerClean = cleanEncoding(answer);
  const rubricClean = cleanEncoding(rubric);
  const options = optionsStr.split("|").map((o) => cleanEncoding(o.trim())).filter(Boolean);
  return {
    id: questionId(stemClean),
    exam,
    subject,
    topic: topicClean,
    type,
    stem: stemClean,
    options_json: JSON.stringify(options),
    answer_key: answerClean,
    marking_rubric: rubricClean,
    predicted_repeat: Number(predicted) || 0,
    rawSubject,
  };
}

export async function importQuestions(dbParam) {
  let db = dbParam;
  let pg = null;
  let ownDb = false;
  let isPg = false;

  if (!db) {
    if (process.env.DATABASE_URL) {
      const { Pool } = await import("pg");
      pg = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        max: 5,
      });
      isPg = true;
    } else {
      const { DatabaseSync } = await import("node:sqlite");
      const lite = new DatabaseSync(path.join(ROOT, "dev.db"));
      lite.exec("PRAGMA journal_mode = WAL;");
      const schema = fs.readFileSync(path.join(ROOT, "db", "schema.sql"), "utf8");
      lite.exec(schema);
      db = lite;
      ownDb = true;
    }
  }

  const files = [
    "JSS_past_questions.csv",
    "SSS_past_questions.csv",
    "past_questions.csv",
  ];

  let total = 0;
  let added = 0;
  let skipped = 0;
  const uncanonicalized = new Set();
  const perFile = {};

  for (const file of files) {
    const filePath = path.join(CSV_DIR, file);
    if (!fs.existsSync(filePath)) {
      console.log(`SKIP (not found): ${file}`);
      continue;
    }

    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split(/\r?\n/).filter((l) => l.trim());
    const dataLines = lines.slice(1);
    perFile[file] = dataLines.length;
    console.log(`\n📄 ${file}: ${dataLines.length} data rows`);

    // Build all parsed rows first
    const rows = [];
    for (const line of dataLines) {
      const row = buildRow(line);
      if (!row) {
        skipped++;
        continue;
      }
      total++;
      if (!CANON_SUBJECT[String(row.rawSubject ?? "").trim().toLowerCase()]) {
        uncanonicalized.add(row.rawSubject);
      }
      rows.push(row);
    }

    // Insert in batches for speed
    const BATCH = isPg ? 100 : 1;
    for (let i = 0; i < rows.length; i += BATCH) {
      const batch = rows.slice(i, i + BATCH);
      if (isPg) {
        const batchAdded = await insertBatchPg(pg, batch);
        added += batchAdded;
        skipped += batch.length - batchAdded;
      } else {
        for (const row of batch) {
          const r = await db.run(
            `INSERT INTO questions
             (id, exam, subject, topic, type, stem, options_json, answer_key, marking_rubric, source, predicted_repeat)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'PAST_QUESTIONS', ?)
             ON CONFLICT(id) DO NOTHING`,
            row.id, row.exam, row.subject, row.topic, row.type, row.stem,
            row.options_json, row.answer_key, row.marking_rubric, row.predicted_repeat
          );
          const changes = r.changes ?? r.rowCount ?? 0;
          if (changes > 0) added++;
          else skipped++;
        }
      }
    }
  }

  console.log(`\n✅ Import complete:`);
  console.log(`   ${added} added, ${skipped} skipped/duplicates, ${total} total processed`);
  console.log(`   Per file: ${Object.entries(perFile)
    .map(([f, n]) => `${f}: ${n}`)
    .join(", ")}`);

  if (uncanonicalized.size > 0) {
    console.log(`\n⚠️  Subjects NOT canonicalized (add to CANON_SUBJECT):`);
    for (const s of uncanonicalized) console.log(`   - "${s}"`);
  } else {
    console.log(`\n✅ All subjects canonicalized successfully.`);
  }

  if (pg) await pg.end();
  if (ownDb && db) {
    try { db.close(); } catch { /* sqlite close may not exist on all wrappers */ }
  }

  return { added, skipped, total };
}

async function insertBatchPg(pg, batch) {
  const values = [];
  const placeholders = [];
  let paramIdx = 1;

  for (const row of batch) {
    placeholders.push(
      `($${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, ` +
      `$${paramIdx++}, $${paramIdx++}, $${paramIdx++}, $${paramIdx++}, 'PAST_QUESTIONS', $${paramIdx++})`
    );
    values.push(
      row.id, row.exam, row.subject, row.topic, row.type, row.stem,
      row.options_json, row.answer_key, row.marking_rubric, row.predicted_repeat
    );
  }

  const sql = `INSERT INTO questions
    (id, exam, subject, topic, type, stem, options_json, answer_key, marking_rubric, source, predicted_repeat)
    VALUES ${placeholders.join(", ")}
    ON CONFLICT(id) DO NOTHING`;

  const r = await pg.query(sql, values);
  return r.rowCount ?? 0;
}

if (import.meta.main) {
  importQuestions().catch((e) => {
    console.error("FATAL:", e.message);
    process.exit(1);
  });
}
