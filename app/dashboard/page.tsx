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

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/topics?userId=${userId}`)
      .then((r) => r.json())
      .then((d) => {
        setProfile(d.profile);
        setTopics(d.topics ?? []);
      });
  }, [userId]);

  if (!userId) return <main style={{ padding: 20 }}>Missing user. Start from <a href="/onboarding">onboarding</a>.</main>;
  if (!profile) return <main style={{ padding: 20 }}>Loading…</main>;

  const days = profile.examDate ? Math.max(0, Math.ceil((new Date(profile.examDate).getTime() - Date.now()) / 86400000)) : null;

  return (
    <main style={{ maxWidth: 420, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <h1 style={{ color: "#1E242E", fontSize: 24 }}>My dashboard</h1>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "8px 0" }}>
        {days !== null && <span style={{ fontSize: 13, background: "#CCFBF1", border: "1px solid #99F6E4", color: "#2F5D7C", padding: "6px 10px", borderRadius: 999 }}>{profile.exam}: {days} days left</span>}
        <span style={{ fontSize: 13, background: "#CCFBF1", border: "1px solid #99F6E4", color: "#2F5D7C", padding: "6px 10px", borderRadius: 999 }}>Streak {profile.streak}</span>
        <span style={{ fontSize: 13, background: "#F1F5F9", border: "1px solid #E2E8F0", color: "#333A45", padding: "6px 10px", borderRadius: 999 }}>Credits {profile.creditsLeft}</span>
      </div>
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
