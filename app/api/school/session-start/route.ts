import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { randomUUID } from "crypto";

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

    // Verify student exists in roster with matching name, class, and department
    const student = (await db.prepare(
      "SELECT id, name, class_name, department FROM school_students WHERE school_id = ? AND LOWER(name) = LOWER(?) AND LOWER(class_name) = LOWER(?) LIMIT 1"
    ).get(schoolId, studentName, className)) as
      | { id: string; name: string; class_name: string; department: string | null }
      | undefined;

    if (!student) {
      return NextResponse.json({ error: "Student not found in roster. Check your name and class spelling." }, { status: 404 });
    }

    // For SSS students, department is required and must match
    const dept = String(b?.department ?? "").trim();
    const isSSS = className.toLowerCase().includes("ss") || className.toLowerCase().includes("sss");
    if (isSSS && !dept) {
      return NextResponse.json({ error: "Department is required for senior secondary students." }, { status: 400 });
    }
    if (isSSS && student.department && dept.toLowerCase() !== student.department.toLowerCase()) {
      return NextResponse.json({ error: "Department does not match roster." }, { status: 400 });
    }

    const sessionId = randomUUID();
    const now = new Date().toISOString();
    await db.prepare(
      "INSERT INTO school_sessions (id, school_id, student_name, class_name, session_start, last_activity) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(sessionId, schoolId, studentName, className, now, now);

    return NextResponse.json({ ok: true, sessionId });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
