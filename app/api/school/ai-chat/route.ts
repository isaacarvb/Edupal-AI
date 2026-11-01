import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireSchoolAdmin } from "@/lib/schools";

// POST { userId, message, lessonNoteId? }
// AI tutor that answers based on school-approved lesson notes
export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const { message, lessonNoteId } = await req.json();

  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  if (!message || !message.trim()) return NextResponse.json({ error: "message required" }, { status: 400 });

  const db = await getDb();

  // Get the school and verify it's active
  const { school } = await requireSchoolAdmin(db, userId);
  if (!school.active) return NextResponse.json({ error: "School subscription not active" }, { status: 403 });

  // Build context from approved lesson notes
  let context = "";
  if (lessonNoteId) {
    // Get specific note
    const note = await db.prepare("SELECT * FROM lesson_notes WHERE id = ? AND school_id = ? AND status = 'approved'").get(lessonNoteId, school.id) as any;
    if (note) {
      context = `School lesson note: "${note.topic}" - ${note.subject}\n${note.body}\n\n`;
    }
  } else {
    // Get all approved notes for context (limit to recent ones)
    const notes = await db.prepare(
      "SELECT subject, topic, body FROM lesson_notes WHERE school_id = ? AND status = 'approved' ORDER BY created_at DESC LIMIT 5"
    ).all(school.id) as Array<{ subject: string; topic: string; body: string }>;
    if (notes.length > 0) {
      context = "School-approved lesson notes:\n" + notes.map((n) => `${n.subject} - ${topic}: ${n.body}`).join("\n\n");
    }
  }

  // Build AI prompt
  const systemPrompt = `You are EduPal AI, a helpful school tutor. Answer the student's question based on the school-approved lesson notes provided below. If the answer is in the notes, cite the topic. If the answer is not in the notes, say so clearly and offer to help with general knowledge instead. Be encouraging and educational.

School context: ${school.name}
School Code: ${school.code}

${context}`;

  try {
    // Call Groq API for AI response
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!groqResponse.ok) {
      return NextResponse.json({ error: "AI service unavailable" }, { status: 500 });
    }

    const groqData = await groqResponse.json();
    const aiResponse = groqData.choices[0].message.content;

    return NextResponse.json({
      ok: true,
      response: aiResponse,
      source: lessonNoteId ? "school-notes" : "general"
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "failed" }, { status: 500 });
  }
}
