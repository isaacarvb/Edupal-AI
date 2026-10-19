import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getWallet } from "@/lib/credits";

// User side: GET ?userId= — unread announcements for this student (popup + bell).
// POST {userId, id} — mark one as read.
export async function GET(req: Request) {
  const u = new URL(req.url);
  const userId = u.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  const db = await getDb();
  let plan = "FREE";
  try {
    // getWallet enforces subscription expiry (expired Unlimited segments as free).
    const w = await getWallet(db, userId);
    if (w?.plan) plan = w.plan;
  } catch { /* wallets missing */ }
  let list: Array<Record<string, unknown>> = [];
  try {
    const all = (await db
      .prepare(
        `SELECT a.id, a.title, a.body, a.segment, a.created_at AS createdAt
         FROM announcements a
         LEFT JOIN announcement_reads r ON r.announcement_id = a.id AND r.user_id = ?
         WHERE r.user_id IS NULL ORDER BY a.created_at DESC LIMIT 10`
      )
      .all(userId)) as Array<Record<string, unknown>>;
    list = all.filter((a) => {
      const seg = String(a.segment ?? "all");
      if (seg === "all") return true;
      if (seg === "paid") return plan === "UNLIMITED";
      if (seg === "free") return plan !== "UNLIMITED";
      return true; // sleeping: show to everyone once
    });
  } catch {
    list = [];
  }
  return NextResponse.json({ unread: list, count: list.length });
}

export async function POST(req: Request) {
  const { userId, id } = await req.json();
  if (!userId || !id) return NextResponse.json({ error: "userId + id required" }, { status: 400 });
  const db = await getDb();
  await db.prepare("INSERT INTO announcement_reads (announcement_id, user_id) VALUES (?, ?) ON CONFLICT DO NOTHING").run(id, userId);
  return NextResponse.json({ ok: true });
}
