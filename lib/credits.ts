import type { DatabaseSync } from "node:sqlite";

export const DAILY_FREE = 10;
export const SUBJECT_DAILY_LIMIT = 10;
const DAY_MS = 24 * 3600 * 1000;

export type Wallet = { creditsLeft: number; plan: "FREE" | "UNLIMITED" };

// Per-subject daily free budget. UNLIMITED plans bypass checks entirely.
export function getSubjectLeft(db: DatabaseSync, userId: string, subject: string, plan: "FREE" | "UNLIMITED"): number {
  if (plan === "UNLIMITED") return SUBJECT_DAILY_LIMIT;
  const today = new Date().toISOString().slice(0, 10);
  const row = db
    .prepare("SELECT used FROM subject_usage WHERE user_id = ? AND subject = ? AND day = ?")
    .get(userId, subject, today) as { used: number } | undefined;
  return SUBJECT_DAILY_LIMIT - (row?.used ?? 0);
}

export function consumeSubject(db: DatabaseSync, userId: string, subject: string, cost: number): void {
  const today = new Date().toISOString().slice(0, 10);
  db.prepare(
    `INSERT INTO subject_usage (user_id, subject, day, used) VALUES (?, ?, ?, ?)
     ON CONFLICT(user_id, subject, day) DO UPDATE SET used = used + excluded.used`
  ).run(userId, subject, today, cost);
}

// Remaining free answers per subject (for dashboard pills + paywall logic).
// UNLIMITED plans report SUBJECT_DAILY_LIMIT; clients check plan for the ∞ display.
export function subjectLimits(db: DatabaseSync, userId: string, subjects: string[], plan: "FREE" | "UNLIMITED"): { subject: string; left: number }[] {
  return subjects.map((s) => ({ subject: s, left: plan === "UNLIMITED" ? SUBJECT_DAILY_LIMIT : getSubjectLeft(db, userId, s, plan) }));
}

// 24h auto-reset for FREE wallets. UNLIMITED never runs out.
export function getWallet(db: DatabaseSync, userId: string): Wallet | null {
  const w = db
    .prepare("SELECT credits_left AS creditsLeft, reset_at AS resetAt, plan FROM wallets WHERE user_id = ?")
    .get(userId) as { creditsLeft: number; resetAt: string; plan: "FREE" | "UNLIMITED" } | undefined;
  if (!w) return null;
  if (w.plan === "UNLIMITED") return { creditsLeft: w.creditsLeft, plan: w.plan };
  if (Date.now() - Date.parse(w.resetAt) >= DAY_MS) {
    const now = new Date().toISOString();
    db.prepare("UPDATE wallets SET credits_left = ?, reset_at = ? WHERE user_id = ?").run(DAILY_FREE, now, userId);
    return { creditsLeft: DAILY_FREE, plan: "FREE" };
  }
  return { creditsLeft: w.creditsLeft, plan: w.plan };
}
