import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { totpSecret } from "@/lib/totp";

// POST { userId } — Generate a new TOTP secret for the user.
// Returns the secret so the client can show it / QR code it.
// Does NOT enable 2FA yet — user must verify first code first.
export async function POST(req: Request) {
  const { userId } = await req.json();
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const db = await getDb();
  const secret = totpSecret();
  await db.prepare("UPDATE users SET two_factor_secret = ? WHERE id = ?").run(secret, userId);
  return NextResponse.json({ ok: true, secret });
}
