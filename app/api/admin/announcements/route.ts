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
    list = await db.prepare('SELECT id, title, body, segment, created_by AS "createdBy", created_at AS "createdAt" FROM announcements ORDER BY created_at DESC LIMIT 50').all();
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

// DELETE ?adminId=&id= — remove an announcement everywhere: the popup/bell,
// its read receipts, and any queued (unsent) emails for it.
export async function DELETE(req: Request) {
  const u = new URL(req.url);
  const id = u.searchParams.get("id");
  let admin;
  try {
    admin = await requireAdmin(u.searchParams.get("adminId") ?? adminIdFrom(req));
  } catch {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const db = await getDb();
  const row = (await db.prepare('SELECT title, created_at AS "createdAt" FROM announcements WHERE id = ?').get(id)) as { title: string; createdAt: string } | undefined;
  if (!row) return NextResponse.json({ error: "not found" }, { status: 404 });
  await db.prepare("DELETE FROM announcement_reads WHERE announcement_id = ?").run(id);
  // Queued emails are matched by title; the timestamp compare is done in JS so
  // the two different DB time formats (sqlite " ", ISO "T") never mismatch.
  // Mail goes out via an external job, so anything still queued never sends.
  const parseDbTime = (s: string) => Date.parse(/[zZ]|[+-]\d\d:?\d\d$/.test(s) ? s : s.replace(" ", "T") + "Z");
  let emailsRemoved = 0;
  try {
    const annTime = parseDbTime(String(row.createdAt));
    const mails = (await db.prepare('SELECT id, created_at AS "createdAt" FROM email_outbox WHERE kind = \'announcement\' AND subject = ?').all(row.title)) as Array<{ id: string; createdAt: string }>;
    for (const m of mails) {
      const t = parseDbTime(String(m.createdAt));
      if (Number.isFinite(t) && t >= annTime - 5000) {
        await db.prepare("DELETE FROM email_outbox WHERE id = ?").run(m.id);
        emailsRemoved++;
      }
    }
  } catch (e) {
    console.error("announcement delete: outbox cleanup failed:", e);
  }
  await db.prepare("DELETE FROM announcements WHERE id = ?").run(id);
  await logAudit(db, admin.id, "announce:delete", row.title);
  return NextResponse.json({ ok: true, emailsRemoved });
}
