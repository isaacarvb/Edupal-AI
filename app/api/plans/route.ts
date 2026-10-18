import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// Public: active plans + prices for the subscription page. No admin needed.
export async function GET() {
  const db = await getDb();
  let plans: Array<Record<string, unknown>> = [];
  try {
    plans = await db.prepare("SELECT id, name, amount_kobo AS amountKobo, credits FROM plans WHERE active = 1 ORDER BY amount_kobo").all();
  } catch {
    plans = [];
  }
  if (!plans.length) {
    const fallback = Number(process.env.PAYSTACK_PLAN_AMOUNT_KOBO ?? 100000);
    plans = [{ id: "default", name: "Unlimited", amountKobo: fallback, credits: 9999 }];
  }
  return NextResponse.json({ plans });
}
