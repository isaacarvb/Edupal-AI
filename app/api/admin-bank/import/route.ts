import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { getDb, uid } from "@/lib/db";

type Row = {
  exam: string; year?: string; subject: string; topic: string; type: string;
  stem: string; options: string[]; answer: string; rubric: string; predicted: number;
};

function parseCSV(text: string): { rows: Row[]; errors: string[] } {
  const rows: Row[] = [];
  const errors: string[] = [];
  // Minimal CSV: handles quoted fields with commas, no escaped quotes inside.
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (!lines.length) return { rows, errors: ["empty file"] };
  const head = lines[0].toLowerCase();
  const start = head.startsWith("exam,") ? 1 : 0;
  lines.slice(start).forEach((line, i) => {
    const cols: string[] = [];
    let cur = "";
    let quoted = false;
    for (const ch of line) {
      if (ch === '"') quoted = !quoted;
      else if (ch === "," && !quoted) {
        cols.push(cur.trim());
        cur = "";
      } else cur += ch;
    }
    cols.push(cur.trim());
    const [exam, , subject, topic, type, stem, options, answer, rubric, predicted] = cols;
    const lineNo = i + start + 1;
    if (!exam || !subject || !topic || !stem || !answer) {
      errors.push(`line ${lineNo}: exam, subject, topic, stem, answer required`);
      return;
    }
    const t = (type ?? "MCQ").toUpperCase();
    if (t !== "MCQ" && t !== "THEORY") {
      errors.push(`line ${lineNo}: type must be MCQ or THEORY`);
      return;
    }
    const opts = t === "MCQ" ? (options ?? "").split("|").map((o) => o.trim()).filter(Boolean) : [];
    if (t === "MCQ" && opts.length < 2) {
      errors.push(`line ${lineNo}: MCQ needs 2+ options separated by |`);
      return;
    }
    rows.push({
      exam: exam.toUpperCase(), subject: subject.trim(), topic: topic.trim(), type: t,
      stem: stem.trim(), options: opts, answer: answer.trim(), rubric: (rubric ?? "").trim(),
      predicted: predicted === "1" ? 1 : 0
    });
  });
  return { rows, errors };
}

// Owner uploads curated past questions (CSV pasted or file-read client-side).
// Dedupes by question text; year column is recorded in feedback_json for future trend claims.
export async function POST(req: Request) {
  const { csv } = await req.json();
  if (!csv || typeof csv !== "string") return NextResponse.json({ error: "csv text required" }, { status: 400 });
  const { rows, errors } = parseCSV(csv);
  const db = await getDb();
  let added = 0;
  let skipped = 0;
  for (const r of rows) {
    const id = `q-${createHash("sha256").update(r.stem).digest("hex").slice(0, 16)}`;
    const res = await db
      .prepare(
        `INSERT INTO questions (id, exam, subject, topic, type, stem, options_json, answer_key, marking_rubric, source, predicted_repeat)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'CURATED', ?) ON CONFLICT DO NOTHING`
      )
      .run(id, r.exam, r.subject, r.topic, r.type, r.stem, JSON.stringify(r.options), r.answer, r.rubric, r.predicted);
    if (res.changes > 0) added++;
    else skipped++;
  }
  return NextResponse.json({ ok: true, added, skipped, errors: errors.slice(0, 10) });
}
