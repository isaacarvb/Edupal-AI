import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get("schoolId");
    if (!schoolId) return NextResponse.json({ error: "schoolId required" }, { status: 400 });

    const db = await getDb();
    const rows = (await db.prepare(
      "SELECT id, title, body, class_name AS \"className\", created_at AS \"createdAt\" FROM school_announcements WHERE school_id = ? ORDER BY created_at DESC"
    ).all(schoolId)) as Array<{
      id: string;
      title: string;
      body: string;
      className: string | null;
      createdAt: string;
    }>;

    return NextResponse.json({ ok: true, announcements: rows });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
