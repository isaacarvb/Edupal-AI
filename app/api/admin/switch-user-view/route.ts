import { NextResponse } from "next/server";
import { getDb, uid } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { requireAdmin, adminIdFrom } from "@/lib/admin";

const PREVIEW_SCHOOL_EMAIL = "preview-school@edupal.local";
const PREVIEW_TEACHER_EMAIL = "preview-teacher@edupal.local";
const PREVIEW_STUDENT_EMAIL = "preview@edupal.local";

// Ensure a preview school exists. Returns the school id.
async function ensurePreviewSchool(db: any): Promise<string> {
  const existing = (await db.prepare("SELECT id FROM schools WHERE code = 'PREVIEW' LIMIT 1").get()) as { id: string } | undefined;
  if (existing) return existing.id;

  const schoolId = uid();
  const adminId = uid();
  const now = new Date().toISOString();
  await db.prepare(
    "INSERT INTO users (id, name, email, password_hash, role, level) VALUES (?, ?, ?, ?, 'SCHOOL_ADMIN', 'SECONDARY')"
  ).run(adminId, "Preview School Admin", PREVIEW_SCHOOL_EMAIL, await hashPassword("preview-school-" + adminId));
  await db.prepare("INSERT INTO wallets (user_id, credits_left, reset_at, plan) VALUES (?, 10, ?, 'FREE')").run(adminId, now, "FREE");
  await db.prepare(
    "INSERT INTO schools (id, name, code, admin_user_id, active, expires_at, max_seats) VALUES (?, ?, ?, ?, 1, NULL, 1000)"
  ).run(schoolId, "Preview School", "PREVIEW", adminId);
  return schoolId;
}

// Ensure a preview teacher exists for the given school.
// Handles partial-creation states: checks both users and school_teachers tables.
async function ensurePreviewTeacher(db: any, schoolId: string): Promise<{ id: string; name: string; email: string }> {
  // Check school_teachers first (canonical source)
  const existing = (await db.prepare("SELECT id, name, email FROM school_teachers WHERE email = ? LIMIT 1").get(PREVIEW_TEACHER_EMAIL)) as { id: string; name: string; email: string } | undefined;
  if (existing) return existing;

  // Check users table for a partial/orphaned record
  const userRow = (await db.prepare("SELECT id FROM users WHERE email = ? LIMIT 1").get(PREVIEW_TEACHER_EMAIL)) as { id: string } | undefined;
  const id = userRow?.id ?? uid();
  const now = new Date().toISOString();

  // Upsert users record (ignore if exists)
  try {
    await db.prepare(
      "INSERT INTO users (id, name, email, password_hash, role, level) VALUES (?, ?, ?, ?, 'SCHOOL_TEACHER', 'SECONDARY')"
    ).run(id, "Preview Teacher", PREVIEW_TEACHER_EMAIL, await hashPassword("preview-teacher-" + id));
  } catch {
    // email may already exist — that's fine, we'll use the existing id
  }

  // Upsert wallet
  try {
    await db.prepare("INSERT INTO wallets (user_id, credits_left, reset_at, plan) VALUES (?, 10, ?, 'FREE')").run(id, now, "FREE");
  } catch {
    // wallet may already exist
  }

  // Insert into school_teachers (ignore if exists)
  try {
    await db.prepare(
      "INSERT INTO school_teachers (id, school_id, name, email, password_hash, classes, active) VALUES (?, ?, ?, ?, ?, '', 1)"
    ).run(id, schoolId, "Preview Teacher", PREVIEW_TEACHER_EMAIL, await hashPassword("preview-teacher-" + id));
  } catch {
    // school_teachers row may already exist
  }

  return { id, name: "Preview Teacher", email: PREVIEW_TEACHER_EMAIL };
}

// Ensure a preview school admin (staff) exists for the given school.
async function ensurePreviewSchoolAdmin(db: any, schoolId: string): Promise<{ id: string; name: string; email: string }> {
  const existing = (await db.prepare("SELECT id, name, email FROM school_teachers WHERE email = ? LIMIT 1").get(PREVIEW_SCHOOL_EMAIL)) as { id: string; name: string; email: string } | undefined;
  if (existing) return existing;

  const userRow = (await db.prepare("SELECT id FROM users WHERE email = ? LIMIT 1").get(PREVIEW_SCHOOL_EMAIL)) as { id: string } | undefined;
  const id = userRow?.id ?? uid();
  const now = new Date().toISOString();

  try {
    await db.prepare(
      "INSERT INTO users (id, name, email, password_hash, role, level) VALUES (?, ?, ?, ?, 'SCHOOL_ADMIN', 'SECONDARY')"
    ).run(id, "Preview School Admin", PREVIEW_SCHOOL_EMAIL, await hashPassword("preview-school-" + id));
  } catch { /* user may exist */ }

  try {
    await db.prepare("INSERT INTO wallets (user_id, credits_left, reset_at, plan) VALUES (?, 10, ?, 'FREE')").run(id, now, "FREE");
  } catch { /* wallet may exist */ }

  try {
    await db.prepare(
      "INSERT INTO school_teachers (id, school_id, name, email, password_hash, classes, active) VALUES (?, ?, ?, ?, ?, '', 1)"
    ).run(id, schoolId, "Preview School Admin", PREVIEW_SCHOOL_EMAIL, await hashPassword("preview-school-" + id));
  } catch { /* school_teachers may exist */ }

  return { id, name: "Preview School Admin", email: PREVIEW_SCHOOL_EMAIL };
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
