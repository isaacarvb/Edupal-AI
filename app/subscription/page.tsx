"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, margin: "0 0 12px" };

type PlanInfo = { id: string; name: string; amountKobo: number; priceNaira: number; days: number; note: string; popular: boolean };

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return Number.isFinite(d.getTime()) ? d.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : iso;
}

function SubscriptionInner() {
  const params = useSearchParams();
  const [userId, setUserId] = useState("");
  const [plan, setPlan] = useState("FREE");
  const [paidUntil, setPaidUntil] = useState<string | null>(null);
  const [level, setLevel] = useState("SECONDARY");
  const [limits, setLimits] = useState<{ subject: string; left: number }[]>([]);
  const [referral, setReferral] = useState<null | { code: string; bonusLeft: number; invites: number }>(null);
  const [copied, setCopied] = useState(false);
  const [parentEmail, setParentEmail] = useState("");
  const [payMsg, setPayMsg] = useState("");
  const [paid, setPaid] = useState(false);
  const [parentLink, setParentLink] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [plans, setPlans] = useState<PlanInfo[]>([]);
  const [planId, setPlanId] = useState("");
  const [promoCode, setPromoCode] = useState("");

  useEffect(() => {
    fetch("/api/plans").then((r) => r.json()).then((d) => {
      if (d.plans?.length) {
        setPlans(d.plans);
        const popular = d.plans.find((p: PlanInfo) => p.popular) ?? d.plans[0];
        setPlanId(popular.id);
      }
    });
  }, []);

  useEffect(() => {
    const id = params.get("userId") ?? localStorage.getItem("edupal_user") ?? "";
    setUserId(id);
    if (!id) return;
    fetch(`/api/topics?userId=${id}`).then((r) => r.json()).then((d) => {
      setPlan(d.profile?.plan ?? "FREE");
      setPaidUntil(d.profile?.paidUntil ?? null);
      setLevel(d.profile?.level ?? "SECONDARY");
      setLimits(d.subjectLimits ?? []);
    });
    fetch(`/api/referral?userId=${id}`).then((r) => r.json()).then((d) => setReferral(d.code ? d : null));
    if (params.get("paid") === "1") setPaid(true);
  }, [params]);

  async function pay() {
    setPayMsg("");
    const res = await fetch("/api/checkout", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, parentEmail: parentEmail || undefined, planId: planId || undefined, promoCode: promoCode || undefined })
    });
    const data = await res.json();
    if (!res.ok) return setPayMsg(data.needsParent ? "Since you're in secondary school, add a parent or guardian's contact so they can support your subscription and stay updated." : data.error);
    if (data.mode === "paystack" && data.authorizationUrl) {
      window.location.href = data.authorizationUrl;
      return;
    }
    setPaid(true);
    // Local mock: refresh plan/expiry so the success card shows the real date.
    fetch(`/api/topics?userId=${userId}`).then((r) => r.json()).then((d) => {
      setPlan(d.profile?.plan ?? "FREE");
      setPaidUntil(d.profile?.paidUntil ?? null);
    }).catch(() => {});
  }

  // Payment success → fetch the parent link for the "share a copy" box.
  useEffect(() => {
    if (!paid || !userId) return;
    fetch(`/api/parent/link?userId=${userId}`)
      .then((r) => r.json())
      .then((d) => setParentLink(d.link ?? null))
      .catch(() => {});
  }, [paid, userId]);

  if (!userId) return <main style={{ padding: 20 }}>Missing user. Start from <a href="/signup">signup</a>.</main>;

  const active = plan === "UNLIMITED";
  const endsMs = paidUntil ? Date.parse(paidUntil) : NaN;
  const daysLeft = Number.isFinite(endsMs) ? Math.max(0, Math.ceil((endsMs - Date.now()) / 86400000)) : 0;
  const expired = !active && Number.isFinite(endsMs) && endsMs <= Date.now();
  const chosen = plans.find((p) => p.id === planId);

  return (
    <main style={{ maxWidth: 680, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <h1 style={{ color: "#1E242E", fontSize: 24 }}>Go Unlimited</h1>
      <div style={card}>
        {active ? (
          <p style={{ fontSize: 15, margin: 0 }}>
            ✓ <strong>Unlimited active</strong>
            {paidUntil && <> — until <strong>{fmtDate(paidUntil)}</strong> ({daysLeft} day{daysLeft === 1 ? "" : "s"} left)</>}
            {referral && referral.bonusLeft > 0 && <span> • 🎁 {referral.bonusLeft} bonus left</span>}
          </p>
        ) : expired ? (
          <p style={{ fontSize: 15, margin: 0 }}>
            Your Unlimited plan ended on <strong>{fmtDate(paidUntil!)}</strong>. Renew below to keep unlimited practice — your free daily questions still work.
          </p>
        ) : (
          <>
            <p style={{ fontSize: 15, margin: "0 0 8px" }}>Plan: <strong>Free</strong> — 10 questions per subject daily.</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 4 }}>
              {limits.map((l) => (
                <span key={l.subject} style={{ fontSize: 12, background: "#F1F5F9", border: "1px solid #E2E8F0", padding: "4px 10px", borderRadius: 999 }}>
                  {l.subject}: {l.left} left
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      <div style={{ ...card, background: active ? "#F8FAFC" : "#fff" }}>
        <h3 style={{ margin: "0 0 4px", fontSize: 16 }}>Choose your plan</h3>
        <p style={{ fontSize: 13, color: "#5F6E7F", margin: "0 0 12px" }}>One-time payment — no auto-renew. Pay again only when you want more time. Unlimited unlocks every subject, every feature.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10, marginBottom: 12 }}>
          {plans.map((p) => {
            const on = p.id === planId;
            return (
              <button key={p.id} onClick={() => setPlanId(p.id)}
                style={{ position: "relative", textAlign: "left", background: on ? "#ECFDF5" : "#fff", border: on ? "2px solid #0F766E" : "1px solid #CBD5E1", borderRadius: 12, padding: "12px 12px 10px", cursor: "pointer" }}>
                {p.popular && <span style={{ position: "absolute", top: -9, right: 8, fontSize: 10, fontWeight: 800, background: "#0F766E", color: "#fff", padding: "2px 8px", borderRadius: 999 }}>POPULAR</span>}
                <div style={{ fontSize: 14, fontWeight: 800, color: "#1E242E" }}>{p.name}</div>
                <div style={{ fontSize: 19, fontWeight: 800, color: "#0F766E", marginTop: 2 }}>₦{p.priceNaira.toLocaleString("en-NG")}</div>
                <div style={{ fontSize: 12, color: "#5F6E7F" }}>{p.note || `${p.days} days`}</div>
              </button>
            );
          })}
        </div>
        {level === "SECONDARY" && (
          <input value={parentEmail} onChange={(e) => setParentEmail(e.target.value)} placeholder="Parent/guardian email" style={{ width: "100%", height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 10px", fontSize: 14, marginBottom: 8, boxSizing: "border-box" }} />
        )}
        <input value={promoCode} onChange={(e) => setPromoCode(e.target.value.toUpperCase())} placeholder="Promo code (optional)" style={{ width: "100%", height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 10px", fontSize: 14, marginBottom: 8, boxSizing: "border-box" }} />
        {payMsg && <p style={{ fontSize: 13, color: "#DC2626" }}>{payMsg}</p>}
        <button onClick={pay} style={{ display: "block", width: "100%", height: 48, borderRadius: 10, border: 0, background: "#0F766E", color: "#fff", fontWeight: 700, fontSize: 16, cursor: "pointer" }}>
          {active ? "Add more time" : "Pay with Paystack"}{chosen ? ` — ₦${chosen.priceNaira.toLocaleString("en-NG")}` : ""}
        </button>
        <p style={{ fontSize: 12, color: "#5F6E7F", margin: "8px 0 0" }}>Secure payment by Paystack — card, bank transfer and USSD.</p>
      </div>

      {paid && (
        <div style={{ ...card, background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
          <p style={{ color: "#166534", fontWeight: 700, margin: "0 0 4px" }}>✓ Payment received — Unlimited unlocked{paidUntil ? ` until ${fmtDate(paidUntil)}` : ""}.</p>
          {parentLink ? (
            <>
              <p style={{ fontSize: 13, color: "#166534", margin: "0 0 8px" }}>Your parent's progress link is already in their inbox — share a copy here too:</p>
              <div style={{ display: "flex", gap: 8 }}>
                <input readOnly value={parentLink} style={{ flex: 1, height: 44, borderRadius: 10, border: "1px solid #BBF7D0", padding: "0 10px", fontSize: 12, minWidth: 0, background: "#fff" }} />
                <button onClick={() => { navigator.clipboard?.writeText(parentLink); setLinkCopied(true); }} style={{ height: 44, borderRadius: 10, border: 0, background: "#0F766E", color: "#fff", fontWeight: 700, padding: "0 16px", cursor: "pointer" }}>
                  {linkCopied ? "Copied ✓" : "Copy link"}
                </button>
              </div>
            </>
          ) : (
            <p style={{ fontSize: 13, color: "#166534", margin: 0 }}>Parent link sent.</p>
          )}
        </div>
      )}

      {referral && (
        <div style={card}>
          <h3 style={{ margin: "0 0 8px", fontSize: 16 }}>Invite a classmate</h3>
          <p style={{ fontSize: 14, margin: "0 0 8px" }}>Share your link — you earn <strong>5 extra free questions today</strong> when they join. ({referral.invites} joined so far)</p>
          <div style={{ display: "flex", gap: 8 }}>
            <input readOnly value={typeof window !== "undefined" ? `${window.location.origin}/signup?ref=${referral.code}` : ""} style={{ flex: 1, height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 10px", fontSize: 12, minWidth: 0 }} />
            <button onClick={() => { navigator.clipboard?.writeText(`${window.location.origin}/signup?ref=${referral.code}`); setCopied(true); }} style={{ height: 44, borderRadius: 10, border: 0, background: "#0F766E", color: "#fff", fontWeight: 700, padding: "0 16px", cursor: "pointer" }}>
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default function Subscription() {
  return (
    <Suspense fallback={<main style={{ padding: 20 }}>Loading…</main>}>
      <SubscriptionInner />
    </Suspense>
  );
}
