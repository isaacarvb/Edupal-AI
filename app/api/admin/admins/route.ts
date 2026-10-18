import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin, adminIdFrom, isSuper, logAudit } from "@/lib/admin";

// GET ?adminId= — admins (users with admin roles + allowlist).
// POST {adminId, email, role} — invite admin (SUPER only; they sign up then log in at /admin).
// DELETE ?email=&adminId= — remove admin (SUPER only; owner cannot be removed).
export async function GET(req: Request) {
  try {
    await requireAdmin(adminIdFrom(req));
  } catch {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const db = await getDb();
  const users = (await db.prepare("SELECT name, email, role FROM users WHERE role IN ('ADMIN','SUPER_ADMIN','CONTENT_ADMIN') ORDER BY email").all()) as Array<{ name: string; email: string; role: string }>;
  let allow: Array<{ email: string; role: string }> = [];
  try {
    allow = (await db.prepare("SELECT email, role FROM admin_allowlist ORDER BY email").all()) as Array<{ email: string; role: string }>;
  } catch {
    allow = [];
  }
  return NextResponse.json({ admins: users, allowlist: allow });
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
  const email = String(b?.email ?? "").trim().toLowerCase();
  const role = ["ADMIN", "CONTENT_ADMIN", "SUPER_ADMIN"].includes(String(b?.role)) ? String(b.role) : "CONTENT_ADMIN";
  if (!email.includes("@")) return NextResponse.json({ error: "valid email required" }, { status: 400 });
  const db = await getDb();
  await db.prepare("INSERT INTO admin_allowlist (email, role) VALUES (?, ?) ON CONFLICT(email) DO UPDATE SET role = ?").run(email, role, role);
  await db.prepare("UPDATE users SET role = ? WHERE email = ?").run(role, email);
  await logAudit(db, admin.id, `admin:add:${role}`, email);
  return NextResponse.json({ ok: true, email, role });
}

export async function DELETE(req: Request) {
  const u = new URL(req.url);
  const email = (u.searchParams.get("email") ?? "").toLowerCase();
  const adminId = u.searchParams.get("adminId");
  let admin;
  try {
    admin = await requireAdmin(adminId);
    if (!isSuper(admin)) throw new Error("super only");
  } catch {
    return NextResponse.json({ error: "forbidden: super admin only" }, { status: 403 });
  }
  if (!email || email === String(admin.email).toLowerCase()) return NextResponse.json({ error: "cannot remove self" }, { status: 400 });
  const db = await getDb();
  await db.prepare("DELETE FROM admin_allowlist WHERE email = ?").run(email);
  await db.prepare("UPDATE users SET role = 'STUDENT' WHERE email = ?").run(email);
  await logAudit(db, admin.id, "admin:remove", email);
  return NextResponse.json({ ok: true });
}
