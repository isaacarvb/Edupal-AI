import { NextResponse } from "next/server";
import { getDb, uid } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { requireAdmin, adminIdFrom, requireRole, logAudit } from "@/lib/admin";

// GET ?q=&plan=&limit=50 — list users with plan + last active.
// POST {adminId, email, accessType, name?} — grant free/paid access (upsert).
// DELETE ?id=&adminId= — delete user (cascades).
export async function GET(req: Request) {
  let admin: { id: string };
  try {
    admin = await requireAdmin(adminIdFrom(req));
  } catch {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  void admin;
  const u = new URL(req.url);
  const q = (u.searchParams.get("q") ?? "").trim().toLowerCase();
  const plan = (u.searchParams.get("plan") ?? "").trim();
  const limit = Math.min(Number(u.searchParams.get("limit") ?? 50) || 50, 200);
  const db = await getDb();
  let rows = (await db
    .prepare(
      `SELECT u.id, u.name, u.email, u.role, u.created_at AS createdAt,
              COALESCE(w.plan,'FREE') AS plan, COALESCE(w.credits_left,0) AS credits,
              p.exam, p.subjects,
              (SELECT MAX(created_at) FROM attempts WHERE user_id = u.id) AS lastActive,
              (SELECT COUNT(*) FROM attempts WHERE user_id = u.id) AS attempts
       FROM users u LEFT JOIN wallets w ON w.user_id = u.id LEFT JOIN profiles p ON p.user_id = u.id
       ORDER BY u.created_at DESC LIMIT 500`
    )
    .all()) as Array<Record<string, unknown>>;
  if (q) rows = rows.filter((r) => String(r.email ?? "").toLowerCase().includes(q) || String(r.name ?? "").toLowerCase().includes(q));
  if (plan) rows = rows.filter((r) => String(r.plan) === plan);
  return NextResponse.json({ users: rows.slice(0, limit), total: rows.length });
}

const PLANS: Record<string, { plan: string; credits: number }> = {
  PILOT_3DAY: { plan: "PILOT", credits: 100 },
  FREE_FULL: { plan: "FREE", credits: 50 },
  UNLIMITED: { plan: "UNLIMITED", credits: 9999 },
  TRIAL: { plan: "PILOT", credits: 100 },
};

export async function POST(req: Request) {
  const { adminId, email, accessType, name } = await req.json();
  try {
    const admin = await requireAdmin(adminId ?? adminIdFrom(req));
    requireRole(admin, ["SUPER_ADMIN", "ADMIN"]);
  } catch {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const cleanEmail = String(email ?? "").trim().toLowerCase();
  if (!cleanEmail.includes("@")) return NextResponse.json({ error: "valid email required" }, { status: 400 });
  const cfg = PLANS[String(accessType ?? "PILOT_3DAY")] ?? PLANS.PILOT_3DAY;
  const db = await getDb();
  const now = new Date().toISOString();
  const existing = (await db.prepare("SELECT id FROM users WHERE email = ?").get(cleanEmail)) as { id: string } | undefined;
  if (existing) {
    await db.prepare("UPDATE wallets SET plan = ?, credits_left = ?, reset_at = ? WHERE user_id = ?").run(cfg.plan, cfg.credits, now, existing.id);
    await logAudit(db, adminId, `grant:${cfg.plan}`, cleanEmail);
    return NextResponse.json({ ok: true, userId: existing.id, created: false, plan: cfg.plan });
  }
  const id = uid();
  const tempPass = `Pilot-${Math.random().toString(36).slice(2, 8)}!`;
  await db.prepare("INSERT INTO users (id, name, email, password_hash, role, level) VALUES (?, ?, ?, ?, 'STUDENT', 'SECONDARY')").run(id, String(name ?? cleanEmail.split("@")[0]), cleanEmail, hashPassword(tempPass));
  await db.prepare("INSERT INTO wallets (user_id, credits_left, reset_at, plan) VALUES (?, ?, ?, ?)").run(id, cfg.credits, now, cfg.plan);
  await db.prepare("INSERT INTO streaks (user_id) VALUES (?)").run(id);
  await db.prepare("INSERT INTO profiles (user_id) VALUES (?)").run(id);
  await logAudit(db, adminId, `grant:${cfg.plan}:new`, cleanEmail);
  return NextResponse.json({ ok: true, userId: id, created: true, plan: cfg.plan, tempPassword: tempPass });
}

export async function DELETE(req: Request) {
  const u = new URL(req.url);
  const id = u.searchParams.get("id");
  let adminId = u.searchParams.get("adminId");
  if (!adminId) {
    try {
      const b = await req.json();
      adminId = b?.adminId ?? null;
    } catch { /* query-only */ }
  }
  try {
    const admin = await requireAdmin(adminId);
    requireRole(admin, ["SUPER_ADMIN", "ADMIN"]);
  } catch {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const db = await getDb();
  const target = (await db.prepare("SELECT email FROM users WHERE id = ?").get(id)) as { email: string } | undefined;
  await db.prepare("DELETE FROM users WHERE id = ?").run(id);
  await logAudit(db, adminId, "delete-user", target?.email ?? id);
  return NextResponse.json({ ok: true });
}
