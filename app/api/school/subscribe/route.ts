import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireSchoolAdmin } from "@/lib/schools";
import { logAudit } from "@/lib/admin";

export async function POST(req: Request) {
  try {
    const db = await getDb();
    const { school } = await requireSchoolAdmin(db, (await req.json()).userId);
    
    const b = await req.json();
    const userId = b?.userId;
    const months = Number(b?.months);

    if (!userId || !months || ![4, 8, 12].includes(months)) {
      return NextResponse.json({ error: "Invalid subscription period. Choose 4, 8, or 12 months." }, { status: 400 });
    }

    // For test mode: directly activate subscription
    // In production, initiate Paystack payment first, then verify webhook before activating
    const expiresAt = new Date(Date.now() + months * 30 * 86400000).toISOString();

    await db.prepare("UPDATE schools SET active = 1, expires_at = ? WHERE id = ?").run(expiresAt, school.id);

    await logAudit(db, school.adminUserId ?? "", "school:subscribe", `${school.name} for ${months} months (via ${months > 8 ? "live" : "test"} mode)`);

    return NextResponse.json({ ok: true, expiresAt, months, mode: months > 8 ? "live" : "test" });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}