// Repair legacy MCQ rows whose options were stored character-by-character.
//
// Some rows in docs/questions/SSS_past_questions.csv look like this:
//   F|i|l|t|r|a|t|i|o|n|||M|a|g|n|e|t|i|s|m
// The importer's normal "|" split turned that into an array of single letters.
// This script rebuilds the real options in the CSV and updates only the
// affected rows in the database.
//
// Usage:
//   node scripts/repair-question-options.mjs           # dry run (report only)
//   node scripts/repair-question-options.mjs --apply   # fix CSV + database
//   node scripts/repair-question-options.mjs --csv     # fix CSV only
//   node scripts/repair-question-options.mjs --db      # fix database only
//
// Reads DATABASE_URL (Postgres/Supabase) if set, else local dev.db.

import fs from "node:fs";
import path from "node:path";
import { buildRow, normalizeOptionsString } from "./import-questions.mjs";

const ROOT = process.cwd();
const CSV_DIR = path.join(ROOT, "docs", "questions");
const FILES = [
  "JSS_past_questions.csv",
  "SSS_past_questions.csv",
  "past_questions.csv",
  "supplementary_questions.csv"
];

const args = new Set(process.argv.slice(2));
const apply = args.has("--apply");
const csvOnly = args.has("--csv");
const dbOnly = args.has("--db");
const doCsv = !dbOnly;
const doDb = !csvOnly;

// Split a CSV line into fields while remembering each field's byte offsets, so
// we can replace only the options column and leave the rest of the line alone.
function parseFieldsWithOffsets(line) {
  const fields = [];
  let current = "";
  let inQuotes = false;
  let start = 0;
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
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      fields.push({ value: current, start, end: i });
      current = "";
      start = i + 1;
    } else {
      current += ch;
    }
  }
  fields.push({ value: current, start, end: line.length });
  return fields;
}

function csvEscape(value) {
  return /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

function repairCsv() {
  let changed = 0;
  const byFile = {};
  for (const file of FILES) {
    const filePath = path.join(CSV_DIR, file);
    if (!fs.existsSync(filePath)) continue;
    const lines = fs.readFileSync(filePath, "utf8").split("\n");
    let fileChanged = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const cr = line.endsWith("\r") ? "\r" : "";
      const body = cr ? line.slice(0, -1) : line;
      if (!body.trim()) continue;
      const fields = parseFieldsWithOffsets(body);
      if (fields.length < 7) continue;
      const rawOptions = fields[6].value;
      const fixed = normalizeOptionsString(rawOptions);
      if (fixed === rawOptions) continue;
      lines[i] = body.slice(0, fields[6].start) + csvEscape(fixed) + body.slice(fields[6].end) + cr;
      fileChanged++;
    }
    if (fileChanged) {
      byFile[file] = fileChanged;
      changed += fileChanged;
      if (apply) fs.writeFileSync(filePath, lines.join("\n"), "utf8");
    }
  }
  return { changed, byFile };
}

function isCharSplit(json) {
  let opts;
  try {
    opts = JSON.parse(json);
  } catch {
    return false;
  }
  return Array.isArray(opts) && opts.length > 10 && opts.every((o) => typeof o === "string" && o.length <= 2);
}

function expectedOptions() {
  const map = new Map();
  for (const file of FILES) {
    const filePath = path.join(CSV_DIR, file);
    if (!fs.existsSync(filePath)) continue;
    const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/).filter((l) => l.trim());
    for (const line of lines.slice(1)) {
      const row = buildRow(line);
      if (row) map.set(row.id, row.options_json);
    }
  }
  return map;
}

async function repairDb() {
  const expected = expectedOptions();
  const usePg = !!process.env.DATABASE_URL;
  let rows;
  let applyUpdates;
  let close;

  if (usePg) {
    const { Client } = await import("pg");
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    await client.connect();
    rows = (await client.query("SELECT id, subject, options_json FROM questions WHERE type = 'MCQ'")).rows;
    applyUpdates = async (updates) => {
      // One round trip instead of thousands of individual UPDATEs, which is far
      // too slow against a remote Postgres/Supabase instance.
      await client.query(
        `UPDATE questions AS q
            SET options_json = v.options_json
           FROM (SELECT unnest($1::text[]) AS id,
                        unnest($2::text[]) AS options_json) AS v
          WHERE q.id::text = v.id`,
        [updates.map((u) => u.id), updates.map((u) => u.optionsJson)]
      );
      return (await client.query("SELECT id, options_json FROM questions WHERE type = 'MCQ'")).rows;
    };
    close = () => client.end();
  } else {
    const { DatabaseSync } = await import("node:sqlite");
    const db = new DatabaseSync(path.join(ROOT, process.env.DB_FILE ?? "dev.db"));
    rows = db.prepare("SELECT id, subject, options_json FROM questions WHERE type = 'MCQ'").all();
    applyUpdates = async (updates) => {
      const stmt = db.prepare("UPDATE questions SET options_json = ? WHERE id = ?");
      db.exec("BEGIN");
      for (const u of updates) stmt.run(u.optionsJson, u.id);
      db.exec("COMMIT");
      return db.prepare("SELECT id, options_json FROM questions WHERE type = 'MCQ'").all();
    };
    close = () => db.close();
  }

  const corrupted = rows.filter((r) => isCharSplit(r.options_json));
  const bySubject = {};
  const updates = [];
  const missing = [];
  for (const r of corrupted) {
    bySubject[r.subject] = (bySubject[r.subject] ?? 0) + 1;
    const fixed = expected.get(r.id);
    if (fixed) updates.push({ id: r.id, optionsJson: fixed });
    else missing.push(r.id);
  }

  console.log(`\nDatabase (${usePg ? "Postgres" : "SQLite"}):`);
  console.log(`  MCQ rows: ${rows.length}`);
  console.log(`  corrupted rows found: ${corrupted.length}`);
  console.log(`  fixable from CSV: ${updates.length}`);
  console.log(`  no CSV match: ${missing.length}`);
  console.log(`  by subject: ${JSON.stringify(bySubject)}`);

  if (!apply) {
    console.log("  dry run — pass --apply to write these updates");
    await close();
    return { corrupted: corrupted.length, updated: 0 };
  }

  if (updates.length) {
    const after = await applyUpdates(updates);
    const remaining = after.filter((r) => isCharSplit(r.options_json)).length;
    console.log(`  updated: ${updates.length}`);
    console.log(`  remaining corrupted: ${remaining}`);
    await close();
    return { corrupted: corrupted.length, updated: updates.length, remaining };
  }

  await close();
  return { corrupted: corrupted.length, updated: 0 };
}

if (doCsv) {
  const result = repairCsv();
  console.log(`\nCSV files:`);
  console.log(`  rows to repair: ${result.changed}`);
  console.log(`  by file: ${JSON.stringify(result.byFile)}`);
  console.log(apply ? "  written" : "  dry run — pass --apply to write these changes");
}

if (doDb) {
  await repairDb();
}
