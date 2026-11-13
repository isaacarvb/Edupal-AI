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
      "SELECT id, name, class_name AS \"className\", subject FROM school_teachers WHERE school_id = ? ORDER BY name"
    ).all(schoolId)) as Array<{ id: string; name: string; className: string; subject: string }>;

    return NextResponse.json({ ok: true, teachers: rows });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
