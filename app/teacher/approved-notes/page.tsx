"use client";
import { useEffect, useState } from "react";

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, margin: "0 0 12px" };

type Note = {
  id: string; subject: string; topic: string; body: string; status: string;
  className: string; createdAt: string; attachmentUrl: string | null; attachmentName: string | null;
};

export default function TeacherApprovedNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [denied, setDenied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [classFilter, setClassFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("edupal_user");
    if (!id) {
      setDenied(true);
      setLoading(false);
      return;
    }
    if (localStorage.getItem("edupal_role") !== "SCHOOL_TEACHER") {
      setDenied(true);
      setLoading(false);
      return;
    }
    fetch(`/api/school/lesson-notes?userId=${id}&teacherId=${id}&status=approved`)
      .then((r) => (r.ok ? r.json() : { notes: [] }))
      .then((d) => setNotes(Array.isArray(d?.notes) ? d.notes : []))
      .catch(() => setNotes([]))
      .finally(() => setLoading(false));
  }, []);

  if (denied) {
    return (
      <main style={{ maxWidth: 560, margin: "48px auto", padding: "0 16px", color: "#333A45" }}>
        <div style={card}>
          <h1 style={{ fontSize: 20, margin: "0 0 8px" }}>📄 Approved Notes</h1>
          <p style={{ fontSize: 14, color: "#5F6E7F", margin: 0 }}>Teacher accounts only. Log in at <strong>/login</strong> with your teacher credentials.</p>
        </div>
      </main>
    );
  }

  const classes = Array.from(new Set(notes.map((n) => n.className))).sort();
  const subjects = Array.from(new Set(notes.map((n) => n.subject))).sort();
  const shown = notes.filter(
    (n) =>
      (!classFilter || n.className === classFilter) &&
      (!subjectFilter || n.subject === subjectFilter)
  );

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
        <div>
          <h1 style={{ fontSize: 22, margin: 0 }}>📄 Approved Notes</h1>
          <p style={{ fontSize: 13, color: "#5F6E7F", margin: "4px 0 0" }}>
            Notes the VP has approved. These are visible to your students.
          </p>
        </div>
        <a href="/teacher/lesson-notes" style={{ fontSize: 13, color: "#0F766E", fontWeight: 800, textDecoration: "none" }}>Write a note →</a>
      </div>

      <div style={{ ...card, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <label style={{ fontSize: 12, color: "#5F6E7F", fontWeight: 700 }}>
          Class{" "}
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            style={{ height: 36, borderRadius: 8, border: "1px solid #CBD5E1", padding: "0 8px", fontSize: 13 }}
          >
            <option value="">All classes</option>
            {classes.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label style={{ fontSize: 12, color: "#5F6E7F", fontWeight: 700 }}>
          Subject{" "}
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            style={{ height: 36, borderRadius: 8, border: "1px solid #CBD5E1", padding: "0 8px", fontSize: 13 }}
          >
            <option value="">All subjects</option>
            {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <span style={{ marginLeft: "auto", fontSize: 12, color: "#5F6E7F" }}>
          {shown.length} note{shown.length === 1 ? "" : "s"}
        </span>
      </div>

      {loading && <div style={card}>Loading approved notes…</div>}

      {!loading && shown.length === 0 && (
        <div style={card}>
          <p style={{ fontSize: 13, color: "#5F6E7F", margin: 0 }}>
            {notes.length === 0
              ? "You have no approved notes yet. Notes appear here once the VP approves them."
              : "No approved notes match these filters."}
          </p>
        </div>
      )}

      {shown.map((n) => (
        <div key={n.id} style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
            <div style={{ minWidth: 0 }}>
              <strong style={{ fontSize: 15 }}>{n.topic}</strong>
              <span style={{ fontSize: 11, color: "#5F6E7F", marginLeft: 6 }}>{n.subject}</span>
            </div>
            <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 999, background: "#16A34A", color: "#fff", flexShrink: 0 }}>
              Approved
            </span>
          </div>
          <div style={{ color: "#5F6E7F", fontSize: 11, marginBottom: 6 }}>
            {n.className} · {new Date(n.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
          </div>
          <p style={{ margin: 0, color: "#333A45", fontSize: 13 }}>{n.body.slice(0, 400)}{n.body.length > 400 ? "…" : ""}</p>
          {n.attachmentUrl && (
            <a
              href={n.attachmentUrl}
              target="_blank"
              rel="noreferrer"
              style={{ display: "inline-block", marginTop: 8, fontSize: 12, color: "#0F766E", fontWeight: 700, textDecoration: "none" }}
            >
              📎 {n.attachmentName ?? "Attachment"}
            </a>
          )}
        </div>
      ))}
    </main>
  );
}
