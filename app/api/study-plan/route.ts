import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { buildStudyPlan } from "@/lib/studyplan";

// Personalized weekly plan from live mastery + exam countdown.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  const db = await getDb();
  return NextResponse.json(await buildStudyPlan(db, userId));
}
