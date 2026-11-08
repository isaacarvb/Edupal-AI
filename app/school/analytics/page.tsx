"use client";

import { useEffect, useState } from "react";

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, margin: "0 0 12px" };

export default function SchoolAnalytics() {
  const [school, setSchool] = useState<{ id: string; name: string; code: string } | null>(null);
  const [subjects, setSubjects] = useState<{ subject: string; students: number; avgAccuracy: number; weakCount: number }[]>([]);
  const [classes, setClasses] = useState<{ className: string; students: number; avgAccuracy: number; activeWeek: number }[]>([]);
  const [leaders, setLeaders] = useState<{ name: string; className: string; department: string | null; answers: number; avgAccuracy: number }[]>([]);
  const [departments, setDepartments] = useState<{ departmentName: string; students: number; avgAccuracy: number; totalAnswers: number }[]>([]);
  const [leaderboard, setLeaderboard] = useState<Record<string, Array<{ name: string; answers: number; avgAccuracy: number }>>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const s = localStorage.getItem("edupal_school");
    if (s) {
      try { setSchool(JSON.parse(s)); } catch { /* ignore */ }
    }
    fetchData();
  }, []);

  async function fetchData() {
    const s = localStorage.getItem("edupal_school");
    if (!s) return;
    try {
      const d = JSON.parse(s);
      setBusy(true);
      const [r1, r2, r3, r4, r5] = await Promise.all([
        fetch(`/api/school/analytics-subjects?schoolId=${d.id}`),
        fetch(`/api/school/analytics-classes?schoolId=${d.id}`),
        fetch(`/api/school/analytics-leaders?schoolId=${d.id}`),
        fetch(`/api/school/analytics-departments?schoolId=${d.id}`),
        fetch(`/api/school/analytics-leaderboard?schoolId=${d.id}`)
      ]);
      if (r1.ok) { const jd = await r1.json(); setSubjects(jd.subjects ?? []); }
      if (r2.ok) { const jd = await r2.json(); setClasses(jd.classes ?? []); }
      if (r3.ok) { const jd = await r3.json(); setLeaders(jd.leaders ?? []); }
      if (r4.ok) { const jd = await r4.json(); setDepartments(jd.departments ?? []); }
      if (r5.ok) { const jd = await r5.json(); setLeaderboard(jd.leaderboard ?? {}); }
    } catch { /* ignore */ } finally {
      setBusy(false);
    }
  }

  if (!school) {
    return (
      <main style={{ maxWidth: 480, margin: "60px auto", padding: 20, color: "#333A45", textAlign: "center" }}>
        <p style={{ fontSize: 14, color: "#5F6E7F" }}>School session not found.</p>
        <button onClick={() => { window.location.href = "/school-login"; }}
          style={{ height: 40, borderRadius: 8, border: 0, background: "#0F766E", color: "#fff", fontWeight: 800, padding: "0 20px", cursor: "pointer" }}>
          Sign In to School
        </button>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1E242E", margin: "0 0 20px" }}>Progress Analytics</h1>
      <p style={{ fontSize: 13, color: "#5F6E7F", marginBottom: 20 }}>
        School-wide and per-class performance metrics for {school.name}.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, marginBottom: 24 }}>
        <div style={card}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#5F6E7F", textTransform: "uppercase", marginBottom: 8 }}>📊 Subjects Practiced</div>
          {subjects.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {subjects.map((s) => (
                <div key={s.subject} style={{ borderBottom: "1px solid #F1F5F9", paddingBottom: 6, fontSize: 13 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 700 }}>{s.subject}</span>
                    <span style={{ fontSize: 11, color: "#5F6E7F" }}>{s.avgAccuracy}% avg</span>
                  </div>
                  <div style={{ height: 6, background: "#E2E8F0", borderRadius: 3, overflow: "hidden", marginTop: 4 }}>
                    <div style={{ height: "100%", background: s.avgAccuracy >= 70 ? "#16A34A" : s.avgAccuracy >= 50 ? "#F59E0B" : "#DC2626", width: `${Math.min(s.avgAccuracy, 100)}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: 13, color: "#5F6E7F", textAlign: "center", marginTop: 20 }}>No subject data yet.</p>
          )}
        </div>

        <div style={card}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#5F6E7F", textTransform: "uppercase", marginBottom: 8 }}>🏆 Top Classes</div>
          {classes.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {classes.map((c) => (
                <div key={c.className} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, borderBottom: "1px solid #F1F5F9", paddingBottom: 6 }}>
                  <span style={{ fontWeight: 700 }}>{c.className}</span>
                  <span style={{ color: "#5F6E7F" }}>{c.students} students · {c.activeWeek} active</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: 13, color: "#5F6E7F", textAlign: "center", marginTop: 20 }}>No class data yet.</p>
          )}
        </div>

        <div style={card}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#5F6E7F", textTransform: "uppercase", marginBottom: 8 }}>🎓 Top Department</div>
          {departments.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {departments.map((d) => (
                <div key={d.departmentName} style={{ borderBottom: "1px solid #F1F5F9", paddingBottom: 6, fontSize: 13 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 700 }}>{d.departmentName}</span>
                    <span style={{ fontSize: 11, color: "#5F6E7F" }}>{d.avgAccuracy}% avg</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#5F6E7F" }}>{d.students} students · {d.totalAnswers} answers</div>
                  <div style={{ height: 6, background: "#E2E8F0", borderRadius: 3, overflow: "hidden", marginTop: 4 }}>
                    <div style={{ height: "100%", background: d.avgAccuracy >= 70 ? "#16A34A" : d.avgAccuracy >= 50 ? "#F59E0B" : "#DC2626", width: `${Math.min(d.avgAccuracy, 100)}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: 13, color: "#5F6E7F", textAlign: "center", marginTop: 20 }}>No department data yet.</p>
          )}
        </div>

        <div style={card}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#5F6E7F", textTransform: "uppercase", marginBottom: 8 }}>👑 Most Active Students</div>
          {leaders.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {leaders.map((l, i) => (
                <div key={l.name} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, borderBottom: "1px solid #F1F5F9", paddingBottom: 6 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: i === 0 ? "#DC2626" : i === 1 ? "#F59E0B" : i === 2 ? "#EAB308" : "#6B7280" }}>{i + 1}</span>
                    <span style={{ fontWeight: 600 }}>{l.name}</span>
                    <span style={{ fontSize: 11, color: "#5F6E7F" }}>{l.className}{l.department ? ` • ${l.department}` : ""}</span>
                  </span>
                  <span style={{ fontWeight: 700, whiteSpace: "nowrap" }}>{l.answers} answers</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: 13, color: "#5F6E7F", textAlign: "center", marginTop: 20 }}>No student activity yet.</p>
          )}
        </div>

        <div style={card}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#5F6E7F", textTransform: "uppercase", marginBottom: 8 }}>🏅 Leaderboard by Class (Top 5)</div>
          {Object.keys(leaderboard).length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {Object.entries(leaderboard).map(([className, students]) => (
                <div key={className}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#1E242E", marginBottom: 6, paddingBottom: 4, borderBottom: "2px solid #E2E8F0" }}>{className}</div>
                  {students.map((s, i) => (
                    <div key={s.name} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, paddingBottom: 4, borderBottom: "1px solid #F1F5F9" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: i === 0 ? "#DC2626" : i === 1 ? "#F59E0B" : i === 2 ? "#EAB308" : "#6B7280", width: 16 }}>{i + 1}</span>
                        <span>{s.name}</span>
                      </span>
                      <span style={{ color: "#5F6E7F" }}>{s.answers} ans</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: 13, color: "#5F6E7F", textAlign: "center", marginTop: 20 }}>No leaderboard data yet.</p>
          )}
        </div>
      </div>

      {busy && <p style={{ textAlign: "center", color: "#5F6E7F", marginTop: 20 }}>Loading…</p>}
    </main>
  );
}
