import { NextResponse } from "next/server";
import { noteTopics } from "@/lib/notes";

// Full note content per subject, straight from docs/notes/*.json.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const level = searchParams.get("level") === "junior" ? "junior" : "senior";
  const subject = searchParams.get("subject") ?? "";
  if (!subject) return NextResponse.json({ error: "subject required" }, { status: 400 });
  return NextResponse.json({ subject, topics: noteTopics(level, subject) });
}
