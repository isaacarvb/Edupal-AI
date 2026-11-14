import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { currentWeek, todayWatDay } from "@/lib/leaderboard";

// POST { userId, seconds } — heartbeat from the student app.
// The client sends one minute at a time; anything larger is clamped so a
// tampered request cannot inflate study time.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userId = String(body?.userId ?? "");
    const raw = Number(body?.seconds ?? 60);
    const seconds = Number.isFinite(raw) ? Math.max(0, Math.min(120, Math.round(raw))) : 60;
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
    if (seconds === 0) return NextResponse.json({ ok: true, seconds: 0 });

    const db = await getDb();
    const user = (await db.prepare("SELECT id FROM users WHERE id = ?").get(userId)) as { id: string } | undefined;
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const day = todayWatDay();
    const now = new Date().toISOString();
    const update = await db
      .prepare("UPDATE study_time SET seconds = seconds + ?, updated_at = ? WHERE user_id = ? AND day = ?")
      .run(seconds, now, userId, day);
    if (update.changes === 0) {
      await db
        .prepare("INSERT INTO study_time (user_id, day, seconds, updated_at) VALUES (?, ?, ?, ?)")
        .run(userId, day, seconds, now);
    }

    const row = (await db
      .prepare("SELECT seconds FROM study_time WHERE user_id = ? AND day = ?")
      .get(userId, day)) as { seconds: number } | undefined;

    return NextResponse.json({ ok: true, day, seconds: Number(row?.seconds ?? seconds) });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}

// GET ?userId= — today's study time plus the current week's total.
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    const db = await getDb();
    const week = currentWeek();
    const day = todayWatDay();
    const today = (await db
      .prepare("SELECT seconds FROM study_time WHERE user_id = ? AND day = ?")
      .get(userId, day)) as { seconds: number } | undefined;
    const weekRow = (await db
      .prepare("SELECT SUM(seconds) AS seconds FROM study_time WHERE user_id = ? AND day >= ?")
      .get(userId, week.startDay)) as { seconds: number | string | null } | undefined;

    return NextResponse.json({
      ok: true,
      day,
      today: Number(today?.seconds ?? 0),
      week: Number(weekRow?.seconds ?? 0),
      weekStartDay: week.startDay
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
