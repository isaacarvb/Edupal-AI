import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireActiveSchool } from "@/lib/schools";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    const b = await req.json();
    const schoolId = b?.schoolId;
    const title = String(b?.title ?? "").trim();
    const subjects = String(b?.subjects ?? "").trim();
    const className = String(b?.className ?? "").trim();
    const durationMinutes = Number(b?.durationMinutes) || 30;
    const scheduledAt = b?.scheduledAt || null;

    if (!schoolId || !title || !subjects || !className) {
      return NextResponse.json({ error: "schoolId, title, subjects, and className required" }, { status: 400 });
    }

    const db = await getDb();
    const access = await requireActiveSchool(db, schoolId);
    if ("error" in access) return access.error;

    const school = await db.prepare("SELECT id FROM schools WHERE id = ?").get(schoolId);
    if (!school) return NextResponse.json({ error: "School not found" }, { status: 404 });

    await db.prepare(
      "INSERT INTO mock_exams (id, school_id, title, subjects, class_name, duration_minutes, scheduled_at, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 'scheduled', ?)"
    ).run(randomUUID(), schoolId, title, subjects, className, durationMinutes, scheduledAt, new Date().toISOString());

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
