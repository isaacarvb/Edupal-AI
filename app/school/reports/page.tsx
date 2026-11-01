"use client";
import { useEffect, useState } from "react";

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, margin: "0 0 12px" };

type SchoolData = {
  totalStudents: number;
  activeWeek: number;
  totalAnswers: number;
  avgStreak: number;
  classes: { className: string; students: number; activeWeek: number; avgAccuracy: number }[];
  subjects: { subject: string; students: number; avgAccuracy: number; weakCount: number }[];
  teachers: { name: string; subject: string; className: string; students: number; answers: number }[];
  topTopics: { subject: string; topic: string; accuracy: number; students: number }[];
};

export default function SchoolReports() {
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
  } | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("edupal_user");
    setUserId(id);
    if (!id) return;
    fetch(`/api/school/reports?userId=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d?.summary) setData(d.summary); });
  }, []);

  if (!userId) return <div style={{ padding: 40, textAlign: "center", color: "#333A45" }}>Missing user.</div>;
  if (!data) return <div style={{ padding: 40, textAlign: "center", color: "#5F6E7F" }}>Loading school reports…</div>;

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ fontSize: 24, margin: 0 }}>School Overview</h1>
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
                <th style={{ padding: "8px 10px", textAlign: "left" }}>Class</th>
                <th style={{ padding: "8px 10px" }}>Students</th>
                <th style={{ padding: "8px 10px" }}>Active Week</th>
                <th style={{ padding: "8px 10px" }}>Avg Accuracy</th>
              </tr>
            </thead>
            <tbody>
              {data.classes.map((c) => (
                <tr key={c.className} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "8px 10px", fontWeight: 700 }}>{c.className}</td>
                  <td style={{ padding: "8px 10px" }}>{c.students}</td>
                  <td style={{ padding: "8px 10px" }}>{c.activeWeek}</td>
                  <td style={{ padding: "8px 10px" }}>{c.avgAccuracy}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={card}>
          <h2 style={{ fontSize: 16, margin: "0 0 12px", color: "#1E242E" }}>📚 Subject Performance</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: "left", color: "#5F6E7F", fontSize: 11, borderBottom: "2px solid #F1F5F9" }}>
                <th style={{ padding: "8px 10px", textAlign: "left" }}>Subject</th>
                <th style={{ padding: "8px 10px" }}>Students</th>
                <th style={{ padding: "8px 10px" }}>Avg Accuracy</th>
                <th style={{ padding: "8px 10px" }}>Weak Topics</th>
              </tr>
            </thead>
            <tbody>
              {data.subjects.map((s) => (
                <tr key={s.subject} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "8px 10px", fontWeight: 700 }}>{s.subject}</td>
                  <td style={{ padding: "8px 10px" }}>{s.students}</td>
                  <td style={{ padding: "8px 10px" }}>{s.avgAccuracy}%</td>
                  <td style={{ padding: "8px 10px" }}>{s.weakCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={card}>
          <h2 style={{ fontSize: 16, margin: "0 0 12px", color: "#1E242E" }}>👩‍🏫 Teacher Activity</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: "left", color: "#5F6E7F", fontSize: 11, borderBottom: "2px solid #F1F5F9" }}>
                <th style={{ padding: "8px 10px", textAlign: "left" }}>Teacher</th>
                <th style={{ padding: "8px 10px" }}>Subject</th>
                <th style={{ padding: "8px 10px" }}>Class</th>
                <th style={{ padding: "8px 10px" }}>Students</th>
                <th style={{ padding: "8px 10px" }}>Questions</th>
              </tr>
            </thead>
            <tbody>
              {data.teachers.map((t) => (
                <tr key={`${t.name}-${t.subject}`} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "8px 10px", fontWeight: 700 }}>{t.name}</td>
                  <td style={{ padding: "8px 10px" }}>{t.subject}</td>
                  <td style={{ padding: "8px 10px" }}>{t.className}</td>
                  <td style={{ padding: "8px 10px" }}>{t.students}</td>
                  <td style={{ padding: "8px 10px" }}>{t.answers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={card}>
          <h2 style={{ fontSize: 16, margin: "0 0 12px", color: "#1E242E" }}>🎯 Top Topics</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {data.topTopics.map((t) => (
              <div key={`${t.subject}-${t.topic}`} style={{ fontSize: 13, padding: "8px 12px", borderRadius: 8, border: "1px solid #F1F5F9", flex: 1, minWidth: 130 }}>
                <div style={{ fontWeight: 700 }}>{t.topic}</div>
                <div style={{ fontSize: 11, color: "#5F6E7F" }}>{t.subject}</div>
                <div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>{t.accuracy}% accuracy · {t.students} students</div>
                <div style={{ height: 6, borderRadius: 3, background: "#F1F5F9", marginTop: 6 }}>
                  <div style={{ height: "100%", borderRadius: 3, background: t.accuracy > 70 ? "#10B981" : t.accuracy > 50 ? "#F59E0B" : "#DC2626", width: `${t.accuracy}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
