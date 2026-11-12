"use client";
import { useEffect, useState } from "react";

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, margin: "0 0 12px" };

type Student = { userId: string; name: string; streak: number; answersWeek: number; accuracy: number };
type WeakTopic = { subject: string; topic: string; students: number; accuracy: number };
type ClassData = { className: string; students: Student[]; weakTopics: WeakTopic[] };
type Dashboard = {
  teacher: { name: string; email: string; classes: string[] };
  school: { name: string; code: string };
  pendingNotes?: number;
  classes: ClassData[];
};

export default function TeacherDashboard() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("edupal_user");
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
  const allAccuracies = data.classes.flatMap((c) => c.students.map((s) => s.accuracy)).filter((a) => a > 0);
  const avgAccuracy = allAccuracies.length > 0 ? Math.round(allAccuracies.reduce((s, a) => s + a, 0) / allAccuracies.length) : 0;
  const pendingNotes = data.pendingNotes ?? 0;

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <div style={{ borderRadius: 16, padding: 20, marginBottom: 16, background: "transparent" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1E242E", margin: "0 0 4px" }}>Welcome, {firstName}</h1>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#333A45", margin: 0 }}>{data.school.name}</p>
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

      {pendingNotes > 0 && (
        <a href="/teacher/lesson-notes" style={{ textDecoration: "none" }}>
          <div style={{ ...card, background: "#FFFBEB", borderColor: "#FCD34D", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontWeight: 800, color: "#92400E", fontSize: 14 }}>📝 {pendingNotes} lesson note{pendingNotes === 1 ? "" : "s"} awaiting VP review</div>
              <div style={{ fontSize: 12, color: "#92400E", opacity: 0.8, marginTop: 2 }}>Approved notes become visible to your students.</div>
            </div>
            <span style={{ fontSize: 13, fontWeight: 800, color: "#0F766E" }}>Open Lesson Notes →</span>
          </div>
        </a>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", margin: "20px 0 10px", flexWrap: "wrap", gap: 8 }}>
        <h2 style={{ color: "#1E242E", fontSize: 18, margin: 0 }}>My Classes</h2>
        <span style={{ fontSize: 12, color: "#5F6E7F" }}>Open a class to see its students, notes and question bank.</span>
      </div>

      {data.classes.length === 0 && (
        <div style={card}>
          <p style={{ fontSize: 13, color: "#5F6E7F", margin: 0 }}>
            No classes are assigned to you yet. Ask your school admin to add you to a class roster.
          </p>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 12 }}>
        {data.classes.map((c) => {
          const classAvg = c.students.length > 0 ? Math.round(c.students.reduce((s, st) => s + st.accuracy, 0) / c.students.length) : 0;
          const active = c.students.filter((st) => st.answersWeek > 0).length;
          const weak = c.weakTopics[0];
          return (
            <a
              key={c.className}
              href={`/teacher/classes/${encodeURIComponent(c.className)}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{ ...card, margin: 0, height: "100%", boxSizing: "border-box", cursor: "pointer", transition: "box-shadow 150ms ease, border-color 150ms ease" }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 18px -6px rgb(15 118 110 / 0.35)"; e.currentTarget.style.borderColor = "#0F766E"; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#E2E8F0"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#1E242E" }}>{c.className}</div>
                  <span style={{ fontSize: 11, fontWeight: 800, background: "#F0FDFA", color: "#0F766E", border: "1px solid #99F6E4", borderRadius: 999, padding: "2px 8px" }}>{classAvg}% avg</span>
                </div>
                <div style={{ display: "flex", gap: 14, fontSize: 12, color: "#5F6E7F", marginBottom: 10 }}>
                  <span><strong style={{ color: "#1E242E" }}>{c.students.length}</strong> student{c.students.length === 1 ? "" : "s"}</span>
                  <span><strong style={{ color: "#1E242E" }}>{active}</strong> active this week</span>
                </div>
                <div style={{ fontSize: 12, color: "#5F6E7F", minHeight: 34 }}>
                  {weak ? <>Weak topic: <strong style={{ color: "#B45309" }}>{weak.topic}</strong> ({weak.accuracy}%)</> : "No weak topics flagged yet."}
                </div>
                <div style={{ marginTop: 10, fontSize: 13, fontWeight: 800, color: "#0F766E" }}>Open class →</div>
              </div>
            </a>
          );
        })}
      </div>
    </main>
  );
}
