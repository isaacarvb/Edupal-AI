import { NextResponse } from "next/server";
import { getDb, uid } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { requireAdmin, adminIdFrom, isSuper, logAudit } from "@/lib/admin";
import { getSchoolById, schoolCode, schoolIsActive, schoolStatus } from "@/lib/schools";

// GET ?adminId= — all schools (members, group, status) + groups.
// POST {adminId, name, groupName?, adminName, adminEmail, adminPassword, maxSeats}
//   — create a school + its staff login (SUPER only).
// PATCH {adminId, schoolId, active?, expiresAt?, maxSeats?}
//   — activate/lapse a school (SUPER only). This is the manual subscription
//     switch: active=1 + expires_at = 6 months / 1 year from payment day.

export async function GET(req: Request) {
  try {
    await requireAdmin(adminIdFrom(req));
  } catch {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const db = await getDb();
  const schools = (await db
    .prepare(
      `SELECT s.id, s.name, s.code, s.active, s.expires_at AS "expiresAt", s.max_seats AS "maxSeats",
              s.admin_user_id AS "adminUserId", s.created_at AS "createdAt",
              g.name AS "groupName", u.email AS "adminEmail", u.name AS "adminName",
              (SELECT COUNT(*) FROM school_members sm WHERE sm.school_id = s.id) AS members
       FROM schools s
       LEFT JOIN school_groups g ON g.id = s.group_id
       LEFT JOIN users u ON u.id = s.admin_user_id
       ORDER BY s.created_at DESC`
    )
    .all()) as Array<Record<string, unknown>>;
  const groups = (await db.prepare("SELECT id, name FROM school_groups ORDER BY name").all()) as Array<{
    id: string;
    name: string;
  }>;
  return NextResponse.json({
    schools: schools.map((s) => ({ ...s, status: schoolStatus({ active: Number(s.active), expiresAt: (s.expiresAt as string) ?? null }) })),
    groups
  });
}

export async function POST(req: Request) {
  const b = await req.json();
  let admin;
  try {
    admin = await requireAdmin(b?.adminId ?? adminIdFrom(req));
    if (!isSuper(admin)) throw new Error("super only");
  } catch {
    return NextResponse.json({ error: "forbidden: super admin only" }, { status: 403 });
  }
  const name = String(b?.name ?? "").trim();
  const adminName = String(b?.adminName ?? "").trim();
  const adminEmail = String(b?.adminEmail ?? "").trim().toLowerCase();
  const adminPassword = String(b?.adminPassword ?? "");
  const maxSeats = Math.max(1, Math.min(100000, Number(b?.maxSeats) || 1000));
  const groupName = String(b?.groupName ?? "").trim();
  if (!name) return NextResponse.json({ error: "school name required" }, { status: 400 });
  if (!adminName || !adminEmail.includes("@")) return NextResponse.json({ error: "staff name + valid email required" }, { status: 400 });

  const db = await getDb();

  // Staff login: reuse an existing account if that email is already registered
  // (their personal account stays theirs; they just gain school duties).
  const existing = (await db.prepare("SELECT id FROM users WHERE email = ?").get(adminEmail)) as { id: string } | undefined;
  let staffId = existing?.id ?? "";
  if (!staffId) {
    if (adminPassword.length < 6) return NextResponse.json({ error: "staff password of 6+ characters required" }, { status: 400 });
    staffId = uid();
    await db
      .prepare("INSERT INTO users (id, name, email, password_hash, role, level) VALUES (?, ?, ?, ?, 'SCHOOL_ADMIN', 'SECONDARY')")
      .run(staffId, adminName, adminEmail, hashPassword(adminPassword));
    await db.prepare("INSERT INTO wallets (user_id, credits_left, reset_at, plan) VALUES (?, 10, ?, 'FREE')").run(staffId, new Date().toISOString());
    await db.prepare("INSERT INTO streaks (user_id) VALUES (?)").run(staffId);
  } else {
    await db.prepare("UPDATE users SET role = 'SCHOOL_ADMIN' WHERE id = ?").run(staffId);
  }

  // Group (school network) — find or create by name; single schools have none.
  let groupId: string | null = null;
  if (groupName) {
    const g = (await db.prepare("SELECT id FROM school_groups WHERE LOWER(name) = LOWER(?)").get(groupName)) as { id: string } | undefined;
    if (g) groupId = g.id;
    else {
      groupId = uid();
      await db.prepare("INSERT INTO school_groups (id, name) VALUES (?, ?)").run(groupId, groupName);
    }
  }

  const id = uid();
  let code = schoolCode();
  for (let i = 0; i < 5; i++) {
    const clash = await db.prepare("SELECT 1 FROM schools WHERE code = ?").get(code);
    if (!clash) break;
    code = schoolCode();
  }
  await db
    .prepare("INSERT INTO schools (id, group_id, name, code, admin_user_id, active, max_seats) VALUES (?, ?, ?, ?, ?, 0, ?)")
    .run(id, groupId, name, code, staffId, maxSeats);
  await logAudit(db, admin.id, "school:create", `${name} (${code})`);
  return NextResponse.json({ ok: true, schoolId: id, code, staffId, staffEmail: adminEmail });
}

export async function PATCH(req: Request) {
  const b = await req.json();
  let admin;
  try {
    admin = await requireAdmin(b?.adminId ?? adminIdFrom(req));
    if (!isSuper(admin)) throw new Error("super only");
  } catch {
    return NextResponse.json({ error: "forbidden: super admin only" }, { status: 403 });
  }
  const schoolId = String(b?.schoolId ?? "");
  if (!schoolId) return NextResponse.json({ error: "schoolId required" }, { status: 400 });
  const db = await getDb();
  const school = await getSchoolById(db, schoolId);
  if (!school) return NextResponse.json({ error: "school not found" }, { status: 404 });

  const next = {
    active: b?.active === undefined ? school.active : b.active ? 1 : 0,
    expiresAt: b?.expiresAt === undefined ? school.expiresAt : b.expiresAt ? String(b.expiresAt) : null,
    maxSeats: b?.maxSeats === undefined ? school.maxSeats : Math.max(1, Math.min(100000, Number(b.maxSeats) || school.maxSeats))
  };
  if (next.expiresAt && !Number.isFinite(Date.parse(next.expiresAt))) {
    return NextResponse.json({ error: "expiresAt must be a valid date" }, { status: 400 });
  }
  await db
    .prepare("UPDATE schools SET active = ?, expires_at = ?, max_seats = ? WHERE id = ?")
    .run(next.active, next.expiresAt, next.maxSeats, schoolId);
  await logAudit(db, admin.id, `school:${next.active ? "activate" : "deactivate"}`, `${school.name} until ${next.expiresAt ?? "—"} (${next.maxSeats} seats)`);
  return NextResponse.json({ ok: true, status: schoolIsActive({ active: next.active, expiresAt: next.expiresAt }) ? "ACTIVE" : "INACTIVE" });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const schoolId = searchParams.get("schoolId");
  let admin;
  try {
    admin = await requireAdmin(searchParams.get("adminId") ?? adminIdFrom(req));
    if (!isSuper(admin)) throw new Error("super only");
  } catch {
    return NextResponse.json({ error: "forbidden: super admin only" }, { status: 403 });
  }
  if (!schoolId) return NextResponse.json({ error: "schoolId required" }, { status: 400 });
  const db = await getDb();
  const school = await getSchoolById(db, schoolId);
  if (!school) return NextResponse.json({ error: "school not found" }, { status: 404 });

  // Delete all related data in dependency order.
  await db.prepare("DELETE FROM broadcasts WHERE school_id = ?").run(schoolId);
  await db.prepare("DELETE FROM assignments WHERE school_id = ?").run(schoolId);
  await db.prepare("DELETE FROM lesson_notes WHERE school_id = ?").run(schoolId);
  await db.prepare("DELETE FROM school_teachers WHERE school_id = ?").run(schoolId);
  await db.prepare("DELETE FROM school_members WHERE school_id = ?").run(schoolId);
  await db.prepare("DELETE FROM schools WHERE id = ?").run(schoolId);

  // If the school's admin user exists and is still a SCHOOL_ADMIN, revert them to STUDENT.
  if (school.adminUserId) {
    const stillAdmin = await db
      .prepare("SELECT role FROM users WHERE id = ? AND role = 'SCHOOL_ADMIN'")
      .get(school.adminUserId);
    if (stillAdmin) {
      await db.prepare("UPDATE users SET role = 'STUDENT' WHERE id = ?").run(school.adminUserId);
    }
  }

  await logAudit(db, admin.id, "school:delete", `${school.name} (${school.code})`);
  return NextResponse.json({ ok: true });
}
