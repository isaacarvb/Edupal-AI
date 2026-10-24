import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// GET ?userId= — the school + class a student belongs to (null if none).
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const db = await getDb();
  try {
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
    const member = (await db
      .prepare("SELECT school_id AS \"schoolId\", class_name AS \"className\" FROM school_members WHERE user_id = ?")
      .get(userId)) as { schoolId: string; className: string } | undefined;
    return NextResponse.json(member ?? { schoolId: null, className: null });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
