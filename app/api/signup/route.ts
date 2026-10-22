import { NextResponse } from "next/server";
import { getDb, uid } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { referrerByCode, grantReferralBonus } from "@/lib/referral";
import { sendWelcomeEmail } from "@/lib/mail";

// Step 1 of onboarding: create the account. Study plan comes in Step 2.
export async function POST(req: Request) {
  const { name, email, password, referredBy, role } = await req.json();
  const cleanName = (name ?? "").trim();
  const cleanEmail = (email ?? "").trim().toLowerCase();
  if (!cleanName) return NextResponse.json({ error: "full name required" }, { status: 400 });
  if (!cleanEmail || !cleanEmail.includes("@")) return NextResponse.json({ error: "valid email required" }, { status: 400 });
  if (!password || password.length < 6) return NextResponse.json({ error: "password of 6+ characters required" }, { status: 400 });
  const cleanRole = "STUDENT";
  const db = await getDb();
  const taken = await db.prepare("SELECT 1 FROM users WHERE email = ?").get(cleanEmail);
  if (taken) return NextResponse.json({ error: "email already used — sign in instead" }, { status: 409 });
  const id = uid();
  const now = new Date().toISOString();
  await db.prepare("INSERT INTO users (id, name, email, password_hash, role, level) VALUES (?, ?, ?, ?, ?, 'SECONDARY')").run(
    id, cleanName, cleanEmail, hashPassword(password), cleanRole
  );
  if (cleanRole === "STUDENT") {
    await db.prepare("INSERT INTO wallets (user_id, credits_left, reset_at, plan) VALUES (?, 10, ?, 'FREE')").run(id, now);
    await db.prepare("INSERT INTO streaks (user_id) VALUES (?)").run(id);
  }
  if (referredBy) {
    const referrer = await referrerByCode(db, String(referredBy));
    if (referrer && referrer !== id) await grantReferralBonus(db, referrer, cleanEmail);
  }
  // Fire-and-forget: the welcome email never delays account creation.
  void sendWelcomeEmail({ userId: id, name: cleanName, email: cleanEmail, base: new URL(req.url).origin });
  return NextResponse.json({ userId: id, role: cleanRole });
}
