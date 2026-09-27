// Pluggable AI. Local: Ollama stub. Prod: OpenAI via env.
export type ExplainInput = { subject: string; question: string; answer: string; language: "SIMPLE" | "PIDGIN" };

export async function explainAnswer(input: ExplainInput): Promise<string> {
  const provider = process.env.AI_PROVIDER ?? "local-stub";
  if (provider === "local-stub") {
    const tone = input.language === "PIDGIN" ? "My guy, " : "";
    return `${tone}Step-by-step for ${input.subject}: your answer was "${input.answer}". (Local stub — wire Ollama/OpenAI in prod. Syllabus-strict, study-buddy tone.)`;
  }
  throw new Error(`Unknown AI_PROVIDER=${provider}`);
}
