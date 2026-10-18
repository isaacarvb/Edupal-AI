import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// Public: subjects currently switched ON. User pages hide the rest.
export async function GET() {
  const db = await getDb();
  let off: string[] = [];
  try {
    const rows = (await db.prepare("SELECT subject FROM subject_config WHERE active = 0").all()) as Array<{ subject: string }>;
    off = rows.map((r) => r.subject);
  } catch {
    off = [];
  }
  return NextResponse.json({ hidden: off });
}
