"use client";
import { useEffect, useState } from "react";

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, margin: "0 0 12px" };

type Stat = { label: string; value: string | number; sub?: string };

export default function SchoolDashboard() {
  const [userId, setUserId] = useState<string | null>(null);
  const [stats, setStats] = useState<Stat[]>([]);
  const [weak, setWeak] = useState<Array<{ subject: string; topic: string; students: number; accuracy: number }>>([]);
  const [top, setTop] = useState<Array<{ name: string; className: string; answers: number }>>([]);
  const [classes, setClasses] = useState<Array<{ className: string; students: number; activeWeek: number; avgStreak: number }>>([]);

  useEffect(() => {
    const id = localStorage.getItem("edupal_user");
    setUserId(id);
    if (!id) return;
    fetch(`/api/school?userId=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.school) {
          setStats([
            { label: "Total Students", value: d.members ?? 0 },
            { label: "Active This Week", value: d.activeWeek ?? 0 },
            { label: "Answers This Week", value: d.answers ?? 0 },
            { label: "Avg Streak", value: `${d.avgStreak ?? 0} days` }
          ]);
        }
      });
    fetch(`/api/school/overview?userId=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.weak) setWeak(d.weak);
        if (d?.top) setTop(d.top);
        if (d?.classes) setClasses(d.classes);
      });
  }, []);

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ fontSize: 24, margin: 0 }}>School Overview</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 20 }}>
        {stats.map((s) => (
          <div key={s.label} style={card}>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1, color: "#5F6E7F", textTransform: "uppercase" }}>{s.label}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#1E242E", marginTop: 4 }}>{s.value}</div>
            {s.sub && <div style={{ fontSize: 12, color: "#5F6E7F", marginTop: 2 }}>{s.sub}</div>}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 12 }}>
        <div style={card}>
          <h2 style={{ fontSize: 16, margin: "0 0 12px", color: "#1E242E" }}>🎯 Weakest Topics</h2>
          {weak.length > 0 ? (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {weak.map((w) => (
                <li key={`${w.subject}-${w.topic}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #F1F5F9", fontSize: 13 }}>
                  <div>
                    <strong>{w.topic}</strong> <span style={{ fontSize: 11, color: "#5F6E7F", marginLeft: 6 }}>{w.subject}</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 800, color: w.accuracy < 50 ? "#DC2626" : "#F59E0B" }}>{w.accuracy}%</div>
                    <div style={{ fontSize: 11, color: "#5F6E7F" }}>{w.students} student{w.students === 1 ? "" : "s"}</div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ fontSize: 13, color: "#5F6E7F", margin: 0 }}>No weak topics recorded yet.</p>
          )}
        </div>

        <div style={card}>
          <h2 style={{ fontSize: 16, margin: "0 0 12px", color: "#1E242E" }}>🏆 Top Performers</h2>
          {top.length > 0 ? (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {top.map((t, i) => (
                <li key={`${t.name}-${i}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #F1F5F9", fontSize: 13 }}>
                  <div>
                    <strong style={{ fontSize: 14 }}>{t.name}</strong>
                    <div style={{ fontSize: 11, color: "#5F6E7F" }}>{t.className}</div>
                  </div>
                  <div style={{ fontWeight: 800 }}>{t.answers} answers</div>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ fontSize: 13, color: "#5F6E7F", margin: 0 }}>No activity recorded yet.</p>
          )}
        </div>
      </div>

      {classes.length > 0 && (
        <div style={{ ...card, marginTop: 12 }}>
          <h2 style={{ fontSize: 16, margin: "0 0 12px", color: "#1E242E" }}>🏫 By Class</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: "left", color: "#5F6E7F", fontSize: 11, borderBottom: "2px solid #F1F5F9" }}>
                <th style={{ padding: "8px 10px", textAlign: "left" }}>Class</th>
                <th style={{ padding: "8px 10px" }}>Students</th>
                <th style={{ padding: "8px 10px" }}>Active This Week</th>
                <th style={{ padding: "8px 10px" }}>Avg Streak</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((c) => (
                <tr key={c.className} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "8px 10px", fontWeight: 700 }}>{c.className}</td>
                  <td style={{ padding: "8px 10px" }}>{c.students}</td>
                  <td style={{ padding: "8px 10px" }}>{c.activeWeek}</td>
                  <td style={{ padding: "8px 10px" }}>{c.avgStreak}d</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
