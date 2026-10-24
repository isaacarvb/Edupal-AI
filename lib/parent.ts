import { uid , Db} from "./db";

// Creates the parent contact row + queues the magic-link welcome email.
// Shared by mock and real-Paystack checkouts (link activates on payment success).
export async function registerParentContact(db: Db, userId: string, parentEmail: string): Promise<string> {
  const token = uid();
  await db.prepare("INSERT INTO parent_links (id, student_id, parent_email, magic_token, created_at) VALUES (?, ?, ?, ?, ?)").run(
    uid(), userId, parentEmail, token, new Date().toISOString()
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

// Activates/extends an Unlimited subscription for `days` from the later of
// now or the current paid_until (so buying 2 months while 1 is left adds on).
export async function unlockUnlimited(db: Db, userId: string, days = 30): Promise<void> {
  const now = new Date();
  const row = await db.prepare('SELECT paid_until AS "paidUntil" FROM wallets WHERE user_id = ?').get(userId) as { paidUntil: string | null } | undefined;
  const currentEnd = row?.paidUntil ? Date.parse(row.paidUntil) : NaN;
  const base = Number.isFinite(currentEnd) && currentEnd > now.getTime() ? currentEnd : now.getTime();
  const paidUntil = new Date(base + days * 86400000).toISOString();
  await db.prepare("UPDATE wallets SET plan = 'UNLIMITED', paid_until = ? WHERE user_id = ?").run(paidUntil, userId);
}
