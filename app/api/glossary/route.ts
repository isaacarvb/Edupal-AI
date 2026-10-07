import { NextResponse } from "next/server";
import { GLOSSARY } from "@/lib/syllabus";

// Built-in key terms per subject/topic (static syllabus map, works offline).
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const subject = searchParams.get("subject") ?? "";
  const topic = searchParams.get("topic") ?? "";
  const subj = GLOSSARY[subject];
  if (!subj) return NextResponse.json({ terms: [] });
  if (topic) return NextResponse.json({ terms: subj[topic] ?? [] });
  return NextResponse.json({ topics: Object.keys(subj) });
}
