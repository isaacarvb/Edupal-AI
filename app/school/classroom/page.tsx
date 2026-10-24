"use client";
import { useEffect, useState } from "react";

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, margin: "0 0 12px" };

type RosterRow = { userId: string; name: string; className: string };

// Classroom mode — the shared-lab fast switch. The teacher opens this on the
// school computer, picks the class, and students TAP THEIR NAME to start.
// No passwords, no logout dance: one tap puts that student's account on the
// device; the next tap switches. Tapping uses the app's normal per-user
// session model (same as admin "User view" preview).
export default function Classroom() {
  const [staffId, setStaffId] = useState<string | null>(null);
  const [roster, setRoster] = useState<RosterRow[]>([]);
  const [denied, setDenied] = useState(false);
  const [cls, setCls] = useState("");
  const [q, setQ] = useState("");

  useEffect(() => {
    const urlStaff = new URLSearchParams(window.location.search).get("userId");
    const staff = urlStaff || localStorage.getItem("edupal_school_staff") || localStorage.getItem("edupal_user");
    if (!staff) return setDenied(true);
    setStaffId(staff);
    localStorage.setItem("edupal_school_staff", staff);
    fetch(`/api/school/roster?userId=${staff}`)
      .then(async (r) => {
        if (!r.ok) return setDenied(true);
        const d = await r.json();
        setRoster(d.roster ?? []);
        const classes = [...new Set((d.roster ?? []).map((x: RosterRow) => x.className).filter(Boolean))] as string[];
        if (classes.length && !cls) setCls(classes[0]);
      })
      .catch(() => setDenied(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startStudent(s: RosterRow) {
    localStorage.setItem("edupal_user", s.userId);
    localStorage.setItem("edupal_role", "STUDENT");
    window.location.href = `/dashboard?userId=${s.userId}&classroom=1`;
  }

  function backToStaff() {
    if (!staffId) return;
    try { sessionStorage.removeItem("edupal_classroom"); } catch { /* private mode */ }
    localStorage.setItem("edupal_user", staffId);
    localStorage.setItem("edupal_role", "SCHOOL_ADMIN");
    window.location.href = `/school?userId=${staffId}`;
  }

  if (denied) {
    return (
      <main style={{ maxWidth: 560, margin: "48px auto", padding: "0 16px", color: "#333A45" }}>
        <div style={card}>
          <h1 style={{ fontSize: 20, margin: "0 0 8px" }}>🏫 Classroom</h1>
          <p style={{ fontSize: 14, color: "#5F6E7F", margin: 0 }}>Open this page from your School Portal — it needs your staff login on this device.</p>
        </div>
      </main>
    );
  }

  const classes = [...new Set(roster.map((r) => r.className).filter(Boolean))];
  const visible = roster
    .filter((r) => (cls ? r.className === cls : true))
    .filter((r) => (q ? r.name.toLowerCase().includes(q.toLowerCase()) : true));

  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
        <h1 style={{ fontSize: 22, margin: 0, flex: 1 }}>🏫 Classroom — tap your name</h1>
        <button onClick={backToStaff}
          style={{ height: 40, borderRadius: 10, border: "1px solid #1E242E", background: "#fff", fontWeight: 700, padding: "0 14px", cursor: "pointer" }}>
          End session
        </button>
      </div>

      {classes.length > 1 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
          {classes.map((c) => (
            <button key={c} onClick={() => setCls(c)}
              style={{ height: 40, borderRadius: 999, border: cls === c ? 0 : "1px solid #CBD5E1", background: cls === c ? "#0F766E" : "#fff",
                color: cls === c ? "#fff" : "#333A45", fontWeight: 700, padding: "0 16px", cursor: "pointer" }}>
              {c}
            </button>
          ))}
        </div>
      )}

      {roster.length > 30 && (
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name…"
          style={{ width: "100%", height: 46, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 14px", fontSize: 16, boxSizing: "border-box", marginBottom: 10 }} />
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10 }}>
        {visible.map((s) => (
          <button key={s.userId} onClick={() => startStudent(s)}
            style={{ minHeight: 72, borderRadius: 14, border: "1px solid #E2E8F0", background: "#fff", cursor: "pointer",
              fontSize: 16, fontWeight: 800, color: "#1E242E", padding: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
            {s.name}
            {cls === "" && <span style={{ fontSize: 11, fontWeight: 600, color: "#5F6E7F" }}>{s.className}</span>}
          </button>
        ))}
      </div>
      {!visible.length && <p style={{ color: "#5F6E7F" }}>No students in this class yet — upload the roster from the School Portal first.</p>}
      {roster.length > 0 && (
        <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 14 }}>
          {roster.length} students on this device's school account. Each tap switches the device to that student — their streak, practice and weak topics load as usual. Passwords are never needed in class.
        </p>
      )}
    </main>
  );
}
