"use client";
import { useEffect, useState } from "react";

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, margin: "0 0 12px" };

type NoteItem = { id: string; teacherName: string; className: string; subject: string; topic: string; body: string; status: string; createdAt: string };

export default function ApprovalCenter() {
  const [userId, setUserId] = useState<string | null>(null);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("edupal_user");
    setUserId(id);
    if (!id) return;
    fetch(`/api/school/lesson-notes?userId=${id}&status=pending`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.notes) setNotes(d.notes.map((n: any) => ({
          id: n.id,
          teacherName: n.teacherName,
          className: n.className,
          subject: n.subject,
          topic: n.topic,
          body: n.body,
          status: n.status,
          createdAt: n.createdAt
        })));
      });
  }, []);

  async function review(noteId: string, status: "approved" | "rejected") {
    setMsg("");
    const res = await fetch("/api/school/lesson-notes", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, noteId, status })
    });
    const d = await res.json();
    if (!res.ok) return setMsg(d.error || "Review failed.");
    setMsg(`Note ${status}.`);
    setNotes(notes.filter((n) => n.id !== noteId));
  }

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ fontSize: 24, margin: 0 }}>Approval Center</h1>
      </div>

      <div style={card}>
        <p style={{ fontSize: 13, color: "#5F6E7F", margin: "0 0 12px" }}>
          Teachers submit lesson notes for your review. Approve them so students can see them on their dashboards, or reject if they need changes.
        </p>
        {msg && <p style={{ fontSize: 13, color: "#166534", marginBottom: 10 }}>{msg}</p>}
        {notes.length === 0 ? (
          <p style={{ fontSize: 13, color: "#94A3B8", margin: 0, textAlign: "center" }}>
            No pending lesson notes. All clear!
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {notes.map((n) => (
              <div key={n.id} style={{ borderBottom: "1px solid #F1F5F9", padding: "12px 0", fontSize: 13 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                  <div>
                    <strong>{n.topic}</strong>
                    <span style={{ fontSize: 11, color: "#5F6E7F", marginLeft: 6 }}>{n.subject} · {n.className}</span>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 800, padding: "4px 8px", borderRadius: 999, background: "#F59E0B", color: "#fff" }}>Pending</span>
                </div>
                <div style={{ color: "#5F6E7F", fontSize: 11, marginBottom: 6 }}>
                  by {n.teacherName} · {new Date(n.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
                </div>
                <p style={{ margin: "0 0 10px", color: "#333A45" }}>{n.body.slice(0, 300)}{n.body.length > 300 ? "…" : ""}</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => review(n.id, "approved")}
                    style={{ height: 36, borderRadius: 8, border: 0, background: "#16A34A", color: "#fff", fontWeight: 700, padding: "0 16px", cursor: "pointer" }}>
                    Approve
                  </button>
                  <button onClick={() => review(n.id, "rejected")}
                    style={{ height: 36, borderRadius: 8, border: 0, background: "#DC2626", color: "#fff", fontWeight: 700, padding: "0 16px", cursor: "pointer" }}>
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
