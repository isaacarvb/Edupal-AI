// SERVER-ONLY Paystack client. Import only from Route Handlers.
// Secret lives in .env.local (gitignored); browser only ever sees the
// authorization_url redirect. Test mode: sk_test_* + card 4084084084084081.
const BASE = "https://api.paystack.co";

export function paystackConfigured(): boolean {
  return !!process.env.PAYSTACK_SECRET_KEY;
}

export async function initializePayment(email: string, metadata: Record<string, string>, amountKobo: number, callbackUrl: string): Promise<{ authorizationUrl: string; reference: string }> {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY missing");
  const res = await fetch(`${BASE}/transaction/initialize`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      email,
      amount: amountKobo,
      currency: "NGN",
      callback_url: callbackUrl,
      metadata
    })
  });
  const data = await res.json();
  if (!res.ok || !data?.status) {
    console.error(`Paystack init error: ${res.status} ${String(data?.message ?? "").slice(0, 200)}`);
    throw new Error("Paystack initialize failed");
  }
  return { authorizationUrl: data.data.authorization_url as string, reference: data.data.reference as string };
}

export async function verifyPayment(reference: string): Promise<{ paid: boolean; email?: string; userId?: string; amountKobo?: number; planId?: string }> {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY missing");
  const res = await fetch(`${BASE}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${key}` }
  });
  const data = await res.json();
  if (!res.ok || !data?.status) {
    console.error(`Paystack verify error: ${res.status} ${String(data?.message ?? "").slice(0, 200)}`);
    return { paid: false };
  }
  return {
    paid: data.data?.status === "success",
    email: data.data?.customer?.email,
    userId: data.data?.metadata?.userId,
    amountKobo: Number(data.data?.amount ?? 0),
    planId: data.data?.metadata?.planId
  };
}
