import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { getDb } from "@/lib/db";
import { requireAdmin, adminIdFrom, logAudit } from "@/lib/admin";

// GET ?subject=&exam=&q=&limit=50 — paged question list for editing.
// POST — create {exam,subject,topic,type,stem,options,answer,rubric}
// PUT — update {id, ...fields}
// DELETE ?id=&adminId=
export async function GET(req: Request) {
  try {
    await requireAdmin(adminIdFrom(req));
  } catch {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const u = new URL(req.url);
  const subject = u.searchParams.get("subject") ?? "";
  const exam = u.searchParams.get("exam") ?? "";
  const q = (u.searchParams.get("q") ?? "").toLowerCase();
  const limit = Math.min(Number(u.searchParams.get("limit") ?? 50) || 50, 200);
  const db = await getDb();
  let rows = (await db
    .prepare('SELECT id, exam, subject, topic, type, stem, options_json AS "optionsJson", answer_key AS "answerKey", marking_rubric AS "markingRubric", source FROM questions ORDER BY subject, topic LIMIT 500')
    .all()) as Array<Record<string, unknown>>;
  if (subject) rows = rows.filter((r) => r.subject === subject);
  if (exam) rows = rows.filter((r) => r.exam === exam);
  if (q) rows = rows.filter((r) => String(r.stem ?? "").toLowerCase().includes(q) || String(r.topic ?? "").toLowerCase().includes(q));
  return NextResponse.json({ questions: rows.slice(0, limit), total: rows.length });
}

function qid(stem: string): string {
  return `q-${createHash("sha256").update(stem).digest("hex").slice(0, 16)}`;
}

export async function POST(req: Request) {
  const b = await req.json();
  try {
    await requireAdmin(b?.adminId ?? adminIdFrom(req));
  } catch {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const { exam, subject, topic, type, stem, options, answer, rubric } = b;
  if (!exam || !subject || !topic || !stem || !answer) return NextResponse.json({ error: "exam, subject, topic, stem, answer required" }, { status: 400 });
  const t = String(type ?? "MCQ").toUpperCase();
  const db = await getDb();
  const id = b.id ?? qid(String(stem) + Date.now());
  await db
    .prepare("INSERT INTO questions (id, exam, subject, topic, type, stem, options_json, answer_key, marking_rubric, source, predicted_repeat) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'CURATED', 0) ON CONFLICT DO NOTHING")
    .run(id, String(exam).toUpperCase(), subject, topic, t, String(stem).trim(), JSON.stringify(options ?? []), answer, rubric ?? "");
  await logAudit(db, b?.adminId, "question:create", id);
  return NextResponse.json({ ok: true, id });
}

export async function PUT(req: Request) {
  const b = await req.json();
  try {
    await requireAdmin(b?.adminId ?? adminIdFrom(req));
  } catch {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (!b?.id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const db = await getDb();
  await db
    .prepare("UPDATE questions SET exam = ?, subject = ?, topic = ?, type = ?, stem = ?, options_json = ?, answer_key = ?, marking_rubric = ? WHERE id = ?")
    .run(String(b.exam ?? "").toUpperCase(), b.subject ?? "", b.topic ?? "", String(b.type ?? "MCQ").toUpperCase(), b.stem ?? "", JSON.stringify(b.options ?? []), b.answer ?? b.answerKey ?? "", b.rubric ?? b.markingRubric ?? "", b.id);
  await logAudit(db, b?.adminId, "question:update", b.id);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const u = new URL(req.url);
  const id = u.searchParams.get("id");
  const adminId = u.searchParams.get("adminId") ?? adminIdFrom(req);
  try {
    await requireAdmin(adminId);
  } catch {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const db = await getDb();
  await db.prepare("DELETE FROM questions WHERE id = ?").run(id);
  await logAudit(db, adminId, "question:delete", id);
  return NextResponse.json({ ok: true });
}
