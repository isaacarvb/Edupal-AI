import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { randomUUID } from "crypto";
import { hashPassword } from "@/lib/password";
import { normalizeClass } from "@/lib/csv";

// Teacher session start: school code → name → class → subject.
// Mirrors the student session-start flow, but validates against the
// school_teachers roster (name + class + subject) and links a real
// SCHOOL_TEACHER users row so every teacher API works exactly like a
// self-signup teacher account.
export async function POST(req: Request) {
  try {
    const b = await req.json();
    const schoolId = b?.schoolId;
    const teacherName = String(b?.teacherName ?? "").trim();
    const className = String(b?.className ?? "").trim();
    const subject = String(b?.subject ?? "").trim();

    if (!schoolId) return NextResponse.json({ error: "School ID required" }, { status: 400 });
    if (!teacherName) return NextResponse.json({ error: "Teacher name required" }, { status: 400 });
    if (!className) return NextResponse.json({ error: "Class required" }, { status: 400 });
    if (!subject) return NextResponse.json({ error: "Subject required" }, { status: 400 });

    const db = await getDb();
    const school = await db.prepare("SELECT id, active, expires_at FROM schools WHERE id = ?").get(schoolId) as
      | { id: string; active: number; expires_at: string | null }
      | undefined;
    if (!school) return NextResponse.json({ error: "School not found" }, { status: 404 });
    if (!school.active) return NextResponse.json({ error: "School is inactive" }, { status: 403 });
    if (school.expires_at && Date.parse(school.expires_at) <= Date.now()) {
      return NextResponse.json({ error: "School subscription expired" }, { status: 403 });
    }

    // Verify teacher exists in roster with matching name, class, and subject.
    const candidates = (await db.prepare(
      "SELECT id, user_id, name, class_name, subject, active FROM school_teachers WHERE school_id = ? AND LOWER(name) = LOWER(?)"
    ).all(schoolId, teacherName)) as Array<{
      id: string;
      user_id: string | null;
      name: string;
      class_name: string;
      subject: string | null;
      active: number;
    }>;

    const wantedClass = normalizeClass(className).toLowerCase();
    const teacher =
      candidates.find((t) => normalizeClass(t.class_name).toLowerCase() === wantedClass && String(t.subject ?? "").toLowerCase() === subject.toLowerCase()) ??
      candidates.find((t) => t.class_name.trim().toLowerCase() === className.toLowerCase() && String(t.subject ?? "").toLowerCase() === subject.toLowerCase());

    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found in roster. Check your name, class, and subject spelling." }, { status: 404 });
    }

    if (teacher.active === 0) {
      return NextResponse.json({ error: "This teacher account is deactivated. Contact your school admin." }, { status: 403 });
    }

    // Link to the teacher's real EduPal account so every teacher API behaves
    // exactly like a self-signup teacher account. Older roster rows may have no
    // user_id yet, so create and link one on first login.
    let userId = teacher.user_id;
    if (userId) {
      const existing = await db.prepare("SELECT id FROM users WHERE id = ?").get(userId);
      if (!existing) userId = null;
    }
    if (!userId) {
      userId = randomUUID();
      await db.prepare(
        "INSERT INTO users (id, name, email, password_hash, role, level) VALUES (?, ?, ?, ?, 'SCHOOL_TEACHER', 'SECONDARY')"
      ).run(userId, teacher.name, `teacher_${userId}@school.local`, hashPassword(randomUUID()));
      await db.prepare("UPDATE school_teachers SET user_id = ? WHERE id = ?").run(userId, teacher.id);
    } else {
      await db.prepare("UPDATE users SET name = ? WHERE id = ?").run(teacher.name, userId);
    }

    // Sync class + subject into the real profile.
    const now = new Date().toISOString();
    await db.prepare("UPDATE users SET level = 'SECONDARY' WHERE id = ?").run(userId);
    await db.prepare(
      `INSERT INTO profiles (user_id, exam, exam_date, exam_start, exam_end, dates_confirmed, department, subjects, language)
       VALUES (?, 'Others', NULL, NULL, NULL, 0, ?, ?, 'SIMPLE')
       ON CONFLICT(user_id) DO UPDATE SET
         exam = 'Others',
         exam_date = NULL,
         exam_start = NULL,
         exam_end = NULL,
         dates_confirmed = 0,
         department = excluded.department,
         subjects = excluded.subjects,
         language = COALESCE(NULLIF(profiles.language, ''), excluded.language)`
    ).run(userId, teacher.class_name, subject);

    // Every teacher needs a wallet + streak for the normal APIs to work.
    await db.prepare(
      "INSERT INTO wallets (user_id, credits_left, reset_at, plan) VALUES (?, 10, ?, 'FREE') ON CONFLICT DO NOTHING"
    ).run(userId, now);
    await db.prepare("INSERT INTO streaks (user_id) VALUES (?) ON CONFLICT DO NOTHING").run(userId);

    const sessionId = randomUUID();
    await db.prepare(
      "INSERT INTO school_sessions (id, school_id, student_name, class_name, session_start, last_activity) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(sessionId, schoolId, teacherName, className, now, now);

    return NextResponse.json({ ok: true, sessionId, userId, subject, className: teacher.class_name });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
