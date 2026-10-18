"use client";
import { useEffect, useState } from "react";
import { AdminButton } from "@/components/admin-ui";

type S = { subject: string; active: number };

export default function AdminSubjects() {
  const [rows, setRows] = useState<S[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const aid = () => localStorage.getItem("edupal_admin") ?? "";
  function load() {
    fetch(`/api/admin/subjects?adminId=${aid()}`).then(async (r) => {
      if (r.ok) setRows((await r.json()).subjects);
    });
  }
  useEffect(load, []);

  async function toggle(s: S) {
    if (busy) return;
    setBusy(s.subject);
    try {
      await fetch("/api/admin/subjects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ adminId: aid(), subject: s.subject, active: !s.active }) });
      load();
    } finally {
      setBusy(null);
    }
  }

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: 24, color: "#333A45" }}>
      <h1 style={{ fontSize: 22 }}>Subjects ON/OFF</h1>
      <p style={{ fontSize: 13, color: "#5F6E7F" }}>Turned-off subjects disappear from onboarding, curriculum, glossary and practice subject lists. Questions stay saved.</p>
      {rows.map((s) => (
        <div key={s.subject} className="arow" style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, padding: 10, margin: "6px 0", fontSize: 14, display: "flex", alignItems: "center", gap: 8, opacity: s.active ? 1 : 0.55 }}>
          <span style={{ flex: 1 }}><strong>{s.subject}</strong> {s.active ? "🟢 visible" : "🔴 hidden"}</span>
          <AdminButton size="sm" variant={s.active ? "dangerOutline" : "primary"} busy={busy === s.subject} onClick={() => toggle(s)}>
            {s.active ? "Hide" : "Show"}
          </AdminButton>
        </div>
      ))}
    </main>
  );
}
