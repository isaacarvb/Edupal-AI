import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// Parent view-only summary via magic link (?token=). Verifies contact on first open.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  if (!token) return NextResponse.json({ error: "token required" }, { status: 400 });
  const db = await getDb();
  const link = await db
    .prepare('SELECT student_id AS "studentId", parent_email AS "parentEmail", verified_at AS "verifiedAt" FROM parent_links WHERE magic_token = ?')
    .get(token) as { studentId: string; parentEmail: string; verifiedAt: string | null } | undefined;
  if (!link) return NextResponse.json({ error: "bad link" }, { status: 404 });
  if (!link.verifiedAt) {
    await db.prepare("UPDATE parent_links SET verified_at = ? WHERE magic_token = ?").run(new Date().toISOString(), token);
  }
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
  const summary = await db
    .prepare(
      `SELECT p.exam, u.name AS "childName", s.current AS streak, w.plan,
              (SELECT COUNT(*) FROM attempts WHERE user_id = ? AND SUBSTRING(created_at,1,10) >= ?) AS "weekAttempts"
       FROM users u LEFT JOIN profiles p ON p.user_id = u.id
       LEFT JOIN streaks s ON s.user_id = u.id LEFT JOIN wallets w ON w.user_id = u.id
       WHERE u.id = ?`
    )
    .get(link.studentId, weekAgo, link.studentId);
  const weak = await db
    .prepare("SELECT subject, topic, accuracy, label FROM topic_mastery WHERE user_id = ? ORDER BY accuracy ASC LIMIT 5")
    .all(link.studentId);
  return NextResponse.json({ parentEmail: link.parentEmail, summary, weak });
}
