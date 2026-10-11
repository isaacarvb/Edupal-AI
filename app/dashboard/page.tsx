"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Profile = { name: string | null; level: string; exam: string; examDate: string | null; subjects: string; language: string; creditsLeft: number; plan: string; streak: number; freezeAvailable: number };

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, margin: "0 0 12px" };

function DashInner() {
  const params = useSearchParams();
  const userId = params.get("userId") ?? "";
  const [profile, setProfile] = useState<Profile | null>(null);
  const [qotd, setQotd] = useState<null | { subject: string; topic: string }>(null);
  const [reminder, setReminder] = useState<string | null>(null);
  const [limits, setLimits] = useState<{ subject: string; left: number }[]>([]);
  const [lastSubject, setLastSubject] = useState<string | null>(null);
  const [attempts, setAttempts] = useState<number | null>(null);
  const limited = params.get("limited") ?? "";

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
        setLimits(d.subjectLimits ?? []);
        setLastSubject(d.lastSubject ?? null);
      });
    fetch(`/api/reminders?userId=${userId}`)
      .then((r) => r.json())
      .then((d) => setReminder(d.reminder ?? null));
    fetch(`/api/qotd?userId=${userId}`)
      .then((r) => r.json())
      .then((d) => setQotd(!d.done && d.question ? { subject: d.question.subject, topic: d.question.topic } : null));
    fetch(`/api/metrics?userId=${userId}`)
      .then((r) => r.json())
      .then((d) => setAttempts(typeof d.totalPracticed === "number" ? d.totalPracticed : null));
  }

  useEffect(refresh, [userId]);

  if (!userId) return <main style={{ padding: 20 }}>Missing user. Start from <a href="/signup">signup</a>.</main>;
  if (!profile) return <main style={{ padding: 20 }}>Loading…</main>;

  const days = profile.examDate ? Math.max(0, Math.ceil((new Date(profile.examDate).getTime() - Date.now()) / 86400000)) : null;
  const firstName = (profile.name ?? "").trim().split(/\s+/)[0] || "Student";
  const greeting = attempts === null ? `Welcome, ${firstName}` : attempts === 0 ? `Welcome, ${firstName}` : `Welcome back, ${firstName}`;

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <h1 style={{ color: "#1E242E", fontSize: 34 }}>{greeting}</h1>

      {/* STATUS */}
      <div style={{ background: "#1E242E", borderRadius: 16, padding: 14, marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          {days !== null && <span style={chipStyle(days)}>{countdownText(profile.exam, days)}</span>}
          <span style={{ fontSize: 13, background: "#0F766E", color: "#fff", padding: "6px 10px", borderRadius: 999 }}>🔥 Streak {profile.streak}</span>
          <span style={{ fontSize: 13, background: "#333A45", color: "#fff", padding: "6px 10px", borderRadius: 999 }}>
            {profile.plan === "UNLIMITED" ? "∞ Unlimited" : `${profile.creditsLeft} free left today`}
          </span>
          <span style={{ fontSize: 13, background: "#333A45", color: "#fff", padding: "6px 10px", borderRadius: 999 }}>{profile.freezeAvailable ? "🧊 Freeze ready" : "🧊 Freeze used"}</span>
        </div>
        {reminder && <p style={{ fontSize: 13, color: "#FDE68A", margin: "8px 0 0" }}>🔔 {reminder} <a href="#practice" style={{ color: "#fff", fontWeight: 700 }}>Practice now</a></p>}
      </div>

      {/* LIMIT BANNER */}
      {limited !== "" && (
        <div style={{ background: "#FFFBEB", border: "2px solid #F59E0B", borderRadius: 16, padding: 12, margin: "0 0 12px" }}>
          <strong>You've reached your free daily limit for {limited}.</strong>
          <p style={{ fontSize: 14, margin: "4px 0 8px" }}>You can continue practicing other subjects for free, or upgrade to Unlimited for full, uninterrupted access across all subjects!</p>
          <div style={{ display: "flex", gap: 8 }}>
            <a href={`/practice?userId=${userId}&subject=${encodeURIComponent((limits.find((l) => l.left > 0) ?? { subject: "English" }).subject)}`} style={{ flex: 1, textAlign: "center", background: "#fff", color: "#1E242E", border: "2px solid #0F766E", borderRadius: 10, height: 44, lineHeight: "40px", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>Practice Another Subject</a>
            <a href={`/subscription?userId=${userId}`} style={{ flex: 1, textAlign: "center", background: "#0F766E", color: "#fff", borderRadius: 10, height: 44, lineHeight: "44px", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>Upgrade to Unlimited</a>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
        <div style={{ flex: "2 1 520px", minWidth: 0 }}>
          {/* QUESTION OF THE DAY */}
          {qotd && (
            <div style={{ background: "#ECFDF5", border: "2px solid #10B981", borderRadius: 16, padding: 12, margin: "0 0 12px" }}>
              <strong>⭐ Question of the Day: {qotd.subject} • {qotd.topic}</strong>
              <p style={{ fontSize: 14, margin: "4px 0 8px" }}>Free bonus — doesn't touch your credits, even at zero.</p>
              <a href={`/practice?userId=${userId}&subject=${encodeURIComponent(qotd.subject)}&qotd=1`} style={{ display: "block", textAlign: "center", background: "#0F766E", color: "#fff", borderRadius: 10, height: 44, lineHeight: "44px", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>Answer today's question</a>
            </div>
          )}

          {/* PRACTICE */}
          <h2 id="practice" style={{ color: "#1E242E", fontSize: 18 }}>Practice</h2>
          <div style={card}>
            <p style={{ fontSize: 14, margin: "0 0 8px" }}>Choose a subject to continue. Budgets reset daily at midnight.</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {limits.map((l) => (
                <a key={l.subject} href={`/practice?userId=${userId}&subject=${encodeURIComponent(l.subject)}`}
                  style={{ fontSize: 13, fontWeight: 700, padding: "10px 14px", borderRadius: 999, textDecoration: "none",
                    background: l.left > 0 || profile.plan === "UNLIMITED" ? "#0F766E" : "#F1F5F9",
                    color: l.left > 0 || profile.plan === "UNLIMITED" ? "#fff" : "#94A3B8" }}>
                  {l.subject} • {profile.plan === "UNLIMITED" ? "∞" : l.left}
                </a>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <a href={lastSubject ? `/practice?userId=${userId}&subject=${encodeURIComponent(lastSubject)}` : `/practice?userId=${userId}`} style={{ flex: 1, textAlign: "center", background: "#0F766E", color: "#fff", borderRadius: 10, height: 48, lineHeight: "48px", fontWeight: 700, fontSize: 15, textDecoration: "none" }}>{lastSubject ? `Continue: ${lastSubject} →` : "Start Practising →"}</a>
            </div>
          </div>
        </div>

        <div style={{ flex: "1 1 280px", minWidth: 0 }}>
          <div style={card}>
            <h3 style={{ margin: "0 0 4px", fontSize: 16 }}>Past paper mode</h3>
            <p style={{ fontSize: 13, margin: "0 0 8px" }}>Full timed paper, scored at the end. Unlimited plan.</p>
            <a href={`/past-paper?userId=${userId}`} style={{ display: "block", textAlign: "center", background: "#fff", color: "#0F766E", border: "2px solid #0F766E", borderRadius: 10, height: 44, lineHeight: "40px", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>Open past paper mode</a>
          </div>
        </div>
      </div>
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
