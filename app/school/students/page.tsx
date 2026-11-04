"use client";

import { useEffect, useState } from "react";

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, margin: "0 0 12px" };

type StudentRow = { userId: string; name: string; email: string; className: string; streak: number; answersWeek: number; uploadedFrom: string };

export default function SchoolStudents() {
  const [userId, setUserId] = useState<string | null>(null);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [importMsg, setImportMsg] = useState("");
  const [importBusy, setImportBusy] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("edupal_user");
    setUserId(id);
    if (!id) return;
    fetch(`/api/school/roster?userId=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.roster) {
          setStudents(d.roster.map((r: any) => ({
            userId: r.userId,
            name: r.name,
            email: r.email,
            className: r.className,
            streak: r.streak ?? 0,
            answersWeek: r.answersWeek ?? 0,
            uploadedFrom: r.uploadedFrom ?? "Imported"
          })));
        }
      });
  }, []);

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) &&
    (!classFilter || s.className === classFilter)
  );
  const classes = [...new Set(students.map((s) => s.className))].sort();

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
      setImportMsg(`Imported ${d.imported} students.`);
      // Refresh roster
      const id = localStorage.getItem("edupal_user");
      fetch(`/api/school/roster?userId=${id}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((rd) => {
          if (rd?.roster) {
            setStudents(rd.roster.map((r: any) => ({
              userId: r.userId,
              name: r.name,
              email: r.email,
              className: r.className,
              streak: r.streak ?? 0,
              answersWeek: r.answersWeek ?? 0,
              uploadedFrom: r.uploadedFrom ?? "Imported"
            })));
          }
        });
    } catch (e) {
      setImportMsg(e instanceof Error ? e.message : "Import failed.");
    } finally {
      setImportBusy(false);
    }
  }

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <h1 style={{ fontSize: 24, margin: 0 }}>Students</h1>
      </div>

      {/* Bulk Import Section */}
      <div style={card}>
        <h2 style={{ fontSize: 16, margin: "0 0 12px", color: "#1E242E" }}>Bulk Import Students (CSV)</h2>
        <p style={{ fontSize: 13, color: "#5F6E7F", margin: "0 0 12px" }}>
          Upload a CSV with columns: <code style={{ color: "#1E242E" }}>name, email, class</code>
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
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
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
              <th style={{ padding: "10px 12x", textAlign: "left" }}>Student</th>
              <th style={{ padding: "10px 12x" }}>Class</th>
              <th style={{ padding: "10px 12x" }}>Email</th>
              <th style={{ padding: "10px 12x" }}>Streak</th>
              <th style={{ padding: "10px 12x" }}>Answers This Week</th>
              <th style={{ padding: "10px 12x" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((s) => (
                <tr key={s.userId} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "10px 12x", fontWeight: 700 }}>{s.name}</td>
                  <td style={{ padding: "10px 12x" }}>{s.className}</td>
                  <td style={{ padding: "10px 12x", fontSize: 12, color: "#5F6E7F", fontFamily: "monospace" }}>{s.email}</td>
                  <td style={{ padding: "10px 12x" }}>{s.streak} days</td>
                  <td style={{ padding: "10px 12x" }}>{s.answersWeek}</td>
                  <td style={{ padding: "10px 12x" }}>
                    <span style={{ fontSize: 11, fontWeight: 800, padding: "4px 8px", borderRadius: 999,
                      background: s.answersWeek > 0 ? "#16A34A" : "#DC2626", color: s.answersWeek > 0 ? "#166534" : "#991B1B" }}>
                      {s.answersWeek > 0 ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ padding: "24px", textAlign: "center", color: "#94A3B8" }}>
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}