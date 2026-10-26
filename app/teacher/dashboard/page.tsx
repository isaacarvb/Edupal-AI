"use client";
import { useEffect, useState } from "react";

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, margin: "0 0 12px" };

type ClassData = { className: string; students: { userId: string; name: string; streak: number; answersWeek: number }[]; weakTopics: { subject: string; topic: string; students: number; accuracy: number }[] };

export default function TeacherDashboard() {
  const [userId, setUserId] = useState<string | null>(null);
  const [data, setData] = useState<{ teacher: { name: string; email: string; classes: string[] }; school: { name: string; code: string }; classes: ClassData[] } | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("edupal_user");
    setUserId(id);
    if (!id) return;
    fetch(`/api/teacher/dashboard?userId=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) setData(d);
      });
  }, []);

  if (!data) return <div style={{ padding: 20 }}>Loading…</div>;

  const totalStudents = data.classes.reduce((s, c) => s + c.students.length, 0);
  const totalActive = data.classes.reduce((s, c) => s + c.students.filter((st) => st.answersWeek > 0).length, 0);

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <div style={{ background: "#1E242E", color: "#fff", borderRadius: 16, padding: 18, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, margin: "0 0 4px" }}>{data.teacher.name}</h1>
            <p style={{ fontSize: 13, color: "#A7F3D0", margin: 0 }}>{data.teacher.email} · {data.school.name}</p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <span style={{ background: "#0F766E", color: "#fff", borderRadius: 999, padding: "4px 12px", fontSize: 12, fontWeight: 800 }}>{data.school.code}</span>
            <span style={{ background: "#333A45", color: "#fff", borderRadius: 999, padding: "4px 12px", fontSize: 12 }}>{data.classes.length} class{data.classes.length === 1 ? "" : "es"}</span>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginTop: 14 }}>
        <div style={{ ...card, background: "#333A45", color: "#fff" }}>
            <div style={{ fontSize: 11, color: "#94A3B8" }}>Students</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{totalStudents}</div>
          </div>
          <div style={{ ...card, background: "#333A45", color: "#fff" }}>
            <div style={{ fontSize: 11, color: "#94A3B8" }}>Active This Week</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{totalActive}</div>
          </div>
          <div style={{ ...card, background: "#333A45", color: "#fff" }}>
            <div style={{ fontSize: 11, color: "#94A3B8" }}>Classes</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{data.classes.length}</div>
          </div>
        </div>
      </div>

      {data.classes.map((c) => (
        <div key={c.className} style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div>
              <h2 style={{ color: "#1E242E", fontSize: 16, margin: 0 }}>{c.className}</h2>
              <p style={{ fontSize: 12, color: "#5F6E7F", margin: "2px 0 0" }}>{c.students.length} student{c.students.length === 1 ? "" : "s"}</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <a href={`/teacher/lesson-notes?class=${encodeURIComponent(c.className)}`}
                style={{ fontSize: 13, color: "#0F766E", fontWeight: 700, textDecoration: "none" }}>Write Note →</a>
              <a href={`/teacher/assignments?class=${encodeURIComponent(c.className)}`}
                style={{ fontSize: 13, color: "#0F766E", fontWeight: 700, textDecoration: "none", marginLeft: 12 }}>Set Assignment →</a>
            </div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ textAlign: "left", color: "#5F6E7F", fontSize: 11, borderBottom: "2px solid #F1F5F9" }}>
                  <th style={{ padding: "8px 10px", textAlign: "left" }}>Student</th>
                  <th style={{ padding: "8px 10px" }}>Streak</th>
                  <th style={{ padding: "8px 10px" }}>Answers This Week</th>
                  <th style={{ padding: "8px 10px" }}>Weak Topics</th>
                </tr>
              </thead>
              <tbody>
                {c.students.map((s) => {
                  const weak = c.weakTopics.filter((w) => w.students > 0).slice(0, 2);
                  return (
                    <tr key={s.userId} style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td style={{ padding: "8px 10px", fontWeight: 700 }}>{s.name}</td>
                      <td style={{ padding: "8px 10px" }}>{s.streak} days</td>
                      <td style={{ padding: "8px 10px" }}>{s.answersWeek}</td>
                      <td style={{ padding: "8px 10px", fontSize: 11, color: "#5F6E7F" }}>
                        {weak.length > 0 ? weak.map((w) => `${w.topic} (${w.accuracy}%)`).join(" · ") : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </main>
  );
}
