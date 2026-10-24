"use client";
import { useEffect, useState } from "react";

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, margin: "0 0 12px" };

type ClassData = {
  className: string;
  students: { userId: string; name: string; email: string; streak: number; answersWeek: number }[];
  studentCount: number;
  weakTopics: { subject: string; topic: string; students: number; accuracy: number }[];
};

export default function TeacherDashboard() {
  const [userId, setUserId] = useState<string | null>(null);
  const [data, setData] = useState<null | { teacher: { id: string; name: string; email: string; classes: string[] }; school: { id: string; name: string; code: string }; classes: ClassData[] }>(null);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("edupal_user");
    setUserId(id);
    if (!id) return setDenied(true);
    if (localStorage.getItem("edupal_role") !== "SCHOOL_TEACHER") return setDenied(true);
    fetch(`/api/teacher/dashboard?userId=${id}`)
      .then(async (r) => {
        if (!r.ok) return setDenied(true);
        const d = await r.json();
        setData(d);
      })
      .catch(() => setDenied(true));
  }, []);

  if (denied) {
    return (
      <main style={{ maxWidth: 560, margin: "48px auto", padding: "0 16px", color: "#333A45" }}>
        <div style={card}>
          <h1 style={{ fontSize: 20, margin: "0 0 8px" }}>📚 Teacher Dashboard</h1>
          <p style={{ fontSize: 14, color: "#5F6E7F", margin: 0 }}>
            This area is for teacher accounts. Log in with your teacher credentials at <strong>/login</strong>, or ask your school's VP Academics to create your teacher account.
          </p>
        </div>
      </main>
    );
  }

  if (!data) return <main style={{ padding: 32, color: "#333A45" }}>Loading teacher dashboard…</main>;

  const { teacher, school, classes } = data;
  const totalStudents = classes.reduce((s, c) => s + c.studentCount, 0);
  const totalActive = classes.reduce((s, c) => s + c.students.filter((st) => st.answersWeek > 0).length, 0);
  const totalAnswers = classes.reduce((s, c) => s + c.students.reduce((t, st) => t + st.answersWeek, 0), 0);

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <div style={{ background: "#1E242E", color: "#fff", borderRadius: 16, padding: 18, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, margin: "0 0 4px" }}>{teacher.name}</h1>
            <p style={{ fontSize: 13, color: "#A7F3D0", margin: 0 }}>{teacher.email} · {school.name}</p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <span style={{ background: "#0F766E", color: "#fff", borderRadius: 999, padding: "4px 12px", fontSize: 12, fontWeight: 800 }}>{school.code}</span>
            <span style={{ background: "#333A45", color: "#fff", borderRadius: 999, padding: "4px 12px", fontSize: 12 }}>{classes.length} class{classes.length === 1 ? "" : "es"}</span>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginTop: 14 }}>
          <div style={{ ...card, margin: 0, background: "#333A45", color: "#fff" }}>
            <div style={{ fontSize: 11, color: "#94A3B8" }}>Students</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{totalStudents}</div>
          </div>
          <div style={{ ...card, margin: 0, background: "#333A45", color: "#fff" }}>
            <div style={{ fontSize: 11, color: "#94A3B8" }}>Active this week</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{totalActive}</div>
          </div>
          <div style={{ ...card, margin: 0, background: "#333A45", color: "#fff" }}>
            <div style={{ fontSize: 11, color: "#94A3B8" }}>Answers this week</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{totalAnswers}</div>
          </div>
        </div>
      </div>

      {classes.map((c) => (
        <div key={c.className} style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div>
              <h2 style={{ color: "#1E242E", fontSize: 16, margin: 0 }}>{c.className}</h2>
              <p style={{ fontSize: 12, color: "#5F6E7F", margin: "2px 0 0" }}>{c.studentCount} student{c.studentCount === 1 ? "" : "s"}</p>
            </div>
            <a href={`/teacher/lesson-notes?class=${encodeURIComponent(c.className)}&school=${school.id}`} style={{ fontSize: 13, color: "#0F766E", fontWeight: 700, textDecoration: "none" }}>Write note →</a>
            <a href={`/teacher/assignments?class=${encodeURIComponent(c.className)}&school=${school.id}`} style={{ fontSize: 13, color: "#0F766E", fontWeight: 700, textDecoration: "none", marginLeft: 12 }}>Set assignment →</a>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ textAlign: "left", color: "#5F6E7F", fontSize: 11, borderBottom: "2px solid #F1F5F9" }}>
                  <th style={{ padding: "8px 10px", textAlign: "left" }}>Student</th>
                  <th style={{ padding: "8px 10px" }}>Streak</th>
                  <th style={{ padding: "8px 10px" }}>Answers this week</th>
                  <th style={{ padding: "8px 10px" }}>Weak topics</th>
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
          {c.weakTopics.length > 0 && (
            <div style={{ marginTop: 8, fontSize: 12, color: "#DC2626" }}>
              <strong>Class needs attention:</strong> {c.weakTopics.map((w) => `${w.topic} — ${w.accuracy}%`).join(" · ")}
            </div>
          )}
        </div>
      ))}
    </main>
  );
}
