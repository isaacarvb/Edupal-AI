import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get("schoolId");

    if (!schoolId) {
      return NextResponse.json({ error: "School ID required" }, { status: 400 });
    }

    const db = await getDb();

    // Count total students in roster
    const totalStudents = (await db.prepare("SELECT COUNT(*) AS n FROM school_students WHERE school_id = ?").get(schoolId)) as { n: number };

    // Count active sessions in last 7 days
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
    const activeWeek = (await db.prepare(
      "SELECT COUNT(DISTINCT student_name) AS n FROM school_sessions WHERE school_id = ? AND last_activity >= ?"
    ).get(schoolId, weekAgo)) as { n: number };

    // Count flagged students (no activity in 14 days)
    const fourteenDaysAgo = new Date(Date.now() - 14 * 86400000).toISOString();
    const allStudents = (await db.prepare("SELECT name FROM school_students WHERE school_id = ?").all(schoolId)) as { name: string }[];
    const activeStudents = (await db.prepare(
      "SELECT DISTINCT student_name AS name FROM school_sessions WHERE school_id = ? AND last_activity >= ?"
    ).all(schoolId, fourteenDaysAgo)) as { name: string }[];
    const activeNames = new Set(activeStudents.map((s) => s.name));
    const flaggedCount = allStudents.filter((s) => !activeNames.has(s.name)).length;

    // Top class by session count
    const topClass = (await db.prepare(
      "SELECT class_name AS \"className\", COUNT(*) AS cnt FROM school_sessions WHERE school_id = ? GROUP BY class_name ORDER BY cnt DESC LIMIT 1"
    ).get(schoolId)) as { className: string; cnt: number } | undefined;

    return NextResponse.json({
      ok: true,
      stats: {
        totalStudents: totalStudents.n,
        studentsActiveWeek: activeWeek.n,
        topClass: topClass?.className || "—",
        flaggedCount
      }
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
