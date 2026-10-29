import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// DELETE { userId } — Permanently delete user account and all related data.
export async function DELETE(req: Request) {
  const { userId } = await req.json();
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const db = await getDb();

  // Delete in dependency order:
  // 1. topic_mastery (references users)
  // 2. attempts (references users)
  // 3. streaks (references users)
  // 4. school_members (references users)
  // 5. parent_links (references users as student_id)
  // 6. wallet (references users)
  // 7. users (references itself via transactions user_id SET NULL)
  await db.prepare("DELETE FROM topic_mastery WHERE user_id = ?").run(userId);
  await db.prepare("DELETE FROM attempts WHERE user_id = ?").run(userId);
  await db.prepare("DELETE FROM streaks WHERE user_id = ?").run(userId);
  await db.prepare("DELETE FROM school_members WHERE user_id = ?").run(userId);
  await db.prepare("DELETE FROM parent_links WHERE student_id = ?").run(userId);
  await db.prepare("DELETE FROM school_teachers WHERE id = ?").run(userId);
  await db.prepare("DELETE FROM wallets WHERE user_id = ?").run(userId);
  await db.prepare("DELETE FROM users WHERE id = ?").run(userId);

  return NextResponse.json({ ok: true });
}
