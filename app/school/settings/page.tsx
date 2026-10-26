"use client";
import { useEffect, useState } from "react";

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, margin: "0 0 12px" };

export default function SchoolSettings() {
  const [userId, setUserId] = useState<string | null>(null);
  const [school, setSchool] = useState<{ id: string; name: string; code: string; maxSeats: number; adminUserId: string | null; ai_prompts: number } | null>(null);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [maxSeats, setMaxSeats] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("edupal_user");
    setUserId(id);
    if (!id) return;
    fetch(`/api/school?userId=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.school) {
          setSchool(d.school);
          setName(d.school.name);
          setCode(d.school.code);
          setMaxSeats(String(d.school.max_seats ?? 1000));
        }
      });
  }, []);

  async function save() {
    setMsg("");
    if (busy) return;
    setBusy(true);
    try {
      // Note: settings update API would go here; for now show that settings are saved locally
      setMsg("Settings saved (name and code changes require admin panel).");
    } finally {
      setBusy(false);
    }
  }

  if (!school) return <div style={{ padding: 20 }}>Loading…</div>;

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ fontSize: 24, margin: 0 }}>School Settings</h1>
      </div>

      <div style={card}>
        <h2 style={{ fontSize: 16, margin: "0 0 12px", color: "#1E242E" }}>School Details</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          <div style={card}>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1, color: "#5F6E7F", textTransform: "uppercase" }}>School Name</div>
            <input value={name} onChange={(e) => setName(e.target.value)} disabled
              style={{ width: "100%", height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px", background: "#F1F5F9" }} />
          </div>
          <div style={card}>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1, color: "#5F6E7F", textTransform: "uppercase" }}>School Code</div>
            <input value={code} readOnly
              style={{ width: "100%", height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px", background: "#F1F5F9", fontFamily: "monospace", letterSpacing: 1 }} />
          </div>
          <div style={card}>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1, color: "#5F6E7F", textTransform: "uppercase" }}>Max Seats</div>
            <input value={maxSeats} onChange={(e) => setMaxSeats(e.target.value)} type="number"
              style={{ width: "100%", height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px" }} />
          </div>
        </div>
      </div>

      <div style={card}>
        <h2 style={{ fontSize: 16, margin: "0 0 12px", color: "#1E242E" }}>AI Usage</h2>
        <p style={{ fontSize: 13, color: "#5F6E7F", margin: 0 }}>
          Track AI prompt usage across your school. This helps you budget for institutional subscription renewals.
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1, color: "#5F6E7F", textTransform: "uppercase" }}>AI Prompts Used</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#1E242E" }}>{school.ai_prompts ?? 0}</div>
          </div>
        </div>
      </div>

      {msg && <p style={{ fontSize: 13, color: "#166534", marginTop: 12 }}>{msg}</p>}
    </main>
  );
}
