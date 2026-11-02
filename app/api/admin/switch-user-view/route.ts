import { NextResponse } from "next/server";
import { getDb, uid } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { requireAdmin, adminIdFrom } from "@/lib/admin";

const PREVIEW_SCHOOL_EMAIL = "preview-school@edupal.local";
const PREVIEW_TEACHER_EMAIL = "preview-teacher@edupal.local";
const PREVIEW_STUDENT_EMAIL = "preview@edupal.local";

async function ensurePreviewSchool(db: any): Promise<string> {
  const existing = (await db.prepare("SELECT id FROM schools WHERE code = 'PREVIEW' LIMIT 1").get()) as { id: string } | undefined;
  if (existing) return existing.id;
  const schoolId = uid();
  const adminId = uid();
  const now = new Date().toISOString();
  await db.prepare("INSERT INTO users (id, name, email, password_hash, role, level) VALUES (?, ?, ?, ?, 'SCHOOL_ADMIN', 'SECONDARY')").run(adminId, "Preview School Admin", PREVIEW_SCHOOL_EMAIL, await hashPassword("preview-school-" + adminId));
  await db.prepare("INSERT INTO wallets (user_id, credits_left, reset_at, plan) VALUES (?, 10, ?, 'FREE')").run(adminId, now, "FREE");
  await db.prepare("INSERT INTO schools (id, name, code, admin_user_id, active, expires_at, max_seats) VALUES (?, ?, ?, ?, 1, NULL, 1000)").run(schoolId, "Preview School", "PREVIEW", adminId);
  return schoolId;
}

async function ensurePreviewTeacher(db: any, schoolId: string): Promise<{ id: string; name: string; email: string }> {
  const email = PREVIEW_TEACHER_EMAIL;
  let user = (await db.prepare("SELECT id FROM users WHERE email = ?").get(email)) as { id: string } | undefined;
  if (!user) {
    const id = uid();
    await db.prepare("INSERT INTO users (id, name, email, password_hash, role, level) VALUES (?, ?, ?, ?, 'SCHOOL_TEACHER', 'SECONDARY')").run(id, "Preview Teacher", email, await hashPassword("preview-teacher-" + id));
    await db.prepare("INSERT INTO wallets (user_id, credits_left, reset_at, plan) VALUES (?, 10, ?, 'FREE')").run(id, new Date().toISOString(), "FREE");
    user = { id };
  }
  let st = (await db.prepare("SELECT id FROM school_teachers WHERE email = ?").get(email)) as { id: string } | undefined;
  if (!st) {
    await db.prepare("INSERT INTO school_teachers (id, school_id, name, email, password_hash, classes, active) VALUES (?, ?, ?, ?, ?, '', 1)").run(uid(), schoolId, "Preview Teacher", email, await hashPassword("preview-teacher-" + user.id));
  }
  return { id: user.id, name: "Preview Teacher", email };
}

async function ensurePreviewSchoolAdmin(db: any, schoolId: string): Promise<{ id: string; name: string; email: string }> {
  const email = PREVIEW_SCHOOL_EMAIL;
  let user = (await db.prepare("SELECT id FROM users WHERE email = ?").get(email)) as { id: string } | undefined;
  if (!user) {
    const id = uid();
    await db.prepare("INSERT INTO users (id, name, email, password_hash, role, level) VALUES (?, ?, ?, ?, 'SCHOOL_ADMIN', 'SECONDARY')").run(id, "Preview School Admin", email, await hashPassword("preview-school-" + id));
    await db.prepare("INSERT INTO wallets (user_id, credits_left, reset_at, plan) VALUES (?, 10, ?, 'FREE')").run(id, new Date().toISOString(), "FREE");
    user = { id };
  }
  let st = (await db.prepare("SELECT id FROM school_teachers WHERE email = ?").get(email)) as { id: string } | undefined;
  if (!st) {
    await db.prepare("INSERT INTO school_teachers (id, school_id, name, email, password_hash, classes, active) VALUES (?, ?, ?, ?, ?, '', 1)").run(uid(), schoolId, "Preview School Admin", email, await hashPassword("preview-school-" + user.id));
  }
  return { id: user.id, name: "Preview School Admin", email };
}

export async function POST(req: Request) {
  try {
    const adminId = adminIdFrom(req);
    await requireAdmin(adminId);
  } catch {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const b = await req.json();
  const role: string = b?.role ?? "";
  const db = await getDb();
  try {
    if (role === "student") {
      let row = (await db.prepare("SELECT id FROM users WHERE email = ?").get(PREVIEW_STUDENT_EMAIL)) as { id: string } | undefined;
      if (!row) {
        const id = uid();
        const now = new Date().toISOString();
        await db.prepare("INSERT INTO users (id, name, email, password_hash, role, level) VALUES (?, ?, ?, ?, 'STUDENT', 'SECONDARY')").run(id, "Preview Student", PREVIEW_STUDENT_EMAIL, await hashPassword("preview-" + id));
        await db.prepare("INSERT INTO wallets (user_id, credits_left, reset_at, plan) VALUES (?, 10, ?, 'FREE')").run(id, now, "FREE");
        await db.prepare("INSERT INTO streaks (user_id) VALUES (?)").run(id);
        await db.prepare("INSERT INTO profiles (user_id, exam, subjects) VALUES (?, 'JAMB', 'English,Mathematics')").run(id, "WAEC", "English,Mathematics");
        row = { id };
      }
      return NextResponse.json({ userId: row.id, role: "STUDENT", redirectUrl: `/dashboard?userId=${row.id}&adminView=1` });
    }
    if (role === "teacher") {
      const schoolId = await ensurePreviewSchool(db);
      const teacher = await ensurePreviewTeacher(db, schoolId);
      return NextResponse.json({ userId: teacher.id, role: "SCHOOL_TEACHER", redirectUrl: `/teacher/dashboard?userId=${teacher.id}&adminView=1` });
    }
    if (role === "school") {
      const schoolId = await ensurePreviewSchool(db);
      const staff = await ensurePreviewSchoolAdmin(db, schoolId);
      const school = (await db.prepare("SELECT admin_user_id FROM schools WHERE id = ?").get(schoolId)) as { admin_user_id: string | null } | undefined;
      if (school && !school.admin_user_id) {
        await db.prepare("UPDATE schools SET admin_user_id = ? WHERE id = ?").run(staff.id, schoolId);
      }
      return NextResponse.json({ userId: staff.id, role: "SCHOOL_ADMIN", redirectUrl: `/school/dashboard?userId=${staff.id}&adminView=1` });
    }
    return NextResponse.json({ error: "invalid role" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
