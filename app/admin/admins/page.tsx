"use client";
import { useEffect, useState } from "react";
import { AdminButton } from "@/components/admin-ui";

export default function AdminAdmins() {
  const [admins, setAdmins] = useState<{ name: string; email: string; role: string }[]>([]);
  const [allow, setAllow] = useState<{ email: string; role: string }[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("CONTENT_ADMIN");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [delBusy, setDelBusy] = useState<string | null>(null);
  const aid = () => localStorage.getItem("edupal_admin") ?? "";

  function load() {
    fetch(`/api/admin/admins?adminId=${aid()}`).then(async (r) => {
      if (r.ok) {
        const d = await r.json();
        setAdmins(d.admins);
        setAllow(d.allowlist);
      }
    });
  }
  useEffect(load, []);

  async function add() {
    setMsg("");
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/admins", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ adminId: aid(), email, role }) });
      const d = await res.json();
      setMsg(res.ok ? `${d.email} added as ${d.role}. They sign up, then log in at /admin.` : d.error || "Failed.");
      if (res.ok) { setEmail(""); load(); }
    } finally {
      setBusy(false);
    }
  }

  async function remove(em: string) {
    if (!confirm(`Remove admin ${em}? They become a normal student.`)) return;
    setDelBusy(em);
    try {
      const res = await fetch(`/api/admin/admins?email=${encodeURIComponent(em)}&adminId=${aid()}`, { method: "DELETE" });
      const d = await res.json();
      setMsg(res.ok ? "Removed." : d.error || "Failed.");
      load();
    } finally {
      setDelBusy(null);
    }
  }

  return (
    <main style={{ maxWidth: 700, margin: "0 auto", padding: 24, color: "#333A45" }}>
      <h1 style={{ fontSize: 22 }}>Admin roles</h1>
      <p style={{ fontSize: 13, color: "#5F6E7F" }}>SUPER_ADMIN (you) = everything. ADMIN = money + users, no admin invites. CONTENT_ADMIN = questions/flags/drafts only — cannot delete users or touch money. Only a super admin sees this page work.</p>
      {msg && <p style={{ fontSize: 14 }}>{msg}</p>}
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 12, marginBottom: 8 }}>
        <strong>Add admin</strong>
        <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="person@email.com" style={{ flex: "1 1 200px", height: 42, borderRadius: 8, border: "1px solid #CBD5E1", padding: "0 10px" }} />
          <select value={role} onChange={(e) => setRole(e.target.value)} style={{ height: 42, borderRadius: 8, border: "1px solid #CBD5E1" }}>
            <option value="CONTENT_ADMIN">Content admin</option>
            <option value="ADMIN">Admin</option>
            <option value="SUPER_ADMIN">Super admin</option>
          </select>
          <AdminButton onClick={add} busy={busy}>Add</AdminButton>
        </div>
      </div>
      {admins.map((a) => (
        <div key={a.email} className="arow" style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, padding: 10, margin: "6px 0", fontSize: 14, display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ flex: 1 }}><strong>{a.name || a.email}</strong> <span style={{ color: "#5F6E7F" }}>{a.email}</span>
            <div style={{ fontSize: 12, color: "#0F766E", fontWeight: 800 }}>{a.role}</div>
          </div>
          <AdminButton size="sm" variant="dangerOutline" busy={delBusy === a.email} onClick={() => remove(a.email)}>Remove</AdminButton>
        </div>
      ))}
      {allow.filter((a) => !admins.some((u) => u.email === a.email)).map((a) => (
        <div key={a.email} className="arow" style={{ background: "#F8FAFC", border: "1px dashed #CBD5E1", borderRadius: 10, padding: 10, margin: "6px 0", fontSize: 14, display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ flex: 1 }}>{a.email} <span style={{ color: "#5F6E7F" }}>(invited as {a.role} — has not signed up yet)</span></div>
          <AdminButton size="sm" variant="dangerOutline" busy={delBusy === a.email} onClick={() => remove(a.email)}>Remove</AdminButton>
        </div>
      ))}
    </main>
  );
}
