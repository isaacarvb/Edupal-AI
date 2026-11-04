"use client";

import { useEffect, useState } from "react";
import { AdminButton } from "@/components/admin-ui";

type SchoolAccess = {
  id: string;
  name: string;
  code: string;
  active: number;
  expiresAt: string | null;
  adminEmails: string;
};

export default function AdminSchoolAccess() {
  const [schools, setSchools] = useState<SchoolAccess[]>([]);
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState("");
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [accessType, setAccessType] = useState("FREE_FULL");
  const [days, setDays] = useState("3");
  const [showDays, setShowDays] = useState(false);
  const aid = () => localStorage.getItem("edupal_admin") ?? "";

  function load() {
    fetch(`/api/admin/schools?adminId=${aid()}&q=${encodeURIComponent(q)}`).then(async (r) => {
      if (r.ok) {
        const d = await r.json();
        setSchools(d.schools);
      }
    });
  }
  useEffect(load, []);

  const handleGrant = () => {
    if (!selectedSchool) return setMsg("Select a school.");
    if (accessType === "FREE_FULL") {
      // Grant full free access
      fetch(`/api/admin/school-access`, {
        method: "POST",
        body: JSON.stringify({ schoolId: selectedSchool, accessType: "FREE_FULL" })
      }).then((r) => r.json()).then((d) => {
        setMsg(d.ok ? "School granted free full access." : d.error || "Failed.");
        setSelectedSchool(null);
        load();
      });
    } else if (accessType === "PILOT" && days && Number(days) > 0) {
      // Grant pilot access with custom days
      fetch(`/api/admin/school-access`, {
        method: "POST",
        body: JSON.stringify({ schoolId: selectedSchool, accessType: "PILOT", days: Number(days) })
      }).then((r) => r.json()).then((d) => {
        setMsg(d.ok ? `Pilot access granted for ${days} days.` : d.error || "Failed.");
        setSelectedSchool(null);
        load();
      });
    } else if (accessType === "PILOT") {
      setMsg("Enter valid days.");
    }
  };

  const filtered = schools.filter((s) =>
    s.name.toLowerCase().includes(q.toLowerCase())
  );
  const accessOptions = [
    { value: "FREE_FULL", label: "Free Full Access" },
    { value: "PILOT", label: "Pilot (custom days)" },
  ];

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: 24, color: "#333A45" }}>
      <h1 style={{ fontSize: 22 }}>School Access</h1>
      <p style={{ fontSize: 13, color: "#5F6E7F" }}>
        Give schools free or pilot access to the EduPal portal.
      </p>

      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 16, marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, margin: "0 0 12px", color: "#1E242E" }}>Grant Access to a School</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ fontSize: 14, color: "#5F6E7F" }}>School</label>
            <select
              onChange={(e) => setSelectedSchool(e.target.value)}
              style={{ width: "100%", height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px" }}
            >
              <option value="">Select a school</option>
              {filtered.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({(s.active === 1 ? "Active" : "Inactive")} · {s.code})
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>{accessType === "FREE_FULL" ? "Free Full" : "Pilot"} Access</span>
          </div>
          {accessType === "PILOT" && (
            <div style={{ marginTop: 8, display: "flex", gap: 6, alignItems: "center" }}>
              <label style={{ fontSize: 13 }}>Days</label>
              <input
                type="number"
                min={1}
                max={365}
                value={days}
                onChange={(e) => setDays(e.target.value)}
                style={{ width: 60, height: 40, borderRadius: 8, border: "1px solid #CBD5E1", padding: "0 8px", fontSize: 14 }}
              />
            </div>
          )}
          <div style={{ marginTop: 12 }}>
            <button onClick={handleGrant} style={{
              width: "100%", height: 44, borderRadius: 8, border: 0, background: "#0F766E", color: "#fff", fontWeight: 800, cursor: "pointer"
            }} disabled={accessType === "PILOT" && (!days || Number(days) <= 0)}>
              {accessType === "PILOT" && days && Number(days) > 0 ? "Grant Pilot Access" : "Grant Access"}
            </button>
            {msg && <p style={{ marginTop: 8, fontSize: 13, color: msg.startsWith("Grant") ? "#166534" : "#DC2626" }}>{msg}</p>}
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 16 }}>
        <h2 style={{ fontSize: 16, margin: "0 0 12px", color: "#1E242E" }}>Schools List</h2>
        {filtered.length === 0 && <p style={{ fontSize: 13, color: "#94A3B8" }}>No schools found.</p>}
        {filtered.map((s) => (
          <div key={s.id} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, padding: "8px 0", fontSize: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>
              <strong>{s.name}</strong> <span style={{ color: "#5F6E7F", fontFamily: "monospace" }}>{s.code}</span>
              <div style={{ fontSize: 11, color: "#5F6E7F" }}>
                {s.active === 1 ? "Active" : "Inactive"} · Expires: {s.expiresAt ? new Date(s.expiresAt).toLocaleDateString() : "No end date"} · Admin emails: {s.adminEmails || "—"}
              </div>
            </span>
            <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 6px", borderRadius: 999, background: s.active === 1 ? "#16A34A" : "#DC2626", color: "#fff" }}>
              {s.active === 1 ? "Active" : "Inactive"}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}