"use client";
import { useEffect, useState } from "react";
import { AdminButton } from "@/components/admin-ui";
type D = { id: string; exam: string; subject: string; topic: string; type: string; stem: string; optionsJson: string; answerKey: string; markingRubric: string };
export default function AdminDrafts() {
  const [drafts, setDrafts] = useState<D[]>([]);
  const [sel, setSel] = useState<Record<string, boolean>>({});
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  function load() {
    fetch("/api/drafts").then((r) => r.json()).then((d) => { setDrafts(d.pending ?? []); setSel({}); });
  }
  useEffect(load, []);
  async function review(ids: string[], action: "approve" | "reject") {
    if (!ids.length || busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/drafts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids, action }) });
      const d = await res.json();
      setMsg(res.ok ? `${action}d ${action === "approve" ? d.approved : ids.length}.` : d.error || "Failed.");
      load();
    } finally {
      setBusy(false);
    }
  }
  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: 24, color: "#333A45" }}>
      <h1 style={{ fontSize: 22 }}>AI drafts ({drafts.length})</h1>
      <p style={{ fontSize: 13, color: "#5F6E7F" }}>Verify every answer before approving. Approved drafts enter the bank as AI-source.</p>
      {msg && <p style={{ fontSize: 14 }}>{msg}</p>}
      {drafts.length > 0 && (
        <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
          <AdminButton size="sm" variant="green" busy={busy} onClick={() => review(drafts.map((d) => d.id), "approve")}>Approve all</AdminButton>
          <AdminButton size="sm" variant="ghost" busy={busy} onClick={() => review(drafts.filter((d) => sel[d.id]).map((d) => d.id), "approve")}>Approve selected</AdminButton>
          <AdminButton size="sm" variant="dangerOutline" busy={busy} onClick={() => review(drafts.filter((d) => sel[d.id]).map((d) => d.id), "reject")}>Reject selected</AdminButton>
        </div>
      )}
      {drafts.length === 0 && <p style={{ fontSize: 14 }}>No pending drafts.</p>}
      {drafts.map((d) => (
        <div key={d.id} className="arow" style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 12, margin: "8px 0", fontSize: 14 }}>
          <label style={{ display: "flex", gap: 8, cursor: "pointer" }}>
            <input type="checkbox" checked={!!sel[d.id]} onChange={(e) => setSel((s) => ({ ...s, [d.id]: e.target.checked }))} style={{ width: 18, height: 18 }} />
            <span><strong>{d.subject} • {d.topic}</strong> [{d.type}] — {d.stem}</span>
          </label>
          <p style={{ fontSize: 13, color: "#5F6E7F", margin: "6px 0 0 26px" }}>Answer: {d.answerKey}</p>
        </div>
      ))}
    </main>
  );
}
