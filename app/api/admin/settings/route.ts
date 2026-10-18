import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin, adminIdFrom, requireRole, logAudit } from "@/lib/admin";

// GET ?adminId= — { maintenance: bool }
// POST {adminId, maintenance: bool}
export async function GET(req: Request) {
  try {
    await requireAdmin(adminIdFrom(req));
  } catch {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const db = await getDb();
  const row = (await db.prepare("SELECT value FROM site_settings WHERE key = 'maintenance'").get()) as { value: string } | undefined;
  return NextResponse.json({ maintenance: row?.value === "1" });
}

export async function POST(req: Request) {
  const b = await req.json();
  try {
    const admin = await requireAdmin(b?.adminId ?? adminIdFrom(req));
    requireRole(admin, ["SUPER_ADMIN", "ADMIN"]);
  } catch {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const db = await getDb();
  const v = b?.maintenance ? "1" : "0";
  await db.prepare("INSERT INTO site_settings (key, value) VALUES ('maintenance', ?) ON CONFLICT(key) DO UPDATE SET value = ?").run(v, v);
  await logAudit(db, b?.adminId, `maintenance:${v}`, "");
  return NextResponse.json({ ok: true, maintenance: v === "1" });
}
