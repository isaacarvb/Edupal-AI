"use client";
import { useEffect, useState } from "react";

// Internal pilot evidence board (owner only in prod). Student view lives at /metrics.
type M = {
  students: number; attempts: number; retentionPct: number; retained: number;
  activeStudents: number; clarityPct: number; paid: number; exhausted: number;
  parentPct: number; linksSent: number;
  bySubject: { subject: string; accuracy: number; attempts: number }[];
  gates: { retention70: boolean; note: string };
};

type Flag = { id: string; response: string; correct: number; at: string; subject: string; topic: string; stem: string; answerKey: string; student: string | null };

export default function Admin() {
  const [m, setM] = useState<M | null>(null);
  const [flags, setFlags] = useState<Flag[]>([]);
  function load() {
    fetch("/api/metrics").then((r) => r.json()).then(setM);
    fetch("/api/flag").then((r) => r.json()).then((d) => setFlags(d.flags ?? []));
  }
  useEffect(load, []);
  async function resolve(id: string) {
    await fetch("/api/flag", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ resolve: id }) });
    load();
  }
  if (!m) return <main style={{ padding: 32 }}>Loading…</main>;
  const row = (k: string, v: string | number) => (
    <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #E2E8F0", fontSize: 14 }}>
      <span>{k}</span><strong>{v}</strong>
    </div>
  );
  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: 32, color: "#333A45" }}>
      <h1 style={{ color: "#1E242E", fontSize: 22 }}>Admin — pilot evidence</h1>
      <p style={{ fontSize: 13, color: "#5F6E7F" }}>{m.gates.note}</p>
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 16 }}>
        {row("Students", m.students)}
        {row("Answers", m.attempts)}
        {row("Retention (2+ days)", `${m.retentionPct}% ${m.gates.retention70 ? "✓ gate" : "✗ gate"}`)}
        {row("MCQ clarity", `${m.clarityPct}%`)}
        {row("Paid / exhausted", `${m.paid} / ${m.exhausted}`)}
        {row("Parent verify", `${m.parentPct}% (${m.linksSent})`)}
      </div>
      <h2 style={{ fontSize: 18 }}>By subject</h2>
      {m.bySubject.map((s) => <div key={s.subject} style={{ fontSize: 14 }}>{s.subject} — {s.accuracy}% over {s.attempts}</div>)}
      <h2 style={{ fontSize: 18, marginTop: 16 }}>Flagged explanations ({flags.length})</h2>
      <p style={{ fontSize: 13, color: "#5F6E7F" }}>Review SLA: 48 hours.</p>
      {flags.length === 0 && <p style={{ fontSize: 14 }}>Queue clear — nothing flagged.</p>}
      {flags.map((f) => (
        <div key={f.id} style={{ background: "#fff", border: "1px solid #FECACA", borderRadius: 12, padding: 12, margin: "8px 0", fontSize: 14 }}>
          <strong>{f.subject} • {f.topic}</strong>
          <p style={{ margin: "4px 0" }}>{f.stem}</p>
          <p style={{ margin: "4px 0", color: "#5F6E7F" }}>Student said: “{f.response}” (key: {f.answerKey}) • {f.student ?? "unknown"} • {f.at.slice(0, 10)}</p>
          <button onClick={() => resolve(f.id)} style={{ fontSize: 13, fontWeight: 700, background: "#0F766E", color: "#fff", border: 0, borderRadius: 8, padding: "8px 16px", cursor: "pointer" }}>Mark resolved</button>
        </div>
      ))}
    </main>
  );
}
