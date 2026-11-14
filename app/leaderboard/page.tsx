"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  formatStudyTime,
  LEAGUES,
  type LeaderboardMetric,
  type LeaderboardScope,
  type League
} from "@/lib/leaderboard-shared";

type Entry = {
  userId: string;
  name: string;
  className: string;
  xp: number;
  seconds: number;
  tier: League;
  rank: number;
  isMe: boolean;
};

type Payload = {
  ok: boolean;
  scope: LeaderboardScope;
  metric: LeaderboardMetric;
  weekStart: string;
  weekEnd: string;
  weekStartDay: string;
  school: { id: string; name: string | null } | null;
  className: string | null;
  total: number;
  reason: string;
  me: (Entry & { hidden: boolean; rank: number | null }) | null;
  entries: Entry[];
};

const card: React.CSSProperties = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16 };

const SCOPES: Array<{ key: LeaderboardScope; label: string; emoji: string }> = [
  { key: "class", label: "My class", emoji: "🏫" },
  { key: "school", label: "My school", emoji: "🎓" },
  { key: "global", label: "Global", emoji: "🌍" }
];

function medal(rank: number): string {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return "";
}

function valueOf(entry: { xp: number; seconds: number }, metric: LeaderboardMetric): string {
  return metric === "xp" ? `${entry.xp.toLocaleString()} XP` : formatStudyTime(entry.seconds);
}

function Avatar({ name, size = 38, colour = "#0F766E" }: { name: string; size?: number; colour?: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || "S";
  return (
    <span
      aria-hidden
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        background: colour,
        color: "#fff",
        fontWeight: 900,
        fontSize: size * 0.42,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0
      }}
    >
      {initial}
    </span>
  );
}

function TierChip({ tier }: { tier: League }) {
  return (
    <span
      title={`${tier.name} league · ${tier.minXp}+ XP this week`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: 10,
        fontWeight: 900,
        background: tier.soft,
        color: tier.colour,
        border: `1px solid ${tier.colour}33`,
        borderRadius: 999,
        padding: "2px 8px",
        whiteSpace: "nowrap"
      }}
    >
      {tier.emoji} {tier.name}
    </span>
  );
}

function LeaderboardInner() {
  const params = useSearchParams();
  const [userId, setUserId] = useState("");
  const [scope, setScope] = useState<LeaderboardScope | "auto">("auto");
  const [metric, setMetric] = useState<LeaderboardMetric>("xp");
  const [data, setData] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setUserId(params.get("userId") ?? localStorage.getItem("edupal_user") ?? "");
  }, [params]);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError("");
    fetch(`/api/leaderboard?userId=${encodeURIComponent(userId)}&scope=${scope}&metric=${metric}`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Could not load the leaderboard.");
        setData(json);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load the leaderboard."))
      .finally(() => setLoading(false));
  }, [userId, scope, metric]);

  const activeScope: LeaderboardScope = data?.scope ?? (scope === "auto" ? "global" : scope);

  const resetLabel = useMemo(() => {
    if (!data?.weekEnd) return "";
    try {
      return new Date(data.weekEnd).toLocaleString("en-NG", {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Africa/Lagos"
      });
    } catch {
      return "";
    }
  }, [data]);

  const top3 = data?.entries.slice(0, 3) ?? [];
  const rest = data?.entries.slice(3) ?? [];
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean) as Entry[];

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: 20, color: "#333A45" }}>
      {/* HERO */}
      <section
        style={{
          background: "linear-gradient(135deg, #1E1B4B 0%, #4338CA 48%, #0F766E 100%)",
          borderRadius: 22,
          padding: "24px 26px",
          color: "#fff",
          boxShadow: "0 20px 44px -22px rgb(67 56 202 / 0.6)"
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 1.6, textTransform: "uppercase", color: "#C7D2FE" }}>
          🏆 Weekly leaderboard
        </div>
        <h1 style={{ fontSize: 30, margin: "8px 0 6px", lineHeight: 1.15 }}>Climb the league</h1>
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: "#E0E7FF", maxWidth: 620 }}>
          Earn XP every time you practise. Compare with your class, your school or every EduPal student —
          a fresh race starts every Monday.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
          <span style={{ fontSize: 11, fontWeight: 800, background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 999, padding: "5px 11px" }}>
            🔁 Resets Monday 00:00 WAT
          </span>
          {resetLabel && (
            <span style={{ fontSize: 11, fontWeight: 800, background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 999, padding: "5px 11px" }}>
              ⏳ Next reset: {resetLabel}
            </span>
          )}
          <span style={{ fontSize: 11, fontWeight: 800, background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 999, padding: "5px 11px" }}>
            🛡 300 XP/day cap
          </span>
        </div>
      </section>

      {/* CONTROLS */}
      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          margin: "16px 0 12px"
        }}
      >
        <div role="tablist" aria-label="Leaderboard scope" style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {SCOPES.map((s) => {
            const active = activeScope === s.key;
            return (
              <button
                key={s.key}
                role="tab"
                aria-selected={active}
                onClick={() => setScope(s.key)}
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  borderRadius: 999,
                  padding: "9px 15px",
                  cursor: "pointer",
                  background: active ? "#1E242E" : "#fff",
                  color: active ? "#fff" : "#334155",
                  border: active ? "1px solid #1E242E" : "1px solid #CBD5E1"
                }}
              >
                {s.emoji} {s.label}
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff", border: "1px solid #CBD5E1", borderRadius: 999, padding: 3 }}>
          {([
            { key: "xp" as const, label: "XP", emoji: "⚡" },
            { key: "time" as const, label: "Study time", emoji: "⏱" }
          ]).map((m) => {
            const active = metric === m.key;
            return (
              <button
                key={m.key}
                onClick={() => setMetric(m.key)}
                aria-pressed={active}
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  borderRadius: 999,
                  padding: "7px 13px",
                  border: 0,
                  cursor: "pointer",
                  background: active ? "#0F766E" : "transparent",
                  color: active ? "#fff" : "#475569"
                }}
              >
                {m.emoji} {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <p style={{ background: "#FFF1F2", border: "1px solid #FECACA", color: "#B91C1C", borderRadius: 12, padding: "10px 14px", fontSize: 13 }}>
          {error}
        </p>
      )}

      {/* YOUR POSITION */}
      {data?.me && (
        <section
          style={{
            ...card,
            padding: 16,
            marginBottom: 12,
            display: "flex",
            alignItems: "center",
            gap: 14,
            flexWrap: "wrap",
            borderColor: data.me.hidden ? "#E2E8F0" : "#99F6E4",
            background: data.me.hidden ? "#F8FAFC" : "linear-gradient(120deg,#F0FDFA 0%,#FFFFFF 60%)"
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 1, textTransform: "uppercase", color: "#0F766E", width: "100%" }}>
            Your position
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flex: "1 1 220px", minWidth: 0 }}>
            <Avatar name={data.me.name} size={46} colour="#1E242E" />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: "#1E242E" }}>{data.me.name}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginTop: 3 }}>
                <TierChip tier={data.me.tier} />
                {data.className && <span style={{ fontSize: 11, color: "#5F6E7F", fontWeight: 700 }}>{data.className}</span>}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 0.8, textTransform: "uppercase", color: "#94A3B8" }}>Rank</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#1E242E" }}>
                {data.me.hidden ? "Hidden" : data.me.rank ? `#${data.me.rank}` : "—"}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 0.8, textTransform: "uppercase", color: "#94A3B8" }}>XP</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#0F766E" }}>{data.me.xp.toLocaleString()}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 0.8, textTransform: "uppercase", color: "#94A3B8" }}>Study time</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#1E242E" }}>{formatStudyTime(data.me.seconds)}</div>
            </div>
          </div>
          {data.me.hidden && (
            <div style={{ width: "100%", fontSize: 12, color: "#92400E", background: "#FEF3C7", border: "1px solid #FDE68A", borderRadius: 10, padding: "8px 12px" }}>
              You are hidden from the public list. Your rank is still counted for you only.{" "}
              <a href="/settings" style={{ color: "#92400E", fontWeight: 800 }}>Change in Settings</a>
            </div>
          )}
        </section>
      )}

      {loading && (
        <div style={{ ...card, padding: 24, marginBottom: 12 }}>
          <div style={{ height: 16, width: 180, borderRadius: 8, background: "#E2E8F0", marginBottom: 12 }} />
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{ height: 44, borderRadius: 10, background: "#F8FAFC", marginBottom: 8 }} />
          ))}
        </div>
      )}

      {!loading && data && data.reason && (
        <div style={{ ...card, padding: 26, textAlign: "center", background: "#F8FAFC", borderStyle: "dashed", marginBottom: 12 }}>
          <div style={{ fontSize: 32, marginBottom: 6 }}>🏫</div>
          <div style={{ fontSize: 16, fontWeight: 900, color: "#1E242E", marginBottom: 4 }}>No class or school yet</div>
          <p style={{ fontSize: 14, color: "#5F6E7F", margin: 0 }}>{data.reason}</p>
        </div>
      )}

      {/* PODIUM */}
      {!loading && data && !data.reason && data.entries.length > 0 && (
        <section style={{ ...card, padding: "18px 16px 0", marginBottom: 12, overflow: "hidden" }}>
          <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 1, textTransform: "uppercase", color: "#94A3B8", marginBottom: 12 }}>
            Top of the {activeScope === "class" ? "class" : activeScope === "school" ? "school" : "world"}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8, alignItems: "end" }}>
            {podiumOrder.map((entry) => {
              const first = entry.rank === 1;
              const height = first ? 122 : entry.rank === 2 ? 100 : 86;
              const bg = first ? "linear-gradient(180deg,#FEF9C3,#FDE68A)" : entry.rank === 2 ? "linear-gradient(180deg,#F1F5F9,#E2E8F0)" : "linear-gradient(180deg,#FFF7ED,#FED7AA)";
              return (
                <div key={entry.userId} style={{ textAlign: "center", minWidth: 0 }}>
                  <div style={{ fontSize: 26, lineHeight: 1 }}>{medal(entry.rank)}</div>
                  <div style={{ display: "flex", justifyContent: "center", margin: "6px 0" }}>
                    <Avatar name={entry.name} size={first ? 50 : 42} colour={first ? "#A16207" : "#475569"} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: "#1E242E", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {entry.name}{entry.isMe ? " (you)" : ""}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#5F6E7F", marginBottom: 8 }}>{valueOf(entry, metric)}</div>
                  <div
                    style={{
                      height,
                      background: bg,
                      borderRadius: "12px 12px 0 0",
                      border: "1px solid #E2E8F0",
                      borderBottom: 0,
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "center",
                      paddingTop: 10,
                      fontSize: 20,
                      fontWeight: 900,
                      color: "#475569"
                    }}
                  >
                    #{entry.rank}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* FULL LIST */}
      {!loading && data && !data.reason && data.entries.length > 0 && (
        <section style={{ ...card, padding: 8, marginBottom: 12 }}>
          {rest.length === 0 && (
            <div style={{ padding: 16, fontSize: 13, color: "#5F6E7F" }}>
              Only {data.entries.length} student{data.entries.length === 1 ? "" : "s"} on this board so far.
            </div>
          )}
          {rest.map((entry) => (
            <div
              key={entry.userId}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                borderRadius: 12,
                background: entry.isMe ? "#F0FDFA" : "transparent",
                border: entry.isMe ? "1px solid #99F6E4" : "1px solid transparent"
              }}
            >
              <span style={{ width: 30, textAlign: "right", fontSize: 13, fontWeight: 900, color: "#94A3B8", flexShrink: 0 }}>#{entry.rank}</span>
              <Avatar name={entry.name} size={34} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#1E242E", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {entry.name}{entry.isMe ? " · you" : ""}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginTop: 2 }}>
                  <TierChip tier={entry.tier} />
                  {entry.className && <span style={{ fontSize: 11, color: "#5F6E7F" }}>{entry.className}</span>}
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 900, color: metric === "xp" ? "#0F766E" : "#1E242E" }}>{valueOf(entry, metric)}</div>
                <div style={{ fontSize: 11, color: "#94A3B8" }}>{metric === "xp" ? formatStudyTime(entry.seconds) : `${entry.xp.toLocaleString()} XP`}</div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* LEAGUES */}
      <section style={{ ...card, padding: 16, marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 1, textTransform: "uppercase", color: "#94A3B8", marginBottom: 10 }}>
          League tiers this week
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {LEAGUES.map((league) => (
            <span
              key={league.name}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                fontWeight: 800,
                background: league.soft,
                color: league.colour,
                border: `1px solid ${league.colour}33`,
                borderRadius: 999,
                padding: "6px 12px"
              }}
            >
              {league.emoji} {league.name}
              <span style={{ fontWeight: 600, opacity: 0.8 }}>{league.minXp}+ XP</span>
            </span>
          ))}
        </div>
        <p style={{ fontSize: 12, color: "#5F6E7F", margin: "10px 0 0" }}>
          Promotion and demotion arrive in a later update. For now the tier is a weekly badge based on XP.
        </p>
      </section>

      {/* HOW IT WORKS + PRIVACY */}
      <section style={{ ...card, padding: 16, background: "#F8FAFC" }}>
        <div style={{ fontSize: 13, fontWeight: 900, color: "#1E242E", marginBottom: 6 }}>How the scores work</div>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: "#475569", lineHeight: 1.8 }}>
          <li>+10 XP for every correct answer, +2 XP for trying a question.</li>
          <li>300 XP maximum per day — practice more than that and you still keep your streak.</li>
          <li>Study time counts the minutes your EduPal tab is open and visible.</li>
          <li>Names show as first name + last initial. Hide yourself any time in{" "}
            <a href="/settings" style={{ color: "#0F766E", fontWeight: 800 }}>Settings</a>.
          </li>
        </ul>
      </section>
    </main>
  );
}

export default function LeaderboardPage() {
  return (
    <Suspense fallback={<main style={{ padding: 20 }}>Loading leaderboard…</main>}>
      <LeaderboardInner />
    </Suspense>
  );
}
