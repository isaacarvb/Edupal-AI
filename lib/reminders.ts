import type { DatabaseSync } from "node:sqlite";
import { uid } from "./db";

// Lazy reminders: generated on dashboard load (no scheduler needed locally).
// Prod: call these from a daily cron; delivery moves to ZeptoMail.
export function ensureDailyReminder(db: DatabaseSync, userId: string, language: "SIMPLE" | "PIDGIN"): string | null {
  const today = new Date().toISOString().slice(0, 10);
  const practiced = db
    .prepare("SELECT 1 FROM attempts WHERE user_id = ? AND substr(created_at, 1, 10) = ? LIMIT 1")
    .get(userId, today);
  if (practiced) return null;
  const existing = db
    .prepare("SELECT 1 FROM email_outbox WHERE user_id = ? AND kind = 'daily' AND substr(created_at, 1, 10) = ? LIMIT 1")
    .get(userId, today);
  if (existing) {
    return language === "PIDGIN"
      ? "You never practice today — your streak dey hungry. 15 minutes go do am."
      : "You haven't practiced today — 15 minutes keeps your streak alive.";
  }
  const body =
    language === "PIDGIN"
      ? "Oya, 15 minutes practice today. Your streak dey wait for you."
      : "A quick 15-minute session today keeps your streak alive.";
  db.prepare("INSERT INTO email_outbox (id, user_id, kind, subject, body) VALUES (?, ?, 'daily', 'Daily practice reminder', ?)").run(
    uid(),
    userId,
    body
  );
  return body;
}
