import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const schoolId = body?.schoolId;

    if (!schoolId) {
      return NextResponse.json({ error: "schoolId required" }, { status: 400 });
    }

    const db = await getDb();

    // Count before delete
    const count = (await db.prepare("SELECT COUNT(*) AS n FROM school_students WHERE school_id = ?").get(schoolId)) as { n: number };

    // Delete all roster rows and their school memberships. User rows are kept so
    // practice history survives if the student is re-imported later.
    await db.prepare("DELETE FROM school_members WHERE school_id = ?").run(schoolId);
    await db.prepare("DELETE FROM school_students WHERE school_id = ?").run(schoolId);

    // Reset seats_used to 0
    await db.prepare("UPDATE schools SET seats_used = 0 WHERE id = ?").run(schoolId);

    return NextResponse.json({ ok: true, deleted: Number(count?.n ?? 0) });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
