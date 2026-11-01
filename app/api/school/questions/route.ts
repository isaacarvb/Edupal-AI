import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireSchoolAdmin, requireSchoolTeacher } from "@/lib/schools";

// GET ?userId=&className=&subject=&status=&teacherId=
// School admin sees all questions in school; teacher sees only their own
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const className = searchParams.get("className");
  const subject = searchParams.get("subject");
  const status = searchParams.get("status");
  const db = await getDb();
  try {
    let schoolId: string | null = null;
    let teacherOnly = false;
    let tId: string | null = null;
    try {
      const { school } = await requireSchoolAdmin(db, userId);
      schoolId = school.id;
    } catch {
      const { teacher, school } = await requireSchoolTeacher(db, userId);
      schoolId = school.id;
      teacherOnly = true;
      tId = teacher.id;
    }
    let sql = `SELECT q.id, q.school_id AS "schoolId", q.teacher_id AS "teacherId",
      q.teacher_name AS "teacherName", q.class_name AS "className", q.subject, q.topic,
      q.type, q.stem, q.options_json AS "optionsJson", q.answer_key AS "answerKey",
      q.marking_rubric AS "markingRubric", q.status, q.created_at AS "createdAt"
     FROM questions q WHERE q.school_id = ?`;
    const params: unknown[] = [schoolId];
    if (teacherOnly) {
      sql += " AND q.teacher_id = ?";
      params.push(tId);
    }
    if (className) { sql += " AND q.class_name = ?"; params.push(className); }
    if (subject) { sql += " AND q.subject = ?"; params.push(subject); }
    if (status) { sql += " AND q.status = ?"; params.push(status); }
    sql += " ORDER BY q.created_at DESC";
    const rows = (await db.prepare(sql).all(...params)) as Array<Record<string, unknown>>;
    return NextResponse.json({
      questions: rows.map((r) => ({
        id: String(r.id),
        schoolId: String(r.schoolId),
        teacherId: String(r.teacherId),
        teacherName: String(r.teacherName ?? ""),
        className: String(r.className ?? ""),
        subject: String(r.subject ?? ""),
        topic: String(r.topic ?? ""),
        type: String(r.type ?? ""),
        stem: String(r.stem ?? ""),
        optionsJson: r.options_json ? JSON.parse(String(r.options_json)) : [],
        answerKey: String(r.answerKey ?? ""),
        markingRubric: String(r.markingRubric ?? ""),
        status: String(r.status ?? "draft"),
        createdAt: String(r.createdAt ?? ""),
      }))
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: e instanceof Error && e.message.includes("forbidden") ? 403 : 500 });
  }
}

// POST { userId, className, subject, topic, type, stem, optionsJson, answerKey, markingRubric }
// Teacher creates a new question (draft by default)
export async function POST(req: Request) {
  const b = await req.json();
  try {
    const { teacher, school } = await requireSchoolTeacher(await getDb(), String(b?.userId ?? ""));
    const className = String(b?.className ?? "").trim();
    const subject = String(b?.subject ?? "").trim();
    const topic = String(b?.topic ?? "").trim();
    const type = String(b?.type ?? "MCQ").trim();
    const stem = String(b?.stem ?? "").trim();
    const optionsJson = b?.optionsJson ?? [];
    const answerKey = String(b?.answerKey ?? "").trim();
    const markingRubric = String(b?.markingRubric ?? "").trim();

    if (!className || !subject || !topic || !type || !stem) {
      return NextResponse.json({ error: "class, subject, topic, type, and stem required" }, { status: 400 });
    }
    if (!teacher.classes.includes(className)) {
      return NextResponse.json({ error: "you do not teach this class" }, { status: 403 });
    }
    const db = await getDb();
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const createdAt = new Date().toISOString();
    await db.prepare(
      `INSERT INTO questions (id, school_id, teacher_id, teacher_name, class_name, subject, topic, type, stem, options_json, answer_key, marking_rubric, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?)`
    ).run(id, school.id, teacher.id, teacher.name, className, subject, topic, type, stem, JSON.stringify(optionsJson), answerKey, markingRubric, createdAt);
    return NextResponse.json({ ok: true, question: { id, ...b, status: "draft", createdAt: new Date().toISOString() } });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: e instanceof Error && e.message.includes("forbidden") ? 403 : 500 });
  }
}

// PATCH { questionId, ...updates } — Teacher updates their own question
export async function PATCH(req: Request) {
  const b = await req.json();
  try {
    const db = await getDb();
    const { teacher } = await requireSchoolTeacher(db, String(b?.userId ?? ""));
    const questionId = String(b?.questionId ?? "");
    if (!questionId) return NextResponse.json({ error: "questionId required" }, { status: 400 });

    const updates: string[] = [];
    const params: unknown[] = [];
    if (b.className !== undefined) { updates.push("class_name = ?"); params.push(b.className); }
    if (b.subject !== undefined) { updates.push("subject = ?"); params.push(b.subject); }
    if (b.topic !== undefined) { updates.push("topic = ?"); params.push(b.topic); }
    if (b.type !== undefined) { updates.push("type = ?"); params.push(b.type); }
    if (b.stem !== undefined) { updates.push("stem = ?"); params.push(b.stem); }
    if (b.optionsJson !== undefined) { updates.push("options_json = ?"); params.push(JSON.stringify(b.optionsJson)); }
    if (b.answerKey !== undefined) { updates.push("answer_key = ?"); params.push(b.answerKey); }
    if (b.markingRubric !== undefined) { updates.push("marking_rubric = ?"); params.push(b.markingRubric); }
    if (b.status !== undefined) { updates.push("status = ?"); params.push(b.status); }

    if (updates.length === 0) return NextResponse.json({ error: "nothing to update" }, { status: 400 });

    params.push(questionId, teacher.id);
    const stmt = db.prepare(`UPDATE questions SET ${updates.join(", ")} WHERE id = ? AND teacher_id = ?`);
    await stmt.run(...params);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: e instanceof Error && e.message.includes("forbidden") ? 403 : 500 });
  }
}

// DELETE ?questionId=&userId= — Teacher deletes their own question
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const questionId = searchParams.get("questionId");
  try {
    const { teacher } = await requireSchoolTeacher(await getDb(), userId);
    if (!questionId) return NextResponse.json({ error: "questionId required" }, { status: 400 });
    const db = await getDb();
    await db.prepare("DELETE FROM questions WHERE id = ? AND teacher_id = ?").run(questionId, teacher.id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: e instanceof Error && e.message.includes("forbidden") ? 403 : 500 });
  }
}
