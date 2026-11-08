import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const b = await req.json();
    const noteId = b?.noteId;
    const status = b?.status;

    if (!noteId || !["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "noteId and valid status required" }, { status: 400 });
    }

    const db = await getDb();
    const now = new Date().toISOString();

    await db.prepare(
      "UPDATE lesson_notes SET status = ?, reviewed_at = ? WHERE id = ?"
    ).run(status, now, noteId);

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
