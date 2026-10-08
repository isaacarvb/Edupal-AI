"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Profile = { level: string; exam: string; examDate: string | null; subjects: string; language: string; creditsLeft: number; plan: string; streak: number; freezeAvailable: number };

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, margin: "0 0 12px" };

function DashInner() {
  const params = useSearchParams();
  const userId = params.get("userId") ?? "";
  const [profile, setProfile] = useState<Profile | null>(null);
  const [qotd, setQotd] = useState<null | { subject: string; topic: string }>(null);
  const [reminder, setReminder] = useState<string | null>(null);
  const [limits, setLimits] = useState<{ subject: string; left: number }[]>([]);
  const [live, setLive] = useState<{ title: string; startsAt: string; meetUrl: string; className: string; liveNow: boolean }[]>([]);
  const [myClasses, setMyClasses] = useState<{ id: string; name: string }[]>([]);
  const [joinCode, setJoinCode] = useState("");
  const [joinMsg, setJoinMsg] = useState("");
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
      });
    fetch(`/api/reminders?userId=${userId}`)
      .then((r) => r.json())
      .then((d) => setReminder(d.reminder ?? null));
    fetch(`/api/qotd?userId=${userId}`)
      .then((r) => r.json())
      .then((d) => setQotd(!d.done && d.question ? { subject: d.question.subject, topic: d.question.topic } : null));
    fetch(`/api/classes?userId=${userId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.role !== "TEACHER") {
          setMyClasses(d.classes ?? []);
          const now = Date.now();
          setLive((d.live ?? []).map((s: { title: string; startsAt: string; meetUrl: string; className: string }) => ({
            ...s,
            liveNow: Date.parse(s.startsAt) <= now + 3600000 && Date.parse(s.startsAt) >= now - 7200000
          })));
        }
      });
  }

  useEffect(refresh, [userId]);

  async function joinClass() {
    setJoinMsg("");
    if (!joinCode.trim()) return;
    const res = await fetch("/api/classes/join", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, code: joinCode.trim() })
    });
    const data = await res.json();
    if (!res.ok) return setJoinMsg(data.error || "Could not join.");
    setJoinCode("");
    setJoinMsg(`Joined ${data.class.name} ✓`);
    refresh();
  }

  if (!userId) return <main style={{ padding: 20 }}>Missing user. Start from <a href="/signup">signup</a>.</main>;
  if (!profile) return <main style={{ padding: 20 }}>Loading…</main>;

  const days = profile.examDate ? Math.max(0, Math.ceil((new Date(profile.examDate).getTime() - Date.now()) / 86400000)) : null;

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <h1 style={{ color: "#1E242E", fontSize: 24 }}>My dashboard</h1>

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

          {/* LIVE CLASS */}
          <h2 style={{ color: "#1E242E", fontSize: 18 }}>Live class</h2>
          <div style={card}>
            {live.filter((s) => s.liveNow && s.meetUrl).map((s, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <span style={{ fontWeight: 800, color: "#DC2626" }}>🔴 LIVE NOW:</span> <strong>{s.title}</strong> ({s.className})
                <a href={s.meetUrl} target="_blank" rel="noreferrer" style={{ display: "block", textAlign: "center", background: "#DC2626", color: "#fff", borderRadius: 10, height: 44, lineHeight: "44px", fontWeight: 800, textDecoration: "none", marginTop: 6 }}>Join live</a>
              </div>
            ))}
            {live.filter((s) => !s.liveNow).slice(0, 3).map((s, i) => (
              <div key={i} style={{ fontSize: 14, padding: "4px 0" }}>⏰ {s.title} ({s.className}) — {s.startsAt.slice(0, 16).replace("T", " ")}</div>
            ))}
            {live.length === 0 && <p style={{ fontSize: 14, margin: "0 0 8px" }}>No live sessions. Join your teacher's class with their code:</p>}
            {myClasses.length > 0 && <p style={{ fontSize: 13, color: "#5F6E7F", margin: "0 0 8px" }}>My classes: {myClasses.map((c) => c.name).join(", ")}</p>}
            <div style={{ display: "flex", gap: 8 }}>
              <input value={joinCode} onChange={(e) => setJoinCode(e.target.value)} placeholder="Class code e.g. ABC-1234" style={{ flex: 1, height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 10px", fontSize: 14 }} />
              <button onClick={joinClass} style={{ height: 44, borderRadius: 10, border: 0, background: "#1E242E", color: "#fff", fontWeight: 700, padding: "0 18px", cursor: "pointer" }}>Join</button>
            </div>
            {joinMsg && <p style={{ fontSize: 13, marginTop: 6 }}>{joinMsg}</p>}
          </div>

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
              <a href={`/past-paper?userId=${userId}`} style={{ flex: 1, textAlign: "center", background: "#fff", color: "#0F766E", border: "2px solid #0F766E", borderRadius: 10, height: 44, lineHeight: "40px", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>Past paper mode</a>
              <a href={`/weak-topics?userId=${userId}`} style={{ flex: 1, textAlign: "center", background: "#1E242E", color: "#fff", borderRadius: 10, height: 44, lineHeight: "44px", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>My weak topics</a>
            </div>
          </div>
        </div>

        <div style={{ flex: "1 1 280px", minWidth: 0 }}>
          <div style={card}>
            <h3 style={{ margin: "0 0 4px", fontSize: 16 }}>Today</h3>
            <p style={{ fontSize: 14, margin: 0 }}>Plan: <strong>{profile.plan}</strong></p>
            <p style={{ fontSize: 13, margin: "6px 0 0" }}><a href={`/study-plan?userId=${userId}`} style={{ color: "#0F766E", fontWeight: 700 }}>My week plan</a> • <a href={`/metrics?userId=${userId}`} style={{ color: "#0F766E", fontWeight: 700 }}>My progress</a> • <a href="/glossary" style={{ color: "#0F766E", fontWeight: 700 }}>Glossary</a></p>
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
