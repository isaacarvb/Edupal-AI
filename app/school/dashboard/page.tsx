"use client";

import { useEffect, useState } from "react";

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, margin: "0 0 12px" };

export default function SchoolDashboard() {
  const [userId, setUserId] = useState<string | null>(null);
  const [data, setData] = useState<{
    totalStudents: number;
    activeWeek: number;
    totalAnswers: number;
    avgStreak: number;
    classes: { className: string; students: number; activeWeek: number; avgAccuracy: number }[];
    subjects: { subject: string; students: number; avgAccuracy: number; weakCount: number }[];
    teachers: { name: string; subject: string; className: string; students: number; answers: number }[];
    topTopics: { subject: string; topic: string; accuracy: number; students: number }[];
    schoolName: string;
  } | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("edupal_user");
    setUserId(id);
    if (!id) return;
    fetch(`/api/school/overview?userId=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.summary) {
          setData({
            ...d.summary,
            schoolName: d.summary?.schoolName || "My School"
          });
        }
      });
  }, []);

  if (!userId) return <div style={{ padding: 40, textAlign: "center", color: "#333A45" }}>Missing user.</div>;
  if (!data) return <div style={{ padding: 40, textAlign: "center", color: "#5F6E7F" }}>Loading school overview…</div>;

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1E242E", margin: "10px 0" }}>
          {data.schoolName}
        </h1>
        <p style={{ fontSize: 14, color: "#5F6E7F", margin: "4px 0" }}>School Portal Dashboard</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 20 }}>
        <div style={card}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#5F6E7F", textTransform: "uppercase" }}>Total Students</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#1E242E" }}>{data.totalStudents}</div>
        </div>
        <div style={card}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#5F6E7F", textTransform: "uppercase" }}>Active This Week</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#0F766E" }}>{data.activeWeek}</div>
        </div>
        <div style={card}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#5F6E7F", textTransform: "uppercase" }}>Total Answers</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#0F766E" }}>{data.totalAnswers}</div>
        </div>
        <div style={card}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#5F6E7F", textTransform: "uppercase" }}>Avg Streak</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#1E242E" }}>{data.avgStreak} days</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16, marginBottom: 24 }}>
        <div style={card}>
          <h2 style={{ fontSize: 16, margin: "0 0 12px", color: "#1E242E" }}>🏫 Class Performance</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: "left", color: "#5F6E7F", fontSize: 11, borderBottom: "2px solid #F1F5F9" }}>
                <th style={{ padding: "10px 12x", textAlign: "left" }}>Class</th>
                <th style={{ padding: "10px 12x" }}>Students</th>
                <th style={{ padding: "10px 12x" }}>Active This Week</th>
                <th style={{ padding: "10px 12x" }}>Avg Accuracy</th>
              </tr>
            </thead>
            <tbody>
              {data.classes.length > 0 ? (
                data.classes.map((c) => (
                  <tr key={c.className} style={{ borderBottom: "1px solid #F1F5F9" }}>
                    <td style={{ padding: "10px 12x", fontWeight: 700 }}>{c.className}</td>
                    <td style={{ padding: "10px 12x" }}>{c.students}</td>
                    <td style={{ padding: "10px 12x" }}>{c.activeWeek}</td>
                    <td style={{ padding: "10px 12x" }}>{c.avgAccuracy}%</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ padding: "24px", textAlign: "center", color: "#94A3B8" }}>
                    No class data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={card}>
          <h2 style={{ fontSize: 16, margin: "0 0 12px", color: "#1E242E" }}><strong>📚 Subject Coverage</strong></h2>
          {data.subjects.length > 0 ? (
            data.subjects.map((s) => (
              <div key={s.subject} style={{ marginBottom: 12, padding: "8px 12px", background: "#F8FAFC", borderRadius: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, color: "#1E242E" }}>{s.subject}</span>
                  <span style={{ fontSize: 11, color: "#5F6E7F" }}>{s.students} students</span>
                </div>
                <div style={{ height: 8, background: "#E2E8F0", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${s.avgAccuracy}%`, background: "#16A34A", height: "100%" }}></div>
                </div>
                <span style={{ fontSize: 11, color: "#5F6E7F" }}>{s.weakCount} weak topics</span>
              </div>
            ))
          ) : (
            <p style={{ fontSize: 13, color: "#5F6E7F", margin: 0 }}>No subject data available.</p>
          )}
        </div>

        <div style={card}>
          <h2 style={{ fontSize: 16, margin: "0 0 12px", color: "#1E242E" }}><strong>👨‍🏫 Teachers</strong></h2>
          {data.teachers.length > 0 ? (
            data.teachers.map((t) => (
              <div key={t.name} style={{ marginBottom: 8, padding: "6px 12px", background: "#F8FAFC", borderRadius: 6 }}>
                <span style={{ fontWeight: 600, color: "#1E242E" }}>{t.name}</span>
                <span style={{ fontSize: 11, color: "#5F6E7F" }}>{t.subject} • {t.className}</span>
              </div>
            ))
          ) : (
            <p style={{ fontSize: 13, color: "#5F6E7F", margin: 0 }}>No teachers assigned.</p>
          )}
        </div>

        <div style={card}>
          <h2 style={{ fontSize: 16, margin: "0 0 12px", color: "#1E242E" }}><strong>🎯 Top Topics</strong></h2>
          {data.topTopics.length > 0 ? (
            data.topTopics.map((t) => (
              <div key={t.topic} style={{ marginBottom: 8, padding: "4px 12px", background: "#F8FAFC", borderRadius: 6 }}>
                <span style={{ fontWeight: 600, color: "#1E242E" }}>{t.subject} · {t.topic}</span>
                <span style={{ fontSize: 11, color: "#5F6E7F" }}>{t.accuracy}% accuracy · {t.students} students</span>
              </div>
            ))
          ) : (
            <p style={{ fontSize: 13, color: "#5F6E7F", margin: 0 }}>No topic data available.</p>
          )}
        </div>
      </div>
    </main>
  );
}