"use client";
import { useEffect, useState } from "react";

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, margin: "0 0 12px" };

type SchoolInfo = { id: string; name: string; code: string; active: number; expiresAt: string | null; maxSeats: number; ai_prompts: number };

export default function SubscriptionBilling() {
  const [userId, setUserId] = useState<string | null>(null);
  const [school, setSchool] = useState<SchoolInfo | null>(null);
  const [months, setMonths] = useState("12");
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

  async function activate() {
    setMsg("");
    if (busy) return;
    setBusy(true);
    try {
      const expiresAt = months === "none" ? null : new Date(Date.now() + Number(months) * 30 * 86400000).toISOString();
      const res = await fetch("/api/admin/schools", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId: userId, schoolId: school?.id, active: true, expiresAt })
      });
      const d = await res.json();
      if (!res.ok) return setMsg(d.error || "Failed.");
      setMsg(`Activated${expiresAt ? ` until ${new Date(expiresAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}` : " with no end date"}.`);
      fetch(`/api/school?userId=${userId}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => d?.school && setSchool(d.school));
    } finally {
      setBusy(false);
    }
  }

  async function deactivate() {
    setMsg("");
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/schools", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId: userId, schoolId: school?.id, active: false })
      });
      const d = await res.json();
      if (!res.ok) return setMsg(d.error || "Failed.");
      setMsg("Deactivated.");
      fetch(`/api/school?userId=${userId}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => d?.school && setSchool(d.school));
    } finally {
      setBusy(false);
    }
  }

  if (!school) return <div style={{ padding: 20 }}>Loading…</div>;

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
        {school.active === 1 ? (
          <button onClick={deactivate} disabled={busy}
            style={{ height: 44, borderRadius: 10, border: 0, background: "#DC2626", color: "#fff", fontWeight: 800, padding: "0 20px", cursor: "pointer" }}>
            {busy ? "Deactivating…" : "Deactivate Subscription"}
          </button>
        ) : (
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <select value={months} onChange={(e) => setMonths(e.target.value)} style={{ height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px" }}>
              <option value="6">6 months</option>
              <option value="12">12 months</option>
              <option value="none">No end date</option>
            </select>
            <button onClick={activate} disabled={busy}
              style={{ height: 44, borderRadius: 10, border: 0, background: "#0F766E", color: "#fff", fontWeight: 800, padding: "0 20px", cursor: "pointer" }}>
              {busy ? "Activating…" : "Activate Subscription"}
            </button>
          </div>
        )}
      </div>

      <div style={card}>
        <h2 style={{ fontSize: 16, margin: "0 0 12px", color: "#1E242E" }}>Pricing</h2>
        <p style={{ fontSize: 13, color: "#5F6E7F", margin: 0 }}>
          Institutional subscriptions are billed manually. Contact EduPal AI to receive an invoice. Once paid, activate the subscription here to unlock student access.
        </p>
      </div>

      {msg && <p style={{ fontSize: 13, color: msg.startsWith("Activated") || msg.startsWith("Deactivated") ? "#166534" : "#DC2626", marginTop: 12 }}>{msg}</p>}
    </main>
  );
}
