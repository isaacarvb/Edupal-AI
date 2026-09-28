import { NextResponse } from "next/server";
import { getDb, uid } from "@/lib/db";

// Mock Paystack checkout (local). Prod: replace charge() with Paystack API.
// Flow: FREE credits exhausted → paywall → parent contact if SECONDARY (no
// blocking verification) → immediate UNLIMITED + parent welcome email queued.
export async function POST(req: Request) {
  const { userId, parentEmail } = await req.json();
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  const db = getDb();
  const user = db.prepare("SELECT level FROM users WHERE id = ?").get(userId) as
    | { level: "SECONDARY" | "UNIVERSITY" }
    | undefined;
  if (!user) return NextResponse.json({ error: "unknown user" }, { status: 404 });

  if (user.level === "SECONDARY" && !parentEmail) {
    return NextResponse.json({ error: "parent contact required for secondary students", needsParent: true }, { status: 400 });
  }

  // Mock charge — always succeeds locally.
  const ref = `MOCK-${Date.now()}`;
  db.prepare("UPDATE wallets SET plan = 'UNLIMITED' WHERE user_id = ?").run(userId);

  let magicLink: string | null = null;
  if (parentEmail) {
    const token = uid();
    db.prepare("INSERT INTO parent_links (id, student_id, parent_email, magic_token) VALUES (?, ?, ?, ?)").run(
      uid(), userId, parentEmail, token
    );
    const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    magicLink = `${base}/parent?token=${token}`;
    db.prepare("INSERT INTO email_outbox (id, user_id, kind, subject, body) VALUES (?, ?, 'parent-welcome', 'Your child is studying with EduPal AI', ?)").run(
      uid(),
      userId,
      `Since your child is in secondary school, here's their progress view (no action needed): ${magicLink}`
    );
  }
  return NextResponse.json({ ok: true, ref, plan: "UNLIMITED", magicLinkSent: !!parentEmail });
}
