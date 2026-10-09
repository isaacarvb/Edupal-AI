import { uid , Db} from "./db";

// Creates the parent contact row + queues the magic-link welcome email.
// Shared by mock and real-Paystack checkouts (link activates on payment success).
export async function registerParentContact(db: Db, userId: string, parentEmail: string): Promise<string> {
  const token = uid();
  await db.prepare("INSERT INTO parent_links (id, student_id, parent_email, magic_token) VALUES (?, ?, ?, ?)").run(
    uid(), userId, parentEmail, token
  );
  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const magicLink = `${base}/parent?token=${token}`;
  await db.prepare("INSERT INTO email_outbox (id, user_id, kind, subject, body) VALUES (?, ?, 'parent-welcome', 'Your child is studying with EduPal AI', ?)").run(
    uid(),
    userId,
    `Since your child is in secondary school, here's their progress view (no action needed): ${magicLink}`
  );
  return magicLink;
}

export async function unlockUnlimited(db: Db, userId: string): Promise<void> {
  await db.prepare("UPDATE wallets SET plan = 'UNLIMITED' WHERE user_id = ?").run(userId);
}
