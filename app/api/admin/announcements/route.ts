import { NextResponse } from "next/server";
import { getDb, uid } from "@/lib/db";
import { requireAdmin, adminIdFrom, logAudit } from "@/lib/admin";

// GET ?adminId= — past announcements. POST {adminId, title, body, segment} — send.
export async function GET(req: Request) {
  try {
    await requireAdmin(adminIdFrom(req));
  } catch {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const db = await getDb();
  let list: Array<Record<string, unknown>> = [];
  try {
    list = await db.prepare("SELECT id, title, body, segment, created_by AS createdBy, created_at AS createdAt FROM announcements ORDER BY created_at DESC LIMIT 50").all();
  } catch {
    list = [];
  }
  return NextResponse.json({ announcements: list });
}

const SEGMENTS = ["all", "free", "paid", "sleeping"];

export async function POST(req: Request) {
  const b = await req.json();
  let admin;
  try {
    admin = await requireAdmin(b?.adminId ?? adminIdFrom(req));
  } catch {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const title = String(b?.title ?? "").trim();
  const body = String(b?.body ?? "").trim();
  const segment = SEGMENTS.includes(String(b?.segment)) ? String(b.segment) : "all";
  if (!title || !body) return NextResponse.json({ error: "title + body required" }, { status: 400 });
  const db = await getDb();
  const id = uid();
  await db.prepare("INSERT INTO announcements (id, title, body, segment, created_by) VALUES (?, ?, ?, ?, ?)").run(id, title, body, segment, admin.email);
  // Fan out to email outbox for the matching segment (mail provider sends them).
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
  let users: Array<{ id: string }> = [];
  if (segment === "all") {
    users = (await db.prepare("SELECT id FROM users WHERE role = 'STUDENT'").all()) as Array<{ id: string }>;
  } else if (segment === "free") {
    users = (await db.prepare("SELECT user_id AS id FROM wallets WHERE plan != 'UNLIMITED'").all()) as Array<{ id: string }>;
  } else if (segment === "paid") {
    users = (await db.prepare("SELECT user_id AS id FROM wallets WHERE plan = 'UNLIMITED'").all()) as Array<{ id: string }>;
  } else {
    users = (await db
      .prepare(
        `SELECT u.id FROM users u LEFT JOIN attempts a ON a.user_id = u.id
         WHERE u.role = 'STUDENT' GROUP BY u.id
         HAVING MAX(a.created_at) IS NULL OR MAX(a.created_at) < ?`
      )
      .all(weekAgo)) as Array<{ id: string }>;
  }
  for (const u of users) {
    await db.prepare("INSERT INTO email_outbox (id, user_id, kind, subject, body) VALUES (?, ?, 'announcement', ?, ?)").run(uid(), u.id, title, body);
  }
  await logAudit(db, admin.id, `announce:${segment}`, title);
  return NextResponse.json({ ok: true, id, emailed: users.length });
}
