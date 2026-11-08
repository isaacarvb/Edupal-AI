import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    const b = await req.json();
    const schoolId = b?.schoolId;
    const title = String(b?.title ?? "").trim();
    const body = String(b?.body ?? "").trim();
    const className = b?.className ? String(b.className).trim() : null;

    if (!schoolId || !title || !body) {
      return NextResponse.json({ error: "schoolId, title, and body required" }, { status: 400 });
    }

    const db = await getDb();

    const school = await db.prepare("SELECT id FROM schools WHERE id = ?").get(schoolId);
    if (!school) return NextResponse.json({ error: "School not found" }, { status: 404 });

    await db.prepare(
      "INSERT INTO school_announcements (id, school_id, title, body, class_name, created_at) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(randomUUID(), schoolId, title, body, className, new Date().toISOString());

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
