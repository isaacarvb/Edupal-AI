import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    const b = await req.json();
    const schoolId = b?.schoolId;
    const students = Number(b?.students);
    const termMonths = Number(b?.termMonths);
    const amount = Number(b?.amount);
    const discountPercent = Number(b?.discountPercent);

    if (!schoolId) return NextResponse.json({ error: "School ID required" }, { status: 400 });
    if (!students || students < 1) return NextResponse.json({ error: "Valid student count required" }, { status: 400 });
    if (![3, 6, 9, 12].includes(termMonths)) return NextResponse.json({ error: "Term must be 3, 6, 9, or 12 months" }, { status: 400 });
    if (!amount || amount < 1) return NextResponse.json({ error: "Valid amount required" }, { status: 400 });

    const db = await getDb();

    // Verify school exists
    const school = await db.prepare("SELECT id, name, email, active, expires_at FROM schools WHERE id = ?").get(schoolId) as
      | { id: string; name: string; email: string; active: number; expires_at: string | null }
      | undefined;
    if (!school) return NextResponse.json({ error: "School not found" }, { status: 404 });

    // Calculate expiry date
    const now = new Date();
    const existingExpiry = school.expires_at ? new Date(school.expires_at) : null;
    const startDate = existingExpiry && existingExpiry > now ? existingExpiry : now;
    const expiresAt = new Date(startDate.getTime() + termMonths * 30 * 86400000).toISOString();

    const reference = `edu_${schoolId}_${Date.now()}`;

    // Create subscription record (pending until Paystack verifies)
    const subId = randomUUID();
    await db.prepare(
      "INSERT INTO school_subscriptions (id, school_id, students_count, term_months, amount_paid, discount_percent, paystack_reference, status, expires_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, datetime('now'))"
    ).run(subId, schoolId, students, termMonths, amount, discountPercent, reference, expiresAt);

    // Update school: set max_seats (student count) and mark active with new expiry
    await db.prepare(
      "UPDATE schools SET max_seats = ?, active = 1, expires_at = ? WHERE id = ?"
    ).run(students, expiresAt, schoolId);

    return NextResponse.json({ ok: true, reference, schoolId, amount, expiresAt });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
