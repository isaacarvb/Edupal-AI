import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// GET — Return current recovery codes for the user.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const db = await getDb();
  const row = await db.prepare("SELECT two_factor_secret AS secret FROM users WHERE id = ?").get(userId) as { secret: string } | undefined;
  if (!row?.secret) return NextResponse.json({ error: "No 2FA setup" }, { status: 400 });

  // Regenerate recovery codes each time they're viewed
  const codes = Array.from({ length: 8 }, () => Math.floor(Math.random() * 1000000).toString().padStart(6, "0"));
  return NextResponse.json({ ok: true, codes });
}
