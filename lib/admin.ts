import { getDb, uid, type Db } from "./db";

export const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN", "CONTENT_ADMIN"];

// Single owner: only this email can ever open the admin portal.
export const OWNER_ADMIN_EMAIL = "isaacareo34@gmail.com";

// Built-in fake student used only for admin previews ("User view").
// Excluded from counts, analytics and revenue so previews never pollute real numbers.
export const PREVIEW_EMAIL = "preview@edupal.local";

function isOwner(email: string | null | undefined): boolean {
  return String(email ?? "").trim().toLowerCase() === OWNER_ADMIN_EMAIL;
}

// Pilot-simple admin check: client sends ?adminId= or x-admin-id header.
// Server verifies: owner email always allowed; other emails must be on the
// admin_allowlist. Role comes from users.role (auto-synced from allowlist).
export async function requireAdmin(adminId: string | null): Promise<{ id: string; email: string; role: string }> {
  if (!adminId) throw new Error("adminId required");
  const db = await getDb();
  const row = (await db
    .prepare("SELECT id, email, role FROM users WHERE id = ?")
    .get(adminId)) as { id: string; email: string; role: string } | undefined;
  if (!row) throw new Error("admin not found");
  const email = String(row.email ?? "").toLowerCase();
  if (isOwner(row.email)) {
    if (row.role !== "SUPER_ADMIN") {
      await db.prepare("UPDATE users SET role = 'SUPER_ADMIN' WHERE id = ?").run(row.id);
      row.role = "SUPER_ADMIN";
    }
    return row;
  }
  const allow = (await db.prepare("SELECT role FROM admin_allowlist WHERE email = ?").get(email)) as
    | { role: string }
    | undefined;
  if (!allow) throw new Error("forbidden: not an admin");
  if (row.role !== allow.role) {
    await db.prepare("UPDATE users SET role = ? WHERE id = ?").run(allow.role, row.id);
    row.role = allow.role;
  }
  if (!ADMIN_ROLES.includes(row.role)) throw new Error("forbidden: ADMIN role required");
  return row;
}

// Restrict destructive/money pages to senior roles.
// CONTENT_ADMIN may edit questions/flags/drafts but cannot delete users,
// touch money, promos, settings, or other admins.
export function requireRole(admin: { role: string }, roles: string[]): void {
  if (!roles.includes(admin.role)) throw new Error("forbidden: needs " + roles.join("/"));
}

export function isSuper(admin: { role: string; email: string }): boolean {
  return admin.role === "SUPER_ADMIN" || isOwner(admin.email);
}

export function adminIdFrom(req: Request): string | null {
  try {
    const u = new URL(req.url);
    const q = u.searchParams.get("adminId");
    if (q) return q;
  } catch { /* ignore */ }
  const h = (req.headers as Headers)?.get?.("x-admin-id");
  return h || null;
}

export async function logAudit(db: Db, adminId: string | null, action: string, target = ""): Promise<void> {
  try {
    await db.prepare("INSERT INTO admin_audit (id, admin_id, action, target) VALUES (?, ?, ?, ?)").run(uid(), adminId ?? "", action, target);
  } catch { /* audit never blocks */ }
}

export async function logError(db: Db, source: string, message: string): Promise<void> {
  try {
    await db.prepare("INSERT INTO error_logs (id, source, message) VALUES (?, ?, ?)").run(uid(), source, String(message).slice(0, 1000));
  } catch { /* never blocks */ }
}

export async function isMaintenanceOn(db: Db): Promise<boolean> {
  const row = (await db.prepare("SELECT value FROM site_settings WHERE key = 'maintenance'").get()) as { value: string } | undefined;
  return row?.value === "1";
}
