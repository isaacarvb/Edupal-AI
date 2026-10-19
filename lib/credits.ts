import type { Db } from "./db";

export const DAILY_FREE = 10;
export const SUBJECT_DAILY_LIMIT = 10;
const DAY_MS = 24 * 3600 * 1000;

export type Wallet = { creditsLeft: number; plan: "FREE" | "UNLIMITED"; paidUntil: string | null };

// Per-subject daily free budget. UNLIMITED plans bypass checks entirely.
export async function getSubjectLeft(db: Db, userId: string, subject: string, plan: "FREE" | "UNLIMITED"): Promise<number> {
  if (plan === "UNLIMITED") return SUBJECT_DAILY_LIMIT;
  const today = new Date().toISOString().slice(0, 10);
  const row = await db
    .prepare("SELECT used FROM subject_usage WHERE user_id = ? AND subject = ? AND day = ?")
    .get(userId, subject, today) as { used: number } | undefined;
  return SUBJECT_DAILY_LIMIT - (row?.used ?? 0);
}

export async function consumeSubject(db: Db, userId: string, subject: string, cost: number): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);
  await db.prepare(
    `INSERT INTO subject_usage (user_id, subject, day, used) VALUES (?, ?, ?, ?)
     ON CONFLICT(user_id, subject, day) DO UPDATE SET used = subject_usage.used + excluded.used`
  ).run(userId, subject, today, cost);
}

// Remaining free answers per subject (for dashboard pills + paywall logic).
// UNLIMITED plans report SUBJECT_DAILY_LIMIT; clients check plan for the ∞ display.
export async function subjectLimits(db: Db, userId: string, subjects: string[], plan: "FREE" | "UNLIMITED"): Promise<{ subject: string; left: number }[]> {
  const out: { subject: string; left: number }[] = [];
  for (const s of subjects) {
    out.push({ subject: s, left: plan === "UNLIMITED" ? SUBJECT_DAILY_LIMIT : await getSubjectLeft(db, userId, s, plan) });
  }
  return out;
}

// 24h auto-reset for FREE wallets. UNLIMITED runs until paid_until, then
// reverts to FREE (no lockout — they keep the daily free allowance).
export async function getWallet(db: Db, userId: string): Promise<Wallet | null> {
  const w = await db
    .prepare('SELECT credits_left AS "creditsLeft", reset_at AS "resetAt", plan, paid_until AS "paidUntil" FROM wallets WHERE user_id = ?')
    .get(userId) as { creditsLeft: number; resetAt: string; plan: "FREE" | "UNLIMITED"; paidUntil: string | null } | undefined;
  if (!w) return null;
  const paidUntil = w.paidUntil ?? null;
  if (w.plan === "UNLIMITED") {
    const ends = paidUntil ? Date.parse(paidUntil) : NaN;
    // Still paid up (or a legacy row with no date yet — treat as active).
    if (!Number.isFinite(ends) || ends > Date.now()) return { creditsLeft: w.creditsLeft, plan: "UNLIMITED", paidUntil };
    // Expired → fall back to free for the rest of the app.
    const now = new Date().toISOString();
    await db.prepare("UPDATE wallets SET plan = 'FREE', credits_left = ?, reset_at = ? WHERE user_id = ?").run(DAILY_FREE, now, userId);
    return { creditsLeft: DAILY_FREE, plan: "FREE", paidUntil };
  }
  if (Date.now() - Date.parse(w.resetAt) >= DAY_MS) {
    const now = new Date().toISOString();
    await db.prepare("UPDATE wallets SET credits_left = ?, reset_at = ? WHERE user_id = ?").run(DAILY_FREE, now, userId);
    return { creditsLeft: DAILY_FREE, plan: "FREE", paidUntil };
  }
  return { creditsLeft: w.creditsLeft, plan: "FREE", paidUntil };
}
