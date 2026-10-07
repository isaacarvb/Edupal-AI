import type { DatabaseSync } from "node:sqlite";
import { uid } from "./db";

export const REFERRAL_BONUS = 5;

// Invite code = first 8 chars of user id (stable, no extra column).
export function inviteCode(userId: string): string {
  return userId.slice(0, 8);
}

export function referrerByCode(db: DatabaseSync, code: string): string | null {
  if (!code || code.length < 4) return null;
  const row = db
    .prepare("SELECT id FROM users WHERE substr(id, 1, 8) = ? LIMIT 1")
    .get(code) as { id: string } | undefined;
  return row?.id ?? null;
}

export function bonusLeft(db: DatabaseSync, userId: string): number {
  const today = new Date().toISOString().slice(0, 10);
  const row = db
    .prepare("SELECT remaining FROM bonus_pool WHERE user_id = ? AND day = ?")
    .get(userId, today) as { remaining: number } | undefined;
  return row?.remaining ?? 0;
}

// Grant bonus on conversion, capped so free rewards never cannibalize conversion.
export function grantReferralBonus(db: DatabaseSync, referrerId: string, referredEmail: string): void {
  const today = new Date().toISOString().slice(0, 10);
  const now = new Date().toISOString();
  db.prepare(
    "INSERT INTO referrals (id, referrer_user_id, referred_email, converted, bonus_granted_at) VALUES (?, ?, ?, 1, ?)"
  ).run(uid(), referrerId, referredEmail, now);
  db.prepare(
    `INSERT INTO bonus_pool (user_id, day, remaining) VALUES (?, ?, ?)
     ON CONFLICT(user_id, day) DO UPDATE SET remaining = MIN(5, bonus_pool.remaining + excluded.remaining)`
  ).run(referrerId, today, REFERRAL_BONUS);
}

export function consumeBonus(db: DatabaseSync, userId: string, cost: number): boolean {
  const today = new Date().toISOString().slice(0, 10);
  const row = db
    .prepare("SELECT remaining FROM bonus_pool WHERE user_id = ? AND day = ?")
    .get(userId, today) as { remaining: number } | undefined;
  if (!row || row.remaining < cost) return false;
  db.prepare("UPDATE bonus_pool SET remaining = remaining - ? WHERE user_id = ? AND day = ?").run(cost, userId, today);
  return true;
}
