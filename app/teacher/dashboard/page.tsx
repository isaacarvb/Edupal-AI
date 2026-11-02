"use client";
import { useEffect, useState } from "react";

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, margin: "0 0 12px" };

type ClassData = { className: string; students: { userId: string; name: string; streak: number; answersWeek: number; accuracy: number }[]; weakTopics: { subject: string; topic: string; students: number; accuracy: number }[] };
type ApprovedNote = { id: string; subject: string; topic: string; body: string; className: string; createdAt: string };

export default function TeacherDashboard() {
  const [userId, setUserId] = useState<string | null>(null);
  const [data, setData] = useState<{ teacher: { name: string; email: string; classes: string[] }; school: { name: string; code: string }; classes: ClassData[] } | null>(null);
  const [notes, setNotes] = useState<ApprovedNote[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("edupal_user");
    setUserId(id);
    if (!id) {
      setError("Please log in as a teacher.");
      return;
    }
    fetch(`/api/teacher/dashboard?userId=${id}`)
      .then(async (r) => {
        if (!r.ok) {
          const d = await r.json().catch(() => ({}));
          setError(d.error || "Failed to load dashboard.");
          return;
        }
        return r.json();
      })
      .then((d) => {
        if (d) setData(d);
      })
      .catch(() => setError("Failed to connect to the server."));

    // Fetch approved lesson notes for display in class
    fetch(`/api/school/lesson-notes?userId=${id}&teacherId=${id}&status=approved`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.notes) setNotes(d.notes.map((n: any) => ({
          id: n.id, subject: n.subject, topic: n.topic, body: n.body,
          className: n.className, createdAt: n.createdAt
        })));
      });
  }, []);

  if (error) {
    return (
      <main style={{ maxWidth: 560, margin: "48px auto", padding: "0 16px", color: "#333A45" }}>
        <div style={card}>
          <h1 style={{ fontSize: 20, margin: "0 0 8px" }}>⚠️ Unable to load dashboard</h1>
          <p style={{ fontSize: 14, color: "#5F6E7F", margin: 0 }}>{error}</p>
          <p style={{ fontSize: 13, color: "#5F6E7F", marginTop: 10 }}>
            Make sure you have a school created and your teacher account is linked to it.
          </p>
        </div>
      </main>
    );
  }

  if (!data) return <div style={{ padding: 20 }}>Loading…</div>;

  const firstName = data.teacher.name.split(" ")[0];
  const totalStudents = data.classes.reduce((s, c) => s + c.students.length, 0);
  const totalActive = data.classes.reduce((s, c) => s + c.students.filter((st) => st.answersWeek > 0).length, 0);
  const allAccuracies = data.classes.flatMap(c => c.students.map(s => s.accuracy)).filter(a => a > 0);
  const avgAccuracy = allAccuracies.length > 0 ? Math.round(allAccuracies.reduce((s, a) => s + a, 0) / allAccuracies.length) : 0;

  // Group approved notes by class for easy in-class display
  const notesByClass = new Map<string, ApprovedNote[]>();
  for (const n of notes) {
    const arr = notesByClass.get(n.className) || [];
    arr.push(n);
    notesByClass.set(n.className, arr);
  }

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <div style={{ background: "#1E242E", color: "#fff", borderRadius: 16, padding: 20, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, margin: "0 0 4px" }}>Welcome, {firstName}</h1>
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
          <div style={{ ...card, background: "#333A45", color: "#fff" }}>
            <div style={{ fontSize: 11, color: "#94A3B8" }}>Avg Accuracy</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{avgAccuracy}%</div>
          </div>
        </div>
      </div>

      {/* Approved Lesson Notes for Class Display */}
      {notes.length > 0 && (
        <div style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <h2 style={{ color: "#1E242E", fontSize: 16, margin: 0 }}>📋 Approved Lesson Notes (for Class Display)</h2>
            <a href="/teacher/lesson-notes" style={{ fontSize: 13, color: "#0F766E", fontWeight: 700, textDecoration: "none" }}>Manage Notes →</a>
          </div>
          {data.classes.map((c) => {
            const classNotes = notesByClass.get(c.className) || [];
            if (classNotes.length === 0) return null;
            return (
              <div key={c.className} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #F1F5F9" }}>
                <h3 style={{ fontSize: 14, margin: "0 0 8px", color: "#0F766E", fontWeight: 800 }}>{c.className}</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {classNotes.map((n) => (
                    <div key={n.id} style={{ flex: 1, minWidth: 200, background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: 12, fontSize: 13 }}>
                      <div style={{ fontWeight: 700, color: "#1E242E", marginBottom: 4 }}>{n.topic}</div>
                      <div style={{ fontSize: 11, color: "#5F6E7F", marginBottom: 6 }}>{n.subject}</div>
                      <div style={{ fontSize: 11, color: "#5F6E7F", marginBottom: 6 }}>{n.body.slice(0, 120)}{n.body.length > 120 ? "…" : ""}</div>
                      <a href={`/teacher/lesson-notes`} style={{ fontSize: 11, color: "#0F766E", fontWeight: 700, textDecoration: "none" }}>View full →</a>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        {data.classes.map((c) => {
          const classAvg = c.students.length > 0 ? Math.round(c.students.reduce((s, st) => s + st.accuracy, 0) / c.students.length) : 0;
          return (
            <div key={c.className} style={card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div>
                  <h2 style={{ color: "#1E242E", fontSize: 16, margin: 0 }}>{c.className}</h2>
                  <p style={{ fontSize: 12, color: "#5F6E7F", margin: "2px 0 0" }}>{c.students.length} student{c.students.length === 1 ? "" : "s"} · Avg {classAvg}%</p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <a href={`/teacher/lesson-notes?class=${encodeURIComponent(c.className)}`}
                    style={{ fontSize: 13, color: "#0F766E", fontWeight: 700, textDecoration: "none" }}>Write Note →</a>
                  <a href={`/teacher/assignments?class=${encodeURIComponent(c.className)}`}
                    style={{ fontSize: 13, color: "#0F766E", fontWeight: 700, textDecoration: "none", marginLeft: 12 }}>Set Assignment →</a>
                  <a href={`/teacher/questions?class=${encodeURIComponent(c.className)}`}
                    style={{ fontSize: 13, color: "#0F766E", fontWeight: 700, textDecoration: "none", marginLeft: 12 }}>Question Bank →</a>
                </div>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ textAlign: "left", color: "#5F6E7F", fontSize: 11, borderBottom: "2px solid #F1F5F9" }}>
                      <th style={{ padding: "8px 10px", textAlign: "left" }}>Student</th>
                      <th style={{ padding: "8px 10px" }}>Accuracy</th>
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
                          <td style={{ padding: "8px 10px" }}>{s.accuracy}%</td>
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
          );
        })}
      </div>
    </main>
  );
}
