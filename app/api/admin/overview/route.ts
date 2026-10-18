import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin, adminIdFrom, PREVIEW_EMAIL } from "@/lib/admin";

// Admin Dashboard numbers: total / free / paid, new today, DAU/WAU, attempts.
// The preview student is excluded everywhere so previews never pollute real numbers.
const NO_PREVIEW = "user_id NOT IN (SELECT id FROM users WHERE email = ?)";

export async function GET(req: Request) {
  try {
    await requireAdmin(adminIdFrom(req));
  } catch {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const db = await getDb();
  const today = new Date().toISOString().slice(0, 10);
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
  const n = async (sql: string, ...p: unknown[]) => Number((((await db.prepare(sql).get(...p)) as { n: number })?.n) ?? 0);
  const total = await n("SELECT COUNT(*) AS n FROM users WHERE role = 'STUDENT' AND email != ?", PREVIEW_EMAIL);
  const paid = await n("SELECT COUNT(*) AS n FROM wallets WHERE plan = 'UNLIMITED' AND user_id NOT IN (SELECT id FROM users WHERE email = ?)", PREVIEW_EMAIL);
  const free = await n("SELECT COUNT(*) AS n FROM wallets WHERE plan != 'UNLIMITED' AND user_id NOT IN (SELECT id FROM users WHERE email = ?)", PREVIEW_EMAIL);
  const newToday = await n("SELECT COUNT(*) AS n FROM users WHERE role = 'STUDENT' AND email != ? AND SUBSTRING(created_at,1,10) = ?", PREVIEW_EMAIL, today);
  const attemptsToday = await n(`SELECT COUNT(*) AS n FROM attempts WHERE ${NO_PREVIEW} AND SUBSTRING(created_at,1,10) = ?`, PREVIEW_EMAIL, today);
  const attemptsTotal = await n(`SELECT COUNT(*) AS n FROM attempts WHERE ${NO_PREVIEW}`, PREVIEW_EMAIL);
  const dau = await n(`SELECT COUNT(DISTINCT user_id) AS n FROM attempts WHERE ${NO_PREVIEW} AND SUBSTRING(created_at,1,10) = ?`, PREVIEW_EMAIL, today);
  const wau = await n(`SELECT COUNT(DISTINCT user_id) AS n FROM attempts WHERE ${NO_PREVIEW} AND SUBSTRING(created_at,1,10) >= ?`, PREVIEW_EMAIL, weekAgo);
  const admins = await n("SELECT COUNT(*) AS n FROM users WHERE role IN ('ADMIN','SUPER_ADMIN','CONTENT_ADMIN')");
  const questions = await n("SELECT COUNT(*) AS n FROM questions");
  const flagged = await n("SELECT COUNT(*) AS n FROM attempts WHERE flagged = 1");
  const drafts = await n("SELECT COUNT(*) AS n FROM draft_questions WHERE status = 'pending'");
  const maint = ((await db.prepare("SELECT value FROM site_settings WHERE key = 'maintenance'").get()) as { value: string } | undefined)?.value === "1";
  return NextResponse.json({ total, free, paid, newToday, attemptsToday, attemptsTotal, dau, wau, admins, questions, flagged, drafts, maintenance: maint });
}
