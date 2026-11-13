import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { randomUUID } from "crypto";
import { canonicalDepartment, isJuniorClass } from "@/lib/syllabus";
import { normalizeClass } from "@/lib/csv";
import { schoolIsActive } from "@/lib/schools";

// Bulk student roster import.
//
// Every student gets a real users row (so practice/progress works exactly like
// a self-signup account), a school_students roster row (used by school-code
// login) and a school_members row (used by analytics, broadcasts and lesson
// notes). Re-uploading the same name + class updates the existing student
// instead of creating a duplicate, so the roster can be corrected safely.

type IncomingStudent = { name: string; className?: string; class?: string; department?: string | null };

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const schoolId = form.get("schoolId") as string;
    const studentsJson = form.get("students") as string;
    const students: IncomingStudent[] = JSON.parse(studentsJson || "[]");

    if (!schoolId || !Array.isArray(students) || students.length === 0) {
      return NextResponse.json({ error: "schoolId and students required" }, { status: 400 });
    }

    const db = await getDb();

    // The roster can only grow inside a paid subscription, and never beyond
    // the seats the school bought. Both checks run BEFORE anything is written,
    // so an over-limit file is rejected as a whole.
    const school = (await db
      .prepare(
        'SELECT id, active, expires_at AS "expiresAt", max_seats AS "maxSeats" FROM schools WHERE id = ?'
      )
      .get(schoolId)) as
      | { id: string; active: number; expiresAt: string | null; maxSeats: number }
      | undefined;
    if (!school) return NextResponse.json({ error: "School not found" }, { status: 404 });

    if (!schoolIsActive(school)) {
      return NextResponse.json(
        { error: "Your school subscription is not active. Subscribe first, then upload your student roster.", needsSubscription: true },
        { status: 403 }
      );
    }

    const rosterRows = (await db
      .prepare("SELECT LOWER(name) AS n, LOWER(class_name) AS c FROM school_students WHERE school_id = ?")
      .all(schoolId)) as Array<{ n: string; c: string }>;
    const existingKeys = new Set(rosterRows.map((r) => `${r.n}|${r.c}`));
    const rosterCount = rosterRows.length;

    // Only students who are not already on the roster use a seat. Duplicate
    // rows inside the same file are counted once.
    const seen = new Set<string>();
    let newStudents = 0;
    for (const s of students) {
      const name = String(s.name ?? "").trim();
      const className = normalizeClass(String(s.className ?? s.class ?? ""));
      if (!name || !className) continue;
      const key = `${name.toLowerCase()}|${className.toLowerCase()}`;
      if (existingKeys.has(key) || seen.has(key)) continue;
      seen.add(key);
      newStudents++;
    }

    const seats = Number(school.maxSeats ?? 0);
    if (rosterCount + newStudents > seats) {
      const over = rosterCount + newStudents - seats;
      return NextResponse.json(
        {
          error:
            `Your plan covers ${seats} student seat(s). ` +
            `Your roster has ${rosterCount}, and this file adds ${newStudents} new student(s), ` +
            `which would make ${rosterCount + newStudents}. ` +
            `Remove ${over} student(s) from the file or increase your plan.`,
          seats,
          rosterCount,
          newStudents,
          over
        },
        { status: 400 }
      );
    }

    let imported = 0;
    let updated = 0;
    const skipped: string[] = [];

    for (const s of students) {
      const name = String(s.name ?? "").trim();
      const className = normalizeClass(String(s.className ?? s.class ?? ""));
      if (!name) {
        skipped.push("(blank name)");
        continue;
      }
      if (!className) {
        skipped.push(`${name}: missing class`);
        continue;
      }

      const department = isJuniorClass(className)
        ? null
        : s.department
          ? canonicalDepartment(String(s.department))
          : null;

      const now = new Date().toISOString();

      // Re-uploading the same student should update, not duplicate.
      const existing = (await db
        .prepare(
          "SELECT id, user_id FROM school_students WHERE school_id = ? AND LOWER(name) = LOWER(?) AND LOWER(class_name) = LOWER(?) LIMIT 1"
        )
        .get(schoolId, name, className)) as { id: string; user_id: string | null } | undefined;

      let userId = existing?.user_id ?? null;
      if (userId) {
        const userExists = await db.prepare("SELECT id FROM users WHERE id = ?").get(userId);
        if (!userExists) userId = null;
      }

      if (!userId) {
        userId = randomUUID();
        await db
          .prepare(
            "INSERT INTO users (id, name, email, password_hash, role, level) VALUES (?, ?, ?, ?, 'SCHOOL_STUDENT', 'SECONDARY')"
          )
          .run(userId, name, `student_${userId}@school.local`, hashPassword(randomUUID()));
      } else {
        await db.prepare("UPDATE users SET name = ? WHERE id = ?").run(name, userId);
      }

      // Every student needs a wallet + streak for the normal APIs to work.
      await db
        .prepare("INSERT INTO wallets (user_id, credits_left, reset_at, plan) VALUES (?, 10, ?, 'FREE') ON CONFLICT DO NOTHING")
        .run(userId, now);
      await db.prepare("INSERT INTO streaks (user_id) VALUES (?) ON CONFLICT DO NOTHING").run(userId);

      if (existing) {
        await db
          .prepare("UPDATE school_students SET user_id = ?, name = ?, department = ? WHERE id = ?")
          .run(userId, name, department, existing.id);
        updated++;
      } else {
        await db
          .prepare(
            "INSERT INTO school_students (id, school_id, user_id, name, class_name, department, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
          )
          .run(randomUUID(), schoolId, userId, name, className, department, now);
        imported++;
      }

      // Analytics, broadcasts and lesson notes all read school_members.
      await db
        .prepare(
          `INSERT INTO school_members (id, school_id, user_id, class_name, created_at)
           VALUES (?, ?, ?, ?, ?)
           ON CONFLICT(user_id) DO UPDATE SET
             school_id = excluded.school_id,
             class_name = excluded.class_name`
        )
        .run(randomUUID(), schoolId, userId, className, now);
    }

    // seats_used always mirrors the real roster size.
    await db
      .prepare("UPDATE schools SET seats_used = (SELECT COUNT(*) FROM school_students WHERE school_id = ?) WHERE id = ?")
      .run(schoolId, schoolId);

    const total = (await db.prepare("SELECT COUNT(*) AS n FROM school_students WHERE school_id = ?").get(schoolId)) as
      | { n: number }
      | undefined;

    return NextResponse.json({
      ok: true,
      imported,
      updated,
      skipped: skipped.length,
      skippedRows: skipped.slice(0, 10),
      total: Number(total?.n ?? imported + updated)
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
