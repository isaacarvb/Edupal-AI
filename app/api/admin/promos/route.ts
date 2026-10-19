import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin, adminIdFrom, requireRole, logAudit } from "@/lib/admin";

// GET ?adminId= — list promo codes. POST — create {code, percentOff, maxUses, expiresOn}.
// PUT — toggle active. DELETE — remove.
export async function GET(req: Request) {
  try {
    await requireAdmin(adminIdFrom(req));
  } catch {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const db = await getDb();
  const codes = await db.prepare('SELECT code, percent_off AS "percentOff", max_uses AS "maxUses", used, active, expires_on AS "expiresOn" FROM promo_codes ORDER BY code').all();
  return NextResponse.json({ codes });
}

export async function POST(req: Request) {
  const b = await req.json();
  let admin;
  try {
    admin = await requireAdmin(b?.adminId ?? adminIdFrom(req));
    requireRole(admin, ["SUPER_ADMIN", "ADMIN"]);
  } catch {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const code = String(b?.code ?? "").trim().toUpperCase().replace(/[^A-Z0-9-]/g, "");
  const percentOff = Number(b?.percentOff ?? 0);
  if (!code || !(percentOff > 0 && percentOff <= 90)) return NextResponse.json({ error: "code + percentOff (1-90) required" }, { status: 400 });
  const db = await getDb();
  await db.prepare("INSERT INTO promo_codes (code, percent_off, max_uses, used, active, expires_on) VALUES (?, ?, ?, 0, 1, ?) ON CONFLICT DO NOTHING").run(
    code, percentOff, Number(b?.maxUses ?? 100) || 100, b?.expiresOn ? String(b.expiresOn) : null
  );
  await logAudit(db, admin.id, "promo:create", code);
  return NextResponse.json({ ok: true, code });
}

export async function PUT(req: Request) {
  const b = await req.json();
  let admin;
  try {
    admin = await requireAdmin(b?.adminId ?? adminIdFrom(req));
    requireRole(admin, ["SUPER_ADMIN", "ADMIN"]);
  } catch {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (!b?.code) return NextResponse.json({ error: "code required" }, { status: 400 });
  const db = await getDb();
  await db.prepare("UPDATE promo_codes SET active = ? WHERE code = ?").run(b.active ? 1 : 0, String(b.code));
  await logAudit(db, admin.id, "promo:toggle", String(b.code));
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const u = new URL(req.url);
  const code = u.searchParams.get("code");
  const adminId = u.searchParams.get("adminId");
  let admin;
  try {
    admin = await requireAdmin(adminId);
    requireRole(admin, ["SUPER_ADMIN", "ADMIN"]);
  } catch {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (!code) return NextResponse.json({ error: "code required" }, { status: 400 });
  const db = await getDb();
  await db.prepare("DELETE FROM promo_codes WHERE code = ?").run(code);
  await logAudit(db, admin.id, "promo:delete", code);
  return NextResponse.json({ ok: true });
}
