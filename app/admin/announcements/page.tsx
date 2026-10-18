"use client";
import { useEffect, useState } from "react";
import { AdminButton } from "@/components/admin-ui";

type A = { id: string; title: string; body: string; segment: string; createdBy: string; createdAt: string };

export default function AdminAnnouncements() {
  const [list, setList] = useState<A[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [segment, setSegment] = useState("all");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const aid = () => localStorage.getItem("edupal_admin") ?? "";

  function load() {
    fetch(`/api/admin/announcements?adminId=${aid()}`).then(async (r) => {
      if (r.ok) setList((await r.json()).announcements);
    });
  }
  useEffect(load, []);

  async function send() {
    setMsg("");
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/announcements", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ adminId: aid(), title, body, segment }) });
      const d = await res.json();
      if (!res.ok) return setMsg(d.error || "Failed.");
      setMsg(`Sent! Pops up for users + queued ${d.emailed} emails.`);
      setTitle("");
      setBody("");
      load();
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: 24, color: "#333A45" }}>
      <h1 style={{ fontSize: 22 }}>Announcements</h1>
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 12 }}>
        <strong>Send to users</strong>
        <p style={{ fontSize: 13, color: "#5F6E7F" }}>Shows as a popup + bell 🔔 on the user app, and queues an email for each matching student.</p>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title e.g. Update available: new Physics notes" style={{ width: "100%", height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 10px", marginBottom: 8, boxSizing: "border-box" }} />
        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Message…" rows={3} style={{ width: "100%", borderRadius: 10, border: "1px solid #CBD5E1", padding: 10, boxSizing: "border-box" }} />
        <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
          <select value={segment} onChange={(e) => setSegment(e.target.value)} style={{ height: 44, borderRadius: 10, border: "1px solid #CBD5E1" }}>
            <option value="all">All users</option>
            <option value="free">Free users only</option>
            <option value="paid">Paid users only</option>
            <option value="sleeping">Sleeping (quiet 7+ days)</option>
          </select>
          <AdminButton onClick={send} busy={busy}>Send 📢</AdminButton>
        </div>
        {msg && <p style={{ fontSize: 13 }}>{msg}</p>}
      </div>
      <h2 style={{ fontSize: 18, marginTop: 16 }}>Sent ({list.length})</h2>
      {list.map((a) => (
        <div key={a.id} className="arow" style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, padding: 10, margin: "6px 0", fontSize: 14 }}>
          <strong>{a.title}</strong> <span style={{ fontSize: 12, color: "#fff", background: "#0F766E", borderRadius: 999, padding: "2px 10px" }}>{a.segment}</span>
          <p style={{ margin: "4px 0" }}>{a.body}</p>
          <div style={{ fontSize: 12, color: "#5F6E7F" }}>{String(a.createdAt).slice(0, 16).replace("T", " ")} • by {a.createdBy}</div>
        </div>
      ))}
      {list.length === 0 && <p style={{ fontSize: 14 }}>Nothing sent yet.</p>}
    </main>
  );
}
