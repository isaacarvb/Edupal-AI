import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { totpVerify } from "@/lib/totp";

// POST { userId, token, secret } — Verify a TOTP code and enable 2FA.
// If token matches, enable two_factor_enabled and return recovery codes.
export async function POST(req: Request) {
  const { userId, token, secret } = await req.json();
  if (!userId || !token || !secret) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const db = await getDb();
  const row = await db.prepare("SELECT two_factor_secret AS secret FROM users WHERE id = ?").get(userId) as { secret: string | null } | undefined;
  if (!row?.secret || row.secret !== secret) return NextResponse.json({ error: "Invalid session" }, { status: 400 });

  if (!totpVerify(secret, token, 1)) return NextResponse.json({ error: "Invalid code" }, { status: 400 });

  // Generate 8 recovery codes
  const codes = Array.from({ length: 8 }, () => Math.floor(Math.random() * 1000000).toString().padStart(6, "0"));
  const codesJson = JSON.stringify(codes);

  await db.prepare("UPDATE users SET two_factor_enabled = 1, two_factor_secret = ? WHERE id = ?").run(secret, userId);
  return NextResponse.json({ ok: true, codes: codesJson });
}
