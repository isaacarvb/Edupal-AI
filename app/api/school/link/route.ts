import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const b = await req.json();
    const userId = b?.userId;
    const schoolCode = b?.schoolCode;

    if (!userId || !schoolCode) {
      return NextResponse.json({ error: "userId and schoolCode required" }, { status: 400 });
    }

    const db = await getDb();

    // Find school by code
    const school = (await db.prepare("SELECT id, name, code, active, credit_pool AS creditPool, max_seats AS maxSeats, expires_at AS expiresAt FROM schools WHERE code = ?").get(schoolCode)) as
      | { id: string; name: string; code: string; active: number; creditPool: number; maxSeats: number; expiresAt: string | null }
      | undefined;

    if (!school) {
      return NextResponse.json({ error: "Invalid school code" }, { status: 404 });
    }

    // Check if already linked to a different school
    const existing = (await db.prepare("SELECT school_id FROM school_members WHERE user_id = ?").get(userId)) as { school_id: string } | undefined;
    if (existing && existing.school_id !== school.id) {
      return NextResponse.json({ error: "Already linked to a different school" }, { status: 400 });
    }

    // Link student to school
    await db.prepare(
      "INSERT OR REPLACE INTO school_members (id, school_id, user_id, class_name, created_at) VALUES (?, ?, ?, ?, datetime('now'))"
    ).run(require("crypto").randomUUID(), school.id, userId, "");

    return NextResponse.json({ ok: true, school: { id: school.id, name: school.name, code: school.code, active: school.active, creditPool: school.creditPool, maxSeats: school.maxSeats, expiresAt: school.expiresAt } });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}