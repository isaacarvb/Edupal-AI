import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// GET ?userId= — whether the student is hidden from the leaderboard.
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    const db = await getDb();
    const row = (await db
      .prepare("SELECT hidden FROM leaderboard_settings WHERE user_id = ?")
      .get(userId)) as { hidden: number } | undefined;

    return NextResponse.json({ ok: true, hidden: Number(row?.hidden ?? 0) === 1 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}

// POST { userId, hidden } — opt in or out of the public leaderboard.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userId = String(body?.userId ?? "");
    const hidden = body?.hidden ? 1 : 0;
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    const db = await getDb();
    const user = (await db.prepare("SELECT id FROM users WHERE id = ?").get(userId)) as { id: string } | undefined;
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const now = new Date().toISOString();
    const update = await db
      .prepare("UPDATE leaderboard_settings SET hidden = ?, updated_at = ? WHERE user_id = ?")
      .run(hidden, now, userId);
    if (update.changes === 0) {
      await db
        .prepare("INSERT INTO leaderboard_settings (user_id, hidden, updated_at) VALUES (?, ?, ?)")
        .run(userId, hidden, now);
    }

    return NextResponse.json({ ok: true, hidden: hidden === 1 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
