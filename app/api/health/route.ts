import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: true, app: "edupal-ai", phase: 0, db: "sqlite", storage: "local" });
}
