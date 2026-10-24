import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { logAudit } from "@/lib/admin";
import { requireSchoolAdmin } from "@/lib/schools";
import { createBroadcast, deleteBroadcast, getActiveBroadcasts } from "@/lib/lessons";

// GET ?userId=&classId= — list active broadcasts for the caller's school.
//   If classId given, returns school-wide + that class's broadcasts.
// POST {userId, className (nullable), body, startsAt, endsAt} — staff creates.
// DELETE ?broadcastId=&userId= — staff deletes.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const className = searchParams.get("className") ?? undefined;
  const db = await getDb();
  try {
    const { school } = await requireSchoolAdmin(db, userId);
    const broadcasts = await getActiveBroadcasts(db, school.id, className);
    return NextResponse.json({ broadcasts });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: e instanceof Error && e.message.includes("forbidden") ? 403 : 500 });
  }
}

export async function POST(req: Request) {
  const b = await req.json();
  const db = await getDb();
  try {
    const { school } = await requireSchoolAdmin(db, String(b?.userId ?? ""));
    const className = b?.className ? String(b.className) : null;
    const body = String(b?.body ?? "").trim();
    const startsAt = String(b?.startsAt ?? new Date().toISOString());
    const endsAt = b?.endsAt ? String(b.endsAt) : null;
    if (!body) return NextResponse.json({ error: "message body required" }, { status: 400 });
    const broadcast = await createBroadcast(db, { schoolId: school.id, className, body, startsAt, endsAt });
    await logAudit(db, school.adminUserId ?? "", "broadcast:create", className ? `class ${className}` : "whole school");
    return NextResponse.json({ ok: true, broadcast });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: e instanceof Error && e.message.includes("forbidden") ? 403 : 500 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const broadcastId = searchParams.get("broadcastId");
  const db = await getDb();
  try {
    const { school } = await requireSchoolAdmin(db, userId);
    await deleteBroadcast(db, broadcastId ?? "");
    await logAudit(db, school.adminUserId ?? "", "broadcast:delete", broadcastId ?? "");
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: e instanceof Error && e.message.includes("forbidden") ? 403 : 500 });
  }
}
