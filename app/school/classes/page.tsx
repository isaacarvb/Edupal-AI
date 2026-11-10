"use client";
import { useEffect, useState } from "react";

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, margin: "0 0 12px" };

type ClassRow = { className: string; students: number; activeWeek: number; avgStreak: number };

export default function SchoolClasses() {
  const [userId, setUserId] = useState<string | null>(null);
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [newClass, setNewClass] = useState("");
  const [msg, setMsg] = useState("");
  const [importMsg, setImportMsg] = useState("");
  const [importBusy, setImportBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem("edupal_user");
    setUserId(id);
    if (!id) { setLoading(false); return; }
    fetch(`/api/school/overview?userId=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.classes) {
          setClasses(d.classes.map((c: any) => ({
            className: c.className,
            students: c.students,
            activeWeek: c.activeWeek,
            avgStreak: c.avgStreak
          })));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function addClass() {
    if (!newClass.trim()) return;
    setMsg("Classes are created automatically when you upload a student roster. Upload a roster with the new class name.");
  }

  async function handleImport(file: File) {
    setImportMsg("");
    setImportBusy(true);
    try {
      const text = await file.text();
      const lines = text.trim().split("\n");
      if (lines.length < 2) return setImportMsg("CSV must have a header row and at least one student row.");

      const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
      const nameIdx = header.indexOf("name");
      const emailIdx = header.indexOf("email");
      const classIdx = header.indexOf("class");

      if (nameIdx === -1 || emailIdx === -1 || classIdx === -1) {
        return setImportMsg("CSV must have columns: name, email, class");
      }

      const studentList: Array<{ name: string; email: string; className: string }> = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",");
        if (cols.length < 3) continue;
        studentList.push({
          name: cols[nameIdx]?.trim() || "",
          email: cols[emailIdx]?.trim() || "",
          className: cols[classIdx]?.trim() || ""
        });
      }

      if (studentList.length === 0) return setImportMsg("No valid student rows found.");

      const adminId = localStorage.getItem("edupal_admin") ?? userId ?? "";
      const form = new FormData();
      form.append("adminId", adminId);
      form.append("students", JSON.stringify(studentList));

      const res = await fetch("/api/school/students", { method: "POST", body: form });
      const d = await res.json();
      if (!res.ok) return setImportMsg(d.error || "Import failed.");
      setImportMsg(`Imported ${d.imported} students. Classes created/updated.`);
      // Refresh classes
      const id = localStorage.getItem("edupal_user");
      fetch(`/api/school/overview?userId=${id}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (d?.classes) {
            setClasses(d.classes.map((c: any) => ({
              className: c.className,
              students: c.students,
              activeWeek: c.activeWeek,
              avgStreak: c.avgStreak
            })));
          }
        });
    } catch (e) {
      setImportMsg(e instanceof Error ? e.message : "Import failed.");
    } finally {
      setImportBusy(false);
    }
  }

  if (loading) {
    return (
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: 60, color: "#333A45", textAlign: "center" }}>
        <p style={{ fontSize: 14, color: "#5F6E7F" }}>Loading classes…</p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <h1 style={{ fontSize: 24, margin: 0 }}>Classes & Departments</h1>
      </div>

      {/* Bulk Import Section */}
      <div style={card}>
        <h2 style={{ fontSize: 16, margin: "0 0 12px", color: "#1E242E" }}>Bulk Import Students (CSV)</h2>
        <p style={{ fontSize: 13, color: "#5F6E7F", margin: "0 0 12px" }}>
          Upload a CSV with columns: <code style={{ color: "#1E242E" }}>name, email, class</code>. Students are assigned to classes on upload.
        </p>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleImport(f);
          }}
          style={{ height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px", width: "100%" }}
        />
        {importMsg && <p style={{ fontSize: 13, marginTop: 8, color: importMsg.startsWith("Imported") ? "#166534" : "#DC2626" }}>{importMsg}</p>}
        {importBusy && <p style={{ fontSize: 13, marginTop: 8, color: "#5F6E7F" }}>Importing…</p>}
      </div>

      <div style={card}>
        <h2 style={{ fontSize: 16, margin: "0 0 12px", color: "#1E242E" }}>Classes</h2>
        <p style={{ fontSize: 13, color: "#5F6E7F", margin: "0 0 10px" }}>
          Classes are created automatically when you upload a student roster. Each student is assigned to a class on upload.
        </p>
        <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
          <input value={newClass} onChange={(e) => setNewClass(e.target.value)} placeholder="New class name"
            style={{ height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px", flex: 1 }} />
          <button onClick={addClass} disabled={!newClass.trim()}
            style={{ height: 44, borderRadius: 10, border: 0, background: "#0F766E", color: "#fff", fontWeight: 800, padding: "0 20px", cursor: "pointer" }}>
            Add
          </button>
        </div>
        {msg && <p style={{ fontSize: 13, color: "#DC2626", margin: "0 0 12px" }}>{msg}</p>}
        {classes.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: "left", color: "#5F6E7F", fontSize: 11, borderBottom: "2px solid #F1F5F9" }}>
                <th style={{ padding: "10px 12px", textAlign: "left" }}>Class</th>
                <th style={{ padding: "10px 12px" }}>Students</th>
                <th style={{ padding: "10px 12px" }}>Active This Week</th>
                <th style={{ padding: "10px 12px" }}>Avg Streak</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((c) => (
                <tr key={c.className} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "10px 12px", fontWeight: 700 }}>{c.className}</td>
                  <td style={{ padding: "10px 12px" }}>{c.students}</td>
                  <td style={{ padding: "10px 12px" }}>{c.activeWeek}</td>
                  <td style={{ padding: "10px 12px" }}>{c.avgStreak}d</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ fontSize: 13, color: "#94A3B8", margin: 0 }}>No classes yet. Upload a student roster to create classes.</p>
        )}
      </div>

      <div style={card}>
        <h2 style={{ fontSize: 16, margin: "0 0 12px", color: "#1E242E" }}>Departments</h2>
        <p style={{ fontSize: 13, color: "#5F6E7F", margin: 0 }}>
          Department management comes from your subject configuration. General subjects: English Studies, Mathematics, Physical Health Education, Economics, Christian Religious Studies, Civic Education, Geography, Digital Technologies. Science: Physics, Chemistry, Biology. Art: Literature in English, Government. Commercial: Commerce, Accounting, Marketing.
        </p>
      </div>
    </main>
  );
}