import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyPayment } from "@/lib/paystack";
import { unlockUnlimited } from "@/lib/parent";

// Paystack redirects here after payment. Verifies server-side, unlocks, lands on dashboard.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference") ?? searchParams.get("trxref");
  if (!reference) return NextResponse.json({ error: "reference required" }, { status: 400 });
  const { paid, userId, classId } = await verifyPayment(reference);
  if (!paid || !userId) {
    return NextResponse.json({ error: "payment not confirmed", reference }, { status: 402 });
  }
  const db = getDb();
  if (classId) {
    db.prepare("UPDATE classes SET plan = 'PAID' WHERE id = ? AND teacher_id = ?").run(classId, userId);
    const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    return NextResponse.redirect(`${base}/teacher?userId=${userId}&paid=1`);
  }
  unlockUnlimited(db, userId);
  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  return NextResponse.redirect(`${base}/dashboard?userId=${userId}&paid=1`);
}
