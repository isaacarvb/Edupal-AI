import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireSchoolAdmin } from "@/lib/schools";

// GET ?userId= — school-wide performance overview for the portal dashboard.
// Every query is scoped to the school's own members (tenant isolation).
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const db = await getDb();
  try {
    const { school } = await requireSchoolAdmin(db, userId);
    const sid = school.id;
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);

    // Headline numbers: size, engagement this week, effort, average streak.
    const summary = (await db
      .prepare(
        `SELECT
           (SELECT COUNT(*) FROM school_members WHERE school_id = ?) AS total,
           (SELECT COUNT(DISTINCT a.user_id) FROM attempts a JOIN school_members sm ON sm.user_id = a.user_id
             WHERE sm.school_id = ? AND SUBSTRING(a.created_at,1,10) >= ?) AS "activeWeek",
           (SELECT COUNT(*) FROM attempts a JOIN school_members sm ON sm.user_id = a.user_id
             WHERE sm.school_id = ? AND SUBSTRING(a.created_at,1,10) >= ?) AS answers,
           (SELECT COALESCE(ROUND(AVG(st.current)), 0) FROM streaks st JOIN school_members sm ON sm.user_id = st.user_id
             WHERE sm.school_id = ?) AS "avgStreak"`
      )
      .get(sid, sid, weekAgo, sid, weekAgo, sid)) as Record<string, number>;

    // Weakest topics across the whole school — the VP Academics view.
    const weak = (await db
      .prepare(
        `SELECT tm.subject, tm.topic, COUNT(*) AS students, ROUND(AVG(tm.accuracy)) AS accuracy
         FROM topic_mastery tm JOIN school_members sm ON sm.user_id = tm.user_id
         WHERE sm.school_id = ? AND tm.label = 'WEAK'
         GROUP BY tm.subject, tm.topic ORDER BY accuracy ASC, students DESC LIMIT 8`
      )
      .all(sid)) as Array<{ subject: string; topic: string; students: number | string; accuracy: number | string }>;

    // Per-class table. Two queries (sizes+streaks, then activity) so the
    // attempts join never duplicates streak rows and skews the average.
    const classSizes = (await db
      .prepare(
        `SELECT COALESCE(NULLIF(sm.class_name, ''), 'Unassigned') AS "className",
                COUNT(*) AS students,
                COALESCE(ROUND(AVG(st.current)), 0) AS "avgStreak"
         FROM school_members sm
         LEFT JOIN streaks st ON st.user_id = sm.user_id
         WHERE sm.school_id = ?
         GROUP BY COALESCE(NULLIF(sm.class_name, ''), 'Unassigned')`
      )
      .all(sid)) as Array<{ className: string; students: number | string; avgStreak: number | string }>;
    const classActive = (await db
      .prepare(
        `SELECT COALESCE(NULLIF(sm.class_name, ''), 'Unassigned') AS "className",
                COUNT(DISTINCT a.user_id) AS "activeWeek"
         FROM attempts a JOIN school_members sm ON sm.user_id = a.user_id
         WHERE sm.school_id = ? AND SUBSTRING(a.created_at,1,10) >= ?
         GROUP BY COALESCE(NULLIF(sm.class_name, ''), 'Unassigned')`
      )
      .all(sid, weekAgo)) as Array<{ className: string; activeWeek: number | string }>;
    const activeByClass = new Map(classActive.map((c) => [c.className, Number(c.activeWeek)]));
    const classes = classSizes.map((c) => ({
      className: c.className,
      students: Number(c.students),
      activeWeek: activeByClass.get(c.className) ?? 0,
      avgStreak: Number(c.avgStreak)
    })).sort((a, b) => b.activeWeek - a.activeWeek || b.students - a.students);

    // Top performers this week (answers given) — recognition board.
    const top = (await db
      .prepare(
        `SELECT u.name, COALESCE(NULLIF(sm.class_name, ''), 'Unassigned') AS "className", COUNT(*) AS answers
         FROM attempts a
         JOIN school_members sm ON sm.user_id = a.user_id
         JOIN users u ON u.id = a.user_id
         WHERE sm.school_id = ? AND SUBSTRING(a.created_at,1,10) >= ?
         GROUP BY u.name, sm.class_name ORDER BY answers DESC LIMIT 10`
      )
      .all(sid, weekAgo)) as Array<{ name: string | null; className: string; answers: number | string }>;

    return NextResponse.json({
      summary: {
        total: Number(summary.total ?? 0),
        activeWeek: Number(summary.activeWeek ?? 0),
        answers: Number(summary.answers ?? 0),
        avgStreak: Number(summary.avgStreak ?? 0)
      },
      weak: weak.map((w) => ({ ...w, students: Number(w.students), accuracy: Number(w.accuracy) })),
      classes: classes.map((c) => ({ className: c.className, students: Number(c.students), activeWeek: Number(c.activeWeek), avgStreak: Number(c.avgStreak) })),
      top: top.map((t) => ({ name: t.name ?? "", className: t.className, answers: Number(t.answers) }))
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: e instanceof Error && e.message.includes("forbidden") ? 403 : 500 });
  }
}
