import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get("teacherId");

    if (!teacherId) {
      return NextResponse.json({ error: "teacherId required" }, { status: 400 });
    }

    const db = await getDb();

    const teacher = (await db.prepare("SELECT school_id FROM school_teachers WHERE id = ?").get(teacherId)) as {
      school_id: string;
    } | undefined;

    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    await db.prepare("DELETE FROM school_teachers WHERE id = ?").run(teacherId);

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
