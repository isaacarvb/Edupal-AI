import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyPassword } from "@/lib/password";

export async function POST(req: Request) {
  try {
    const b = await req.json();
    const email = String(b?.email ?? "").trim().toLowerCase();
    const password = String(b?.password ?? "");

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const db = await getDb();
    const row = await db.prepare("SELECT id, name, code, email, password_hash FROM schools WHERE email = ?").get(email) as
      | { id: string; name: string; code: string; email: string; password_hash: string }
      | undefined;

    if (!row || !row.password_hash || !verifyPassword(password, row.password_hash)) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    return NextResponse.json({ ok: true, schoolId: row.id, code: row.code, name: row.name, email: row.email });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
