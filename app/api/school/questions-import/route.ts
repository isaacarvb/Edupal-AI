import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireActiveSchool } from "@/lib/schools";
import { randomUUID } from "crypto";
import { canonicalSubject } from "@/lib/syllabus";

// Bulk question-bank import. Each row is validated before insert so a broken
// row cannot abort the whole upload: valid rows are saved, bad rows are
// reported back as `skipped` (with a short reason list).

type IncomingQuestion = {
  subject?: string;
  topic?: string;
  stem?: string;
  options?: string[] | string;
  answer?: string;
};

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const schoolId = form.get("schoolId") as string;
    const questionsJson = form.get("questions") as string;
    const questions: IncomingQuestion[] = JSON.parse(questionsJson || "[]");

    if (!schoolId || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: "schoolId and questions required" }, { status: 400 });
    }

    const db = await getDb();
    const access = await requireActiveSchool(db, schoolId);
    if ("error" in access) return access.error;

    const school = await db.prepare("SELECT id FROM schools WHERE id = ?").get(schoolId);
    if (!school) return NextResponse.json({ error: "School not found" }, { status: 404 });

    let imported = 0;
    const skipped: string[] = [];

    for (const q of questions) {
      const subject = canonicalSubject(String(q.subject ?? "").trim());
      const topic = String(q.topic ?? "").trim();
      const stem = String(q.stem ?? "").trim();
      const options = (Array.isArray(q.options) ? q.options : String(q.options ?? "").split("|"))
        .map((o) => String(o ?? "").trim())
        .filter(Boolean);
      const answer = String(q.answer ?? "").trim();

      if (!subject || !topic || !stem) {
        skipped.push(`${subject || "(no subject)"}: missing subject/topic/stem`);
        continue;
      }
      if (options.length < 2) {
        skipped.push(`${subject} — ${topic}: needs at least 2 options`);
        continue;
      }
      if (!options.includes(answer)) {
        skipped.push(`${subject} — ${topic}: answer must match one option`);
        continue;
      }

      const now = new Date().toISOString();
      await db
        .prepare(
          "INSERT INTO school_questions (id, school_id, subject, topic, stem, options_json, answer, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        )
        .run(randomUUID(), schoolId, subject, topic, stem, JSON.stringify(options), answer, now);
      imported++;
    }

    return NextResponse.json({
      ok: true,
      imported,
      skipped: skipped.length,
      skippedRows: skipped.slice(0, 10)
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
