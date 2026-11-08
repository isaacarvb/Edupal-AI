import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const schoolId = form.get("schoolId") as string;
    const questionsJson = form.get("questions") as string;
    const questions: Array<{ subject: string; topic: string; stem: string; options: string[]; answer: string }> = JSON.parse(questionsJson);

    if (!schoolId || !questions.length) {
      return NextResponse.json({ error: "schoolId and questions required" }, { status: 400 });
    }

    const db = await getDb();

    const school = await db.prepare("SELECT id FROM schools WHERE id = ?").get(schoolId);
    if (!school) return NextResponse.json({ error: "School not found" }, { status: 404 });

    let imported = 0;
    let skipped = 0;
    for (const q of questions) {
      // Validate answer matches one option
      if (!q.options.includes(q.answer)) {
        skipped++;
        continue;
      }
      const now = new Date().toISOString();
      await db.prepare(
        "INSERT INTO school_questions (id, school_id, subject, topic, stem, options_json, answer, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
      ).run(randomUUID(), schoolId, q.subject, q.topic, q.stem, JSON.stringify(q.options), q.answer, now);
      imported++;
    }

    return NextResponse.json({ ok: true, imported, skipped });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
