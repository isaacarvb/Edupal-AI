"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Topic = { subject: string; topic: string; accuracy: number; label: string };

const badge: Record<string, React.CSSProperties> = {
  WEAK: { background: "#DC2626", color: "#fff" },
  NEEDS_WORK: { background: "#F59E0B", color: "#422006" },
  STRONG: { background: "#16A34A", color: "#fff" }
};

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, margin: "0 0 12px" };

function TopicsInner() {
  const params = useSearchParams();
  const [userId, setUserId] = useState("");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [suggest, setSuggest] = useState<null | { subject: string; topic: string; accuracy: number; label: string }>(null);
  const [reason, setReason] = useState("");
  const [retention, setRetention] = useState<null | { topic: { subject: string; topic: string } }>(null);
  const [patterns, setPatterns] = useState<{ text: string; detail: string }[]>([]);

  useEffect(() => {
    const id = params.get("userId") ?? localStorage.getItem("edupal_user") ?? "";
    setUserId(id);
    if (!id) return;
    fetch(`/api/topics?userId=${id}`).then((r) => r.json()).then((d) => setTopics(d.topics ?? []));
    fetch(`/api/suggest?userId=${id}`).then((r) => r.json()).then((d) => {
      setSuggest(d.suggestion ?? null);
      setReason(d.reason ?? "");
    });
    fetch(`/api/retention/next?userId=${id}`).then((r) => r.json()).then((d) => setRetention(d.question ? { topic: d.topic } : null));
    fetch(`/api/patterns?userId=${id}`).then((r) => r.json()).then((d) => setPatterns(d.patterns ?? []));
  }, [params]);

  if (!userId) return <main style={{ padding: 20 }}>Missing user. Start from <a href="/signup">signup</a>.</main>;

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <h1 style={{ color: "#1E242E", fontSize: 24 }}>Weak topics</h1>
      <h2 style={{ color: "#1E242E", fontSize: 18 }}>Next up for you</h2>
      {suggest ? (
        <div style={{ ...card, background: "#CCFBF1", border: "1px solid #99F6E4" }}>
          <strong>{suggest.subject} • {suggest.topic}</strong>
          <p style={{ fontSize: 14, margin: "4px 0 8px" }}>{reason}</p>
          <a href={`/practice?userId=${userId}&subject=${encodeURIComponent(suggest.subject)}`} style={{ display: "block", textAlign: "center", background: "#0F766E", color: "#fff", borderRadius: 10, height: 44, lineHeight: "44px", fontWeight: 600, textDecoration: "none" }}>Practice This Topic</a>
          <a href={`/study-plan?userId=${userId}`} style={{ display: "block", textAlign: "center", background: "#fff", color: "#0F766E", border: "2px solid #0F766E", borderRadius: 10, height: 44, lineHeight: "40px", fontWeight: 700, fontSize: 14, textDecoration: "none", marginTop: 8 }}>View my week plan</a>
        </div>
      ) : (
        <p style={{ fontSize: 14 }}>{reason || "Answer a few questions and I'll pick your weakest topic."}</p>
      )}
      {retention && (
        <div style={{ ...card, background: "#FFFBEB", border: "1px solid #FDE68A" }}>
          <strong>Retention refresh: {retention.topic.subject} • {retention.topic.topic}</strong>
          <p style={{ fontSize: 14, margin: "4px 0" }}>It's Strong — a quick refresh keeps it there. <a href={`/practice?userId=${userId}&subject=${encodeURIComponent(retention.topic.subject)}`} style={{ color: "#0F766E", fontWeight: 700 }}>Refresh now</a></p>
        </div>
      )}
      {patterns.length > 0 && (
        <div style={{ ...card, background: "#EFF6FF", border: "1px solid #BFDBFE" }}>
          <strong>🔍 Patterns I'm noticing</strong>
          {patterns.map((p, i) => (
            <div key={i} style={{ fontSize: 14, marginTop: 8, paddingTop: 8, borderTop: "1px solid #BFDBFE" }}>
              <div>{p.text}</div>
              <div style={{ fontSize: 12, color: "#5F6E7F" }}>{p.detail}</div>
            </div>
          ))}
        </div>
      )}
      <h2 style={{ color: "#1E242E", fontSize: 18 }}>All topics, weakest first</h2>
      {topics.length === 0 && <p>No practice yet. <a href={`/practice?userId=${userId}&subject=English`} style={{ color: "#0F766E", fontWeight: 700 }}>Start practicing</a></p>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
        {topics.map((t) => (
          <div key={`${t.subject}-${t.topic}`} style={{ ...card, margin: 0 }}>
            <div style={{ fontSize: 13, color: "#5F6E7F" }}>{t.subject}</div>
            <strong>{t.topic}</strong>
            <div style={{ marginTop: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 999, ...badge[t.label] }}>{t.label} {Math.round(t.accuracy)}%</span>
            </div>
            <div style={{ height: 8, background: "#E2E8F0", borderRadius: 999, marginTop: 8 }}>
              <div style={{ height: "100%", width: `${Math.round(t.accuracy)}%`, background: "#0F766E", borderRadius: 999 }} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default function WeakTopics() {
  return (
    <Suspense fallback={<main style={{ padding: 20 }}>Loading…</main>}>
      <TopicsInner />
    </Suspense>
  );
}
