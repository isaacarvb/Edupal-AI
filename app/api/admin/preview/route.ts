import { NextResponse } from "next/server";
import { getDb, uid } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { requireAdmin, adminIdFrom, PREVIEW_EMAIL } from "@/lib/admin";

// GET ?adminId= — find-or-create the built-in preview student for "User view".
// Any admin role may preview. The preview account is excluded from all counts.
export async function GET(req: Request) {
  try {
    await requireAdmin(adminIdFrom(req));
  } catch {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const db = await getDb();
  const now = new Date().toISOString();
  const grantUntil = new Date(Date.now() + 30 * 86400000).toISOString(); // preview = 30 days of Unlimited
  let row = (await db.prepare("SELECT id FROM users WHERE email = ?").get(PREVIEW_EMAIL)) as { id: string } | undefined;
  if (!row) {
    const id = uid();
    await db.prepare("INSERT INTO users (id, name, email, password_hash, role, level) VALUES (?, ?, ?, ?, 'STUDENT', 'SECONDARY')").run(
      id, "Preview Student", PREVIEW_EMAIL, hashPassword(`preview-${uid()}`)
    );
    await db.prepare("INSERT INTO wallets (user_id, credits_left, reset_at, plan, paid_until) VALUES (?, 9999, ?, 'UNLIMITED', ?)").run(id, now, grantUntil);
    await db.prepare("INSERT INTO streaks (user_id) VALUES (?)").run(id);
    await db.prepare("INSERT INTO profiles (user_id, exam, subjects) VALUES (?, 'JAMB', 'English,Mathematics')").run(id);
    row = { id };
  } else {
    // Preview always sees everything (paywalled features included).
    await db.prepare("UPDATE wallets SET plan = 'UNLIMITED', credits_left = 9999, paid_until = ? WHERE user_id = ?").run(grantUntil, row.id);
  }
  return NextResponse.json({ ok: true, userId: row.id });
}
