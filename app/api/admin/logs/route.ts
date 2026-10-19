import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin, adminIdFrom } from "@/lib/admin";

// GET ?adminId=&kind=audit|errors — activity log + error log.
export async function GET(req: Request) {
  try {
    await requireAdmin(adminIdFrom(req));
  } catch {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const u = new URL(req.url);
  const kind = u.searchParams.get("kind") ?? "audit";
  const db = await getDb();
  if (kind === "errors") {
    let rows: Array<Record<string, unknown>> = [];
    try {
      rows = await db.prepare('SELECT source, message, created_at AS "createdAt" FROM error_logs ORDER BY created_at DESC LIMIT 100').all();
    } catch {
      rows = [];
    }
    return NextResponse.json({ errors: rows });
  }
  let rows: Array<Record<string, unknown>> = [];
  try {
    rows = await db.prepare('SELECT admin_id AS "adminId", action, target, created_at AS "createdAt" FROM admin_audit ORDER BY created_at DESC LIMIT 100').all();
  } catch {
    rows = [];
  }
  return NextResponse.json({ audit: rows });
}
