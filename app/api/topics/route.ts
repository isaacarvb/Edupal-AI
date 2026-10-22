import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getWallet, subjectLimits } from "@/lib/credits";
import { maybeSendExpiryNudge } from "@/lib/mail";

// Mastery list + profile summary (countdown, streak, credits) for the dashboard.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  const db = await getDb();
  const profile = await db
    .prepare(
      `SELECT u.name, u.level, p.exam, p.exam_date AS "examDate",
              p.exam_start AS "examStart", p.exam_end AS "examEnd",
              p.dates_confirmed AS "datesConfirmed", p.department, p.subjects, p.language,
              w.plan, w.paid_until AS "paidUntil",
              s.current AS streak, s.freeze_available AS "freezeAvailable"
       FROM users u
       LEFT JOIN profiles p ON p.user_id = u.id
       LEFT JOIN wallets w ON w.user_id = u.id
       LEFT JOIN streaks s ON s.user_id = u.id
       WHERE u.id = ?`
    )
    .get(userId) as Record<string, unknown> | undefined;
  if (!profile) return NextResponse.json({ error: "unknown user" }, { status: 404 });
  const wallet = await getWallet(db, userId);
  const plan = wallet?.plan ?? "FREE";
  // Lazy expiry nudge: fire-and-forget, at most one email per expiry date.
  void maybeSendExpiryNudge(db, {
    userId,
    plan,
    paidUntil: typeof profile.paidUntil === "string" ? profile.paidUntil : null,
    base: new URL(req.url).origin
  });
  const subjectList = String((profile as Record<string, unknown>).subjects ?? "English").split(",").map((s) => s.trim()).filter(Boolean);
  const limits = await subjectLimits(db, userId, subjectList, plan);
  const exhaustedAll = plan === "FREE" && limits.length > 0 && limits.every((l) => l.left <= 0);
  const topics = await db
    .prepare(
      "SELECT subject, topic, accuracy, label FROM topic_mastery WHERE user_id = ? ORDER BY accuracy ASC"
    )
    .all(userId);
  const lastRow = await db
    .prepare(
      `SELECT q.subject AS s FROM attempts a JOIN questions q ON q.id = a.question_id
       WHERE a.user_id = ? ORDER BY a.created_at DESC LIMIT 1`
    )
    .get(userId) as { s: string } | undefined;
  return NextResponse.json({ profile: { ...profile, creditsLeft: limits.reduce((s, l) => s + l.left, 0), plan }, topics, subjectLimits: limits, exhaustedAll, lastSubject: lastRow?.s ?? null });
}
