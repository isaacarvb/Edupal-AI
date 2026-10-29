import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// GET ?email= — returns lock status for an email
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });

  const db = await getDb();
  const row = await db
    .prepare("SELECT locked_until AS locked FROM users WHERE email = ?")
    .get(email) as { locked: string | null } | undefined;

  if (!row?.locked) {
    return NextResponse.json({ locked: false });
  }

  const lockedUntil = Date.parse(row.locked);
  if (!Number.isFinite(lockedUntil) || lockedUntil <= Date.now()) {
    return NextResponse.json({ locked: false });
  }

  return NextResponse.json({ locked: true, locked_until: row.locked });
}
