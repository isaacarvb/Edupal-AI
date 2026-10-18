"use client";
import { useEffect, useState } from "react";
import { AdminButton } from "@/components/admin-ui";
type F = { id: string; response: string; correct: number; at: string; subject: string; topic: string; stem: string; answerKey: string; student: string | null };
export default function AdminFlags() {
  const [flags, setFlags] = useState<F[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  function load() {
    fetch("/api/flag").then((r) => r.json()).then((d) => setFlags(d.flags ?? []));
  }
  useEffect(load, []);
  async function resolve(id: string) {
    if (busy) return;
    setBusy(id);
    try {
      await fetch("/api/flag", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ resolve: id }) });
      load();
    } finally {
      setBusy(null);
    }
  }
  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: 24, color: "#333A45" }}>
      <h1 style={{ fontSize: 22 }}>Flagged explanations ({flags.length})</h1>
      <p style={{ fontSize: 13, color: "#5F6E7F" }}>Review SLA: 48 hours. Students report wrong/confusing feedback here.</p>
      {flags.length === 0 && <p>No flags — queue clear.</p>}
      {flags.map((f) => (
        <div key={f.id} className="arow" style={{ background: "#fff", border: "1px solid #FECACA", borderRadius: 12, padding: 12, margin: "8px 0", fontSize: 14 }}>
          <strong>{f.subject} • {f.topic}</strong>
          <p style={{ margin: "4px 0" }}>{f.stem}</p>
          <p style={{ margin: "4px 0", color: "#5F6E7F" }}>Student said: “{f.response}” (key: {f.answerKey}) • {f.student ?? "unknown"} • {f.at.slice(0, 10)}</p>
          <AdminButton size="sm" busy={busy === f.id} onClick={() => resolve(f.id)}>Mark resolved</AdminButton>
        </div>
      ))}
    </main>
  );
}
