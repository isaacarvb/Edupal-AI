import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyPayment } from "@/lib/paystack";
import { unlockUnlimited } from "@/lib/parent";
import { logError } from "@/lib/admin";

// Paystack redirects here after payment. Verifies server-side, unlocks, lands on dashboard.
// Success AND failure are both recorded in transactions.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference") ?? searchParams.get("trxref");
  if (!reference) return NextResponse.json({ error: "reference required" }, { status: 400 });
  const db = await getDb();
  try {
    const { paid, userId } = await verifyPayment(reference);
    if (!paid || !userId) {
      await db.prepare("UPDATE transactions SET status = 'failed' WHERE reference = ?").run(reference);
      return NextResponse.json({ error: "payment not confirmed", reference }, { status: 402 });
    }
    await unlockUnlimited(db, userId);
    await db.prepare("UPDATE transactions SET status = 'success' WHERE reference = ?").run(reference);
    const tx = (await db.prepare("SELECT promo_code AS promo FROM transactions WHERE reference = ?").get(reference)) as { promo: string } | undefined;
    if (tx?.promo) await db.prepare("UPDATE promo_codes SET used = used + 1 WHERE code = ?").run(tx.promo);
    const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    return NextResponse.redirect(`${base}/dashboard?userId=${userId}&paid=1`);
  } catch (e) {
    await logError(db, "checkout/callback", e instanceof Error ? e.message : String(e));
    try {
      await db.prepare("UPDATE transactions SET status = 'failed' WHERE reference = ?").run(reference);
    } catch { /* ignore */ }
    return NextResponse.json({ error: "payment verification failed", reference }, { status: 402 });
  }
}
