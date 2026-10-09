import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { paystackConfigured, initializePayment } from "@/lib/paystack";
import { registerParentContact, unlockUnlimited } from "@/lib/parent";

// Checkout: parent contact if SECONDARY (never blocks), then real Paystack
// when configured, otherwise the local mock. Real flow resumes at /api/checkout/callback.
export async function POST(req: Request) {
  const { userId, parentEmail, classId } = await req.json();
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  const db = await getDb();

  // B2B: teacher pays per class per term (test price, clearly labeled in UI).
  if (classId) {
    const cls = await db.prepare("SELECT teacher_id AS t FROM classes WHERE id = ?").get(classId) as { t: string } | undefined;
    if (!cls || cls.t !== userId) return NextResponse.json({ error: "not your class" }, { status: 403 });
    if (paystackConfigured()) {
      const profile = await db.prepare("SELECT email FROM users WHERE id = ?").get(userId) as { email: string | null } | undefined;
      const authorizationUrl = await initializePayment(profile?.email ?? "teacher@edupal.local", { userId, classId });
      return NextResponse.json({ ok: true, mode: "paystack", authorizationUrl });
    }
    await db.prepare("UPDATE classes SET plan = 'PAID' WHERE id = ?").run(classId);
    return NextResponse.json({ ok: true, mode: "mock", plan: "PAID" });
  }

  const user = await db.prepare("SELECT level FROM users WHERE id = ?").get(userId) as
    | { level: "SECONDARY" | "UNIVERSITY" }
    | undefined;
  if (!user) return NextResponse.json({ error: "unknown user" }, { status: 404 });

  if (user.level === "SECONDARY" && !parentEmail) {
    return NextResponse.json({ error: "parent contact required for secondary students", needsParent: true }, { status: 400 });
  }

  if (parentEmail) await registerParentContact(db, userId, parentEmail);

  if (paystackConfigured()) {
    const profile = await db.prepare("SELECT email FROM users WHERE id = ?").get(userId) as { email: string | null } | undefined;
    const email = profile?.email ?? parentEmail ?? "student@edupal.local";
    const authorizationUrl = await initializePayment(email, { userId });
    return NextResponse.json({ ok: true, mode: "paystack", authorizationUrl });
  }

  // Local mock: instant success.
  const ref = `MOCK-${Date.now()}`;
  await unlockUnlimited(db, userId);
  return NextResponse.json({ ok: true, mode: "mock", ref, plan: "UNLIMITED", magicLinkSent: !!parentEmail });
}
