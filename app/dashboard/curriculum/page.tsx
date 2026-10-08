"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SUBJECTS, SYLLABUS, JSS_SUBJECTS, JSS_SYLLABUS } from "@/lib/syllabus";

type Term = { term: string; definition: string };

function CurriculumInner() {
  const params = useSearchParams();
  const [userId, setUserId] = useState("");
  const [tier, setTier] = useState<"jss" | "senior" | "uni">("senior");
  const [openSub, setOpenSub] = useState<string | null>(null);
  const [openTopic, setOpenTopic] = useState<string | null>(null);
  const [terms, setTerms] = useState<Term[]>([]);

  useEffect(() => {
    setUserId(params.get("userId") ?? localStorage.getItem("edupal_user") ?? "");
  }, [params]);

  const subjects: string[] = tier === "jss" ? [...JSS_SUBJECTS] : [...SUBJECTS];
  const topicsOf = (s: string) =>
    tier === "jss" ? JSS_SYLLABUS[s] ?? [] : (SYLLABUS as Record<string, string[]>)[s] ?? [];

  async function openNote(subject: string, topic: string) {
    const key = `${subject}::${topic}`;
    if (openTopic === key) return setOpenTopic(null);
    if (tier === "jss") {
      const { JSS_GLOSSARY } = await import("@/lib/syllabus");
      setTerms(JSS_GLOSSARY[subject]?.[topic] ?? []);
    } else {
      const d = await fetch(`/api/glossary?subject=${encodeURIComponent(subject)}&topic=${encodeURIComponent(topic)}`).then((r) => r.json());
      setTerms(d.terms ?? []);
    }
    setOpenTopic(key);
  }

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <h1 style={{ color: "#1E242E", fontSize: 24 }}>Curriculum &amp; Notes</h1>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {([["jss", "Junior Secondary"], ["senior", "Senior Secondary"], ["uni", "University"]] as const).map(([v, label]) => (
          <button key={v} onClick={() => v !== "uni" && (setTier(v), setOpenSub(null), setOpenTopic(null))}
            disabled={v === "uni"}
            style={{ fontSize: 14, fontWeight: 700, padding: "10px 18px", borderRadius: 999, cursor: v === "uni" ? "not-allowed" : "pointer",
              background: tier === v ? "#0F766E" : "#fff", color: tier === v ? "#fff" : "#1E242E",
              border: tier === v ? "none" : "1px solid #CBD5E1", opacity: v === "uni" ? 0.6 : 1 }}>
            {label} {v === "uni" && <span style={{ fontSize: 11, background: "#F59E0B", color: "#422006", padding: "2px 8px", borderRadius: 999 }}>Coming Soon</span>}
          </button>
        ))}
      </div>
      {subjects.map((s) => (
        <div key={s} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, marginBottom: 8 }}>
          <button onClick={() => setOpenSub(openSub === s ? null : s)}
            style={{ width: "100%", textAlign: "left", background: "transparent", border: 0, padding: 14, fontSize: 16, fontWeight: 700, cursor: "pointer", color: "#1E242E" }}>
            {openSub === s ? "▾" : "▸"} {s}
          </button>
          {openSub === s && (
            <div style={{ padding: "0 14px 14px" }}>
              {topicsOf(s).map((t) => {
                const key = `${s}::${t}`;
                const viewing = openTopic === key;
                return (
                  <div key={t} style={{ borderTop: "1px solid #E2E8F0", padding: "8px 0" }}>
                    <button onClick={() => openNote(s, t)} style={{ background: "transparent", border: 0, fontSize: 14, fontWeight: 600, color: "#0F766E", cursor: "pointer" }}>
                      {viewing ? "▾" : "▸"} {t}
                    </button>
                    {viewing && (
                      <div style={{ background: "#F8FAFC", borderRadius: 10, padding: 12, marginTop: 8 }}>
                        <p style={{ fontSize: 12, color: "#5F6E7F", margin: "0 0 8px" }}>Key points {tier === "jss" ? "(junior syllabus)" : "(full study notes arrive with teacher uploads)"}:</p>
                        {terms.length === 0 && <p style={{ fontSize: 14 }}>Notes for this topic are being written — check back soon.</p>}
                        {terms.map((g) => (
                          <div key={g.term} style={{ fontSize: 14, padding: "6px 0", borderTop: "1px solid #E2E8F0" }}>
                            <strong>{g.term}</strong> — {g.definition}
                          </div>
                        ))}
                        <a href={tier === "jss" ? `/tutor?userId=${userId}` : `/practice?userId=${userId}&subject=${encodeURIComponent(s)}`}
                          style={{ display: "block", textAlign: "center", background: "#0F766E", color: "#fff", borderRadius: 10, height: 44, lineHeight: "44px", fontWeight: 700, fontSize: 14, textDecoration: "none", marginTop: 10 }}>
                          Practice This Topic
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </main>
  );
}

export default function Curriculum() {
  return (
    <Suspense fallback={<main style={{ padding: 20 }}>Loading…</main>}>
      <CurriculumInner />
    </Suspense>
  );
}
