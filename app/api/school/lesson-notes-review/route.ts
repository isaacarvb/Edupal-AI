import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireActiveSchool } from "@/lib/schools";

export async function POST(req: Request) {
  try {
    const b = await req.json();
    const noteId = b?.noteId;
    const status = b?.status;

    if (!noteId || !["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "noteId and valid status required" }, { status: 400 });
    }

    const db = await getDb();
    const note = (await db.prepare("SELECT school_id FROM lesson_notes WHERE id = ?").get(noteId)) as
      | { school_id: string }
      | undefined;
    if (!note) return NextResponse.json({ error: "Lesson note not found" }, { status: 404 });
    const access = await requireActiveSchool(db, note.school_id);
    if ("error" in access) return access.error;
    const now = new Date().toISOString();

    await db.prepare(
      "UPDATE lesson_notes SET status = ?, reviewed_at = ? WHERE id = ?"
    ).run(status, now, noteId);

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
