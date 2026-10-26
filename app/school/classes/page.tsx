"use client";
import { useEffect, useState } from "react";

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, margin: "0 0 12px" };

type ClassRow = { className: string; students: number; activeWeek: number; avgStreak: number };

export default function SchoolClasses() {
  const [userId, setUserId] = useState<string | null>(null);
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [newClass, setNewClass] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("edupal_user");
    setUserId(id);
    if (!id) return;
    fetch(`/api/school/overview?userId=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.classes) setClasses(d.classes.map((c: any) => ({
          className: c.className,
          students: c.students,
          activeWeek: c.activeWeek,
          avgStreak: c.avgStreak
        })));
      });
  }, []);

  async function addClass() {
    if (!newClass.trim()) return;
    // Add class by creating a placeholder student or via a classes API
    // For now, show message that classes are created via roster upload
    setMsg("Classes are created automatically when you upload a student roster. Upload a roster with the new class name.");
  }
  const [msg, setMsg] = useState("");

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <h1 style={{ fontSize: 24, margin: 0 }}>Classes & Departments</h1>
      </div>

      <div style={card}>
        <h2 style={{ fontSize: 16, margin: "0 0 12px", color: "#1E242E" }}>Classes</h2>
        <p style={{ fontSize: 13, color: "#5F6E7F", margin: "0 0 10px" }}>
          Classes are created automatically when you upload a student roster. Each student is assigned to a class on upload.
        </p>
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
          Department management comes from your subject configuration. Subjects available: English, Mathematics, Physics, Chemistry, Biology, Commerce, Economics, Government, Literature in English.
        </p>
      </div>
    </main>
  );
}
