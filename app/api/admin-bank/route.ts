import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// Owner-only bank census (which subjects can actually serve practice).
export async function GET() {
  const db = await getDb();
  const counts = await db
    .prepare("SELECT subject, COUNT(*) AS n FROM questions GROUP BY subject ORDER BY subject")
    .all() as { subject: string; n: number }[];
  return NextResponse.json({ counts });
}
