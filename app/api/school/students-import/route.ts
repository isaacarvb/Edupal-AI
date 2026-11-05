import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const schoolId = form.get("schoolId") as string;
    const studentsJson = form.get("students") as string;
    const students: Array<{ name: string; className: string; department: string | null }> = JSON.parse(studentsJson);

    if (!schoolId || !students.length) {
      return NextResponse.json({ error: "schoolId and students required" }, { status: 400 });
    }

    const db = await getDb();

    // Verify school exists
    const school = await db.prepare("SELECT id FROM schools WHERE id = ?").get(schoolId);
    if (!school) return NextResponse.json({ error: "School not found" }, { status: 404 });

    let imported = 0;
    for (const s of students) {
      // Create a user entry for the student (no password - they login via school code + name + class)
      const userId = randomUUID();
      await db.prepare(
        "INSERT INTO users (id, name, email, password_hash, role, level) VALUES (?, ?, ?, ?, 'SCHOOL_STUDENT', 'SECONDARY')"
      ).run(userId, s.name, `student_${userId}@school.local`, hashPassword(randomUUID()));

      // Link to school
      await db.prepare(
        "INSERT INTO school_students (id, school_id, user_id, name, class_name, department, created_at) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))"
      ).run(randomUUID(), schoolId, userId, s.name, s.className, s.department || null);
      imported++;
    }

    // Update seats_used
    await db.prepare("UPDATE schools SET seats_used = seats_used + ? WHERE id = ?").run(imported, schoolId);

    return NextResponse.json({ ok: true, imported });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
