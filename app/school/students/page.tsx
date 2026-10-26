"use client";
import { useEffect, useState } from "react";

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, margin: "0 0 12px" };

type StudentRow = { userId: string; name: string; email: string; className: string; streak: number; answersWeek: number };

export default function SchoolStudents() {
  const [userId, setUserId] = useState<string | null>(null);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");

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
            answersWeek: r.answersWeek ?? 0
          })));
        }
      });
  }, []);

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) &&
    (!classFilter || s.className === classFilter)
  );
  const classes = [...new Set(students.map((s) => s.className))].sort();

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <h1 style={{ fontSize: 24, margin: 0 }}>Students</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} style={{ height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px" }}>
            <option value="">All Classes</option>
            {classes.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search student…"
            style={{ flex: 1, height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px" }} />
        </div>
      </div>

      <div style={card}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ textAlign: "left", color: "#5F6E7F", fontSize: 11, borderBottom: "2px solid #F1F5F9" }}>
              <th style={{ padding: "10px 12px", textAlign: "left" }}>Student</th>
              <th style={{ padding: "10px 12px" }}>Class</th>
              <th style={{ padding: "10px 12px" }}>Email</th>
              <th style={{ padding: "10px 12px" }}>Streak</th>
              <th style={{ padding: "10px 12px" }}>Answers This Week</th>
              <th style={{ padding: "10px 12px" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((s) => (
                <tr key={s.userId} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "10px 12px", fontWeight: 700 }}>{s.name}</td>
                  <td style={{ padding: "10px 12px" }}>{s.className}</td>
                  <td style={{ padding: "10px 12px", fontSize: 12, color: "#5F6E7F", fontFamily: "monospace" }}>{s.email}</td>
                  <td style={{ padding: "10px 12px" }}>{s.streak} days</td>
                  <td style={{ padding: "10px 12px" }}>{s.answersWeek}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{ fontSize: 11, fontWeight: 800, padding: "4px 8px", borderRadius: 999,
                      background: s.answersWeek > 0 ? "#DCFCE7" : "#FEE2E2", color: s.answersWeek > 0 ? "#166534" : "#991B1B" }}>
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
