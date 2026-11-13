"use client";

import { useEffect, useState } from "react";
import SubscriptionGate from "@/components/SubscriptionGate";

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, margin: "0 0 12px" };

export default function SchoolMockExamsPage() {
  return (
    <SubscriptionGate
      feature="Mock Exams"
      description="Schedule school mock exams by class and subject, then review how each class performed."
      bullets={[
        "Set the class, subjects, duration and date",
        "Students sit the paper inside EduPal",
        "Compare results across classes and subjects"
      ]}
    >
      <SchoolMockExams />
    </SubscriptionGate>
  );
}

function SchoolMockExams() {
  const [school, setSchool] = useState<{ id: string; name: string } | null>(null);
  const [exams, setExams] = useState<{ id: string; title: string; subjects: string; className: string; durationMinutes: number; scheduledAt: string | null; status: string; createdAt: string }[]>([]);
  const [title, setTitle] = useState("");
  const [subjects, setSubjects] = useState("");
  const [className, setClassName] = useState("");
  const [duration, setDuration] = useState("30");
  const [scheduledAt, setScheduledAt] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const s = localStorage.getItem("edupal_school");
    if (s) {
      try { setSchool(JSON.parse(s)); } catch { /* ignore */ }
    }
    fetchExams();
  }, []);

  async function fetchExams() {
    const s = localStorage.getItem("edupal_school");
    if (!s) return;
    try {
      const d = JSON.parse(s);
      const res = await fetch(`/api/school/mock-exams-list?schoolId=${d.id}`);
      if (res.ok) {
        const jd = await res.json();
        setExams(jd.exams ?? []);
      }
    } catch { /* ignore */ }
  }

  async function createExam() {
    if (!title.trim()) return setMsg("Title required.");
    if (!subjects.trim()) return setMsg("At least one subject required.");
    if (!className.trim()) return setMsg("Class required.");
    setMsg("");
    setBusy(true);
    try {
      const s = localStorage.getItem("edupal_school");
      if (!s) return;
      const d = JSON.parse(s);
      const res = await fetch("/api/school/mock-exams-create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schoolId: d.id, title: title.trim(), subjects: subjects.trim(), className: className.trim(), durationMinutes: Number(duration) || 30, scheduledAt: scheduledAt || null })
      });
      const jd = await res.json();
      if (!res.ok) return setMsg(jd.error || "Failed to create.");
      setMsg("Mock exam created.");
      setTitle("");
      setSubjects("");
      setClassName("");
      setDuration("30");
      setScheduledAt("");
      fetchExams();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Failed to create.");
    } finally {
      setBusy(false);
    }
  }

  if (!school) {
    return (
      <main style={{ maxWidth: 480, margin: "60px auto", padding: 20, color: "#333A45", textAlign: "center" }}>
        <p style={{ fontSize: 14, color: "#5F6E7F" }}>School session not found.</p>
        <button onClick={() => { window.location.href = "/school-login"; }}
          style={{ height: 40, borderRadius: 8, border: 0, background: "#0F766E", color: "#fff", fontWeight: 800, padding: "0 20px", cursor: "pointer" }}>
          Sign In to School
        </button>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1E242E", margin: "0 0 16px" }}>Mock Exams</h1>
      <p style={{ fontSize: 13, color: "#5F6E7F", marginBottom: 16 }}>
        Create timed mock exams. Students take them and results appear in Progress Analytics.
      </p>

      <div style={card}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: "#1E242E", margin: "0 0 12px" }}>Create Mock Exam</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title (e.g. Midterm Mock)"
            style={{ height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px", gridColumn: "1 / -1" }} />
          <input value={subjects} onChange={(e) => setSubjects(e.target.value)} placeholder="Subjects (comma-separated, e.g. Mathematics, English Studies)"
            style={{ height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px" }} />
          <input value={className} onChange={(e) => setClassName(e.target.value)} placeholder="Class (e.g. SS2A)"
            style={{ height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px" }} />
          <div style={{ display: "flex", gap: 8 }}>
            <input value={duration} onChange={(e) => setDuration(e.target.value)} type="number" min={5} max={300} placeholder="Duration (minutes)"
              style={{ flex: 1, height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px" }} />
            <input value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} type="datetime-local"
              style={{ flex: 1, height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px" }} />
          </div>
          <button onClick={createExam} disabled={busy}
            style={{ height: 44, borderRadius: 10, border: 0, background: busy ? "#9CA3AF" : "#0F766E", color: "#fff", fontWeight: 800, fontSize: 14, cursor: busy ? "not-allowed" : "pointer" }}>
            {busy ? "Creating…" : "Create Mock Exam"}
          </button>
        </div>
        {msg && <p style={{ fontSize: 13, marginTop: 8, color: msg.startsWith("Mock") ? "#166534" : "#DC2626" }}>{msg}</p>}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {exams.length === 0 ? (
          <p style={{ fontSize: 13, color: "#5F6E7F", textAlign: "center", padding: 24 }}>No mock exams yet.</p>
        ) : (
          exams.map((e) => (
            <div key={e.id} style={card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#1E242E" }}>{e.title}</div>
                  <div style={{ fontSize: 12, color: "#5F6E7F" }}>
                    Class: {e.className} · {e.durationMinutes} min · Subjects: {e.subjects}
                  </div>
                  <div style={{ fontSize: 12, color: "#5F6E7F" }}>
                    Scheduled: {e.scheduledAt ? new Date(e.scheduledAt).toLocaleString("en-NG", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }) : "No date set"}
                  </div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 999,
                  background: e.status === "active" ? "#DCFCE7" : "#F1F5F9",
                  color: e.status === "active" ? "#166534" : "#5F6E7F" }}>
                  {e.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
