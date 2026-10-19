import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyPayment } from "@/lib/paystack";
import { findPlan, defaultPlan } from "@/lib/plans";
import { unlockUnlimited } from "@/lib/parent";
import { logError } from "@/lib/admin";

// Paystack redirects here after payment. Verifies server-side, extends the
// subscription by the purchased months, lands on the subscription page.
// Success AND failure are both recorded in transactions. Re-visiting the same
// reference never extends twice (idempotent on status='success').
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference") ?? searchParams.get("trxref");
  if (!reference) return NextResponse.json({ error: "reference required" }, { status: 400 });
  const db = await getDb();
  const origin = new URL(req.url).origin;
  try {
    const existing = (await db.prepare('SELECT status, user_id AS "userId" FROM transactions WHERE reference = ?').get(reference)) as { status: string; userId: string | null } | undefined;
    if (existing?.status === "success" && existing.userId) {
      return NextResponse.redirect(`${origin}/subscription?userId=${existing.userId}&paid=1`);
    }
    const { paid, userId, amountKobo, planId } = await verifyPayment(reference);
    if (!paid || !userId) {
      await db.prepare("UPDATE transactions SET status = 'failed' WHERE reference = ?").run(reference);
      return NextResponse.json({ error: "payment not confirmed", reference }, { status: 402 });
    }
    // Amount guard: what Paystack confirms must match what we asked for.
    const tx = (await db.prepare('SELECT amount_kobo AS "amountKobo", promo_code AS "promo" FROM transactions WHERE reference = ?').get(reference)) as { amountKobo: number; promo: string } | undefined;
    const expected = tx?.amountKobo ? Number(tx.amountKobo) : (findPlan(planId ?? "") ?? defaultPlan()).amountKobo;
    if (amountKobo && expected && Number(amountKobo) !== Number(expected)) {
      await db.prepare("UPDATE transactions SET status = 'failed' WHERE reference = ?").run(reference);
      return NextResponse.json({ error: "amount mismatch", reference }, { status: 402 });
    }
    const plan = findPlan(planId ?? "") ?? defaultPlan();
    await unlockUnlimited(db, userId, plan.days);
    await db.prepare("UPDATE transactions SET status = 'success' WHERE reference = ?").run(reference);
    if (tx?.promo) await db.prepare("UPDATE promo_codes SET used = used + 1 WHERE code = ?").run(tx.promo);
    return NextResponse.redirect(`${origin}/subscription?userId=${userId}&paid=1`);
  } catch (e) {
    await logError(db, "checkout/callback", e instanceof Error ? e.message : String(e));
    try {
      await db.prepare("UPDATE transactions SET status = 'failed' WHERE reference = ?").run(reference);
    } catch { /* ignore */ }
    return NextResponse.json({ error: "payment verification failed", reference }, { status: 402 });
  }
}
