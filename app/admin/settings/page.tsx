"use client";
import { useEffect, useState } from "react";
import { AdminButton } from "@/components/admin-ui";

export default function AdminSettings() {
  const [maint, setMaint] = useState(false);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  // Free-plan ("pilot") rules — live on the user side within seconds.
  const [dailyLimit, setDailyLimit] = useState(10);
  const [resetDays, setResetDays] = useState(1);
  const [resetTime, setResetTime] = useState("00:00");
  const [planBusy, setPlanBusy] = useState(false);
  const [planMsg, setPlanMsg] = useState("");
  const aid = () => localStorage.getItem("edupal_admin") ?? "";

  useEffect(() => {
    fetch(`/api/admin/settings?adminId=${aid()}`).then(async (r) => {
      const d = await r.json();
      if (r.ok) {
        setMaint(d.maintenance);
        setDailyLimit(d.freeDailyLimit ?? 10);
        setResetDays(d.freeResetDays ?? 1);
        setResetTime(d.freeResetTime ?? "00:00");
      }
    });
  }, []);

  async function toggle() {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ adminId: aid(), maintenance: !maint }) });
      const d = await res.json();
      if (res.ok) { setMaint(d.maintenance); setMsg(d.maintenance ? "Maintenance ON — users see maintenance page." : "App live."); }
    } finally {
      setBusy(false);
    }
  }

  async function savePlan() {
    if (planBusy) return;
    setPlanBusy(true);
    setPlanMsg("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId: aid(), freeDailyLimit: dailyLimit, freeResetDays: resetDays, freeResetTime: resetTime })
      });
      const d = await res.json();
      if (!res.ok) return setPlanMsg(d.error || "Failed to save.");
      setPlanMsg(`Saved. Free users now get ${d.freeDailyLimit} questions per subject, resetting every ${d.freeResetDays} day(s) at ${d.freeResetTime} (Nigeria time).`);
    } finally {
      setPlanBusy(false);
    }
  }

  const numBox: React.CSSProperties = { width: 110, height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 10px", fontSize: 15 };

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 24, color: "#333A45" }}>
      <h1 style={{ fontSize: 22 }}>Settings</h1>

      {/* FREE PLAN / PILOT */}
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 16, marginBottom: 12 }}>
        <strong>🎓 Free plan (“pilot”) rules</strong>
        <p style={{ fontSize: 13, color: "#5F6E7F", marginTop: 4 }}>
          What free students get, and when their allowance refills. Changes apply to everyone within seconds — no redeploy.
        </p>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-end", marginTop: 8 }}>
          <label style={{ fontSize: 13, fontWeight: 700 }}>
            Questions per subject
            <br />
            <input type="number" min={1} max={500} value={dailyLimit} onChange={(e) => setDailyLimit(Number(e.target.value))} style={numBox} />
          </label>
          <label style={{ fontSize: 13, fontWeight: 700 }}>
            Reset every (days)
            <br />
            <input type="number" min={1} max={30} value={resetDays} onChange={(e) => setResetDays(Number(e.target.value))} style={numBox} />
          </label>
          <label style={{ fontSize: 13, fontWeight: 700 }}>
            Reset at (Nigeria time)
            <br />
            <input type="time" value={resetTime} onChange={(e) => setResetTime(e.target.value)} style={{ ...numBox, width: 130 }} />
          </label>
          <AdminButton busy={planBusy} onClick={savePlan}>Save free plan</AdminButton>
        </div>
        {planMsg && <p style={{ fontSize: 13, color: "#0F766E", marginTop: 8 }}>{planMsg}</p>}
        <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 6 }}>
          Default: 10 questions per subject, every day at 00:00. Changing the number refills everyone’s allowance immediately.
        </p>
      </div>

      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 16 }}>
        <strong>Maintenance mode</strong>
        <p style={{ fontSize: 13, color: "#5F6E7F" }}>When ON, user pages show “under maintenance”. Admin pages still work.</p>
        <AdminButton variant={maint ? "green" : "danger"} busy={busy} onClick={toggle}>
          {maint ? "Turn OFF maintenance" : "Turn ON maintenance"}
        </AdminButton>
        {msg && <p style={{ fontSize: 13 }}>{msg}</p>}
      </div>

      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 16, marginTop: 12 }}>
        <strong>Admin access</strong>
        <p style={{ fontSize: 13, color: "#5F6E7F" }}>Locked to <code>isaacareo34@gmail.com</code> only. No other email can open this area, even with an ADMIN role.</p>
      </div>
    </main>
  );
}
