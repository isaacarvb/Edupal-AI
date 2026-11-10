import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get("schoolId");
    if (!schoolId) return NextResponse.json({ error: "schoolId required" }, { status: 400 });

    const db = await getDb();

    const sql =
      "SELECT ss.name AS name, " +
      "ss.class_name AS \"className\", " +
      "ss.department AS department, " +
      "COUNT(a.id) AS answers, " +
      "COALESCE(ROUND(AVG(tm.accuracy)), 0) AS \"avgAccuracy\" " +
      "FROM school_students ss " +
      "LEFT JOIN users u ON u.id = ss.user_id " +
      "LEFT JOIN attempts a ON a.user_id = u.id " +
      "LEFT JOIN topic_mastery tm ON tm.user_id = u.id " +
      "WHERE ss.school_id = ? " +
      "GROUP BY ss.id, ss.name, ss.class_name, ss.department " +
      "ORDER BY answers DESC " +
      "LIMIT 15";

    const rows = (await db.prepare(sql).all(schoolId)) as Array<{
      name: string;
      className: string;
      department: string | null;
      answers: number;
      avgAccuracy: number;
    }>;

    return NextResponse.json({ ok: true, leaders: rows });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
