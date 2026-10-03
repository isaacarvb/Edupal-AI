"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type M = {
  totalPracticed: number; avgAccuracy: number; streak: number; readiness: number;
  bySubject: { subject: string; accuracy: number; attempts: number }[];
};

function tagColor(acc: number): React.CSSProperties {
  if (acc >= 75) return { background: "#16A34A", color: "#fff" };
  if (acc >= 50) return { background: "#F59E0B", color: "#422006" };
  return { background: "#DC2626", color: "#fff" };
}

function card(value: string | number, label: string) {
  return (
    <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 16, boxShadow: "0 2px 8px rgb(30 36 46 / 0.06)", textAlign: "center" }}>
      <div style={{ fontSize: 26, fontWeight: 800, color: "#1E242E" }}>{value}</div>
      <div style={{ fontSize: 13, color: "#5F6E7F" }}>{label}</div>
    </div>
  );
}

function MetricsInner() {
  const params = useSearchParams();
  const [userId, setUserId] = useState("");
  const [m, setM] = useState<M | null>(null);

  useEffect(() => {
    const id = params.get("userId") ?? localStorage.getItem("edupal_user") ?? "";
    setUserId(id);
    if (id) fetch(`/api/metrics?userId=${id}`).then((r) => r.json()).then(setM);
  }, [params]);

  if (!userId) return <main style={{ padding: 32 }}>Missing user. Start from <a href="/signup">signup</a>.</main>;
  if (!m) return <main style={{ padding: 32 }}>Loading…</main>;

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 32, color: "#333A45" }}>
      <h1 style={{ color: "#1E242E", fontSize: 24 }}>My progress</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {card(m.totalPracticed, "Total Questions Practiced")}
        {card(`${m.avgAccuracy}%`, "Average Accuracy")}
        {card(`${m.streak} Day(s)`, "Current Streak")}
        {card(`${m.readiness}%`, "Exam Readiness Score")}
      </div>
      <h2 style={{ color: "#1E242E", fontSize: 20, marginTop: 24 }}>By subject</h2>
      {m.bySubject.length === 0 && <p style={{ fontSize: 14 }}>No practice yet — your subject breakdown appears here.</p>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        {m.bySubject.map((s) => (
          <div key={s.subject} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong>{s.subject}</strong>
              <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 999, ...tagColor(s.accuracy) }}>
                {s.accuracy}%
              </span>
            </div>
            <p style={{ fontSize: 13, color: "#5F6E7F", margin: "6px 0" }}>{s.attempts} question(s) attempted</p>
            <div style={{ height: 8, background: "#E2E8F0", borderRadius: 999 }}>
              <div style={{ height: "100%", width: `${s.accuracy}%`, background: "#0F766E", borderRadius: 999 }} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default function Metrics() {
  return (
    <Suspense fallback={<main style={{ padding: 32 }}>Loading…</main>}>
      <MetricsInner />
    </Suspense>
  );
}
