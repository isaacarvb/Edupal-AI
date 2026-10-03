import { NextResponse } from "next/server";
import { getDb, uid } from "@/lib/db";
import { groqChat, groqConfigured, type ChatMsg } from "@/lib/groq";
import { systemPrompt, isOffTopic, redirectNudge, type Language } from "@/lib/ai";

const HISTORY = 10;

// Conversation history for the tutor workspace.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const questionId = searchParams.get("questionId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT role, content FROM chat_messages WHERE user_id = ?
       ${questionId ? "AND question_id = ?" : "AND question_id IS NULL"}
       ORDER BY created_at DESC LIMIT 50`
    )
    .all(userId, ...(questionId ? [questionId] : []));
  return NextResponse.json({ messages: rows.reverse(), groq: groqConfigured() });
}

// One chat turn: prior context + question context → Groq (or local fallback) → reply.
export async function POST(req: Request) {
  const { userId, questionId, message, language } = await req.json();
  if (!userId || !message?.trim()) {
    return NextResponse.json({ error: "userId + message required" }, { status: 400 });
  }
  const lang: Language = language === "PIDGIN" ? "PIDGIN" : "SIMPLE";
  const db = getDb();
  const now = new Date().toISOString();

  const profile = db.prepare("SELECT exam FROM profiles WHERE user_id = ?").get(userId) as
    | { exam: string }
    | undefined;
  const q = questionId
    ? (db.prepare("SELECT subject, topic, stem, answer_key AS answerKey FROM questions WHERE id = ?").get(questionId) as
        | { subject: string; topic: string; stem: string; answerKey: string }
        | undefined)
    : undefined;

  const history = db
    .prepare(
      `SELECT role, content FROM chat_messages WHERE user_id = ?
       ${questionId ? "AND question_id = ?" : "AND question_id IS NULL"}
       ORDER BY created_at DESC LIMIT ${HISTORY}`
    )
    .all(userId, ...(questionId ? [questionId] : []))
    .reverse() as { role: string; content: string }[];

  let reply: string;
  let engine: "groq" | "local" = "local";
  if (isOffTopic(message)) {
    reply = redirectNudge(lang);
  } else if (groqConfigured()) {
    const system: ChatMsg = {
      role: "system",
      content:
        systemPrompt(q?.subject ?? "General", profile?.exam ?? "WAEC/JAMB") +
        `\nCurrent question: ${q ? `"${q.stem}" (topic ${q.topic}, answer: ${q.answerKey})` : "none — general study chat."}` +
        `\nReply in ${lang === "PIDGIN" ? "Nigerian Pidgin" : "Simple English"}. Keep it short: 2–4 sentences or a few numbered steps. Build directly on the conversation above.`
    };
    const messages: ChatMsg[] = [
      system,
      ...history.map((h) => ({ role: h.role as "user" | "assistant", content: h.content })),
      { role: "user", content: message.trim() }
    ];
    try {
      reply = await groqChat(messages);
      engine = "groq";
    } catch {
      reply =
        lang === "PIDGIN"
          ? "AI network busy right now — try again in a bit. Meantime, re-read the model answer above."
          : "The AI tutor is unreachable right now — try again shortly. Meanwhile, re-read the model answer above.";
    }
  } else {
    reply =
      lang === "PIDGIN"
        ? "I hear you. Give me one specific thing wey confuse you about dis question, and I go break am down step by step."
        : "Got it — tell me the exact step that confuses you about this question, and I'll break it down step by step.";
  }

  db.prepare("INSERT INTO chat_messages (id, user_id, question_id, role, content, created_at) VALUES (?, ?, ?, 'user', ?, ?)").run(
    uid(), userId, questionId ?? null, message.trim(), now
  );
  db.prepare("INSERT INTO chat_messages (id, user_id, question_id, role, content, created_at) VALUES (?, ?, ?, 'assistant', ?, ?)").run(
    uid(), userId, questionId ?? null, reply, now
  );
  return NextResponse.json({ reply, engine });
}
