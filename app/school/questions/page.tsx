"use client";
import { useEffect, useState } from "react";

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, margin: "0 0 12px" };

type QuestionRow = { id: string; subject: string; topic: string; type: string; stem: string; answer: string };

export default function SchoolQuestions() {
  const [userId, setUserId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("edupal_user");
    setUserId(id);
    if (!id) return;
    // Browse questions from the question bank (all subjects, school-scoped)
    fetch(`/api/questions?userId=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.questions) setQuestions(d.questions.map((q: any) => ({
          id: q.id,
          subject: q.subject,
          topic: q.topic,
          type: q.type,
          stem: q.stem,
          answer: q.answer_key
        })));
      });
  }, []);

  const subjects = [...new Set(questions.map((q) => q.subject))].sort();
  const filtered = questions.filter((q) =>
    q.subject.toLowerCase().includes(search.toLowerCase()) ||
    q.topic.toLowerCase().includes(search.toLowerCase()) &&
    (!subjectFilter || q.subject === subjectFilter)
  );

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <h1 style={{ fontSize: 24, margin: 0 }}>Questions & Assessments</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} style={{ height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px" }}>
            <option value="">All Subjects</option>
            {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search questions…"
            style={{ flex: 1, height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px" }} />
        </div>
      </div>

      <div style={card}>
        <p style={{ fontSize: 13, color: "#5F6E7F", margin: "0 0 12px" }}>
          Browse the school question bank. Questions are sourced from past exams and curated content.
        </p>
        {filtered.length > 0 ? (
          <div style={{ maxHeight: 600, overflow: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ textAlign: "left", color: "#5F6E7F", fontSize: 11, borderBottom: "2px solid #F1F5F9" }}>
                  <th style={{ padding: "10px 12px", textAlign: "left" }}>Subject</th>
                  <th style={{ padding: "10px 12px", textAlign: "left" }}>Topic</th>
                  <th style={{ padding: "10px 12px", textAlign: "left" }}>Question</th>
                  <th style={{ padding: "10px 12px" }}>Type</th>
                  <th style={{ padding: "10px 12px" }}>Answer</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((q) => (
                  <tr key={q.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                    <td style={{ padding: "10px 12px", fontWeight: 700 }}>{q.subject}</td>
                    <td style={{ padding: "10px 12px", fontSize: 12 }}>{q.topic}</td>
                    <td style={{ padding: "10px 12px", fontSize: 12 }}>{q.stem}</td>
                    <td style={{ padding: "10px 12px" }}>{q.type}</td>
                    <td style={{ padding: "10px 12px", fontSize: 11, color: "#5F6E7F" }}>{q.answer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ fontSize: 13, color: "#94A3B8", margin: 0, textAlign: "center" }}>
            No questions found.
          </p>
        )}
      </div>
    </main>
  );
}
