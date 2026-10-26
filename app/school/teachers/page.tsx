"use client";
import { useEffect, useState } from "react";

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, margin: "0 0 12px" };

type TeacherRow = { id: string; name: string; email: string; classes: string[]; active: number };

export default function SchoolTeachers() {
  const [userId, setUserId] = useState<string | null>(null);
  const [teachers, setTeachers] = useState<TeacherRow[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [classes, setClasses] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("edupal_user");
    setUserId(id);
    if (!id) return;
    fetch(`/api/school/teachers?userId=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.teachers) setTeachers(d.teachers);
      });
  }, []);

  async function createTeacher() {
    setMsg("");
    if (busy) return;
    setBusy(true);
    try {
      const classList = classes.split(",").map((c) => c.trim()).filter(Boolean);
      const res = await fetch("/api/school/teachers", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, name, email, password, classes: classList })
      });
      const d = await res.json();
      if (!res.ok) return setMsg(d.error || "Failed.");
      setMsg(`Created ${d.teacher.name} — temp password: ${d.temporaryPassword}`);
      setName(""); setEmail(""); setPassword(""); setClasses("");
      fetch(`/api/school/teachers?userId=${userId}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => d?.teachers && setTeachers(d.teachers));
    } finally {
      setBusy(false);
    }
  }

  async function removeTeacher(id: string) {
    if (!confirm("Remove this teacher?")) return;
    const res = await fetch(`/api/school/teachers?teacherId=${encodeURIComponent(id)}&userId=${userId}`, { method: "DELETE" });
    if (res.ok) setTeachers(teachers.filter((t) => t.id !== id));
  }

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <h1 style={{ fontSize: 24, margin: 0 }}>Teachers & Staff</h1>
      </div>

      <div style={card}>
        <h2 style={{ fontSize: 16, margin: "0 0 12px", color: "#1E242E" }}>Add Teacher</h2>
        <p style={{ fontSize: 13, color: "#5F6E7F", margin: "0 0 10px" }}>
          Teachers can log in and manage their assigned classes. They write lesson notes and set assignments.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10, marginBottom: 10 }}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name"
            style={{ height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px" }} />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@school.com" type="email"
            style={{ height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px" }} />
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (6+)" type="password"
            style={{ height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px" }} />
          <input value={classes} onChange={(e) => setClasses(e.target.value)} placeholder="Classes (SS2, SS3)"
            style={{ height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px" }} />
          <button onClick={createTeacher} disabled={busy}
            style={{ height: 44, borderRadius: 10, border: 0, background: "#0F766E", color: "#fff", fontWeight: 800, padding: "0 20px", cursor: "pointer" }}>
            {busy ? "Creating…" : "Add Teacher"}
          </button>
        </div>
        {msg && <p style={{ fontSize: 13, color: msg.startsWith("Created") ? "#166534" : "#DC2626", marginTop: 8 }}>{msg}</p>}
      </div>

      <div style={card}>
        <h2 style={{ fontSize: 16, margin: "0 0 12px", color: "#1E242E" }}>Current Teachers ({teachers.length})</h2>
        {teachers.length === 0 && (
          <p style={{ fontSize: 13, color: "#94A3B8", margin: 0 }}>No teachers yet. Add one above.</p>
        )}
        {teachers.map((t) => (
          <div key={t.id} style={{ borderBottom: "1px solid #F1F5F9", padding: "12px 0", fontSize: 13, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <strong>{t.name}</strong> <span style={{ color: "#5F6E7F", fontSize: 11, marginLeft: 6 }}>{t.email}</span>
              <div style={{ fontSize: 11, color: "#5F6E7F", marginTop: 2 }}>{t.classes.join(", ") || "— no classes"}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 800, padding: "4px 8px", borderRadius: 999,
                background: t.active === 1 ? "#DCFCE7" : "#FEE2E2", color: t.active === 1 ? "#166534" : "#991B1B" }}>
                {t.active === 1 ? "Active" : "Inactive"}
              </span>
              <button onClick={() => removeTeacher(t.id)} style={{ background: "#DC2626", color: "#fff", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 700, border: 0, cursor: "pointer" }}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
