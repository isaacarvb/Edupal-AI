import { NextResponse } from "next/server";
import { getDb, uid } from "@/lib/db";
import { requireAdmin, adminIdFrom, requireRole, logAudit } from "@/lib/admin";

// GET ?adminId= — all plans (admin). POST/PUT/DELETE — manage (SUPER/ADMIN only).
export async function GET(req: Request) {
  try {
    await requireAdmin(adminIdFrom(req));
  } catch {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const db = await getDb();
  const plans = await db.prepare("SELECT id, name, amount_kobo AS amountKobo, credits, active, created_at AS createdAt FROM plans ORDER BY amount_kobo").all();
  return NextResponse.json({ plans });
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
  const name = String(b?.name ?? "").trim();
  const amountKobo = Number(b?.amountKobo);
  if (!name || !(amountKobo > 0)) return NextResponse.json({ error: "name + amountKobo (>0) required" }, { status: 400 });
  const db = await getDb();
  const id = uid();
  await db.prepare("INSERT INTO plans (id, name, amount_kobo, credits, active) VALUES (?, ?, ?, ?, 1)").run(id, name, amountKobo, Number(b?.credits ?? 9999));
  await logAudit(db, admin.id, "plan:create", name);
  return NextResponse.json({ ok: true, id });
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
  if (!b?.id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const db = await getDb();
  await db.prepare("UPDATE plans SET name = ?, amount_kobo = ?, credits = ?, active = ? WHERE id = ?").run(
    String(b.name ?? ""), Number(b.amountKobo ?? 0), Number(b.credits ?? 9999), b.active ? 1 : 0, b.id
  );
  await logAudit(db, admin.id, "plan:update", String(b.id));
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const u = new URL(req.url);
  const id = u.searchParams.get("id");
  const adminId = u.searchParams.get("adminId");
  let admin;
  try {
    admin = await requireAdmin(adminId);
    requireRole(admin, ["SUPER_ADMIN", "ADMIN"]);
  } catch {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const db = await getDb();
  await db.prepare("DELETE FROM plans WHERE id = ?").run(id);
  await logAudit(db, admin.id, "plan:delete", id);
  return NextResponse.json({ ok: true });
}
