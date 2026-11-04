import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin, adminIdFrom } from "@/lib/admin";

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin(adminIdFrom(req));
    if (!admin) {
      return NextResponse.json({ error: "forbidden: admin required" }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "forbidden: admin required" }, { status: 403 });
  }

  const db = await getDb();
  const b = await req.formData();
  const schoolId = b.get("schoolId") ?? "";
  const accessType = b.get("accessType") ?? "";
  const days = b.get("days") ?? "";

  if (!schoolId) {
    return NextResponse.json({ error: "School ID required" }, { status: 400 });
  }

  if (accessType === "FREE_FULL") {
    // Grant full free access - set school active with no end date
    await db.prepare("UPDATE schools SET active = 1, expires_at = NULL, admin_emails = '' WHERE id = ?").run(schoolId);
    return NextResponse.json({ ok: true, message: "School granted free full access." });
  } else if (accessType === "PILOT" && days) {
    // Grant pilot access with custom days
    const expiresAt = new Date(Date.now() + Number(days) * 86400000).toISOString();
    await db.prepare("UPDATE schools SET active = 1, expires_at = ?, admin_emails = '' WHERE id = ?").run(expiresAt, schoolId);
    return NextResponse.json({ ok: true, message: `School granted pilot access for ${days} days.` });
  } else {
    return NextResponse.json({ error: "Invalid access type or days." }, { status: 400 });
  }
}