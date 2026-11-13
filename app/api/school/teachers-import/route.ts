import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { randomUUID } from "crypto";
import { canonicalDepartment } from "@/lib/syllabus";
import { normalizeClass } from "@/lib/csv";
import { requireActiveSchool } from "@/lib/schools";

// Bulk teacher roster import.
//
// The teacher's user id doubles as the school_teachers id (matching
// createSchoolTeacher in lib/schools.ts), so teacher APIs that look up by
// userId work. Both the full Stage C columns (email/password_hash/classes) and
// the later class_name column are filled, because production tables can have
// either shape. Re-uploading the same name + class updates the existing row.

type IncomingTeacher = { name: string; className?: string; class?: string; subject?: string; department?: string | null };

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const schoolId = form.get("schoolId") as string;
    const teachersJson = form.get("teachers") as string;
    const teachers: IncomingTeacher[] = JSON.parse(teachersJson || "[]");

    if (!schoolId || !Array.isArray(teachers) || teachers.length === 0) {
      return NextResponse.json({ error: "schoolId and teachers required" }, { status: 400 });
    }

    const db = await getDb();
    const access = await requireActiveSchool(db, schoolId);
    if ("error" in access) return access.error;

    const school = await db.prepare("SELECT id FROM schools WHERE id = ?").get(schoolId);
    if (!school) return NextResponse.json({ error: "School not found" }, { status: 404 });

    let imported = 0;
    let updated = 0;
    const skipped: string[] = [];

    for (const t of teachers) {
      const name = String(t.name ?? "").trim();
      const className = normalizeClass(String(t.className ?? t.class ?? ""));
      const subject = String(t.subject ?? "").trim();
      if (!name) {
        skipped.push("(blank name)");
        continue;
      }

      const now = new Date().toISOString();
      const department = t.department ? canonicalDepartment(String(t.department)) : null;

      // Same teacher in the same class should be updated, not duplicated.
      const existing = (await db
        .prepare(
          "SELECT id, user_id FROM school_teachers WHERE school_id = ? AND LOWER(name) = LOWER(?) AND LOWER(class_name) = LOWER(?) LIMIT 1"
        )
        .get(schoolId, name, className)) as { id: string; user_id: string | null } | undefined;

      let teacherId = existing?.id ?? null;
      if (teacherId) {
        const userExists = await db.prepare("SELECT id FROM users WHERE id = ?").get(teacherId);
        if (!userExists) teacherId = null;
      }

      if (!teacherId) {
        teacherId = randomUUID();
        const email = `teacher_${teacherId}@school.local`;
        await db
          .prepare(
            "INSERT INTO users (id, name, email, password_hash, role, level) VALUES (?, ?, ?, ?, 'SCHOOL_TEACHER', 'SECONDARY')"
          )
          .run(teacherId, name, email, hashPassword(randomUUID()));
        await db
          .prepare("INSERT INTO wallets (user_id, credits_left, reset_at, plan) VALUES (?, 10, ?, 'FREE') ON CONFLICT DO NOTHING")
          .run(teacherId, now);
        await db.prepare("INSERT INTO streaks (user_id) VALUES (?) ON CONFLICT DO NOTHING").run(teacherId);
      } else {
        await db.prepare("UPDATE users SET name = ? WHERE id = ?").run(name, teacherId);
      }

      if (existing) {
        await db
          .prepare(
            "UPDATE school_teachers SET user_id = ?, name = ?, class_name = ?, classes = ?, subject = ?, department = ? WHERE id = ?"
          )
          .run(teacherId, name, className, className, subject, department, existing.id);
        updated++;
      } else {
        // Include the Stage C login columns (email/password_hash/classes/active)
        // plus the roster display columns (class_name/subject/department).
        await db
          .prepare(
            `INSERT INTO school_teachers
               (id, school_id, user_id, name, email, password_hash, classes, class_name, subject, department, active, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`
          )
          .run(
            teacherId,
            schoolId,
            teacherId,
            name,
            `teacher_${teacherId}@school.local`,
            hashPassword(randomUUID()),
            className,
            className,
            subject,
            department,
            now
          );
        imported++;
      }
    }

    return NextResponse.json({ ok: true, imported, updated, skipped: skipped.length, skippedRows: skipped.slice(0, 10) });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
