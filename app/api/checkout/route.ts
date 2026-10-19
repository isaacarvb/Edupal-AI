import { NextResponse } from "next/server";
import { getDb, uid } from "@/lib/db";
import { paystackConfigured, initializePayment } from "@/lib/paystack";
import { findPlan, defaultPlan } from "@/lib/plans";
import { registerParentContact, unlockUnlimited } from "@/lib/parent";

// Checkout: parent contact if SECONDARY (never blocks), optional promoCode,
// then real Paystack (one-time payment for the chosen months) — or the local
// mock when Paystack isn't configured (local dev only).
// Every attempt is recorded in transactions (pending → success/failed/mock).
export async function POST(req: Request) {
  const { userId, parentEmail, promoCode, planId } = await req.json();
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const plan = findPlan(String(planId ?? "")) ?? defaultPlan();
  const db = await getDb();
  const user = await db.prepare("SELECT level FROM users WHERE id = ?").get(userId) as
    | { level: "SECONDARY" }
    | undefined;
  if (!user) return NextResponse.json({ error: "unknown user" }, { status: 404 });

  if (user.level === "SECONDARY" && !parentEmail) {
    return NextResponse.json({ error: "parent contact required for secondary students", needsParent: true }, { status: 400 });
  }

  if (parentEmail) await registerParentContact(db, userId, parentEmail);

  let amountKobo = plan.amountKobo;

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
    // Paystack needs a deliverable-looking address. Test accounts (.local/.test)
    // have no real inbox — swap in a syntactically valid one so checkout still runs.
    const ok = (e: string) => /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(e) && !/\.(local|test|localhost|invalid|example|internal)$/i.test(e);
    const raw = String(profile?.email ?? "").trim() || String(parentEmail ?? "").trim();
    const email = ok(raw) ? raw : `student-${String(userId).replace(/[^a-zA-Z0-9]/g, "").slice(0, 12)}@edupal.app`;
    // Origin from the request — works on localhost, Netlify and custom domains.
    const origin = new URL(req.url).origin;
    const { authorizationUrl, reference } = await initializePayment(
      email,
      { userId, planId: plan.id },
      amountKobo,
      `${origin}/api/checkout/callback`
    );
    await db.prepare("INSERT INTO transactions (id, user_id, email, reference, amount_kobo, plan, status, channel, promo_code) VALUES (?, ?, ?, ?, ?, ?, 'pending', 'paystack', ?)").run(
      uid(), userId, email, reference, amountKobo, plan.id, promo
    );
    return NextResponse.json({ ok: true, mode: "paystack", authorizationUrl, amountKobo, promo, planId: plan.id });
  }

  // Local mock: instant success.
  const ref = `MOCK-${Date.now()}`;
  const profile = await db.prepare("SELECT email FROM users WHERE id = ?").get(userId) as { email: string | null } | undefined;
  await unlockUnlimited(db, userId, plan.days);
  await db.prepare("INSERT INTO transactions (id, user_id, email, reference, amount_kobo, plan, status, channel, promo_code) VALUES (?, ?, ?, ?, ?, ?, 'mock', 'mock', ?)").run(
    uid(), userId, profile?.email ?? "", ref, amountKobo, plan.id, promo
  );
  if (promo) await db.prepare("UPDATE promo_codes SET used = used + 1 WHERE code = ?").run(promo);
  return NextResponse.json({ ok: true, mode: "mock", ref, plan: "UNLIMITED", planId: plan.id, magicLinkSent: !!parentEmail, amountKobo, promo });
}
