"use client";

import { useEffect, useState } from "react";

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, margin: "0 0 12px" };

type Note = {
  id: string;
  teacherName: string;
  className: string;
  subject: string;
  topic: string;
  body: string;
  attachmentName: string | null;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

export default function SchoolLessonNotes() {
  const [school, setSchool] = useState<{ id: string; name: string } | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const s = localStorage.getItem("edupal_school");
    if (s) {
      try { setSchool(JSON.parse(s)); } catch { /* ignore */ }
    }
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const s = localStorage.getItem("edupal_school");
    if (!s) return;
    try {
      const d = JSON.parse(s);
      const res = await fetch(`/api/school/lesson-notes-list?schoolId=${d.id}`);
      if (res.ok) {
        const jd = await res.json();
        setNotes(jd.notes ?? []);
      }
    } catch { /* ignore */ }
  }

  async function reviewNote(noteId: string, status: "approved" | "rejected") {
    if (!confirm(status === "approved" ? "Approve this note?" : "Reject this note?")) return;
    setBusy(true);
    try {
      const res = await fetch("/api/school/lesson-notes-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteId, status })
      });
      if (res.ok) {
        setNotes((prev) => prev.map((n) => n.id === noteId ? { ...n, status } : n));
      }
    } catch { /* ignore */ } finally {
      setBusy(false);
    }
  }

  const filtered = filter === "all" ? notes : notes.filter((n) => n.status === filter);

  if (!school) {
    return (
      <main style={{ maxWidth: 480, margin: "60px auto", padding: 20, color: "#333A45", textAlign: "center" }}>
        <p style={{ fontSize: 14, color: "#5F6E7F" }}>School session not found.</p>
        <button onClick={() => { window.location.href = "/school-login"; }}
          style={{ height: 40, borderRadius: 8, border: 0, background: "#0F766E", color: "#fff", fontWeight: 800, padding: "0 20px", cursor: "pointer" }}>
          Sign In to School
        </button>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1E242E", margin: "0 0 16px" }}>Lesson Notes</h1>
      <p style={{ fontSize: 13, color: "#5F6E7F", marginBottom: 16 }}>
        Review teacher-submitted lesson notes. Approved notes are visible to students.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {(["all", "pending", "approved", "rejected"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ height: 36, borderRadius: 999, border: filter === f ? "none" : "1px solid #CBD5E1", background: filter === f ? "#0F766E" : "#fff", color: filter === f ? "#fff" : "#1E242E", fontWeight: 700, fontSize: 13, padding: "0 16px", cursor: "pointer", textTransform: "capitalize" }}>
            {f} ({f === "all" ? notes.length : notes.filter((n) => n.status === f).length})
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.length === 0 ? (
          <p style={{ fontSize: 13, color: "#5F6E7F", textAlign: "center", padding: 24 }}>No notes {filter !== "all" ? `with status "${filter}"` : "yet"}.</p>
        ) : (
          filtered.map((n) => (
            <div key={n.id} style={card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#1E242E" }}>{n.subject} — {n.topic}</div>
                  <div style={{ fontSize: 12, color: "#5F6E7F" }}>
                    by {n.teacherName} · Class: {n.className} · {new Date(n.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 999,
                  background: n.status === "approved" ? "#DCFCE7" : n.status === "rejected" ? "#FEE2E2" : "#FEF3C7",
                  color: n.status === "approved" ? "#166534" : n.status === "rejected" ? "#991B1B" : "#92400E" }}>
                  {n.status.toUpperCase()}
                </span>
              </div>
              <p style={{ fontSize: 13, color: "#333A45", margin: "0 0 8px", whiteSpace: "pre-wrap" }}>{n.body}</p>
              {n.attachmentName && (
                <div style={{ fontSize: 12, color: "#5F6E7F", marginBottom: 8 }}>📎 {n.attachmentName}</div>
              )}
              {n.status === "pending" && (
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => reviewNote(n.id, "approved")} disabled={busy}
                    style={{ height: 36, borderRadius: 8, border: 0, background: "#16A34A", color: "#fff", fontWeight: 700, fontSize: 13, padding: "0 16px", cursor: busy ? "not-allowed" : "pointer" }}>
                    ✓ Approve
                  </button>
                  <button onClick={() => reviewNote(n.id, "rejected")} disabled={busy}
                    style={{ height: 36, borderRadius: 8, border: "1px solid #DC2626", background: "#FFF1F2", color: "#DC2626", fontWeight: 700, fontSize: 13, padding: "0 16px", cursor: busy ? "not-allowed" : "pointer" }}>
                    ✕ Reject
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </main>
  );
}
