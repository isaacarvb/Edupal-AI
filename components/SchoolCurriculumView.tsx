"use client";

import { useEffect, useMemo, useState } from "react";
import { NotesMarkdown } from "@/components/NotesMarkdown";

type SubjectSummary = { name: string; topicCount: number };
type Section = { title: string; subjects: SubjectSummary[] };
type Overview = { className: string; level: "JSS" | "SSS"; hasClassNotes?: boolean; sections: Section[] };
type Topic = {
  id: string;
  name: string;
  class: string;
  learningObjectives: string[];
  notes: string[];
  activities: string[];
  examFocus: string[];
};
type SubjectDetail = { name: string; topics: Topic[]; source?: "class" | "general" };

const JSS_CLASSES = ["JSS1", "JSS2", "JSS3"];
const SSS_CLASSES = ["SSS1", "SSS2", "SSS3"];

const PALETTE = [
  { bg: "#ECFDF5", border: "#A7F3D0", ink: "#065F46", bar: "#10B981" },
  { bg: "#EFF6FF", border: "#BFDBFE", ink: "#1E40AF", bar: "#3B82F6" },
  { bg: "#F5F3FF", border: "#DDD6FE", ink: "#5B21B6", bar: "#8B5CF6" },
  { bg: "#FFF7ED", border: "#FED7AA", ink: "#9A3412", bar: "#F97316" },
  { bg: "#FDF2F8", border: "#FBCFE8", ink: "#9D174D", bar: "#EC4899" },
  { bg: "#F0FDFA", border: "#99F6E4", ink: "#115E59", bar: "#14B8A6" },
  { bg: "#FEFCE8", border: "#FEF08A", ink: "#854D0E", bar: "#EAB308" }
];

// Stable colour per subject name, so a subject keeps its colour everywhere.
function tint(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 9973;
  return PALETTE[h % PALETTE.length];
}

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16 };

const hoverLift = {
  onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.boxShadow = "0 14px 28px -14px rgb(15 118 110 / 0.45)";
    e.currentTarget.style.transform = "translateY(-2px)";
    e.currentTarget.style.borderColor = "#0F766E";
  },
  onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.boxShadow = "none";
    e.currentTarget.style.transform = "none";
    e.currentTarget.style.borderColor = "#E2E8F0";
  }
};

function ClassCard({ name, onOpen }: { name: string; onOpen: () => void }) {
  const senior = name.startsWith("SSS");
  const accent = senior ? "#4F46E5" : "#0F766E";
  const accentSoft = senior ? "#EEF2FF" : "#F0FDFA";
  return (
    <button
      onClick={onOpen}
      style={{
        ...card,
        textAlign: "left",
        cursor: "pointer",
        padding: 0,
        overflow: "hidden",
        transition: "box-shadow 160ms ease, transform 160ms ease, border-color 160ms ease"
      }}
      {...hoverLift}
    >
      <div style={{ height: 6, background: accent }} />
      <div style={{ padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <span style={{ fontSize: 26, fontWeight: 900, color: "#1E242E", letterSpacing: 0.5 }}>{name}</span>
          <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", background: accentSoft, color: accent, border: `1px solid ${accent}33`, borderRadius: 999, padding: "3px 9px" }}>
            {senior ? "Senior" : "Junior"}
          </span>
        </div>
        <div style={{ fontSize: 12, color: "#5F6E7F", marginTop: 4 }}>
          {senior ? "Core + department subjects" : "Core junior subjects"}
        </div>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 10 }}>
          {(senior ? ["Science", "Art", "Commercial"] : ["9 subjects", "Topic notes"]).map((c) => (
            <span key={c} style={{ fontSize: 10, fontWeight: 700, background: "#F8FAFC", color: "#475569", border: "1px solid #E2E8F0", borderRadius: 999, padding: "2px 8px" }}>
              {c}
            </span>
          ))}
        </div>
        <div style={{ marginTop: 14, fontSize: 13, fontWeight: 800, color: accent }}>Open curriculum →</div>
      </div>
    </button>
  );
}

function SubjectTile({ subject, onOpen }: { subject: SubjectSummary; onOpen: () => void }) {
  const c = tint(subject.name);
  const empty = subject.topicCount === 0;
  return (
    <button
      onClick={onOpen}
      style={{
        ...card,
        textAlign: "left",
        cursor: "pointer",
        padding: 14,
        display: "flex",
        alignItems: "center",
        gap: 12,
        transition: "box-shadow 160ms ease, transform 160ms ease, border-color 160ms ease"
      }}
      {...hoverLift}
    >
      <span
        aria-hidden
        style={{
          width: 42,
          height: 42,
          flexShrink: 0,
          borderRadius: 12,
          background: empty ? "#F1F5F9" : c.bg,
          border: `1px solid ${empty ? "#E2E8F0" : c.border}`,
          color: empty ? "#94A3B8" : c.ink,
          fontWeight: 900,
          fontSize: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {subject.name.charAt(0).toUpperCase()}
      </span>
      <span style={{ minWidth: 0, flex: 1 }}>
        <span style={{ display: "block", fontSize: 14, fontWeight: 800, color: "#1E242E", lineHeight: 1.3 }}>{subject.name}</span>
        <span style={{ display: "block", fontSize: 12, color: empty ? "#94A3B8" : c.ink, fontWeight: 700, marginTop: 3 }}>
          {empty ? "Notes coming soon" : `${subject.topicCount} topic${subject.topicCount === 1 ? "" : "s"}`}
        </span>
      </span>
      {!empty && <span style={{ color: "#94A3B8", fontSize: 16 }}>›</span>}
    </button>
  );
}

function Callout({
  emoji,
  title,
  tone,
  children
}: {
  emoji: string;
  title: string;
  tone: "blue" | "amber" | "green";
  children: React.ReactNode;
}) {
  const tones = {
    blue: { bg: "#EFF6FF", border: "#BFDBFE", ink: "#1E3A8A", label: "#1D4ED8" },
    amber: { bg: "#FFFBEB", border: "#FDE68A", ink: "#78350F", label: "#B45309" },
    green: { bg: "#ECFDF5", border: "#A7F3D0", ink: "#064E3B", label: "#047857" }
  }[tone];
  return (
    <section style={{ background: tones.bg, border: `1px solid ${tones.border}`, borderRadius: 14, padding: "12px 14px", margin: "0 0 12px" }}>
      <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 0.8, textTransform: "uppercase", color: tones.label, marginBottom: 6 }}>
        {emoji} {title}
      </div>
      <div style={{ fontSize: 14, color: tones.ink, lineHeight: 1.65 }}>{children}</div>
    </section>
  );
}

// School admins sign in with the school email and only store the school id.
// Teachers store a real user id, so they are resolved by userId instead.
function authQuery(): string {
  const role = typeof window === "undefined" ? "" : localStorage.getItem("edupal_role") ?? "";
  if (role !== "SCHOOL_TEACHER") {
    try {
      const raw = localStorage.getItem("edupal_school");
      const id = raw ? String(JSON.parse(raw)?.id ?? "") : "";
      if (id) return `&schoolId=${encodeURIComponent(id)}`;
    } catch { /* fall through to userId */ }
  }
  return `&userId=${encodeURIComponent(localStorage.getItem("edupal_user") ?? "")}`;
}

const searchBox: React.CSSProperties = {
  width: "100%",
  height: 42,
  borderRadius: 12,
  border: "1px solid #CBD5E1",
  background: "#fff",
  color: "#1E242E",
  padding: "0 14px",
  fontSize: 14,
  outline: "none"
};

const pill: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  borderRadius: 999,
  padding: "6px 12px",
  cursor: "pointer"
};

export default function SchoolCurriculum() {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loadingOverview, setLoadingOverview] = useState(false);
  const [activeSection, setActiveSection] = useState("General");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [subjectDetail, setSubjectDetail] = useState<SubjectDetail | null>(null);
  const [loadingSubject, setLoadingSubject] = useState(false);
  const [openTopic, setOpenTopic] = useState<string | null>(null);
  const [subjectSearch, setSubjectSearch] = useState("");
  const [topicSearch, setTopicSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selectedClass) return;
    setLoadingOverview(true);
    setError("");
    fetch(`/api/school/curriculum?className=${encodeURIComponent(selectedClass)}${authQuery()}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setOverview(d);
        setActiveSection(d.sections?.[0]?.title ?? (d.level === "JSS" ? "Subjects" : "General"));
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load curriculum."))
      .finally(() => setLoadingOverview(false));
  }, [selectedClass]);

  function openClass(name: string) {
    setSelectedClass(name);
    setOverview(null);
    setSelectedSubject(null);
    setSubjectDetail(null);
    setOpenTopic(null);
    setSubjectSearch("");
    setTopicSearch("");
    setError("");
  }

  function openSubject(name: string) {
    if (!selectedClass) return;
    setSelectedSubject(name);
    setSubjectDetail(null);
    setOpenTopic(null);
    setTopicSearch("");
    setLoadingSubject(true);
    setError("");
    fetch(`/api/school/curriculum?className=${encodeURIComponent(selectedClass)}&subject=${encodeURIComponent(name)}${authQuery()}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setSubjectDetail(d.subject);
        setOpenTopic(d.subject?.topics?.[0]?.id ?? null);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load notes."))
      .finally(() => setLoadingSubject(false));
  }

  function backToClasses() {
    setSelectedClass(null);
    setOverview(null);
    setSelectedSubject(null);
    setSubjectDetail(null);
    setOpenTopic(null);
    setSubjectSearch("");
    setTopicSearch("");
    setError("");
  }

  function backToSubjects() {
    setSelectedSubject(null);
    setSubjectDetail(null);
    setOpenTopic(null);
    setTopicSearch("");
    setError("");
  }

  const section = overview?.sections.find((s) => s.title === activeSection) ?? overview?.sections[0];

  const allSubjects = useMemo(() => (overview?.sections ?? []).flatMap((s) => s.subjects), [overview]);
  const subjectsWithNotes = allSubjects.filter((s) => s.topicCount > 0).length;
  const subjectProgress = allSubjects.length > 0 ? Math.round((subjectsWithNotes / allSubjects.length) * 100) : 0;

  const filteredSubjects = useMemo(() => {
    const q = subjectSearch.trim().toLowerCase();
    const list = section?.subjects ?? [];
    return q ? list.filter((s) => s.name.toLowerCase().includes(q)) : list;
  }, [section, subjectSearch]);

  const filteredTopics = useMemo(() => {
    const q = topicSearch.trim().toLowerCase();
    const list = subjectDetail?.topics ?? [];
    return q ? list.filter((t) => t.name.toLowerCase().includes(q) || t.class.toLowerCase().includes(q)) : list;
  }, [subjectDetail, topicSearch]);

  const activeTopic = subjectDetail?.topics.find((t) => t.id === openTopic) ?? null;
  const activeTopicIndex = subjectDetail && activeTopic ? subjectDetail.topics.findIndex((t) => t.id === activeTopic.id) : -1;
  const topicProgress = subjectDetail && subjectDetail.topics.length > 0 && activeTopicIndex >= 0
    ? Math.round(((activeTopicIndex + 1) / subjectDetail.topics.length) * 100)
    : 0;
  const subjectTint = tint(selectedSubject ?? "Curriculum");

  return (
    <main style={{ maxWidth: 1180, margin: 0, padding: 20, color: "#333A45" }}>
      {/* HERO */}
      <section
        style={{
          background: "linear-gradient(135deg, #0F766E 0%, #0E7490 52%, #1D4ED8 100%)",
          borderRadius: 22,
          padding: "24px 26px",
          color: "#fff",
          boxShadow: "0 20px 44px -20px rgb(15 118 110 / 0.55)"
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 1.6, textTransform: "uppercase", color: "#A7F3D0" }}>
          📚 Curriculum library
        </div>
        <h1 style={{ fontSize: 30, margin: "8px 0 6px", lineHeight: 1.15 }}>Curriculum &amp; Notes</h1>
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: "#E6FFFA", maxWidth: 640 }}>
          Every class, every subject, topic by topic — objectives, notes, activities and exam focus in one place.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
          {["JSS1 – SSS3", "Objectives", "Topic notes", "Activities", "Exam focus"].map((c) => (
            <span key={c} style={{ fontSize: 11, fontWeight: 800, background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.32)", borderRadius: 999, padding: "5px 11px" }}>
              {c}
            </span>
          ))}
        </div>
      </section>

      {/* BREADCRUMB */}
      {(selectedClass || selectedSubject) && (
        <div data-noprint style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", margin: "18px 0 0", fontSize: 13 }}>
          <button onClick={backToClasses} style={{ background: "transparent", border: 0, padding: 0, color: "#0F766E", fontWeight: 800, cursor: "pointer", fontSize: 13 }}>
            All classes
          </button>
          <span style={{ color: "#94A3B8" }}>›</span>
          {selectedSubject ? (
            <button onClick={backToSubjects} style={{ background: "transparent", border: 0, padding: 0, color: "#0F766E", fontWeight: 800, cursor: "pointer", fontSize: 13 }}>
              {selectedClass}
            </button>
          ) : (
            <span style={{ fontWeight: 800, color: "#1E242E" }}>{selectedClass}</span>
          )}
          {selectedSubject && (
            <>
              <span style={{ color: "#94A3B8" }}>›</span>
              <span style={{ fontWeight: 800, color: "#1E242E" }}>{selectedSubject}</span>
            </>
          )}
        </div>
      )}

      {error && (
        <p style={{ background: "#FFF1F2", border: "1px solid #FECACA", color: "#B91C1C", borderRadius: 12, padding: "10px 14px", fontSize: 13, margin: "14px 0 0" }}>
          {error}
        </p>
      )}

      {/* CLASS PICKER */}
      {!selectedClass && (
        <>
          <section style={{ marginTop: 24 }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
              <h2 style={{ fontSize: 17, color: "#1E242E", margin: 0 }}>Junior Secondary</h2>
              <span style={{ fontSize: 12, color: "#5F6E7F" }}>JSS1 · JSS2 · JSS3</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 14 }}>
              {JSS_CLASSES.map((c) => <ClassCard key={c} name={c} onOpen={() => openClass(c)} />)}
            </div>
          </section>

          <section style={{ marginTop: 26 }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
              <h2 style={{ fontSize: 17, color: "#1E242E", margin: 0 }}>Senior Secondary</h2>
              <span style={{ fontSize: 12, color: "#5F6E7F" }}>Science · Art · Commercial</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 14 }}>
              {SSS_CLASSES.map((c) => <ClassCard key={c} name={c} onOpen={() => openClass(c)} />)}
            </div>
          </section>
        </>
      )}

      {/* SUBJECT LIST */}
      {selectedClass && !selectedSubject && (
        <section style={{ marginTop: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <h2 style={{ fontSize: 24, color: "#1E242E", margin: 0 }}>{selectedClass}</h2>
            <span style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5, background: overview?.level === "JSS" ? "#F0FDFA" : "#EEF2FF", color: overview?.level === "JSS" ? "#0F766E" : "#4F46E5", border: `1px solid ${overview?.level === "JSS" ? "#99F6E4" : "#C7D2FE"}`, borderRadius: 999, padding: "4px 10px" }}>
              {overview?.level === "JSS" ? "Junior Secondary" : "Senior Secondary"}
            </span>
          </div>

          {!loadingOverview && overview && (
            <div style={{ ...card, padding: 14, marginTop: 14, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 220px", minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#1E242E" }}>
                  {subjectsWithNotes} of {allSubjects.length} subjects have notes
                </div>
                <div style={{ fontSize: 12, color: "#5F6E7F", marginTop: 2 }}>
                  {overview.hasClassNotes
                    ? `${selectedClass}-specific documents are loaded.`
                    : "Showing the general curriculum until class documents are added."}
                </div>
              </div>
              <div style={{ width: 220, height: 10, borderRadius: 999, background: "#E2E8F0", overflow: "hidden" }}>
                <div style={{ width: `${subjectProgress}%`, height: "100%", background: "linear-gradient(90deg,#10B981,#0F766E)" }} />
              </div>
            </div>
          )}

          {loadingOverview && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12, marginTop: 16 }}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} style={{ ...card, padding: 14, height: 72, background: "#F8FAFC" }} />
              ))}
            </div>
          )}

          {!loadingOverview && overview && (
            <>
              {overview.level === "SSS" && overview.sections.length > 1 && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
                  {overview.sections.map((s) => {
                    const active = activeSection === s.title;
                    return (
                      <button
                        key={s.title}
                        onClick={() => setActiveSection(s.title)}
                        style={{
                          ...pill,
                          background: active ? "#0F766E" : "#fff",
                          color: active ? "#fff" : "#1E242E",
                          border: active ? "1px solid #0F766E" : "1px solid #CBD5E1"
                        }}
                      >
                        {s.title} <span style={{ opacity: 0.7, fontWeight: 700 }}>({s.subjects.length})</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {section && (
                <>
                  <p style={{ fontSize: 13, color: "#5F6E7F", margin: "14px 0 10px" }}>
                    {overview.level === "SSS"
                      ? activeSection === "General"
                        ? "General subjects are taken by every senior student."
                        : `${activeSection} department subjects.`
                      : "Pick a subject to read its topics."}
                  </p>

                  <div data-noprint style={{ position: "relative", maxWidth: 420, marginBottom: 12 }}>
                    <span style={{ position: "absolute", left: 13, top: 11, fontSize: 14, color: "#94A3B8" }}>🔍</span>
                    <input
                      value={subjectSearch}
                      onChange={(e) => setSubjectSearch(e.target.value)}
                      placeholder="Search subjects…"
                      aria-label="Search subjects"
                      style={{ ...searchBox, paddingLeft: 36 }}
                    />
                  </div>

                  {filteredSubjects.length === 0 ? (
                    <div style={{ ...card, padding: 24, textAlign: "center", background: "#F8FAFC", borderStyle: "dashed" }}>
                      <p style={{ margin: 0, fontSize: 14, color: "#5F6E7F" }}>No subject matches “{subjectSearch}”.</p>
                    </div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
                      {filteredSubjects.map((s) => (
                        <SubjectTile key={s.name} subject={s} onOpen={() => openSubject(s.name)} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </section>
      )}

      {/* TOPIC VIEW */}
      {selectedClass && selectedSubject && (
        <section style={{ marginTop: 18 }}>
          <div
            style={{
              borderRadius: 18,
              border: `1px solid ${subjectTint.border}`,
              background: `linear-gradient(135deg, ${subjectTint.bg} 0%, #FFFFFF 70%)`,
              padding: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 14,
              flexWrap: "wrap"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
              <span
                aria-hidden
                style={{ width: 52, height: 52, borderRadius: 15, background: subjectTint.bg, border: `1px solid ${subjectTint.border}`, color: subjectTint.ink, fontWeight: 900, fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
              >
                {(subjectDetail?.name ?? selectedSubject).charAt(0).toUpperCase()}
              </span>
              <div style={{ minWidth: 0 }}>
                <h2 style={{ fontSize: 22, color: "#1E242E", margin: 0, lineHeight: 1.2 }}>{subjectDetail?.name ?? selectedSubject}</h2>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginTop: 5, fontSize: 12, color: "#5F6E7F" }}>
                  <span style={{ fontWeight: 800, color: subjectTint.ink }}>{selectedClass}</span>
                  <span>·</span>
                  <span>
                    {subjectDetail ? `${subjectDetail.topics.length} topic${subjectDetail.topics.length === 1 ? "" : "s"}` : "Loading notes…"}
                  </span>
                  {subjectDetail?.source === "class" && (
                    <span style={{ fontSize: 10, fontWeight: 800, background: "#fff", color: "#0F766E", border: "1px solid #99F6E4", borderRadius: 999, padding: "2px 8px" }}>
                      Class notes
                    </span>
                  )}
                  {subjectDetail?.source === "general" && (
                    <span style={{ fontSize: 10, fontWeight: 800, background: "#fff", color: "#475569", border: "1px solid #E2E8F0", borderRadius: 999, padding: "2px 8px" }}>
                      General curriculum
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              data-noprint
              onClick={() => window.print()}
              style={{ background: "#0F766E", color: "#fff", border: 0, borderRadius: 10, padding: "10px 16px", fontWeight: 800, fontSize: 13, cursor: "pointer" }}
            >
              🖨 Print
            </button>
          </div>

          {loadingSubject && <p style={{ fontSize: 14, color: "#5F6E7F", marginTop: 16 }}>Loading notes…</p>}

          {!loadingSubject && subjectDetail && subjectDetail.topics.length === 0 && (
            <div style={{ ...card, background: "#F8FAFC", borderStyle: "dashed", textAlign: "center", padding: 32, marginTop: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#1E242E", marginBottom: 6 }}>Notes for this class are being prepared</div>
              <p style={{ fontSize: 13, color: "#5F6E7F", margin: 0 }}>
                Once the {selectedClass} {subjectDetail.name} document is added, its topics will appear here one by one.
              </p>
            </div>
          )}

          {!loadingSubject && subjectDetail && subjectDetail.topics.length > 0 && (
            <>
              {/* Topic progress */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "16px 0 10px", flexWrap: "wrap" }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#1E242E" }}>
                  Topic {activeTopicIndex + 1} of {subjectDetail.topics.length}
                </div>
                <div style={{ flex: "1 1 180px", height: 8, borderRadius: 999, background: "#E2E8F0", overflow: "hidden" }}>
                  <div style={{ width: `${topicProgress}%`, height: "100%", background: subjectTint.bar }} />
                </div>
              </div>

              {/* Topic tabs */}
              <div
                data-noprint
                role="tablist"
                aria-label="Topics"
                style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 10, WebkitOverflowScrolling: "touch" }}
              >
                {filteredTopics.map((t) => {
                  const active = t.id === openTopic;
                  return (
                    <button
                      key={t.id}
                      role="tab"
                      aria-selected={active}
                      onClick={() => setOpenTopic(t.id)}
                      title={t.name}
                      style={{
                        ...pill,
                        flexShrink: 0,
                        maxWidth: 280,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        background: active ? "#1E242E" : "#fff",
                        color: active ? "#fff" : "#334155",
                        border: active ? "1px solid #1E242E" : "1px solid #CBD5E1"
                      }}
                    >
                      {subjectDetail.topics.findIndex((x) => x.id === t.id) + 1}. {t.name}
                    </button>
                  );
                })}
              </div>

              <div data-noprint style={{ position: "relative", maxWidth: 420, marginBottom: 14 }}>
                <span style={{ position: "absolute", left: 13, top: 11, fontSize: 14, color: "#94A3B8" }}>🔍</span>
                <input
                  value={topicSearch}
                  onChange={(e) => setTopicSearch(e.target.value)}
                  placeholder="Search topics…"
                  aria-label="Search topics"
                  style={{ ...searchBox, paddingLeft: 36 }}
                />
              </div>

              {filteredTopics.length === 0 && (
                <div style={{ ...card, padding: 24, textAlign: "center", background: "#F8FAFC", borderStyle: "dashed" }}>
                  <p style={{ margin: 0, fontSize: 14, color: "#5F6E7F" }}>No topic matches “{topicSearch}”.</p>
                </div>
              )}

              {activeTopic && (
                <article style={{ ...card, padding: 18 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
                    <span style={{ fontSize: 11, fontWeight: 900, color: subjectTint.ink, background: subjectTint.bg, border: `1px solid ${subjectTint.border}`, borderRadius: 8, padding: "3px 8px" }}>
                      Topic {activeTopicIndex + 1}
                    </span>
                    <h3 style={{ fontSize: 20, color: "#1E242E", margin: 0, lineHeight: 1.3 }}>{activeTopic.name}</h3>
                    {activeTopic.class && (
                      <span style={{ fontSize: 11, fontWeight: 800, background: "#F1F5F9", color: "#475569", borderRadius: 999, padding: "3px 9px" }}>
                        {activeTopic.class}
                      </span>
                    )}
                  </div>

                  {activeTopic.learningObjectives.length > 0 && (
                    <Callout emoji="🎯" title="Learning objectives" tone="blue">
                      <ul style={{ margin: 0, paddingLeft: 20 }}>
                        {activeTopic.learningObjectives.map((o, i) => <li key={i} style={{ marginBottom: 4 }}>{o}</li>)}
                      </ul>
                    </Callout>
                  )}

                  {activeTopic.notes.length > 0 && (
                    <section style={{ margin: "0 0 12px" }}>
                      <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 0.8, textTransform: "uppercase", color: "#0F766E", marginBottom: 6 }}>
                        📖 Notes
                      </div>
                      <div style={{ background: "#FCFDFD", border: "1px solid #E2E8F0", borderRadius: 14, padding: "14px 16px" }}>
                        {activeTopic.notes.map((n, i) => <NotesMarkdown key={i} text={n} />)}
                      </div>
                    </section>
                  )}

                  {activeTopic.notes.length === 0 && activeTopic.learningObjectives.length === 0 && (
                    <p style={{ fontSize: 14, color: "#5F6E7F", margin: 0 }}>Notes for this topic are being prepared.</p>
                  )}

                  {activeTopic.activities.length > 0 && (
                    <Callout emoji="✏️" title="Activities" tone="amber">
                      <ul style={{ margin: 0, paddingLeft: 20 }}>
                        {activeTopic.activities.map((a, i) => <li key={i} style={{ marginBottom: 4 }}>{a}</li>)}
                      </ul>
                    </Callout>
                  )}

                  {activeTopic.examFocus.length > 0 && (
                    <Callout emoji="🏆" title="Exam focus" tone="green">
                      <ul style={{ margin: 0, paddingLeft: 20 }}>
                        {activeTopic.examFocus.map((e, i) => <li key={i} style={{ marginBottom: 4 }}>{e}</li>)}
                      </ul>
                    </Callout>
                  )}

                  <div data-noprint style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: 16, paddingTop: 14, borderTop: "1px solid #E2E8F0" }}>
                    <button
                      onClick={() => {
                        const prev = subjectDetail.topics[activeTopicIndex - 1];
                        if (prev) { setOpenTopic(prev.id); window.scrollTo({ top: 0, behavior: "smooth" }); }
                      }}
                      disabled={activeTopicIndex <= 0}
                      style={{ background: "#fff", color: activeTopicIndex <= 0 ? "#94A3B8" : "#0F766E", border: "1px solid #CBD5E1", borderRadius: 10, padding: "10px 14px", fontWeight: 800, fontSize: 13, cursor: activeTopicIndex <= 0 ? "not-allowed" : "pointer" }}
                    >
                      ← Previous topic
                    </button>
                    <button
                      onClick={() => {
                        const next = subjectDetail.topics[activeTopicIndex + 1];
                        if (next) { setOpenTopic(next.id); window.scrollTo({ top: 0, behavior: "smooth" }); }
                      }}
                      disabled={activeTopicIndex >= subjectDetail.topics.length - 1}
                      style={{ background: activeTopicIndex >= subjectDetail.topics.length - 1 ? "#F1F5F9" : "#0F766E", color: activeTopicIndex >= subjectDetail.topics.length - 1 ? "#94A3B8" : "#fff", border: activeTopicIndex >= subjectDetail.topics.length - 1 ? "1px solid #E2E8F0" : "1px solid #0F766E", borderRadius: 10, padding: "10px 14px", fontWeight: 800, fontSize: 13, cursor: activeTopicIndex >= subjectDetail.topics.length - 1 ? "not-allowed" : "pointer" }}
                    >
                      Next topic →
                    </button>
                  </div>
                </article>
              )}
            </>
          )}
        </section>
      )}

      <style>{`
        @media print {
          aside, nav, [data-noprint] { display: none !important; }
          main { max-width: 100% !important; padding: 0 !important; }
          section, article { box-shadow: none !important; break-inside: avoid; }
        }
      `}</style>
    </main>
  );
}
