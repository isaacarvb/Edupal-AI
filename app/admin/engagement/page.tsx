"use client";
import { useEffect, useState } from "react";

type E = {
  popular: { subject: string; attempts: number; users: number }[];
  avgScores: { subject: string; avg: number; attempts: number }[];
  daily: { day: string; users: number; attempts: number }[];
  sleeping: { id: string; name: string; email: string; lastActive: string | null; attempts: number }[];
  sleepingCount: number;
};

export default function AdminEngagement() {
  const [e, setE] = useState<E | null>(null);
  useEffect(() => {
    const adminId = localStorage.getItem("edupal_admin");
    if (!adminId) return;
    fetch(`/api/admin/engagement?adminId=${adminId}`).then(async (r) => {
      if (r.ok) setE(await r.json());
    });
  }, []);
  if (!e) return <main style={{ padding: 32 }}>Loading engagement…</main>;
  const maxA = Math.max(1, ...e.daily.map((d) => d.attempts));
  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: 24, color: "#333A45" }}>
      <h1 style={{ fontSize: 22 }}>User engagement</h1>
      <h2 style={{ fontSize: 18 }}>Last 14 days</h2>
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 16 }}>
        {e.daily.map((d) => (
          <div key={d.day} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, padding: "3px 0" }}>
            <span style={{ width: 44, color: "#5F6E7F" }}>{d.day}</span>
            <div style={{ flex: 1, background: "#F1F5F9", borderRadius: 6, height: 14 }}>
              <div style={{ width: `${Math.round((d.attempts / maxA) * 100)}%`, background: "#0F766E", height: 14, borderRadius: 6 }} />
            </div>
            <span style={{ width: 120 }}>{d.users} users • {d.attempts} tries</span>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 12, marginTop: 12 }}>
        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 16 }}>
          <strong>Most attempted subjects</strong>
          {e.popular.map((p) => (
            <div key={p.subject} style={{ fontSize: 14, padding: "6px 0", borderBottom: "1px solid #F1F5F9" }}>{p.subject} — {p.attempts} tries, {p.users} users</div>
          ))}
          {e.popular.length === 0 && <p style={{ fontSize: 13 }}>No attempts yet.</p>}
        </div>
        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 16 }}>
          <strong>Average score per subject</strong>
          {e.avgScores.map((s) => (
            <div key={s.subject} style={{ fontSize: 14, padding: "6px 0", borderBottom: "1px solid #F1F5F9" }}>{s.subject} — {s.avg}% ({s.attempts} tries)</div>
          ))}
          {e.avgScores.length === 0 && <p style={{ fontSize: 13 }}>No attempts yet.</p>}
        </div>
      </div>
      <h2 style={{ fontSize: 18, marginTop: 16 }}>Sleeping users ({e.sleepingCount}) — quiet 7+ days</h2>
      <p style={{ fontSize: 13, color: "#5F6E7F" }}>Send them an announcement with segment “sleeping” to win them back.</p>
      {e.sleeping.map((s) => (
        <div key={s.id} className="arow" style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, padding: 10, margin: "6px 0", fontSize: 14 }}>
          <strong>{s.name || "(no name)"}</strong> <span style={{ color: "#5F6E7F" }}>{s.email}</span>
          <div style={{ fontSize: 12, color: "#5F6E7F" }}>Last active: {s.lastActive ? s.lastActive.slice(0, 10) : "never"} • {s.attempts} tries</div>
        </div>
      ))}
      {e.sleeping.length === 0 && <p style={{ fontSize: 14 }}>Nobody sleeping — everyone active. 🎉</p>}
    </main>
  );
}
