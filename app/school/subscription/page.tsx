"use client";
import { useEffect, useState } from "react";

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, margin: "0 0 12px" };

type SchoolInfo = { id: string; name: string; code: string; active: number; expiresAt: string | null; maxSeats: number; ai_prompts: number };

export default function SubscriptionBilling() {
  const [userId, setUserId] = useState<string | null>(null);
  const [school, setSchool] = useState<SchoolInfo | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("edupal_user");
    setUserId(id);
    if (!id) return;
    fetch(`/api/school?userId=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.school) setSchool(d.school);
      });
  }, []);

  async function subscribe(months: number) {
    setMsg("");
    if (busy || !userId || !school) return;
    setBusy(true);
    try {
      const res = await fetch("/api/school/subscribe", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, months })
      });
      const d = await res.json();
      if (!res.ok) return setMsg(d.error || "Failed to subscribe.");
      setMsg(`School subscribed for ${months} months until ${new Date(d.expiresAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}.`);
      fetch(`/api/school?userId=${userId}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => d?.school && setSchool(d.school));
    } finally {
      setBusy(false);
    }
  }

  if (!school) return <div style={{ padding: 20 }}>Loading…</div>;

  const isActive = school.active === 1 && school.expiresAt && Date.parse(school.expiresAt) > Date.now();

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ fontSize: 24, margin: 0 }}>Subscription & Billing</h1>
      </div>

      <div style={card}>
        <h2 style={{ fontSize: 16, margin: "0 0 12px", color: "#1E242E" }}>School Subscription</h2>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div>
            <strong>{school.name}</strong> <span style={{ color: "#5F6E7F", fontFamily: "monospace" }}>{school.code}</span>
          </div>
          <span style={{ fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 999,
            background: school.active === 1 ? "#16A34A" : "#DC2626", color: "#fff" }}>
            {school.active === 1 ? "ACTIVE" : "INACTIVE"}
          </span>
        </div>
        <div style={{ fontSize: 13, color: "#5F6E7F", marginBottom: 12 }}>
          Students: {school.maxSeats ? "0 / " + school.maxSeats : "—"} · AI prompts used: {school.ai_prompts ?? 0} · Expires: {school.expiresAt || "No end date"}
        </div>

        {isActive ? (
          <button onClick={() => {}} disabled style={{ height: 44, borderRadius: 10, border: 0, background: "#16A34A", color: "#fff", fontWeight: 800, padding: "0 20px", cursor: "not-allowed" }}>
            Active Subscription
          </button>
        ) : (
          <div style={{ background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: 10, padding: 16, marginBottom: 12 }}>
            <div style={{ fontSize: 13, color: "#5F6E7F", marginBottom: 8 }}>
              <strong style={{ color: "#1E242E" }}>Test Mode — Admin-controlled access</strong>
            </div>
            <div style={{ fontSize: 13, color: "#5F6E7F" }}>
              Your school is currently inactive. Ask your admin to activate your school via the
              <strong>School Access</strong> page in the admin portal. They can grant free full access
              or pilot access with a custom duration.
            </div>
          </div>
        )}
      </div>

      <div style={card}>
        <h2 style={{ fontSize: 16, margin: "0 0 12px", color: "#1E242E" }}>How It Works</h2>
        <p style={{ fontSize: 13, color: "#5F6E7F", margin: "0 0 8px" }}>
          Your school subscription unlocks full access for all your students. Once subscribed, students can practise Unlimited until the expiry date.
        </p>
        <ul style={{ fontSize: 13, color: "#5F6E7F", lineHeight: "1.8", margin: 0 }}>
          <li>Admin activates your school via the School Access page (test/pilot access).</li>
          <li>Your school becomes active and all students get full access.</li>
          <li>When access lapses, students drop to free access until renewed.</li>
          <li>Contact EduPal AI to receive an invoice for your chosen plan.</li>
        </ul>
      </div>

      {msg && <p style={{ fontSize: 13, color: msg.startsWith("School subscribed") ? "#166534" : "#DC2626", marginTop: 12 }}>{msg}</p>}
    </main>
  );
}