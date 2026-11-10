import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin, adminIdFrom, requireRole } from "@/lib/admin";

const PLANS: Record<string, { plan: string; credits: number }> = {
  PILOT_3DAY: { plan: "PILOT", credits: 100 },
  FREE_FULL: { plan: "FREE", credits: 50 },
  UNLIMITED: { plan: "UNLIMITED", credits: 9999 },
  TRIAL: { plan: "PILOT", credits: 100 },
};

// POST {adminId, email, accessType, days?, startAt?}
// Grants or renews school portal access by matching the school admin email.
// Access types: PILOT_3DAY / TRIAL (custom days), FREE_FULL (no expiry),
// UNLIMITED (custom days). Mirrors the Users "Give free access" flow.
export async function POST(req: Request) {
  try {
    const admin = await requireAdmin(adminIdFrom(req));
    requireRole(admin, ["SUPER_ADMIN", "ADMIN"]);
  } catch {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { adminId, email, accessType, days, startAt } = await req.json();
  const db = await getDb();
  const cleanEmail = String(email ?? "").trim().toLowerCase();

  if (!cleanEmail.includes("@")) {
    return NextResponse.json({ error: "valid email required" }, { status: 400 });
  }

  // Find the school whose admin email matches.
  const school = (await db.prepare(
    `SELECT s.id, s.name, s.code, s.email AS "schoolEmail", s.active, s.expires_at, s.admin_user_id, s.admin_emails
     FROM schools s
     WHERE LOWER(s.admin_emails) = LOWER(?) OR LOWER(s.email) = LOWER(?) OR LOWER(s.admin_emails) LIKE LOWER(?)
     LIMIT 1`
  ).get(cleanEmail, cleanEmail, `%${cleanEmail}%`)) as
    | { id: string; name: string; code: string; schoolEmail: string | null; active: number; expires_at: string | null; admin_user_id: string | null; admin_emails: string }
    | undefined;

  if (!school) {
    return NextResponse.json({ error: "School not found with that admin email." }, { status: 404 });
  }

  const cfg = PLANS[String(accessType ?? "PILOT_3DAY")] ?? PLANS.PILOT_3DAY;
  const now = new Date().toISOString();

  let grantUntil: string | null = null;
  if (cfg.plan !== "FREE") {
    const defDays = cfg.plan === "PILOT" ? 3 : 30;
    const dNum = Number(days);
    const useDays = Number.isFinite(dNum) && dNum > 0 ? Math.min(3650, Math.floor(dNum)) : defDays;
    let startMs = Date.now();
    if (startAt) {
      const parsed = Date.parse(String(startAt));
      if (Number.isFinite(parsed)) startMs = parsed;
    }
    grantUntil = new Date(startMs + useDays * 86400000).toISOString();
  }

  await db.prepare(
    "UPDATE schools SET active = 1, expires_at = ? WHERE id = ?"
  ).run(grantUntil, school.id);

  return NextResponse.json({
    ok: true,
    schoolId: school.id,
    name: school.name,
    code: school.code,
    plan: cfg.plan,
    expiresAt: grantUntil
  });
}
