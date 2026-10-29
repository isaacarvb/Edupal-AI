import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// POST { userId } — Disable 2FA for the user.
export async function POST(req: Request) {
  const { userId } = await req.json();
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const db = await getDb();
  await db.prepare("UPDATE users SET two_factor_enabled = 0, two_factor_secret = NULL WHERE id = ?").run(userId);
  return NextResponse.json({ ok: true });
}
