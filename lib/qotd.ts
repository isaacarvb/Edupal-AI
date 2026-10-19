import type { Db } from "./db";

// Deterministic daily pick: same question for a student all day, zero storage.
// `subjects` limits the pool to the student's own subjects (JSS vs department),
// so a junior never sees a senior question and vice versa.
export async function todayQuestion(db: Db, subjects?: string[]) {
  const where = subjects?.length ? `WHERE subject IN (${subjects.map(() => "?").join(",")})` : "";
  const rows = await db
    .prepare(
      `SELECT id, subject, topic, type, stem, options_json AS "optionsJson",
              predicted_repeat AS "predictedRepeat"
       FROM questions ${where} ORDER BY id`
    )
    .all(...(subjects ?? [])) as { id: string; subject: string; topic: string; type: string; stem: string; optionsJson: string; predictedRepeat: number }[];
  if (!rows.length) return null;
  const now = new Date();
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
  return rows[dayOfYear % rows.length];
}

// The student's own QOTD: only subjects from their profile (set at onboarding),
// falling back to English when none of their subjects have bank questions.
// Shared by the QOTD route and the attempt verifier so both always agree.
export async function personalizedQuestion(db: Db, userId: string) {
  const prof = await db.prepare("SELECT subjects FROM profiles WHERE user_id = ?").get(userId) as { subjects: string | null } | undefined;
  const subjects = String(prof?.subjects ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  return (subjects.length ? await todayQuestion(db, subjects) : null) ?? await todayQuestion(db, ["English"]);
}

export async function qotdDone(db: Db, userId: string, questionId: string): Promise<boolean> {
  const today = new Date().toISOString().slice(0, 10);
  return !!await db
    .prepare("SELECT 1 FROM attempts WHERE user_id = ? AND question_id = ? AND SUBSTRING(created_at, 1, 10) = ? LIMIT 1")
    .get(userId, questionId, today);
}
