import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyPayment } from "@/lib/paystack";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference") ?? searchParams.get("trxref");
  if (!reference) return NextResponse.json({ error: "reference required" }, { status: 400 });

  const db = await getDb();
  const origin = new URL(req.url).origin;

  try {
    // Check if already processed (idempotent)
    const existing = await db.prepare(
      "SELECT status, school_id FROM school_subscriptions WHERE paystack_reference = ?"
    ).get(reference) as { status: string; school_id: string } | undefined;

    if (!existing) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    if (existing.status === "success") {
      return NextResponse.redirect(`${origin}/school/subscription?schoolId=${existing.school_id}&paid=1`);
    }

    const { paid, amountKobo } = await verifyPayment(reference);

    if (!paid) {
      await db.prepare("UPDATE school_subscriptions SET status = 'failed' WHERE paystack_reference = ?").run(reference);
      return NextResponse.json({ error: "payment not confirmed", reference }, { status: 402 });
    }

    // Amount guard
    const tx = await db.prepare(
      "SELECT amount_paid FROM school_subscriptions WHERE paystack_reference = ?"
    ).get(reference) as { amount_paid: number } | undefined;

    const expectedKobo = tx ? tx.amount_paid * 100 : null;
    if (amountKobo && expectedKobo && Number(amountKobo) !== expectedKobo) {
      await db.prepare("UPDATE school_subscriptions SET status = 'failed' WHERE paystack_reference = ?").run(reference);
      return NextResponse.json({ error: "amount mismatch", reference }, { status: 402 });
    }

    // Mark success and activate school
    const now = new Date().toISOString();
    await db.prepare(
      "UPDATE school_subscriptions SET status = 'success', paid_at = ? WHERE paystack_reference = ?"
    ).run(now, reference);

    const sub = await db.prepare(
      "SELECT school_id, students_count, expires_at FROM school_subscriptions WHERE paystack_reference = ?"
    ).get(reference) as { school_id: string; students_count: number; expires_at: string } | undefined;

    if (sub) {
      await db.prepare(
        "UPDATE schools SET max_seats = ?, active = 1, expires_at = ? WHERE id = ?"
      ).run(sub.students_count, sub.expires_at, sub.school_id);
    }

    return NextResponse.redirect(`${origin}/school/subscription?schoolId=${existing.school_id}&paid=1`);
  } catch (e) {
    return NextResponse.json({ error: "payment verification failed", reference }, { status: 402 });
  }
}
