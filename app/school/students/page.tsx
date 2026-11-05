"use client";

import { useEffect, useState } from "react";

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, margin: "0 0 12px" };

export default function SchoolStudents() {
  const [school, setSchool] = useState<{ id: string; name: string; code: string } | null>(null);
  const [students, setStudents] = useState<{ id: string; name: string; className: string; department: string | null }[]>([]);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [importMsg, setImportMsg] = useState("");
  const [importBusy, setImportBusy] = useState(false);

  useEffect(() => {
    const s = localStorage.getItem("edupal_school");
    if (s) {
      try { setSchool(JSON.parse(s)); } catch { /* ignore */ }
    }
    fetchStudents();
  }, []);

  async function fetchStudents() {
    const s = localStorage.getItem("edupal_school");
    if (!s) return;
    try {
      const d = JSON.parse(s);
      const res = await fetch(`/api/school/students-list?schoolId=${d.id}`);
      if (res.ok) {
        const jd = await res.json();
        setStudents(jd.students ?? []);
      }
    } catch { /* ignore */ }
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
      const classIdx = header.indexOf("class");
      const deptIdx = header.indexOf("department");

      if (nameIdx === -1 || classIdx === -1) {
        return setImportMsg("CSV must have columns: name, class (department optional)");
      }

      const rows: Array<{ name: string; className: string; department: string | null }> = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",");
        if (cols.length < 2) continue;
        rows.push({
          name: cols[nameIdx]?.trim() || "",
          className: cols[classIdx]?.trim() || "",
          department: deptIdx !== -1 ? (cols[deptIdx]?.trim() || null) : null
        });
      }

      if (rows.length === 0) return setImportMsg("No valid student rows found.");

      const s = localStorage.getItem("edupal_school");
      if (!s) return;
      const d = JSON.parse(s);

      const form = new FormData();
      form.append("schoolId", d.id);
      form.append("students", JSON.stringify(rows));

      const res = await fetch("/api/school/students-import", { method: "POST", body: form });
      const jd = await res.json();
      if (!res.ok) return setImportMsg(jd.error || "Import failed.");
      setImportMsg(`Imported ${jd.imported} students.`);
      fetchStudents();
    } catch (e) {
      setImportMsg(e instanceof Error ? e.message : "Import failed.");
    } finally {
      setImportBusy(false);
    }
  }

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) &&
    (!classFilter || s.className === classFilter)
  );
  const classes = [...new Set(students.map((s) => s.className))].sort();

  if (!school) {
    return (
      <main style={{ maxWidth: 480, margin: "60px auto", padding: 20, color: "#333A45", textAlign: "center" }}>
        <p style={{ fontSize: 14, color: "#5F6E7F" }}>School session not found.</p>
        <button onClick={() => { window.location.href = "/school-login"; }}
          style={{ height: 40, borderRadius: 8, border: 0, background: "#0F766E", color: "#fff", fontWeight: 800, padding: "0 20px", cursor: "pointer" }}>
          Sign In to School
        </button>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1E242E", margin: "0 0 16px" }}>Student Roster</h1>
      <p style={{ fontSize: 13, color: "#5F6E7F", marginBottom: 16 }}>
        Upload student roster via CSV. Columns: <code style={{ color: "#1E242E" }}>name, class, department</code> (department optional).
      </p>

      {/* Import Section */}
      <div style={card}>
        <div style={{ fontSize: 12, fontWeight: 800, color: "#5F6E7F", textTransform: "uppercase", marginBottom: 10 }}>Upload CSV</div>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImport(f); }}
          style={{ width: "100%", height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px", marginBottom: 8 }}
        />
        {importMsg && <p style={{ fontSize: 13, marginTop: 6, color: importMsg.startsWith("Imported") ? "#166534" : "#DC2626" }}>{importMsg}</p>}
        {importBusy && <p style={{ fontSize: 13, color: "#5F6E7F" }}>Importing…</p>}
      </div>

      {/* Student List */}
      <div style={card}>
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} style={{ height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px" }}>
            <option value="">All Classes</option>
            {classes.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search student…"
            style={{ flex: 1, height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px" }} />
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ textAlign: "left", color: "#5F6E7F", fontSize: 11, borderBottom: "2px solid #F1F5F9" }}>
              <th style={{ padding: "10px 12px" }}>Student</th>
              <th style={{ padding: "10px 12px" }}>Class</th>
              <th style={{ padding: "10px 12px" }}>Department</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((s) => (
                <tr key={s.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "10px 12px", fontWeight: 700 }}>{s.name}</td>
                  <td style={{ padding: "10px 12px" }}>{s.className}</td>
                  <td style={{ padding: "10px 12px", color: "#5F6E7F" }}>{s.department || "—"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} style={{ padding: "24px", textAlign: "center", color: "#94A3B8" }}>
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <p style={{ fontSize: 12, color: "#5F6E7F", marginTop: 8 }}>{filtered.length} student(s) displayed</p>
      </div>
    </main>
  );
}
