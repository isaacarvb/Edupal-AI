import { NextResponse } from "next/server";
import { getDb, uid } from "@/lib/db";
import { paystackConfigured, initializePayment, planAmountKobo } from "@/lib/paystack";
import { registerParentContact, unlockUnlimited } from "@/lib/parent";

// Checkout: parent contact if SECONDARY (never blocks), optional promoCode,
// then real Paystack when configured, otherwise the local mock.
// Every attempt is recorded in transactions (pending → success/failed/mock).
export async function POST(req: Request) {
  const { userId, parentEmail, promoCode, planId } = await req.json();
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  const db = await getDb();
  const user = await db.prepare("SELECT level FROM users WHERE id = ?").get(userId) as
    | { level: "SECONDARY" }
    | undefined;
  if (!user) return NextResponse.json({ error: "unknown user" }, { status: 404 });

  if (user.level === "SECONDARY" && !parentEmail) {
    return NextResponse.json({ error: "parent contact required for secondary students", needsParent: true }, { status: 400 });
  }

  if (parentEmail) await registerParentContact(db, userId, parentEmail);

  // Plan price: chosen plan, else default ₦1,000.
  let amountKobo = planAmountKobo();
  let planName = "UNLIMITED";
  try {
    if (planId) {
      const p = (await db.prepare("SELECT name, amount_kobo AS amountKobo FROM plans WHERE id = ? AND active = 1").get(planId)) as
        | { name: string; amountKobo: number }
        | undefined;
      if (p) {
        amountKobo = Number(p.amountKobo);
        planName = p.name;
      }
    }
  } catch { /* plans table missing */ }

  // Promo code: percent off if valid, counts one use only after success.
  let promo = "";
  let percentOff = 0;
  const cleanPromo = String(promoCode ?? "").trim().toUpperCase();
  if (cleanPromo) {
    try {
      const row = (await db.prepare("SELECT percent_off AS percentOff, used, max_uses AS maxUses, active, expires_on AS expiresOn FROM promo_codes WHERE code = ?").get(cleanPromo)) as
        | { percentOff: number; used: number; maxUses: number; active: number; expiresOn: string | null }
        | undefined;
      const expired = row?.expiresOn ? row.expiresOn < new Date().toISOString().slice(0, 10) : false;
      if (row && row.active && !expired && Number(row.used) < Number(row.maxUses)) {
        promo = cleanPromo;
        percentOff = Number(row.percentOff);
        amountKobo = Math.round((amountKobo * (100 - percentOff)) / 100);
      } else if (row) {
        return NextResponse.json({ error: "promo code expired or used up" }, { status: 400 });
      }
    } catch { /* promos table missing */ }
  }

  if (paystackConfigured()) {
    const profile = await db.prepare("SELECT email FROM users WHERE id = ?").get(userId) as { email: string | null } | undefined;
    const email = profile?.email ?? parentEmail ?? "student@edupal.local";
    const { authorizationUrl, reference } = await initializePayment(email, { userId }, amountKobo);
    await db.prepare("INSERT INTO transactions (id, user_id, email, reference, amount_kobo, plan, status, channel, promo_code) VALUES (?, ?, ?, ?, ?, ?, 'pending', 'paystack', ?)").run(
      uid(), userId, email, reference, amountKobo, planName, promo
    );
    return NextResponse.json({ ok: true, mode: "paystack", authorizationUrl, amountKobo, promo });
  }

  // Local mock: instant success.
  const ref = `MOCK-${Date.now()}`;
  const profile = await db.prepare("SELECT email FROM users WHERE id = ?").get(userId) as { email: string | null } | undefined;
  await unlockUnlimited(db, userId);
  await db.prepare("INSERT INTO transactions (id, user_id, email, reference, amount_kobo, plan, status, channel, promo_code) VALUES (?, ?, ?, ?, ?, ?, 'mock', 'mock', ?)").run(
    uid(), userId, profile?.email ?? "", ref, amountKobo, planName, promo
  );
  if (promo) await db.prepare("UPDATE promo_codes SET used = used + 1 WHERE code = ?").run(promo);
  return NextResponse.json({ ok: true, mode: "mock", ref, plan: "UNLIMITED", magicLinkSent: !!parentEmail, amountKobo, promo });
}
