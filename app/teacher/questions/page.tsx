"use client";
import { useEffect, useState } from "react";

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, margin: "0 0 12px" };
const input: React.CSSProperties = { height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px", fontSize: 14, width: "100%", boxSizing: "border-box" };

type Question = { id: string; subject: string; topic: string; type: string; stem: string; optionsJson: string[]; answerKey: string; markingRubric: string; status: string; className: string; createdAt: string };

export default function TeacherQuestions() {
  const [userId, setUserId] = useState<string | null>(null);
  const [denied, setDenied] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [type, setType] = useState("MCQ");
  const [stem, setStem] = useState("");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [answerKey, setAnswerKey] = useState("");
  const [markingRubric, setMarkingRubric] = useState("");
  const [className, setClassName] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Question | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("edupal_user");
    setUserId(id);
    if (!id) return setDenied(true);
    if (localStorage.getItem("edupal_role") !== "SCHOOL_TEACHER") return setDenied(true);
    fetch(`/api/school/questions?userId=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.questions) setQuestions(d.questions);
      })
      .catch(() => setDenied(true));
  }, []);

  if (denied) {
    return (
      <main style={{ maxWidth: 560, margin: "48px auto", padding: "0 16px", color: "#333A45" }}>
        <div style={card}>
          <h1 style={{ fontSize: 20, margin: "0 0 8px" }}>🧠 Question Bank</h1>
          <p style={{ fontSize: 14, color: "#5F6E7F", margin: 0 }}>Teacher accounts only. Log in at <strong>/login</strong> with your teacher credentials.</p>
        </div>
      </main>
    );
  }

  if (!userId) return <div style={{ padding: 20 }}>Loading…</div>;

  const statusColor = (s: string) => s === "approved" ? "#16A34A" : s === "rejected" ? "#DC2626" : s === "pending" ? "#F59E0B" : "#94A3B8";
  const statusLabel = (s: string) => s === "approved" ? "Approved" : s === "rejected" ? "Rejected" : s === "pending" ? "Pending Review" : "Draft";

  async function createQuestion() {
    if (!userId || busy) return;
    if (!className || !subject || !topic || !type || !stem) return setMsg("Class, subject, topic, type, and question required.");
    const opts = options.filter((o) => o.trim()).slice(0, 4);
    if (type === "MCQ" && (!answerKey || !opts.includes(answerKey))) return setMsg("For MCQ, answer must be one of the options.");
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/school/questions", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, className, subject, topic, type, stem, optionsJson: opts, answerKey, markingRubric })
      });
      const d = await res.json();
      if (!res.ok) return setMsg(d.error || "Failed to create question.");
      setMsg("Question created as draft.");
      setSubject(""); setTopic(""); setStem(""); setOptions(["", "", "", ""]); setAnswerKey(""); setMarkingRubric("");
      fetch(`/api/school/questions?userId=${userId}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => d?.questions && setQuestions(d.questions));
    } finally {
      setBusy(false);
    }
  }

  async function updateQuestion() {
    if (!userId || busy || !editingId) return;
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch(`/api/school/questions?questionId=${editingId}&userId=${userId}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ className: editDraft?.className || className, subject: editDraft?.subject || subject, topic: editDraft?.topic || topic, type: editDraft?.type || type, stem: editDraft?.stem || stem, optionsJson: editDraft?.optionsJson || options, answerKey: editDraft?.answerKey || answerKey, markingRubric: editDraft?.markingRubric || markingRubric, status: editDraft?.status })
      });
      const d = await res.json();
      if (!res.ok) return setMsg(d.error || "Failed to update question.");
      setMsg("Question updated.");
      setEditingId(null);
      setEditDraft(null);
      setSubject(""); setTopic(""); setStem(""); setOptions(["", "", "", ""]); setAnswerKey(""); setMarkingRubric("");
      fetch(`/api/school/questions?userId=${userId}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => d?.questions && setQuestions(d.questions));
    } finally {
      setBusy(false);
    }
  }

  async function deleteQuestion(id: string) {
    if (!userId || !confirm("Delete this question?")) return;
    const res = await fetch(`/api/school/questions?questionId=${encodeURIComponent(id)}&userId=${userId}`, { method: "DELETE" });
    if (res.ok) setQuestions(questions.filter((q) => q.id !== id));
  }

  async function nominateQuestion(id: string) {
    if (!userId) return;
    const res = await fetch(`/api/school/questions?questionId=${encodeURIComponent(id)}&userId=${userId}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "pending" })
    });
    if (res.ok) setQuestions(questions.map((q) => q.id === id ? { ...q, status: "pending" } : q));
  }

  const filtered = questions.filter((q) =>
    q.subject.toLowerCase().includes(subject.toLowerCase()) &&
    q.topic.toLowerCase().includes(topic.toLowerCase())
  );

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
        <h1 style={{ fontSize: 22, margin: 0 }}>🧠 Question Bank</h1>
        <a href="/teacher/dashboard" style={{ fontSize: 13, color: "#5F6E7F", textDecoration: "none" }}>← Back to my classes</a>
      </div>

      <div style={card}>
        <h2 style={{ color: "#1E242E", fontSize: 16, margin: "0 0 10px" }}>Create New Question</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10, marginBottom: 10 }}>
          <input value={className} onChange={(e) => setClassName(e.target.value)} placeholder="Class (e.g. SS2)" style={input} />
          <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject (e.g. Mathematics)" style={input} />
          <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Topic (e.g. Quadratic Equations)" style={input} />
          <select value={type} onChange={(e) => setType(e.target.value)} style={input}>
            <option value="MCQ">Multiple Choice</option>
            <option value="THEORY">Theory / Essay</option>
          </select>
        </div>
        <textarea value={stem} onChange={(e) => setStem(e.target.value)} rows={3} placeholder="Question stem / question text…" style={{ ...input, height: 80, padding: 10, resize: "vertical" }} />
        <div style={{ marginTop: 8, fontSize: 12, color: "#5F6E7F" }}>Options (for MCQ)</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: 10 }}>
          {options.map((o, i) => (
            <input key={i} value={o} onChange={(e) => { const next = [...options]; next[i] = e.target.value; setOptions(next); }} placeholder={`Option ${i + 1}`} style={input} />
          ))}
        </div>
        <input value={answerKey} onChange={(e) => setAnswerKey(e.target.value)} placeholder="Answer key / correct answer" style={input} />
        <textarea value={markingRubric} onChange={(e) => setMarkingRubric(e.target.value)} rows={2} placeholder="Marking rubric / notes…" style={{ ...input, height: 60, padding: 10, resize: "vertical" }} />
        <div style={{ marginTop: 10 }}>
          <button onClick={createQuestion} disabled={busy} style={{ height: 44, borderRadius: 10, border: 0, background: "#0F766E", color: "#fff", fontWeight: 800, padding: "0 20px", cursor: "pointer" }}>
            {busy ? "Creating…" : "Create Question"}
          </button>
          {msg && <p style={{ fontSize: 13, color: msg.startsWith("Question") ? "#16A34A" : "#DC2626", marginTop: 8 }}>{msg}</p>}
        </div>
      </div>

      <div style={card}>
        <h2 style={{ color: "#1E242E", fontSize: 16, margin: "0 0 10px" }}>Your Questions ({questions.length})</h2>
        {questions.length === 0 && (
          <p style={{ fontSize: 13, color: "#5F6E7F", margin: 0 }}>No questions yet. Create one above.</p>
        )}
        {questions.map((q) => (
          <div key={q.id} style={{ borderBottom: "1px solid #F1F5F9", padding: "10px 0", fontSize: 13 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
              <div>
                <strong style={{ fontSize: 14 }}>{q.topic}</strong>
                <span style={{ fontSize: 11, color: "#5F6E7F", marginLeft: 6 }}>{q.subject} · {q.className}</span>
              </div>
              <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 999, background: statusColor(q.status), color: "#fff" }}>{statusLabel(q.status)}</span>
            </div>
            <div style={{ color: "#5F6E7F", fontSize: 11, marginBottom: 4 }}>{q.type}</div>
            <p style={{ margin: "0 0 8px", color: "#333A45", whiteSpace: "pre-wrap" }}>{q.stem.slice(0, 200)}{q.stem.length > 200 ? "…" : ""}</p>
            {q.type === "MCQ" && q.optionsJson && q.optionsJson.length > 0 && (
              <div style={{ fontSize: 12, color: "#5F6E7F", marginBottom: 4 }}>
                <span style={{ fontWeight: 700 }}>Options:</span> {q.optionsJson.join(" | ")}
                <span style={{ marginLeft: 8, fontWeight: 700, color: q.answerKey ? "#10B981" : "#DC2626" }}>Answer: {q.answerKey}</span>
              </div>
            )}
            <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
              {editingId !== q.id ? (
                <>
                  <button onClick={() => { setEditingId(q.id); setEditDraft(q); setClassName(q.className); setSubject(q.subject); setTopic(q.topic); setType(q.type); setStem(q.stem); setOptions(q.optionsJson); setAnswerKey(q.answerKey); setMarkingRubric(q.markingRubric); }} style={{ height: 34, borderRadius: 8, border: "1px solid #CBD5E1", background: "#fff", fontSize: 11, fontWeight: 700, padding: "0 10px", cursor: "pointer", flex: 1 }}>Edit</button>
                  <button onClick={() => nominateQuestion(q.id)} style={{ height: 34, borderRadius: 8, border: 0, background: "#F59E0B", color: "#fff", fontWeight: 700, padding: "0 12px", cursor: "pointer", flex: 1 }}>Nominate</button>
                  <button onClick={() => deleteQuestion(q.id)} style={{ height: 34, borderRadius: 8, border: 0, background: "#DC2626", color: "#fff", fontWeight: 700, padding: "0 12px", cursor: "pointer", flex: 1 }}>Delete</button>
                </>
              ) : (
                <>
                  <button onClick={updateQuestion} disabled={busy} style={{ height: 34, borderRadius: 8, border: 0, background: "#0F766E", color: "#fff", fontWeight: 700, padding: "0 12px", cursor: "pointer", flex: 1 }}>{busy ? "Saving…" : "Save Changes"}</button>
                  <button onClick={() => { setEditingId(null); setEditDraft(null); }} style={{ height: 34, borderRadius: 8, border: "1px solid #CBD5E1", color: "#333A45", fontSize: 11, fontWeight: 700, padding: "0 12px", cursor: "pointer", flex: 1 }}>Cancel</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
