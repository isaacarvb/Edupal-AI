// Site-wide settings the admin controls from the portal. Everything here is
// read from site_settings (key/value) with a short in-memory cache so admin
// changes show up on the user side within seconds, with no redeploy.
import { getDb } from "./db";

export type TopicAccess = "FREE" | "UNLIMITED" | "HIDDEN";

export type SiteSettings = {
  // Free plan ("pilot") rules.
  freeDailyLimit: number; // questions per subject per period
  freeResetDays: number; // period length in days
  freeResetTime: string; // HH:MM (Africa/Lagos) the period starts
  freeLimitChangedAt: number; // epoch ms of last daily-limit change (forces refill)
  // Per-topic notes overrides, key = `${level}|${subject}|${topic}`.
  notesAccess: Record<string, TopicAccess>;
};

export const SETTINGS_KEYS = [
  "free_daily_limit",
  "free_reset_days",
  "free_reset_time",
  "free_limit_changed_at",
  "notes_access",
] as const;

const DEFAULTS: SiteSettings = {
  freeDailyLimit: 10,
  freeResetDays: 1,
  freeResetTime: "00:00",
  freeLimitChangedAt: 0,
  notesAccess: {},
};

let cache: { at: number; val: SiteSettings } | null = null;
const TTL_MS = 8000;

// Call right after an admin write so this process sees it instantly
// (other serverless instances pick it up within the TTL).
export function invalidateSiteSettings(): void {
  cache = null;
}

function clampInt(raw: string | undefined, fallback: number, min: number, max: number): number {
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.floor(n)));
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.val;
  try {
    const db = await getDb();
    const rows = (await db
      .prepare(`SELECT key, value FROM site_settings WHERE key IN (${SETTINGS_KEYS.map(() => "?").join(",")})`)
      .all(...SETTINGS_KEYS)) as { key: string; value: string }[];
    const m = new Map(rows.map((r) => [r.key, r.value]));

    let notesAccess: Record<string, TopicAccess> = {};
    try {
      const parsed = JSON.parse(m.get("notes_access") ?? "{}");
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
          if (v === "FREE" || v === "UNLIMITED" || v === "HIDDEN") notesAccess[k] = v;
        }
      }
    } catch {
      /* corrupt JSON → fall back to defaults */
    }

    const timeRaw = m.get("free_reset_time") ?? "";
    const val: SiteSettings = {
      freeDailyLimit: clampInt(m.get("free_daily_limit"), DEFAULTS.freeDailyLimit, 1, 500),
      freeResetDays: clampInt(m.get("free_reset_days"), DEFAULTS.freeResetDays, 1, 30),
      freeResetTime: /^([01]?\d|2[0-3]):[0-5]\d$/.test(timeRaw) ? timeRaw : DEFAULTS.freeResetTime,
      freeLimitChangedAt: Number(m.get("free_limit_changed_at")) || 0,
      notesAccess,
    };
    cache = { at: Date.now(), val };
    return val;
  } catch {
    return { ...DEFAULTS, notesAccess: {} };
  }
}

// ---------- Free-plan reset periods (Africa/Lagos = UTC+1, no DST) ----------

const LAGOS_OFFSET_MS = 60 * 60 * 1000;
const DAY_MS = 86400000;

// Epoch ms (UTC clock) when the current free-reset period started.
// A period begins at free_reset_time on every free_reset_days-th Lagos day.
export function currentPeriodStart(days: number, hhmm: string, now: number = Date.now()): number {
  const d = Math.max(1, Math.floor(days) || 1);
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm || "00:00");
  const mins = m ? Math.min(23, Number(m[1])) * 60 + Math.min(59, Number(m[2])) : 0;
  const wall = now + LAGOS_OFFSET_MS;
  const dayNum = Math.floor(wall / DAY_MS);
  const cycleDay = dayNum - (dayNum % d);
  let periodWall = cycleDay * DAY_MS + mins * 60000;
  if (periodWall > wall) periodWall = (cycleDay - d) * DAY_MS + mins * 60000;
  return periodWall - LAGOS_OFFSET_MS;
}

// Stable key for "the current period" — used to bucket per-subject usage.
export function subjectPeriodKey(s: SiteSettings, now: number = Date.now()): string {
  return `P${currentPeriodStart(s.freeResetDays, s.freeResetTime, now)}`;
}

// ---------- Notes access ----------

export function notesAccessKey(level: string, subject: string, topic: string): string {
  return `${level}|${subject}|${topic}`;
}

// Default policy: the first visible topic of every subject is free for
// everyone; everything else needs Unlimited. Admin overrides win.
export function topicAccessFor(
  s: SiteSettings,
  level: string,
  subject: string,
  topic: string,
  isFirstVisible: boolean
): TopicAccess {
  const override = s.notesAccess[notesAccessKey(level, subject, topic)];
  if (override === "FREE" || override === "UNLIMITED" || override === "HIDDEN") return override;
  return isFirstVisible ? "FREE" : "UNLIMITED";
}
