import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { ADMIN_ROLES, OWNER_ADMIN_EMAIL } from "@/lib/admin";

// POST {email, password} — owner + allowlisted admins can enter.
export async function POST(req: Request) {
  const { email, password } = await req.json();
  const clean = String(email ?? "").trim().toLowerCase();
  if (!clean || !password) return NextResponse.json({ error: "email + password required" }, { status: 400 });
  const db = await getDb();
  const row = (await db.prepare("SELECT id, email, role, password_hash AS hash FROM users WHERE email = ?").get(clean)) as
    | { id: string; email: string; role: string; hash: string | null }
    | undefined;
  if (!row?.hash || !verifyPassword(String(password), row.hash)) return NextResponse.json({ error: "wrong email or password" }, { status: 401 });
  let role = row.role;
  if (clean === OWNER_ADMIN_EMAIL) {
    if (role !== "SUPER_ADMIN") {
      await db.prepare("UPDATE users SET role = 'SUPER_ADMIN' WHERE id = ?").run(row.id);
      role = "SUPER_ADMIN";
    }
  } else {
    const allow = (await db.prepare("SELECT role FROM admin_allowlist WHERE email = ?").get(clean)) as
      | { role: string }
      | undefined;
    if (!allow) return NextResponse.json({ error: "not an admin account" }, { status: 403 });
    if (role !== allow.role) {
      await db.prepare("UPDATE users SET role = ? WHERE id = ?").run(allow.role, row.id);
      role = allow.role;
    }
  }
  if (!ADMIN_ROLES.includes(role)) return NextResponse.json({ error: "not an admin account" }, { status: 403 });
  return NextResponse.json({ ok: true, adminId: row.id, email: row.email, role });
}
