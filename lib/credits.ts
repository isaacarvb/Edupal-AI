import type { DatabaseSync } from "node:sqlite";

export const DAILY_FREE = 10;
const DAY_MS = 24 * 3600 * 1000;

export type Wallet = { creditsLeft: number; plan: "FREE" | "UNLIMITED" };

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
