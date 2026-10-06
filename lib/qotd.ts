import type { DatabaseSync } from "node:sqlite";

// Deterministic daily pick: same question for everyone, all day, zero storage.
export function todayQuestion(db: DatabaseSync) {
  const rows = db
    .prepare(
      `SELECT id, subject, topic, type, stem, options_json AS optionsJson,
              predicted_repeat AS predictedRepeat
       FROM questions ORDER BY id`
    )
    .all() as { id: string; subject: string; topic: string; type: string; stem: string; optionsJson: string; predictedRepeat: number }[];
  if (!rows.length) return null;
  const now = new Date();
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
  return rows[dayOfYear % rows.length];
}

export function qotdDone(db: DatabaseSync, userId: string, questionId: string): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return !!db
    .prepare("SELECT 1 FROM attempts WHERE user_id = ? AND question_id = ? AND substr(created_at, 1, 10) = ? LIMIT 1")
    .get(userId, questionId, today);
}
