import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get("schoolId");
    if (!schoolId) return NextResponse.json({ error: "schoolId required" }, { status: 400 });

    const db = await getDb();

    // Get classes
    const classes = (await db.prepare(
      "SELECT DISTINCT class_name AS className FROM school_students WHERE school_id = ? AND class_name != '' ORDER BY class_name"
    ).all(schoolId)) as Array<{ className: string }>;

    const result: Record<string, Array<{ name: string; answers: number; avgAccuracy: number }>> = {};

    for (const { className } of classes) {
      const sql =
        "SELECT ss.name AS name, " +
        "COUNT(a.id) AS answers, " +
        "COALESCE(ROUND(AVG(tm.accuracy)), 0) AS avgAccuracy " +
        "FROM school_students ss " +
        "LEFT JOIN users u ON u.id = ss.user_id " +
        "LEFT JOIN attempts a ON a.user_id = u.id " +
        "LEFT JOIN topic_mastery tm ON tm.user_id = u.id " +
        "WHERE ss.school_id = ? AND ss.class_name = ? " +
        "GROUP BY ss.id, ss.name " +
        "ORDER BY answers DESC " +
        "LIMIT 5";

      const rows = (await db.prepare(sql).all(schoolId, className)) as Array<{
        name: string;
        answers: number;
        avgAccuracy: number;
      }>;
      result[className] = rows;
    }

    return NextResponse.json({ ok: true, leaderboard: result });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
