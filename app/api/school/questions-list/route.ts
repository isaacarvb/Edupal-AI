import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get("schoolId");
    if (!schoolId) return NextResponse.json({ error: "schoolId required" }, { status: 400 });

    const db = await getDb();
    const rows = (await db.prepare(
      "SELECT id, subject, topic, stem, answer, created_at AS createdAt FROM school_questions WHERE school_id = ? ORDER BY created_at DESC"
    ).all(schoolId)) as Array<{
      id: string;
      subject: string;
      topic: string;
      stem: string;
      answer: string;
      createdAt: string;
    }>;

    return NextResponse.json({ ok: true, questions: rows });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
