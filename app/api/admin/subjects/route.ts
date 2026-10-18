import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin, adminIdFrom, logAudit } from "@/lib/admin";
import { SUBJECTS, JSS_SUBJECTS } from "@/lib/syllabus";

// GET ?adminId= — all subjects with ON/OFF state. POST {adminId, subject, active}.
export async function GET(req: Request) {
  try {
    await requireAdmin(adminIdFrom(req));
  } catch {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const db = await getDb();
  const all = [...new Set([...SUBJECTS, ...JSS_SUBJECTS])].sort();
  let rows: Array<{ subject: string; active: number }> = [];
  try {
    rows = (await db.prepare("SELECT subject, active FROM subject_config").all()) as Array<{ subject: string; active: number }>;
  } catch {
    rows = [];
  }
  const off = new Set(rows.filter((r) => !r.active).map((r) => r.subject));
  return NextResponse.json({ subjects: all.map((s) => ({ subject: s, active: off.has(s) ? 0 : 1 })) });
}

export async function POST(req: Request) {
  const b = await req.json();
  let admin;
  try {
    admin = await requireAdmin(b?.adminId ?? adminIdFrom(req));
  } catch {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const subject = String(b?.subject ?? "").trim();
  if (!subject) return NextResponse.json({ error: "subject required" }, { status: 400 });
  const db = await getDb();
  const v = b.active ? 1 : 0;
  await db.prepare("INSERT INTO subject_config (subject, active) VALUES (?, ?) ON CONFLICT(subject) DO UPDATE SET active = ?, updated_at = datetime('now')").run(subject, v, v);
  await logAudit(db, admin.id, `subject:${v ? "on" : "off"}`, subject);
  return NextResponse.json({ ok: true, subject, active: v });
}
