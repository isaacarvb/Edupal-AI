import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const b = await req.json();
    const sessionId = b?.sessionId;
    const userId = b?.userId;

    if (!sessionId && !userId) {
      return NextResponse.json({ error: "sessionId or userId required" }, { status: 400 });
    }

    const db = await getDb();
    const now = new Date().toISOString();

    if (sessionId) {
      await db.prepare("UPDATE school_sessions SET last_activity = ? WHERE id = ?").run(now, sessionId);
    }

    if (userId) {
      // Update all active sessions for this user (within last 24h)
      await db.prepare(
        "UPDATE school_sessions SET last_activity = ? WHERE (student_name = ? OR id = ?) AND last_activity >= datetime('now', '-24 hours')"
      ).run(now, userId, sessionId);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
