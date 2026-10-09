import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// Student joins with the teacher's invite code.
export async function POST(req: Request) {
  const { userId, code } = await req.json();
  if (!userId || !code) return NextResponse.json({ error: "userId + code required" }, { status: 400 });
  const db = await getDb();
  const cls = await db
    .prepare("SELECT id, name FROM classes WHERE invite_code = ?")
    .get(String(code).trim().toUpperCase()) as { id: string; name: string } | undefined;
  if (!cls) return NextResponse.json({ error: "unknown class code" }, { status: 404 });
  await db.prepare("INSERT INTO class_members (class_id, student_id) VALUES (?, ?) ON CONFLICT DO NOTHING").run(cls.id, userId);
  return NextResponse.json({ ok: true, class: cls });
}
