import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// The student's newest parent link, for the payment-success screen
// ("share this with your parent" copy box). Same userId-level access model as
// the rest of the app (read-only progress view — no secrets beyond the link).
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  const db = await getDb();
  const row = (await db
    .prepare(
      'SELECT parent_email AS "parentEmail", magic_token AS token FROM parent_links WHERE student_id = ? ORDER BY COALESCE(created_at, \'\') DESC LIMIT 1'
    )
    .get(userId)) as { parentEmail: string; token: string } | undefined;
  if (!row?.token) return NextResponse.json({ link: null });
  const base = new URL(req.url).origin;
  return NextResponse.json({ link: `${base}/parent?token=${row.token}`, parentEmail: row.parentEmail });
}
