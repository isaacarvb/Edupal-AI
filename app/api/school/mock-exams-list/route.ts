import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireActiveSchool } from "@/lib/schools";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get("schoolId");
    if (!schoolId) return NextResponse.json({ error: "schoolId required" }, { status: 400 });

    const db = await getDb();
    const access = await requireActiveSchool(db, schoolId);
    if ("error" in access) return access.error;
    const rows = (await db.prepare(
      "SELECT id, title, subjects, class_name AS \"className\", duration_minutes AS \"durationMinutes\", scheduled_at AS \"scheduledAt\", status, created_at AS \"createdAt\" FROM mock_exams WHERE school_id = ? ORDER BY created_at DESC"
    ).all(schoolId)) as Array<{
      id: string;
      title: string;
      subjects: string;
      className: string;
      durationMinutes: number;
      scheduledAt: string | null;
      status: string;
      createdAt: string;
    }>;

    return NextResponse.json({ ok: true, exams: rows });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
