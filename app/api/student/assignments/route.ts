import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getAssignments } from "@/lib/lessons";

// GET ?userId= — active (not past due) assignments for the student's class.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const db = await getDb();
  try {
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
    const member = (await db
      .prepare("SELECT school_id AS \"schoolId\", class_name AS \"className\" FROM school_members WHERE user_id = ?")
      .get(userId)) as { schoolId: string; className: string } | undefined;
    if (!member) return NextResponse.json({ assignments: [] });
    const now = new Date().toISOString();
    const all = await getAssignments(db, member.schoolId, { className: member.className });
    const active = all.filter((a) => !a.dueAt || a.dueAt >= now);
    return NextResponse.json({ assignments: active, className: member.className });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
