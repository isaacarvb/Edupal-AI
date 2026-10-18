import { NextResponse } from "next/server";
import { getDb, dbMode, dbModeReason } from "@/lib/db";
import { groqConfigured } from "@/lib/groq";

export async function GET() {
  let dbStatus = dbMode;
  let dbDetail = dbModeReason;
  let dbOk = false;
  try {
    const db = await getDb();
    await db.prepare("SELECT 1").get();
    dbOk = true;
    // Read the mode AFTER connecting: on cold start the module-level values
    // are still the defaults until getDb() runs.
    dbStatus = dbMode;
    dbDetail = dbModeReason;
  } catch (e) {
    dbOk = false;
    dbDetail = `DB check failed: ${e instanceof Error ? e.message : String(e)}`;
  }
  return NextResponse.json({
    ok: dbOk,
    app: "edupal-ai",
    phase: 0,
    db: dbStatus,
    dbDetail,
    storage: dbStatus === "postgres" ? "postgres (Supabase)" : "local sqlite (ephemeral on Netlify)",
    groq: groqConfigured()
  });
}
