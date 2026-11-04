import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const adminId = body?.adminId;
    if (!adminId) {
      return NextResponse.json({ error: "adminId required" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "forbidden: school admin required" }, { status: 403 });
  }
  const db = await getDb();
  try {
    const form = await req.formData();
    const adminId = String(form.get("adminId") ?? "");
    const studentsJson = String(form.get("students") ?? "[]");
    const students: Array<{ name: string; email: string; className: string }> = JSON.parse(studentsJson);

    if (!adminId || students.length === 0) {
      return NextResponse.json({ error: "adminId and students required" }, { status: 400 });
    }

    // Check seat limit (1500 locked)
    const school = (await db.prepare("SELECT max_seats FROM schools WHERE admin_user_id = ?").get(adminId)) as { max_seats: number } | undefined;
    const currentMembers = school?.max_seats ?? 0;

    // Get existing students count
    const existingCount = (await db.prepare("SELECT COUNT(*) AS n FROM school_members").get()) as { n: number } | undefined;
    const currentTaken = existingCount ? existingCount.n : 0;

    const canAdd = (currentTaken + students.length) <= currentMembers;
    if (!canAdd) {
      return NextResponse.json({ error: `Cannot add ${students.length} students. School has ${currentTaken}/${currentMembers} seats filled.` }, { status: 400 });
    }

    const now = new Date().toISOString();
    const added: string[] = [];

    for (const s of students) {
      // Check if student already exists
      const existing = (await db.prepare("SELECT id FROM school_members WHERE user_id = ? AND school_id = ?").get(s.email ?? "", adminId)) as { id: string } | undefined;
      if (existing) {
        continue;
      }

      const userId = crypto.randomUUID();
      // Add to users table
      await db.prepare("INSERT INTO users (id, name, email, role, level) VALUES (?, ?, ?, 'SCHOOL_STUDENT', 'SECONDARY')").run(userId, s.name, s.email);
      // Add to school_members
      await db.prepare("INSERT INTO school_members (id, school_id, user_id, class_name) VALUES (?, ?, ?, ?)").run(userId, adminId, userId, s.className);
      // Add streaks
      await db.prepare("INSERT INTO streaks (user_id) VALUES (?)").run(userId);
    }

    return NextResponse.json({ ok: true, imported: students.length });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}