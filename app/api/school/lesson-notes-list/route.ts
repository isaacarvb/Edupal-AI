import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get("schoolId");
    if (!schoolId) return NextResponse.json({ error: "schoolId required" }, { status: 400 });

    const db = await getDb();
    const rows = (await db.prepare(
      "SELECT id, teacher_name AS \"teacherName\", class_name AS \"className\", subject, topic, body, attachment_name AS \"attachmentName\", status, created_at AS \"createdAt\" FROM lesson_notes WHERE school_id = ? ORDER BY created_at DESC"
    ).all(schoolId)) as Array<{
      id: string;
      teacherName: string;
      className: string;
      subject: string;
      topic: string;
      body: string;
      attachmentName: string | null;
      status: "pending" | "approved" | "rejected";
      createdAt: string;
    }>;

    return NextResponse.json({ ok: true, notes: rows });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
