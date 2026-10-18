import { NextResponse } from "next/server";
import { getCurriculumSubjects, getCurriculumTopic } from "@/lib/curriculum";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const subject = searchParams.get("subject");
  const topic = searchParams.get("topic");

  if (subject && topic) {
    const t = getCurriculumTopic(subject, topic);
    if (!t) return NextResponse.json({ error: "topic not found" }, { status: 404 });
    return NextResponse.json({ topic: t });
  }

  if (subject) {
    const subjects = getCurriculumSubjects();
    const s = subjects.find((subj) => subj.id === subject || subj.name.toLowerCase() === subject.toLowerCase());
    if (!s) return NextResponse.json({ error: "subject not found" }, { status: 404 });
    return NextResponse.json({ subject: s });
  }

  return NextResponse.json({ subjects: getCurriculumSubjects() });
}
