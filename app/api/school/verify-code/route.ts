import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    if (!code) return NextResponse.json({ error: "code required" }, { status: 400 });

    const db = await getDb();
    const school = await db.prepare(
      "SELECT id, name, code, active, expires_at FROM schools WHERE code = ?"
    ).get(code) as
      | { id: string; name: string; code: string; active: number; expires_at: string | null }
      | undefined;

    if (!school) return NextResponse.json({ error: "Invalid school code" }, { status: 404 });

    return NextResponse.json({ ok: true, school });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
