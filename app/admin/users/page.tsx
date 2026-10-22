"use client";
import { useEffect, useState } from "react";
import { AdminButton } from "@/components/admin-ui";

type U = { id: string; name: string; email: string; role: string; plan: string; credits: number; exam: string; subjects: string; lastActive: string | null; attempts: number; createdAt: string };

export default function AdminUsers() {
  const [users, setUsers] = useState<U[]>([]);
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState("");
  const [email, setEmail] = useState("");
  const [access, setAccess] = useState("PILOT_3DAY");
  const [days, setDays] = useState("3");
  const [startAt, setStartAt] = useState("");
  const [grantBusy, setGrantBusy] = useState(false);
  const [delBusy, setDelBusy] = useState<string | null>(null);
  const aid = () => localStorage.getItem("edupal_admin") ?? "";

  function load() {
    fetch(`/api/admin/users?adminId=${aid()}&q=${encodeURIComponent(q)}&limit=100`).then(async (r) => {
      const d = await r.json();
      if (r.ok) setUsers(d.users);
    });
  }
  useEffect(load, []);

  async function grant() {
    setMsg("");
    if (!email.trim() || grantBusy) return;
    setGrantBusy(true);
    try {
      const body: Record<string, unknown> = { adminId: aid(), email, accessType: access };
      if (access !== "FREE_FULL") {
        if (Number(days) > 0) body.days = Number(days);
        if (startAt) body.startAt = new Date(startAt).toISOString();
      }
      const res = await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const d = await res.json();
      if (!res.ok) return setMsg(d.error || "Failed.");
      const until = d.paidUntil ? ` until ${new Date(d.paidUntil).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}` : "";
      const startNote = d.paidFrom && Date.parse(d.paidFrom) > Date.now() + 30000 ? ` (starts ${new Date(d.paidFrom).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })})` : "";
      setMsg(d.created ? `Created ${email} on ${d.plan}${until}${startNote}. Temp password: ${d.tempPassword} — share it.` : `Updated ${email} to ${d.plan}${until}${startNote}.`);
      setEmail("");
      load();
    } finally {
      setGrantBusy(false);
    }
  }

  function changeAccess(v: string) {
    setAccess(v);
    if (v === "PILOT_3DAY" || v === "TRIAL") setDays("3");
    else if (v === "UNLIMITED") setDays("30");
  }

  async function del(id: string, em: string) {
    if (!confirm(`Delete ${em}? This removes all their data.`)) return;
    setDelBusy(id);
    try {
      const res = await fetch(`/api/admin/users?id=${id}&adminId=${aid()}`, { method: "DELETE" });
      if (res.ok) load();
    } finally {
      setDelBusy(null);
    }
  }

  function viewAs(u: U) {
    localStorage.setItem("edupal_admin_return", "/admin/users");
    localStorage.setItem("edupal_user", u.id);
    window.location.href = `/dashboard?userId=${u.id}&adminView=1`;
  }

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: 24, color: "#333A45" }}>
      <h1 style={{ fontSize: 22 }}>Users</h1>
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 12, marginBottom: 12 }}>
        <strong>Give free access</strong>
        <p style={{ fontSize: 13, color: "#5F6E7F" }}>Type student email, pick access type. New emails get an account + temp password.</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="student@email.com" style={{ flex: "2 1 220px", height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 10px" }} />
          <select value={access} onChange={(e) => changeAccess(e.target.value)} style={{ height: 44, borderRadius: 10, border: "1px solid #CBD5E1" }}>
            <option value="PILOT_3DAY">Pilot / trial (custom days)</option>
            <option value="FREE_FULL">Full free</option>
            <option value="UNLIMITED">Unlimited (custom days)</option>
          </select>
          {access !== "FREE_FULL" && (
            <>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700 }}>
                Days
                <input type="number" min={1} max={3650} value={days} onChange={(e) => setDays(e.target.value)} style={{ width: 76, height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 8px", fontSize: 15 }} />
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700 }}>
                Starts at <span style={{ color: "#94A3B8", fontWeight: 400 }}>(blank = now)</span>
                <input type="datetime-local" value={startAt} onChange={(e) => setStartAt(e.target.value)} style={{ height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 8px", fontSize: 13 }} />
              </label>
            </>
          )}
          <AdminButton onClick={grant} busy={grantBusy}>Give access</AdminButton>
        </div>
        {msg && <p style={{ fontSize: 13 }}>{msg}</p>}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && load()} placeholder="Search name or email…" style={{ flex: 1, height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 10px" }} />
        <AdminButton variant="ghost" onClick={load}>Search</AdminButton>
      </div>
      <p style={{ fontSize: 13, color: "#5F6E7F" }}>{users.length} shown. View opens the user portal with a ← Back to Admin button.</p>
      {users.map((u) => (
        <div key={u.id} className="arow" style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 12, margin: "8px 0", fontSize: 14, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ flex: "1 1 220px" }}>
            <strong>{u.name || "(no name)"}</strong> <span style={{ color: "#5F6E7F" }}>{u.email}</span>
            {u.email === "preview@edupal.local" && <span style={{ fontSize: 11, fontWeight: 800, background: "#7C3AED", color: "#fff", borderRadius: 999, padding: "2px 8px", marginLeft: 6 }}>👁 preview</span>}
            <div style={{ fontSize: 12, color: "#5F6E7F" }}>{u.plan} • {u.credits} credits • {u.attempts} attempts • last {u.lastActive ? u.lastActive.slice(0, 10) : "never"} • {u.exam ?? ""}</div>
          </div>
          <AdminButton size="sm" variant="dark" onClick={() => viewAs(u)}>View as user</AdminButton>
          <AdminButton size="sm" variant="dangerOutline" busy={delBusy === u.id} onClick={() => del(u.id, u.email)}>Delete</AdminButton>
        </div>
      ))}
    </main>
  );
}
