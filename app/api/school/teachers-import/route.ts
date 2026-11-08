import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const schoolId = form.get("schoolId") as string;
    const teachersJson = form.get("teachers") as string;
    const teachers: Array<{ name: string; className: string; subject: string }> = JSON.parse(teachersJson);

    if (!schoolId || !teachers.length) {
      return NextResponse.json({ error: "schoolId and teachers required" }, { status: 400 });
    }

    const db = await getDb();

    const school = await db.prepare("SELECT id FROM schools WHERE id = ?").get(schoolId);
    if (!school) return NextResponse.json({ error: "School not found" }, { status: 404 });

    let imported = 0;
    for (const t of teachers) {
      const userId = randomUUID();
      await db.prepare(
        "INSERT INTO users (id, name, email, password_hash, role, level) VALUES (?, ?, ?, ?, 'SCHOOL_TEACHER', 'SECONDARY')"
      ).run(userId, t.name, `teacher_${userId}@school.local`, hashPassword(randomUUID()));

      const now = new Date().toISOString();
      await db.prepare(
        "INSERT INTO school_teachers (id, school_id, user_id, name, class_name, subject, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
      ).run(randomUUID(), schoolId, userId, t.name, t.className, t.subject, now);
      imported++;
    }

    return NextResponse.json({ ok: true, imported });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
