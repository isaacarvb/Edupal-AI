import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json({ error: "studentId required" }, { status: 400 });
    }

    const db = await getDb();

    // Get student's school_id
    const student = (await db.prepare("SELECT school_id FROM school_students WHERE id = ?").get(studentId)) as {
      school_id: string;
    } | undefined;

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Delete student
    await db.prepare("DELETE FROM school_students WHERE id = ?").run(studentId);

    // Decrement seats_used
    await db.prepare("UPDATE schools SET seats_used = seats_used - 1 WHERE id = ?").run(student.school_id);

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
