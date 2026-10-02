// Pluggable AI feedback engine (PRD Module B + §8 guardrails).
// Local: deterministic heuristic stub (no downloads). Prod: route these same
// functions through Ollama/OpenAI — prompts and return shapes stay identical.

export type Language = "SIMPLE" | "PIDGIN";

export type ExplainInput = {
  subject: string;
  topic: string;
  question: string;
  answer: string;
  correctAnswer: string;
  rubric: string;
  wasCorrect: boolean;
  language: Language;
};

export type TheoryGrade = {
  score: number;
  maxScore: number;
  hits: string[];
  misses: string[];
  tips: string[];
  modelAnswer: string;
};

// --- Guardrails (§8) --------------------------------------------------------

const OFF_TOPIC_HINTS = ["bet9ja", "bet ", "football", "music", "movie", "game", "whatsapp", "facebook", "tiktok"];

export function isOffTopic(text: string): boolean {
  const t = text.toLowerCase();
  return OFF_TOPIC_HINTS.some((h) => t.includes(h));
}

export function redirectNudge(language: Language): string {
  return language === "PIDGIN"
    ? "Oya make we focus — dis one no be exam topic. Pick one weak topic make we practice."
    : "Let's stay focused — that's off-topic. Pick a weak topic and we'll practice it.";
}

export function systemPrompt(subject: string, exam: string): string {
  return [
    `You are EduPal, a study-buddy tutor for ${exam} ${subject}.`,
    "RULES: answer ONLY from the official syllabus and marking scheme.",
    "Never invent facts; if unsure, say so and point to the topic to revise.",
    "Keep language simple, encouraging, no jargon. Short steps, one idea each."
  ].join("\n");
}

// --- MCQ explanations --------------------------------------------------------

export async function explainAnswer(input: ExplainInput): Promise<string> {
  const provider = process.env.AI_PROVIDER ?? "local-templates";
  if (isOffTopic(input.answer)) return redirectNudge(input.language);
  if (provider !== "local-templates") {
    throw new Error(`Unknown AI_PROVIDER=${provider}`);
  }
  // Template engine: 2–3 sentences on WHY the correct choice is right.
  // An LLM later replaces this body via the same input/output contract.
  const why = input.rubric
    ? input.rubric.endsWith(".")
      ? input.rubric
      : `${input.rubric}.`
    : `This follows the ${input.topic} rule in your syllabus.`;
  if (input.language === "PIDGIN") {
    const open = input.wasCorrect
      ? `Correct! Na "${input.correctAnswer}" be di answer.`
      : `E no be "${input.answer}" — na "${input.correctAnswer}" be di correct answer.`;
    return `${open} ${why} Revise ${input.topic} make e stick.`;
  }
  const open = input.wasCorrect
    ? `Correct — the answer is "${input.correctAnswer}".`
    : `Not "${input.answer}" — the correct answer is "${input.correctAnswer}".`;
  return `${open} ${why} Worth one more look at ${input.topic}.`;
}

// --- Theory grading (rough v1 heuristic; LLM-refined later) ------------------

const STOP = new Set(
  "the,a,an,i,me,my,and,or,of,to,in,is,are,was,were,be,been,for,on,with,as,by,at,from,it,its,this,that,these,those,you,your,we,our,they,their,he,she,his,her,not,no,so,if,then,than,too,very,can,will,just,into,over,after,before".split(",")
);

function words(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => !STOP.has(w) && (w.length >= 4 || /\d/.test(w) || /^[a-z]$/.test(w)));
}

export function gradeTheory(
  response: string,
  modelAnswer: string,
  rubric: string,
  language: Language
): TheoryGrade {
  if (isOffTopic(response)) {
    return { score: 0, maxScore: 10, hits: [], misses: ["off-topic answer"], tips: [redirectNudge(language)], modelAnswer };
  }
  // Split model answer into checkable key points; fall back to whole-answer overlap.
  let points = modelAnswer.split(/[;.•\n]/).map((p) => p.trim()).filter((p) => words(p).length > 0);
  if (!points.length) points = [modelAnswer];
  const resp = new Set(words(response));
  const hits: string[] = [];
  const misses: string[] = [];
  for (const p of points) {
    const key = [...new Set(words(p))];
    if (!key.length) continue;
    const covered = key.filter((w) => resp.has(w)).length / key.length;
    (covered >= 0.5 ? hits : misses).push(p);
  }
  const total = hits.length + misses.length || 1;
  const score = Math.round((hits.length / total) * 10);
  const tips: string[] =
    misses.length === 0
      ? [language === "PIDGIN" ? "Clean! All key points land. Try di next topic." : "Clean sweep — all key points hit. Try the next topic."]
      : [
          language === "PIDGIN"
            ? `You miss ${misses.length} point(s). Compare wit model answer, rewrite am in your own words.`
            : `You missed ${misses.length} key point(s). Compare with the model answer, then rewrite in your own words.`,
          rubric ? `Marking focus: ${rubric}` : "Marking focus: one mark per key point."
        ];
  return { score, maxScore: 10, hits, misses, tips, modelAnswer };
}
