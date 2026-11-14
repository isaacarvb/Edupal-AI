import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import {
  currentWeek,
  displayName,
  tierFor,
  weeklyStudySeconds,
  weeklyXpByUser,
  type LeaderboardMetric,
  type LeaderboardScope
} from "@/lib/leaderboard";

// GET ?userId=&scope=auto|class|school|global&metric=xp|time
// Weekly leaderboard. XP comes from practice attempts (300 XP/day cap); study
// time comes from the app's heartbeat. Names are shortened to first name +
// last initial, and students who opted out in Settings are not listed.
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const rawScope = searchParams.get("scope") ?? "auto";
    const metric: LeaderboardMetric = searchParams.get("metric") === "time" ? "time" : "xp";
    const scopeParam: LeaderboardScope | "auto" =
      rawScope === "class" || rawScope === "school" || rawScope === "global" ? rawScope : "auto";

    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    const db = await getDb();
    const week = currentWeek();

    const me = (await db.prepare("SELECT id, name, email, role FROM users WHERE id = ?").get(userId)) as
      | { id: string; name: string | null; email: string | null; role: string }
      | undefined;
    if (!me) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const member = (await db
      .prepare('SELECT school_id AS "schoolId", class_name AS "className" FROM school_members WHERE user_id = ?')
      .get(userId)) as { schoolId: string; className: string } | undefined;

    const scope: LeaderboardScope =
      scopeParam === "auto" ? (member ? "school" : "global") : scopeParam;

    let schoolName: string | null = null;
    if (member?.schoolId) {
      const row = (await db.prepare("SELECT name FROM schools WHERE id = ?").get(member.schoolId)) as
        | { name: string }
        | undefined;
      schoolName = row?.name ?? null;
    }

    // Resolve the pool of students in this scope.
    let users: Array<{ id: string; name: string | null; email: string | null; className?: string | null }> = [];
    let reason = "";

    if (scope === "global") {
      users = (await db
        .prepare(
          `SELECT u.id, u.name, u.email
             FROM users u
            WHERE u.role = 'STUDENT'
              AND (u.id IN (SELECT user_id FROM attempts WHERE created_at >= ?)
                OR u.id IN (SELECT user_id FROM study_time WHERE day >= ?))`
        )
        .all(week.startUtcIso, week.startDay)) as typeof users;
      if (!users.some((u) => u.id === me.id) && me.role === "STUDENT") {
        users.push({ id: me.id, name: me.name, email: me.email, className: member?.className ?? "" });
      }
    } else if (!member?.schoolId) {
      reason = "Join a school to see a class or school leaderboard.";
    } else if (scope === "class") {
      if (!member.className) {
        reason = "Your class is not set yet. Ask your school to add it to your profile.";
      } else {
        users = (await db
          .prepare(
            `SELECT u.id, u.name, u.email, sm.class_name AS "className"
               FROM users u
               JOIN school_members sm ON sm.user_id = u.id
              WHERE sm.school_id = ? AND sm.class_name = ? AND u.role = 'STUDENT'`
          )
          .all(member.schoolId, member.className)) as typeof users;
      }
    } else {
      users = (await db
        .prepare(
          `SELECT u.id, u.name, u.email, sm.class_name AS "className"
             FROM users u
             JOIN school_members sm ON sm.user_id = u.id
            WHERE sm.school_id = ? AND u.role = 'STUDENT'`
        )
        .all(member.schoolId)) as typeof users;
    }

    const [xpMap, timeMap] = await Promise.all([
      weeklyXpByUser(db, week.startUtcIso),
      weeklyStudySeconds(db, week.startDay)
    ]);

    const hiddenRows = (await db
      .prepare("SELECT user_id AS \"userId\" FROM leaderboard_settings WHERE hidden = 1")
      .all()) as Array<{ userId: string }>;
    const hidden = new Set(hiddenRows.map((r) => r.userId));

    const rows = users.map((u) => {
      const xp = xpMap.get(u.id) ?? 0;
      const seconds = timeMap.get(u.id) ?? 0;
      return {
        userId: u.id,
        name: displayName(u.name, u.email),
        className: u.className ?? "",
        xp,
        seconds,
        tier: tierFor(xp),
        isMe: u.id === me.id
      };
    });

    // Hidden students never appear in anyone else's list and do not take a rank.
    const visible = rows.filter((r) => !hidden.has(r.userId));
    visible.sort((a, b) => {
      const av = metric === "xp" ? a.xp : a.seconds;
      const bv = metric === "xp" ? b.xp : b.seconds;
      if (bv !== av) return bv - av;
      if (b.xp !== a.xp) return b.xp - a.xp;
      return a.name.localeCompare(b.name);
    });
    const ranked = visible.map((r, i) => ({ ...r, rank: i + 1 }));

    const mine = rows.find((r) => r.isMe) ?? null;
    const myRank = ranked.find((r) => r.isMe)?.rank ?? null;

    return NextResponse.json({
      ok: true,
      scope,
      metric,
      weekStart: week.startUtcIso,
      weekEnd: week.endUtcIso,
      weekStartDay: week.startDay,
      school: member?.schoolId ? { id: member.schoolId, name: schoolName } : null,
      className: member?.className ?? null,
      total: ranked.length,
      reason,
      me: mine
        ? {
            ...mine,
            rank: myRank,
            hidden: hidden.has(mine.userId)
          }
        : null,
      entries: ranked.slice(0, 50)
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
