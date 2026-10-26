"use client";
import { useEffect, useState } from "react";

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, margin: "0 0 12px" };

type NoteItem = { id: string; subject: string; topic: string; body: string };

export default function LearningResources() {
  const [userId, setUserId] = useState<string | null>(null);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("edupal_user");
    setUserId(id);
    if (!id) return;
    // Learning resources come from approved lesson notes + study notes
    fetch(`/api/school/lesson-notes?userId=${id}&status=approved`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.notes) setNotes(d.notes.map((n: any) => ({
          id: n.id,
          subject: n.subject,
          topic: n.topic,
          body: n.body
        })));
      });
  }, []);

  const filtered = notes.filter((n) =>
    n.subject.toLowerCase().includes(search.toLowerCase()) ||
    n.topic.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <h1 style={{ fontSize: 24, margin: 0 }}>Learning Resources</h1>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search notes by subject or topic…"
          style={{ flex: 1, height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px" }} />
      </div>

      <div style={card}>
        <p style={{ fontSize: 13, color: "#5F6E7F", margin: "0 0 12px" }}>
          Approved lesson notes written by teachers are available here as learning resources for students.
        </p>
        {filtered.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
            {filtered.map((n) => (
              <div key={n.id} style={card}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, color: "#0F766E", marginBottom: 4 }}>{n.subject}</div>
                <strong style={{ fontSize: 15, color: "#1E242E" }}>{n.topic}</strong>
                <p style={{ fontSize: 12, color: "#5F6E7F", marginTop: 6, lineHeight: 1.5 }}>{n.body.slice(0, 150)}{n.body.length > 150 ? "…" : ""}</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: 13, color: "#94A3B8", margin: 0, textAlign: "center" }}>
            No learning resources available yet. Teachers can write lesson notes which appear here after VP approval.
          </p>
        )}
      </div>
    </main>
  );
}
