import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    const b = await req.json();
    const schoolId = b?.schoolId;
    const subject = String(b?.subject ?? "").trim();
    const topic = String(b?.topic ?? "").trim();
    const stem = String(b?.stem ?? "").trim();
    const options = Array.isArray(b?.options) ? b.options : [];
    const answer = String(b?.answer ?? "").trim();

    if (!schoolId || !subject || !topic || !stem || !options.length || !answer) {
      return NextResponse.json({ error: "schoolId, subject, topic, stem, options, and answer required" }, { status: 400 });
    }

    if (!options.includes(answer)) {
      return NextResponse.json({ error: "Answer must match one of the options exactly" }, { status: 400 });
    }

    const db = await getDb();

    const school = await db.prepare("SELECT id FROM schools WHERE id = ?").get(schoolId);
    if (!school) return NextResponse.json({ error: "School not found" }, { status: 404 });

    await db.prepare(
      "INSERT INTO school_questions (id, school_id, subject, topic, stem, options_json, answer, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    ).run(randomUUID(), schoolId, subject, topic, stem, JSON.stringify(options), answer, new Date().toISOString());

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
