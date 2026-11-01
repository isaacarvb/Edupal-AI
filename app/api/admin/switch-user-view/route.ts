import { NextResponse } from "next/server";
import { getDb, uid } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { requireAdmin, adminIdFrom } from "@/lib/admin";

// Ensure a preview school exists so teacher/school-admin previews have a school
// to belong to. Returns the school id.
async function ensurePreviewSchool(db: any): Promise<string> {
  const existing = (await db.prepare("SELECT id FROM schools WHERE code = 'PREVIEW' LIMIT 1").get()) as { id: string } | undefined;
  if (existing) return existing.id;

  const schoolId = uid();
  const adminId = uid();
  const now = new Date().toISOString();
  await db.prepare(
    "INSERT INTO users (id, name, email, password_hash, role, level) VALUES (?, ?, ?, ?, 'SCHOOL_ADMIN', 'SECONDARY')"
  ).run(adminId, "Preview School Admin", "preview-school@edupal.local", await hashPassword("preview-school-" + adminId));
  await db.prepare("INSERT INTO wallets (user_id, credits_left, reset_at, plan) VALUES (?, 10, ?, 'FREE')").run(adminId, now, "FREE");
  await db.prepare(
    "INSERT INTO schools (id, name, code, admin_user_id, active, expires_at, max_seats) VALUES (?, ?, ?, ?, 1, NULL, 1000)"
  ).run(schoolId, "Preview School", "PREVIEW", adminId);
  return schoolId;
}

// Ensure a preview teacher exists for the given school.
async function ensurePreviewTeacher(db: any, schoolId: string): Promise<{ id: string; name: string; email: string }> {
  const existing = (await db.prepare("SELECT id, name, email FROM school_teachers WHERE school_id = ? AND email = ? LIMIT 1").get(schoolId, "preview-teacher@edupal.local")) as { id: string; name: string; email: string } | undefined;
  if (existing) return existing;

  const id = uid();
  const now = new Date().toISOString();
  await db.prepare(
    "INSERT INTO users (id, name, email, password_hash, role, level) VALUES (?, ?, ?, ?, 'SCHOOL_TEACHER', 'SECONDARY')"
  ).run(id, "Preview Teacher", "preview-teacher@edupal.local", await hashPassword("preview-teacher-" + id));
  await db.prepare("INSERT INTO wallets (user_id, credits_left, reset_at, plan) VALUES (?, 10, ?, 'FREE')").run(id, now, "FREE");
  await db.prepare(
    "INSERT INTO school_teachers (id, school_id, name, email, password_hash, classes, active) VALUES (?, ?, ?, ?, ?, '', 1)"
  ).run(id, schoolId, "Preview Teacher", "preview-teacher@edupal.local", await hashPassword("preview-teacher-" + id));
  return { id, name: "Preview Teacher", email: "preview-teacher@edupal.local" };
}

// Ensure a preview school admin (staff) exists for the given school.
async function ensurePreviewSchoolAdmin(db: any, schoolId: string): Promise<{ id: string; name: string; email: string }> {
  const existing = (await db.prepare("SELECT id, name, email FROM school_teachers WHERE school_id = ? AND email = ? LIMIT 1").get(schoolId, "preview-school@edupal.local")) as { id: string; name: string; email: string } | undefined;
  if (existing) return existing;

  const id = uid();
  const now = new Date().toISOString();
  await db.prepare(
    "INSERT INTO users (id, name, email, password_hash, role, level) VALUES (?, ?, ?, ?, 'SCHOOL_ADMIN', 'SECONDARY')"
  ).run(id, "Preview School Admin", "preview-school@edupal.local", await hashPassword("preview-school-" + id));
  await db.prepare("INSERT INTO wallets (user_id, credits_left, reset_at, plan) VALUES (?, 10, ?, 'FREE')").run(id, now, "FREE");
  await db.prepare(
    "INSERT INTO school_teachers (id, school_id, name, email, password_hash, classes, active) VALUES (?, ?, ?, ?, ?, '', 1)"
  ).run(id, schoolId, "Preview School Admin", "preview-school@edupal.local", await hashPassword("preview-school-" + id));
  return { id, name: "Preview School Admin", email: "preview-school@edupal.local" };
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
  const adminId = b?.adminId ?? "";

  const db = await getDb();

  try {
    if (role === "student") {
      let row = (await db.prepare("SELECT id FROM users WHERE email = ?").get("preview@edupal.local")) as { id: string } | undefined;
      if (!row) {
        const id = uid();
        await db.prepare("INSERT INTO users (id, name, email, password_hash, role, level) VALUES (?, ?, ?, ?, 'STUDENT', 'SECONDARY')").run(id, "Preview Student", "preview@edupal.local", await hashPassword("preview-" + id));
        await db.prepare("INSERT INTO wallets (user_id, credits_left, reset_at, plan) VALUES (?, 10, ?, 'FREE')").run(id, new Date().toISOString());
        await db.prepare("INSERT INTO streaks (user_id) VALUES (?)").run(id);
        await db.prepare("INSERT INTO profiles (user_id, exam, subjects) VALUES (?, 'JAMB', 'English,Mathematics')").run(id, "WAEC", "English,Mathematics");
        return NextResponse.json({ userId: id, role: "STUDENT", redirectUrl: `/dashboard?userId=${id}&adminView=1` });
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
      // Point the school's admin_user_id at this staff user if not already set.
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
