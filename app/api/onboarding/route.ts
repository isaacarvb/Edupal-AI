import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// Step 2 of onboarding: save/refresh the study plan for an existing account.
export async function POST(req: Request) {
  const { userId, level, exam, examDate, subjects, language } = await req.json();
  if (!userId) {
    return NextResponse.json({ error: "no account yet — sign up first" }, { status: 400 });
  }
  if (!level || !exam || !subjects?.length || !language) {
    return NextResponse.json({ error: "level, exam, subjects, language required" }, { status: 400 });
  }
  if (!["SECONDARY", "UNIVERSITY"].includes(level)) {
    return NextResponse.json({ error: "bad level" }, { status: 400 });
  }
  if (!["WAEC", "JAMB", "NECO", "GCE"].includes(exam)) {
    return NextResponse.json({ error: "exam must be WAEC, JAMB, NECO or GCE" }, { status: 400 });
  }
  const db = await getDb();
  const user = await db.prepare("SELECT 1 FROM users WHERE id = ?").get(userId);
  if (!user) return NextResponse.json({ error: "unknown account — sign up first" }, { status: 404 });
  const now = new Date().toISOString();
  await db.prepare("UPDATE users SET level = ? WHERE id = ?").run(level, userId);
  await db.prepare(
    `INSERT INTO profiles (user_id, exam, exam_date, subjects, language) VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET exam = excluded.exam, exam_date = excluded.exam_date,
       subjects = excluded.subjects, language = excluded.language`
  ).run(userId, exam, examDate || null, subjects.join(","), language);
  await db.prepare("INSERT INTO wallets (user_id, credits_left, reset_at, plan) VALUES (?, 10, ?, 'FREE') ON CONFLICT DO NOTHING").run(userId, now);
  await db.prepare("INSERT INTO streaks (user_id) VALUES (?) ON CONFLICT DO NOTHING").run(userId);
  return NextResponse.json({ userId });
}
