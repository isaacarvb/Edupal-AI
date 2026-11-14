import { type Db } from "./db";
import { addOneDay, DAILY_XP_CAP, XP_PER_ATTEMPT, XP_PER_CORRECT } from "./leaderboard-shared";

// Server-only leaderboard queries. Pure helpers live in leaderboard-shared.ts
// so client components can import them without pulling in the database.

export * from "./leaderboard-shared";

// Groups attempts by UTC day and hour, then folds them into WAT days in JS.
// Portable across SQLite and Postgres because created_at is stored as ISO text.
export async function weeklyXpByUser(db: Db, startUtcIso: string): Promise<Map<string, number>> {
  const rows = (await db
    .prepare(
      `SELECT user_id AS "userId", substr(created_at, 1, 10) AS day, substr(created_at, 12, 2) AS hour,
              SUM(CASE WHEN correct = 1 THEN ${XP_PER_CORRECT} ELSE ${XP_PER_ATTEMPT} END) AS xp
         FROM attempts
        WHERE created_at >= ?
        GROUP BY user_id, substr(created_at, 1, 10), substr(created_at, 12, 2)`
    )
    .all(startUtcIso)) as Array<{ userId: string; day: string; hour: string; xp: number | string }>;

  const perDay = new Map<string, Map<string, number>>();
  for (const row of rows) {
    const watDay = row.hour === "23" ? addOneDay(row.day) : row.day;
    const userDays = perDay.get(row.userId) ?? new Map<string, number>();
    userDays.set(watDay, (userDays.get(watDay) ?? 0) + Number(row.xp ?? 0));
    perDay.set(row.userId, userDays);
  }

  const totals = new Map<string, number>();
  for (const [userId, days] of perDay) {
    let total = 0;
    for (const xp of days.values()) total += Math.min(DAILY_XP_CAP, xp);
    totals.set(userId, total);
  }
  return totals;
}

export async function weeklyStudySeconds(db: Db, startDay: string): Promise<Map<string, number>> {
  const rows = (await db
    .prepare(
      `SELECT user_id AS "userId", SUM(seconds) AS seconds
         FROM study_time
        WHERE day >= ?
        GROUP BY user_id`
    )
    .all(startDay)) as Array<{ userId: string; seconds: number | string }>;
  const totals = new Map<string, number>();
  for (const row of rows) totals.set(row.userId, Number(row.seconds ?? 0));
  return totals;
}
