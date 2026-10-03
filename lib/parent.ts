import type { DatabaseSync } from "node:sqlite";
import { uid } from "./db";

// Creates the parent contact row + queues the magic-link welcome email.
// Shared by mock and real-Paystack checkouts (link activates on payment success).
export function registerParentContact(db: DatabaseSync, userId: string, parentEmail: string): string {
  const token = uid();
  db.prepare("INSERT INTO parent_links (id, student_id, parent_email, magic_token) VALUES (?, ?, ?, ?)").run(
    uid(), userId, parentEmail, token
  );
  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const magicLink = `${base}/parent?token=${token}`;
  db.prepare("INSERT INTO email_outbox (id, user_id, kind, subject, body) VALUES (?, ?, 'parent-welcome', 'Your child is studying with EduPal AI', ?)").run(
    uid(),
    userId,
    `Since your child is in secondary school, here's their progress view (no action needed): ${magicLink}`
  );
  return magicLink;
}

export function unlockUnlimited(db: DatabaseSync, userId: string): void {
  db.prepare("UPDATE wallets SET plan = 'UNLIMITED' WHERE user_id = ?").run(userId);
}
