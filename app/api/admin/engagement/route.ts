import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin, adminIdFrom, PREVIEW_EMAIL } from "@/lib/admin";

// GET ?adminId= — engagement: popular subjects, avg scores, 14-day activity, sleeping users.
// Preview student excluded so your own previews never pollute real numbers.
const NO_PREVIEW = "a.user_id NOT IN (SELECT id FROM users WHERE email = ?)";

export async function GET(req: Request) {
  try {
    await requireAdmin(adminIdFrom(req));
  } catch {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const db = await getDb();
  const popular = (await db
    .prepare(
      `SELECT q.subject AS subject, COUNT(*) AS attempts, COUNT(DISTINCT a.user_id) AS users
       FROM attempts a JOIN questions q ON q.id = a.question_id
       WHERE ${NO_PREVIEW}
       GROUP BY q.subject ORDER BY attempts DESC LIMIT 12`
    )
    .all(PREVIEW_EMAIL)) as Array<{ subject: string; attempts: number; users: number }>;
  const avgScores = (await db
    .prepare(
      `SELECT q.subject AS subject, ROUND(AVG(a.correct) * 100) AS avg, COUNT(*) AS attempts
       FROM attempts a JOIN questions q ON q.id = a.question_id
       WHERE ${NO_PREVIEW}
       GROUP BY q.subject ORDER BY avg ASC LIMIT 12`
    )
    .all(PREVIEW_EMAIL)) as Array<{ subject: string; avg: number; attempts: number }>;
  const days: Array<{ day: string; users: number; attempts: number }> = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    const r = (await db
      .prepare("SELECT COUNT(DISTINCT user_id) AS users, COUNT(*) AS attempts FROM attempts WHERE user_id NOT IN (SELECT id FROM users WHERE email = ?) AND SUBSTRING(created_at,1,10) = ?")
      .get(PREVIEW_EMAIL, d)) as { users: number; attempts: number };
    days.push({ day: d.slice(5), users: Number(r.users ?? 0), attempts: Number(r.attempts ?? 0) });
  }
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
  const sleeping = (await db
    .prepare(
      `SELECT u.id, u.name, u.email, MAX(a.created_at) AS "lastActive", COUNT(a.id) AS attempts
       FROM users u LEFT JOIN attempts a ON a.user_id = u.id
       WHERE u.role = 'STUDENT' AND u.email != ?
       GROUP BY u.id, u.name, u.email
       HAVING MAX(a.created_at) IS NULL OR MAX(a.created_at) < ?
       ORDER BY lastActive ASC LIMIT 50`
    )
    .all(PREVIEW_EMAIL, weekAgo)) as Array<{ id: string; name: string; email: string; lastActive: string | null; attempts: number }>;
  return NextResponse.json({ popular, avgScores, daily: days, sleeping, sleepingCount: sleeping.length });
}
