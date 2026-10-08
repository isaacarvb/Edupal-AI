"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SUBJECTS } from "@/lib/syllabus";

const input: React.CSSProperties = { width: "100%", height: 48, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px", fontSize: 16, margin: "6px 0 12px", boxSizing: "border-box" };
const btn: React.CSSProperties = { display: "block", width: "100%", height: 52, borderRadius: 12, border: 0, fontSize: 16, fontWeight: 700, background: "#0F766E", color: "#fff", cursor: "pointer", marginTop: 8 };
const cell: React.CSSProperties = { flex: "1 1 220px", minWidth: 0 };

function OnboardingInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [userId, setUserId] = useState("");
  const [level, setLevel] = useState("SECONDARY");
  const [exam, setExam] = useState("JAMB");
  const [examDate, setExamDate] = useState("");
  const [subjects, setSubjects] = useState<string[]>(["English"]);
  const [language, setLanguage] = useState("SIMPLE");
  const [err, setErr] = useState("");

  useEffect(() => {
    setUserId(params.get("userId") ?? localStorage.getItem("edupal_user") ?? "");
  }, [params]);

  function toggle(s: string) {
    setSubjects((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));
  }

  async function submit() {
    if (!userId) {
      router.push("/signup");
      return;
    }
    setErr("");
    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, level, exam, examDate: examDate || null, subjects, language })
    });
    const data = await res.json();
    if (!res.ok) return setErr(data.error || "Something went wrong");
    router.push(`/practice?userId=${userId}&subject=${encodeURIComponent(subjects[0])}`);
  }

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px", color: "#333A45" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <h1 style={{ fontSize: 24, color: "#1E242E", margin: "0 0 4px" }}>Set up your study plan</h1>
        <p style={{ fontSize: 14, color: "#5F6E7F", margin: "0 0 12px" }}>Step 2 of 2 — tell us what you're preparing for.</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={cell}>
            <label>Level</label>
            <select style={input} value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="SECONDARY">Secondary</option>
              <option value="UNIVERSITY">University</option>
            </select>
          </div>
          <div style={cell}>
            <label>Exam</label>
            <select style={input} value={exam} onChange={(e) => setExam(e.target.value)}>
              <option value="JAMB">JAMB</option>
              <option value="WAEC">WAEC</option>
              <option value="NECO">NECO</option>
              <option value="GCE">GCE</option>
            </select>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={cell}>
            <label>Exam date</label>
            <input style={input} type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} />
          </div>
          <div style={cell}>
            <label>Primary language</label>
            <select style={input} value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="SIMPLE">Simple English</option>
              <option value="PIDGIN">Pidgin</option>
            </select>
          </div>
        </div>
        <label>Subjects</label>
        <div style={{ display: "flex", gap: 8, margin: "6px 0 12px", flexWrap: "wrap" }}>
          {SUBJECTS.map((s) => (
            <button
              key={s}
              onClick={() => toggle(s)}
              style={{ flex: "1 1 30%", height: 44, borderRadius: 10, border: subjects.includes(s) ? "2px solid #0F766E" : "1px solid #CBD5E1", background: subjects.includes(s) ? "#CCFBF1" : "#fff", fontWeight: 600, cursor: "pointer" }}
            >
              {s}
            </button>
          ))}
        </div>
        {err && <p style={{ color: "#DC2626" }}>{err}</p>}
        <button style={btn} onClick={submit} disabled={!subjects.length}>Save Plan &amp; Start Diagnostic</button>
      </div>
    </main>
  );
}

export default function Onboarding() {
  return (
    <Suspense fallback={<main style={{ padding: 20 }}>Loading…</main>}>
      <OnboardingInner />
    </Suspense>
  );
}
