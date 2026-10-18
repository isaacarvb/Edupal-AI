"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SUBJECTS, DEPARTMENTS, COMMON_SUBJECTS, JSS_SUBJECTS } from "@/lib/syllabus";
import { useHiddenSubjects } from "@/components/useHiddenSubjects";

function GlossaryInner() {
  const params = useSearchParams();
  const [subject, setSubject] = useState(params.get("subject") ?? "English");
  const [topics, setTopics] = useState<string[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [terms, setTerms] = useState<Record<string, { term: string; definition: string }[]>>({});
  const hidden = useHiddenSubjects();
  const [department, setDepartment] = useState("");

  useEffect(() => {
    const id = params.get("userId") ?? localStorage.getItem("edupal_user") ?? "";
    if (id) {
      fetch(`/api/topics?userId=${id}`)
        .then((r) => r.json())
        .then((d) => setDepartment(d.profile?.department ?? ""));
    }
  }, [params]);

  useEffect(() => {
    fetch(`/api/glossary?subject=${encodeURIComponent(subject)}`)
      .then((r) => r.json())
      .then((d) => {
        setTopics(d.topics ?? []);
        setTerms({});
        setOpen(null);
      });
  }, [subject]);

  const allowedSubjects = department
    ? [...COMMON_SUBJECTS, ...DEPARTMENTS[department as keyof typeof DEPARTMENTS]]
    : [...JSS_SUBJECTS];
  const visibleSubjects = SUBJECTS.filter((s) => !hidden.includes(s) && allowedSubjects.includes(s));

  async function toggle(topic: string) {
    if (open === topic) return setOpen(null);
    if (!terms[topic]) {
      const d = await fetch(`/api/glossary?subject=${encodeURIComponent(subject)}&topic=${encodeURIComponent(topic)}`).then((r) => r.json());
      setTerms((t) => ({ ...t, [topic]: d.terms ?? [] }));
    }
    setOpen(topic);
  }

  return (
    <main style={{ maxWidth: 680, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <h1 style={{ color: "#1E242E", fontSize: 24 }}>Glossary</h1>
      {department && (
        <div style={{ background: "#F0F9FF", border: "1px solid #BAE6FD", borderRadius: 10, padding: 10, marginBottom: 12, fontSize: 13, color: "#0369A1" }}>
          <strong style={{ display: "block", fontSize: 12, marginBottom: 4, color: "#0c4a6e" }}>📚 {department} department focus</strong>
          You're seeing {department} subjects only. English, Mathematics and Physical Health Education are included for everyone. Other subjects exist but stay hidden so you stay focused on your department.
        </div>
      )}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        {visibleSubjects.map((s) => (
          <button key={s} onClick={() => setSubject(s)}
            style={{ fontSize: 13, fontWeight: 700, padding: "8px 12px", borderRadius: 999, cursor: "pointer",
              background: subject === s ? "#0F766E" : "#fff", color: subject === s ? "#fff" : "#1E242E",
              border: subject === s ? "none" : "1px solid #CBD5E1" }}>
            {s}
          </button>
        ))}
      </div>
      {topics.map((t) => (
        <div key={t} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, marginBottom: 8 }}>
          <button onClick={() => toggle(t)} style={{ width: "100%", textAlign: "left", background: "transparent", border: 0, padding: 14, fontSize: 15, fontWeight: 700, cursor: "pointer", color: "#1E242E" }}>
            {open === t ? "▾" : "▸"} {t}
          </button>
          {open === t && (
            <div style={{ padding: "0 14px 14px" }}>
              {(terms[t] ?? []).map((g) => (
                <div key={g.term} style={{ fontSize: 14, padding: "8px 0", borderTop: "1px solid #E2E8F0" }}>
                  <strong>{g.term}</strong> — {g.definition}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </main>
  );
}

export default function Glossary() {
  return (
    <Suspense fallback={<main style={{ padding: 20 }}>Loading…</main>}>
      <GlossaryInner />
    </Suspense>
  );
}
