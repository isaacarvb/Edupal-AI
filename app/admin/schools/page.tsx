"use client";
import { useEffect, useState } from "react";
import { AdminButton } from "@/components/admin-ui";

type School = {
  id: string; name: string; code: string; status: "ACTIVE" | "EXPIRED" | "INACTIVE";
  expiresAt: string | null; maxSeats: number; members: number | string;
  adminName: string | null; adminEmail: string | null; groupName: string | null;
};
type Group = { id: string; name: string };

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isFinite(d.getTime()) ? d.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : iso;
}

export default function AdminSchools() {
  const [schools, setSchools] = useState<School[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: "", groupName: "", adminName: "", adminEmail: "", adminPassword: "", maxSeats: "1000" });
  const [expForm, setExpForm] = useState<Record<string, string>>({});
  const aid = () => localStorage.getItem("edupal_admin") ?? "";

  function load() {
    fetch(`/api/admin/schools?adminId=${aid()}`).then(async (r) => {
      if (r.ok) {
        const d = await r.json();
        setSchools(d.schools);
        setGroups(d.groups);
      }
    });
  }
  useEffect(load, []);

  async function create() {
    setMsg("");
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/schools", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId: aid(), ...form, maxSeats: Number(form.maxSeats) })
      });
      const d = await res.json();
      setMsg(res.ok
        ? `Created ${form.name} — staff login: ${d.staffEmail}. Hand them the password you set; they sign in at /login.`
        : d.error || "Failed.");
      if (res.ok) {
        setForm({ name: "", groupName: "", adminName: "", adminEmail: "", adminPassword: "", maxSeats: "1000" });
        load();
      }
    } finally {
      setBusy(false);
    }
  }

  async function activate(s: School) {
    setMsg("");
    if (busy) return;
    setBusy(true);
    try {
      const months = expForm[s.id] || "12";
      const expiresAt = months === "none" ? null : new Date(Date.now() + Number(months) * 30 * 86400000).toISOString();
      const res = await fetch("/api/admin/schools", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId: aid(), schoolId: s.id, active: true, expiresAt })
      });
      const d = await res.json();
      setMsg(res.ok ? `Activated ${s.name}${expiresAt ? ` until ${fmtDate(expiresAt)}` : " with no end date"}.` : d.error || "Failed.");
      load();
    } finally {
      setBusy(false);
    }
  }

  async function deactivate(s: School) {
    setMsg("");
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/schools", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId: aid(), schoolId: s.id, active: false })
      });
      const d = await res.json();
      setMsg(res.ok ? `Deactivated ${s.name}.` : d.error || "Failed.");
      load();
    } finally {
      setBusy(false);
    }
  }

  const f = (k: keyof typeof form, label: string, type = "text") => (
    <input value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} placeholder={label} type={type}
      style={{ flex: "1 1 160px", height: 42, borderRadius: 8, border: "1px solid #CBD5E1", padding: "0 10px", boxSizing: "border-box" }} />
  );

  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: 24, color: "#333A45" }}>
      <h1 style={{ fontSize: 22 }}>Schools</h1>
      <p style={{ fontSize: 13, color: "#5F6E7F" }}>
        Institutional subscriptions. Create the school + its staff login, then activate with an end date (6 or 12 months from payment). While active, the school's students enjoy full access; when it lapses they drop to free automatically.
      </p>
      {msg && <p style={{ fontSize: 14 }}>{msg}</p>}

      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 12, marginBottom: 12 }}>
        <strong>Add school</strong>
        <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
          {f("name", "School name")}
          {f("groupName", "Network / group (optional)")}
          {f("adminName", "Staff full name")}
          {f("adminEmail", "Staff email", "email")}
          {f("adminPassword", "Staff password", "password")}
          <input value={form.maxSeats} onChange={(e) => setForm({ ...form, maxSeats: e.target.value })} placeholder="Seats" type="number"
            style={{ width: 90, height: 42, borderRadius: 8, border: "1px solid #CBD5E1", padding: "0 10px" }} />
          <AdminButton onClick={create} busy={busy}>Create</AdminButton>
        </div>
      </div>

      {schools.map((s) => (
        <div key={s.id} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, padding: 12, margin: "8px 0", fontSize: 14 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <strong>{s.name}</strong> <span style={{ color: "#5F6E7F", fontFamily: "monospace" }}>{s.code}</span>
              {s.groupName && <span style={{ color: "#5F6E7F" }}> · {s.groupName}</span>}
              <div style={{ fontSize: 12, color: "#5F6E7F" }}>
                {s.members} / {s.maxSeats} students · staff: {s.adminName ?? "—"} {s.adminEmail ? `(${s.adminEmail})` : ""} · till {fmtDate(s.expiresAt)}
              </div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 999,
              background: s.status === "ACTIVE" ? "#16A34A" : s.status === "EXPIRED" ? "#DC2626" : "#F59E0B", color: "#fff" }}>
              {s.status}
            </span>
            {s.status === "ACTIVE" ? (
              <AdminButton size="sm" variant="dangerOutline" busy={busy} onClick={() => deactivate(s)}>Deactivate</AdminButton>
            ) : (
              <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <select value={expForm[s.id] ?? "12"} onChange={(e) => setExpForm({ ...expForm, [s.id]: e.target.value })}
                  style={{ height: 34, borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }}>
                  <option value="6">6 months</option>
                  <option value="12">12 months</option>
                  <option value="none">No end date</option>
                </select>
                <AdminButton size="sm" busy={busy} onClick={() => activate(s)}>Activate</AdminButton>
              </span>
            )}
          </div>
        </div>
      ))}
      {!schools.length && <p style={{ fontSize: 13, color: "#94A3B8" }}>No schools yet.</p>}
      {groups.length > 0 && (
        <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 16 }}>Networks: {groups.map((g) => g.name).join(" · ")}</p>
      )}
    </main>
  );
}
