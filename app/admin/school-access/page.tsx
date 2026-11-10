"use client";

import { useEffect, useState } from "react";
import { AdminButton } from "@/components/admin-ui";

type SchoolRow = {
  id: string;
  name: string;
  code: string;
  active: number;
  expiresAt: string | null;
  adminEmails: string;
  adminEmail: string;
  adminName: string;
  adminUserId: string | null;
  members: number;
  createdAt: string;
};

export default function AdminSchoolAccess() {
  const [schools, setSchools] = useState<SchoolRow[]>([]);
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
    fetch(`/api/admin/schools?adminId=${aid()}&q=${encodeURIComponent(q)}`).then(async (r) => {
      if (r.ok) {
        const d = await r.json();
        setSchools(d.schools);
      }
    });
  }
  useEffect(load, [q]);

  function changeAccess(v: string) {
    setAccess(v);
    if (v === "PILOT_3DAY" || v === "TRIAL") setDays("3");
    else if (v === "UNLIMITED") setDays("30");
  }

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
      const res = await fetch("/api/admin/school-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const d = await res.json();
      if (!res.ok) return setMsg(d.error || "Failed.");
      const until = d.expiresAt ? ` until ${new Date(d.expiresAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}` : "";
      setMsg(`${d.plan} access granted to ${email}${until}.`);
      setEmail("");
      load();
    } finally {
      setGrantBusy(false);
    }
  }

  async function del(id: string, em: string) {
    if (!confirm(`Delete school ${em}? This removes all their data.`)) return;
    setDelBusy(id);
    try {
      const res = await fetch(`/api/admin/schools?id=${id}&adminId=${aid()}`, { method: "DELETE" });
      if (res.ok) load();
    } finally {
      setDelBusy(null);
    }
  }

  function viewAs(s: SchoolRow) {
    if (!s.adminUserId) return setMsg("No admin account linked to this school.");
    localStorage.setItem("edupal_admin_return", "/admin/school-access");
    localStorage.setItem("edupal_user", s.adminUserId);
    localStorage.setItem("edupal_role", "SCHOOL_ADMIN");
    window.location.href = `/school/dashboard?userId=${s.adminUserId}&adminView=1`;
  }

  const filtered = schools.filter((s) =>
    s.name.toLowerCase().includes(q.toLowerCase()) ||
    s.adminEmail.toLowerCase().includes(q.toLowerCase()) ||
    s.code.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: 24, color: "#333A45" }}>
      <h1 style={{ fontSize: 22 }}>School Access</h1>
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 12, marginBottom: 12 }}>
        <strong>Give free access</strong>
        <p style={{ fontSize: 13, color: "#5F6E7F" }}>Type school admin email, pick access type. Grants or renews school portal access.</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@school.edu.ng" style={{ flex: "2 1 220px", height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 10px" }} />
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
      <p style={{ fontSize: 13, color: "#5F6E7F" }}>{filtered.length} shown. View opens the school portal with a ← Back to Admin button.</p>
      {filtered.map((s) => (
        <div key={s.id} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 12, margin: "8px 0", fontSize: 14, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ flex: "1 1 220px" }}>
            <strong>{s.name}</strong> <span style={{ color: "#5F6E7F", fontFamily: "monospace" }}>{s.code}</span>
            <div style={{ fontSize: 12, color: "#5F6E7F" }}>{s.adminEmail}</div>
            <div style={{ fontSize: 12, color: "#5F6E7F" }}>
              {s.active === 1 ? "Active" : "Inactive"} • Expires: {s.expiresAt ? new Date(s.expiresAt).toLocaleDateString() : "No end date"} • Seats: {s.members} • Registered: {s.createdAt ? s.createdAt.slice(0, 10) : "—"}
            </div>
          </div>
          <AdminButton size="sm" variant="dark" onClick={() => viewAs(s)}>View as school</AdminButton>
          <AdminButton size="sm" variant="dangerOutline" busy={delBusy === s.id} onClick={() => del(s.id, s.adminEmail)}>Delete</AdminButton>
        </div>
      ))}
    </main>
  );
}
