import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get("schoolId");
    if (!schoolId) return NextResponse.json({ error: "schoolId required" }, { status: 400 });

    const db = await getDb();

    // Active sessions in the last 2 hours
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    const rows = (await db.prepare(
      "SELECT student_name AS name, class_name AS className, session_start AS sessionStart, last_activity AS lastActivity FROM school_sessions WHERE school_id = ? AND last_activity >= ? ORDER BY last_activity DESC"
    ).all(schoolId, twoHoursAgo)) as Array<{
      name: string;
      className: string;
      sessionStart: string;
      lastActivity: string;
    }>;

    return NextResponse.json({ ok: true, online: rows });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
