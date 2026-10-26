"use client";
import { useEffect, useState } from "react";

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, margin: "0 0 12px" };
const input: React.CSSProperties = { height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px", fontSize: 14, width: "100%", boxSizing: "border-box" };

type Note = { id: string; subject: string; topic: string; body: string; status: string; className: string; createdAt: string };

export default function TeacherLessonNotes() {
  const [userId, setUserId] = useState<string | null>(null);
  const [classParam, setClassParam] = useState("");
  const [denied, setDenied] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [body, setBody] = useState("");
  const [className, setClassName] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("edupal_user");
    setUserId(id);
    if (!id) return setDenied(true);
    if (localStorage.getItem("edupal_role") !== "SCHOOL_TEACHER") return setDenied(true);
    const params = new URLSearchParams(window.location.search);
    setClassParam(params.get("class") ?? "");
    fetch(`/api/school/lesson-notes?userId=${id}&teacherId=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.notes) setNotes(d.notes.map((n: any) => ({
          id: n.id, subject: n.subject, topic: n.topic, body: n.body,
          status: n.status, className: n.className, createdAt: n.createdAt
        })));
      });
  }, []);

  if (denied) {
    return (
      <main style={{ maxWidth: 560, margin: "48px auto", padding: "0 16px", color: "#333A45" }}>
        <div style={card}>
          <h1 style={{ fontSize: 20, margin: "0 0 8px" }}>📝 Lesson Notes</h1>
          <p style={{ fontSize: 14, color: "#5F6E7F", margin: 0 }}>Teacher accounts only. Log in at <strong>/login</strong> with your teacher credentials.</p>
        </div>
      </main>
    );
  }

  async function createNote() {
    if (!userId || busy) return;
    if (!className || !subject || !topic || !body) return setMsg("Fill in all fields.");
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/school/lesson-notes", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, className, subject, topic, body })
      });
      const d = await res.json();
      if (!res.ok) return setMsg(d.error || "Failed to create note.");
      setMsg("Note sent to VP Academics for review.");
      setSubject(""); setTopic(""); setBody("");
      fetch(`/api/school/lesson-notes?userId=${userId}&teacherId=${userId}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => d?.notes && setNotes(d.notes.map((n: any) => ({
          id: n.id, subject: n.subject, topic: n.topic, body: n.body,
          status: n.status, className: n.className, createdAt: n.createdAt
        }))));
    } finally {
      setBusy(false);
    }
  }

  const statusColor = (s: string) => s === "approved" ? "#16A34A" : s === "rejected" ? "#DC2626" : "#F59E0B";
  const statusLabel = (s: string) => s === "approved" ? "Approved" : s === "rejected" ? "Rejected" : "Pending VP Review";

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
        <h1 style={{ fontSize: 22, margin: 0 }}>📝 Lesson Notes</h1>
        <a href="/teacher/dashboard" style={{ fontSize: 13, color: "#5F6E7F", textDecoration: "none" }}>← Back to my classes</a>
      </div>

      <div style={card}>
        <h2 style={{ color: "#1E242E", fontSize: 16, margin: "0 0 10px" }}>Write a new lesson note</h2>
        <p style={{ fontSize: 13, color: "#5F6E7F", margin: "0 0 10px" }}>
          Notes you write go to the VP Academics for review. Once approved, students in your class see them on their dashboard.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <input value={className} onChange={(e) => setClassName(e.target.value)} placeholder="Class (e.g. SS2)"
            style={input} />
          {classParam && <input value={classParam} readOnly style={{ ...input, background: "#F1F5F9" }} />}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject (e.g. Mathematics)"
            style={input} />
          <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Topic (e.g. Quadratic Equations)"
            style={input} />
        </div>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={5} placeholder="What should students learn or practise?…"
          style={{ ...input, height: 120, padding: 10, resize: "vertical" }} />
        <div style={{ marginTop: 10 }}>
          <button onClick={createNote} disabled={busy}
            style={{ height: 44, borderRadius: 10, border: 0, background: "#0F766E", color: "#fff", fontWeight: 800, padding: "0 20px", cursor: "pointer" }}>
            {busy ? "Sending for review…" : "Send to VP for review"}
          </button>
          {msg && <p style={{ fontSize: 13, color: msg.startsWith("Fill") ? "#DC2626" : "#166534", marginTop: 8 }}>{msg}</p>}
        </div>
      </div>

      <div style={card}>
        <h2 style={{ color: "#1E242E", fontSize: 16, margin: "0 0 10px" }}>Your Notes ({notes.length})</h2>
        {notes.length === 0 && (
          <p style={{ fontSize: 13, color: "#5F6E7F", margin: 0 }}>No notes yet. Write one above — it will appear here after the VP reviews it.</p>
        )}
        {notes.map((n) => (
          <div key={n.id} style={{ borderBottom: "1px solid #F1F5F9", padding: "10px 0", fontSize: 13 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
              <div>
                <strong style={{ fontSize: 14 }}>{n.topic}</strong>
                <span style={{ fontSize: 11, color: "#5F6E7F", marginLeft: 6 }}>{n.subject}</span>
              </div>
              <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 999, background: statusColor(n.status), color: "#fff" }}>
                {statusLabel(n.status)}
              </span>
            </div>
            <div style={{ color: "#5F6E7F", fontSize: 11, marginBottom: 4 }}>
              {n.className} · {new Date(n.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
            </div>
            <p style={{ margin: 0, color: "#333A45" }}>{n.body.slice(0, 300)}{n.body.length > 300 ? "…" : ""}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
