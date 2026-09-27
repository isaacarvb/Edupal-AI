import { NextResponse } from "next/server";
import { getDb, uid } from "@/lib/db";

// Creates a STUDENT + profile + wallet + streak. Prod: tie to auth session.
export async function POST(req: Request) {
  const { level, exam, examDate, subjects, language } = await req.json();
  if (!level || !exam || !subjects?.length || !language) {
    return NextResponse.json({ error: "level, exam, subjects, language required" }, { status: 400 });
  }
  if (!["SECONDARY", "UNIVERSITY"].includes(level)) {
    return NextResponse.json({ error: "bad level" }, { status: 400 });
  }
  if (!["WAEC", "JAMB"].includes(exam)) {
    return NextResponse.json({ error: "exam must be WAEC or JAMB in v1.0" }, { status: 400 });
  }
  const db = getDb();
  const id = uid();
  const now = new Date().toISOString();
  db.prepare("INSERT INTO users (id, role, level) VALUES (?, 'STUDENT', ?)").run(id, level);
  db.prepare(
    "INSERT INTO profiles (user_id, exam, exam_date, subjects, language) VALUES (?, ?, ?, ?, ?)"
  ).run(id, exam, examDate || null, subjects.join(","), language);
  db.prepare("INSERT INTO wallets (user_id, credits_left, reset_at, plan) VALUES (?, 10, ?, 'FREE')").run(id, now);
  db.prepare("INSERT INTO streaks (user_id) VALUES (?)").run(id);
  return NextResponse.json({ userId: id });
}
