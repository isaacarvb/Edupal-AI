import { NextResponse } from "next/server";
import { getDb, uid } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { requireAdmin, adminIdFrom } from "@/lib/admin";

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
      let teacher = (await db.prepare("SELECT id FROM school_teachers LIMIT 1").get()) as { id: string } | undefined;
      if (!teacher) {
        const id = uid();
        const email = `teacher-${Date.now()}@edupal.local`;
        await db.prepare("INSERT INTO users (id, name, email, password_hash, role, level) VALUES (?, ?, ?, ?, 'SCHOOL_TEACHER', 'SECONDARY')").run(id, "Demo Teacher", email, await hashPassword("teacher-" + id));
        await db.prepare("INSERT INTO school_teachers (id, school_id, name, email, password_hash, classes, active) VALUES (?, NULL, ?, ?, ?, '', 1)").run(id, "Demo Teacher", email, await hashPassword("teacher-" + id));
        return NextResponse.json({ userId: id, role: "SCHOOL_TEACHER", redirectUrl: `/teacher/dashboard?userId=${id}&adminView=1` });
      }
      return NextResponse.json({ userId: teacher.id, role: "SCHOOL_TEACHER", redirectUrl: `/teacher/dashboard?userId=${teacher.id}&adminView=1` });
    }

    if (role === "school") {
      let staff = (await db.prepare("SELECT id FROM school_teachers WHERE school_id IS NOT NULL LIMIT 1").get()) as { id: string } | undefined;
      if (!staff) {
        const id = uid();
        const email = `staff-${Date.now()}@edupal.local`;
        await db.prepare("INSERT INTO users (id, name, email, password_hash, role, level) VALUES (?, ?, ?, ?, 'SCHOOL_ADMIN', 'SECONDARY')").run(id, "Demo School Admin", email, await hashPassword("staff-" + id));
        await db.prepare("INSERT INTO school_teachers (id, school_id, name, email, password_hash, classes, active) VALUES (?, NULL, ?, ?, ?, '', 1)").run(id, "Demo School Admin", email, await hashPassword("staff-" + id));
        await db.prepare("INSERT INTO wallets (user_id, credits_left, reset_at, plan) VALUES (?, 10, ?, 'FREE')").run(id, new Date().toISOString());
        await db.prepare("INSERT INTO streaks (user_id) VALUES (?)").run(id);
        return NextResponse.json({ userId: id, role: "SCHOOL_ADMIN", redirectUrl: `/school/dashboard?userId=${id}&adminView=1` });
      }
      return NextResponse.json({ userId: staff.id, role: "SCHOOL_ADMIN", redirectUrl: `/school/dashboard?userId=${staff.id}&adminView=1` });
    }

    return NextResponse.json({ error: "invalid role" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
