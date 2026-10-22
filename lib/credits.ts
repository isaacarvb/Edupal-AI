import type { Db } from "./db";
import { getSiteSettings, subjectPeriodKey, currentPeriodStart } from "./site-settings";

// Fallback only — the live limit comes from site settings (admin → Settings).
export const DAILY_FREE = 10;
export const SUBJECT_DAILY_LIMIT = 10;

export type Wallet = { creditsLeft: number; plan: "FREE" | "UNLIMITED"; paidUntil: string | null };

// Per-subject daily free budget. UNLIMITED plans bypass checks entirely.
export async function getSubjectLeft(db: Db, userId: string, subject: string, plan: "FREE" | "UNLIMITED"): Promise<number> {
  const s = await getSiteSettings();
  if (plan === "UNLIMITED") return s.freeDailyLimit;
  const key = subjectPeriodKey(s);
  const row = await db
    .prepare("SELECT used FROM subject_usage WHERE user_id = ? AND subject = ? AND day = ?")
    .get(userId, subject, key) as { used: number } | undefined;
  return s.freeDailyLimit - (row?.used ?? 0);
}

export async function consumeSubject(db: Db, userId: string, subject: string, cost: number): Promise<void> {
  const s = await getSiteSettings();
  const key = subjectPeriodKey(s);
  await db.prepare(
    `INSERT INTO subject_usage (user_id, subject, day, used) VALUES (?, ?, ?, ?)
     ON CONFLICT(user_id, subject, day) DO UPDATE SET used = subject_usage.used + excluded.used`
  ).run(userId, subject, key, cost);
}

// Remaining free answers per subject (for dashboard pills + paywall logic).
// UNLIMITED plans report the daily limit; clients check plan for the ∞ display.
export async function subjectLimits(db: Db, userId: string, subjects: string[], plan: "FREE" | "UNLIMITED"): Promise<{ subject: string; left: number }[]> {
  const out: { subject: string; left: number }[] = [];
  for (const s of subjects) {
    out.push({ subject: s, left: await getSubjectLeft(db, userId, s, plan) });
  }
  return out;
}

// Free wallets refill at the admin-set period (days + time, Lagos) and whenever
// the admin changes the daily limit. UNLIMITED and PILOT run inside their
// paid_from..paid_until window, then fall back to FREE (no lockout).
export async function getWallet(db: Db, userId: string): Promise<Wallet | null> {
  const s = await getSiteSettings();
  const w = await db
    .prepare('SELECT credits_left AS "creditsLeft", reset_at AS "resetAt", plan, paid_until AS "paidUntil", paid_from AS "paidFrom" FROM wallets WHERE user_id = ?')
    .get(userId) as { creditsLeft: number; resetAt: string; plan: string; paidUntil: string | null; paidFrom: string | null } | undefined;
  if (!w) return null;

  const now = Date.now();
  const fromMs = w.paidFrom ? Date.parse(w.paidFrom) : NaN;
  const untilMs = w.paidUntil ? Date.parse(w.paidUntil) : NaN;
  const started = !Number.isFinite(fromMs) || fromMs <= now;
  const windowOpen =
    started &&
    (w.plan === "UNLIMITED"
      ? !Number.isFinite(untilMs) || untilMs > now // legacy rows without a date stay active
      : w.plan === "PILOT" && Number.isFinite(untilMs) && untilMs > now); // pilots are always time-boxed

  if ((w.plan === "UNLIMITED" || w.plan === "PILOT") && windowOpen) {
    return { creditsLeft: w.creditsLeft, plan: "UNLIMITED", paidUntil: w.paidUntil };
  }

  // Grant exists but hasn't started yet → free view now, full access at startAt.
  const futureStart = (w.plan === "UNLIMITED" || w.plan === "PILOT") && !started;
  const expired =
    (w.plan === "UNLIMITED" || w.plan === "PILOT") && started && Number.isFinite(untilMs) && untilMs <= now;

  if ((futureStart || expired) && w.plan !== "FREE") {
    if (futureStart) return { creditsLeft: w.creditsLeft, plan: "FREE", paidUntil: w.paidUntil };
    // Expired → graceful drop to free with a fresh allowance.
    await db.prepare("UPDATE wallets SET plan = 'FREE', credits_left = ?, reset_at = ?, paid_from = NULL WHERE user_id = ?").run(s.freeDailyLimit, new Date(now).toISOString(), userId);
    return { creditsLeft: s.freeDailyLimit, plan: "FREE", paidUntil: w.paidUntil };
  }

  // FREE: refill when the current period started after the last reset,
  // or when the admin just changed the daily limit.
  const refillAt = Math.max(currentPeriodStart(s.freeResetDays, s.freeResetTime, now), s.freeLimitChangedAt);
  if (Date.parse(w.resetAt) < refillAt || w.creditsLeft > s.freeDailyLimit) {
    const iso = new Date(now).toISOString();
    await db.prepare("UPDATE wallets SET credits_left = ?, reset_at = ? WHERE user_id = ?").run(s.freeDailyLimit, iso, userId);
    return { creditsLeft: s.freeDailyLimit, plan: "FREE", paidUntil: w.paidUntil };
  }
  return { creditsLeft: w.creditsLeft, plan: "FREE", paidUntil: w.paidUntil };
}
