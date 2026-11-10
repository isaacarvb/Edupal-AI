import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyPassword } from "@/lib/password";

// Teacher login for the school portal.
// Authenticates against the school_teachers table (email + password_hash) and
// returns the teacher's user id so the frontend can set edupal_user /
// edupal_role and redirect to /teacher/dashboard.
export async function POST(req: Request) {
  try {
    const b = await req.json();
    const email = String(b?.email ?? "").trim().toLowerCase();
    const password = String(b?.password ?? "");

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const db = await getDb();
    const teacher = (await db.prepare(
      "SELECT id, user_id, name, email, password_hash, school_id, active FROM school_teachers WHERE email = ?"
    ).get(email)) as
      | { id: string; user_id: string | null; name: string; email: string; password_hash: string; school_id: string; active: number }
      | undefined;

    if (!teacher || !teacher.password_hash || !verifyPassword(password, teacher.password_hash)) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (teacher.active === 0) {
      return NextResponse.json({ error: "This teacher account is deactivated. Contact your school admin." }, { status: 403 });
    }

    const userId = teacher.user_id ?? teacher.id;

    return NextResponse.json({ ok: true, userId, schoolId: teacher.school_id, name: teacher.name, email: teacher.email });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
