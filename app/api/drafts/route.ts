import { NextResponse } from "next/server";
import { getDb, uid } from "@/lib/db";

// Owner review queue for AI-drafted questions (hybrid factory).
// GET lists pending grouped by subject; POST approves/rejects by id.
export async function GET() {
  const db = await getDb();
  const rows = await db
    .prepare("SELECT id, exam, subject, topic, type, stem, options_json AS \"optionsJson\", answer_key AS \"answerKey\", marking_rubric AS \"markingRubric\", status FROM draft_questions ORDER BY subject, topic")
    .all();
  const pending = rows.filter((r) => r.status === "pending");
  return NextResponse.json({ pending, total: rows.length });
}

export async function POST(req: Request) {
  const { ids, action } = await req.json() as { ids: string[]; action: "approve" | "reject" };
  if (!Array.isArray(ids) || !ids.length || !["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "ids[] + action approve|reject required" }, { status: 400 });
  }
  const db = await getDb();
  if (action === "reject") {
    for (const id of ids) {
      await db.prepare("UPDATE draft_questions SET status = 'rejected' WHERE id = ?").run(id);
    }
    return NextResponse.json({ ok: true, rejected: ids.length });
  }
  let approved = 0;
  for (const id of ids) {
    const d = await db.prepare("SELECT exam, subject, topic, type, stem, options_json AS \"optionsJson\", answer_key AS \"answerKey\", marking_rubric AS \"markingRubric\" FROM draft_questions WHERE id = ? AND status = 'pending'").get(id) as
      | { exam: string; subject: string; topic: string; type: string; stem: string; optionsJson: string; answerKey: string; markingRubric: string }
      | undefined;
    if (!d) continue;
    await db.prepare(
      `INSERT INTO questions (id, exam, subject, topic, type, stem, options_json, answer_key, marking_rubric, source, predicted_repeat)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'AI', 0) ON CONFLICT DO NOTHING`
    ).run(`q-${id.replace(/^d-/, "")}`, d.exam, d.subject, d.topic, d.type, d.stem, d.optionsJson, d.answerKey, d.markingRubric);
    await db.prepare("UPDATE draft_questions SET status = 'approved' WHERE id = ?").run(id);
    approved++;
  }
  return NextResponse.json({ ok: true, approved });
}
