import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
export async function GET() {
  const db = await getDb();
  const row = (await db.prepare("SELECT value FROM site_settings WHERE key = 'maintenance'").get()) as { value: string } | undefined;
  return NextResponse.json({ maintenance: row?.value === "1" });
}
