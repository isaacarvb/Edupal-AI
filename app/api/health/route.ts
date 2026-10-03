import { NextResponse } from "next/server";
import { groqConfigured } from "@/lib/groq";

export async function GET() {
  // groq: true/false only — the key itself never leaves the server.
  return NextResponse.json({ ok: true, app: "edupal-ai", phase: 0, db: "sqlite (node built-in)", storage: "local", groq: groqConfigured() });
}
