import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { findPatterns } from "@/lib/patterns";

// Behavioral wrong-answer patterns for a student (beyond topic labels).
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  const db = getDb();
  return NextResponse.json({ patterns: findPatterns(db, userId) });
}
