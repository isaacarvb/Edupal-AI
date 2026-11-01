"use client";
import { useEffect, useState } from "react";

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, margin: "0 0 12px" };

export default function SchoolAI() {
  const [userId, setUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; text: string }>>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [notes, setNotes] = useState<Array<{ id: string; subject: string; topic: string }>>([]);

  useEffect(() => {
    const id = localStorage.getItem("edupal_user");
    setUserId(id);
    if (!id) return;
    // Load approved lesson notes for context
    fetch(`/api/school/lesson-notes?userId=${id}&status=approved`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.notes) setNotes(d.notes);
      });
  }, []);

  async function sendMessage() {
    if (!userId || !input.trim() || busy) return;
    const userMessage = input.trim();
    setInput("");
    setBusy(true);
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);

    try {
      const res = await fetch(`/api/school/ai-chat?userId=${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, lessonNoteId: selectedNote })
      });
      const d = await res.json();
      if (!res.ok) return setMsg(d.error || "Failed to get response.");
      setMessages((prev) => [...prev, { role: "assistant", text: d.response }]);
    } catch (e) {
      setMsg("Error connecting to AI tutor.");
    } finally {
      setBusy(false);
    }
  }

  const [msg, setMsg] = useState("");

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ fontSize: 24, margin: 0 }}>🤖 School AI Tutor</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <label style={{ fontSize: 13, color: "#5F6E7F", marginRight: 8 }}>Context:</span>
          <select value={selectedNote || ""} onChange={(e) => setSelectedNote(e.target.value || null)} style={{ height: 40, borderRadius: 8, border: "1px solid #CBD5E1", padding: "0 10px", fontSize: 13 }}>
            <option value="">All approved notes</option>
            {notes.map((n) => (
              <option key={n.id} value={n.id}>{n.subject} - {n.topic}</option>
            ))}
          </div>
        </div>
      </div>

      <div style={card}>
        <div style={{ height: 400, overflowY: "auto", padding: 16, borderRadius: 10, background: "#F8FAFC", marginBottom: 12 }}>
          {messages.length === 0 && (
            <p style={{ color: "#5F6E7F", textAlign: "center", paddingTop: 40 }}>
              Ask me anything about your school subjects! I can help with topics from your school-approved lesson notes.
            </p>
          )}
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 50%, background: m.role === "user" ? "#0F766E" : "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", color: m.role === "user" ? "#fff" : "#1E242E", fontSize: 14, fontWeight: 800, flexShrink: 0 }}>
                {m.role === "user" ? "👤" : "🤖"}
              </div>
              <div style={{ flex: 1, padding: "8px 14px", borderRadius: 12, background: m.role === "user" ? "#0F766E" : "#F1F5F9", color: m.role === "user" ? "#fff" : "#333A45", maxWidth: "70%" }}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask a question about your schoolwork…" style={{ flex: 1, height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 14px", fontSize: 14 }} />
          <button onClick={sendMessage} disabled={busy || !input.trim()} style={{ height: 44, borderRadius: 10, border: 0, background: busy ? "#CBD5E1" : "#0F766E", color: "#fff", fontWeight: 700, padding: "0 20px", cursor: busy ? "not-allowed" : "pointer" }}>
            {busy ? "Thinking…" : "Ask"}
          </button>
        </div>
        {msg && <p style={{ fontSize: 13, color: "#DC2626", marginTop: 8 }}>{msg}</p>}
      </div>
    </main>
  );
}
