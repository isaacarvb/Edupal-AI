import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// Small account tweaks (language). Never touches the study plan.
export async function POST(req: Request) {
  const { userId, language } = await req.json();
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  if (!["SIMPLE", "PIDGIN"].includes(language)) return NextResponse.json({ error: "bad language" }, { status: 400 });
  const db = await getDb();
  const r = await db.prepare("UPDATE profiles SET language = ? WHERE user_id = ?").run(language, userId);
  if (r.changes === 0) return NextResponse.json({ error: "no study plan yet — finish onboarding first" }, { status: 404 });
  return NextResponse.json({ ok: true, language });
}
