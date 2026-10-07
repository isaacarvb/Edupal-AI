import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { inviteCode, bonusLeft } from "@/lib/referral";

// Invite link + bonus balance for the dashboard card.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  const db = getDb();
  const count = db
    .prepare("SELECT COUNT(*) AS n FROM referrals WHERE referrer_user_id = ?")
    .get(userId) as { n: number };
  return NextResponse.json({
    code: inviteCode(userId),
    bonusLeft: bonusLeft(db, userId),
    invites: count.n
  });
}
