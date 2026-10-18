import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { JSS_SUBJECTS, DEPARTMENTS, DEPARTMENT_NAMES } from "@/lib/syllabus";

// Step 2 of onboarding: save/refresh the study plan for an existing account.
// Dates are optional (timetable may not be out): pass datesConfirmed: false to skip them.
export async function POST(req: Request) {
  const { userId, level, exam, department, examStart, examEnd, datesConfirmed, subjects, language } = await req.json();
  if (!userId) {
    return NextResponse.json({ error: "no account yet — sign up first" }, { status: 400 });
  }
  if (!level || !exam || !subjects?.length || !language) {
    return NextResponse.json({ error: "level, exam, subjects, language required" }, { status: 400 });
  }
  if (!["SECONDARY"].includes(level)) {
    return NextResponse.json({ error: "bad level" }, { status: 400 });
  }
  if (!["WAEC", "JAMB", "Others"].includes(exam)) {
    return NextResponse.json({ error: "exam must be WAEC, JAMB or Others" }, { status: 400 });
  }
  const confirmed = datesConfirmed !== false;
  const start = (examStart || null) as string | null;
  const end = (examEnd || null) as string | null;
  if (confirmed) {
    if (start && end && end < start) {
      return NextResponse.json({ error: "end date cannot be before start date" }, { status: 400 });
    }
  }
  const isJss = exam === "Others";
  const dept = isJss ? "" : String(department ?? "");
  if (!isJss && !DEPARTMENT_NAMES.includes(dept)) {
    return NextResponse.json({ error: "department must be Science, Commercial or Arts" }, { status: 400 });
  }
  const allowed = isJss ? [...JSS_SUBJECTS] : [...DEPARTMENTS[dept as keyof typeof DEPARTMENTS]];
  const bad = (subjects as string[]).filter((s) => !allowed.includes(s));
  if (bad.length) {
    return NextResponse.json({ error: `these subjects don't belong here: ${bad.join(", ")}` }, { status: 400 });
  }
  const db = await getDb();
  const user = await db.prepare("SELECT 1 FROM users WHERE id = ?").get(userId);
  if (!user) return NextResponse.json({ error: "unknown account — sign up first" }, { status: 404 });
  const now = new Date().toISOString();
  await db.prepare("UPDATE users SET level = ? WHERE id = ?").run(level, userId);
  await db.prepare(
    `INSERT INTO profiles (user_id, exam, exam_date, exam_start, exam_end, dates_confirmed, department, subjects, language)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET exam = excluded.exam, exam_date = excluded.exam_start,
       exam_start = excluded.exam_start, exam_end = excluded.exam_end,
       dates_confirmed = excluded.dates_confirmed, department = excluded.department,
       subjects = excluded.subjects, language = excluded.language`
  ).run(userId, exam, confirmed ? start : null, confirmed ? start : null, confirmed ? end : null, confirmed ? 1 : 0, dept, (subjects as string[]).join(","), language);
  await db.prepare("INSERT INTO wallets (user_id, credits_left, reset_at, plan) VALUES (?, 10, ?, 'FREE') ON CONFLICT DO NOTHING").run(userId, now);
  await db.prepare("INSERT INTO streaks (user_id) VALUES (?) ON CONFLICT DO NOTHING").run(userId);
  return NextResponse.json({ userId });
}
