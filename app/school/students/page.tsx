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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fileInputRef = { current: null as HTMLInputElement | null };

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
    setSelectedFile(file);
    try {
      let text = await file.text();
      // Strip BOM (Byte Order Mark) if present
      text = text.replace(/^\uFEFF/, "");
      const lines = text.trim().split(/\r?\n/);
      if (lines.length < 2) return setImportMsg("CSV must have a header row and at least one student row.");

      const header = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, "").toLowerCase());
      let nameIdx = header.findIndex((h) => h === "name" || h === "student" || h === "student name" || h === "full name");
      let classIdx = header.findIndex((h) => h === "class" || h === "class_name" || h === "classname" || h === "class name");
      let deptIdx = header.findIndex((h) => h === "department" || h === "dept");

      // Auto-detect if headers don't match — assume order: name, class, department
      const startRow = nameIdx === -1 || classIdx === -1 ? 0 : 1;
      if (nameIdx === -1) nameIdx = 0;
      if (classIdx === -1) classIdx = 1;
      if (deptIdx === -1 && header.length > 2) deptIdx = 2;

      if (lines.length < startRow + 1) return setImportMsg("No student data found in CSV.");

      const rows: Array<{ name: string; className: string; department: string | null }> = [];
      let debugInfo = "";
      for (let i = startRow; i < lines.length; i++) {
        // Parse CSV line handling quoted values
        const cols = lines[i].split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
        if (cols.length <= Math.max(nameIdx, classIdx)) continue;
        const name = cols[nameIdx]?.trim() || "";
        const className = cols[classIdx]?.trim() || "";
        if (!name) continue;
        if (i < startRow + 3) {
          debugInfo += `[${i}: name="${name}" class="${className}" dept="${deptIdx !== -1 ? cols[deptIdx]?.trim() : "N/A"}"] `;
        }
        rows.push({
          name,
          className: className || "Unassigned",
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
      setImportMsg(`Imported ${jd.imported} students. Frontend parsed: ${debugInfo} | API saved: ${jd.debug || "N/A"}`);
      fetchStudents();
    } catch (e) {
      setImportMsg(e instanceof Error ? e.message : "Import failed.");
    } finally {
      setImportBusy(false);
    }
  }

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleImport(f);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setImportMsg("");
    setImportBusy(false);
    // Clear the file input
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) input.value = "";
  };

  const handleDeleteAll = async () => {
    if (!confirm(`Delete ALL ${students.length} students from roster? This cannot be undone.`)) return;
    setImportBusy(true);
    try {
      const s = localStorage.getItem("edupal_school");
      if (!s) return;
      const d = JSON.parse(s);
      const res = await fetch("/api/school/students-delete-all", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schoolId: d.id })
      });
      const jd = await res.json();
      if (!res.ok) return setImportMsg(jd.error || "Failed to delete all.");
      setImportMsg(`Deleted ${jd.deleted} students.`);
      setStudents([]);
      fetchStudents();
    } catch (e) {
      setImportMsg(e instanceof Error ? e.message : "Failed to delete all.");
    } finally {
      setImportBusy(false);
    }
  };

  const handleDelete = async (studentId: string, studentName: string) => {
    if (!confirm(`Remove ${studentName} from roster?`)) return;
    setDeletingId(studentId);
    try {
      const res = await fetch(`/api/school/students-delete?studentId=${encodeURIComponent(studentId)}`, { method: "DELETE" });
      if (res.ok) {
        setStudents((prev) => prev.filter((s) => s.id !== studentId));
      } else {
        const d = await res.json().catch(() => ({}));
        setImportMsg(d.error || "Failed to remove student.");
      }
    } catch (e) {
      setImportMsg(e instanceof Error ? e.message : "Failed to remove student.");
    } finally {
      setDeletingId(null);
    }
  };

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
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
          <input
            type="file"
            accept=".csv"
            onChange={handleSelectFile}
            style={{ flex: 1, height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px" }}
          />
          {selectedFile && (
            <button onClick={handleRemoveFile}
              style={{ height: 44, borderRadius: 10, border: "1px solid #DC2626", background: "#FFF1F2", color: "#DC2626", fontWeight: 800, fontSize: 16, padding: "0 16px", cursor: "pointer" }}>
              ×
            </button>
          )}
        </div>
        {selectedFile && (
          <p style={{ fontSize: 12, color: "#5F6E7F", marginBottom: 4 }}>
            Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
          </p>
        )}
        {importMsg && <p style={{ fontSize: 13, marginTop: 6, color: importMsg.startsWith("Imported") ? "#166534" : "#DC2626" }}>{importMsg}</p>}
        {importBusy && <p style={{ fontSize: 13, color: "#5F6E7F" }}>Importing…</p>}
      </div>

      {/* Student List */}
      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", flex: 1 }}>
            <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} style={{ height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px" }}>
              <option value="">All Classes</option>
              {classes.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search student…"
              style={{ flex: 1, minWidth: 200, height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px" }} />
          </div>
          <button onClick={handleDeleteAll} disabled={importBusy || students.length === 0}
            style={{ height: 44, borderRadius: 10, border: "1px solid #DC2626", background: "#FFF1F2", color: "#DC2626", fontWeight: 700, fontSize: 13, padding: "0 16px", cursor: importBusy || students.length === 0 ? "not-allowed" : "pointer", opacity: students.length === 0 ? 0.5 : 1 }}>
            {importBusy ? "Deleting…" : "Delete All"}
          </button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ textAlign: "left", color: "#5F6E7F", fontSize: 11, borderBottom: "2px solid #F1F5F9" }}>
              <th style={{ padding: "10px 12px" }}>Student</th>
              <th style={{ padding: "10px 12px" }}>Class</th>
              <th style={{ padding: "10px 12px" }}>Department</th>
              <th style={{ padding: "10px 12px" }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((s) => (
                <tr key={s.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "10px 12px", fontWeight: 700 }}>{s.name}</td>
                  <td style={{ padding: "10px 12px", color: s.className ? "#333A45" : "#94A3B8" }}>{s.className || "Unassigned"}</td>
                  <td style={{ padding: "10px 12px", color: "#5F6E7F" }}>{s.department || "—"}</td>
                  <td style={{ padding: "10px 12px", textAlign: "right" }}>
                    <button onClick={() => handleDelete(s.id, s.name)} disabled={deletingId === s.id}
                      style={{ background: "#FFF1F2", border: "1px solid #FECACA", color: "#DC2626", fontWeight: 700, fontSize: 12, padding: "4px 10px", borderRadius: 6, cursor: deletingId === s.id ? "not-allowed" : "pointer" }}>
                      {deletingId === s.id ? "…" : "✕"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} style={{ padding: "24px", textAlign: "center", color: "#94A3B8" }}>
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
