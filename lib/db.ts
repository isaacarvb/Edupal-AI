import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

// Zero-dependency local DB (Node built-in SQLite, no downloads).
// Prod/Postgres stage: replace this module with a pg client; same table names.
let db: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (!db) {
    const file = process.env.DB_FILE ?? path.join(process.cwd(), "dev.db");
    db = new DatabaseSync(file);
    db.exec("PRAGMA journal_mode = WAL;");
    const schema = fs.readFileSync(path.join(process.cwd(), "db", "schema.sql"), "utf8");
    db.exec(schema);
  }
  return db;
}
