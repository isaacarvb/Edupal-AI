// Pure leaderboard helpers — safe to import from client components.
//
// Everything resets at Monday 00:00 West Africa Time (UTC+1, no daylight
// saving). XP is earned from practice attempts and capped at 300 per WAT day;
// study time is heartbeated from the app in one-minute chunks.

export const WAT_OFFSET_MS = 60 * 60 * 1000;
export const XP_PER_CORRECT = 10;
export const XP_PER_ATTEMPT = 2;
export const DAILY_XP_CAP = 300;

export type LeaderboardMetric = "xp" | "time";
export type LeaderboardScope = "class" | "school" | "global";

export type League = {
  name: string;
  emoji: string;
  minXp: number;
  colour: string;
  soft: string;
};

// Tiers only for now. Promotion and demotion come later; this week's XP decides
// which badge a student sees next to their name.
export const LEAGUES: League[] = [
  { name: "Bronze", emoji: "🥉", minXp: 0, colour: "#B45309", soft: "#FEF3C7" },
  { name: "Silver", emoji: "🥈", minXp: 100, colour: "#475569", soft: "#F1F5F9" },
  { name: "Gold", emoji: "🥇", minXp: 250, colour: "#A16207", soft: "#FEF9C3" },
  { name: "Platinum", emoji: "💎", minXp: 500, colour: "#0F766E", soft: "#CCFBF1" },
  { name: "Diamond", emoji: "👑", minXp: 900, colour: "#4338CA", soft: "#E0E7FF" }
];

export function tierFor(xp: number): League {
  let found = LEAGUES[0];
  for (const league of LEAGUES) if (xp >= league.minXp) found = league;
  return found;
}

export function isoDayFromMs(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

export function todayWatDay(now = new Date()): string {
  return isoDayFromMs(now.getTime() + WAT_OFFSET_MS);
}

export function addOneDay(day: string): string {
  return isoDayFromMs(Date.parse(`${day}T00:00:00.000Z`) + 86400000);
}

// Returns the current week's Monday 00:00 WAT as both a WAT date string and the
// matching UTC instant used to filter ISO timestamps.
export function currentWeek(now = new Date()): {
  startDay: string;
  endDay: string;
  startUtcIso: string;
  endUtcIso: string;
} {
  const wat = new Date(now.getTime() + WAT_OFFSET_MS);
  const daysSinceMonday = (wat.getUTCDay() + 6) % 7;
  const startWatMs = Date.UTC(wat.getUTCFullYear(), wat.getUTCMonth(), wat.getUTCDate() - daysSinceMonday);
  const endWatMs = startWatMs + 7 * 86400000;
  return {
    startDay: isoDayFromMs(startWatMs),
    endDay: isoDayFromMs(endWatMs),
    startUtcIso: new Date(startWatMs - WAT_OFFSET_MS).toISOString(),
    endUtcIso: new Date(endWatMs - WAT_OFFSET_MS).toISOString()
  };
}

export function xpForAttempt(correct: number | boolean): number {
  return correct ? XP_PER_CORRECT : XP_PER_ATTEMPT;
}

// First name + last initial keeps classmates from seeing full names.
export function displayName(name: string | null | undefined, email?: string | null): string {
  const raw = (name ?? "").trim();
  const fallback = (email ?? "").split("@")[0].replace(/[^a-zA-Z\s]/g, " ").trim();
  const source = raw || fallback;
  if (!source) return "Student";
  const parts = source.split(/\s+/).filter(Boolean);
  const first = parts[0].slice(0, 24);
  const initial = parts.length > 1 ? parts[parts.length - 1].charAt(0).toUpperCase() : "";
  const pretty = first.charAt(0).toUpperCase() + first.slice(1);
  return initial ? `${pretty} ${initial}.` : pretty;
}

export function formatStudyTime(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.round((s % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m`;
  return `${s}s`;
}
