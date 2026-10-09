import { uid , Db} from "./db";

export const REFERRAL_BONUS = 5;

// Invite code = first 8 chars of user id (stable, no extra column).
export function inviteCode(userId: string): string {
  return userId.slice(0, 8);
}

export async function referrerByCode(db: Db, code: string): Promise<string | null> {
  if (!code || code.length < 4) return null;
  const row = await db
    .prepare("SELECT id FROM users WHERE SUBSTRING(id, 1, 8) = ? LIMIT 1")
    .get(code) as { id: string } | undefined;
  return row?.id ?? null;
}

export async function bonusLeft(db: Db, userId: string): Promise<number> {
  const today = new Date().toISOString().slice(0, 10);
  const row = await db
    .prepare("SELECT remaining FROM bonus_pool WHERE user_id = ? AND day = ?")
    .get(userId, today) as { remaining: number } | undefined;
  return row?.remaining ?? 0;
}

// Grant bonus on conversion, capped so free rewards never cannibalize conversion.
export async function grantReferralBonus(db: Db, referrerId: string, referredEmail: string): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);
  const now = new Date().toISOString();
  await db.prepare(
    "INSERT INTO referrals (id, referrer_user_id, referred_email, converted, bonus_granted_at) VALUES (?, ?, ?, 1, ?)"
  ).run(uid(), referrerId, referredEmail, now);
  const cur = (await db.prepare("SELECT remaining FROM bonus_pool WHERE user_id = ? AND day = ?").get(referrerId, today) as { remaining: number } | undefined)?.remaining ?? 0;
  const topped = Math.min(5, cur + REFERRAL_BONUS);
  await db.prepare(
    `INSERT INTO bonus_pool (user_id, day, remaining) VALUES (?, ?, ?)
     ON CONFLICT(user_id, day) DO UPDATE SET remaining = ?`
  ).run(referrerId, today, topped, topped);
}

export async function consumeBonus(db: Db, userId: string, cost: number): Promise<boolean> {
  const today = new Date().toISOString().slice(0, 10);
  const row = await db
    .prepare("SELECT remaining FROM bonus_pool WHERE user_id = ? AND day = ?")
    .get(userId, today) as { remaining: number } | undefined;
  if (!row || row.remaining < cost) return false;
  await db.prepare("UPDATE bonus_pool SET remaining = remaining - ? WHERE user_id = ? AND day = ?").run(cost, userId, today);
  return true;
}
