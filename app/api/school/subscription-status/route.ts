import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get("schoolId");

    if (!schoolId) {
      return NextResponse.json({ error: "School ID required" }, { status: 400 });
    }

    const db = await getDb();
    const school = await db.prepare(
      "SELECT id, name, code, email, active, expires_at, max_seats, seats_used FROM schools WHERE id = ?"
    ).get(schoolId) as
      | { id: string; name: string; code: string; email: string; active: number; expires_at: string | null; max_seats: number; seats_used: number }
      | undefined;

    if (!school) return NextResponse.json({ error: "School not found" }, { status: 404 });

    const isActive = school.active === 1 && school.expires_at && Date.parse(school.expires_at) > Date.now();

    return NextResponse.json({
      ok: true,
      school: {
        id: school.id,
        name: school.name,
        code: school.code,
        email: school.email,
        active: school.active,
        expires_at: school.expires_at,
        max_seats: school.max_seats,
        seats_used: school.seats_used,
        is_active: isActive
      },
      subscription: {
        active: school.active,
        expires_at: school.expires_at,
        is_active: isActive
      }
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
