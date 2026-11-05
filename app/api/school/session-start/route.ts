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
