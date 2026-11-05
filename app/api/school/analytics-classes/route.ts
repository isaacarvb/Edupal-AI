import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get("schoolId");
    if (!schoolId) return NextResponse.json({ error: "schoolId required" }, { status: 400 });

    const db = await getDb();

    const sql =
      "SELECT ss.class_name AS className, " +
      "COUNT(DISTINCT ss.user_id) AS students, " +
      "COALESCE(ROUND(AVG(tm.accuracy)), 0) AS avgAccuracy, " +
      "COUNT(DISTINCT CASE WHEN a.created_at >= datetime('now', '-7 days') THEN a.user_id END) AS activeWeek " +
      "FROM school_students ss " +
      "LEFT JOIN users u ON u.id = ss.user_id " +
      "LEFT JOIN topic_mastery tm ON tm.user_id = u.id " +
      "LEFT JOIN attempts a ON a.user_id = u.id " +
      "WHERE ss.school_id = ? " +
      "GROUP BY ss.class_name " +
      "ORDER BY students DESC";

    const rows = (await db.prepare(sql).all(schoolId)) as Array<{
      className: string;
      students: number;
      avgAccuracy: number;
      activeWeek: number;
    }>;

    return NextResponse.json({ ok: true, classes: rows });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
