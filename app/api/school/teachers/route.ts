import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { logAudit } from "@/lib/admin";
import {
  requireSchoolAdmin,
  requireSchoolTeacher,
  createSchoolTeacher,
  deleteSchoolTeacher,
  getSchoolTeachers,
  getTeacherById
} from "@/lib/schools";

// GET ?userId=&schoolId= — list teachers for the caller's school.
//   School admin sees all teachers in their school.
//   Teacher sees only their own record.
// POST {userId, schoolId, name, email, password, classes: string[]} — create teacher (school admin only).
// DELETE ?teacherId=&userId= — remove teacher (school admin only).
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const schoolId = searchParams.get("schoolId");
  const db = await getDb();
  try {
    let targetSchoolId: string | null = schoolId ?? null;
    let teacherOnly = false;
    let teacherId: string | null = null;
    try {
      const { school } = await requireSchoolAdmin(db, userId);
      targetSchoolId = school.id;
    } catch {
      const { teacher, school } = await requireSchoolTeacher(db, userId);
      targetSchoolId = school.id;
      teacherOnly = true;
      teacherId = teacher.id;
    }
    const teachers = await getSchoolTeachers(db, targetSchoolId!);
    return NextResponse.json({
      teachers: teacherOnly ? teachers.filter((t) => t.id === teacherId) : teachers,
      school: { id: targetSchoolId!, name: "" }
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: e instanceof Error && e.message.includes("forbidden") ? 403 : 500 });
  }
}

export async function POST(req: Request) {
  const b = await req.json();
  const db = await getDb();
  try {
    const { school } = await requireSchoolAdmin(db, String(b?.userId ?? ""));
    const adminId = school.adminUserId ?? "";
    const name = String(b?.name ?? "").trim();
    const email = String(b?.email ?? "").trim().toLowerCase();
    const password = String(b?.password ?? "");
    const rawClasses = b?.classes;
    const classes = Array.isArray(rawClasses) ? rawClasses.map((c) => String(c).trim()).filter(Boolean) : [];
    if (!name || !email.includes("@") || !classes.length || password.length < 6) {
      return NextResponse.json({ error: "name, valid email, 6+ char password, and at least one class required" }, { status: 400 });
    }
    const created = await createSchoolTeacher(db, { schoolId: school.id, name, email, password, classes, creatorId: adminId });
    await logAudit(db, adminId, "teacher:create", `${created.email} (${school.name})`);
    return NextResponse.json({ ok: true, teacher: created, temporaryPassword: password });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: e instanceof Error && e.message.includes("forbidden") ? 403 : 500 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const teacherId = searchParams.get("teacherId");
  const db = await getDb();
  try {
    const { school } = await requireSchoolAdmin(db, userId);
    const target = await getTeacherById(db, teacherId ?? "");
    if (!target) return NextResponse.json({ error: "teacher not found" }, { status: 404 });
    if (target.schoolId !== school.id) return NextResponse.json({ error: "forbidden: not your school" }, { status: 403 });
    await deleteSchoolTeacher(db, teacherId ?? "");
    await logAudit(db, String(school.adminUserId ?? ""), "teacher:delete", target.email);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: e instanceof Error && e.message.includes("forbidden") ? 403 : 500 });
  }
}
