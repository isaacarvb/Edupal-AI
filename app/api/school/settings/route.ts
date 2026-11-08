import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function PATCH(req: Request) {
  try {
    const b = await req.json();
    const schoolId = b?.schoolId;
    const portalActive = b?.portalActive;

    if (!schoolId || portalActive === undefined) {
      return NextResponse.json({ error: "schoolId and portalActive required" }, { status: 400 });
    }

    const db = await getDb();

    const school = await db.prepare("SELECT id FROM schools WHERE id = ?").get(schoolId);
    if (!school) return NextResponse.json({ error: "School not found" }, { status: 404 });

    await db.prepare("UPDATE schools SET active = ? WHERE id = ?").run(portalActive ? 1 : 0, schoolId);

    return NextResponse.json({ ok: true, portalActive });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
