"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, margin: "0 0 12px" };

type Student = { userId: string; name: string; streak: number; answersWeek: number; accuracy: number };
type WeakTopic = { subject: string; topic: string; students: number; accuracy: number };
type ClassData = { className: string; students: Student[]; weakTopics: WeakTopic[] };
type Dashboard = { teacher: { name: string; classes: string[] }; school: { name: string; code: string }; classes: ClassData[] };
type Note = {
  id: string; subject: string; topic: string; body: string; status: string;
  className: string; createdAt: string; attachmentUrl: string | null; attachmentName: string | null;
};

const TABS = ["Overview", "Students", "Lesson Notes", "Question Bank"] as const;
type Tab = (typeof TABS)[number];

export default function TeacherClassPage() {
  const params = useParams<{ className: string }>();
  const raw = params?.className;
  const className = decodeURIComponent(Array.isArray(raw) ? raw[0] : raw ?? "");

  const [userId, setUserId] = useState<string | null>(null);
  const [data, setData] = useState<Dashboard | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [tab, setTab] = useState<Tab>("Overview");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("edupal_user");
    setUserId(id);
    if (!id) {
      setError("Please log in as a teacher.");
      return;
    }
    if (localStorage.getItem("edupal_role") !== "SCHOOL_TEACHER") {
      setError("Teacher accounts only.");
      return;
    }

    fetch(`/api/teacher/dashboard?userId=${id}`)
      .then(async (r) => {
        if (!r.ok) {
          const d = await r.json().catch(() => ({}));
          throw new Error(d.error || "Failed to load class.");
        }
        return r.json();
      })
      .then((d: Dashboard) => setData(d))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load class."));
  }, []);

  useEffect(() => {
    if (!userId || !className) return;
    const base = `/api/school/lesson-notes?userId=${userId}&teacherId=${userId}&className=${encodeURIComponent(className)}`;
    Promise.all([
      fetch(`${base}&status=approved`).then((r) => (r.ok ? r.json() : { notes: [] })),
      fetch(`${base}&status=pending`).then((r) => (r.ok ? r.json() : { notes: [] }))
    ])
      .then(([a, p]) => {
        const merged = [...(a?.notes ?? []), ...(p?.notes ?? [])];
        setNotes(merged);
      })
      .catch(() => setNotes([]));
  }, [userId, className]);

  if (error) {
    return (
      <main style={{ maxWidth: 560, margin: "48px auto", padding: "0 16px", color: "#333A45" }}>
        <div style={card}>
          <h1 style={{ fontSize: 20, margin: "0 0 8px" }}>⚠️ Unable to open class</h1>
          <p style={{ fontSize: 14, color: "#5F6E7F", margin: 0 }}>{error}</p>
          <a href="/teacher/dashboard" style={{ display: "inline-block", marginTop: 12, fontSize: 13, color: "#0F766E", fontWeight: 700, textDecoration: "none" }}>← Back to My Classes</a>
        </div>
      </main>
    );
  }

  if (!data) return <div style={{ padding: 20 }}>Loading…</div>;

  const cls = data.classes.find((c) => c.className.toLowerCase() === className.toLowerCase());
  if (!cls) {
    return (
      <main style={{ maxWidth: 560, margin: "48px auto", padding: "0 16px", color: "#333A45" }}>
        <div style={card}>
          <h1 style={{ fontSize: 20, margin: "0 0 8px" }}>Class not found</h1>
          <p style={{ fontSize: 14, color: "#5F6E7F", margin: 0 }}>
            {className ? `You are not assigned to ${className}.` : "No class was selected."}
          </p>
          <a href="/teacher/dashboard" style={{ display: "inline-block", marginTop: 12, fontSize: 13, color: "#0F766E", fontWeight: 700, textDecoration: "none" }}>← Back to My Classes</a>
        </div>
      </main>
    );
  }

  const classAvg = cls.students.length > 0 ? Math.round(cls.students.reduce((s, st) => s + st.accuracy, 0) / cls.students.length) : 0;
  const active = cls.students.filter((st) => st.answersWeek > 0).length;
  const approved = notes.filter((n) => n.status === "approved");
  const pending = notes.filter((n) => n.status === "pending");
  const classQ = `?class=${encodeURIComponent(cls.className)}`;

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
        <div>
          <a href="/teacher/dashboard" style={{ fontSize: 12, color: "#5F6E7F", textDecoration: "none" }}>← My Classes</a>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1E242E", margin: "4px 0 2px" }}>{cls.className}</h1>
          <p style={{ fontSize: 13, color: "#5F6E7F", margin: 0 }}>{data.school.name} · {cls.students.length} student{cls.students.length === 1 ? "" : "s"}</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <a href={`/teacher/lesson-notes${classQ}`} style={{ background: "#0F766E", color: "#fff", borderRadius: 10, padding: "9px 14px", fontSize: 13, fontWeight: 800, textDecoration: "none" }}>📝 Write Note</a>
          <a href={`/teacher/questions${classQ}`} style={{ background: "#333A45", color: "#fff", borderRadius: 10, padding: "9px 14px", fontSize: 13, fontWeight: 800, textDecoration: "none" }}>📋 Question Bank</a>
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {TABS.map((t) => {
          const on = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                border: on ? "1px solid #0F766E" : "1px solid #E2E8F0",
                background: on ? "#0F766E" : "#fff",
                color: on ? "#fff" : "#333A45",
                borderRadius: 999, padding: "8px 14px", fontSize: 13, fontWeight: on ? 800 : 600, cursor: "pointer"
              }}
            >
              {t}
              {t === "Lesson Notes" && pending.length > 0 && (
                <span style={{ marginLeft: 6, background: "#F59E0B", color: "#1E242E", fontSize: 10, fontWeight: 800, borderRadius: 999, padding: "1px 6px" }}>{pending.length}</span>
              )}
            </button>
          );
        })}
      </div>

      {tab === "Overview" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: 12 }}>
            <div style={{ ...card, margin: 0 }}><div style={{ fontSize: 11, color: "#5F6E7F" }}>Students</div><div style={{ fontSize: 22, fontWeight: 800 }}>{cls.students.length}</div></div>
            <div style={{ ...card, margin: 0 }}><div style={{ fontSize: 11, color: "#5F6E7F" }}>Active This Week</div><div style={{ fontSize: 22, fontWeight: 800 }}>{active}</div></div>
            <div style={{ ...card, margin: 0 }}><div style={{ fontSize: 11, color: "#5F6E7F" }}>Avg Accuracy</div><div style={{ fontSize: 22, fontWeight: 800 }}>{classAvg}%</div></div>
            <div style={{ ...card, margin: 0 }}><div style={{ fontSize: 11, color: "#5F6E7F" }}>Notes Awaiting Review</div><div style={{ fontSize: 22, fontWeight: 800 }}>{pending.length}</div></div>
          </div>

          <div style={card}>
            <h2 style={{ fontSize: 16, color: "#1E242E", margin: "0 0 10px" }}>🎯 Weak Topics</h2>
            {cls.weakTopics.length === 0 && <p style={{ fontSize: 13, color: "#5F6E7F", margin: 0 }}>No weak topics flagged for this class yet.</p>}
            <div style={{ display: "grid", gap: 8 }}>
              {cls.weakTopics.map((w) => (
                <div key={`${w.subject}-${w.topic}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, borderBottom: "1px solid #F1F5F9", paddingBottom: 6 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{w.topic}</div>
                    <div style={{ fontSize: 11, color: "#5F6E7F" }}>{w.subject} · {w.students} student{w.students === 1 ? "" : "s"} struggling</div>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 800, color: w.accuracy < 50 ? "#B91C1C" : "#B45309", flexShrink: 0 }}>{w.accuracy}%</span>
                </div>
              ))}
            </div>
          </div>

          <div style={card}>
            <h2 style={{ fontSize: 16, color: "#1E242E", margin: "0 0 8px" }}>Quick actions</h2>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <a href={`/teacher/lesson-notes${classQ}`} style={{ fontSize: 13, fontWeight: 700, color: "#0F766E", textDecoration: "none", border: "1px solid #99F6E4", background: "#F0FDFA", borderRadius: 999, padding: "7px 12px" }}>Write a lesson note</a>
              <a href="/teacher/curriculum" style={{ fontSize: 13, fontWeight: 700, color: "#0F766E", textDecoration: "none", border: "1px solid #99F6E4", background: "#F0FDFA", borderRadius: 999, padding: "7px 12px" }}>Open curriculum</a>
              <a href={`/teacher/questions${classQ}`} style={{ fontSize: 13, fontWeight: 700, color: "#0F766E", textDecoration: "none", border: "1px solid #99F6E4", background: "#F0FDFA", borderRadius: 999, padding: "7px 12px" }}>Add a question</a>
            </div>
          </div>
        </>
      )}

      {tab === "Students" && (
        <div style={card}>
          <h2 style={{ fontSize: 16, color: "#1E242E", margin: "0 0 10px" }}>Students in {cls.className}</h2>
          {cls.students.length === 0 && <p style={{ fontSize: 13, color: "#5F6E7F", margin: 0 }}>No students on this class roster yet.</p>}
          {cls.students.length > 0 && (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ textAlign: "left", color: "#5F6E7F", fontSize: 11, borderBottom: "2px solid #F1F5F9" }}>
                    <th style={{ padding: "8px 10px", textAlign: "left" }}>Student</th>
                    <th style={{ padding: "8px 10px" }}>Accuracy</th>
                    <th style={{ padding: "8px 10px" }}>Streak</th>
                    <th style={{ padding: "8px 10px" }}>Answers This Week</th>
                  </tr>
                </thead>
                <tbody>
                  {cls.students.map((s) => (
                    <tr key={s.userId} style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td style={{ padding: "8px 10px", fontWeight: 700 }}>{s.name}</td>
                      <td style={{ padding: "8px 10px" }}>{s.accuracy}%</td>
                      <td style={{ padding: "8px 10px" }}>{s.streak} days</td>
                      <td style={{ padding: "8px 10px" }}>{s.answersWeek}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === "Lesson Notes" && (
        <>
          <div style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
              <h2 style={{ fontSize: 16, color: "#1E242E", margin: 0 }}>📄 Approved notes ({approved.length})</h2>
              <a href={`/teacher/lesson-notes${classQ}`} style={{ fontSize: 13, color: "#0F766E", fontWeight: 800, textDecoration: "none" }}>Write a note →</a>
            </div>
            {approved.length === 0 && <p style={{ fontSize: 13, color: "#5F6E7F", margin: 0 }}>No approved notes for this class yet.</p>}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 }}>
              {approved.map((n) => (
                <div key={n.id} style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: 12 }}>
                  <div style={{ fontWeight: 800, color: "#1E242E", marginBottom: 2 }}>{n.topic}</div>
                  <div style={{ fontSize: 11, color: "#5F6E7F", marginBottom: 6 }}>{n.subject}</div>
                  <div style={{ fontSize: 12, color: "#333A45", marginBottom: 8 }}>{n.body.slice(0, 140)}{n.body.length > 140 ? "…" : ""}</div>
                  {n.attachmentUrl && (
                    <a href={n.attachmentUrl} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: "#0F766E", fontWeight: 700, textDecoration: "none" }}>📎 {n.attachmentName ?? "Attachment"}</a>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={card}>
            <h2 style={{ fontSize: 16, color: "#1E242E", margin: "0 0 10px" }}>⏳ Awaiting review ({pending.length})</h2>
            {pending.length === 0 && <p style={{ fontSize: 13, color: "#5F6E7F", margin: 0 }}>Nothing pending for this class.</p>}
            {pending.map((n) => (
              <div key={n.id} style={{ borderBottom: "1px solid #F1F5F9", padding: "10px 0", fontSize: 13 }}>
                <div style={{ fontWeight: 800 }}>{n.topic}</div>
                <div style={{ fontSize: 11, color: "#5F6E7F", marginBottom: 4 }}>{n.subject} · {new Date(n.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}</div>
                <div>{n.body.slice(0, 240)}{n.body.length > 240 ? "…" : ""}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "Question Bank" && (
        <div style={card}>
          <h2 style={{ fontSize: 16, color: "#1E242E", margin: "0 0 8px" }}>📋 Question Bank for {cls.className}</h2>
          <p style={{ fontSize: 13, color: "#5F6E7F", margin: "0 0 12px" }}>
            Write practice questions, review drafts and keep this class&apos;s question bank up to date. Questions you add here are scoped to your school.
          </p>
          <a href={`/teacher/questions${classQ}`} style={{ display: "inline-block", background: "#0F766E", color: "#fff", borderRadius: 10, padding: "10px 16px", fontSize: 13, fontWeight: 800, textDecoration: "none" }}>Open Question Bank →</a>
        </div>
      )}
    </main>
  );
}
