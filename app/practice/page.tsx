"use client";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Q = { id: string; subject: string; topic: string; type: string; stem: string; optionsJson: string; predictedRepeat: number; difficulty: string };
type Theory = { score: number; maxScore: number; hits: string[]; misses: string[]; tips: string[]; modelAnswer: string };

const btnPrimary: React.CSSProperties = { display: "block", width: "100%", height: 48, borderRadius: 10, border: 0, fontSize: 16, fontWeight: 600, background: "#0F766E", color: "#fff", cursor: "pointer", margin: "8px 0" };
const btnOpt: React.CSSProperties = { display: "block", width: "100%", minHeight: 48, borderRadius: 10, border: "1px solid #CBD5E1", fontSize: 16, background: "#fff", cursor: "pointer", margin: "8px 0", padding: 10, textAlign: "left" };

function PracticeInner() {
  const params = useSearchParams();
  const router = useRouter();
  const userId = params.get("userId") ?? "";
  const subject = params.get("subject") ?? "English";
  const qotdMode = params.get("qotd") === "1";
  const [isQotd, setIsQotd] = useState(false);
  const [q, setQ] = useState<Q | null>(null);
  const [answered, setAnswered] = useState(0);
  const [done, setDone] = useState(false);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<null | { correct: boolean; correctAnswer: string; feedback: string; theory: Theory | null; leveledUp: boolean; freezeUsed: boolean; creditsLeft: number; subject: string; mastery: { topic: string; accuracy: number; label: string } }>(null);
  const [busy, setBusy] = useState(false);
  const [timed, setTimed] = useState(false);
  const [secs, setSecs] = useState(0);
  const [alt, setAlt] = useState<null | { explanation: string; engine: string }>(null);
  const [altBusy, setAltBusy] = useState(false);
  const [flagged, setFlagged] = useState(false);
  const [err, setErr] = useState("");

  const [qotdServed, setQotdServed] = useState(false);

  const load = useCallback(async () => {
    setResult(null);
    setAlt(null);
    setFlagged(false);
    setAnswer("");
    setIsQotd(false);
    if (qotdMode && !qotdServed) {
      const res = await fetch(`/api/qotd?userId=${userId}`);
      const data = await res.json();
      if (!data.done && data.question) {
        setQ(data.question);
        setIsQotd(true);
        setQotdServed(true);
        setAnswered(0);
        setSecs(data.question.type === "MCQ" ? 60 : 180);
        return;
      }
      setQotdServed(true); // already done today → fall through to normal practice
    }
    const res = await fetch(`/api/diagnostic/next?userId=${userId}&subject=${encodeURIComponent(subject)}`);
    const data = await res.json();
    if (data.done) setDone(true);
    else {
      setQ(data.question);
      setAnswered(data.answered);
      setSecs(data.question.type === "MCQ" ? 60 : 180);
    }
  }, [userId, subject, qotdMode, qotdServed]);

  useEffect(() => {
    if (userId) load();
    setTimed(localStorage.getItem("edupal_timed") === "1");
  }, [userId, load]);

  function toggleTimed() {
    setTimed((t) => {
      localStorage.setItem("edupal_timed", t ? "0" : "1");
      return !t;
    });
  }

  // Countdown per question; expiry auto-submits whatever is entered.
  useEffect(() => {
    if (!timed || !q || result) return;
    if (secs <= 0) {
      submit(true);
      return;
    }
    const t = setTimeout(() => setSecs((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timed, q, secs, result]);

  const limitFor = (type: string) => (type === "MCQ" ? 60 : 180);

  async function flag() {
    if (!q || flagged) return;
    const res = await fetch("/api/flag", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, questionId: q.id })
    });
    if (res.ok) setFlagged(true);
  }

  async function explainDifferently() {
    if (!q || altBusy) return;
    setAltBusy(true);
    try {
      const res = await fetch("/api/explain-differently", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, questionId: q.id, original: result?.feedback ?? "", language: "SIMPLE" })
      });
      const data = await res.json();
      if (res.ok) setAlt(data);
    } finally {
      setAltBusy(false);
    }
  }

  async function submit(force = false) {
    if (!q || busy || result) return;
    if (!force && !answer.trim()) return;
    setBusy(true);
    setErr("");
    const limit = q.type === "MCQ" ? 60 : 180;
    try {
      const res = await fetch("/api/practice/attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, questionId: q.id, response: answer, timed, secondsUsed: timed ? limit - secs : null, qotd: isQotd })
      });
      const data = await res.json();
      if (data.duplicate) return load(); // double-click: just move on
      if (res.status === 402 && data.subjectLimit) {
        router.push(`/dashboard?userId=${userId}&limited=${encodeURIComponent(data.subject)}`);
        return;
      }
      if (res.status === 402) {
        router.push(`/dashboard?userId=${userId}`);
        return;
      }
      if (!res.ok) return setErr(data.error || "Failed");
      setResult(data);
    } finally {
      setBusy(false);
    }
  }

  if (!userId) return <main style={{ padding: 20 }}>Missing user. Start from <a href="/onboarding">onboarding</a>.</main>;
  if (done)
    return (
      <main style={{ maxWidth: 420, margin: "0 auto", padding: 20, color: "#333A45" }}>
        <h1 style={{ color: "#1E242E" }}>Diagnostic complete</h1>
        <p>{subject}: {answered} questions answered. Your baseline is saved.</p>
        <button style={btnPrimary} onClick={() => router.push(`/dashboard?userId=${userId}`)}>See my dashboard</button>
      </main>
    );

  return (
    <main style={{ maxWidth: 420, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontSize: 13, color: "#2F5D7C", margin: 0 }}>
          {isQotd ? "⭐ Question of the Day • FREE" : `${subject} • Diagnostic ${Math.min(answered + 1, 10)}/10`}
        </p>
        <button onClick={toggleTimed} style={{ fontSize: 12, fontWeight: 700, borderRadius: 999, padding: "6px 12px", cursor: "pointer",
          background: timed ? "#1E242E" : "#fff", color: timed ? "#fff" : "#1E242E", border: "1px solid #1E242E" }}>
          ⏱ {timed ? "Timed ON" : "Timed OFF"}
        </button>
      </div>
      {timed && q && !result && (
        <p style={{ fontSize: 20, fontWeight: 800, color: secs <= 10 ? "#DC2626" : "#1E242E", margin: "8px 0 0" }}>
          ⏱ {Math.floor(secs / 60)}:{String(secs % 60).padStart(2, "0")}
        </p>
      )}
      {!q ? (
        <p>Loading…</p>
      ) : (
        <>
          <h2 style={{ color: "#1E242E", fontSize: 20 }}>{q.topic}</h2>
          <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 999,
              background: q.difficulty === "HARD" ? "#FEE2E2" : q.difficulty === "EASY" ? "#DCFCE7" : "#F1F5F9",
              color: q.difficulty === "HARD" ? "#991B1B" : q.difficulty === "EASY" ? "#166534" : "#475569" }}>
              {q.difficulty}
            </span>
            {q.predictedRepeat === 1 && <span style={{ fontSize: 12, fontWeight: 700, background: "#FEF3C7", border: "1px solid #FDE68A", color: "#92400E", padding: "4px 10px", borderRadius: 999 }}>Likely to repeat</span>}
          </div>
          <p>{q.stem}</p>
          {q.type === "MCQ" ? (
            JSON.parse(q.optionsJson).map((opt: string) => (
              <button key={opt} style={{ ...btnOpt, border: answer === opt ? "2px solid #0F766E" : btnOpt.border, background: answer === opt ? "#CCFBF1" : "#fff" }} onClick={() => setAnswer(opt)}>
                {opt}
              </button>
            ))
          ) : (
            <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={4} style={{ width: "100%", borderRadius: 10, border: "1px solid #CBD5E1", padding: 10, fontSize: 16 }} placeholder="Write your answer…" />
          )}
          {err && <p style={{ color: "#DC2626" }}>{err}</p>}
          {!result ? (
            <button style={btnPrimary} onClick={() => submit()} disabled={busy}>{busy ? "Marking…" : `Submit (${q.type === "MCQ" ? "1 credit" : "3 credits"})`}</button>
          ) : (
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, marginTop: 8 }}>
              <p style={{ fontWeight: 700, color: result.correct ? "#16A34A" : "#DC2626" }}>{result.correct ? "Correct ✓" : `Not quite — answer: ${result.correctAnswer}`}</p>
              {result.leveledUp && <p style={{ fontWeight: 800, color: "#0F766E" }}><span className="deco">🎉 </span>Level up! {result.mastery.topic} is now {result.mastery.label}.</p>}
              {result.freezeUsed && <p style={{ fontWeight: 700, color: "#2F5D7C" }}><span className="deco">🧊 </span>Your streak freeze saved the streak — one per month.</p>}
              <p style={{ fontSize: 14 }}>{result.feedback}</p>
              {!alt ? (
                <button onClick={explainDifferently} disabled={altBusy} style={{ fontSize: 13, fontWeight: 700, color: "#2F5D7C", background: "#E1EBF5", border: "1px solid #B9D2EA", borderRadius: 999, padding: "6px 14px", cursor: "pointer", marginTop: 4 }}>
                  {altBusy ? "Rephrasing…" : "🔁 Explain this differently"}
                </button>
              ) : (
                <div style={{ fontSize: 14, background: "#F8FAFC", border: "1px dashed #99F6E4", borderRadius: 10, padding: 10, marginTop: 8 }}>
                  <strong>Another way to see it{alt.engine === "groq" ? " (AI)" : ""}:</strong>
                  <p style={{ margin: "4px 0 0" }}>{alt.explanation}</p>
                </div>
              )}
              {result.theory && (
                <>
                  <p style={{ fontSize: 14, fontWeight: 700 }}>Score: {result.theory.score}/{result.theory.maxScore}</p>
                  <ul style={{ fontSize: 14, paddingLeft: 18 }}>
                    {result.theory.hits.map((h) => <li key={`h-${h}`}>✅ {h}</li>)}
                    {result.theory.misses.map((m) => <li key={`m-${m}`}>❌ {m}</li>)}
                  </ul>
                  <p style={{ fontSize: 14 }}><strong>Model answer:</strong> {result.theory.modelAnswer}</p>
                  <ul style={{ fontSize: 14, paddingLeft: 18 }}>
                    {result.theory.tips.map((t) => <li key={`t-${t}`}>💡 {t}</li>)}
                  </ul>
                </>
              )}
              <p style={{ fontSize: 13, color: "#5F6E7F" }}>{result.mastery.topic}: {result.mastery.accuracy}% • {result.mastery.label}</p>
              <a href={`/tutor?userId=${userId}&questionId=${q?.id ?? ""}`} style={{ display: "block", textAlign: "center", fontSize: 14, fontWeight: 700, color: "#0F766E", border: "2px solid #0F766E", borderRadius: 10, height: 44, lineHeight: "40px", textDecoration: "none", marginTop: 8 }}>Discuss with AI tutor</a>
              <button onClick={flag} disabled={flagged} style={{ display: "block", width: "100%", fontSize: 13, fontWeight: 600, color: flagged ? "#16A34A" : "#5F6E7F", background: "transparent", border: "none", cursor: flagged ? "default" : "pointer", marginTop: 8 }}>
                {flagged ? "✓ Reported — reviewed within 48 hours" : "⚑ Flag this explanation"}
              </button>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                <span style={{ fontSize: 12, background: "#F1F5F9", border: "1px solid #E2E8F0", color: "#333A45", padding: "4px 10px", borderRadius: 999 }}>Topic: {result.mastery.topic}</span>
                <span style={{ fontSize: 12, background: "#F1F5F9", border: "1px solid #E2E8F0", color: "#333A45", padding: "4px 10px", borderRadius: 999 }}>Mastery: {result.mastery.label}</span>
                <span style={{ fontSize: 12, background: "#CCFBF1", border: "1px solid #99F6E4", color: "#2F5D7C", padding: "4px 10px", borderRadius: 999 }}>{result.subject} credits left: {result.creditsLeft}</span>
              </div>
              <button style={btnPrimary} onClick={load}>Next question</button>
            </div>
          )}
        </>
      )}
    </main>
  );
}

export default function Practice() {
  return (
    <Suspense fallback={<main style={{ padding: 20 }}>Loading…</main>}>
      <PracticeInner />
    </Suspense>
  );
}
