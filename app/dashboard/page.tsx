"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Topic = { subject: string; topic: string; accuracy: number; label: string };
type Profile = { name: string | null; level: string; exam: string; examDate: string | null; subjects: string; language: string; creditsLeft: number; plan: string; streak: number; freezeAvailable: number };

const badge: Record<string, React.CSSProperties> = {
  WEAK: { background: "#DC2626", color: "#fff" },
  NEEDS_WORK: { background: "#F59E0B", color: "#422006" },
  STRONG: { background: "#16A34A", color: "#fff" }
};

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: 16, margin: "0 0 12px" };

function DashInner() {
  const params = useSearchParams();
  const userId = params.get("userId") ?? "";
  const [profile, setProfile] = useState<Profile | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [suggest, setSuggest] = useState<null | { subject: string; topic: string; accuracy: number; label: string }>(null);
  const [reason, setReason] = useState("");
  const [retention, setRetention] = useState<null | { topic: { subject: string; topic: string } }>(null);
  const [patterns, setPatterns] = useState<{ text: string; detail: string }[]>([]);
  const [reminder, setReminder] = useState<string | null>(null);
  const [deadline, setDeadline] = useState<null | { title: string; closesOn: string }>(null);
  const [qotd, setQotd] = useState<null | { subject: string; topic: string }>(null);
  const [parentEmail, setParentEmail] = useState("");
  const [payMsg, setPayMsg] = useState("");
  const [paid, setPaid] = useState(false);
  const [limits, setLimits] = useState<{ subject: string; left: number }[]>([]);
  const [exhaustedAll, setExhaustedAll] = useState(false);
  const [referral, setReferral] = useState<null | { code: string; bonusLeft: number; invites: number }>(null);
  const [copied, setCopied] = useState(false);
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
        setTopics(d.topics ?? []);
        setLimits(d.subjectLimits ?? []);
        setExhaustedAll(!!d.exhaustedAll);
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
    fetch("/api/deadlines")
      .then((r) => r.json())
      .then((d) => setDeadline(d.upcoming ? { title: d.upcoming.title, closesOn: d.upcoming.closesOn } : null));
    fetch(`/api/patterns?userId=${userId}`)
      .then((r) => r.json())
      .then((d) => setPatterns(d.patterns ?? []));
    fetch(`/api/referral?userId=${userId}`)
      .then((r) => r.json())
      .then((d) => setReferral(d.code ? d : null));
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
    fetch(`/api/qotd?userId=${userId}`)
      .then((r) => r.json())
      .then((d) => setQotd(!d.done && d.question ? { subject: d.question.subject, topic: d.question.topic } : null));
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

  async function pay() {
    setPayMsg("");
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, parentEmail: parentEmail || undefined })
    });
    const data = await res.json();
    if (!res.ok) return setPayMsg(data.needsParent ? "Since you're in secondary school, add a parent or guardian's contact so they can support your subscription and stay updated." : data.error);
    if (data.mode === "paystack" && data.authorizationUrl) {
      window.location.href = data.authorizationUrl; // real Paystack page (test mode: no real money)
      return;
    }
    setPaid(true);
    refresh();
  }

  useEffect(() => {
    if (params.get("paid") === "1") {
      setPaid(true);
      refresh();
    }
  }, [userId]);

  if (!userId) return <main style={{ padding: 20 }}>Missing user. Start from <a href="/signup">signup</a>.</main>;
  if (!profile) return <main style={{ padding: 20 }}>Loading…</main>;

  const days = profile.examDate ? Math.max(0, Math.ceil((new Date(profile.examDate).getTime() - Date.now()) / 86400000)) : null;
  const openSubjects = limits.filter((l) => l.left > 0);

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 20, color: "#333A45" }}>
      <h1 style={{ color: "#1E242E", fontSize: 24 }}>My dashboard</h1>
      {qotd && (
        <div style={{ background: "#ECFDF5", border: "2px solid #10B981", borderRadius: 16, padding: 12, margin: "8px 0" }}>
          <strong>⭐ Question of the Day: {qotd.subject} • {qotd.topic}</strong>
          <p style={{ fontSize: 14, margin: "4px 0 8px" }}>Free bonus — doesn't touch your credits, even at zero.</p>
          <a href={`/practice?userId=${userId}&subject=${encodeURIComponent(qotd.subject)}&qotd=1`} style={{ display: "block", textAlign: "center", background: "#0F766E", color: "#fff", borderRadius: 10, height: 44, lineHeight: "44px", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>Answer today's question</a>
        </div>
      )}
      {deadline ? (
        <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 16, padding: 12, margin: "8px 0" }}>
          <p style={{ fontSize: 14, margin: 0 }}>📅 <strong>{deadline.title}</strong> — closes {deadline.closesOn}. <a href="/deadlines" style={{ color: "#0F766E", fontWeight: 700 }}>All deadlines</a></p>
        </div>
      ) : (
        <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 16, padding: 12, margin: "8px 0" }}>
          <p style={{ fontSize: 14, margin: 0 }}>📅 No dated deadlines right now — new cycles appear here. <a href="/deadlines" style={{ color: "#0F766E", fontWeight: 700 }}>Watchlist</a></p>
        </div>
      )}
      {reminder && (
        <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 16, padding: 12, margin: "8px 0" }}>
          <p style={{ fontSize: 14, margin: 0 }}><span className="deco">🔔 </span>{reminder}</p>
        </div>
      )}
      {limited !== "" && (
        <div style={{ background: "#FFFBEB", border: "2px solid #F59E0B", borderRadius: 16, padding: 12, margin: "8px 0" }}>
          <strong>You've reached your free daily limit for {limited}.</strong>
          <p style={{ fontSize: 14, margin: "4px 0 8px" }}>You can continue practicing other subjects for free, or upgrade to Unlimited for full, uninterrupted access across all subjects!</p>
          <div style={{ display: "flex", gap: 8 }}>
            <a href={`/practice?userId=${userId}&subject=${encodeURIComponent((openSubjects[0] ?? { subject: "English" }).subject)}`} style={{ flex: 1, textAlign: "center", background: "#fff", color: "#1E242E", border: "2px solid #0F766E", borderRadius: 10, height: 44, lineHeight: "40px", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>Practice Another Subject</a>
            <a href="#upgrade" style={{ flex: 1, textAlign: "center", background: "#0F766E", color: "#fff", borderRadius: 10, height: 44, lineHeight: "44px", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>Upgrade to Unlimited</a>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
        {/* MAIN COLUMN */}
        <div style={{ flex: "2 1 520px", minWidth: 0 }}>
          <div style={{ ...card, background: "#1E242E", color: "#fff", border: "none" }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              {days !== null && <span style={chipStyle(days)}>{countdownText(profile.exam, days)}</span>}
              <span style={{ fontSize: 13, background: "#0F766E", padding: "6px 10px", borderRadius: 999 }}>🔥 Streak {profile.streak}</span>
              <span style={{ fontSize: 13, background: "#333A45", padding: "6px 10px", borderRadius: 999 }}>
                {profile.plan === "UNLIMITED" ? "∞ Unlimited" : `${profile.creditsLeft} free left today`}
              </span>
              <span style={{ fontSize: 13, background: "#333A45", padding: "6px 10px", borderRadius: 999 }}>{profile.freezeAvailable ? "🧊 Freeze ready" : "🧊 Freeze used"}</span>
            </div>
          </div>

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

          <h2 id="topics" style={{ color: "#1E242E", fontSize: 18 }}>Weak topics first</h2>
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
          <a href={`/practice?userId=${userId}&subject=English`} style={{ display: "block", textAlign: "center", background: "#0F766E", color: "#fff", borderRadius: 10, height: 48, lineHeight: "48px", fontWeight: 600, textDecoration: "none", marginTop: 12 }}>Keep practicing</a>
          <a href={`/past-paper?userId=${userId}`} style={{ display: "block", textAlign: "center", background: "#fff", color: "#0F766E", border: "2px solid #0F766E", borderRadius: 10, height: 48, lineHeight: "44px", fontWeight: 700, fontSize: 14, textDecoration: "none", marginTop: 8 }}>Past paper mode (Unlimited)</a>
        </div>

        {/* SIDE COLUMN */}
        <div style={{ flex: "1 1 280px", minWidth: 0 }}>
          <div style={card}>
            <h3 style={{ margin: "0 0 8px", fontSize: 16 }}>Switch subject</h3>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {limits.map((l) => (
                <a key={l.subject} href={`/practice?userId=${userId}&subject=${encodeURIComponent(l.subject)}`}
                  style={{ fontSize: 13, fontWeight: 600, padding: "8px 12px", borderRadius: 999, textDecoration: "none",
                    background: l.left > 0 || profile.plan === "UNLIMITED" ? "#CCFBF1" : "#F1F5F9",
                    color: l.left > 0 || profile.plan === "UNLIMITED" ? "#0F766E" : "#94A3B8",
                    border: "1px solid #99F6E4" }}>
                  {l.subject} • {profile.plan === "UNLIMITED" ? "∞" : l.left}
                </a>
              ))}
            </div>
          </div>

          <div id="resources" style={card}>
            <h3 style={{ margin: "0 0 8px", fontSize: 16 }}>Study resources</h3>
            <a href={`/dashboard/curriculum?userId=${userId}`} style={{ display: "block", textAlign: "center", background: "#fff", color: "#0F766E", border: "2px solid #0F766E", borderRadius: 10, height: 44, lineHeight: "40px", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>Curriculum &amp; Notes</a>
          </div>

          <div id="upgrade" style={card}>
            <h3 style={{ margin: "0 0 8px", fontSize: 16 }}>Subscription &amp; Credits</h3>
            <p style={{ fontSize: 14, margin: "0 0 8px" }}>Plan: <strong>{profile.plan}</strong>{referral && referral.bonusLeft > 0 && <span> • 🎁 {referral.bonusLeft} bonus left</span>}</p>
            {profile.plan === "FREE" && exhaustedAll && !paid ? (
              <>
                <p style={{ fontSize: 14 }}>Out of free questions everywhere today. One subscription unlocks unlimited practice + parent dashboard.</p>
                {profile.level === "SECONDARY" && (
                  <input value={parentEmail} onChange={(e) => setParentEmail(e.target.value)} placeholder="Parent/guardian email" style={{ width: "100%", height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 10px", fontSize: 14, marginBottom: 8, boxSizing: "border-box" }} />
                )}
                {payMsg && <p style={{ fontSize: 13, color: "#DC2626" }}>{payMsg}</p>}
                <button onClick={pay} style={{ display: "block", width: "100%", height: 48, borderRadius: 10, border: 0, background: "#0F766E", color: "#fff", fontWeight: 700, fontSize: 16, cursor: "pointer" }}>Pay with Paystack (test)</button>
              </>
            ) : profile.plan === "FREE" ? (
              <p style={{ fontSize: 14, margin: 0 }}>Free plan: 10 questions per subject daily. Resets at midnight.</p>
            ) : (
              <p style={{ fontSize: 14, margin: 0 }}>✓ Unlimited active — practice anything, anytime.</p>
            )}
            {paid && <p style={{ color: "#16A34A", fontWeight: 700 }}>✓ Unlimited unlocked. Parent link sent.</p>}
          </div>

          {referral && (
            <div style={card}>
              <h3 style={{ margin: "0 0 8px", fontSize: 16 }}>Invite a classmate</h3>
              <p style={{ fontSize: 14, margin: "0 0 8px" }}>Share your link — you earn <strong>5 extra free questions today</strong> when they join. ({referral.invites} joined so far)</p>
              <div style={{ display: "flex", gap: 8 }}>
                <input readOnly value={typeof window !== "undefined" ? `${window.location.origin}/signup?ref=${referral.code}` : ""} style={{ flex: 1, height: 44, borderRadius: 10, border: "1px solid #CBD5E1", padding: "0 10px", fontSize: 12, minWidth: 0 }} />
                <button onClick={() => { navigator.clipboard?.writeText(`${window.location.origin}/signup?ref=${referral.code}`); setCopied(true); }} style={{ height: 44, borderRadius: 10, border: 0, background: "#0F766E", color: "#fff", fontWeight: 700, padding: "0 16px", cursor: "pointer" }}>
                  {copied ? "Copied ✓" : "Copy"}
                </button>
              </div>
            </div>
          )}
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
