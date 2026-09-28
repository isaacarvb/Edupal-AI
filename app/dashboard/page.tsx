"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Topic = { subject: string; topic: string; accuracy: number; label: string };
type Profile = { level: string; exam: string; examDate: string | null; subjects: string; language: string; creditsLeft: number; plan: string; streak: number; freezeAvailable: number };

const badge: Record<string, React.CSSProperties> = {
  WEAK: { background: "#DC2626", color: "#fff" },
  NEEDS_WORK: { background: "#F59E0B", color: "#422006" },
  STRONG: { background: "#16A34A", color: "#fff" }
};

function DashInner() {
  const params = useSearchParams();
  const userId = params.get("userId") ?? "";
  const [profile, setProfile] = useState<Profile | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [suggest, setSuggest] = useState<null | { subject: string; topic: string; accuracy: number; label: string }>(null);
  const [reason, setReason] = useState("");
  const [retention, setRetention] = useState<null | { topic: { subject: string; topic: string } }>(null);
  const [reminder, setReminder] = useState<string | null>(null);

  function chipStyle(days: number | null): React.CSSProperties {
    const base: React.CSSProperties = { fontSize: 13, padding: "6px 10px", borderRadius: 999 };
    if (days === null) return { ...base, background: "#F1F5F9", border: "1px solid #E2E8F0", color: "#333A45" };
    if (days <= 7) return { ...base, background: "#FEE2E2", border: "1px solid #FECACA", color: "#991B1B", fontWeight: 700 };
    if (days <= 30) return { ...base, background: "#FEF3C7", border: "1px solid #FDE68A", color: "#92400E", fontWeight: 700 };
    return { ...base, background: "#CCFBF1", border: "1px solid #99F6E4", color: "#2F5D7C" };
  }

  function countdownText(exam: string, days: number): string {
    if (days <= 0) return `${exam}: today — good luck!`;
    if (days <= 7) return `${exam}: ${days} day(s) left — final sprint!`;
    if (days <= 30) return `${exam}: ${days} days left — push!`;
    return `${exam}: ${days} days left`;
  }

  function refresh() {
    if (!userId) return;
    fetch(`/api/topics?userId=${userId}`)
      .then((r) => r.json())
      .then((d) => {
        setProfile(d.profile);
        setTopics(d.topics ?? []);
      });
    fetch(`/api/suggest?userId=${userId}`)
      .then((r) => r.json())
      .then((d) => {
        setSuggest(d.suggestion ?? null);
        setReason(d.reason ?? "");
      });
    fetch(`/api/retention/next?userId=${userId}`)
      .then((r) => r.json())
      .then((d) => setRetention(d.question ? { topic: d.topic } : null));
    fetch(`/api/reminders?userId=${userId}`)
      .then((r) => r.json())
      .then((d) => setReminder(d.reminder ?? null));
  }

  useEffect(refresh, [userId]);

  async function override(topic: Topic, label: string) {
    await fetch("/api/topics/override", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, subject: topic.subject, topic: topic.topic, label })
    });
    refresh();
  }

  if (!userId) return <main style={{ padding: 20 }}>Missing user. Start from <a href="/onboarding">onboarding</a>.</main>;
  if (!profile) return <main style={{ padding: 20 }}>Loading…</main>;

  const days = profile.examDate ? Math.max(0, Math.ceil((new Date(profile.examDate).getTime() - Date.now()) / 86400000)) : null;

  return (
    <main style={{ maxWidth: 420, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <h1 style={{ color: "#1E242E", fontSize: 24 }}>My dashboard</h1>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "8px 0" }}>
        {days !== null && <span style={chipStyle(days)}>{countdownText(profile.exam, days)}</span>}
        <span style={{ fontSize: 13, background: "#CCFBF1", border: "1px solid #99F6E4", color: "#2F5D7C", padding: "6px 10px", borderRadius: 999 }}>Streak {profile.streak}</span>
        <span style={{ fontSize: 13, background: "#F1F5F9", border: "1px solid #E2E8F0", color: "#333A45", padding: "6px 10px", borderRadius: 999 }}>Credits {profile.creditsLeft}</span>
        <span style={{ fontSize: 13, background: "#F1F5F9", border: "1px solid #E2E8F0", color: "#333A45", padding: "6px 10px", borderRadius: 999 }}>{profile.freezeAvailable ? "🧊 Freeze ready" : "🧊 Freeze used"}</span>
      </div>
      {reminder && (
        <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 16, padding: 12, margin: "8px 0" }}>
          <p style={{ fontSize: 14, margin: 0 }}>🔔 {reminder}</p>
        </div>
      )}
      <h2 style={{ color: "#1E242E", fontSize: 18 }}>Next up for you</h2>
      {suggest ? (
        <div style={{ background: "#CCFBF1", border: "1px solid #99F6E4", borderRadius: 16, padding: 12, margin: "8px 0" }}>
          <strong>{suggest.subject} • {suggest.topic}</strong>
          <p style={{ fontSize: 14, margin: "4px 0" }}>{reason}</p>
          <a href={`/practice?userId=${userId}&subject=${encodeURIComponent(suggest.subject)}`} style={{ display: "block", textAlign: "center", background: "#0F766E", color: "#fff", borderRadius: 10, height: 44, lineHeight: "44px", fontWeight: 600, textDecoration: "none" }}>Practice this topic</a>
        </div>
      ) : (
        <p style={{ fontSize: 14 }}>{reason || "Answer a few questions and I'll pick your weakest topic."}</p>
      )}
      {retention && (
        <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 16, padding: 12, margin: "8px 0" }}>
          <strong>Retention refresh: {retention.topic.subject} • {retention.topic.topic}</strong>
          <p style={{ fontSize: 14, margin: "4px 0" }}>It's Strong — a quick refresh keeps it there.</p>
          <a href={`/practice?userId=${userId}&subject=${encodeURIComponent(retention.topic.subject)}`} style={{ color: "#0F766E", fontWeight: 700, fontSize: 14 }}>Refresh now</a>
        </div>
      )}
      <h2 style={{ color: "#1E242E", fontSize: 18 }}>Weak topics first</h2>
      {topics.length === 0 && <p>No practice yet. <a href={`/practice?userId=${userId}&subject=English`} style={{ color: "#0F766E", fontWeight: 700 }}>Start practicing</a></p>}
      {topics.map((t) => (
        <div key={`${t.subject}-${t.topic}`} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 12, margin: "8px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong>{t.subject} • {t.topic}</strong>
            <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 999, ...badge[t.label] }}>{t.label} {Math.round(t.accuracy)}%</span>
          </div>
          <div style={{ height: 8, background: "#E2E8F0", borderRadius: 999, marginTop: 8 }}>
            <div style={{ height: "100%", width: `${Math.round(t.accuracy)}%`, background: "#0F766E", borderRadius: 999 }} />
          </div>
          <label style={{ fontSize: 12, color: "#5F6E7F" }}>Override:{" "}
            <select value="" onChange={(e) => e.target.value && override(t, e.target.value)} style={{ fontSize: 12, borderRadius: 6, border: "1px solid #CBD5E1" }}>
              <option value="">Set label…</option>
              <option value="WEAK">Weak</option>
              <option value="NEEDS_WORK">Needs Work</option>
              <option value="STRONG">Strong</option>
              <option value="AUTO">Back to auto</option>
            </select>
          </label>
        </div>
      ))}
      <a href={`/practice?userId=${userId}&subject=English`} style={{ display: "block", textAlign: "center", background: "#0F766E", color: "#fff", borderRadius: 10, height: 48, lineHeight: "48px", fontWeight: 600, textDecoration: "none", marginTop: 12 }}>Keep practicing</a>
    </main>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<main style={{ padding: 20 }}>Loading…</main>}>
      <DashInner />
    </Suspense>
  );
}
