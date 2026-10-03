// SERVER-ONLY Groq client. Import only from Route Handlers / server code.
// The key lives in .env.local (gitignored) and never reaches the browser:
// browser → our /api/chat → this module attaches the key → Groq.
const ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

export type ChatMsg = { role: "system" | "user" | "assistant"; content: string };

export function groqConfigured(): boolean {
  return !!process.env.GROQ_API_KEY;
}

export async function groqChat(messages: ChatMsg[]): Promise<string> {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("GROQ_API_KEY missing");
  const model = process.env.GROQ_MODEL ?? "llama-3.1-8b-instant";
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model, messages, temperature: 0.4, max_tokens: 500 })
  });
  if (!res.ok) {
    // Never leak the key or raw provider body to the client; log server-side only.
    console.error(`Groq error: ${res.status}`);
    throw new Error(`Groq request failed (${res.status})`);
  }
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("Groq returned no content");
  return text;
}
