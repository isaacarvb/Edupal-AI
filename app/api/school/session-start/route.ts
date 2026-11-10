import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { randomUUID } from "crypto";
import { hashPassword } from "@/lib/password";
import { normalizeClass } from "@/lib/csv";
import {
  GENERAL_SUBJECTS,
  JSS_SUBJECTS,
  DEPARTMENTS,
  canonicalDepartment,
  isJuniorClass,
  isSeniorClass
} from "@/lib/syllabus";

export async function POST(req: Request) {
  try {
    const b = await req.json();
    const schoolId = b?.schoolId;
    const studentName = String(b?.studentName ?? "").trim();
    const className = String(b?.className ?? "").trim();

    if (!schoolId) return NextResponse.json({ error: "School ID required" }, { status: 400 });
    if (!studentName) return NextResponse.json({ error: "Student name required" }, { status: 400 });
    if (!className) return NextResponse.json({ error: "Class required" }, { status: 400 });

    const db = await getDb();
    const school = await db.prepare("SELECT id, active, expires_at FROM schools WHERE id = ?").get(schoolId) as
      | { id: string; active: number; expires_at: string | null }
      | undefined;
    if (!school) return NextResponse.json({ error: "School not found" }, { status: 404 });
    if (!school.active) return NextResponse.json({ error: "School is inactive" }, { status: 403 });
    if (school.expires_at && Date.parse(school.expires_at) <= Date.now()) {
      return NextResponse.json({ error: "School subscription expired" }, { status: 403 });
    }

    // Verify student exists in roster with matching name and class. Compare
    // normalised class labels so "SS2A", "SSS2A" and "sss 2 a" all agree.
    const candidates = (await db.prepare(
      "SELECT id, user_id, name, class_name, department FROM school_students WHERE school_id = ? AND LOWER(name) = LOWER(?)"
    ).all(schoolId, studentName)) as Array<{
      id: string;
      user_id: string | null;
      name: string;
      class_name: string;
      department: string | null;
    }>;

    const wantedClass = normalizeClass(className).toLowerCase();
    const student =
      candidates.find((c) => normalizeClass(c.class_name).toLowerCase() === wantedClass) ??
      candidates.find((c) => c.class_name.trim().toLowerCase() === className.toLowerCase());

    if (!student) {
      return NextResponse.json({ error: "Student not found in roster. Check your name and class spelling." }, { status: 404 });
    }

    // JSS vs SSS detection must not confuse "JSS2" with "SS2".
    const junior = isJuniorClass(className);
    const senior = isSeniorClass(className);
    const rosterDept = student.department ? canonicalDepartment(student.department) : "";
    const isSSS = senior || (!junior && !!rosterDept);

    // For SSS students, department is required and must match the roster.
    const dept = canonicalDepartment(String(b?.department ?? rosterDept ?? "").trim());
    if (isSSS && !dept) {
      return NextResponse.json({ error: "Department is required for senior secondary students." }, { status: 400 });
    }
    if (isSSS && rosterDept && dept.toLowerCase() !== rosterDept.toLowerCase()) {
      return NextResponse.json({ error: "Department does not match roster." }, { status: 400 });
    }

    // Link to the student's real EduPal account so every profile/practice API
    // behaves exactly like a self-signup student. Older roster rows may have no
    // user_id yet, so create and link one on first login.
    let userId = student.user_id;
    if (userId) {
      const existing = await db.prepare("SELECT id FROM users WHERE id = ?").get(userId);
      if (!existing) userId = null;
    }
    if (!userId) {
      userId = randomUUID();
      await db.prepare(
        "INSERT INTO users (id, name, email, password_hash, role, level) VALUES (?, ?, ?, ?, 'SCHOOL_STUDENT', 'SECONDARY')"
      ).run(userId, student.name, `student_${userId}@school.local`, hashPassword(randomUUID()));
      await db.prepare("UPDATE school_students SET user_id = ? WHERE id = ?").run(userId, student.id);
    } else {
      // Keep the display name in sync with the roster.
      await db.prepare("UPDATE users SET name = ? WHERE id = ?").run(student.name, userId);
    }

    // Sync class + department + level into the real profile. School-code SSS
    // students default to WAEC; JSS students default to Others.
    const exam = isSSS ? "WAEC" : "Others";
    const subjects = isSSS
      ? [...GENERAL_SUBJECTS, ...(DEPARTMENTS[dept as keyof typeof DEPARTMENTS] ?? [])]
      : [...JSS_SUBJECTS];
    const uniqueSubjects = [...new Set(subjects)];
    const now = new Date().toISOString();

    await db.prepare("UPDATE users SET level = 'SECONDARY' WHERE id = ?").run(userId);
    await db.prepare(
      `INSERT INTO profiles (user_id, exam, exam_date, exam_start, exam_end, dates_confirmed, department, subjects, language)
       VALUES (?, ?, NULL, NULL, NULL, 0, ?, ?, 'SIMPLE')
       ON CONFLICT(user_id) DO UPDATE SET
         exam = excluded.exam,
         exam_date = NULL,
         exam_start = NULL,
         exam_end = NULL,
         dates_confirmed = 0,
         department = excluded.department,
         subjects = excluded.subjects,
         language = COALESCE(NULLIF(profiles.language, ''), excluded.language)`
    ).run(userId, exam, isSSS ? dept : "", uniqueSubjects.join(","));

    // Every student needs a wallet + streak for the normal APIs to work.
    await db.prepare(
      "INSERT INTO wallets (user_id, credits_left, reset_at, plan) VALUES (?, 10, ?, 'FREE') ON CONFLICT DO NOTHING"
    ).run(userId, now);
    await db.prepare("INSERT INTO streaks (user_id) VALUES (?) ON CONFLICT DO NOTHING").run(userId);

    // Keep the school membership in sync. Analytics, broadcasts and lesson
    // notes all read school_members, so a school-code login must create/update
    // this row even for students imported before school_members existed.
    const memberClass = (student.class_name || className).trim();
    await db.prepare(
      `INSERT INTO school_members (id, school_id, user_id, class_name, created_at)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(user_id) DO UPDATE SET
         school_id = excluded.school_id,
         class_name = excluded.class_name`
    ).run(randomUUID(), schoolId, userId, memberClass, now);

    const sessionId = randomUUID();
    await db.prepare(
      "INSERT INTO school_sessions (id, school_id, student_name, class_name, session_start, last_activity) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(sessionId, schoolId, studentName, className, now, now);

    return NextResponse.json({ ok: true, sessionId, userId, exam, department: isSSS ? dept : "", level: isSSS ? "SENIOR" : "JUNIOR" });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
