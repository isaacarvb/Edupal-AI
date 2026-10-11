"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SUBJECTS, SYLLABUS, JSS_SUBJECTS, JSS_SYLLABUS } from "@/lib/syllabus";

type Note = { topic: string; content: string };
type Term = { term: string; definition: string };

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function inline(s: string): string {
  return esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

// Minimal markdown: headings, bullets (nested by indent), numbered items, paragraphs.
function renderNote(src: string): string {
  const out: string[] = [];
  for (const raw of src.split("\n")) {
    const line = raw.replace(/\s+$/, "");
    if (!line.trim()) continue;
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      out.push(`<div style="font-weight:800;color:#1E242E;font-size:15px;margin:10px 0 4px">${inline(h[2])}</div>`);
      continue;
    }
    const b = line.match(/^(\s*)[-*•]\s+(.*)$/);
    if (b) {
      const indent = Math.min(Math.floor(b[1].replace(/\t/g, "  ").length / 2), 3) * 16;
      out.push(`<div style="margin:3px 0 3px ${indent}px">• ${inline(b[2])}</div>`);
      continue;
    }
    const n = line.match(/^\s*\d+[.)]\s+(.*)$/);
    if (n) {
      out.push(`<div style="margin:3px 0 3px 16px">${inline(line.trim())}</div>`);
      continue;
    }
    out.push(`<p style="margin:6px 0">${inline(line.trim())}</p>`);
  }
  return out.join("");
}

function CurriculumInner() {
  const params = useSearchParams();
  const [userId, setUserId] = useState("");
  const [tier, setTier] = useState<"jss" | "senior" | "uni">("senior");
  const [openSub, setOpenSub] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [openTopic, setOpenTopic] = useState<string | null>(null);
  const [terms, setTerms] = useState<Term[]>([]);
  const [plan, setPlan] = useState("FREE");

  useEffect(() => {
    const id = params.get("userId") ?? localStorage.getItem("edupal_user") ?? "";
    setUserId(id);
    if (id) {
      fetch(`/api/topics?userId=${id}`)
        .then((r) => r.json())
        .then((d) => setPlan(d.profile?.plan ?? "FREE"));
    }
  }, [params]);

  const subjects: string[] = tier === "jss" ? [...JSS_SUBJECTS] : [...SUBJECTS];

  async function toggleSub(s: string) {
    if (openSub === s) {
      setOpenSub(null);
      return;
    }
    setOpenSub(s);
    setOpenTopic(null);
    setNotes([]);
    setLoadingNotes(true);
    try {
      const d = await fetch(`/api/notes?level=${tier === "jss" ? "junior" : "senior"}&subject=${encodeURIComponent(s)}`).then((r) => r.json());
      setNotes(d.topics ?? []);
    } finally {
      setLoadingNotes(false);
    }
  }

  async function openNote(subject: string, topic: string) {
    const key = `${subject}::${topic}`;
    if (openTopic === key) return setOpenTopic(null);
    setOpenTopic(key);
    // Glossary terms still ride along as fast-revision companions.
    try {
      if (tier === "jss") {
        const { JSS_GLOSSARY } = await import("@/lib/syllabus");
        setTerms(JSS_GLOSSARY[subject]?.[topic] ?? []);
      } else {
        const d = await fetch(`/api/glossary?subject=${encodeURIComponent(subject)}&topic=${encodeURIComponent(topic)}`).then((r) => r.json());
        setTerms(d.terms ?? []);
      }
    } catch {
      setTerms([]);
    }
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
          <button onClick={() => toggleSub(s)}
            style={{ width: "100%", textAlign: "left", background: "transparent", border: 0, padding: 14, fontSize: 16, fontWeight: 700, cursor: "pointer", color: "#1E242E" }}>
            {openSub === s ? "▾" : "▸"} {s}
          </button>
          {openSub === s && (
            <div style={{ padding: "0 14px 14px" }}>
              {loadingNotes && <p style={{ fontSize: 14 }}>Loading notes…</p>}
              {!loadingNotes && notes.length === 0 && <p style={{ fontSize: 14 }}>Notes for this subject are being written — check back soon.</p>}
              {notes.map((n, ni) => {
                const key = `${s}::${n.topic}`;
                const viewing = openTopic === key;
                const locked = plan !== "UNLIMITED" && ni > 0;
                return (
                  <div key={n.topic} style={{ borderTop: "1px solid #E2E8F0", padding: "8px 0" }}>
                    <button onClick={() => !locked && openNote(s, n.topic)} style={{ background: "transparent", border: 0, fontSize: 14, fontWeight: 600, color: locked ? "#94A3B8" : "#0F766E", cursor: locked ? "not-allowed" : "pointer" }}>
                      {locked ? "🔒" : viewing ? "▾" : "▸"} {n.topic}
                    </button>
                    {locked ? (
                      <p style={{ fontSize: 13, margin: "4px 0 0" }}>Locked — <a href={userId ? `/subscription?userId=${userId}` : "/signup"} style={{ color: "#0F766E", fontWeight: 700 }}>upgrade to unlock all topics</a></p>
                    ) : viewing && (
                      <div style={{ background: "#F8FAFC", borderRadius: 10, padding: 12, marginTop: 8 }}>
                        <div dangerouslySetInnerHTML={{ __html: renderNote(n.content) }} />
                        {terms.length > 0 && (
                          <div style={{ marginTop: 10, paddingTop: 8, borderTop: "1px dashed #CBD5E1" }}>
                            <div style={{ fontSize: 12, fontWeight: 800, color: "#5F6E7F" }}>FAST REVISION — KEY TERMS</div>
                            {terms.map((g) => (
                              <div key={g.term} style={{ fontSize: 13, padding: "4px 0" }}>
                                <strong>{g.term}</strong> — {g.definition}
                              </div>
                            ))}
                          </div>
                        )}
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
