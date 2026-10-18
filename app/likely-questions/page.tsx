"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Q = { id: string; subject: string; topic: string; type: string; stem: string; optionsJson: string };
type Data =
  | { locked: true; reason: string; daysLeft?: number; exam?: string }
  | { locked: false; daysLeft: number | null; exam: string; unconfirmed?: boolean; analysis: string; engine: string; questions: Q[] };

function LikelyInner() {
  const params = useSearchParams();
  const [userId, setUserId] = useState("");
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    const id = params.get("userId") ?? localStorage.getItem("edupal_user") ?? "";
    setUserId(id);
    if (id) fetch(`/api/likely?userId=${id}`).then((r) => r.json()).then(setData);
  }, [params]);

  if (!userId) return <main style={{ padding: 20 }}>Missing user. Start from <a href="/signup">signup</a>.</main>;
  if (!data) return <main style={{ padding: 20 }}>Loading…</main>;

  if (data.locked) {
    return (
      <main style={{ maxWidth: 640, margin: "0 auto", padding: 20, color: "#333A45", textAlign: "center" }}>
        <div style={{ fontSize: 48 }}>🔒</div>
        <h1 style={{ color: "#1E242E" }}>Unlocks 7 days before your exam</h1>
        <p style={{ fontSize: 20, fontWeight: 800, color: "#0F766E" }}>{data.daysLeft} day(s) to {data.exam} — keep building your base.</p>
        <p style={{ fontSize: 14, color: "#5F6E7F" }}>Final-week predictions appear here automatically. Meanwhile, your Next Up topics are the best preparation.</p>
        <a href={`/dashboard?userId=${userId}`} style={{ color: "#0F766E", fontWeight: 700 }}>Back to dashboard</a>
      </main>
    );
  }

  if (data.unconfirmed) {
    return (
      <main style={{ maxWidth: 640, margin: "0 auto", padding: 20, color: "#333A45", textAlign: "center" }}>
        <div style={{ fontSize: 48 }}>📅</div>
        <h1 style={{ color: "#1E242E" }}>Likely questions are ready when you are</h1>
        <p style={{ fontSize: 16, margin: "12px 0" }}>
          This section shows the questions most likely to appear in your exam — unlocked automatically 7 days before your exam date.
        </p>
        <p style={{ fontSize: 14, color: "#5F6E7F" }}>
          Your exam dates aren't confirmed yet, so predictions stay locked. Set your start and end dates in Settings as soon as the timetable is out, and this section will spring to life on its own.
        </p>
        <a href={`/settings?userId=${userId}`} style={{ display: "inline-block", background: "#0F766E", color: "#fff", borderRadius: 10, padding: "12px 28px", fontWeight: 800, textDecoration: "none", marginTop: 12 }}>Set my exam dates</a>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 680, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <p style={{ fontSize: 13, fontWeight: 800, color: "#0F766E" }}>🔥 FINAL WEEK • {data.exam}{data.daysLeft !== null ? ` • ${data.daysLeft} day(s) left` : " • dates not confirmed yet"}</p>
      <h1 style={{ color: "#1E242E", fontSize: 24 }}>Likely exam questions</h1>
      {data.analysis !== "" && (
        <div style={{ background: "#CCFBF1", border: "1px solid #99F6E4", borderRadius: 12, padding: 14, fontSize: 15 }}>
          {data.analysis}
          <div style={{ fontSize: 12, color: "#5F6E7F", marginTop: 6 }}>Trend analysis{data.engine === "groq" ? " (AI)" : " (bank data)"} — from real flagged topics, never invented years.</div>
        </div>
      )}
      {data.questions.length === 0 && <p style={{ fontSize: 14 }}>Nothing left unattempted in hot topics — you're covered. Review your dashboard instead.</p>}
      {data.questions.map((q) => (
        <div key={q.id} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 14, margin: "10px 0" }}>
          <p style={{ fontSize: 12, color: "#5F6E7F", margin: 0 }}>{q.subject} • {q.topic} • {q.type}</p>
          <p style={{ fontSize: 15, margin: "6px 0" }}>{q.stem}</p>
          <div style={{ display: "flex", gap: 8 }}>
            <a href={`/practice?userId=${userId}&subject=${encodeURIComponent(q.subject)}`} style={{ flex: 1, textAlign: "center", background: "#0F766E", color: "#fff", borderRadius: 10, height: 44, lineHeight: "44px", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>Attempt</a>
            <a href={`/tutor?userId=${userId}&questionId=${q.id}`} style={{ flex: 1, textAlign: "center", background: "#fff", color: "#0F766E", border: "2px solid #0F766E", borderRadius: 10, height: 44, lineHeight: "40px", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>Ask tutor about traps</a>
          </div>
        </div>
      ))}
    </main>
  );
}

export default function Likely() {
  return (
    <Suspense fallback={<main style={{ padding: 20 }}>Loading…</main>}>
      <LikelyInner />
    </Suspense>
  );
}
