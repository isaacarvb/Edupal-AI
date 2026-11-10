"use client";

import { useEffect, useState } from "react";
import { parseCsv, findColumn, normalizeClass, downloadCsv } from "@/lib/csv";

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, margin: "0 0 12px" };

export default function SchoolTeachers() {
  const [school, setSchool] = useState<{ id: string; name: string; code: string } | null>(null);
  const [teachers, setTeachers] = useState<{ id: string; name: string; className: string; subject: string }[]>([]);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [importMsg, setImportMsg] = useState("");
  const [importBusy, setImportBusy] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const s = localStorage.getItem("edupal_school");
    if (s) {
      try { setSchool(JSON.parse(s)); } catch { /* ignore */ }
    }
    fetchTeachers();
  }, []);

  async function fetchTeachers() {
    const s = localStorage.getItem("edupal_school");
    if (!s) return;
    try {
      const d = JSON.parse(s);
      const res = await fetch(`/api/school/teachers-list?schoolId=${d.id}`);
      if (res.ok) {
        const jd = await res.json();
        setTeachers(jd.teachers ?? []);
      }
    } catch { /* ignore */ }
  }

  async function handleImport(file: File) {
    setImportMsg("");
    setImportBusy(true);
    setSelectedFile(file);
    try {
      const text = await file.text();
      const table = parseCsv(text);
      if (table.length < 2) return setImportMsg("CSV must have a header row and at least one teacher row.");

      const header = table[0];
      let nameIdx = findColumn(header, ["name", "teacher", "teacher name", "full name", "fullname"]);
      let classIdx = findColumn(header, ["class", "class name", "classname", "class_name", "level"]);
      let subjectIdx = findColumn(header, ["subject", "subject taught"]);

      const hasHeader = nameIdx !== -1 || classIdx !== -1 || subjectIdx !== -1;
      const startRow = hasHeader ? 1 : 0;
      if (nameIdx === -1) nameIdx = 0;
      if (classIdx === -1) classIdx = 1;
      if (subjectIdx === -1) subjectIdx = 2;

      const rows: Array<{ name: string; className: string; subject: string }> = [];
      for (let i = startRow; i < table.length; i++) {
        const cols = table[i];
        const name = (cols[nameIdx] ?? "").trim();
        if (!name) continue;
        const className = normalizeClass((cols[classIdx] ?? "").trim());
        const subject = (cols[subjectIdx] ?? "").trim();
        rows.push({ name, className: className || "Unassigned", subject: subject || "General" });
      }

      if (rows.length === 0) return setImportMsg("No valid teacher rows found. Use columns: name, class, subject.");

      const s = localStorage.getItem("edupal_school");
      if (!s) return;
      const d = JSON.parse(s);

      const form = new FormData();
      form.append("schoolId", d.id);
      form.append("teachers", JSON.stringify(rows));

      const res = await fetch("/api/school/teachers-import", { method: "POST", body: form });
      const jd = await res.json();
      if (!res.ok) return setImportMsg(jd.error || "Import failed.");
      const bits = [`Imported ${jd.imported} new teacher(s)`];
      if (jd.updated) bits.push(`updated ${jd.updated}`);
      if (jd.skipped) bits.push(`skipped ${jd.skipped}`);
      setImportMsg(bits.join(", ") + ".");
      fetchTeachers();
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
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) input.value = "";
  };

  const handleDeleteAll = async () => {
    if (!confirm(`Delete ALL ${teachers.length} teachers from roster? This cannot be undone.`)) return;
    setImportBusy(true);
    try {
      const s = localStorage.getItem("edupal_school");
      if (!s) return;
      const d = JSON.parse(s);
      const res = await fetch("/api/school/teachers-delete-all", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schoolId: d.id })
      });
      const jd = await res.json();
      if (!res.ok) return setImportMsg(jd.error || "Failed to delete all.");
      setImportMsg(`Deleted ${jd.deleted} teachers.`);
      setTeachers([]);
      fetchTeachers();
    } catch (e) {
      setImportMsg(e instanceof Error ? e.message : "Failed to delete all.");
    } finally {
      setImportBusy(false);
    }
  };

  const handleDelete = async (teacherId: string, teacherName: string) => {
    if (!confirm(`Remove ${teacherName} from roster?`)) return;
    setDeletingId(teacherId);
    try {
      const res = await fetch(`/api/school/teachers-delete?teacherId=${encodeURIComponent(teacherId)}`, { method: "DELETE" });
      if (res.ok) {
        setTeachers((prev) => prev.filter((t) => t.id !== teacherId));
      } else {
        const d = await res.json().catch(() => ({}));
        setImportMsg(d.error || "Failed to remove teacher.");
      }
    } catch (e) {
      setImportMsg(e instanceof Error ? e.message : "Failed to remove teacher.");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = teachers.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) &&
    (!classFilter || t.className === classFilter)
  );
  const classes = [...new Set(teachers.map((t) => t.className))].sort();

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
      <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1E242E", margin: "0 0 16px" }}>Teacher Roster</h1>
      <p style={{ fontSize: 13, color: "#5F6E7F", marginBottom: 16 }}>
        Upload teacher roster via CSV. Columns: <code style={{ color: "#1E242E" }}>name, class, subject</code>.
      </p>

      {/* Import Section */}
      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#5F6E7F", textTransform: "uppercase" }}>Upload CSV</div>
          <button
            onClick={() =>
              downloadCsv("teacher-roster-template.csv", [
                ["name", "class", "subject"],
                ["Mr. Adewale Johnson", "JSS1", "Mathematics"],
                ["Mrs. Ngozi Okeke", "SSS2", "Biology"]
              ])
            }
            style={{ height: 32, borderRadius: 8, border: "1px solid #0F766E", background: "#F0FDFA", color: "#0F766E", fontWeight: 700, fontSize: 12, padding: "0 10px", cursor: "pointer" }}
          >
            Download template
          </button>
        </div>
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
        {importMsg && <p style={{ fontSize: 13, marginTop: 6, color: importMsg.startsWith("Imported") || importMsg.startsWith("Deleted") ? "#166534" : "#DC2626" }}>{importMsg}</p>}
        {importBusy && <p style={{ fontSize: 13, color: "#5F6E7F" }}>Processing…</p>}
      </div>

      {/* Teacher List */}
      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", flex: 1 }}>
            <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} style={{ height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px" }}>
              <option value="">All Classes</option>
              {classes.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search teacher…"
              style={{ flex: 1, minWidth: 200, height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px" }} />
          </div>
          <button onClick={handleDeleteAll} disabled={importBusy || teachers.length === 0}
            style={{ height: 44, borderRadius: 10, border: "1px solid #DC2626", background: "#FFF1F2", color: "#DC2626", fontWeight: 700, fontSize: 13, padding: "0 16px", cursor: importBusy || teachers.length === 0 ? "not-allowed" : "pointer", opacity: teachers.length === 0 ? 0.5 : 1 }}>
            {importBusy ? "Deleting…" : "Delete All"}
          </button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ textAlign: "left", color: "#5F6E7F", fontSize: 11, borderBottom: "2px solid #F1F5F9" }}>
              <th style={{ padding: "10px 12px" }}>Teacher</th>
              <th style={{ padding: "10px 12px" }}>Class</th>
              <th style={{ padding: "10px 12px" }}>Subject</th>
              <th style={{ padding: "10px 12px" }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((t) => (
                <tr key={t.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "10px 12px", fontWeight: 700 }}>{t.name}</td>
                  <td style={{ padding: "10px 12px", color: t.className ? "#333A45" : "#94A3B8" }}>{t.className || "Unassigned"}</td>
                  <td style={{ padding: "10px 12px", color: "#5F6E7F" }}>{t.subject || "—"}</td>
                  <td style={{ padding: "10px 12px", textAlign: "right" }}>
                    <button onClick={() => handleDelete(t.id, t.name)} disabled={deletingId === t.id}
                      style={{ background: "#FFF1F2", border: "1px solid #FECACA", color: "#DC2626", fontWeight: 700, fontSize: 12, padding: "4px 10px", borderRadius: 6, cursor: deletingId === t.id ? "not-allowed" : "pointer" }}>
                      {deletingId === t.id ? "…" : "✕"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} style={{ padding: "24px", textAlign: "center", color: "#94A3B8" }}>
                  No teachers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <p style={{ fontSize: 12, color: "#5F6E7F", marginTop: 8 }}>{filtered.length} teacher(s) displayed</p>
      </div>
    </main>
  );
}
