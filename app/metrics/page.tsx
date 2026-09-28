"use client";
import { Suspense, useEffect, useState } from "react";

type M = {
  students: number; attempts: number; retentionPct: number; retained: number;
  activeStudents: number; clarityPct: number; paid: number; exhausted: number;
  parentPct: number; linksSent: number;
  bySubject: { subject: string; accuracy: number; attempts: number }[];
  gates: { retention70: boolean; note: string };
};

function card(v: string | number, label: string, good?: boolean) {
  return (
    <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 10, flex: "1 1 30%", textAlign: "center" }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: good === undefined ? "#1E242E" : good ? "#16A34A" : "#DC2626" }}>{v}</div>
      <div style={{ fontSize: 12, color: "#5F6E7F" }}>{label}</div>
    </div>
  );
}

function MetricsInner() {
  const [m, setM] = useState<M | null>(null);
  useEffect(() => {
    fetch("/api/metrics").then((r) => r.json()).then(setM);
  }, []);
  if (!m) return <main style={{ padding: 20 }}>Loading…</main>;
  return (
    <main style={{ maxWidth: 420, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <h1 style={{ color: "#1E242E", fontSize: 22 }}>Pilot evidence board</h1>
      <p style={{ fontSize: 13, color: "#5F6E7F" }}>{m.gates.note}</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {card(m.students, "students")}
        {card(m.attempts, "answers")}
        {card(`${m.retentionPct}%`, "retention (2+ days)", m.gates.retention70)}
        {card(`${m.clarityPct}%`, "MCQ clarity")}
        {card(`${m.paid}/${m.exhausted}`, "paid / exhausted")}
        {card(`${m.parentPct}%`, `parent verify (${m.linksSent})`)}
      </div>
      <h2 style={{ color: "#1E242E", fontSize: 18 }}>By subject</h2>
      {m.bySubject.map((s) => (
        <div key={s.subject} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 10, margin: "6px 0", fontSize: 14 }}>
          {s.subject} — {s.accuracy}% over {s.attempts} answer(s)
        </div>
      ))}
    </main>
  );
}

export default function Metrics() {
  return (
    <Suspense fallback={<main style={{ padding: 20 }}>Loading…</main>}>
      <MetricsInner />
    </Suspense>
  );
}
