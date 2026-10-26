import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireSchoolAdmin } from "@/lib/schools";
import { logAudit } from "@/lib/admin";

// POST { userId, months: 4 | 8 | 12 }
// Activates school subscription with selected months.
// Only school staff can activate their own school.
export async function POST(req: Request) {
  const b = await req.json();
  try {
    const db = await getDb();
    const { school } = await requireSchoolAdmin(db, b?.userId);
    const months = Number(b?.months);
    if (![4, 8, 12].includes(months)) {
      return NextResponse.json({ error: "Invalid subscription period. Choose 4, 8, or 12 months." }, { status: 400 });
    }
    const expiresAt = new Date(Date.now() + months * 30 * 86400000).toISOString();
    await db.prepare("UPDATE schools SET active = 1, expires_at = ? WHERE id = ?").run(expiresAt, school.id);
    await logAudit(db, school.adminUserId ?? "", "school:subscribe", `${school.name} for ${months} months`);
    return NextResponse.json({ ok: true, expiresAt, months });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
