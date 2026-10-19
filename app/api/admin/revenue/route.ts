import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin, adminIdFrom, requireRole, PREVIEW_EMAIL } from "@/lib/admin";

// GET ?adminId= — revenue: monthly totals, by plan, by status, top subjects among paying users.
export async function GET(req: Request) {
  try {
    const admin = await requireAdmin(adminIdFrom(req));
    requireRole(admin, ["SUPER_ADMIN", "ADMIN"]);
  } catch {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const db = await getDb();
  const rows = (await db
    .prepare('SELECT amount_kobo AS "amountKobo", plan, status, SUBSTRING(created_at,1,7) AS month FROM transactions')
    .all()) as Array<{ amountKobo: number; plan: string; status: string; month: string }>;
  const paid = rows.filter((r) => r.status === "success" || r.status === "mock");
  const totalKobo = paid.reduce((s, r) => s + Number(r.amountKobo ?? 0), 0);
  const byMonth: Record<string, number> = {};
  for (const r of paid) byMonth[r.month ?? "unknown"] = (byMonth[r.month ?? "unknown"] ?? 0) + Number(r.amountKobo ?? 0);
  const monthly = Object.entries(byMonth)
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .slice(0, 12)
    .map(([month, kobo]) => ({ month, kobo }));
  const byPlan: Record<string, { count: number; kobo: number }> = {};
  for (const r of paid) {
    const p = r.plan || "UNLIMITED";
    byPlan[p] = byPlan[p] ?? { count: 0, kobo: 0 };
    byPlan[p].count++;
    byPlan[p].kobo += Number(r.amountKobo ?? 0);
  }
  const byStatus: Record<string, number> = {};
  for (const r of rows) byStatus[r.status] = (byStatus[r.status] ?? 0) + 1;
  // Top subjects among paying users (they paid for unlimited practice of these).
  const paidSubjects = (await db
    .prepare(
      `SELECT q.subject AS subject, COUNT(DISTINCT a.user_id) AS payers, COUNT(*) AS attempts
       FROM attempts a JOIN questions q ON q.id = a.question_id
       WHERE a.user_id IN (SELECT user_id FROM wallets WHERE plan = 'UNLIMITED')
       AND a.user_id NOT IN (SELECT id FROM users WHERE email = ?)
       GROUP BY q.subject ORDER BY payers DESC LIMIT 10`
    )
    .all(PREVIEW_EMAIL)) as Array<{ subject: string; payers: number; attempts: number }>;
  return NextResponse.json({
    totalKobo,
    paidCount: paid.length,
    monthly,
    byPlan: Object.entries(byPlan).map(([plan, v]) => ({ plan, ...v })),
    byStatus,
    paidSubjects
  });
}
