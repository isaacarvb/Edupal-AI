import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireSchoolAdmin } from "@/lib/schools";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const db = await getDb();
  try {
    const { school } = await requireSchoolAdmin(db, userId);
    const sid = school.id;
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);

    const summary = (await db
      .prepare(
        `SELECT
           (SELECT COUNT(*) FROM school_members WHERE school_id = ?) AS "totalStudents",
           (SELECT COUNT(DISTINCT a.user_id) FROM attempts a JOIN school_members sm ON sm.user_id = a.user_id
             WHERE sm.school_id = ? AND SUBSTRING(a.created_at,1,10) >= ?) AS "activeWeek",
           (SELECT COUNT(*) FROM attempts a JOIN school_members sm ON sm.user_id = a.user_id
             WHERE sm.school_id = ? AND SUBSTRING(a.created_at,1,10) >= ?) AS "totalAnswers",
           (SELECT COALESCE(ROUND(AVG(st.current)), 0) FROM streaks st JOIN school_members sm ON sm.user_id = st.user_id
             WHERE sm.school_id = ?) AS "avgStreak"`
      )
      .get(sid, sid, weekAgo, sid, weekAgo, sid)) as Record<string, number>;

    const classes = (await db
      .prepare(
        `SELECT COALESCE(NULLIF(sm.class_name, ''), 'Unassigned') AS "className",
                COUNT(*) AS students,
                COUNT(DISTINCT CASE WHEN SUBSTRING(a.created_at,1,10) >= ? THEN a.user_id END) AS "activeWeek",
                COALESCE(ROUND(AVG(st.current)), 0) AS "avgAccuracy"
         FROM school_members sm
         LEFT JOIN streaks st ON st.user_id = sm.user_id
         LEFT JOIN attempts a ON a.user_id = sm.user_id AND SUBSTRING(a.created_at,1,10) >= ?
         WHERE sm.school_id = ?
         GROUP BY COALESCE(NULLIF(sm.class_name, ''), 'Unassigned')`
      )
      .all(weekAgo, weekAgo, sid)) as Array<Record<string, unknown>>;

    const subjects = (await db
      .prepare(
        `SELECT tm.subject,
                COUNT(DISTINCT sm.user_id) AS students,
                ROUND(AVG(tm.accuracy)) AS "avgAccuracy",
                SUM(CASE WHEN tm.label = 'WEAK' THEN 1 ELSE 0 END) AS "weakCount"
         FROM topic_mastery tm
         JOIN school_members sm ON sm.user_id = tm.user_id
         WHERE sm.school_id = ?
         GROUP BY tm.subject
         ORDER BY students DESC`
      )
      .all(sid)) as Array<Record<string, unknown>>;

    const teachers = (await db
      .prepare(
        `SELECT u.name, tm.subject,
                 COALESCE(NULLIF(sm.class_name, ''), 'Unassigned') AS "className",
                 COUNT(DISTINCT sm.user_id) AS students,
                 COUNT(DISTINCT a.id) AS answers
         FROM school_teachers st
         LEFT JOIN school_members sm ON sm.school_id = st.school_id AND sm.class_name = (
           SELECT class_name FROM school_members sm2 WHERE sm2.user_id = st.user_id LIMIT 1
         )
         LEFT JOIN attempts a ON a.user_id = sm.user_id
         WHERE st.school_id = ?
         GROUP BY st.id, st.name, tm.subject, sm.class_name
         ORDER BY answers DESC`
      )
      .all(sid)) as Array<Record<string, unknown>>;

    const topTopics = (await db
      .prepare(
        `SELECT tm.subject, tm.topic, ROUND(AVG(tm.accuracy)) AS accuracy, COUNT(*) AS students
         FROM topic_mastery tm
         JOIN school_members sm ON sm.user_id = tm.user_id
         WHERE sm.school_id = ?
         GROUP BY tm.subject, tm.topic
         ORDER BY students DESC LIMIT 10`
      )
      .all(sid)) as Array<Record<string, unknown>>;

    return NextResponse.json({
      summary: {
        totalStudents: Number(summary.totalStudents ?? 0),
        activeWeek: Number(summary.activeWeek ?? 0),
        totalAnswers: Number(summary.totalAnswers ?? 0),
        avgStreak: Number(summary.avgStreak ?? 0),
        classes: classes.map((c) => ({
          className: String(c.className),
          students: Number(c.students),
          activeWeek: Number(c.activeWeek),
          avgAccuracy: Number(c.avgAccuracy)
        })),
        subjects: subjects.map((s) => ({
          subject: String(s.subject),
          students: Number(s.students),
          avgAccuracy: Number(s.avgAccuracy),
          weakCount: Number(s.weakCount)
        })),
        teachers: teachers.map((t) => ({
          name: String(t.name),
          subject: String(t.subject),
          className: String(t.className),
          students: Number(t.students),
          answers: Number(t.answers)
        })),
        topTopics: topTopics.map((t) => ({
          subject: String(t.subject),
          topic: String(t.topic),
          accuracy: Number(t.accuracy),
          students: Number(t.students)
        }))
      }
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: e instanceof Error && e.message.includes("forbidden") ? 403 : 500 });
  }
}
