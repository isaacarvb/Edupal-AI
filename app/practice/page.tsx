"use client";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useHiddenSubjects } from "@/components/useHiddenSubjects";
import FocusSounds from "@/components/FocusSounds";
import { JSS_SUBJECTS, DEPARTMENTS, COMMON_SUBJECTS, shortSubject } from "@/lib/syllabus";

type Q = { id: string; subject: string; topic: string; type: string; stem: string; optionsJson: string; predictedRepeat: number; difficulty: string };
type Theory = { score: number; maxScore: number; hits: string[]; misses: string[]; tips: string[]; modelAnswer: string };

const btnPrimary: React.CSSProperties = { display: "block", width: "100%", height: 48, borderRadius: 10, border: 0, fontSize: 16, fontWeight: 600, background: "#0F766E", color: "#fff", cursor: "pointer", margin: "8px 0" };
const btnOpt: React.CSSProperties = { display: "block", width: "100%", minHeight: 48, borderRadius: 10, border: "1px solid #CBD5E1", fontSize: 16, background: "#fff", cursor: "pointer", margin: "8px 0", padding: 10, textAlign: "left" };

function PracticeInner() {
  const params = useSearchParams();
  const router = useRouter();
  const userId = params.get("userId") ?? "";
  const subjectParam = params.get("subject");
  const topicParam = params.get("topic");
  const subject = subjectParam ?? "English";
  const qotdMode = params.get("qotd") === "1";
  const [isQotd, setIsQotd] = useState(false);
  const [q, setQ] = useState<Q | null>(null);
  const [answered, setAnswered] = useState(0);
  const [done, setDone] = useState(false);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<null | { correct: boolean; correctAnswer: string; feedback: string; theory: Theory | null; leveledUp: boolean; freezeUsed: boolean; usedBonus: boolean; creditsLeft: number; subject: string; mastery: { topic: string; accuracy: number; label: string } }>(null);
  const [busy, setBusy] = useState(false);
  const [timed, setTimed] = useState(false);
  const [secs, setSecs] = useState(0);
  const [seniorOpen, setSeniorOpen] = useState(true);
  const [switcher, setSwitcher] = useState<{ subject: string; left: number }[]>([]);
  const [bank, setBank] = useState<{ subject: string; n: number }[]>([]);
  const hidden = useHiddenSubjects();
  const [department, setDepartment] = useState("");
  const [ready, setReady] = useState(false);
  const [alt, setAlt] = useState<null | { explanation: string; engine: string }>(null);
  const [altBusy, setAltBusy] = useState(false);
  const [ask, setAsk] = useState("");
  const [askThread, setAskThread] = useState<{ role: string; content: string }[]>([]);
  const [askBusy, setAskBusy] = useState(false);
  const [flagged, setFlagged] = useState(false);
  const [err, setErr] = useState("");

  const [qotdServed, setQotdServed] = useState(false);

  const load = useCallback(async () => {
    setResult(null);
    setAlt(null);
    setAsk("");
    setAskThread([]);
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
    if (userId && subjectParam) load();
    setTimed(localStorage.getItem("edupal_timed") === "1");
    if (userId) {
      fetch(`/api/topics?userId=${userId}`)
        .then((r) => r.json())
        .then((d) => {
          setSwitcher(d.subjectLimits ?? []);
          setDepartment(d.profile?.department ?? "");
        })
        .catch(() => setDepartment(""))
        .finally(() => setReady(true));
      fetch("/api/admin-bank")
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => setBank(d?.counts ?? []));
    }
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

  async function askAI() {
    if (!q || !ask.trim() || askBusy) return;
    const text = ask.trim();
    setAsk("");
    setAskBusy(true);
    setAskThread((t) => [...t, { role: "user", content: text }]);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, questionId: q.id, message: text, language: "SIMPLE" })
      });
      const data = await res.json();
      setAskThread((t) => [...t, { role: "assistant", content: data.reply ?? "Hmm, try again." }]);
    } finally {
      setAskBusy(false);
    }
  }

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
    // One tap locks the answer. If the network drops the call, retry
    // invisibly in the background — the user never taps twice.
    let res: Response | null = null;
    let lastErr: unknown = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 45000);
      try {
        res = await fetch("/api/practice/attempt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, questionId: q.id, response: answer, timed, secondsUsed: timed ? limit - secs : null, qotd: isQotd }),
          signal: ctrl.signal
        });
        clearTimeout(timer);
        break;
      } catch (e) {
        clearTimeout(timer);
        lastErr = e;
        if (attempt < 3) continue; // silent auto-retry, no second tap needed
        const aborted = e instanceof Error && e.name === "AbortError";
        setErr(aborted ? "Taking too long — please wait, still marking…" : "Network hiccup — still trying, hold on…");
        // One final invisible retry before giving up and unlocking.
        try {
          res = await fetch("/api/practice/attempt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, questionId: q.id, response: answer, timed, secondsUsed: timed ? limit - secs : null, qotd: isQotd })
          });
          setErr("");
          break;
        } catch {
          const aborted2 = lastErr instanceof Error && lastErr.name === "AbortError";
          setErr(aborted2 ? "Taking too long — tap Submit once to retry." : "Network hiccup — tap Submit once to retry.");
          setBusy(false);
          return;
        }
      }
    }
    if (!res) {
      setBusy(false);
      return;
    }
    try {
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

  // Hub lists every subject that actually has questions (profile list can lag behind).
  const allowedSubjects = department
    ? [...COMMON_SUBJECTS, ...DEPARTMENTS[department as keyof typeof DEPARTMENTS]]
    : [...JSS_SUBJECTS];
  // Junior students (onboarding sets department to "") practice the junior list.
  const isJunior = !department;
  const cardPool = bank.length
    ? bank.map((b) => ({ subject: b.subject, left: switcher.find((s) => s.subject === b.subject)?.left ?? 10, n: b.n }))
    : switcher.map((s) => ({ ...s, n: 0 }));
  const cardsIn = (list: readonly string[]) => cardPool.filter((s) => !hidden.includes(s.subject) && list.includes(s.subject));
  const hubSubjects = cardsIn(allowedSubjects);

  // No subject chosen → subject picker hub (the Practice section, tiered).
  if (!subjectParam) {
    const jss = [...JSS_SUBJECTS];
    // Junior students (department "") practice the junior list; senior
    // students see their department plus a peek at the junior tier.
    const juniorCardsAll = cardsIn(jss);
    const seniorCards = isJunior ? [] : hubSubjects;
    const juniorCards = isJunior ? hubSubjects : juniorCardsAll.filter((s) => !hubSubjects.some((h) => h.subject === s.subject));
    const juniorSoon = jss.filter((x) => !juniorCards.some((c) => c.subject === x) && !seniorCards.some((h) => h.subject === x));
    const subjectCard = (s: { subject: string; left: number; n: number }) => (
      <a key={s.subject} href={`/practice?userId=${userId}&subject=${encodeURIComponent(s.subject)}`}
        style={{ background: "#fff", border: "2px solid #0F766E", borderRadius: 12, padding: 16, textDecoration: "none", color: "#1E242E" }}>
        <strong style={{ fontSize: 17 }}>{shortSubject(s.subject)}</strong>
        <div style={{ fontSize: 13, color: "#5F6E7F", marginTop: 4 }}>{s.left} free left today • {s.n} questions in bank</div>
        <div style={{ fontSize: 14, fontWeight: 800, color: "#0F766E", marginTop: 8 }}>Start practicing →</div>
      </a>
    );
    return (
      <main style={{ maxWidth: 680, margin: "0 auto", padding: 20, color: "#333A45" }}>
        <h1 style={{ color: "#1E242E", fontSize: 24 }}>Practice</h1>
        {department && (
          <div style={{ background: "#F0F9FF", border: "1px solid #BAE6FD", borderRadius: 10, padding: 10, marginBottom: 12, fontSize: 13, color: "#0369A1" }}>
            <strong style={{ display: "block", fontSize: 12, marginBottom: 4, color: "#0c4a6e" }}>📚 {department} department focus</strong>
            You're seeing {department} subjects only. English, Mathematics and Physical Health Education are included for everyone. Other subjects exist but stay hidden so you stay focused on your department.
          </div>
        )}
        <p style={{ fontSize: 14, color: "#5F6E7F" }}>Choose a subject to start. Budgets reset daily at midnight.</p>
        {!ready ? (
          <p style={{ fontSize: 14, color: "#5F6E7F" }}>Loading subjects…</p>
        ) : (
          <>
        {/* Seniors: dark collapsible tier bar + junior peek box below. */}
        {!isJunior && (
          <>
            <button onClick={() => setSeniorOpen((o) => !o)}
              style={{ width: "100%", textAlign: "left", background: "#1E242E", color: "#fff", border: 0, borderRadius: 12, padding: 14, fontSize: 16, fontWeight: 800, cursor: "pointer", marginBottom: 8 }}>
              {seniorOpen ? "▾" : "▸"} Senior Secondary School
            </button>
            {seniorOpen && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 12 }}>
                {hubSubjects.length === 0 && <p>Loading subjects…</p>}
                {seniorCards.map(subjectCard)}
              </div>
            )}
            <div style={{ marginTop: 16, background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 14, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ fontSize: 16 }}>Junior Secondary School</strong>
                <span style={{ fontSize: 11, background: "#CCFBF1", color: "#0F766E", padding: "3px 10px", borderRadius: 999, fontWeight: 800, border: "1px solid #99F6E4" }}>Live</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginTop: 12 }}>
                {juniorCards.length === 0 && <p style={{ fontSize: 14, color: "#5F6E7F" }}>Loading subjects…</p>}
                {juniorCards.map(subjectCard)}
              </div>
              {juniorSoon.length > 0 && (
                <div style={{ fontSize: 13, color: "#5F6E7F", marginTop: 10 }}>
                  Coming soon: {juniorSoon.map(shortSubject).join(" • ")}
                </div>
              )}
            </div>
          </>
        )}
        {/* Juniors see their tier exactly like seniors see theirs: dark bar + cards. */}
        {isJunior && (
          <>
            <button onClick={() => setSeniorOpen((o) => !o)}
              style={{ width: "100%", textAlign: "left", background: "#1E242E", color: "#fff", border: 0, borderRadius: 12, padding: 14, fontSize: 16, fontWeight: 800, cursor: "pointer", marginBottom: 8 }}>
              {seniorOpen ? "▾" : "▸"} Junior Secondary School
            </button>
            {seniorOpen && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 12 }}>
                  {hubSubjects.length === 0 && <p>Loading subjects…</p>}
                  {juniorCards.map(subjectCard)}
                </div>
                {juniorSoon.length > 0 && (
                  <div style={{ fontSize: 13, color: "#5F6E7F", marginBottom: 12 }}>
                    Coming soon: {juniorSoon.map(shortSubject).join(" • ")}
                  </div>
                )}
              </div>
            )}
          </>
        )}
          </>
        )}
      </main>
    );
  }
  // Block access to subjects outside the user's department.
  if (subjectParam && department && !allowedSubjects.includes(subjectParam)) {
    return (
      <main style={{ maxWidth: 640, margin: "0 auto", padding: 20, color: "#333A45", textAlign: "center" }}>
        <div style={{ fontSize: 48 }}>🚫</div>
        <h1 style={{ color: "#1E242E" }}>Not in your department</h1>
        <p style={{ fontSize: 16, margin: "12px 0" }}>
          <strong>{subjectParam}</strong> is not part of your {department} department study plan.
        </p>
        <p style={{ fontSize: 14, color: "#5F6E7F" }}>
          You can only practise your department's subjects ({allowedSubjects.join(", ")}). Other subjects exist but stay hidden so you stay focused.
        </p>
        <a href={`/practice?userId=${userId}`} style={{ display: "inline-block", background: "#0F766E", color: "#fff", borderRadius: 10, padding: "12px 28px", fontWeight: 800, textDecoration: "none", marginTop: 12 }}>Back to subject picker</a>
      </main>
    );
  }
  if (done)
    return (
      <main style={{ maxWidth: 420, margin: "0 auto", padding: 20, color: "#333A45" }}>
        <h1 style={{ color: "#1E242E" }}>Done with {subject} for now</h1>
        <p>You've answered the available {subject} questions. Pick another subject to keep going:</p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
          {(switcher.length ? switcher : [{ subject: "English", left: 10 }]).filter((s) => s.subject !== subject).map((s) => (
            <a key={s.subject} href={`/practice?userId=${userId}&subject=${encodeURIComponent(s.subject)}`}
              style={{ fontSize: 13, fontWeight: 700, padding: "10px 14px", borderRadius: 999, textDecoration: "none", background: "#0F766E", color: "#fff" }}>
              {s.subject}{s.left !== undefined ? ` • ${s.left}` : ""}
            </a>
          ))}
        </div>
        <button style={btnPrimary} onClick={() => router.push(`/dashboard?userId=${userId}`)}>Back to dashboard</button>
      </main>
    );

  return (
    <main style={{ maxWidth: 420, margin: "0 auto", padding: 20, color: "#333A45" }}>
      {topicParam && (
        <div style={{ background: "#F0F9FF", border: "1px solid #BAE6FD", borderRadius: 10, padding: 10, marginBottom: 12, fontSize: 13, color: "#0369A1", display: "flex", alignItems: "center", gap: 8 }}>
          <strong style={{ fontSize: 12, color: "#0c4a6e" }}>📖 Practicing:</strong> {topicParam}
        </div>
      )}
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
      {switcher.length > 1 && !result && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "8px 0" }}>
          {switcher.filter((s) => s.subject !== subject).map((s) => (
            <a key={s.subject} href={`/practice?userId=${userId}&subject=${encodeURIComponent(s.subject)}`}
              style={{ fontSize: 12, fontWeight: 700, padding: "8px 12px", borderRadius: 999, textDecoration: "none", background: "#F1F5F9", color: "#1E242E", border: "1px solid #CBD5E1" }}>
              {s.subject} • {s.left}
            </a>
          ))}
        </div>
      )}
      {!q ? (
        <p>Loading…</p>
      ) : (
        <>
          <h2 style={{ color: "#1E242E", fontSize: 20 }}>{q.topic}</h2>
          <a href={`/glossary?subject=${encodeURIComponent(q.subject)}`} style={{ fontSize: 13, color: "#0F766E", fontWeight: 700 }}>📖 Key terms for {q.topic}</a>
          <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 999,
              background: q.difficulty === "HARD" ? "#FEE2E2" : q.difficulty === "EASY" ? "#DCFCE7" : "#F1F5F9",
              color: q.difficulty === "HARD" ? "#991B1B" : q.difficulty === "EASY" ? "#166534" : "#475569" }}>
              {q.difficulty}
            </span>
            {q.predictedRepeat === 1 && <span style={{ fontSize: 12, fontWeight: 700, background: "#FEF3C7", border: "1px solid #FDE68A", color: "#92400E", padding: "4px 10px", borderRadius: 999 }}>Likely to repeat</span>}
          </div>
          <p>{q.stem}</p>
          {(() => {
            if (q.type !== "MCQ") return null;
            const opts: string[] = JSON.parse(q.optionsJson);
            const norm = (s: string) => s.trim().toLowerCase();
            const correctNorm = result ? norm(result.correctAnswer) : "";
            const pickedNorm = norm(answer);
            // One shared layout: same positions/styles for right + wrong.
            // Locked after one tap (busy || result). Wrong → picked red ✗,
            // right answer green glow. Right → picked green Correct ✓.
            return opts.map((opt: string) => {
              const isPicked = norm(opt) === pickedNorm && answer.trim() !== "";
              const isCorrectOpt = !!result && norm(opt) === correctNorm;
              const isWrongPick = !!result && isPicked && !result.correct;
              const locked = busy || !!result;
              let border = btnOpt.border;
              let background = "#fff";
              let opacity = 1;
              let boxShadow = "none";
              if (!result) {
                if (isPicked) { border = "2px solid #0F766E"; background = "#CCFBF1"; }
              } else if (isCorrectOpt) {
                border = "2px solid #16A34A"; background = "#DCFCE7";
                boxShadow = "0 0 0 3px rgba(22,163,74,0.25)";
              } else if (isWrongPick) {
                border = "2px solid #DC2626"; background = "#FEE2E2";
              } else {
                opacity = 0.65;
              }
              return (
                <button key={opt} disabled={locked}
                  style={{ ...btnOpt, border, background, opacity, boxShadow, cursor: locked ? "default" : "pointer" }}
                  onClick={() => { if (!locked) setAnswer(opt); }}>
                  {isWrongPick ? "✗ " : isCorrectOpt ? "✓ " : ""}{opt}
                </button>
              );
            });
          })()}
          {q.type !== "MCQ" && (
            <textarea value={answer} onChange={(e) => { if (!busy && !result) setAnswer(e.target.value); }} rows={4}
              disabled={busy || !!result}
              style={{ width: "100%", borderRadius: 10, border: "1px solid #CBD5E1", padding: 10, fontSize: 16, background: result ? "#F8FAFC" : "#fff" }}
              placeholder="Write your answer…" />
          )}
          {err && <p style={{ color: "#DC2626" }}>{err}</p>}
          {!result ? (
            <button style={{ ...btnPrimary, opacity: busy || !answer.trim() ? 0.7 : 1 }} onClick={() => submit()} disabled={busy || !answer.trim()}>
              {busy ? "Marking… (wait, do not tap twice)" : `Submit Answer • ${q.type === "MCQ" ? "1 credit" : "3 credits"}`}
            </button>
          ) : (
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, marginTop: 8 }}>
              <p style={{ fontWeight: 700, color: result.correct ? "#16A34A" : "#DC2626" }}>
                {result.correct ? "Correct ✓" : `Not quite ✗ — answer: ${result.correctAnswer}`}
              </p>
              <p style={{ fontSize: 11, color: "#5F6E7F", margin: "0 0 4px" }}>AI-generated explanation — verify with your teacher</p>
              {result.leveledUp && <p style={{ fontWeight: 800, color: "#0F766E" }}><span className="deco">🎉 </span>Level up! {result.mastery.topic} is now {result.mastery.label}.</p>}
              {result.freezeUsed && <p style={{ fontWeight: 700, color: "#2F5D7C" }}><span className="deco">🧊 </span>Your streak freeze saved the streak — one per month.</p>}
              {result.usedBonus && <p style={{ fontWeight: 700, color: "#92400E" }}>🎁 Referral bonus covered this question.</p>}
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
              <div style={{ marginTop: 8, background: "#F8FAFC", borderRadius: 10, padding: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#1E242E", marginBottom: 6 }}>Ask AI — follow up without leaving</div>
                {askThread.map((m, i) => (
                  <div key={i} style={{ fontSize: 13, textAlign: m.role === "user" ? "right" : "left", margin: "4px 0" }}>
                    <span style={{ display: "inline-block", background: m.role === "user" ? "#0F766E" : "#fff", color: m.role === "user" ? "#fff" : "#333A45", border: m.role === "user" ? "none" : "1px solid #E2E8F0", borderRadius: 10, padding: "6px 10px", maxWidth: "90%" }}>{m.content}</span>
                  </div>
                ))}
                <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                  <input value={ask} onChange={(e) => setAsk(e.target.value)} onKeyDown={(e) => e.key === "Enter" && askAI()} placeholder="e.g. why not option B?" disabled={askBusy}
                    style={{ flex: 1, height: 40, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 10px", fontSize: 14 }} />
                  <button onClick={askAI} disabled={askBusy || !ask.trim()} style={{ height: 40, borderRadius: 10, border: 0, background: "#0F766E", color: "#fff", fontWeight: 800, padding: "0 16px", cursor: "pointer" }}>
                    {askBusy ? "…" : "Ask"}
                  </button>
                </div>
              </div>
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
      <FocusSounds />
    </Suspense>
  );
}
