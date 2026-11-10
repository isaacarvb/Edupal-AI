import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get("schoolId");
    if (!schoolId) return NextResponse.json({ error: "schoolId required" }, { status: 400 });

    const db = await getDb();
    const rows = (await db.prepare(
      "SELECT id, name, class_name AS \"className\", department FROM school_students WHERE school_id = ? ORDER BY name"
    ).all(schoolId)) as Array<{ id: string; name: string; className: string; department: string | null }>;

    return NextResponse.json({ ok: true, students: rows });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
