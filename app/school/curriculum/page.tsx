"use client";

import { useEffect, useState } from "react";
import { NotesMarkdown } from "@/components/NotesMarkdown";

type SubjectSummary = { name: string; topicCount: number };
type Section = { title: string; subjects: SubjectSummary[] };
type Overview = { className: string; level: "JSS" | "SSS"; sections: Section[] };
type Topic = {
  id: string;
  name: string;
  class: string;
  learningObjectives: string[];
  notes: string[];
  activities: string[];
  examFocus: string[];
};
type SubjectDetail = { name: string; topics: Topic[] };

const JSS_CLASSES = ["JSS1", "JSS2", "JSS3"];
const SSS_CLASSES = ["SSS1", "SSS2", "SSS3"];
const DEPARTMENTS = ["General", "Science", "Art", "Commercial"];

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, padding: 16 };

function classCard(name: string, onOpen: () => void, chips?: string[]) {
  return (
    <button
      key={name}
      onClick={onOpen}
      style={{
        ...card,
        textAlign: "left",
        cursor: "pointer",
        transition: "box-shadow 150ms ease, border-color 150ms ease"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 6px 18px -6px rgb(15 118 110 / 0.35)";
        e.currentTarget.style.borderColor = "#0F766E";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = "#E2E8F0";
      }}
    >
      <div style={{ fontSize: 22, fontWeight: 800, color: "#1E242E", marginBottom: 4 }}>{name}</div>
      <div style={{ fontSize: 12, color: "#5F6E7F", marginBottom: chips ? 8 : 0 }}>
        {name.startsWith("JSS") ? "Junior Secondary" : "Senior Secondary"}
      </div>
      {chips && (
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {chips.map((c) => (
            <span key={c} style={{ fontSize: 10, fontWeight: 700, background: "#F0FDFA", color: "#0F766E", border: "1px solid #99F6E4", borderRadius: 999, padding: "2px 7px" }}>
              {c}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}

export default function SchoolCurriculum() {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loadingOverview, setLoadingOverview] = useState(false);
  const [activeSection, setActiveSection] = useState("General");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [subjectDetail, setSubjectDetail] = useState<SubjectDetail | null>(null);
  const [loadingSubject, setLoadingSubject] = useState(false);
  const [openTopic, setOpenTopic] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selectedClass) return;
    setLoadingOverview(true);
    setError("");
    fetch(`/api/school/curriculum?className=${encodeURIComponent(selectedClass)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setOverview(d);
        setActiveSection(d.level === "JSS" ? "Subjects" : "General");
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
    setError("");
  }

  function openSubject(name: string) {
    if (!selectedClass) return;
    setSelectedSubject(name);
    setSubjectDetail(null);
    setOpenTopic(null);
    setLoadingSubject(true);
    setError("");
    fetch(`/api/school/curriculum?className=${encodeURIComponent(selectedClass)}&subject=${encodeURIComponent(name)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setSubjectDetail(d.subject);
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
    setError("");
  }

  function backToSubjects() {
    setSelectedSubject(null);
    setSubjectDetail(null);
    setOpenTopic(null);
    setError("");
  }

  const section = overview?.sections.find((s) => s.title === activeSection) ?? overview?.sections[0];

  return (
    <main style={{ maxWidth: 1180, margin: 0, padding: 20, color: "#333A45" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ color: "#1E242E", fontSize: 24, margin: 0 }}>Curriculum &amp; Notes</h1>
          <p style={{ fontSize: 13, color: "#5F6E7F", margin: "4px 0 0" }}>
            Class-by-class notes for every subject in your school.
          </p>
        </div>
        {selectedClass && (
          <button
            onClick={backToClasses}
            style={{ background: "transparent", border: "1px solid #CBD5E1", color: "#0F766E", fontWeight: 700, fontSize: 13, borderRadius: 999, padding: "8px 14px", cursor: "pointer" }}
          >
            All Classes
          </button>
        )}
      </div>

      {error && (
        <p style={{ background: "#FFF1F2", border: "1px solid #FECACA", color: "#B91C1C", borderRadius: 10, padding: "10px 12px", fontSize: 13 }}>
          {error}
        </p>
      )}

      {/* Class picker */}
      {!selectedClass && (
        <>
          <section style={{ marginTop: 22 }}>
            <h2 style={{ fontSize: 16, color: "#1E242E", margin: "0 0 10px" }}>Junior Secondary</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
              {JSS_CLASSES.map((c) => classCard(c, () => openClass(c)))}
            </div>
          </section>

          <section style={{ marginTop: 24 }}>
            <h2 style={{ fontSize: 16, color: "#1E242E", margin: "0 0 10px" }}>Senior Secondary</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
              {SSS_CLASSES.map((c) => classCard(c, () => openClass(c), ["Science", "Art", "Commercial"]))}
            </div>
          </section>
        </>
      )}

      {/* Subject list for the chosen class */}
      {selectedClass && !selectedSubject && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", margin: "18px 0 12px" }}>
            <h2 style={{ fontSize: 20, color: "#1E242E", margin: 0 }}>{selectedClass}</h2>
            <span style={{ fontSize: 12, fontWeight: 700, background: "#F0FDFA", color: "#0F766E", border: "1px solid #99F6E4", borderRadius: 999, padding: "3px 9px" }}>
              {overview?.level === "JSS" ? "Junior Secondary" : "Senior Secondary"}
            </span>
          </div>

          {loadingOverview && <p style={{ fontSize: 14, color: "#5F6E7F" }}>Loading subjects…</p>}

          {!loadingOverview && overview && (
            <>
              {overview.level === "SSS" && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                  {DEPARTMENTS.map((d) => (
                    <button
                      key={d}
                      onClick={() => setActiveSection(d)}
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        padding: "8px 16px",
                        borderRadius: 999,
                        cursor: "pointer",
                        background: activeSection === d ? "#0F766E" : "#fff",
                        color: activeSection === d ? "#fff" : "#1E242E",
                        border: activeSection === d ? "1px solid #0F766E" : "1px solid #CBD5E1"
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              )}

              {section && (
                <>
                  {overview.level === "SSS" && (
                    <p style={{ fontSize: 13, color: "#5F6E7F", margin: "0 0 10px" }}>
                      {activeSection === "General"
                        ? "General subjects are taken by every senior student."
                        : `${activeSection} department subjects.`}
                    </p>
                  )}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
                    {section.subjects.map((s) => (
                      <button
                        key={s.name}
                        onClick={() => openSubject(s.name)}
                        style={{
                          ...card,
                          textAlign: "left",
                          cursor: "pointer",
                          transition: "box-shadow 150ms ease, border-color 150ms ease"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = "0 6px 18px -6px rgb(15 118 110 / 0.35)";
                          e.currentTarget.style.borderColor = "#0F766E";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = "none";
                          e.currentTarget.style.borderColor = "#E2E8F0";
                        }}
                      >
                        <div style={{ fontSize: 15, fontWeight: 800, color: "#1E242E", marginBottom: 6 }}>{s.name}</div>
                        <div style={{ fontSize: 12, color: s.topicCount > 0 ? "#0F766E" : "#94A3B8", fontWeight: 700 }}>
                          {s.topicCount > 0 ? `${s.topicCount} topic${s.topicCount === 1 ? "" : "s"}` : "Notes coming soon"}
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}

      {/* Topic-by-topic notes */}
      {selectedClass && selectedSubject && (
        <>
          <button
            onClick={backToSubjects}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: 0, color: "#0F766E", fontWeight: 700, fontSize: 14, cursor: "pointer", margin: "18px 0 10px", padding: 0 }}
          >
            ← Back to {selectedClass} subjects
          </button>

          <h2 style={{ fontSize: 20, color: "#1E242E", margin: "0 0 4px" }}>{subjectDetail?.name ?? selectedSubject}</h2>
          <p style={{ fontSize: 13, color: "#5F6E7F", margin: "0 0 14px" }}>
            {selectedClass} · {subjectDetail ? `${subjectDetail.topics.length} topic${subjectDetail.topics.length === 1 ? "" : "s"}` : "Loading notes…"}
          </p>

          {loadingSubject && <p style={{ fontSize: 14, color: "#5F6E7F" }}>Loading notes…</p>}

          {!loadingSubject && subjectDetail && subjectDetail.topics.length === 0 && (
            <div style={{ ...card, background: "#F8FAFC", border: "1px dashed #CBD5E1", textAlign: "center", padding: 28 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#1E242E", marginBottom: 6 }}>Notes for this class are being prepared</div>
              <p style={{ fontSize: 13, color: "#5F6E7F", margin: 0 }}>
                Once the {selectedClass} {subjectDetail.name} document is added, its topics will appear here one by one.
              </p>
            </div>
          )}

          {!loadingSubject &&
            subjectDetail?.topics.map((t, idx) => {
              const open = openTopic === t.id;
              return (
                <div key={t.id} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 14, margin: "8px 0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                    <div style={{ minWidth: 0 }}>
                      <strong style={{ fontSize: 15, color: "#1E242E" }}>
                        {idx + 1}. {t.name}
                      </strong>
                      {t.class && (
                        <span style={{ fontSize: 11, fontWeight: 800, background: "#F1F5F9", color: "#0F766E", borderRadius: 6, padding: "2px 8px", marginLeft: 8 }}>
                          {t.class}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setOpenTopic(open ? null : t.id)}
                      aria-expanded={open}
                      style={{
                        background: open ? "#0F766E" : "#E6F4F1",
                        color: open ? "#fff" : "#0F766E",
                        border: "1px solid #0F766E",
                        borderRadius: 999,
                        padding: "7px 14px",
                        fontSize: 13,
                        fontWeight: 800,
                        cursor: "pointer",
                        flexShrink: 0
                      }}
                    >
                      {open ? "Close ▴" : "View ▾"}
                    </button>
                  </div>

                  {open && (
                    <div style={{ background: "#F8FAFC", borderRadius: 10, padding: 16, marginTop: 12, border: "1px solid #E2E8F0" }}>
                      {t.learningObjectives.length > 0 && (
                        <>
                          <div style={{ fontSize: 12, fontWeight: 800, color: "#5F6E7F", marginBottom: 6 }}>🎯 Learning Objectives</div>
                          <ul style={{ margin: "0 0 10px 0", paddingLeft: 20, fontSize: 14, color: "#333A45", lineHeight: 1.6 }}>
                            {t.learningObjectives.map((o, i) => (
                              <li key={i} style={{ marginBottom: 4 }}>{o}</li>
                            ))}
                          </ul>
                        </>
                      )}
                      {t.notes.length > 0 && (
                        <>
                          <div style={{ fontSize: 12, fontWeight: 800, color: "#5F6E7F", margin: "10px 0 4px" }}>📖 Notes</div>
                          {t.notes.map((n, i) => (
                            <NotesMarkdown key={i} text={n} />
                          ))}
                        </>
                      )}
                      {t.notes.length === 0 && t.learningObjectives.length === 0 && (
                        <p style={{ fontSize: 14, color: "#5F6E7F", margin: 0 }}>Notes for this topic are being prepared.</p>
                      )}
                      {t.activities.length > 0 && (
                        <>
                          <div style={{ fontSize: 12, fontWeight: 800, color: "#5F6E7F", margin: "10px 0 6px" }}>✏️ Activities</div>
                          <ul style={{ margin: "0 0 10px 0", paddingLeft: 20, fontSize: 14, color: "#333A45", lineHeight: 1.6 }}>
                            {t.activities.map((a, i) => (
                              <li key={i} style={{ marginBottom: 4 }}>{a}</li>
                            ))}
                          </ul>
                        </>
                      )}
                      {t.examFocus.length > 0 && (
                        <>
                          <div style={{ fontSize: 12, fontWeight: 800, color: "#5F6E7F", margin: "10px 0 6px" }}>🏆 Exam Focus</div>
                          <ul style={{ margin: "0 0 4px 0", paddingLeft: 20, fontSize: 14, color: "#333A45", lineHeight: 1.6 }}>
                            {t.examFocus.map((e, i) => (
                              <li key={i} style={{ marginBottom: 4 }}>{e}</li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
        </>
      )}
    </main>
  );
}
