import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin, adminIdFrom, requireRole, logAudit } from "@/lib/admin";
import { getSiteSettings, invalidateSiteSettings } from "@/lib/site-settings";

// GET ?adminId= — maintenance flag + free-plan ("pilot") rules.
// POST {adminId, maintenance?, freeDailyLimit?, freeResetDays?, freeResetTime?}
//   — any subset of fields; only the ones provided are changed, and every
//     change reflects on the user side within seconds (no redeploy).

const TIME_RE = /^([01]?\d|2[0-3]):[0-5]\d$/;

async function putSetting(db: Awaited<ReturnType<typeof getDb>>, key: string, value: string) {
  await db.prepare("INSERT INTO site_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").run(key, value);
}

export async function GET(req: Request) {
  try {
    await requireAdmin(adminIdFrom(req));
  } catch {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const s = await getSiteSettings();
  const db = await getDb();
  const row = (await db.prepare("SELECT value FROM site_settings WHERE key = 'maintenance'").get()) as { value: string } | undefined;
  return NextResponse.json({
    maintenance: row?.value === "1",
    freeDailyLimit: s.freeDailyLimit,
    freeResetDays: s.freeResetDays,
    freeResetTime: s.freeResetTime
  });
}

export async function POST(req: Request) {
  const b = await req.json();
  try {
    const admin = await requireAdmin(b?.adminId ?? adminIdFrom(req));
    requireRole(admin, ["SUPER_ADMIN", "ADMIN"]);
  } catch {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const db = await getDb();
  const changed: string[] = [];

  if (typeof b?.maintenance === "boolean") {
    const v = b.maintenance ? "1" : "0";
    await putSetting(db, "maintenance", v);
    changed.push(`maintenance:${v}`);
  }

  if (b?.freeDailyLimit !== undefined) {
    const n = Math.floor(Number(b.freeDailyLimit));
    if (!Number.isFinite(n) || n < 1 || n > 500) return NextResponse.json({ error: "daily limit must be 1–500" }, { status: 400 });
    const s0 = await getSiteSettings();
    await putSetting(db, "free_daily_limit", String(n));
    if (n !== s0.freeDailyLimit) {
      // Bump the refill marker so everyone sees the new allowance immediately.
      await putSetting(db, "free_limit_changed_at", String(Date.now()));
    }
    changed.push(`free_daily_limit:${n}`);
  }

  if (b?.freeResetDays !== undefined) {
    const n = Math.floor(Number(b.freeResetDays));
    if (!Number.isFinite(n) || n < 1 || n > 30) return NextResponse.json({ error: "reset days must be 1–30" }, { status: 400 });
    await putSetting(db, "free_reset_days", String(n));
    changed.push(`free_reset_days:${n}`);
  }

  if (b?.freeResetTime !== undefined) {
    const t = String(b.freeResetTime);
    if (!TIME_RE.test(t)) return NextResponse.json({ error: "time must look like 00:00 or 18:30" }, { status: 400 });
    await putSetting(db, "free_reset_time", t);
    changed.push(`free_reset_time:${t}`);
  }

  if (changed.length === 0) return NextResponse.json({ error: "nothing to change" }, { status: 400 });
  invalidateSiteSettings();
  await logAudit(db, b?.adminId, `settings:${changed.join(",")}`, "");

  const s = await getSiteSettings();
  return NextResponse.json({ ok: true, freeDailyLimit: s.freeDailyLimit, freeResetDays: s.freeResetDays, freeResetTime: s.freeResetTime });
}
