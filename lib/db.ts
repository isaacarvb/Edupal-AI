import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

// Zero-dependency local DB (Node built-in SQLite, no downloads).
// Prod/Postgres stage: replace this module with a pg client; same table names.
import { randomUUID } from "node:crypto";
import { ensureSeeded } from "./seed";

let db: DatabaseSync | null = null;

export function uid(): string {
  return randomUUID();
}

export function getDb(): DatabaseSync {
  if (!db) {
    const file = process.env.DB_FILE ?? path.join(process.cwd(), "dev.db");
    db = new DatabaseSync(file);
    db.exec("PRAGMA journal_mode = WAL;");
    const schema = fs.readFileSync(path.join(process.cwd(), "db", "schema.sql"), "utf8");
    db.exec(schema);
    migrate(db);
    ensureSeeded(db);
  }
  return db;
}

// Idempotent column migrations for existing dev.db files.
function migrate(db: DatabaseSync): void {
  const attemptCols = new Set(
    (db.prepare("PRAGMA table_info(attempts)").all() as { name: string }[]).map((c) => c.name)
  );
  if (!attemptCols.has("flagged")) db.exec("ALTER TABLE attempts ADD COLUMN flagged INTEGER NOT NULL DEFAULT 0");
  const userCols = new Set(
    (db.prepare("PRAGMA table_info(users)").all() as { name: string }[]).map((c) => c.name)
  );
  if (!userCols.has("name")) db.exec("ALTER TABLE users ADD COLUMN name TEXT");
  const cols = new Set(
    (db.prepare("PRAGMA table_info(topic_mastery)").all() as { name: string }[]).map((c) => c.name)
  );
  if (!cols.has("consecutive_correct")) db.exec("ALTER TABLE topic_mastery ADD COLUMN consecutive_correct INTEGER NOT NULL DEFAULT 0");
  if (!cols.has("overridden")) db.exec("ALTER TABLE topic_mastery ADD COLUMN overridden INTEGER NOT NULL DEFAULT 0");
}
