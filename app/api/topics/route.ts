import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// Mastery list + profile summary (countdown, streak, credits) for the dashboard.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  const db = getDb();
  const profile = db
    .prepare(
      `SELECT u.level, p.exam, p.exam_date AS examDate, p.subjects, p.language,
              w.credits_left AS creditsLeft, w.plan,
              s.current AS streak, s.freeze_available AS freezeAvailable
       FROM users u
       LEFT JOIN profiles p ON p.user_id = u.id
       LEFT JOIN wallets w ON w.user_id = u.id
       LEFT JOIN streaks s ON s.user_id = u.id
       WHERE u.id = ?`
    )
    .get(userId);
  if (!profile) return NextResponse.json({ error: "unknown user" }, { status: 404 });
  const topics = db
    .prepare(
      "SELECT subject, topic, accuracy, label FROM topic_mastery WHERE user_id = ? ORDER BY accuracy ASC"
    )
    .all(userId);
  return NextResponse.json({ profile, topics });
}
