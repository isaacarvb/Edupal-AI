import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// ?userId= → student dashboard payload. No param → internal pilot payload (see /admin).
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const db = await getDb();
  if (userId) {
    const att = await db.prepare("SELECT COUNT(*) AS n FROM attempts WHERE user_id = ?").get(userId) as { n: number };
    const acc = await db.prepare("SELECT AVG(correct) AS a FROM attempts WHERE user_id = ?").get(userId) as { a: number | null };
    const st = await db.prepare("SELECT current FROM streaks WHERE user_id = ?").get(userId) as { current: number } | undefined;
    const ready = await db.prepare("SELECT AVG(accuracy) AS a FROM topic_mastery WHERE user_id = ?").get(userId) as { a: number | null };
    const bySubject = await db
      .prepare(
        `SELECT q.subject AS subject, ROUND(AVG(a.correct) * 100) AS accuracy, COUNT(*) AS attempts
         FROM attempts a JOIN questions q ON q.id = a.question_id
         WHERE a.user_id = ? GROUP BY q.subject ORDER BY accuracy ASC`
      )
      .all(userId);
    return NextResponse.json({
      totalPracticed: att.n,
      avgAccuracy: acc.a === null ? 0 : Math.round(acc.a * 100),
      streak: st?.current ?? 0,
      readiness: ready.a === null ? 0 : Math.round(ready.a),
      bySubject
    });
  }

  // NOTE: Postgres returns COUNT(*) as text — Number() keeps guards honest on both engines.
  const users = Number((await db.prepare("SELECT COUNT(*) AS n FROM users WHERE role = 'STUDENT'").get() as { n: number }).n);
  const attempts = Number((await db.prepare("SELECT COUNT(*) AS n FROM attempts").get() as { n: number }).n);
  const active = await db
    .prepare("SELECT user_id AS u, COUNT(DISTINCT SUBSTRING(created_at,1,10)) AS d FROM attempts GROUP BY user_id")
    .all() as { u: string; d: number }[];
  const retained = active.filter((a) => Number(a.d) >= 2).length;
  const retentionPct = active.length ? Math.round((retained / active.length) * 100) : 0;
  const mcq = await db
    .prepare(
      `SELECT a.correct AS c FROM attempts a JOIN questions q ON q.id = a.question_id
       WHERE q.type = 'MCQ' AND a.id IN (SELECT MIN(id) FROM attempts GROUP BY user_id, question_id)`
    )
    .all() as { c: number }[];
  const clarityPct = mcq.length ? Math.round((mcq.reduce((s, r) => s + r.c, 0) / mcq.length) * 100) : 0;
  const paid = Number((await db.prepare("SELECT COUNT(*) AS n FROM wallets WHERE plan = 'UNLIMITED'").get() as { n: number }).n);
  const exhausted = Number((await db.prepare("SELECT COUNT(DISTINCT user_id) AS n FROM attempts WHERE credits_spent > 0 AND user_id IN (SELECT user_id FROM wallets WHERE credits_left = 0)").get() as { n: number }).n);
  const links = Number((await db.prepare("SELECT COUNT(*) AS n FROM parent_links").get() as { n: number }).n);
  const verified = Number((await db.prepare("SELECT COUNT(*) AS n FROM parent_links WHERE verified_at IS NOT NULL").get() as { n: number }).n);
  const parentPct = links ? Math.round((verified / links) * 100) : 0;
  const bySubject = await db
    .prepare(
      `SELECT q.subject AS subject, ROUND(AVG(a.correct) * 100) AS accuracy, COUNT(*) AS attempts
       FROM attempts a JOIN questions q ON q.id = a.question_id GROUP BY q.subject`
    )
    .all();
  return NextResponse.json({
    students: users, attempts, retentionPct, retained, activeStudents: active.length,
    clarityPct, paid, exhausted, parentPct, linksSent: links, bySubject,
    gates: { retention70: retentionPct >= 70, note: "Pilot gate: >70% daily-active retention across the 5-day sprint." }
  });
}
