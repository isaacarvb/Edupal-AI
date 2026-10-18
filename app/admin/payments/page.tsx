"use client";
import { useEffect, useState } from "react";

type Tx = { id: string; email: string; userName: string | null; reference: string | null; amountKobo: number; plan: string; status: string; channel: string; promoCode: string; createdAt: string };
type Rev = { totalKobo: number; paidCount: number; monthly: { month: string; kobo: number }[]; byPlan: { plan: string; count: number; kobo: number }[]; byStatus: Record<string, number>; paidSubjects: { subject: string; payers: number; attempts: number }[] };

const naira = (k: number) => `₦${(Number(k ?? 0) / 100).toLocaleString("en-NG")}`;

export default function AdminPayments() {
  const [rev, setRev] = useState<Rev | null>(null);
  const [tx, setTx] = useState<Tx[]>([]);
  const [status, setStatus] = useState("");
  const aid = () => localStorage.getItem("edupal_admin") ?? "";

  function load() {
    fetch(`/api/admin/revenue?adminId=${aid()}`).then(async (r) => {
      if (r.ok) setRev(await r.json());
    });
    fetch(`/api/admin/transactions?adminId=${aid()}&status=${status}`).then(async (r) => {
      if (r.ok) {
        const d = await r.json();
        setTx(d.transactions);
      }
    });
  }
  useEffect(load, []);
  useEffect(load, [status]);

  const stColor = (s: string) => (s === "success" || s === "mock" ? "#16A34A" : s === "failed" ? "#DC2626" : "#F59E0B");

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: 24, color: "#333A45" }}>
      <h1 style={{ fontSize: 22 }}>Payments & Revenue</h1>
      {!rev ? <p>Loading…</p> : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))", gap: 12, marginBottom: 12 }}>
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 12, color: "#5F6E7F" }}>Total collected</div>
              <div style={{ fontSize: 26, fontWeight: 800 }}>{naira(rev.totalKobo)}</div>
            </div>
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 12, color: "#5F6E7F" }}>Successful payments</div>
              <div style={{ fontSize: 26, fontWeight: 800 }}>{rev.paidCount}</div>
            </div>
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 12, color: "#5F6E7F" }}>Failed / disputed</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#DC2626" }}>{rev.byStatus.failed ?? 0}</div>
            </div>
          </div>
          <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 16, marginBottom: 12 }}>
            <strong>By month</strong>
            {rev.monthly.length === 0 && <p style={{ fontSize: 13 }}>No payments yet.</p>}
            {rev.monthly.map((m) => (
              <div key={m.month} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, padding: "6px 0", borderBottom: "1px solid #F1F5F9" }}>
                <span>{m.month}</span><strong>{naira(m.kobo)}</strong>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 12, marginBottom: 12 }}>
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 16 }}>
              <strong>By plan</strong>
              {rev.byPlan.map((p) => (
                <div key={p.plan} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, padding: "6px 0" }}>
                  <span>{p.plan} × {p.count}</span><strong>{naira(p.kobo)}</strong>
                </div>
              ))}
              {rev.byPlan.length === 0 && <p style={{ fontSize: 13 }}>None yet.</p>}
            </div>
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 16 }}>
              <strong>Paying users practise most</strong>
              {rev.paidSubjects.map((s) => (
                <div key={s.subject} style={{ fontSize: 14, padding: "6px 0" }}>{s.subject} — {s.payers} payers, {s.attempts} attempts</div>
              ))}
              {rev.paidSubjects.length === 0 && <p style={{ fontSize: 13 }}>None yet.</p>}
            </div>
          </div>
        </>
      )}
      <h2 style={{ fontSize: 18 }}>Payment history</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
        {["", "success", "mock", "pending", "failed"].map((s) => (
          <button key={s || "all"} onClick={() => setStatus(s)} style={{ height: 36, borderRadius: 999, border: "1px solid #0F766E", background: status === s ? "#0F766E" : "#fff", color: status === s ? "#fff" : "#0F766E", fontWeight: 700, padding: "0 14px", cursor: "pointer", fontSize: 13, transform: status === s ? "scale(1.06)" : "none", boxShadow: status === s ? "0 4px 12px -4px rgb(15 118 110 / 0.5)" : "none" }}>
            {s || "All"}
          </button>
        ))}
      </div>
      {tx.map((t) => (
        <div key={t.id} className="arow" style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, padding: 10, margin: "6px 0", fontSize: 14, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: "#fff", background: stColor(t.status), borderRadius: 999, padding: "3px 10px" }}>{t.status}</span>
          <div style={{ flex: "1 1 220px" }}>
            <strong>{naira(t.amountKobo)}</strong> • {t.plan} • {t.email}{t.userName ? ` (${t.userName})` : ""}
            <div style={{ fontSize: 12, color: "#5F6E7F" }}>{t.reference ?? "no ref"} • {t.channel}{t.promoCode ? ` • promo ${t.promoCode}` : ""} • {String(t.createdAt).slice(0, 16).replace("T", " ")}</div>
          </div>
        </div>
      ))}
      {tx.length === 0 && <p style={{ fontSize: 14 }}>No transactions match.</p>}
    </main>
  );
}
