import { NextResponse } from "next/server";
import { PLANS } from "@/lib/plans";

// Public: the 3 subscription options for the upgrade page. Source of truth is
// lib/plans.ts (prices + duration), not the database.
export async function GET() {
  return NextResponse.json({
    plans: PLANS.map((p) => ({ id: p.id, name: p.label, amountKobo: p.amountKobo, priceNaira: p.priceNaira, days: p.days, note: p.note ?? "", popular: !!p.popular }))
  });
}
