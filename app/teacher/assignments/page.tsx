"use client";
import { useEffect, useState } from "react";

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, margin: "0 0 12px" };
const input: React.CSSProperties = { height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px", fontSize: 14, width: "100%", boxSizing: "border-box" };

type Assignment = { id: string; subject: string; topic: string; instructions: string; dueAt: string | null; className: string; createdAt: string };

export default function TeacherAssignments() {
  const [userId, setUserId] = useState<string | null>(null);
  const [classParam, setClassParam] = useState("");
  const [denied, setDenied] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [instructions, setInstructions] = useState("");
  const [className, setClassName] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("edupal_user");
    setUserId(id);
    if (!id) return setDenied(true);
    if (localStorage.getItem("edupal_role") !== "SCHOOL_TEACHER") return setDenied(true);
    const params = new URLSearchParams(window.location.search);
    setClassParam(params.get("class") ?? "");
    fetch(`/api/school/assignments?userId=${id}&teacherId=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.assignments) setAssignments(d.assignments.map((a: any) => ({
          id: a.id, subject: a.subject, topic: a.topic, instructions: a.instructions,
          dueAt: a.dueAt, className: a.className, createdAt: a.createdAt
        })));
      });
  }, []);

  if (denied) {
    return (
      <main style={{ maxWidth: 560, margin: "48px auto", padding: "0 16px", color: "#333A45" }}>
        <div style={card}>
          <h1 style={{ fontSize: 20, margin: "0 0 8px" }}>✅ Assignments</h1>
          <p style={{ fontSize: 14, color: "#5F6E7F", margin: 0 }}>Teacher accounts only. Log in at <strong>/login</strong> with your teacher credentials.</p>
        </div>
      </main>
    );
  }

  async function createAssignment() {
    if (!userId || busy) return;
    if (!className || !subject || !topic) return setMsg("Class, subject and topic required.");
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/school/assignments", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, className, subject, topic, instructions, dueAt: dueAt || null })
      });
      const d = await res.json();
      if (!res.ok) return setMsg(d.error || "Failed to create assignment.");
      setMsg("Assignment set for your class.");
      setSubject(""); setTopic(""); setInstructions(""); setDueAt("");
      fetch(`/api/school/assignments?userId=${userId}&teacherId=${userId}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => d?.assignments && setAssignments(d.assignments.map((a: any) => ({
          id: a.id, subject: a.subject, topic: a.topic, instructions: a.instructions,
          dueAt: a.dueAt, className: a.className, createdAt: a.createdAt
        }))));
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Remove this assignment?")) return;
    const res = await fetch(`/api/school/assignments?assignmentId=${encodeURIComponent(id)}&userId=${userId}`, { method: "DELETE" });
    if (res.ok) setAssignments(assignments.filter((a) => a.id !== id));
  }

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
        <h1 style={{ fontSize: 22, margin: 0 }}>✅ Assignments</h1>
        <a href="/teacher/dashboard" style={{ fontSize: 13, color: "#5F6E7F", textDecoration: "none" }}>← Back to my classes</a>
      </div>

      <div style={card}>
        <h2 style={{ color: "#1E242E", fontSize: 16, margin: "0 0 10px" }}>Set a new assignment</h2>
        <p style={{ fontSize: 13, color: "#5F6E7F", margin: "0 0 10px" }}>
          Students see the assignment on their dashboard and can practise the topic.
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
        <input value={dueAt} onChange={(e) => setDueAt(e.target.value)} placeholder="Due date (optional)" type="date"
          style={input} />
        <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={3} placeholder="What should students do?…"
          style={{ ...input, height: 80, padding: 10, resize: "vertical" }} />
        <div style={{ marginTop: 10 }}>
          <button onClick={createAssignment} disabled={busy}
            style={{ height: 44, borderRadius: 10, border: 0, background: "#0F766E", color: "#fff", fontWeight: 800, padding: "0 20px", cursor: "pointer" }}>
            {busy ? "Setting…" : "Set Assignment"}
          </button>
          {msg && <p style={{ fontSize: 13, color: msg.startsWith("Fill") ? "#DC2626" : "#166534", marginTop: 8 }}>{msg}</p>}
        </div>
      </div>

      <div style={card}>
        <h2 style={{ color: "#1E242E", fontSize: 16, margin: "0 0 10px" }}>Your Assignments ({assignments.length})</h2>
        {assignments.length === 0 && (
          <p style={{ fontSize: 13, color: "#5F6E7F", margin: 0 }}>No assignments yet. Set one above.</p>
        )}
        {assignments.map((a) => (
          <div key={a.id} style={{ borderBottom: "1px solid #F1F5F9", padding: "10px 0", fontSize: 13 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
              <div>
                <strong style={{ fontSize: 14 }}>{a.topic}</strong>
                <span style={{ fontSize: 11, color: "#5F6E7F", marginLeft: 6 }}>{a.subject}</span>
              </div>
              {a.dueAt && (
                <span style={{ fontSize: 10, fontWeight: 800, padding: "4px 8px", borderRadius: 999, background: "#F1F5F9", color: "#333A45" }}>
                  Due {new Date(a.dueAt).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
                </span>
              )}
            </div>
            <div style={{ color: "#5F6E7F", fontSize: 11, marginBottom: 4 }}>
              {a.className}
            </div>
            <p style={{ margin: 0, color: "#333A45" }}>{a.instructions.slice(0, 300)}{a.instructions.length > 300 ? "…" : ""}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
