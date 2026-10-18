"use client";
import { useEffect, useState } from "react";

export default function AdminLogs() {
  const [kind, setKind] = useState("audit");
  const [rows, setRows] = useState<Array<Record<string, string>>>([]);
  useEffect(() => {
    const adminId = localStorage.getItem("edupal_admin") ?? "";
    fetch(`/api/admin/logs?adminId=${adminId}&kind=${kind}`).then(async (r) => {
      if (!r.ok) return;
      const d = await r.json();
      setRows(kind === "errors" ? d.errors ?? [] : d.audit ?? []);
    });
  }, [kind]);
  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: 24, color: "#333A45" }}>
      <h1 style={{ fontSize: 22 }}>Logs</h1>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {(["audit", "errors"] as const).map((k) => (
          <button key={k} onClick={() => setKind(k)} style={{ height: 38, borderRadius: 999, border: "1px solid #0F766E", background: kind === k ? "#0F766E" : "#fff", color: kind === k ? "#fff" : "#0F766E", fontWeight: 700, padding: "0 16px", cursor: "pointer", transform: kind === k ? "scale(1.05)" : "none", boxShadow: kind === k ? "0 4px 12px -4px rgb(15 118 110 / 0.5)" : "none" }}>
            {k === "audit" ? "Who did what" : "App errors"}
          </button>
        ))}
      </div>
      {rows.map((r, i) => (
        <div key={i} className="arow" style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, padding: 10, margin: "6px 0", fontSize: 13 }}>
          {kind === "errors" ? (
            <><strong>{r.source}</strong><p style={{ margin: "4px 0" }}>{r.message}</p><span style={{ color: "#5F6E7F" }}>{String(r.createdAt).slice(0, 16).replace("T", " ")}</span></>
          ) : (
            <><strong>{r.action}</strong> <span style={{ color: "#5F6E7F" }}>{r.target}</span><div style={{ color: "#5F6E7F", fontSize: 12 }}>{String(r.createdAt).slice(0, 16).replace("T", " ")}</div></>
          )}
        </div>
      ))}
      {rows.length === 0 && <p style={{ fontSize: 14 }}>Empty — actions and errors will appear here.</p>}
    </main>
  );
}
