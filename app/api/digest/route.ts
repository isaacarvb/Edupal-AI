import { NextResponse } from "next/server";
import { getDb, uid } from "@/lib/db";

// Sunday digest, triggerable manually locally (?userId=). Prod: weekly cron.
export async function POST(req: Request) {
  const { userId } = await req.json();
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  const db = getDb();
  const s = db
    .prepare(
      `SELECT s.current AS streak,
              (SELECT COUNT(*) FROM attempts WHERE user_id = ? AND substr(created_at,1,10) >= date('now','-7 days')) AS week,
              (SELECT topic FROM topic_mastery WHERE user_id = ? ORDER BY accuracy ASC LIMIT 1) AS weakest
       FROM streaks s WHERE s.user_id = ?`
    )
    .get(userId, userId, userId) as { streak: number; week: number; weakest: string | null } | undefined;
  if (!s) return NextResponse.json({ error: "unknown user" }, { status: 404 });
  const body = `Weekly update: ${s.week} practice answer(s), streak ${s.streak}, weakest topic: ${s.weakest ?? "—"}.`;
  db.prepare("INSERT INTO email_outbox (id, user_id, kind, subject, body) VALUES (?, ?, 'weekly-digest', 'EduPal weekly progress', ?)").run(
    uid(), userId, body
  );
  return NextResponse.json({ ok: true, queued: body });
}
