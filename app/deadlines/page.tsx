"use client";
import { useEffect, useState } from "react";

type D = { id: string; kind: string; title: string; detail: string; sourceUrl: string | null; opensOn: string | null; closesOn: string | null };

function Entry({ d }: { d: D }) {
  const days = d.closesOn ? Math.ceil((Date.parse(d.closesOn) - Date.now()) / 86400000) : null;
  return (
    <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 14, marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        <strong>{d.title}</strong>
        <span style={{ fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 999, background: "#F1F5F9", color: "#475569" }}>
          {d.kind.toUpperCase()}
        </span>
      </div>
      <p style={{ fontSize: 14, margin: "6px 0" }}>{d.detail}</p>
      <p style={{ fontSize: 13, margin: 0, color: days !== null && days < 0 ? "#5F6E7F" : "#0F766E", fontWeight: 700 }}>
        {days === null ? "Dates TBC — check the source link" : days < 0 ? `Closed ${d.closesOn}` : days === 0 ? "Closes today!" : `Closes in ${days} day(s) • ${d.closesOn}`}
      </p>
      {d.sourceUrl && <a href={d.sourceUrl} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: "#0F766E", fontWeight: 700 }}>Official source ↗</a>}
    </div>
  );
}

export default function Deadlines() {
  const [data, setData] = useState<{ upcoming: D | null; dated: D[]; tbc: D[] } | null>(null);
  useEffect(() => {
    fetch("/api/deadlines").then((r) => r.json()).then(setData);
  }, []);
  if (!data) return <main style={{ padding: 20 }}>Loading…</main>;
  return (
    <main style={{ maxWidth: 680, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <h1 style={{ color: "#1E242E", fontSize: 24 }}>Deadlines &amp; scholarships</h1>
      <p style={{ fontSize: 13, color: "#5F6E7F" }}>Only dated entries are verified against official sources. TBC means waiting on announcements.</p>
      {data.upcoming && (
        <>
          <h2 style={{ fontSize: 18 }}>Closing soonest</h2>
          <Entry d={data.upcoming} />
        </>
      )}
      <h2 style={{ fontSize: 18 }}>All dated</h2>
      {data.dated.map((d) => <Entry key={d.id} d={d} />)}
      <h2 style={{ fontSize: 18 }}>Watchlist (dates TBC)</h2>
      {data.tbc.map((d) => <Entry key={d.id} d={d} />)}
    </main>
  );
}
