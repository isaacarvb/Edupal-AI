"use client";

import { useEffect, useState } from "react";

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, margin: "0 0 12px" };

export default function SchoolDashboard() {
  const [school, setSchool] = useState<{ id: string; name: string; code: string; email: string; active: number; expires_at: string | null; max_seats: number; seats_used: number } | null>(null);
  const [stats, setStats] = useState<{
    studentsActiveWeek: number;
    totalStudents: number;
    topClass: string;
    flaggedCount: number;
  } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const s = localStorage.getItem("edupal_school");
    if (s) {
      try { setSchool(JSON.parse(s)); } catch { /* ignore */ }
    }
    fetchStats();
  }, []);

  async function fetchStats() {
    const s = localStorage.getItem("edupal_school");
    if (!s) return;
    try {
      const d = JSON.parse(s);
      setBusy(true);
      const res = await fetch(`/api/school/dashboard-stats?schoolId=${d.id}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      }
    } catch { /* ignore */ } finally {
      setBusy(false);
    }
  }

  const isActive = school?.active === 1 && school?.expires_at && Date.parse(school.expires_at) > Date.now();
  const daysLeft = school?.expires_at ? Math.max(0, Math.ceil((Date.parse(school.expires_at) - Date.now()) / 86400000)) : 0;

  if (!school) {
    return (
      <main style={{ maxWidth: 480, margin: "60px auto", padding: 20, color: "#333A45", textAlign: "center" }}>
        <p style={{ fontSize: 14, color: "#5F6E7F" }}>School session not found.</p>
        <button onClick={() => { window.location.href = "/school-login"; }}
          style={{ height: 40, borderRadius: 8, border: 0, background: "#0F766E", color: "#fff", fontWeight: 800, padding: "0 20px", cursor: "pointer" }}>
          Sign In to School
        </button>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 20, color: "#333A45" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1E242E", margin: "0 0 6px" }}>{school.name}</h1>
        <div style={{ fontSize: 13, color: "#5F6E7F", fontFamily: "monospace" }}>{school.code}</div>
        <div style={{ fontSize: 13, color: "#5F6E7F", marginTop: 4 }}>{stats?.totalStudents ?? 0} students · Seats: {stats?.studentsActiveWeek ?? 0} active this week</div>
      </div>

      {/* Status Banner */}
      <div style={{ background: isActive ? "#ECFDF5" : "#FEF2F2", border: `1px solid ${isActive ? "#A7F3D0" : "#FCA5A5"}`, borderRadius: 12, padding: 14, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", color: isActive ? "#166534" : "#DC2626", letterSpacing: 1, marginBottom: 4 }}>
            {isActive ? "SCHOOL ACTIVE" : "SCHOOL INACTIVE"}
          </div>
          <div style={{ fontSize: 14, color: "#1E242E" }}>
            Expires: {school.expires_at ? new Date(school.expires_at).toLocaleDateString("en-NG") : "No end date"}
            {daysLeft > 0 && daysLeft <= 30 && ` · ${daysLeft} day(s) left`}
          </div>
        </div>
      {!isActive && (
          <button onClick={() => { window.location.href = "/school/subscription"; }}
            style={{ height: 36, borderRadius: 8, border: 0, background: "#DC2626", color: "#fff", fontWeight: 800, padding: "0 16px", cursor: "pointer" }}>
            Renew Subscription
          </button>
        )}
        {isActive && daysLeft <= 30 && (
          <button onClick={() => { window.location.href = "/school/subscription"; }}
            style={{ height: 36, borderRadius: 8, border: "1px solid #0F766E", background: "#fff", color: "#0F766E", fontWeight: 800, padding: "0 16px", cursor: "pointer" }}>
            Renew Now
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 24 }}>
        <div style={card}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#5F6E7F", textTransform: "uppercase" }}>Seats Purchased</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#1E242E" }}>{school.max_seats}</div>
        </div>
        <div style={card}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#5F6E7F", textTransform: "uppercase" }}>Seats Used</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#0F766E" }}>{school.seats_used}</div>
        </div>
        <div style={card}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#5F6E7F", textTransform: "uppercase" }}>Active This Week</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#16A34A" }}>{stats?.studentsActiveWeek ?? 0}</div>
        </div>
        <div style={card}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#5F6E7F", textTransform: "uppercase" }}>Flagged (14 days)</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#DC2626" }}>{stats?.flaggedCount ?? 0}</div>
        </div>
      </div>

      {/* Top Class */}
      <div style={card}>
        <div style={{ fontSize: 12, fontWeight: 800, color: "#5F6E7F", textTransform: "uppercase", marginBottom: 12 }}>Top Performing Class</div>
        <div style={{ background: "#F8FAFC", borderRadius: 8, padding: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 700, color: "#1E242E" }}>{stats?.topClass ?? "—"}</span>
            <span style={{ fontSize: 12, color: "#5F6E7F" }}>Highest average accuracy</span>
          </div>
        </div>
      </div>

      {busy && <p style={{ textAlign: "center", color: "#5F6E7F", marginTop: 20 }}>Loading…</p>}
    </main>
  );
}
