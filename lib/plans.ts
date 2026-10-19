// The 3 real-money subscription options. One-time payment (no auto-renew):
// the student renews manually whenever their time finishes.
// Prices final as agreed: ₦4,000 / ₦7,000 / ₦10,000. Raise them as EduPal grows.
export type Plan = {
  id: string;
  label: string;
  days: number;
  amountKobo: number;
  priceNaira: number;
  note?: string;
  popular?: boolean;
};

export const PLANS: Plan[] = [
  { id: "1month", label: "1 Month", days: 30, amountKobo: 400000, priceNaira: 4000 },
  { id: "2months", label: "2 Months", days: 60, amountKobo: 700000, priceNaira: 7000, note: "Save ₦1,000" },
  { id: "3months", label: "One Term (3 Months)", days: 90, amountKobo: 1000000, priceNaira: 10000, note: "Best value — full term", popular: true }
];

export function findPlan(id: string): Plan | null {
  return PLANS.find((p) => p.id === id) ?? null;
}

export function defaultPlan(): Plan {
  return PLANS[0];
}
