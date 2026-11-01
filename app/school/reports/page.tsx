"use client";
import { useEffect, useState } from "react";

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, margin: "0 0 12px" };

type StatCard = { label: string; value: string | number; color?: string };

type DeepOverview = {
  totalStudents: number;
  activeWeek: number;
  totalAnswers: number;
  avgStreak: number;
  classes: { className: string; students: number; activeWeek: number; avgAccuracy: number }[];
  subjects: { subject: string; students: number; avgAccuracy: number; weakCount: number }[];
  teachers: { name: string; subject: string; className: string; students: number; answers: number }[];
  topTopics: { subject: string; topic: string; accuracy: number; students: number }[];
};

export default function DeepReports() {
  const [userId, setUserId] = useState<string | null>(null);
  const [data, setData] = useState<DeepOverview | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const id = localStorage.getItem("edupal_user");
    setUserId(id);
    if (!id) return;
    fetch(`/api/school/reports?userId=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.summary) setData(d.summary);
      });
  }, []);

  if (!userId) return <div style={{ padding: 20 }}>Missing user.</div>;
  if (!data) return <div style={{ padding: 40, textAlign: "center", color: "#5F6E7F" }}>Loading school reports…</div>;

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, margin: 0 }}>📊 School Reports & Analytics</h1>
      </div>

      {/* Navigation Tabs */}
      <div style={{ background: "#F1F5F9", borderRadius: 10, padding: 4, marginBottom: 20 }}>
        <div style={{ display: "flex" }}>
          {["overview", "classes", "subjects", "teachers", "topics"].map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              style={{
                flex: 1,
                padding: "10px 0",
                borderRadius: 8,
                background: activeTab === tab ? "#0F766E" : "transparent",
                color: activeTab === tab ? "#fff" : "#5F6E7F",
                fontWeight: 700,
                fontSize: 13,
                border: 0,
                cursor: "pointer"
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          )}
        </div>
      </div>

      {activeTab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 20 }}>
          <StatCard label="Total Students" value={data.summary.totalStudents} color="#0F766E" />
          <StatCard label="Active This Week" value={data.summary.activeWeek} color="#0F766E" />
          <StatCard label="Answers This Week" value={data.summary.totalAnswers} color="#10B981" />
          <StatCard label="Avg Streak" value={`${data.summary.avgStreak} days`} color="#0F766E" />
        </div>
      )}

      {activeTab === "classes" && (
        <div style={card}>
          <h2 style={{ fontSize: 16, margin: "0 0 12px", color: "#1E242E" }}>🏫 Class Performance</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: "left", color: "#5F6E7F", fontSize: 11, borderBottom: "2px solid #F1F5F9" }}>
                <th style={{ padding: "10px 12px", textAlign: "left" }}>Class</th>
                <th style={{ padding: "8px 10px" }}>Students</th>
                <th style={{ padding: "8px 10px" }}>Active Week</th>
                <th style={{ padding: "8px 10px" }}>Avg Accuracy</th>
              </tr>
            </thead>
            <tbody>
              {data.summary.classes.map((c) => (
                <tr key={c.className} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "10px 12px", fontWeight: 700 }}>{c.className}</td>
                  <td style={{ padding: "10px 12px" }}>{c.students}</td>
                  <td style={{ padding: "8px 10px" }}>{c.activeWeek}</td>
                  <td style={{ padding: "8px 10px" }}>{c.avgAccuracy}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "subjects" && (
        <div style={card}>
          <h2 style={{ fontSize: 16, margin: "0 0 12px", color: "#1E242E" }}>📚 Subject Engagement</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: "left", color: "#5F6E7F", fontSize: 11, borderBottom: "2px solid #F1F5F9" }}>
                <th style={{ padding: "10px 12px", textAlign: "left" }}>Subject</th>
                <th style={{ padding: "10px 12px" }}>Students</th>
                <th style={{ padding: "8px 10px" }}>Avg Accuracy</th>
                <th style={{ padding: "8px 10px" }}>Weak Topics</th>
              </tr>
            </thead>
            <tbody>
              {data.summary.subjects.map((s) => (
                <tr key={s.subject} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "10px 12px", fontWeight: 700 }}>{s.subject}</td>
                  <td style={{ padding: "10px 12px" }}>{s.students}</td>
                  <td style={{ padding: "10px 12px" }}>{s.avgAccuracy}%</td>
                  <td style={{ padding: "10px 12px" }}>{s.weakCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "teachers" && (
        <div style={card}>
          <h2 style={{ fontSize: 16, margin: "0 0 12px", color: "#1E242E" }}>👩‍🏫 Teacher Activity</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: "left", color: "#5F6E7F", fontSize: 11, borderBottom: "2px solid #F1F5F9" }}>
                <th style={{ padding: "10px 12px", textAlign: "left" }}>Teacher</th>
                <th style={{ padding: "10px 12px" }}>Subject</th>
                <th style={{ padding: "10px 12px" }}>Class</th>
                <th style={{ padding: "10px 12px" }}>Students</th>
                <th style={{ padding: "10px 12px" }}>Questions</th>
              </tr>
            </thead>
            <tbody>
              {data.summary.teachers.map((t) => (
                <tr key={`${t.name}-${t.subject}`} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "10px 12px", fontWeight: 700 }}>{t.name}</td>
                  <td style={{ padding: "10px 12px" }}>{t.subject}</td>
                  <td style={{ padding: "10px 12px" }}>{t.className}</td>
                  <td style={{ padding: "10px 12px" }}>{t.students}</td>
                  <td style={{ padding: "10px 12px" }}>{t.answers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "topics" && (
        <div style={card}>
          <h2 style={{ fontSize: 16, margin: "0 0 12px", color: "#1E242E" }}>🎯 Topics Overview</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {data.summary.topTopics.map((t) => (
              <div key={`${t.subject}-${t.topic}`} style={{ fontSize: 13, padding: "10px 12px", borderRadius: 8, border: "1px solid #F1F5F9", flex: 1, minWidth: 130 }}>
                <div style={{ fontWeight: 700 }}>{t.topic}</div>
                <div style={{ fontSize: 11, color: "#5F6E7F", marginBottom: 4 }}>{t.subject}</div>
                <div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>{t.accuracy}% accuracy · {t.students} students</div>
                <div style={{ height: 6, borderRadius: 3, background: "#F1F5F9", marginTop: 6 }}>
                  <div style={{ height: "100%", borderRadius: 3, background: t.accuracy > 70 ? "#10B981" : t.accuracy > 50 ? "#F59E0B" : "#DC2626", width: `${t.accuracy}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

function StatCard({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div style={card}>
      <div style={{ fontSize: 12, fontWeight: 800, color: "#5F6E7F", textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 800, color: color || "#1E242E" }}>{value}</div>
    </div>
  );
}