"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useHiddenSubjects } from "@/components/useHiddenSubjects";
import { DEPARTMENTS, DEPARTMENT_NAMES, JSS_SUBJECTS, SSS_SUBJECTS } from "@/lib/syllabus";

const input: React.CSSProperties = { width: "100%", height: 48, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px", fontSize: 16, margin: "6px 0 12px", boxSizing: "border-box" };
const group: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 16, marginBottom: 12 };

type CSubject = { id: string; name: string; level: "SSS" | "JSS"; exams: string[]; topics: any[] };
type CTopic = { id: string; name: string; class: string; subject: string; level: string; exams: string[]; subjectId: string; learningObjectives: string[]; notes: string[]; activities: string[]; examFocus: string[]; source: string };

function CurriculumInner() {
  const params = useSearchParams();
  const [userId, setUserId] = useState("");
  const [tier, setTier] = useState<"jss" | "senior">("senior");
  const [department, setDepartment] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<CSubject | null>(null);
  const [openTopic, setOpenTopic] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<CSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const hidden = useHiddenSubjects();

  useEffect(() => {
    setUserId(params.get("userId") ?? localStorage.getItem("edupal_user") ?? "");
  }, [params]);

  // Load all curriculum subjects from API
  useEffect(() => {
    setLoading(true);
    fetch("/api/curriculum")
      .then((r) => r.json())
      .then((d) => {
        setSubjects(d.subjects ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Allowed subjects for current tier + department
  const allowedSubjects = (() => {
    if (tier === "jss") return [...JSS_SUBJECTS];
    if (department) return [...DEPARTMENTS[department as keyof typeof DEPARTMENTS]];
    return [...SSS_SUBJECTS];
  })();

  const tierSubjects = subjects.filter(
    (s) =>
      (tier === "jss" ? s.level === "JSS" : s.level === "SSS") &&
      allowedSubjects.includes(s.name) &&
      !hidden.includes(s.name)
  );

  function selectSubject(s: CSubject) {
    setSelectedSubject(s);
    setOpenTopic(null);
  }

  function topicAllowedInDept(topicName: string): boolean {
    if (tier === "jss") return true;
    if (!department) return true;
    return allowedSubjects.includes(topicName);
  }

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <h1 style={{ color: "#1E242E", fontSize: 24 }}>Curriculum &amp; Notes</h1>

      {/* Tier selector */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {(["jss", "senior"] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setTier(t); setDepartment(null); setSelectedSubject(null); }}
            style={{
              fontSize: 14,
              fontWeight: 700,
              padding: "10px 18px",
              borderRadius: 999,
              cursor: "pointer",
              background: tier === t ? "#0F766E" : "#fff",
              color: tier === t ? "#fff" : "#1E242E",
              border: tier === t ? "none" : "1px solid #CBD5E1"
            }}
          >
            {t === "jss" ? "Junior Secondary" : "Senior Secondary"}
          </button>
        ))}
      </div>

      {/* Department selector (senior only) */}
      {tier === "senior" && (
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 13, fontWeight: 700, marginBottom: 6, display: "block" }}>Department</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {DEPARTMENT_NAMES.map((d) => (
              <button
                key={d}
                onClick={() => { setDepartment(d); setSelectedSubject(null); }}
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  padding: "8px 14px",
                  borderRadius: 999,
                  cursor: "pointer",
                  background: department === d ? "#0F766E" : "#fff",
                  color: department === d ? "#fff" : "#1E242E",
                  border: department === d ? "none" : "1px solid #CBD5E1"
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <p style={{ fontSize: 14, color: "#5F6E7F" }}>Loading subjects…</p>
      ) : selectedSubject ? (
        // ---------- Topic view ----------
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 420px", minWidth: 0 }}>
            <button
              onClick={() => setSelectedSubject(null)}
              style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: 0, color: "#0F766E", fontWeight: 700, fontSize: 14, cursor: "pointer", marginBottom: 12 }}
            >
              ← {selectedSubject.name}
            </button>
            <h2 style={{ fontSize: 20, color: "#1E242E", margin: "0 0 12px" }}>{selectedSubject.name}</h2>
            <p style={{ fontSize: 13, color: "#5F6E7F" }}>{selectedSubject.topics.length} topics available</p>

            {selectedSubject.topics.map((t) => (
              <div key={t.id} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 12, margin: "8px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <div>
                    <strong style={{ fontSize: 15 }}>{t.name}</strong>
                    {t.class && <span style={{ fontSize: 11, fontWeight: 800, background: "#F1F5F9", color: "#0F766E", borderRadius: 6, padding: "2px 8px", marginLeft: 8 }}>{t.class}</span>}
                    {t.source !== "md" && <span style={{ fontSize: 10, fontWeight: 800, background: "#E2E8F0", color: "#5F6E7F", borderRadius: 6, padding: "2px 8px", marginLeft: 6 }}>{t.source}</span>}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setOpenTopic(t.id); }}
                    style={{ background: "transparent", border: 0, color: "#0F766E", fontSize: 12, fontWeight: 700, cursor: "pointer", padding: 0 }}
                  >
                    {openTopic === t.id ? "▾" : "▸"} View
                  </button>
                </div>
                <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
                  <a
                    href={`/practice?userId=${userId ?? ""}&subject=${encodeURIComponent(selectedSubject.name)}&topic=${encodeURIComponent(t.name)}`}
                    style={{ display: "block", background: "#0F766E", color: "#fff", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 700, textDecoration: "none", textAlign: "center", flex: 1 }}
                  >
                    Practice this topic
                  </a>
                </div>
                {openTopic === t.id && (
                  <div style={{ background: "#F8FAFC", borderRadius: 8, padding: 12, marginTop: 8 }}>
                    {t.learningObjectives.length > 0 && (
                      <>
                        <div style={{ fontSize: 12, fontWeight: 800, color: "#5F6E7F", marginBottom: 6, marginTop: 8 }}>🎯 Learning Objectives</div>
                        <ul style={{ margin: "0 0 10px 0", paddingLeft: 20, fontSize: 13, color: "#333A45" }}>
                          {(t.learningObjectives as string[]).map((o: string, i: number) => <li key={i} style={{ marginBottom: 4 }}>{o}</li>)}
                        </ul>
                      </>
                    )}
                    {t.notes.length > 0 && (
                      <>
                        <div style={{ fontSize: 12, fontWeight: 800, color: "#5F6E7F", marginBottom: 6, marginTop: 8 }}>📖 Notes</div>
                        <div style={{ fontSize: 13, color: "#333A45", lineHeight: 1.6, marginBottom: 10 }}>{(t.notes as string[]).map((n: string, i: number) => <p key={i} style={{ margin: "0 0 6px 0" }}>{n}</p>)}</div>
                      </>
                    )}
                    {t.activities.length > 0 && (
                      <>
                        <div style={{ fontSize: 12, fontWeight: 800, color: "#5F6E7F", marginBottom: 6, marginTop: 8 }}>✏️ Activities</div>
                        <ul style={{ margin: "0 0 10px 0", paddingLeft: 20, fontSize: 13, color: "#333A45" }}>
                          {(t.activities as string[]).map((a: string, i: number) => <li key={i} style={{ marginBottom: 4 }}>{a}</li>)}
                        </ul>
                      </>
                    )}
                    {t.examFocus.length > 0 && (
                      <>
                        <div style={{ fontSize: 12, fontWeight: 800, color: "#5F6E7F", marginBottom: 6, marginTop: 8 }}>🏆 Exam Focus</div>
                        <ul style={{ margin: "0 0 10px 0", paddingLeft: 20, fontSize: 13, color: "#333A45" }}>
                          {(t.examFocus as string[]).map((e: string, i: number) => <li key={i} style={{ marginBottom: 4 }}>{e}</li>)}
                        </ul>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
            {selectedSubject.topics.length === 0 && <p style={{ fontSize: 14, color: "#5F6E7F" }}>No topics available for this subject.</p>}
          </div>
        </div>
      ) : (
        // ---------- Subject grid ----------
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
          {tierSubjects.length === 0 && <p style={{ fontSize: 14, color: "#5F6E7F" }}>No subjects available.</p>}
          {tierSubjects.map((s) => (
            <div key={s.id} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 16, cursor: "pointer", transition: "all 0.2s ease" }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 14px -4px rgb(30 36 46 / 0.35)"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }} onClick={() => selectSubject(s)}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#0F766E", textTransform: "uppercase", marginBottom: 6 }}>{s.level}</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: "#1E242E", marginBottom: 6 }}>{s.name}</div>
              <div style={{ fontSize: 12, color: "#5F6E7F" }}>{s.topics.length} topics</div>
              <div style={{ fontSize: 11, color: "#5F6E7F", marginTop: 4 }}>{s.exams.join(", ")}</div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default function Curriculum() {
  return <CurriculumInner />;
}
