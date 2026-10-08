"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, margin: "0 0 12px" };

function SubscriptionInner() {
  const params = useSearchParams();
  const [userId, setUserId] = useState("");
  const [plan, setPlan] = useState("FREE");
  const [level, setLevel] = useState("SECONDARY");
  const [limits, setLimits] = useState<{ subject: string; left: number }[]>([]);
  const [referral, setReferral] = useState<null | { code: string; bonusLeft: number; invites: number }>(null);
  const [copied, setCopied] = useState(false);
  const [parentEmail, setParentEmail] = useState("");
  const [payMsg, setPayMsg] = useState("");
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    const id = params.get("userId") ?? localStorage.getItem("edupal_user") ?? "";
    setUserId(id);
    if (!id) return;
    fetch(`/api/topics?userId=${id}`).then((r) => r.json()).then((d) => {
      setPlan(d.profile?.plan ?? "FREE");
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
      body: JSON.stringify({ userId, parentEmail: parentEmail || undefined })
    });
    const data = await res.json();
    if (!res.ok) return setPayMsg(data.needsParent ? "Since you're in secondary school, add a parent or guardian's contact so they can support your subscription and stay updated." : data.error);
    if (data.mode === "paystack" && data.authorizationUrl) {
      window.location.href = data.authorizationUrl;
      return;
    }
    setPaid(true);
  }

  if (!userId) return <main style={{ padding: 20 }}>Missing user. Start from <a href="/signup">signup</a>.</main>;

  return (
    <main style={{ maxWidth: 680, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <h1 style={{ color: "#1E242E", fontSize: 24 }}>Subscription &amp; Credits</h1>
      <div style={card}>
        <p style={{ fontSize: 15, margin: "0 0 8px" }}>Plan: <strong>{plan}</strong>{referral && referral.bonusLeft > 0 && <span> • 🎁 {referral.bonusLeft} bonus left</span>}</p>
        {plan === "FREE" && !paid ? (
          <>
            <p style={{ fontSize: 14 }}>Free plan: 10 questions per subject daily. One subscription unlocks unlimited practice + parent dashboard.</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
              {limits.map((l) => (
                <span key={l.subject} style={{ fontSize: 12, background: "#F1F5F9", border: "1px solid #E2E8F0", padding: "4px 10px", borderRadius: 999 }}>
                  {l.subject}: {l.left} left
                </span>
              ))}
            </div>
            {level === "SECONDARY" && (
              <input value={parentEmail} onChange={(e) => setParentEmail(e.target.value)} placeholder="Parent/guardian email" style={{ width: "100%", height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 10px", fontSize: 14, marginBottom: 8, boxSizing: "border-box" }} />
            )}
            {payMsg && <p style={{ fontSize: 13, color: "#DC2626" }}>{payMsg}</p>}
            <button onClick={pay} style={{ display: "block", width: "100%", height: 48, borderRadius: 10, border: 0, background: "#0F766E", color: "#fff", fontWeight: 700, fontSize: 16, cursor: "pointer" }}>Pay with Paystack (test)</button>
          </>
        ) : (
          <p style={{ fontSize: 14, margin: 0 }}>✓ Unlimited active — practice anything, anytime.</p>
        )}
        {paid && plan === "FREE" && <p style={{ color: "#16A34A", fontWeight: 700 }}>✓ Unlimited unlocked. Parent link sent.</p>}
      </div>
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
