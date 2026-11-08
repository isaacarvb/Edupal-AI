"use client";

import { useEffect, useState } from "react";

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, margin: "0 0 12px" };

export default function SchoolSettings() {
  const [school, setSchool] = useState<{ id: string; name: string; code: string; email: string; active: number; expires_at: string | null; max_seats: number; seats_used: number } | null>(null);
  const [portalActive, setPortalActive] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const s = localStorage.getItem("edupal_school");
    if (s) {
      try { setSchool(JSON.parse(s)); } catch { /* ignore */ }
    }
    fetchStatus();
  }, []);

  async function fetchStatus() {
    const s = localStorage.getItem("edupal_school");
    if (!s) return;
    try {
      const d = JSON.parse(s);
      const res = await fetch(`/api/school/subscription-status?schoolId=${d.id}`);
      if (res.ok) {
        const jd = await res.json();
        if (jd.school) {
          setSchool((prev) => prev ? { ...prev, active: jd.school.active, expires_at: jd.school.expires_at, max_seats: jd.school.max_seats, seats_used: jd.school.seats_used } : prev);
          setPortalActive(jd.school.active === 1);
        }
      }
    } catch { /* ignore */ }
  }

  async function togglePortal() {
    if (!school) return;
    if (!confirm(portalActive ? "Deactivate student portal? Students won't be able to log in." : "Activate student portal?")) return;
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/school/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schoolId: school.id, portalActive: !portalActive })
      });
      const jd = await res.json();
      if (!res.ok) return setMsg(jd.error || "Failed.");
      setPortalActive(!portalActive);
      setMsg(portalActive ? "Student portal deactivated." : "Student portal activated.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Failed.");
    } finally {
      setBusy(false);
    }
  }

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
      <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1E242E", margin: "0 0 16px" }}>School Settings</h1>

      <div style={card}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: "#1E242E", margin: "0 0 12px" }}>School Details</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#5F6E7F", textTransform: "uppercase" }}>School Name</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1E242E" }}>{school.name}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#5F6E7F", textTransform: "uppercase" }}>School Code</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0F766E", fontFamily: "monospace" }}>{school.code}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#5F6E7F", textTransform: "uppercase" }}>Email</div>
            <div style={{ fontSize: 14, color: "#1E242E" }}>{school.email}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#5F6E7F", textTransform: "uppercase" }}>Seats</div>
            <div style={{ fontSize: 14, color: "#1E242E" }}>{school.seats_used} used / {school.max_seats} purchased</div>
          </div>
        </div>
        <p style={{ fontSize: 12, color: "#5F6E7F", marginTop: 12 }}>
          Share your <strong>school code</strong> with students. They enter the code + their name + class to log in.
        </p>
      </div>

      <div style={card}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: "#1E242E", margin: "0 0 12px" }}>Student Portal</h2>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1E242E" }}>
              {portalActive ? "🟢 Active" : "🔴 Deactivated"}
            </div>
            <p style={{ fontSize: 13, color: "#5F6E7F", margin: "4px 0 0" }}>
              {portalActive
                ? "Students can log in with the school code."
                : "Students cannot log in with the school code. Deactivate during exams or holidays."}
            </p>
          </div>
          <button onClick={togglePortal} disabled={busy}
            style={{ height: 44, borderRadius: 10, border: portalActive ? "1px solid #DC2626" : "none", background: portalActive ? "#FFF1F2" : "#0F766E", color: portalActive ? "#DC2626" : "#fff", fontWeight: 800, fontSize: 14, padding: "0 20px", cursor: busy ? "not-allowed" : "pointer" }}>
            {busy ? "…" : portalActive ? "Deactivate Portal" : "Activate Portal"}
          </button>
        </div>
        {msg && <p style={{ fontSize: 13, marginTop: 8, color: "#DC2626" }}>{msg}</p>}
      </div>
    </main>
  );
}
