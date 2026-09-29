import { NextResponse } from "next/server";
import { getDb, uid } from "@/lib/db";
import { hashPassword } from "@/lib/password";

// Creates a STUDENT + profile + wallet + streak. Optional email+password enables login.
export async function POST(req: Request) {
  const { level, exam, examDate, subjects, language, email, password } = await req.json();
  if (!level || !exam || !subjects?.length || !language) {
    return NextResponse.json({ error: "level, exam, subjects, language required" }, { status: 400 });
  }
  if (!["SECONDARY", "UNIVERSITY"].includes(level)) {
    return NextResponse.json({ error: "bad level" }, { status: 400 });
  }
  if (!["WAEC", "JAMB"].includes(exam)) {
    return NextResponse.json({ error: "exam must be WAEC or JAMB in v1.0" }, { status: 400 });
  }
  const cleanEmail = (email ?? "").trim().toLowerCase() || null;
  if (cleanEmail && (!password || password.length < 6)) {
    return NextResponse.json({ error: "password of 6+ characters required with email" }, { status: 400 });
  }
  const db = getDb();
  if (cleanEmail) {
    const taken = db.prepare("SELECT 1 FROM users WHERE email = ?").get(cleanEmail);
    if (taken) return NextResponse.json({ error: "email already used — sign in instead" }, { status: 409 });
  }
  const id = uid();
  const now = new Date().toISOString();
  db.prepare("INSERT INTO users (id, email, password_hash, role, level) VALUES (?, ?, ?, 'STUDENT', ?)").run(
    id, cleanEmail, cleanEmail ? hashPassword(password) : null, level
  );
  db.prepare(
    "INSERT INTO profiles (user_id, exam, exam_date, subjects, language) VALUES (?, ?, ?, ?, ?)"
  ).run(id, exam, examDate || null, subjects.join(","), language);
  db.prepare("INSERT INTO wallets (user_id, credits_left, reset_at, plan) VALUES (?, 10, ?, 'FREE')").run(id, now);
  db.prepare("INSERT INTO streaks (user_id) VALUES (?)").run(id);
  return NextResponse.json({ userId: id });
}
