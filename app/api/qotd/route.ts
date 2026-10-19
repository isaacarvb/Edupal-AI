import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { personalizedQuestion, qotdDone } from "@/lib/qotd";

// Today's bonus question. Free even after limits (verified server-side on submit).
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  const db = await getDb();
  // Personalised: only subjects this student actually studies (set at onboarding).
  const q = await personalizedQuestion(db, userId);
  if (!q) return NextResponse.json({ error: "empty bank" }, { status: 404 });
  return NextResponse.json({ question: q, done: await qotdDone(db, userId, q.id) });
}
