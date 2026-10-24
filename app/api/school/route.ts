import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireSchoolAdmin, schoolIsActive, schoolStatus, countMembers } from "@/lib/schools";

// GET ?userId= — everything the School Portal landing page shows.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const db = await getDb();
  try {
    const { school, staffName, staffEmail } = await requireSchoolAdmin(db, userId);
    const members = await countMembers(db, school.id);
    const classes = (await db
      .prepare('SELECT class_name AS "className", COUNT(*) AS n FROM school_members WHERE school_id = ? GROUP BY class_name ORDER BY "className"')
      .all(school.id)) as Array<{ className: string; n: number | string }>;
    const group = school.groupId
      ? ((await db.prepare("SELECT name FROM school_groups WHERE id = ?").get(school.groupId)) as { name: string } | undefined)
      : undefined;
    return NextResponse.json({
      school: { ...school, status: schoolStatus(school), access: schoolIsActive(school) },
      groupName: group?.name ?? "",
      staff: { name: staffName, email: staffEmail },
      members,
      classes: classes.map((c) => ({ className: c.className, n: Number(c.n) }))
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: e instanceof Error && e.message.includes("forbidden") ? 403 : 500 });
  }
}
