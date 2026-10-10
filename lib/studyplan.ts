import type { Db } from "./db";

export type PlanDay = {
  day: string;
  date: string;
  items: { subject: string; topic: string; minutes: number; reason: string }[];
};

export type StudyPlan = {
  daysLeft: number | null;
  exam: string;
  message: string;
  week: PlanDay[];
};

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Deterministic weekly plan from live mastery + countdown (no LLM needed;
// Groq can later rewrite the wording via the same shape).
export async function buildStudyPlan(db: Db, userId: string): Promise<StudyPlan> {
  const profile = await db.prepare('SELECT exam, exam_date AS "examDate" FROM profiles WHERE user_id = ?').get(userId) as
    | { exam: string; examDate: string | null }
    | undefined;
  const exam = profile?.exam ?? "WAEC";
  const daysLeft = profile?.examDate
    ? Math.max(0, Math.ceil((Date.parse(profile.examDate) - Date.now()) / 86400000))
    : null;

  const topics = await db
    .prepare("SELECT subject, topic, accuracy, label FROM topic_mastery WHERE user_id = ? ORDER BY accuracy ASC")
    .all(userId) as { subject: string; topic: string; accuracy: number; label: string }[];

  if (!topics.length) {
    return {
      daysLeft, exam,
      message: "Answer a few questions first — your plan appears once I see your weak topics.",
      week: []
    };
  }

  const perDay = daysLeft !== null && daysLeft <= 14 ? 3 : 2;
  const minutes = daysLeft !== null && daysLeft <= 14 ? 25 : 20;
  const week: PlanDay[] = [];
  const now = new Date();
  for (let d = 0; d < 7; d++) {
    const date = new Date(now.getTime() + d * 86400000);
    const items = [];
    for (let k = 0; k < perDay; k++) {
      const t = topics[(d * perDay + k) % topics.length];
      items.push({
        subject: t.subject,
        topic: t.topic,
        minutes,
        reason:
          t.label === "WEAK"
            ? `Weakest area (${Math.round(t.accuracy)}%) — fix first`
            : t.label === "NEEDS_WORK"
              ? `Almost there (${Math.round(t.accuracy)}%) — push to Strong`
              : `Retention refresh (${Math.round(t.accuracy)}%) — keep it Strong`
      });
    }
    week.push({ day: DAY_NAMES[date.getDay()], date: date.toISOString().slice(0, 10), items });
  }

  const weakest = topics[0];
  const message =
    daysLeft === null
      ? `No exam date set — plan built from your weakest area: ${weakest.subject} • ${weakest.topic}.`
      : `${daysLeft} days to ${exam}. Weakest: ${weakest.subject} • ${weakest.topic} (${Math.round(weakest.accuracy)}%). Here's your week.`;
  return { daysLeft, exam, message, week };
}
