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

    const count = (await db.prepare("SELECT COUNT(*) AS n FROM school_teachers WHERE school_id = ?").get(schoolId)) as {
      n: number;
    };
    const rows = (await db.prepare("SELECT id FROM school_teachers WHERE school_id = ?").all(schoolId)) as Array<{
      id: string;
    }>;

    await db.prepare("DELETE FROM school_teachers WHERE school_id = ?").run(schoolId);
    // Remove the matching login accounts too (imported teachers use the same id).
    for (const row of rows) {
      await db.prepare("DELETE FROM users WHERE id = ? AND role = 'SCHOOL_TEACHER'").run(row.id);
    }

    return NextResponse.json({ ok: true, deleted: Number(count?.n ?? 0) });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
