import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// Pilot-gate metrics (PRD §6 checkpoints): retention, clarity, conversion, parent rate.
// Local evidence board; prod mirrors these in the hosted dashboard.
export async function GET() {
  const db = getDb();
  const users = (db.prepare("SELECT COUNT(*) AS n FROM users WHERE role = 'STUDENT'").get() as { n: number }).n;

  const attempts = (db.prepare("SELECT COUNT(*) AS n FROM attempts").get() as { n: number }).n;

  // Retention: students active on 2+ distinct days / all students with ≥1 attempt.
  const active = db
    .prepare("SELECT user_id AS u, COUNT(DISTINCT substr(created_at,1,10)) AS d FROM attempts GROUP BY user_id")
    .all() as { u: string; d: number }[];
  const retained = active.filter((a) => a.d >= 2).length;
  const retentionPct = active.length ? Math.round((retained / active.length) * 100) : 0;

  // Clarity proxy: MCQ first-attempt correct rate.
  const mcq = db
    .prepare(
      `SELECT a.correct AS c FROM attempts a JOIN questions q ON q.id = a.question_id
       WHERE q.type = 'MCQ' AND a.id IN (SELECT MIN(id) FROM attempts GROUP BY user_id, question_id)`
    )
    .all() as { c: number }[];
  const clarityPct = mcq.length ? Math.round((mcq.reduce((s, r) => s + r.c, 0) / mcq.length) * 100) : 0;

  // Conversion: UNLIMITED wallets / students who ever hit 0 credits (402s ≈ exhaustions).
  const paid = (db.prepare("SELECT COUNT(*) AS n FROM wallets WHERE plan = 'UNLIMITED'").get() as { n: number }).n;
  const exhausted = (db.prepare("SELECT COUNT(DISTINCT user_id) AS n FROM attempts WHERE credits_spent > 0 AND user_id IN (SELECT user_id FROM wallets WHERE credits_left = 0)").get() as { n: number }).n;

  // Parent rate: verified links / sent links.
  const links = db.prepare("SELECT COUNT(*) AS n FROM parent_links").get() as { n: number };
  const verified = db.prepare("SELECT COUNT(*) AS n FROM parent_links WHERE verified_at IS NOT NULL").get() as { n: number };
  const parentPct = links.n ? Math.round((verified.n / links.n) * 100) : 0;

  // Per-subject accuracy.
  const bySubject = db
    .prepare(
      `SELECT q.subject AS subject, ROUND(AVG(a.correct) * 100) AS accuracy, COUNT(*) AS attempts
       FROM attempts a JOIN questions q ON q.id = a.question_id GROUP BY q.subject`
    )
    .all();

  return NextResponse.json({
    students: users,
    attempts,
    retentionPct,
    retained,
    activeStudents: active.length,
    clarityPct,
    paid,
    exhausted,
    parentPct,
    linksSent: links.n,
    bySubject,
    gates: {
      retention70: retentionPct >= 70,
      note: "Pilot gate: >70% daily-active retention across the 5-day sprint."
    }
  });
}
