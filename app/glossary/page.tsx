"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SUBJECTS } from "@/lib/syllabus";

function GlossaryInner() {
  const params = useSearchParams();
  const [subject, setSubject] = useState(params.get("subject") ?? "English");
  const [topics, setTopics] = useState<string[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [terms, setTerms] = useState<Record<string, { term: string; definition: string }[]>>({});

  useEffect(() => {
    fetch(`/api/glossary?subject=${encodeURIComponent(subject)}`)
      .then((r) => r.json())
      .then((d) => {
        setTopics(d.topics ?? []);
        setTerms({});
        setOpen(null);
      });
  }, [subject]);

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
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        {SUBJECTS.map((s) => (
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
