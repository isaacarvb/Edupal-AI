import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireSchoolAdmin, requireSchoolTeacher, getSchoolById, schoolIsActive, type SchoolRow } from "@/lib/schools";

// GET ?userId= or ?schoolId= — resolves the caller's school and reports whether
// the school's subscription is currently active. This endpoint is intentionally
// NOT gated: it is how the UI knows to show the lock screen.
//
// ?schoolId= is used by the school admin portal (it signs in with the school
// email and stores the school id, not a user id). ?userId= is used by teachers.
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const schoolId = searchParams.get("schoolId");

    const db = await getDb();
    let school: SchoolRow | undefined;

    if (schoolId) {
      school = await getSchoolById(db, schoolId);
      if (!school) return NextResponse.json({ error: "School not found" }, { status: 404 });
    } else if (userId) {
      try {
        school = (await requireSchoolAdmin(db, userId)).school;
      } catch {
        try {
          school = (await requireSchoolTeacher(db, userId)).school;
        } catch {
          return NextResponse.json({ error: "forbidden: school session required" }, { status: 403 });
        }
      }
    }

    if (!school) return NextResponse.json({ error: "userId or schoolId required" }, { status: 400 });

    return NextResponse.json({
      ok: true,
      school: {
        id: school.id,
        name: school.name,
        active: school.active,
        expiresAt: school.expiresAt,
        maxSeats: school.maxSeats,
        seatsUsed: school.seatsUsed,
        isActive: schoolIsActive(school)
      }
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
