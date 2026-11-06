"use client";

import { useEffect, useState } from "react";

const TERMS = [
  { months: 3, label: "1 Term (3 Months)", multiplier: 1 },
  { months: 6, label: "2 Terms (6 Months)", multiplier: 2 },
  { months: 9, label: "3 Terms (9 Months)", multiplier: 3 },
  { months: 12, label: "4 Terms (12 Months)", multiplier: 4 },
];

const DISCOUNT_TIERS: Array<{ min: number; percent: number }> = [
  { min: 1000, percent: 25 },
  { min: 900, percent: 22.5 },
  { min: 800, percent: 20 },
  { min: 700, percent: 17.5 },
  { min: 600, percent: 15 },
  { min: 500, percent: 12.5 },
  { min: 400, percent: 10 },
  { min: 300, percent: 7.5 },
  { min: 200, percent: 5 },
  { min: 100, percent: 2.5 },
  { min: 0, percent: 0 },
];

const getDiscount = (students: number): number => {
  for (const t of DISCOUNT_TIERS) {
    if (students >= t.min) return t.percent;
  }
  return 0;
};

const formatMoney = (n: number): string => {
  return n.toLocaleString("en-NG", { style: "currency", currency: "NGN" });
};

export default function SchoolSubscription() {
  const [school, setSchool] = useState<{ id: string; name: string; code: string; email: string; active: number; expires_at: string | null; max_seats: number; seats_used: number } | null>(null);
  const [students, setStudents] = useState("");
  const [term, setTerm] = useState<{ months: number; label: string; multiplier: number } | null>(TERMS[0]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [paying, setPaying] = useState(false);

  // Calculated values
  const studentsNum = Number(students) || 0;
  const termMultiplier = term?.multiplier ?? 1;
  const basePrice = 2000 * studentsNum * termMultiplier;
  const discountPercent = getDiscount(studentsNum);
  const discountAmount = Math.round(basePrice * (discountPercent / 100));
  const finalAmount = basePrice - discountAmount;

  useEffect(() => {
    const s = localStorage.getItem("edupal_school");
    if (s) {
      try { setSchool(JSON.parse(s)); } catch { /* ignore */ }
    }
    // Check for payment success from callback URL
    const params = new URLSearchParams(window.location.search);
    if (params.get("paid") === "1") {
      setMsg("Payment successful! Your school subscription is now active. Redirecting to dashboard…");
      setTimeout(() => { window.location.href = "/school/dashboard"; }, 2500);
    }
  }, []);

  useEffect(() => {
    if (!school) return;
    // Fetch current subscription status
    fetch(`/api/school/subscription-status?schoolId=${school.id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.subscription) setSchool((prev) => prev ? { ...prev, active: d.subscription.active ?? prev.active, expires_at: d.subscription.expires_at ?? prev.expires_at } : prev);
      });
  }, [school]);

  const handleCalculate = () => {
    if (!studentsNum || studentsNum < 1) {
      setMsg("Enter valid number of students.");
      return;
    }
    if (!term) {
      setMsg("Select a subscription term.");
      return;
    }
    setMsg(`₦${basePrice.toLocaleString()} base · Discount: -₦${discountAmount.toLocaleString()} (${discountPercent}%) · Total: ₦${finalAmount.toLocaleString()}`);
  };

  const handlePay = async () => {
    if (!studentsNum || studentsNum < 1) return setMsg("Enter valid number of students.");
    if (!term) return setMsg("Select a subscription term.");
    if (!school) return setMsg("School session not found.");
    setMsg("");
    setPaying(true);
    try {
      const res = await fetch("/api/school/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schoolId: school.id,
          students: studentsNum,
          termMonths: term.months,
          amount: finalAmount,
          discountPercent
        })
      });
      const d = await res.json();
      if (!res.ok) return setMsg(d.error || "Payment failed.");
      if (d.mode === "paystack" && d.authorizationUrl) {
        // Redirect to Paystack for payment
        window.location.href = d.authorizationUrl;
        return;
      }
      if (d.mode === "mock") {
        setMsg("Payment successful! Your school is now active. Redirecting to dashboard…");
        setSchool((prev) => prev ? { ...prev, active: 1 } : prev);
        setTimeout(() => { window.location.href = "/school/dashboard"; }, 2000);
        return;
      }
      setMsg("Unexpected payment response.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Payment failed.");
    } finally {
      setPaying(false);
    }
  };

  if (!school) {
    return (
      <main style={{ maxWidth: 480, margin: "60px auto", padding: 20, color: "#333A45", textAlign: "center" }}>
        <p style={{ fontSize: 14, color: "#5F6E7F" }}>School session not found.</p>
        <button onClick={() => { window.location.href = "/school-login"; }}
          style={{ height: 40, borderRadius: 8, border: 0, background: "#0F766E", color: "#fff", fontWeight: 800, padding: "0 20px", cursor: "pointer" }}>
          Sign In to School
        </button>
      </main>
    );
  }

  const isActive = school.active === 1 && school.expires_at && Date.parse(school.expires_at) > Date.now();

  return (
    <main style={{ maxWidth: 700, margin: "20px auto", padding: 20, color: "#333A45" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1E242E", margin: 0 }}>School Subscription</h1>
          <p style={{ fontSize: 13, color: "#5F6E7F", margin: "4px 0 0" }}>{school.name} · {school.code}</p>
        </div>
        <span style={{ fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 999,
          background: isActive ? "#16A34A" : "#DC2626", color: "#fff" }}>
          {isActive ? "ACTIVE" : "INACTIVE"}
        </span>
      </div>

      {/* Warning about mid-subscription changes */}
      <div style={{ background: "#FFF7ED", border: "1px solid #FDBA74", borderRadius: 10, padding: 12, marginBottom: 16, fontSize: 12, color: "#9A3412" }}>
        <strong>Important:</strong> You cannot add students mid-subscription. Plan your student count carefully before subscribing. Changes take effect only after your current subscription expires and you resubscribe.
      </div>

      {/* Current Status */}
      {isActive && (
        <div style={{ background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: 10, padding: 14, marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: "#5F6E7F", marginBottom: 6 }}><strong>Current Subscription</strong></div>
          <div style={{ fontSize: 14, color: "#1E242E" }}>
            Students: {school.max_seats} · Expires: {school.expires_at ? new Date(school.expires_at).toLocaleDateString("en-NG") : "No end date"}
          </div>
        </div>
      )}

      {/* Subscription Form */}
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 20 }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1E242E", margin: "0 0 16px" }}>New Subscription</h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "#5F6E7F", marginBottom: 6 }}>Number of Students</label>
            <input value={students} onChange={(e) => setStudents(e.target.value)} type="number" min={1}
              placeholder="e.g. 200"
              style={{ width: "100%", height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px" }} required />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "#5F6E7F", marginBottom: 6 }}>Subscription Term</label>
            <select value={term?.months} onChange={(e) => setTerm(TERMS.find((t) => t.months === Number(e.target.value)) || null)}
              style={{ width: "100%", height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px" }}>
              {TERMS.map((t) => (
                <option key={t.months} value={t.months}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        <button onClick={handleCalculate}
          style={{ width: "100%", height: 44, borderRadius: 10, border: 0, background: "#F1F5F9", color: "#1E242E", fontWeight: 800, cursor: "pointer", marginBottom: 16 }}>
          Calculate Price
        </button>

        {/* Price Breakdown */}
        {studentsNum > 0 && term && (
          <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: 14, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#5F6E7F", marginBottom: 4 }}>
              <span>Base (₦2,000 × {studentsNum} × {termMultiplier} term(s))</span>
              <span>₦{basePrice.toLocaleString()}</span>
            </div>
            {discountPercent > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#166534", marginBottom: 4 }}>
                <span>Discount ({discountPercent}%)</span>
                <span>-₦{discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 800, color: "#1E242E", marginTop: 8, paddingTop: 8, borderTop: "1px solid #E2E8F0" }}>
              <span>Total to Pay</span>
              <span>{formatMoney(finalAmount)}</span>
            </div>
          </div>
        )}

        {/* Pay Button */}
        {studentsNum > 0 && term && finalAmount > 0 && (
          <button onClick={handlePay} disabled={paying}
            style={{ width: "100%", height: 48, borderRadius: 10, border: 0, background: paying ? "#9CA3AF" : "#0F766E", color: "#fff", fontWeight: 800, fontSize: 16, cursor: paying ? "not-allowed" : "pointer" }}>
            {paying ? "Processing Payment…" : `Pay ${formatMoney(finalAmount)} via Paystack`}
          </button>
        )}

        {msg && <p style={{ fontSize: 13, marginTop: 12, color: msg.startsWith("Payment successful") || msg.startsWith("₦") ? "#166534" : "#DC2626" }}>{msg}</p>}
      </div>

      <div style={{ textAlign: "center", marginTop: 24 }}>
        <button onClick={() => { window.location.href = "/school/dashboard"; }}
          style={{ height: 40, borderRadius: 8, border: "1px solid #CBD5E1", background: "#fff", color: "#5F6E7F", fontWeight: 700, padding: "0 20px", cursor: "pointer" }}>
          Back to Dashboard
        </button>
      </div>
    </main>
  );
}
