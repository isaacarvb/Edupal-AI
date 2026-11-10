"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useHiddenSubjects } from "@/components/useHiddenSubjects";
import { NotesMarkdown } from "@/components/NotesMarkdown";
import {
  DEPARTMENTS,
  DEPARTMENT_NAMES,
  GENERAL_SUBJECTS,
  JSS_SUBJECTS,
  SSS_SUBJECTS,
  canonicalDepartment
} from "@/lib/syllabus";

type CSubject = { id: string; name: string; level: "SSS" | "JSS"; exams: string[]; topics: CTopic[] };
type CTopic = {
  id: string; name: string; class: string; subject: string; level: string; exams: string[]; subjectId: string;
  learningObjectives: string[]; notes: string[]; activities: string[]; examFocus: string[]; source: string; locked?: boolean;
};

const GENERAL = GENERAL_SUBJECTS as readonly string[];
const JSS = JSS_SUBJECTS as readonly string[];
const SSS = SSS_SUBJECTS as readonly string[];

function viewPill(open: boolean, locked: boolean): React.CSSProperties {
  if (locked && !open) {
    return { background: "#FEF3C7", color: "#92400E", border: "1px solid #F59E0B", borderRadius: 999, padding: "7px 14px", fontSize: 13, fontWeight: 800, cursor: "pointer", flexShrink: 0, lineHeight: 1.2 };
  }
  if (locked && open) {
    return { background: "#F59E0B", color: "#fff", border: "1px solid #F59E0B", borderRadius: 999, padding: "7px 14px", fontSize: 13, fontWeight: 800, cursor: "pointer", flexShrink: 0, lineHeight: 1.2 };
  }
  return {
    background: open ? "#0F766E" : "#E6F4F1",
    color: open ? "#fff" : "#0F766E",
    border: "1px solid #0F766E",
    borderRadius: 999, padding: "7px 14px", fontSize: 13, fontWeight: 800, cursor: "pointer", flexShrink: 0, lineHeight: 1.2
  };
}

function stubSubject(name: string, level: "SSS" | "JSS"): CSubject {
  return { id: `stub-${level}-${name}`, name, level, exams: [], topics: [] };
}

function CurriculumInner() {
  const params = useSearchParams();
  const [userId, setUserId] = useState("");
  const [userReady, setUserReady] = useState(false);
  const [tier, setTier] = useState<"jss" | "senior">("senior");
  const [studentIsJunior, setStudentIsJunior] = useState(false);
  const [userDepartment, setUserDepartment] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<CSubject | null>(null);
  const [openTopic, setOpenTopic] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<CSubject[]>([]);
  const [unlimited, setUnlimited] = useState(false);
  const [loading, setLoading] = useState(true);
  const autoLanded = useRef(false);
  const hidden = useHiddenSubjects();

  useEffect(() => {
    setUserId(params.get("userId") ?? localStorage.getItem("edupal_user") ?? "");
    setUserReady(true);
  }, [params]);

  // Load user profile for level and department. School-code students use the
  // same real account, so this works exactly like a self-signup student.
  useEffect(() => {
    if (!userId) return;
    fetch(`/api/topics?userId=${userId}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.profile) return;
        const junior = d.profile.level === "JUNIOR" || d.profile.exam === "Others";
        setStudentIsJunior(junior);
        setUserDepartment(d.profile.department ? canonicalDepartment(String(d.profile.department)) : null);
        // JSS students land on the Junior view automatically.
        if (!autoLanded.current) {
          setTier(junior ? "jss" : "senior");
          autoLanded.current = true;
        }
      })
      .catch(() => {});
  }, [userId]);

  // Load curriculum (with this user's access level) once we know who is asking.
  useEffect(() => {
    if (!userReady) return;
    setLoading(true);
    fetch(`/api/curriculum${userId ? `?userId=${encodeURIComponent(userId)}` : ""}`)
      .then((r) => r.json())
      .then((d) => {
        setSubjects(d.subjects ?? []);
        setUnlimited(!!d.meta?.unlimited);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userReady, userId]);

  const byLevel = useMemo(
    () => ({
      SSS: subjects.filter((s) => s.level === "SSS" && !hidden.includes(s.name)),
      JSS: subjects.filter((s) => s.level === "JSS" && !hidden.includes(s.name))
    }),
    [subjects, hidden]
  );

  function findSubject(name: string, level: "SSS" | "JSS"): CSubject {
    return byLevel[level].find((s) => s.name === name) ?? stubSubject(name, level);
  }

  // Which cards can be opened right now?
  function isOpen(name: string, level: "SSS" | "JSS"): boolean {
    if (hidden.includes(name)) return false;
    if (tier === "jss") return level === "JSS" && studentIsJunior;
    if (level === "JSS") return false; // other tier
    if (studentIsJunior) return false; // JSS student peeking at senior
    if (!userDepartment) return true;
    if (GENERAL.includes(name)) return true;
    return (DEPARTMENTS[userDepartment as keyof typeof DEPARTMENTS] ?? []).includes(name);
  }

  function lockReason(name: string, level: "SSS" | "JSS"): string {
    if (level === "JSS" && !studentIsJunior) return "Not for your level";
    if (level === "SSS" && studentIsJunior) return "Not for your level";
    if (level === "SSS" && userDepartment && !GENERAL.includes(name)) return `Not in your ${userDepartment} department`;
    return "Locked";
  }

  function selectSubject(s: CSubject) {
    if (!isOpen(s.name, s.level)) return;
    setSelectedSubject(s);
    setOpenTopic(null);
  }

  const subLink = `/subscription${userId ? `?userId=${encodeURIComponent(userId)}` : ""}`;

  function subjectCard(s: CSubject) {
    const locked = !isOpen(s.name, s.level);
    const freeCount = unlimited ? s.topics.length : s.topics.filter((t) => !t.locked).length;
    const lockedCount = s.topics.length - freeCount;
    return (
      <div
        key={`${s.level}-${s.name}`}
        style={{
          background: locked ? "#F8FAFC" : "#fff",
          border: "1px solid #E2E8F0",
          borderRadius: 12,
          padding: 16,
          cursor: locked ? "not-allowed" : "pointer",
          transition: "all 0.2s ease",
          opacity: locked ? 0.65 : 1
        }}
        onMouseEnter={(e) => { if (!locked) (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 14px -4px rgb(30 36 46 / 0.35)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
        onClick={() => selectSubject(s)}
      >
        <div style={{ fontSize: 11, fontWeight: 800, color: locked ? "#94A3B8" : "#0F766E", textTransform: "uppercase", marginBottom: 6 }}>
          {s.level}
        </div>
        <div style={{ fontSize: 17, fontWeight: 800, color: locked ? "#94A3B8" : "#1E242E", marginBottom: 6 }}>
          {s.name} {locked && "🔒"}
        </div>
        <div style={{ fontSize: 12, color: "#5F6E7F" }}>
          {s.topics.length} topics
          {lockedCount > 0 && <span> • {freeCount} free • 🔒 {lockedCount}</span>}
        </div>
        {s.exams.length > 0 && <div style={{ fontSize: 11, color: "#5F6E7F", marginTop: 4 }}>{s.exams.join(", ")}</div>}
        {locked && (
          <div style={{ fontSize: 11, fontWeight: 700, color: "#DC2626", marginTop: 8 }}>
            {lockReason(s.name, s.level)}
          </div>
        )}
      </div>
    );
  }

  function section(title: string, subtitle: string, names: string[], level: "SSS" | "JSS") {
    if (names.length === 0) return null;
    return (
      <section style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
          <h2 style={{ fontSize: 17, color: "#1E242E", margin: 0 }}>{title}</h2>
          <span style={{ fontSize: 12, color: "#5F6E7F" }}>{subtitle}</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
          {names.map((name) => subjectCard(findSubject(name, level)))}
        </div>
      </section>
    );
  }

  return (
    <main style={{ maxWidth: 1180, margin: 0, padding: 20, color: "#333A45" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <h1 style={{ color: "#1E242E", fontSize: 24, margin: 0 }}>Curriculum &amp; Notes</h1>
        {unlimited ? (
          <span style={{ fontSize: 12, fontWeight: 800, background: "#0F766E", color: "#fff", borderRadius: 999, padding: "5px 12px" }}>∞ Unlimited — all notes open</span>
        ) : (
          <span style={{ fontSize: 12, fontWeight: 800, background: "#FEF3C7", color: "#92400E", borderRadius: 999, padding: "5px 12px" }}>🔒 First topic of each subject is free</span>
        )}
      </div>

      {/* Tier selector */}
      <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
        {(["jss", "senior"] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setTier(t); setSelectedSubject(null); }}
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

      {!studentIsJunior && tier === "senior" && userDepartment && (
        <div style={{ background: "#F0F9FF", border: "1px solid #BAE6FD", borderRadius: 10, padding: 10, marginBottom: 16, fontSize: 13, color: "#0369A1" }}>
          <strong style={{ display: "block", fontSize: 12, marginBottom: 4, color: "#0c4a6e" }}>📚 General + {userDepartment} department</strong>
          General subjects are open to every senior student. Your {userDepartment} department is unlocked. Other departments are visible but locked so you stay focused.
        </div>
      )}
      {studentIsJunior && tier === "jss" && (
        <div style={{ background: "#F0F9FF", border: "1px solid #BAE6FD", borderRadius: 10, padding: 10, marginBottom: 16, fontSize: 13, color: "#0369A1" }}>
          <strong style={{ display: "block", fontSize: 12, marginBottom: 4, color: "#0c4a6e" }}>📚 Junior Secondary</strong>
          All your JSS subjects are open. Senior subjects stay visible but locked until you move up.
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
              ← Back to subjects
            </button>
            <h2 style={{ fontSize: 20, color: "#1E242E", margin: "0 0 12px" }}>{selectedSubject.name}</h2>
            <p style={{ fontSize: 13, color: "#5F6E7F" }}>
              {selectedSubject.topics.length} topics available
              {!unlimited && ` • ${selectedSubject.topics.filter((t) => !t.locked).length} free to read, 🔒 the rest need Unlimited`}
            </p>

            {selectedSubject.topics.map((t, idx) => {
              const open = openTopic === t.id;
              const locked = !!t.locked;
              return (
                <div key={t.id} style={{ background: "#fff", border: locked ? "1px solid #FDE68A" : "1px solid #E2E8F0", borderRadius: 12, padding: 14, margin: "8px 0" }}>
                  {/* Header: topic + View pill (click toggles open/close) */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                    <div style={{ minWidth: 0 }}>
                      <strong style={{ fontSize: 15, color: "#1E242E" }}>
                        {idx + 1}. {locked && "🔒 "}{t.name}
                      </strong>
                      {t.class && <span style={{ fontSize: 11, fontWeight: 800, background: "#F1F5F9", color: "#0F766E", borderRadius: 6, padding: "2px 8px", marginLeft: 8 }}>{t.class}</span>}
                    </div>
                    <button
                      onClick={() => setOpenTopic(open ? null : t.id)}
                      style={viewPill(open, locked)}
                      aria-expanded={open}
                    >
                      {open ? "Close ▴" : locked ? "🔒 View" : "View ▾"}
                    </button>
                  </div>

                  {/* Dropdown: comprehensive notes, or the upgrade nudge when locked */}
                  {open && (
                    locked ? (
                      <div style={{ background: "#FFFBEB", border: "1px solid #F59E0B", borderRadius: 10, padding: 16, marginTop: 12 }}>
                        <div style={{ fontWeight: 800, color: "#92400E", fontSize: 15, marginBottom: 6 }}>🔒 This note is Unlimited-only</div>
                        <p style={{ fontSize: 14, color: "#78350F", margin: "0 0 10px", lineHeight: 1.6 }}>
                          The first topic of every subject is free — the rest of the notes unlock with <strong>Unlimited</strong>: all subjects in your department, every topic, nothing locked.
                        </p>
                        <a href={subLink} style={{ display: "inline-block", background: "#0F766E", color: "#fff", borderRadius: 8, padding: "10px 18px", fontSize: 14, fontWeight: 800, textDecoration: "none" }}>
                          Go Unlimited →
                        </a>
                      </div>
                    ) : (
                      <div style={{ background: "#F8FAFC", borderRadius: 10, padding: 16, marginTop: 12, border: "1px solid #E2E8F0" }}>
                        {t.learningObjectives.length > 0 && (
                          <>
                            <div style={{ fontSize: 12, fontWeight: 800, color: "#5F6E7F", marginBottom: 6 }}>🎯 Learning Objectives</div>
                            <ul style={{ margin: "0 0 10px 0", paddingLeft: 20, fontSize: 14, color: "#333A45", lineHeight: 1.6 }}>
                              {t.learningObjectives.map((o, i) => <li key={i} style={{ marginBottom: 4 }}>{o}</li>)}
                            </ul>
                          </>
                        )}
                        {t.notes.length > 0 && (
                          <>
                            <div style={{ fontSize: 12, fontWeight: 800, color: "#5F6E7F", margin: "10px 0 4px" }}>📖 Notes</div>
                            {t.notes.map((n, i) => <NotesMarkdown key={i} text={n} />)}
                          </>
                        )}
                        {t.notes.length === 0 && t.learningObjectives.length === 0 && (
                          <p style={{ fontSize: 14, color: "#5F6E7F", margin: 0 }}>Notes for this topic are being prepared — practice below to start scoring it.</p>
                        )}
                        {t.activities.length > 0 && (
                          <>
                            <div style={{ fontSize: 12, fontWeight: 800, color: "#5F6E7F", margin: "10px 0 6px" }}>✏️ Activities</div>
                            <ul style={{ margin: "0 0 10px 0", paddingLeft: 20, fontSize: 14, color: "#333A45", lineHeight: 1.6 }}>
                              {t.activities.map((a, i) => <li key={i} style={{ marginBottom: 4 }}>{a}</li>)}
                            </ul>
                          </>
                        )}
                        {t.examFocus.length > 0 && (
                          <>
                            <div style={{ fontSize: 12, fontWeight: 800, color: "#5F6E7F", margin: "10px 0 6px" }}>🏆 Exam Focus</div>
                            <ul style={{ margin: "0 0 4px 0", paddingLeft: 20, fontSize: 14, color: "#333A45", lineHeight: 1.6 }}>
                              {t.examFocus.map((e, i) => <li key={i} style={{ marginBottom: 4 }}>{e}</li>)}
                            </ul>
                          </>
                        )}
                      </div>
                    )
                  )}

                  {/* Practice sits under the note so students do: read → practise */}
                  <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
                    <a
                      href={`/practice?userId=${userId ?? ""}&subject=${encodeURIComponent(selectedSubject.name)}&topic=${encodeURIComponent(t.name)}`}
                      style={{ display: "block", background: "#0F766E", color: "#fff", borderRadius: 8, padding: "10px 14px", fontSize: 14, fontWeight: 700, textDecoration: "none", textAlign: "center", flex: 1 }}
                    >
                      Practice this topic →
                    </a>
                  </div>
                </div>
              );
            })}
            {selectedSubject.topics.length === 0 && <p style={{ fontSize: 14, color: "#5F6E7F" }}>No topics available for this subject yet.</p>}
          </div>
        </div>
      ) : tier === "jss" ? (
        // ---------- Junior subject grid ----------
        <>
          {section("Junior Secondary School", studentIsJunior ? "All JSS subjects are open." : "Visible but locked — you are on the senior track.", [...JSS], "JSS")}
          {!studentIsJunior && (
            <p style={{ fontSize: 13, color: "#5F6E7F" }}>
              Switch to the Senior Secondary tab to open your subjects.
            </p>
          )}
        </>
      ) : (
        // ---------- Senior: General + department sections ----------
        <>
          {section(
            "General Subjects",
            "Open to every senior secondary student.",
            [...GENERAL],
            "SSS"
          )}
          {DEPARTMENT_NAMES.map((dept) => {
            const names = (DEPARTMENTS[dept as keyof typeof DEPARTMENTS] ?? []).filter((n) => !GENERAL.includes(n));
            const isOwn = userDepartment === dept && !studentIsJunior;
            return (
              <div key={dept}>
                {section(
                  `${dept} Department`,
                  isOwn ? "Your department — fully unlocked." : studentIsJunior ? "Visible but locked — you are on the junior track." : "Visible but locked — not your department.",
                  names,
                  "SSS"
                )}
              </div>
            );
          })}
          {!studentIsJunior && userDepartment && (
            <p style={{ fontSize: 13, color: "#5F6E7F", marginTop: 4 }}>
              Your open subjects: General + {userDepartment}. You are seeing {SSS.length} senior subjects in total.
            </p>
          )}
        </>
      )}
    </main>
  );
}

export default function Curriculum() {
  return <CurriculumInner />;
}
