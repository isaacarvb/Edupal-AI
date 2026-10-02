import { NextResponse } from "next/server";
import { getDb, uid } from "@/lib/db";
import { hashPassword } from "@/lib/password";

// Step 1 of onboarding: create the account. Study plan comes in Step 2.
export async function POST(req: Request) {
  const { name, email, password } = await req.json();
  const cleanName = (name ?? "").trim();
  const cleanEmail = (email ?? "").trim().toLowerCase();
  if (!cleanName) return NextResponse.json({ error: "full name required" }, { status: 400 });
  if (!cleanEmail || !cleanEmail.includes("@")) return NextResponse.json({ error: "valid email required" }, { status: 400 });
  if (!password || password.length < 6) return NextResponse.json({ error: "password of 6+ characters required" }, { status: 400 });
  const db = getDb();
  const taken = db.prepare("SELECT 1 FROM users WHERE email = ?").get(cleanEmail);
  if (taken) return NextResponse.json({ error: "email already used — sign in instead" }, { status: 409 });
  const id = uid();
  const now = new Date().toISOString();
  db.prepare("INSERT INTO users (id, email, password_hash, role, level) VALUES (?, ?, ?, 'STUDENT', 'SECONDARY')").run(
    id, cleanEmail, hashPassword(password)
  );
  db.prepare("INSERT INTO wallets (user_id, credits_left, reset_at, plan) VALUES (?, 10, ?, 'FREE')").run(id, now);
  db.prepare("INSERT INTO streaks (user_id) VALUES (?)").run(id);
  return NextResponse.json({ userId: id });
}
