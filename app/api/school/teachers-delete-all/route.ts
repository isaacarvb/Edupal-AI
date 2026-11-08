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

    const count = (await db.prepare("SELECT COUNT(*) AS n FROM school_teachers WHERE school_id = ?").get(schoolId)) as { n: number };

    await db.prepare("DELETE FROM school_teachers WHERE school_id = ?").run(schoolId);

    return NextResponse.json({ ok: true, deleted: count.n });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
