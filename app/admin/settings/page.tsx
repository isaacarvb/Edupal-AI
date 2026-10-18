"use client";
import { useEffect, useState } from "react";
import { AdminButton } from "@/components/admin-ui";
export default function AdminSettings() {
  const [maint, setMaint] = useState(false);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const aid = () => localStorage.getItem("edupal_admin") ?? "";
  useEffect(() => {
    fetch(`/api/admin/settings?adminId=${aid()}`).then(async (r) => {
      const d = await r.json();
      if (r.ok) setMaint(d.maintenance);
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
  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: 24, color: "#333A45" }}>
      <h1 style={{ fontSize: 22 }}>Settings</h1>
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
