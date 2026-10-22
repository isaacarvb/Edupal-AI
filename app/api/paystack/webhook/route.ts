import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { getDb } from "@/lib/db";
import { findPlan, defaultPlan } from "@/lib/plans";
import { unlockUnlimited } from "@/lib/parent";
import { sendReceiptFor } from "@/lib/mail";
import { logError } from "@/lib/admin";

// Paystack pushes payment events here as the always-on backup to the browser
// callback (which can be skipped when the student closes the tab too fast).
// Authenticity = HMAC-SHA512 of the RAW body with PAYSTACK_SECRET_KEY, checked
// against the x-paystack-signature header.
// Idempotent: a reference activates the plan exactly once (status pending →
// success), so callback + webhook racing never double-extends or double-emails.
// Non-2xx only on bad signature or server error — Paystack retries those.
type PaystackEvent = {
  event?: string;
  data?: {
    reference?: string;
    amount?: number;
    metadata?: Record<string, string | undefined>;
  };
};

export async function POST(req: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return NextResponse.json({ error: "webhook not configured" }, { status: 501 });

  const raw = await req.text();
  const sig = req.headers.get("x-paystack-signature") ?? "";
  const expected = createHmac("sha512", secret).update(raw).digest();
  const got = Buffer.from(sig, "hex");
  if (got.length !== expected.length || !timingSafeEqual(got, expected)) {
    return NextResponse.json({ error: "bad signature" }, { status: 401 });
  }

  let event: PaystackEvent;
  try {
    event = JSON.parse(raw) as PaystackEvent;
  } catch {
    return NextResponse.json({ received: true });
  }
  const type = event?.event;
  const reference = event?.data?.reference;
  if (!reference) return NextResponse.json({ received: true });

  const db = await getDb();
  try {
    if (type === "charge.success") {
      const tx = (await db
        .prepare(
          'SELECT status, user_id AS "userId", amount_kobo AS "amountKobo", plan, promo_code AS "promo" FROM transactions WHERE reference = ?'
        )
        .get(reference)) as
        | { status: string; userId: string | null; amountKobo: number; plan: string; promo: string | null }
        | undefined;
      if (!tx) {
        console.warn(`[webhook] success for unknown reference ${reference}`);
        return NextResponse.json({ received: true }); // not ours — don't make Paystack retry
      }
      if (tx.status === "success") return NextResponse.json({ received: true, alreadyProcessed: true });

      // Amount guard: the signed event must match what we asked for.
      const paid = Number(event.data?.amount ?? 0);
      if (paid && Number(tx.amountKobo) && paid !== Number(tx.amountKobo)) {
        await db.prepare("UPDATE transactions SET status = 'failed' WHERE reference = ?").run(reference);
        console.error(`[webhook] amount mismatch on ${reference}: got ${paid}, expected ${tx.amountKobo}`);
        return NextResponse.json({ received: true });
      }

      const planId = event.data?.metadata?.planId || tx.plan;
      const userId = event.data?.metadata?.userId || tx.userId;
      if (!userId) {
        await db.prepare("UPDATE transactions SET status = 'failed' WHERE reference = ?").run(reference);
        console.error(`[webhook] no user for reference ${reference}`);
        return NextResponse.json({ received: true });
      }
      const plan = findPlan(planId) ?? defaultPlan();
      await unlockUnlimited(db, userId, plan.days);
      // Conditional flip: whoever wins sends the receipt; the loser does nothing.
      const flipped = await db
        .prepare("UPDATE transactions SET status = 'success' WHERE reference = ? AND status != 'success'")
        .run(reference);
      if (flipped.changes > 0) {
        if (tx.promo) await db.prepare("UPDATE promo_codes SET used = used + 1 WHERE code = ?").run(tx.promo);
        void sendReceiptFor(db, {
          userId,
          reference,
          planId: plan.id,
          amountKobo: paid || Number(tx.amountKobo),
          base: process.env.NEXTAUTH_URL ?? "https://edupal-ai-app.netlify.app"
        });
      }
    } else if (type === "charge.failed") {
      await db
        .prepare("UPDATE transactions SET status = 'failed' WHERE reference = ? AND status = 'pending'")
        .run(reference);
    }
    return NextResponse.json({ received: true });
  } catch (e) {
    await logError(db, "paystack/webhook", e instanceof Error ? e.message : String(e));
    // 500 → Paystack retries later; a transient DB blip can't lose a payment.
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
