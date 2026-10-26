"use client";
import { useEffect, useState } from "react";

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, margin: "0 0 12px" };

type ClassStat = { className: string; students: number; activeWeek: number; avgAccuracy: number; avgStreak: number };
type SubjectStat = { subject: string; students: number; avgAccuracy: number; weakCount: number };

export default function AcademicReports() {
  const [userId, setUserId] = useState<string | null>(null);
  const [classStats, setClassStats] = useState<ClassStat[]>([]);
  const [subjectStats, setSubjectStats] = useState<SubjectStat[]>([]);
  const [overall, setOverall] = useState<{ totalStudents: number; activeWeek: number; avgAccuracy: number; totalAnswers: number } | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("edupal_user");
    setUserId(id);
    if (!id) return;
    fetch(`/api/school/overview?userId=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.summary) setOverall(d.summary);
        if (d?.classes) {
          setClassStats(d.classes.map((c: any) => ({
            className: c.className,
            students: c.students,
            activeWeek: c.activeWeek,
            avgAccuracy: c.avgAccuracy ?? 0,
            avgStreak: c.avgStreak
          })));
        }
        if (d?.weak) {
          const bySubject: Record<string, { students: number; accuracies: number[] }> = {};
          d.weak.forEach((w: any) => {
            if (!bySubject[w.subject]) bySubject[w.subject] = { students: 0, accuracies: [] };
            bySubject[w.subject].students += w.students;
            bySubject[w.subject].accuracies.push(w.accuracy);
          });
          setSubjectStats(Object.entries(bySubject).map(([subject, data]) => ({
            subject,
            students: data.students,
            avgAccuracy: Math.round(data.accuracies.reduce((a, b) => a + b, 0) / data.accuracies.length),
            weakCount: data.accuracies.length
          })));
        }
      });
  }, []);

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ fontSize: 24, margin: 0 }}>Academic Reports</h1>
      </div>

      {overall && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 20 }}>
            <div style={card}>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1, color: "#5F6E7F", textTransform: "uppercase" }}>Total Students</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: "#1E242E", marginTop: 4 }}>{overall.totalStudents}</div>
            </div>
            <div style={card}>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1, color: "#5F6E7F", textTransform: "uppercase" }}>Active This Week</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: "#1E242E", marginTop: 4 }}>{overall.activeWeek}</div>
            </div>
            <div style={card}>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1, color: "#5F6E7F", textTransform: "uppercase" }}>Average Accuracy</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: "#1E242E", marginTop: 4 }}>{overall.avgAccuracy}%</div>
            </div>
            <div style={card}>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1, color: "#5F6E7F", textTransform: "uppercase" }}>Total Answers</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: "#1E242E", marginTop: 4 }}>{overall.totalAnswers}</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 12 }}>
            <div style={card}>
              <h2 style={{ fontSize: 16, margin: "0 0 12px", color: "#1E242E" }}>🏫 Performance by Class</h2>
              {classStats.length > 0 ? (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ textAlign: "left", color: "#5F6E7F", fontSize: 11, borderBottom: "2px solid #F1F5F9" }}>
                      <th style={{ padding: "8px 10px", textAlign: "left" }}>Class</th>
                      <th style={{ padding: "8px 10px" }}>Students</th>
                      <th style={{ padding: "8px 10px" }}>Active Week</th>
                      <th style={{ padding: "8px 10px" }}>Avg Accuracy</th>
                      <th style={{ padding: "8px 10px" }}>Avg Streak</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classStats.map((c) => (
                      <tr key={c.className} style={{ borderBottom: "1px solid #F1F5F9" }}>
                        <td style={{ padding: "8px 10px", fontWeight: 700 }}>{c.className}</td>
                        <td style={{ padding: "8px 10px" }}>{c.students}</td>
                        <td style={{ padding: "8px 10px" }}>{c.activeWeek}</td>
                        <td style={{ padding: "8px 10px" }}>{c.avgAccuracy}%</td>
                        <td style={{ padding: "8px 10px" }}>{c.avgStreak}d</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ fontSize: 13, color: "#5F6E7F", margin: 0 }}>No class data available.</p>
              )}
            </div>

            <div style={card}>
              <h2 style={{ fontSize: 16, margin: "0 0 12px", color: "#1E242E" }}>📊 Performance by Subject</h2>
              {subjectStats.length > 0 ? (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ textAlign: "left", color: "#5F6E7F", fontSize: 11, borderBottom: "2px solid #F1F5F9" }}>
                      <th style={{ padding: "8px 10px", textAlign: "left" }}>Subject</th>
                      <th style={{ padding: "8px 10px" }}>Weak Topics</th>
                      <th style={{ padding: "8px 10px" }}>Students</th>
                      <th style={{ padding: "8px 10px" }}>Avg Accuracy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjectStats.map((s) => (
                      <tr key={s.subject} style={{ borderBottom: "1px solid #F1F5F9" }}>
                        <td style={{ padding: "8px 10px", fontWeight: 700 }}>{s.subject}</td>
                        <td style={{ padding: "8px 10px" }}>{s.weakCount}</td>
                        <td style={{ padding: "8px 10px" }}>{s.students}</td>
                        <td style={{ padding: "8px 10px" }}>{s.avgAccuracy}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ fontSize: 13, color: "#5F6E7F", margin: 0 }}>No subject data available.</p>
              )}
            </div>
          </div>
        </>
      )}
    </main>
  );
}
