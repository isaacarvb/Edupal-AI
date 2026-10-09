import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { Pool } from "pg";

// Dual-engine DB: local node:sqlite by default, Postgres (Supabase) when
// DATABASE_URL is set. Same tables, same TEXT ISO timestamps, portable SQL.
// Call sites always: const db = await getDb(); await db.prepare(...).get(...)
export type Stmt = {
  get: (...params: unknown[]) => Promise<Record<string, unknown> | undefined>;
  all: (...params: unknown[]) => Promise<Record<string, unknown>[]>;
  run: (...params: unknown[]) => Promise<{ changes: number }>;
};
export type Db = { prepare: (sql: string) => Stmt };

import { randomUUID } from "node:crypto";
import { ensureSeeded } from "./seed";

export function uid(): string {
  return randomUUID();
}

export function usingPostgres(): boolean {
  return !!process.env.DATABASE_URL;
}

// ---- SQLite branch (sync engine, async-compatible wrapper) ----
let sqliteHandle: DatabaseSync | null = null;

function sqliteDb(): Db {
  if (!sqliteHandle) {
    const file = process.env.DB_FILE ?? path.join(process.cwd(), "dev.db");
    sqliteHandle = new DatabaseSync(file);
    sqliteHandle.exec("PRAGMA journal_mode = WAL;");
    const schema = fs.readFileSync(path.join(process.cwd(), "db", "schema.sql"), "utf8");
    sqliteHandle.exec(schema);
  }
  const h = sqliteHandle;
  return {
    prepare: (sql: string) => {
      const s = h.prepare(sql);
      return {
        get: async (...p: unknown[]) => (s.get(...(p as [])) ?? undefined) as Record<string, unknown> | undefined,
        all: async (...p: unknown[]) => s.all(...(p as [])) as Record<string, unknown>[],
        run: async (...p: unknown[]) => ({ changes: Number(s.run(...(p as [])).changes) })
      };
    }
  };
}

async function sqliteMigrate(): Promise<void> {
  const h = sqliteHandle!;
  const cols = (t: string) =>
    new Set((h.prepare(`PRAGMA table_info(${t})`).all() as { name: string }[]).map((c) => c.name));
  if (!cols("attempts").has("flagged")) h.exec("ALTER TABLE attempts ADD COLUMN flagged INTEGER NOT NULL DEFAULT 0");
  if (!cols("users").has("name")) h.exec("ALTER TABLE users ADD COLUMN name TEXT");
  if (!cols("users").has("avatar")) h.exec("ALTER TABLE users ADD COLUMN avatar TEXT");
  if (!cols("topic_mastery").has("consecutive_correct")) h.exec("ALTER TABLE topic_mastery ADD COLUMN consecutive_correct INTEGER NOT NULL DEFAULT 0");
  if (!cols("topic_mastery").has("overridden")) h.exec("ALTER TABLE topic_mastery ADD COLUMN overridden INTEGER NOT NULL DEFAULT 0");
}

// ---- Postgres branch (Supabase, incl. pooler on :6543) ----
let pgPool: Pool | null = null;
let pgReady = false;

function pgDb(): Db {
  if (!pgPool) {
    pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 5
    });
  }
  const pool = pgPool;
  const toPg = (sql: string) => {
    let i = 0;
    return sql.replace(/\?/g, () => `$${++i}`);
  };
  return {
    prepare: (sql: string) => {
      const q = toPg(sql);
      return {
        get: async (...p: unknown[]) => (await pool.query(q, p)).rows[0] as Record<string, unknown> | undefined,
        all: async (...p: unknown[]) => (await pool.query(q, p)).rows as Record<string, unknown>[],
        run: async (...p: unknown[]) => ({ changes: (await pool.query(q, p)).rowCount ?? 0 })
      };
    }
  };
}

async function pgMigrate(): Promise<void> {
  const db = pgDb();
  const schema = fs.readFileSync(path.join(process.cwd(), "db", "schema-postgres.sql"), "utf8");
  // Split on semicolons: node-postgres takes one statement per query().
  for (const stmt of schema.split(";")) {
    const s = stmt.trim();
    if (s) await db.prepare(s).run();
  }
  // Later additive columns land here via information_schema checks.
}

// ---- Entry point ----
export async function getDb(): Promise<Db> {
  if (usingPostgres()) {
    if (!pgReady) {
      await pgMigrate();
      pgReady = true;
    }
    return pgDb();
  }
  const db = sqliteDb();
  await sqliteMigrate();
  await ensureSeeded(db);
  return db;
}
