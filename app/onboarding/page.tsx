"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DEPARTMENTS, DEPARTMENT_NAMES, JSS_SUBJECTS } from "@/lib/syllabus";
import { useHiddenSubjects } from "@/components/useHiddenSubjects";

const input: React.CSSProperties = { width: "100%", height: 48, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px", fontSize: 16, margin: "6px 0 12px", boxSizing: "border-box" };
const btn: React.CSSProperties = { display: "block", width: "100%", height: 52, borderRadius: 12, border: 0, fontSize: 16, fontWeight: 700, background: "#0F766E", color: "#fff", cursor: "pointer", marginTop: 8 };
const cell: React.CSSProperties = { flex: "1 1 220px", minWidth: 0 };

function OnboardingInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [userId, setUserId] = useState("");
  const [exam, setExam] = useState("JAMB");
  const [department, setDepartment] = useState("Science");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notConfirmed, setNotConfirmed] = useState(false);
  const [subjects, setSubjects] = useState<string[]>(["English"]);
  const [language, setLanguage] = useState("SIMPLE");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const hidden = useHiddenSubjects();

  const isJss = exam === "Others";
  const deptSubjects = isJss ? [...JSS_SUBJECTS] : [...DEPARTMENTS[department as keyof typeof DEPARTMENTS]];
  const visibleSubjects = deptSubjects.filter((s) => !hidden.includes(s));

  useEffect(() => {
    setUserId(params.get("userId") ?? localStorage.getItem("edupal_user") ?? "");
  }, [params]);

  async function submit() {
    if (!userId) {
      router.push("/signup");
      return;
    }
    if (!subjects.length) return setErr("Pick at least one subject.");
    if (!notConfirmed && startDate && endDate && endDate < startDate) {
      return setErr("End date cannot be before start date.");
    }
    setErr("");
    setBusy(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId, level: "SECONDARY", exam,
          department: isJss ? "" : department,
          examStart: notConfirmed ? null : startDate || null,
          examEnd: notConfirmed ? null : endDate || null,
          datesConfirmed: !notConfirmed,
          subjects, language
        })
      });
      const data = await res.json();
      if (!res.ok) return setErr(data.error || "Something went wrong");
      router.push(`/practice?userId=${userId}&subject=${encodeURIComponent(subjects[0])}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px", color: "#333A45" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <h1 style={{ fontSize: 24, color: "#1E242E", margin: "0 0 4px" }}>Set up your study plan</h1>
        <p style={{ fontSize: 14, color: "#5F6E7F", margin: "0 0 12px" }}>Step 2 of 2 — tell us what you're preparing for.</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={cell}>
            <label>Exam</label>
            <select style={input} value={exam} onChange={(e) => setExam(e.target.value)}>
              <option value="JAMB">JAMB</option>
              <option value="WAEC">WAEC</option>
              <option value="Others">Others (JSS / other exams)</option>
            </select>
          </div>
          {!isJss && (
            <div style={cell}>
              <label>Department</label>
              <select style={input} value={department} onChange={(e) => setDepartment(e.target.value)}>
                {DEPARTMENT_NAMES.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        {!isJss && (
          <div style={{ background: "#F0F9FF", border: "1px solid #BAE6FD", borderRadius: 10, padding: 10, marginBottom: 12, fontSize: 13, color: "#0369A1" }}>
            <strong style={{ display: "block", fontSize: 12, marginBottom: 4, color: "#0c4a6e" }}>📚 Your department shapes your study</strong>
            Choose {department === "Science" ? "science subjects (Physics, Chemistry, Biology)" : department === "Commercial" ? "commercial subjects (Commerce, Accounting, Marketing, Economics)" : "arts subjects (Literature in English, Government)"}. English, Mathematics and Physical Health Education are included for everyone. Other subjects exist but stay hidden so you stay focused on your department.
          </div>
        )}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={cell}>
            <label>Examination start date</label>
            <input style={input} type="date" value={startDate} disabled={notConfirmed} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div style={cell}>
            <label>Examination end date</label>
            <input style={input} type="date" value={endDate} disabled={notConfirmed} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>
        <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 14, margin: "0 0 12px", cursor: "pointer" }}>
          <input type="checkbox" checked={notConfirmed} onChange={(e) => setNotConfirmed(e.target.checked)} style={{ width: 18, height: 18 }} />
          My examination dates are not yet confirmed (timetable not out)
        </label>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={cell}>
            <label>Primary language</label>
            <select style={input} value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="SIMPLE">Simple English</option>
              <option value="PIDGIN">Pidgin</option>
            </select>
          </div>
        </div>
        <label>Subjects {!isJss && <span style={{ color: "#5F6E7F" }}>({department} department)</span>}</label>
        <div style={{ display: "flex", gap: 8, margin: "6px 0 12px", flexWrap: "wrap" }}>
          {visibleSubjects.map((s) => {
            const selected = subjects.includes(s);
            return (
              <button
                key={s}
                onClick={() => setSubjects([s])}
                style={{
                  flex: "1 1 30%",
                  height: 72,
                  minHeight: 72,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 10,
                  border: selected ? "2px solid #0F766E" : "1px solid #CBD5E1",
                  background: selected ? "#CCFBF1" : "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: "0 8px",
                  textAlign: "center",
                  fontSize: 13,
                  lineHeight: 1.2
                }}
              >
                {s}
              </button>
            );
          })}
        </div>
        {err && <p style={{ color: "#DC2626" }}>{err}</p>}
        <button style={btn} onClick={submit} disabled={!subjects.length || busy}>{busy ? "Saving…" : "Save Plan & Start Diagnostic"}</button>
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
