import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { groqChat, groqConfigured, type ChatMsg } from "@/lib/groq";
import type { Language } from "@/lib/ai";

// "Explain this differently": same facts, simpler words + a fresh example.
export async function POST(req: Request) {
  const { userId, questionId, original, language } = await req.json();
  if (!userId || !questionId) {
    return NextResponse.json({ error: "userId + questionId required" }, { status: 400 });
  }
  const lang: Language = language === "PIDGIN" ? "PIDGIN" : "SIMPLE";
  const db = await getDb();
  const q = await db
    .prepare("SELECT subject, topic, stem, answer_key AS answerKey, marking_rubric AS markingRubric FROM questions WHERE id = ?")
    .get(questionId) as
    | { subject: string; topic: string; stem: string; answerKey: string; markingRubric: string }
    | undefined;
  if (!q) return NextResponse.json({ error: "unknown question" }, { status: 404 });

  let explanation = "";
  let engine: "groq" | "local" = "local";
  if (groqConfigured()) {
    const messages: ChatMsg[] = [
      {
        role: "system",
        content: `You are EduPal, a study-buddy tutor. The student did NOT understand this explanation: "${original ?? ""}". Rephrase it for a ${q.subject} ${q.topic} question ("${q.stem}", answer "${q.answerKey}"). Rules: strictly syllabus-aligned, ${lang === "PIDGIN" ? "Nigerian Pidgin" : "simpler Simple English than before"}, 2–3 short sentences, one DIFFERENT everyday example, encouraging tone.`
      },
      { role: "user", content: "Explain this differently please." }
    ];
    try {
      explanation = await groqChat(messages);
      engine = "groq";
    } catch {
      explanation = "";
    }
  }
  if (engine === "local") {
    explanation =
      lang === "PIDGIN"
        ? `Make we try anoda way: di answer na "${q.answerKey}". Think of ${q.topic} like dis — ${q.markingRubric} If e still hard, ask di AI tutor for one more example.`
        : `Let's try another angle: the answer is "${q.answerKey}". ${q.markingRubric} If that's still unclear, ask the AI tutor for one more example.`;
  }
  return NextResponse.json({ explanation, engine });
}
