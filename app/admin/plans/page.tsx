"use client";
import { useEffect, useState } from "react";
import { AdminButton } from "@/components/admin-ui";

type Plan = { id: string; name: string; amountKobo: number; credits: number; active: number };
type Promo = { code: string; percentOff: number; maxUses: number; used: number; active: number; expiresOn: string | null };

export default function AdminPlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [promos, setPromos] = useState<Promo[]>([]);
  const [pName, setPName] = useState("");
  const [pAmount, setPAmount] = useState("1000");
  const [cCode, setCCode] = useState("");
  const [cOff, setCOff] = useState("50");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const aid = () => localStorage.getItem("edupal_admin") ?? "";

  function load() {
    fetch(`/api/admin/plans?adminId=${aid()}`).then(async (r) => {
      if (r.ok) setPlans((await r.json()).plans);
    });
    fetch(`/api/admin/promos?adminId=${aid()}`).then(async (r) => {
      if (r.ok) setPromos((await r.json()).codes);
    });
  }
  useEffect(load, []);

  async function addPlan() {
    setMsg("");
    if (busy) return;
    setBusy("addPlan");
    try {
      const res = await fetch("/api/admin/plans", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ adminId: aid(), name: pName, amountKobo: Math.round(Number(pAmount) * 100) }) });
      const d = await res.json();
      setMsg(res.ok ? "Plan added." : d.error || "Failed.");
      if (res.ok) { setPName(""); load(); }
    } finally {
      setBusy(null);
    }
  }

  async function togglePlan(p: Plan) {
    if (busy) return;
    setBusy(p.id);
    try {
      await fetch("/api/admin/plans", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ adminId: aid(), id: p.id, name: p.name, amountKobo: p.amountKobo, credits: p.credits, active: !p.active }) });
      load();
    } finally {
      setBusy(null);
    }
  }

  async function delPlan(id: string) {
    if (!confirm("Delete this plan?")) return;
    setBusy(id);
    try {
      await fetch(`/api/admin/plans?id=${id}&adminId=${aid()}`, { method: "DELETE" });
      load();
    } finally {
      setBusy(null);
    }
  }

  async function addPromo() {
    setMsg("");
    if (busy) return;
    setBusy("addPromo");
    try {
      const res = await fetch("/api/admin/promos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ adminId: aid(), code: cCode, percentOff: Number(cOff) }) });
      const d = await res.json();
      setMsg(res.ok ? `Promo ${d.code} created.` : d.error || "Failed.");
      if (res.ok) { setCCode(""); load(); }
    } finally {
      setBusy(null);
    }
  }

  async function togglePromo(c: Promo) {
    if (busy) return;
    setBusy(c.code);
    try {
      await fetch("/api/admin/promos", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ adminId: aid(), code: c.code, active: !c.active }) });
      load();
    } finally {
      setBusy(null);
    }
  }

  async function delPromo(code: string) {
    if (!confirm(`Delete promo ${code}?`)) return;
    setBusy(code);
    try {
      await fetch(`/api/admin/promos?code=${code}&adminId=${aid()}`, { method: "DELETE" });
      load();
    } finally {
      setBusy(null);
    }
  }

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24, color: "#333A45" }}>
      <h1 style={{ fontSize: 22 }}>Plans & Promo codes</h1>
      {msg && <p style={{ fontSize: 14 }}>{msg}</p>}
      <h2 style={{ fontSize: 18 }}>Price plans</h2>
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 12, marginBottom: 8 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input value={pName} onChange={(e) => setPName(e.target.value)} placeholder="Plan name e.g. Term Unlimited" style={{ flex: "1 1 180px", height: 42, borderRadius: 8, border: "1px solid #CBD5E1", padding: "0 10px" }} />
          <input value={pAmount} onChange={(e) => setPAmount(e.target.value)} placeholder="Price ₦" type="number" style={{ width: 130, height: 42, borderRadius: 8, border: "1px solid #CBD5E1", padding: "0 10px" }} />
          <AdminButton onClick={addPlan} busy={busy === "addPlan"}>Add plan</AdminButton>
        </div>
      </div>
      {plans.map((p) => (
        <div key={p.id} className="arow" style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, padding: 10, margin: "6px 0", fontSize: 14, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", opacity: p.active ? 1 : 0.55 }}>
          <div style={{ flex: "1 1 200px" }}><strong>{p.name}</strong> — ₦{(p.amountKobo / 100).toLocaleString("en-NG")} {p.active ? "" : "(off)"}</div>
          <AdminButton size="sm" variant="ghost" busy={busy === p.id} onClick={() => togglePlan(p)}>{p.active ? "Turn off" : "Turn on"}</AdminButton>
          <AdminButton size="sm" variant="dangerOutline" busy={busy === p.id} onClick={() => delPlan(p.id)}>Delete</AdminButton>
        </div>
      ))}
      {plans.length === 0 && <p style={{ fontSize: 14 }}>No custom plans — checkout uses the default ₦1,000.</p>}
      <h2 style={{ fontSize: 18, marginTop: 20 }}>Discount / promo codes</h2>
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 12, marginBottom: 8 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input value={cCode} onChange={(e) => setCCode(e.target.value)} placeholder="CODE e.g. QUBATORS50" style={{ flex: "1 1 180px", height: 42, borderRadius: 8, border: "1px solid #CBD5E1", padding: "0 10px", textTransform: "uppercase" }} />
          <input value={cOff} onChange={(e) => setCOff(e.target.value)} placeholder="% off" type="number" style={{ width: 110, height: 42, borderRadius: 8, border: "1px solid #CBD5E1", padding: "0 10px" }} />
          <AdminButton variant="dark" onClick={addPromo} busy={busy === "addPromo"}>Create code</AdminButton>
        </div>
      </div>
      {promos.map((c) => (
        <div key={c.code} className="arow" style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, padding: 10, margin: "6px 0", fontSize: 14, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", opacity: c.active ? 1 : 0.55 }}>
          <div style={{ flex: "1 1 200px" }}><strong>{c.code}</strong> — {c.percentOff}% off • used {c.used}/{c.maxUses} {c.active ? "" : "(off)"}</div>
          <AdminButton size="sm" variant="ghost" busy={busy === c.code} onClick={() => togglePromo(c)}>{c.active ? "Turn off" : "Turn on"}</AdminButton>
          <AdminButton size="sm" variant="dangerOutline" busy={busy === c.code} onClick={() => delPromo(c.code)}>Delete</AdminButton>
        </div>
      ))}
      {promos.length === 0 && <p style={{ fontSize: 14 }}>No codes yet. Students type the code on the Subscription page.</p>}
    </main>
  );
}
