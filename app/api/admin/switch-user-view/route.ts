import { NextResponse } from "next/server";
import { getDb, uid } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { requireAdmin, adminIdFrom } from "@/lib/admin";

const PREVIEW_SCHOOL_EMAIL = "preview-school@edupal.local";
const PREVIEW_TEACHER_EMAIL = "preview-teacher@edupal.local";
const PREVIEW_STUDENT_EMAIL = "preview@edupal.local";

// Find the most recently created school (the one the admin just created in /admin/schools)
async function getMostRecentSchool(db: any): Promise<{ id: string; name: string } | null> {
  const row = (await db.prepare(
    "SELECT id, name FROM schools ORDER BY created_at DESC LIMIT 1"
  ).get()) as { id: string; name: string } | undefined;
  return row ?? null;
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

    // Teacher and School Admin both need a school. Use the most recently created school.
    const school = await getMostRecentSchool(db);
    if (!school) {
      return NextResponse.json({ error: "No school found. Create a school first in the Schools section." }, { status: 400 });
    }

    if (role === "teacher") {
      const teacher = await ensurePreviewTeacher(db, school.id);
      return NextResponse.json({ userId: teacher.id, role: "SCHOOL_TEACHER", redirectUrl: `/teacher/dashboard?userId=${teacher.id}&adminView=1` });
    }

    if (role === "school") {
      const staff = await ensurePreviewSchoolAdmin(db, school.id);
      const s = (await db.prepare("SELECT admin_user_id FROM schools WHERE id = ?").get(school.id)) as { admin_user_id: string | null } | undefined;
      if (s && !s.admin_user_id) {
        await db.prepare("UPDATE schools SET admin_user_id = ? WHERE id = ?").run(staff.id, school.id);
      }
      return NextResponse.json({ userId: staff.id, role: "SCHOOL_ADMIN", redirectUrl: `/school/dashboard?userId=${staff.id}&adminView=1` });
    }

    return NextResponse.json({ error: "invalid role" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
