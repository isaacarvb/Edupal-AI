"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SSS_SUBJECTS, DEPARTMENTS, COMMON_SUBJECTS } from "@/lib/syllabus";

type Q = { id: string; subject: string; topic: string; type: string; stem: string; optionsJson: string };
type Result = { score: number; total: number; pct: number; topics: { topic: string; subject: string; correct: number; total: number; pct: number }[] };

function PaperInner() {
  const params = useSearchParams();
  const [userId, setUserId] = useState("");
  const [exam, setExam] = useState("WAEC");
  const [subject, setSubject] = useState("English");
  const [qs, setQs] = useState<Q[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [secs, setSecs] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [department, setDepartment] = useState("");
  const submitted = useRef(false);

  useEffect(() => {
    setUserId(params.get("userId") ?? localStorage.getItem("edupal_user") ?? "");
  }, [params]);

  useEffect(() => {
    const id = params.get("userId") ?? localStorage.getItem("edupal_user") ?? "";
    if (id) {
      fetch(`/api/topics?userId=${id}`)
        .then((r) => r.json())
        .then((d) => setDepartment(d.profile?.department ?? ""));
    }
  }, [params]);

  const allowedPaperSubjects = department
    ? [...COMMON_SUBJECTS, ...DEPARTMENTS[department as keyof typeof DEPARTMENTS]]
    : [...SSS_SUBJECTS];

  useEffect(() => {
    if (secs <= 0 || result) return;
    const t = setTimeout(() => setSecs((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secs, result]);

  useEffect(() => {
    if (secs === 0 && qs.length && !result) submit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secs]);

  async function start() {
    setErr("");
    setResult(null);
    const res = await fetch(`/api/past-paper?userId=${userId}&exam=${exam}&subject=${encodeURIComponent(subject)}`);
    const data = await res.json();
    if (!res.ok) return setErr(data.needsUpgrade ? "Past paper mode needs Unlimited — upgrade on your dashboard first." : data.error || "Failed");
    setQs(data.questions);
    setAnswers({});
    setSecs(data.seconds);
  }

  async function submit() {
    if (submitted.current || !qs.length) return;
    submitted.current = true;
    setBusy(true);
    try {
      const res = await fetch("/api/past-paper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, answers: qs.map((q) => ({ questionId: q.id, response: answers[q.id] ?? "" })) })
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
        setQs([]);
      } else {
        setErr(data.error || "Submit failed");
        submitted.current = false;
      }
    } finally {
      setBusy(false);
    }
  }

  function fmt(s: number): string {
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  }

  if (!userId) return <main style={{ padding: 20 }}>Missing user. Start from <a href="/signup">signup</a>.</main>;

  return (
    <main style={{ maxWidth: 680, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <h1 style={{ color: "#1E242E", fontSize: 24 }}>Past paper mode</h1>

      {result ? (
        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 20, textAlign: "center" }}>
          <div style={{ fontSize: 44, fontWeight: 800, color: "#0F766E" }}>{result.pct}%</div>
          <p>{result.score} of {result.total} correct — exam conditions, one sitting.</p>
          {result.topics.map((t) => (
            <div key={t.topic} style={{ textAlign: "left", fontSize: 14, padding: "8px 0", borderTop: "1px solid #E2E8F0" }}>
              <strong>{t.topic}</strong> — {t.correct}/{t.total} ({t.pct}%)
              <div style={{ height: 8, background: "#E2E8F0", borderRadius: 999, marginTop: 4 }}>
                <div style={{ height: "100%", width: `${t.pct}%`, background: t.pct >= 75 ? "#16A34A" : t.pct >= 50 ? "#F59E0B" : "#DC2626", borderRadius: 999 }} />
              </div>
            </div>
          ))}
          <a href={`/dashboard?userId=${userId}`} style={{ display: "block", marginTop: 12, color: "#0F766E", fontWeight: 700 }}>Back to dashboard</a>
        </div>
      ) : qs.length === 0 ? (
        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16 }}>
          <p style={{ fontSize: 14 }}>Full paper, timed, submitted whole, scored at the end. Unlimited plan only.</p>
          <label>Exam</label>
          <select value={exam} onChange={(e) => setExam(e.target.value)} style={{ width: "100%", height: 48, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px", fontSize: 16, margin: "6px 0 12px" }}>
            <option value="WAEC">WAEC</option>
            <option value="JAMB">JAMB</option>
            <option value="Others">Others</option>
          </select>
          <label>Subject</label>
          <select value={subject} onChange={(e) => setSubject(e.target.value)} style={{ width: "100%", height: 48, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px", fontSize: 16, margin: "6px 0 12px" }}>
            {allowedPaperSubjects.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {department && (
            <div style={{ background: "#F0F9FF", border: "1px solid #BAE6FD", borderRadius: 8, padding: 8, marginTop: 8, fontSize: 12, color: "#0369A1" }}>
              <strong style={{ display: "block", fontSize: 11, marginBottom: 2, color: "#0c4a6e" }}>📚 {department} department focus</strong>
              You're seeing {department} subjects only for past papers. Other subjects exist but stay hidden so you stay focused on your department.
            </div>
          )}
          {err && <p style={{ color: "#DC2626", fontSize: 14 }}>{err}</p>}
          <button onClick={start} style={{ width: "100%", height: 52, borderRadius: 12, border: 0, background: "#0F766E", color: "#fff", fontWeight: 800, fontSize: 16, cursor: "pointer" }}>Start paper</button>
        </div>
      ) : (
        <>
          <div style={{ position: "sticky", top: 0, background: "#1E242E", color: "#fff", borderRadius: 12, padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <strong>{exam} • {subject} • {qs.length} questions</strong>
            <span style={{ fontSize: 20, fontWeight: 800, color: secs <= 60 ? "#FCA5A5" : "#A7F3D0" }}>⏱ {fmt(secs)}</span>
          </div>
          {qs.map((q, i) => (
            <div key={q.id} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 14, marginBottom: 10 }}>
              <p style={{ fontSize: 13, color: "#5F6E7F" }}>Q{i + 1} • {q.topic} • {q.type}</p>
              <p style={{ fontSize: 16 }}>{q.stem}</p>
              {q.type === "MCQ" ? (
                JSON.parse(q.optionsJson).map((opt: string) => (
                  <button key={opt} onClick={() => setAnswers((a) => ({ ...a, [q.id]: opt }))}
                    style={{ display: "block", width: "100%", textAlign: "left", minHeight: 44, borderRadius: 10, margin: "6px 0", padding: 10, fontSize: 15, cursor: "pointer",
                      border: answers[q.id] === opt ? "2px solid #0F766E" : "1px solid #CBD5E1",
                      background: answers[q.id] === opt ? "#CCFBF1" : "#fff" }}>
                    {opt}
                  </button>
                ))
              ) : (
                <textarea value={answers[q.id] ?? ""} onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))} rows={3}
                  style={{ width: "100%", borderRadius: 10, border: "1px solid #CBD5E1", padding: 10, fontSize: 15 }} placeholder="Write your answer…" />
              )}
            </div>
          ))}
          <button onClick={submit} disabled={busy} style={{ width: "100%", height: 52, borderRadius: 12, border: 0, background: "#0F766E", color: "#fff", fontWeight: 800, fontSize: 16, cursor: "pointer" }}>
            {busy ? "Marking…" : "Submit whole paper"}
          </button>
        </>
      )}
    </main>
  );
}

export default function PastPaper() {
  return (
    <Suspense fallback={<main style={{ padding: 20 }}>Loading…</main>}>
      <PaperInner />
    </Suspense>
  );
}
