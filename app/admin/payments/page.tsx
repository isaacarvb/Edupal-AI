"use client";
import { useEffect, useState } from "react";

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, margin: "0 0 12px" };
const input: React.CSSProperties = { width: "100%", height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px", fontSize: 14, boxSizing: "border-box" };

export default function AdminPayments() {
  const [tx, setTx] = useState<Array<{
    id: string; email: string; userName: string | null; reference: string | null; subject: string;
    amountKobo: number; plan: string; status: string; channel: string;
    promoCode: string; createdAt: string;
  }>>([]);
  const [status, setStatus] = useState("");
  const aid = () => localStorage.getItem("edupal_admin") ?? "";

  function load() {
    fetch(`/api/admin/transactions?adminId=${aid()}&status=${status}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d) setTx(d.transactions); });
  }
  useEffect(load, []);
  useEffect(load, [status]);

  const stColor = (s: string) => (s === "success" || s === "mock" ? "#16A34A" : s === "failed" ? "#DC2626" : "#F59E0B");

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <h1 style={{ fontSize: 22 }}>Payments</h1>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <label style={{ fontSize: 13, fontWeight: 800, color: "#5F6E7F", marginRight: 8 }}>Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ ...input, width: 180 }}>
          <option value="">All</option>
          <option value="success">Success</option>
          <option value="mock">Mock</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {tx.length === 0 ? (
          <p style={{ fontSize: 13, color: "#5F6E7F" }}>No payments match.</p>
        ) : (
          tx.map((t) => (
            <div key={t.id} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, padding: 10, margin: "6px 0", fontSize: 14, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: "#fff", background: stColor(t.status), borderRadius: 999, padding: "3px 10px" }}>{t.status}</span>
              <div style={{ flex: "1 1 220px" }}>
                <strong style={{ fontSize: 13 }}>₦{Number(t.amountKobo ?? 0).toLocaleString("en-NG")}</strong>
                <span style={{ color: "#5F6E7F", marginLeft: 6 }}>{t.subject}</span>
                <div style={{ fontSize: 12, color: "#5F6E7F" }}>{t.email}</div>
                <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{t.reference ?? "no ref"} • {t.channel}{t.promoCode ? ` • promo ${t.promoCode}` : ""} • {String(t.createdAt).slice(0, 16).replace("T", " ")}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
