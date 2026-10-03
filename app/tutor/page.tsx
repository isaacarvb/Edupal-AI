"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

type Msg = { role: string; content: string };

function TutorInner() {
  const params = useSearchParams();
  const userId = params.get("userId") ?? "";
  const questionId = params.get("questionId") ?? "";
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [lang, setLang] = useState("SIMPLE");
  const [busy, setBusy] = useState(false);
  const [engine, setEngine] = useState("");
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/chat?userId=${userId}${questionId ? `&questionId=${questionId}` : ""}`)
      .then((r) => r.json())
      .then((d) => {
        setMsgs(d.messages ?? []);
        setEngine(d.groq ? "groq" : "local");
      });
  }, [userId, questionId]);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  async function send() {
    if (!draft.trim() || busy || !userId) return;
    const text = draft.trim();
    setDraft("");
    setBusy(true);
    setMsgs((m) => [...m, { role: "user", content: text }]);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, questionId: questionId || undefined, message: text, language: lang })
      });
      const data = await res.json();
      setMsgs((m) => [...m, { role: "assistant", content: data.reply ?? "Hmm, try again." }]);
      if (data.engine) setEngine(data.engine);
    } finally {
      setBusy(false);
    }
  }

  if (!userId) return <main style={{ padding: 20 }}>Missing user. Start from <a href="/signup">signup</a>.</main>;

  return (
    <main style={{ maxWidth: 680, margin: "0 auto", padding: 20, color: "#333A45", display: "flex", flexDirection: "column", minHeight: "80vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ color: "#1E242E", fontSize: 22 }}>AI Tutor</h1>
        <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13 }}>
          <span style={{ background: engine === "groq" ? "#CCFBF1" : "#F1F5F9", border: "1px solid #E2E8F0", padding: "4px 10px", borderRadius: 999 }}>
            {engine === "groq" ? "⚡ Groq live" : "🔧 Local mode"}
          </span>
          <select value={lang} onChange={(e) => setLang(e.target.value)} style={{ borderRadius: 8, border: "1px solid #CBD5E1", padding: "4px 8px", fontSize: 13 }}>
            <option value="SIMPLE">Simple English</option>
            <option value="PIDGIN">Pidgin</option>
          </select>
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, margin: "12px 0" }}>
        {msgs.length === 0 && <p style={{ fontSize: 14, color: "#5F6E7F" }}>Ask a follow-up about this question — I remember our chat and build on it.</p>}
        {msgs.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.role === "user" ? "flex-end" : "flex-start",
            background: m.role === "user" ? "#0F766E" : "#fff",
            color: m.role === "user" ? "#fff" : "#333A45",
            border: m.role === "user" ? "none" : "1px solid #E2E8F0",
            borderRadius: 12, padding: "10px 14px", maxWidth: "85%", fontSize: 15, whiteSpace: "pre-wrap"
          }}>
            {m.content}
          </div>
        ))}
        <div ref={bottom} />
      </div>
      <div style={{ display: "flex", gap: 8, position: "sticky", bottom: 12 }}>
        <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask a follow-up… e.g. break down step 2" disabled={busy}
          style={{ flex: 1, height: 48, borderRadius: 12, border: "1px solid #1E242E", padding: "0 14px", fontSize: 15 }} />
        <button onClick={send} disabled={busy || !draft.trim()}
          style={{ height: 48, borderRadius: 12, border: 0, background: "#0F766E", color: "#fff", fontWeight: 800, padding: "0 20px", cursor: "pointer" }}>
          {busy ? "…" : "Send"}
        </button>
      </div>
    </main>
  );
}

export default function Tutor() {
  return (
    <Suspense fallback={<main style={{ padding: 20 }}>Loading…</main>}>
      <TutorInner />
    </Suspense>
  );
}
