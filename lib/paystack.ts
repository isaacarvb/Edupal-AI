// SERVER-ONLY Paystack client. Import only from Route Handlers.
// Secret lives in .env.local (gitignored); browser only ever sees the
// authorization_url redirect. Test mode: sk_test_* + card 4084084084084081.
const BASE = "https://api.paystack.co";

export function paystackConfigured(): boolean {
  return !!process.env.PAYSTACK_SECRET_KEY;
}

export function planAmountKobo(): number {
  return Number(process.env.PAYSTACK_PLAN_AMOUNT_KOBO ?? 100000); // ₦1,000 default
}

export async function initializePayment(email: string, metadata: Record<string, string>): Promise<string> {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY missing");
  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const res = await fetch(`${BASE}/transaction/initialize`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      email,
      amount: planAmountKobo(),
      callback_url: `${base}/api/checkout/callback`,
      metadata
    })
  });
  const data = await res.json();
  if (!res.ok || !data?.status) {
    console.error(`Paystack init error: ${res.status}`);
    throw new Error("Paystack initialize failed");
  }
  return data.data.authorization_url as string;
}

export async function verifyPayment(reference: string): Promise<{ paid: boolean; email?: string; userId?: string }> {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY missing");
  const res = await fetch(`${BASE}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${key}` }
  });
  const data = await res.json();
  if (!res.ok || !data?.status) {
    console.error(`Paystack verify error: ${res.status}`);
    return { paid: false };
  }
  return { paid: data.data?.status === "success", email: data.data?.customer?.email, userId: data.data?.metadata?.userId };
}
