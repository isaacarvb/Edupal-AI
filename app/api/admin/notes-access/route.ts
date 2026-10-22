import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin, adminIdFrom, requireRole, logAudit } from "@/lib/admin";
import { invalidateSiteSettings, type TopicAccess } from "@/lib/site-settings";
import { getCurriculumSubjects } from "@/lib/curriculum";

// Per-topic notes access from the admin portal.
// GET  ?adminId=              → { overrides, subjects } (subjects = full topic
//                               matrix, hidden topics included, no content)
// POST { adminId, key, access }  access = "FREE" | "UNLIMITED" | "HIDDEN" | null (null = back to default)

const ACCESS_SET: TopicAccess[] = ["FREE", "UNLIMITED", "HIDDEN"];
const KEY_RE = /^(SSS|JSS)\|[^|]{1,120}\|[^|]{1,220}$/;

export async function GET(req: Request) {
  try {
    await requireAdmin(adminIdFrom(req));
  } catch {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const db = await getDb();
  const row = (await db.prepare("SELECT value FROM site_settings WHERE key = 'notes_access'").get()) as { value: string } | undefined;
  let overrides: Record<string, TopicAccess> = {};
  try {
    overrides = JSON.parse(row?.value ?? "{}") ?? {};
  } catch {
    overrides = {};
  }
  const subjects = getCurriculumSubjects().map((s) => ({
    level: s.level,
    name: s.name,
    topics: s.topics.map((t, i) => ({ name: t.name, index: i }))
  }));
  return NextResponse.json({ overrides, subjects });
}

export async function POST(req: Request) {
  const b = await req.json();
  try {
    const admin = await requireAdmin(b?.adminId ?? adminIdFrom(req));
    requireRole(admin, ["SUPER_ADMIN", "ADMIN"]);
  } catch {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const key = String(b?.key ?? "");
  if (!KEY_RE.test(key)) return NextResponse.json({ error: "bad topic key" }, { status: 400 });
  const access = b?.access ?? null;
  if (access !== null && !ACCESS_SET.includes(access as TopicAccess)) {
    return NextResponse.json({ error: "access must be FREE, UNLIMITED, HIDDEN or null" }, { status: 400 });
  }

  const db = await getDb();
  const row = (await db.prepare("SELECT value FROM site_settings WHERE key = 'notes_access'").get()) as { value: string } | undefined;
  let overrides: Record<string, TopicAccess> = {};
  try {
    overrides = JSON.parse(row?.value ?? "{}") ?? {};
  } catch {
    overrides = {};
  }

  if (access === null) delete overrides[key];
  else overrides[key] = access as TopicAccess;

  const value = JSON.stringify(overrides);
  await db.prepare("INSERT INTO site_settings (key, value) VALUES ('notes_access', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").run(value);
  invalidateSiteSettings();
  await logAudit(db, b?.adminId, `notes:${access ?? "default"}`, key);

  return NextResponse.json({ ok: true, overrides });
}
