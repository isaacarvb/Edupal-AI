import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getStudentLessonNotes } from "@/lib/lessons";

// GET ?userId= — approved lesson notes for the student's class.
// Any logged-in student can read notes for the class they belong to.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const db = await getDb();
  try {
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
    const member = (await db
      .prepare("SELECT school_id AS \"schoolId\", class_name AS \"className\" FROM school_members WHERE user_id = ?")
      .get(userId)) as { schoolId: string; className: string } | undefined;
    if (!member) return NextResponse.json({ notes: [] });
    const notes = await getStudentLessonNotes(db, member.schoolId, member.className);
    return NextResponse.json({ notes, className: member.className });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
