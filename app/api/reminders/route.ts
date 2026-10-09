import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { ensureDailyReminder } from "@/lib/reminders";

// In-app reminder for today (also queued to the local email outbox).
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  const db = await getDb();
  const profile = await db.prepare("SELECT language FROM profiles WHERE user_id = ?").get(userId) as
    | { language: "SIMPLE" | "PIDGIN" }
    | undefined;
  const reminder = await ensureDailyReminder(db, userId, profile?.language ?? "SIMPLE");
  const outbox = await db
    .prepare("SELECT kind, subject, body, created_at AS at FROM email_outbox WHERE user_id = ? ORDER BY created_at DESC LIMIT 5")
    .all(userId);
  return NextResponse.json({ reminder, outbox });
}
