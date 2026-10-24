import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import {
  requireSchoolTeacher,
  getTeacherById,
  getSchoolById,
  getSchoolTeachers
} from "@/lib/schools";
import { countMembers } from "@/lib/schools";

// GET ?userId= — teacher's classes with roster + activity stats.
// Teacher sees only their own classes.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const db = await getDb();
  try {
    const { teacher, school } = await requireSchoolTeacher(db, userId);
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
    const classes = [];

    for (const className of teacher.classes) {
      const members = (await db
        .prepare(
          `SELECT u.id AS "userId", u.name, u.email,
                  s.current AS streak,
                  (SELECT COUNT(*) FROM attempts a WHERE a.user_id = u.id AND SUBSTRING(a.created_at,1,10) >= ?) AS "answersWeek"
           FROM school_members sm
           JOIN users u ON u.id = sm.user_id
           LEFT JOIN streaks s ON s.user_id = u.id
           WHERE sm.school_id = ? AND sm.class_name = ?
           ORDER BY u.name`
        )
        .all(weekAgo, school.id, className)) as Array<Record<string, unknown>>;

      const weakTopics = (await db
        .prepare(
          `SELECT tm.subject, tm.topic, COUNT(*) AS students, ROUND(AVG(tm.accuracy)) AS accuracy
           FROM topic_mastery tm JOIN school_members sm ON sm.user_id = tm.user_id
           WHERE sm.school_id = ? AND sm.class_name = ? AND tm.label = 'WEAK'
           GROUP BY tm.subject, tm.topic ORDER BY accuracy ASC LIMIT 5`
        )
        .all(school.id, className)) as Array<Record<string, unknown>>;

      classes.push({
        className,
        students: members.map((m) => ({
          userId: String(m.userId),
          name: String(m.name ?? ""),
          email: String(m.email ?? ""),
          streak: Number(m.streak ?? 0),
          answersWeek: Number(m.answersWeek ?? 0)
        })),
        studentCount: members.length,
        weakTopics: weakTopics.map((w) => ({
          subject: String(w.subject ?? ""),
          topic: String(w.topic ?? ""),
          students: Number(w.students ?? 0),
          accuracy: Number(w.accuracy ?? 0)
        }))
      });
    }

    return NextResponse.json({
      teacher: { id: teacher.id, name: teacher.name, email: teacher.email, classes: teacher.classes },
      school: { id: school.id, name: school.name, code: school.code },
      classes
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: e instanceof Error && e.message.includes("forbidden") ? 403 : 500 });
  }
}
