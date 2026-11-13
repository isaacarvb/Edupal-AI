import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireActiveSchool } from "@/lib/schools";

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json({ error: "studentId required" }, { status: 400 });
    }

    const db = await getDb();

    // Get student's school_id + linked user so the membership row is cleaned too.
    const student = (await db.prepare("SELECT school_id, user_id FROM school_students WHERE id = ?").get(studentId)) as
      | { school_id: string; user_id: string | null }
      | undefined;

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const access = await requireActiveSchool(db, student.school_id);
    if ("error" in access) return access.error;

    // Remove the roster row and the school membership used by analytics/notes.
    // The users row is kept so any practice history is not destroyed.
    if (student.user_id) {
      await db.prepare("DELETE FROM school_members WHERE user_id = ?").run(student.user_id);
    }
    await db.prepare("DELETE FROM school_students WHERE id = ?").run(studentId);

    // seats_used always mirrors the real roster size.
    await db
      .prepare("UPDATE schools SET seats_used = (SELECT COUNT(*) FROM school_students WHERE school_id = ?) WHERE id = ?")
      .run(student.school_id, student.school_id);

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
