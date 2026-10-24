import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { logAudit } from "@/lib/admin";
import { requireSchoolAdmin, requireSchoolTeacher } from "@/lib/schools";
import { getLessonNotes, createLessonNote, reviewLessonNote } from "@/lib/lessons";

// GET ?userId=&status=&classId=&teacherId= — list notes.
//   School admin sees all notes in their school.
//   Teacher sees only their own notes.
// POST {userId, className, subject, topic, body} — teacher creates a pending note.
// PATCH {noteId, status ("approved"|"rejected"), userId} — school admin approves/rejects.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const statusRaw = searchParams.get("status");
  const status = (statusRaw === "pending" || statusRaw === "approved" || statusRaw === "rejected") ? statusRaw : undefined;
  const classNameRaw = searchParams.get("className");
  const className: string | undefined = classNameRaw == null ? undefined : String(classNameRaw);
  const teacherIdRaw = searchParams.get("teacherId");
  const teacherId: string | undefined = teacherIdRaw == null ? undefined : String(teacherIdRaw);
  const db = await getDb();
  try {
    let isAdmin = false;
    let schoolId: string | null = null;
    try {
      const { school } = await requireSchoolAdmin(db, userId);
      isAdmin = true;
      schoolId = school.id;
    } catch {
      const { teacher, school } = await requireSchoolTeacher(db, userId);
      schoolId = school.id;
      if (teacherId && teacherId !== teacher.id) {
        return NextResponse.json({ error: "forbidden: not your notes" }, { status: 403 });
      }
    }
    const notes = await getLessonNotes(db, schoolId!, {
      status,
      className,
      teacherId: isAdmin ? undefined : teacherId
    });
    return NextResponse.json({ notes });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: e instanceof Error && e.message.includes("forbidden") ? 403 : 500 });
  }
}

export async function POST(req: Request) {
  const b = await req.json();
  const db = await getDb();
  try {
    const { teacher, school } = await requireSchoolTeacher(db, String(b?.userId ?? ""));
    const className = String(b?.className ?? "").trim();
    const subject = String(b?.subject ?? "").trim();
    const topic = String(b?.topic ?? "").trim();
    const body = String(b?.body ?? "").trim();
    if (!className || !subject || !topic || !body) {
      return NextResponse.json({ error: "class, subject, topic and body required" }, { status: 400 });
    }
    if (!teacher.classes.includes(className)) {
      return NextResponse.json({ error: "you do not teach this class" }, { status: 403 });
    }
    const note = await createLessonNote(db, {
      schoolId: school.id, teacherId: teacher.id, teacherName: teacher.name,
      className, subject, topic, body
    });
    await logAudit(db, teacher.id, "lesson-note:create", `${note.subject} / ${note.topic} (${className})`);
    return NextResponse.json({ ok: true, note });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: e instanceof Error && e.message.includes("forbidden") ? 403 : 500 });
  }
}

export async function PATCH(req: Request) {
  const b = await req.json();
  const db = await getDb();
  try {
    const { school } = await requireSchoolAdmin(db, String(b?.userId ?? ""));
    const noteId = String(b?.noteId ?? "");
    const status = b?.status;
    if (status !== "approved" && status !== "rejected") {
      return NextResponse.json({ error: "status must be 'approved' or 'rejected'" }, { status: 400 });
    }
    const adminName = (await db.prepare("SELECT name FROM users WHERE id = ?").get(school.adminUserId ?? "")) as { name: string | null } | undefined;
    const note = await reviewLessonNote(db, {
      noteId, reviewerId: school.adminUserId ?? "", reviewerName: adminName?.name ?? "", status
    });
    if (note.schoolId !== school.id) return NextResponse.json({ error: "forbidden: not your school" }, { status: 403 });
    await logAudit(db, school.adminUserId ?? "", `lesson-note:${status}`, `${note.subject} / ${note.topic} (${note.className})`);
    return NextResponse.json({ ok: true, note });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: e instanceof Error && e.message.includes("forbidden") ? 403 : 500 });
  }
}
