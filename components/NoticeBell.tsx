"use client";
import { useEffect, useState } from "react";

type A = { id: string; title: string; body: string; segment: string; createdAt: string };

// Fixed bottom-right bell: unread count badge, popup list, mark-read on open.
export default function NoticeBell({ userId }: { userId: string | null }) {
  const [items, setItems] = useState<A[]>([]);
  const [open, setOpen] = useState(false);
  const [popup, setPopup] = useState<A | null>(null);

  function load() {
    if (!userId) return;
    fetch(`/api/announcements?userId=${userId}`).then(async (r) => {
      if (!r.ok) return;
      const d = await r.json();
      setItems(d.unread ?? []);
      if (d.unread?.length && !sessionStorage.getItem("edupal_popup_seen")) {
        setPopup(d.unread[0]);
        sessionStorage.setItem("edupal_popup_seen", "1");
      }
    });
  }
  useEffect(load, [userId]);

  async function dismiss(a: A) {
    await fetch("/api/announcements", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId, id: a.id }) });
    setItems((list) => list.filter((x) => x.id !== a.id));
    setPopup(null);
  }

  if (!userId) return null;
  return (
    <>
      {popup && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={() => dismiss(popup)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, padding: 20, maxWidth: 380, width: "100%", color: "#1E242E" }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#0F766E" }}>📢 ANNOUNCEMENT</div>
            <h3 style={{ margin: "6px 0" }}>{popup.title}</h3>
            <p style={{ fontSize: 14 }}>{popup.body}</p>
            <button onClick={() => dismiss(popup)} style={{ width: "100%", height: 44, borderRadius: 10, border: 0, background: "#0F766E", color: "#fff", fontWeight: 800, cursor: "pointer" }}>Got it ✓</button>
          </div>
        </div>
      )}
      {open && (
        <div style={{ position: "fixed", right: 16, bottom: 76, zIndex: 200, background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, width: 320, maxWidth: "calc(100vw - 32px)", maxHeight: 380, overflow: "auto", color: "#1E242E", boxShadow: "0 8px 32px rgb(0 0 0 / 0.25)" }}>
          <div style={{ padding: 12, fontWeight: 800, borderBottom: "1px solid #E2E8F0" }}>🔔 Notices ({items.length})</div>
          {items.length === 0 && <p style={{ fontSize: 13, padding: "0 12px" }}>All caught up. 🎉</p>}
          {items.map((a) => (
            <div key={a.id} style={{ padding: 12, borderBottom: "1px solid #F1F5F9", fontSize: 14 }}>
              <strong>{a.title}</strong>
              <p style={{ margin: "4px 0" }}>{a.body}</p>
              <button onClick={() => dismiss(a)} style={{ fontSize: 12, background: "#F1F5F9", border: 0, borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontWeight: 700 }}>Mark read ✓</button>
            </div>
          ))}
        </div>
      )}
      <button onClick={() => setOpen((v) => !v)} aria-label="Notices" style={{ position: "fixed", right: 16, bottom: 16, zIndex: 200, width: 52, height: 52, borderRadius: 999, border: "2px solid #1E242E", background: "#0F766E", color: "#fff", fontSize: 22, cursor: "pointer", boxShadow: "4px 4px 0 #1E242E" }}>
        🔔
        {items.length > 0 && (
          <span style={{ position: "absolute", top: -6, right: -6, background: "#DC2626", color: "#fff", fontSize: 11, fontWeight: 800, borderRadius: 999, minWidth: 22, height: 22, lineHeight: "22px", textAlign: "center", padding: "0 5px" }}>{items.length}</span>
        )}
      </button>
    </>
  );
}
