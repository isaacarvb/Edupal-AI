import { NextResponse } from "next/server";
import { getDb, uid } from "@/lib/db";

// Manual override: student sets a topic's label; auto-grading keeps updating
// accuracy but won't move the label until override is cleared (label "AUTO").
export async function POST(req: Request) {
  const { userId, subject, topic, label } = await req.json();
  if (!userId || !subject || !topic || !label) {
    return NextResponse.json({ error: "userId, subject, topic, label required" }, { status: 400 });
  }
  if (!["WEAK", "NEEDS_WORK", "STRONG", "AUTO"].includes(label)) {
    return NextResponse.json({ error: "bad label" }, { status: 400 });
  }
  const db = await getDb();
  const now = new Date().toISOString();
  if (label === "AUTO") {
    await db.prepare("UPDATE topic_mastery SET overridden = 0, updated_at = ? WHERE user_id = ? AND subject = ? AND topic = ?").run(
      now, userId, subject, topic
    );
    return NextResponse.json({ ok: true, mode: "auto" });
  }
  await db.prepare(
    `INSERT INTO topic_mastery (id, user_id, subject, topic, accuracy, label, streak_count, consecutive_correct, overridden, updated_at)
     VALUES (?, ?, ?, ?, 0, ?, 0, 0, 1, ?)
     ON CONFLICT(user_id, subject, topic)
     DO UPDATE SET label = excluded.label, overridden = 1, updated_at = excluded.updated_at`
  ).run(uid(), userId, subject, topic, label, now);
  return NextResponse.json({ ok: true, mode: "manual", label });
}
