"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SUBJECTS } from "@/lib/syllabus";
const input: React.CSSProperties = { width: "100%", height: 48, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px", fontSize: 16, margin: "6px 0 12px" };
const btn: React.CSSProperties = { display: "block", width: "100%", height: 48, borderRadius: 10, border: 0, fontSize: 16, fontWeight: 600, background: "#0F766E", color: "#fff", cursor: "pointer", marginTop: 8 };

export default function Onboarding() {
  const router = useRouter();
  const [level, setLevel] = useState("SECONDARY");
  const [exam, setExam] = useState("JAMB");
  const [examDate, setExamDate] = useState("");
  const [subjects, setSubjects] = useState<string[]>(["English"]);
  const [language, setLanguage] = useState("SIMPLE");
  const [err, setErr] = useState("");

  function toggle(s: string) {
    setSubjects((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));
  }

  async function submit() {
    setErr("");
    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ level, exam, examDate: examDate || null, subjects, language })
    });
    const data = await res.json();
    if (!res.ok) return setErr(data.error || "Something went wrong");
    localStorage.setItem("edupal_user", data.userId);
    router.push(`/practice?userId=${data.userId}&subject=${encodeURIComponent(subjects[0])}`);
  }

  return (
    <main style={{ maxWidth: 420, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <h1 style={{ fontSize: 24, color: "#1E242E" }}>Set up your study plan</h1>
      <label>Level</label>
      <select style={input} value={level} onChange={(e) => setLevel(e.target.value)}>
        <option value="SECONDARY">Secondary</option>
        <option value="UNIVERSITY">University</option>
      </select>
      <label>Exam</label>
      <select style={input} value={exam} onChange={(e) => setExam(e.target.value)}>
        <option value="JAMB">JAMB</option>
        <option value="WAEC">WAEC</option>
      </select>
      <label>Exam date</label>
      <input style={input} type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} />
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
      <label>Language</label>
      <select style={input} value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="SIMPLE">Simple English</option>
        <option value="PIDGIN">Pidgin</option>
      </select>
      {err && <p style={{ color: "#DC2626" }}>{err}</p>}
      <button style={btn} onClick={submit} disabled={!subjects.length}>Start diagnostic</button>
    </main>
  );
}
