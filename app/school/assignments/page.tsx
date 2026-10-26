"use client";
import { useEffect, useState } from "react";

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, margin: "0 0 12px" };

type AssignmentRow = { id: string; subject: string; topic: string; instructions: string; dueAt: string | null; teacherName: string; className: string };

export default function SchoolAssignments() {
  const [userId, setUserId] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<AssignmentRow[]>([]);

  useEffect(() => {
    const id = localStorage.getItem("edupal_user");
    setUserId(id);
    if (!id) return;
    fetch(`/api/school/assignments?userId=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.assignments) setAssignments(d.assignments.map((a: any) => ({
          id: a.id,
          subject: a.subject,
          topic: a.topic,
          instructions: a.instructions,
          dueAt: a.dueAt,
          teacherName: a.teacherName,
          className: a.className
        })));
      });
  }, []);

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <h1 style={{ fontSize: 24, margin: 0 }}>Assignments</h1>
      </div>

      <div style={card}>
        <p style={{ fontSize: 13, color: "#5F6E7F", margin: "0 0 12px" }}>
          View all assignments set by teachers across the school.
        </p>
        {assignments.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: "left", color: "#5F6E7F", fontSize: 11, borderBottom: "2px solid #F1F5F9" }}>
                <th style={{ padding: "10px 12px", textAlign: "left" }}>Topic</th>
                <th style={{ padding: "10px 12px" }}>Subject</th>
                <th style={{ padding: "10px 12px" }}>Class</th>
                <th style={{ padding: "10px 12px" }}>Teacher</th>
                <th style={{ padding: "10px 12px" }}>Due</th>
                <th style={{ padding: "10px 12px" }}>Instructions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => (
                <tr key={a.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "10px 12px", fontWeight: 700 }}>{a.topic}</td>
                  <td style={{ padding: "10px 12px" }}>{a.subject}</td>
                  <td style={{ padding: "10px 12px" }}>{a.className}</td>
                  <td style={{ padding: "10px 12px", fontSize: 12 }}>{a.teacherName}</td>
                  <td style={{ padding: "10px 12px", fontSize: 12 }}>{a.dueAt ? new Date(a.dueAt).toLocaleDateString("en-NG", { day: "numeric", month: "short" }) : "—"}</td>
                  <td style={{ padding: "10px 12px", fontSize: 12, color: "#5F6E7F" }}>{a.instructions.slice(0, 80)}{a.instructions.length > 80 ? "…" : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ fontSize: 13, color: "#94A3B8", margin: 0, textAlign: "center" }}>
            No assignments set yet. Teachers can set assignments from their dashboard.
          </p>
        )}
      </div>
    </main>
  );
}
