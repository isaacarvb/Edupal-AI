import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    const b = await req.json();
    const name = String(b?.name ?? "").trim();
    const address = String(b?.address ?? "").trim();
    const location = String(b?.location ?? "").trim();
    const email = String(b?.email ?? "").trim().toLowerCase();
    const password = String(b?.password ?? "");
    const students = Number(b?.students) || 0;

    if (!name) return NextResponse.json({ error: "School name required" }, { status: 400 });
    if (!address) return NextResponse.json({ error: "Address required" }, { status: 400 });
    if (!email || !email.includes("@")) return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    if (!password || password.length < 6) return NextResponse.json({ error: "Password must be 6+ characters" }, { status: 400 });
    if (!students || students < 1) return NextResponse.json({ error: "Number of students must be at least 1" }, { status: 400 });

    const db = await getDb();

    // Check if email already registered
    const existing = await db.prepare("SELECT id FROM schools WHERE email = ?").get(email);
    if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 400 });

    // Auto-generate school code: first 3 letters + year + 4 random chars
    const prefix = name.slice(0, 3).toUpperCase().padEnd(3, "X");
    const year = new Date().getFullYear();
    const random = randomUUID().replace(/-/g, "").slice(0, 4).toUpperCase();
    const code = `${prefix}-${year}-${random}`;

    // Ensure code is unique
    let codeExists = await db.prepare("SELECT id FROM schools WHERE code = ?").get(code);
    while (codeExists) {
      const random2 = randomUUID().replace(/-/g, "").slice(0, 4).toUpperCase();
      const code2 = `${prefix}-${year}-${random2}`;
      codeExists = await db.prepare("SELECT id FROM schools WHERE code = ?").get(code2);
      if (!codeExists) { break; }
    }

    const passwordHash = hashPassword(password);
    const id = randomUUID();
    const now = new Date().toISOString();

    await db.prepare(
      "INSERT INTO schools (id, name, code, email, password_hash, address, location, active, max_seats, seats_used, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, 0, ?)"
    ).run(id, name, code, email, passwordHash, address, location, students, now);

    return NextResponse.json({ ok: true, schoolId: id, code, name, email });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
