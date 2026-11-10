import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get("schoolId");
    if (!schoolId) return NextResponse.json({ error: "schoolId required" }, { status: 400 });

    const db = await getDb();

    const sql =
      "SELECT tm.subject AS subject, " +
      "COUNT(DISTINCT ss.user_id) AS students, " +
      "COALESCE(ROUND(AVG(tm.accuracy)), 0) AS \"avgAccuracy\", " +
      "SUM(CASE WHEN tm.label = 'WEAK' THEN 1 ELSE 0 END) AS \"weakCount\" " +
      "FROM topic_mastery tm " +
      "JOIN users u ON u.id = tm.user_id " +
      "JOIN school_students ss ON ss.user_id = u.id AND ss.school_id = ? " +
      "GROUP BY tm.subject " +
      "ORDER BY students DESC";

    const rows = (await db.prepare(sql).all(schoolId)) as Array<{
      subject: string;
      students: number;
      avgAccuracy: number;
      weakCount: number;
    }>;

    return NextResponse.json({ ok: true, subjects: rows });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
