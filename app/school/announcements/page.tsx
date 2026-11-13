"use client";

import { useEffect, useState } from "react";
import SubscriptionGate from "@/components/SubscriptionGate";

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, margin: "0 0 12px" };

export default function SchoolAnnouncementsPage() {
  return (
    <SubscriptionGate
      feature="Announcements"
      description="Send school-wide or class-specific announcements to students and teachers."
      bullets={[
        "Broadcast to the whole school or one class",
        "Students see announcements in their notice bell",
        "Keep a history of everything you have sent"
      ]}
    >
      <SchoolAnnouncements />
    </SubscriptionGate>
  );
}

function SchoolAnnouncements() {
  const [school, setSchool] = useState<{ id: string; name: string } | null>(null);
  const [announcements, setAnnouncements] = useState<{ id: string; title: string; body: string; className: string | null; createdAt: string }[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [className, setClassName] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const s = localStorage.getItem("edupal_school");
    if (s) {
      try { setSchool(JSON.parse(s)); } catch { /* ignore */ }
    }
    fetchAnnouncements();
  }, []);

  async function fetchAnnouncements() {
    const s = localStorage.getItem("edupal_school");
    if (!s) return;
    try {
      const d = JSON.parse(s);
      const res = await fetch(`/api/school/announcements-list?schoolId=${d.id}`);
      if (res.ok) {
        const jd = await res.json();
        setAnnouncements(jd.announcements ?? []);
      }
    } catch { /* ignore */ }
  }

  async function sendAnnouncement() {
    if (!title.trim() || !body.trim()) return setMsg("Title and message required.");
    setMsg("");
    setBusy(true);
    try {
      const s = localStorage.getItem("edupal_school");
      if (!s) return;
      const d = JSON.parse(s);
      const res = await fetch("/api/school/announcements-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schoolId: d.id, title: title.trim(), body: body.trim(), className: className || null })
      });
      const jd = await res.json();
      if (!res.ok) return setMsg(jd.error || "Failed to send.");
      setMsg("Announcement sent to students.");
      setTitle("");
      setBody("");
      setClassName("");
      fetchAnnouncements();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Failed to send.");
    } finally {
      setBusy(false);
    }
  }

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
      <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1E242E", margin: "0 0 16px" }}>Announcements</h1>
      <p style={{ fontSize: 13, color: "#5F6E7F", marginBottom: 16 }}>
        Broadcast messages to your students. They'll appear as popups and bell notifications.
      </p>

      <div style={card}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: "#1E242E", margin: "0 0 12px" }}>Send Announcement</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title (e.g. Exam Tomorrow)"
            style={{ height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px" }} />
          <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Message to students…" rows={3}
            style={{ borderRadius: 10, border: "1px solid #CBD5E1", padding: "10px 12px", fontSize: 14, resize: "vertical" }} />
          <input value={className} onChange={(e) => setClassName(e.target.value)} placeholder="Class (optional — leave empty for all students)"
            style={{ height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px" }} />
          <button onClick={sendAnnouncement} disabled={busy}
            style={{ height: 44, borderRadius: 10, border: 0, background: busy ? "#9CA3AF" : "#0F766E", color: "#fff", fontWeight: 800, fontSize: 14, cursor: busy ? "not-allowed" : "pointer" }}>
            {busy ? "Sending…" : "📢 Send to Students"}
          </button>
          {msg && <p style={{ fontSize: 13, color: msg.startsWith("Announcement") ? "#166534" : "#DC2626", margin: "4px 0 0" }}>{msg}</p>}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {announcements.length === 0 ? (
          <p style={{ fontSize: 13, color: "#5F6E7F", textAlign: "center", padding: 24 }}>No announcements sent yet.</p>
        ) : (
          announcements.map((a) => (
            <div key={a.id} style={card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: "#1E242E" }}>{a.title}</span>
                <span style={{ fontSize: 11, color: "#5F6E7F" }}>{new Date(a.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}</span>
              </div>
              <p style={{ fontSize: 13, color: "#333A45", margin: "0 0 4px" }}>{a.body}</p>
              {a.className && <span style={{ fontSize: 11, color: "#5F6E7F" }}>Class: {a.className}</span>}
            </div>
          ))
        )}
      </div>
    </main>
  );
}
