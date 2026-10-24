import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { logAudit } from "@/lib/admin";
import { requireSchoolAdmin, requireSchoolTeacher } from "@/lib/schools";
import { getAssignments, createAssignment, deleteAssignment } from "@/lib/lessons";

// GET ?userId=&classId=&teacherId= — list assignments.
//   School admin sees all assignments in their school.
//   Teacher sees only their own assignments.
// POST {userId, className, subject, topic, instructions, dueAt} — teacher creates.
// DELETE ?assignmentId=&userId= — school admin deletes any assignment in their school.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const classNameRaw = searchParams.get("className");
  const className: string | undefined = classNameRaw == null ? undefined : String(classNameRaw);
  const teacherIdRaw = searchParams.get("teacherId");
  const teacherId: string | undefined = teacherIdRaw == null ? undefined : String(teacherIdRaw);
  const db = await getDb();
  try {
    let schoolId: string | null = null;
    let teacherOnly = false;
    try {
      const { school } = await requireSchoolAdmin(db, userId);
      schoolId = school.id;
    } catch {
      const { teacher, school } = await requireSchoolTeacher(db, userId);
      schoolId = school.id;
      teacherOnly = true;
      if (teacherId && teacherId !== teacher.id) {
        return NextResponse.json({ error: "forbidden: not your assignments" }, { status: 403 });
      }
    }
    const assignments = await getAssignments(db, schoolId!, {
      className,
      teacherId: teacherOnly ? undefined : teacherId
    });
    return NextResponse.json({ assignments });
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
    const instructions = String(b?.instructions ?? "").trim();
    const dueAt = b?.dueAt ? String(b.dueAt) : null;
    if (!className || !subject || !topic) {
      return NextResponse.json({ error: "class, subject and topic required" }, { status: 400 });
    }
    if (!teacher.classes.includes(className)) {
      return NextResponse.json({ error: "you do not teach this class" }, { status: 403 });
    }
    const assignment = await createAssignment(db, {
      schoolId: school.id, teacherId: teacher.id, teacherName: teacher.name,
      className, subject, topic, instructions, dueAt
    });
    await logAudit(db, teacher.id, "assignment:create", `${assignment.subject} / ${assignment.topic} (${className})`);
    return NextResponse.json({ ok: true, assignment });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: e instanceof Error && e.message.includes("forbidden") ? 403 : 500 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const assignmentId = searchParams.get("assignmentId");
  const db = await getDb();
  try {
    const { school } = await requireSchoolAdmin(db, userId);
    if (!assignmentId) return NextResponse.json({ error: "assignmentId required" }, { status: 400 });
    const assignments = await getAssignments(db, school.id);
    if (!assignments.some((a) => a.id === assignmentId)) {
      return NextResponse.json({ error: "assignment not found in your school" }, { status: 404 });
    }
    await deleteAssignment(db, assignmentId);
    await logAudit(db, school.adminUserId ?? "", "assignment:delete", assignmentId);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: e instanceof Error && e.message.includes("forbidden") ? 403 : 500 });
  }
}
