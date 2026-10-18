import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin, adminIdFrom, requireRole } from "@/lib/admin";

// GET ?adminId=&status=&limit=100 — payment history (success/failed/pending/mock).
export async function GET(req: Request) {
  let admin;
  try {
    admin = await requireAdmin(adminIdFrom(req));
    requireRole(admin, ["SUPER_ADMIN", "ADMIN"]);
  } catch {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const u = new URL(req.url);
  const status = u.searchParams.get("status") ?? "";
  const limit = Math.min(Number(u.searchParams.get("limit") ?? 100) || 100, 500);
  const db = await getDb();
  let rows = (await db
    .prepare(
      `SELECT t.id, t.email, t.reference, t.amount_kobo AS amountKobo, t.plan, t.status, t.channel, t.promo_code AS promoCode, t.created_at AS createdAt,
              u.name AS userName
       FROM transactions t LEFT JOIN users u ON u.id = t.user_id
       ORDER BY t.created_at DESC LIMIT 500`
    )
    .all()) as Array<Record<string, unknown>>;
  if (status) rows = rows.filter((r) => String(r.status) === status);
  const failed = rows.filter((r) => r.status === "failed").length;
  return NextResponse.json({ transactions: rows.slice(0, limit), total: rows.length, failed });
}
