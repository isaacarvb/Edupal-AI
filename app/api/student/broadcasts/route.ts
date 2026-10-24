import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getStudentBroadcasts } from "@/lib/lessons";

// GET ?userId= — active broadcasts for the student's class (+ school-wide).
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const db = await getDb();
  try {
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
    const member = (await db
      .prepare("SELECT school_id AS \"schoolId\", class_name AS \"className\" FROM school_members WHERE user_id = ?")
      .get(userId)) as { schoolId: string; className: string } | undefined;
    if (!member) return NextResponse.json({ broadcasts: [] });
    const broadcasts = await getStudentBroadcasts(db, member.schoolId, member.className);
    return NextResponse.json({ broadcasts, className: member.className });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
