"use client";
import { useEffect, useState } from "react";

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, margin: "0 0 12px" };

type Broadcast = { id: string; body: string; className: string | null; startsAt: string; endsAt: string | null };

export default function Announcements() {
  const [userId, setUserId] = useState<string | null>(null);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [body, setBody] = useState("");
  const [className, setClassName] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("edupal_user");
    setUserId(id);
    if (!id) return;
    fetch(`/api/school/broadcasts?userId=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.broadcasts) setBroadcasts(d.broadcasts.map((b: any) => ({
          id: b.id,
          body: b.body,
          className: b.className,
          startsAt: b.startsAt,
          endsAt: b.endsAt
        })));
      });
  }, []);

  async function createBroadcast() {
    setMsg("");
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/school/broadcasts", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, className: className || null, body, startsAt: startsAt || new Date().toISOString(), endsAt: endsAt || null })
      });
      const d = await res.json();
      if (!res.ok) return setMsg(d.error || "Failed.");
      setMsg("Broadcast sent.");
      setBody(""); setClassName(""); setStartsAt(""); setEndsAt("");
      fetch(`/api/school/broadcasts?userId=${userId}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => d?.broadcasts && setBroadcasts(d.broadcasts.map((b: any) => ({
          id: b.id, body: b.body, className: b.className, startsAt: b.startsAt, endsAt: b.endsAt
        }))));
    } finally {
      setBusy(false);
    }
  }

  async function removeBroadcast(id: string) {
    if (!confirm("Remove this broadcast?")) return;
    const res = await fetch(`/api/school/broadcasts?broadcastId=${encodeURIComponent(id)}&userId=${userId}`, { method: "DELETE" });
    if (res.ok) setBroadcasts(broadcasts.filter((b) => b.id !== id));
  }

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <h1 style={{ fontSize: 24, margin: 0 }}>Announcements</h1>
      </div>

      <div style={card}>
        <h2 style={{ fontSize: 16, margin: "0 0 10px", color: "#1E242E" }}>Send Broadcast</h2>
        <p style={{ fontSize: 13, color: "#5F6E7F", margin: "0 0 10px" }}>
          Send a one-line message to the whole school or a specific class. Appears as a banner on student dashboards.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10, marginBottom: 10 }}>
          <input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Message body…"
            style={{ height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px" }} />
          <input value={className} onChange={(e) => setClassName(e.target.value)} placeholder="Class (optional, all if empty)"
            style={{ height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px" }} />
          <input value={startsAt} onChange={(e) => setStartsAt(e.target.value)} type="datetime-local"
            style={{ height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px" }} />
          <input value={endsAt} onChange={(e) => setEndsAt(e.target.value)} type="datetime-local"
            style={{ height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 12px" }} />
          <button onClick={createBroadcast} disabled={busy}
            style={{ height: 44, borderRadius: 10, border: 0, background: "#0F766E", color: "#fff", fontWeight: 800, padding: "0 20px", cursor: "pointer" }}>
            {busy ? "Sending…" : "Send Broadcast"}
          </button>
        </div>
        {msg && <p style={{ fontSize: 13, color: msg.startsWith("Broadcast") ? "#166534" : "#DC2626", marginTop: 8 }}>{msg}</p>}
      </div>

      <div style={card}>
        <h2 style={{ fontSize: 16, margin: "0 0 12px", color: "#1E242E" }}>Active Broadcasts ({broadcasts.length})</h2>
        {broadcasts.length === 0 && (
          <p style={{ fontSize: 13, color: "#94A3B8", margin: 0 }}>No active broadcasts.</p>
        )}
        {broadcasts.map((b) => (
          <div key={b.id} style={{ borderBottom: "1px solid #F1F5F9", padding: "10px 0", fontSize: 13 }}>
            <div style={{ fontSize: 13, color: "#333A45" }}>{b.body}</div>
            <div style={{ fontSize: 11, color: "#5F6E7F", marginTop: 4 }}>
              {b.className ? `Class: {b.className}` : "Whole School"} · {new Date(b.startsAt).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
              {b.endsAt ? ` · until ${new Date(b.endsAt).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}` : ""}
            </div>
            <button onClick={() => removeBroadcast(b.id)} style={{ background: "#DC2626", color: "#fff", borderRadius: 8, padding: "4px 12px", fontSize: 12, fontWeight: 700, border: 0, cursor: "pointer" }}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
