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

export type DbMode = "sqlite" | "postgres";

export let dbMode: DbMode = "sqlite";
export let dbModeReason: string = "";

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
  const pcols = cols("profiles");
  if (!pcols.has("exam_start")) h.exec("ALTER TABLE profiles ADD COLUMN exam_start TEXT");
  if (!pcols.has("exam_end")) h.exec("ALTER TABLE profiles ADD COLUMN exam_end TEXT");
  if (!pcols.has("dates_confirmed")) h.exec("ALTER TABLE profiles ADD COLUMN dates_confirmed INTEGER NOT NULL DEFAULT 1");
  if (!pcols.has("department")) h.exec("ALTER TABLE profiles ADD COLUMN department TEXT NOT NULL DEFAULT ''");
  // Subscriptions expire: paid_until = ISO end date; NULL = no paid time.
  if (!cols("wallets").has("paid_until")) h.exec("ALTER TABLE wallets ADD COLUMN paid_until TEXT");
  // Optional grant start (admin can schedule a trial to begin later).
  if (!cols("wallets").has("paid_from")) h.exec("ALTER TABLE wallets ADD COLUMN paid_from TEXT");
  // Expiry nudge bookkeeping: paid_until value the "ends soon" email was sent for.
  if (!cols("wallets").has("nudge_for_until")) h.exec("ALTER TABLE wallets ADD COLUMN nudge_for_until TEXT");
  // Parent link timestamps: newest row wins when a student re-checkouts.
  if (!cols("parent_links").has("created_at")) h.exec("ALTER TABLE parent_links ADD COLUMN created_at TEXT");
  // One-time grace: existing UNLIMITED rows (test/manual grants) keep 30 days.
  h.exec("UPDATE wallets SET paid_until = strftime('%Y-%m-%dT%H:%M:%fZ','now','+30 days') WHERE plan = 'UNLIMITED' AND paid_until IS NULL");
  // Legacy pilots never had an end date; time-box them to 3 days from now.
  h.exec("UPDATE wallets SET paid_until = strftime('%Y-%m-%dT%H:%M:%fZ','now','+3 days') WHERE plan = 'PILOT' AND paid_until IS NULL");
  // One-time carry-over: old single exam_date becomes the new start date.
  h.exec("UPDATE profiles SET exam_start = exam_date WHERE (exam_start IS NULL OR exam_start = '') AND exam_date IS NOT NULL AND exam_date != ''");
  // Standardise renamed subjects so old rows keep matching the new lists.
  h.exec("UPDATE questions SET subject = 'Literature in English' WHERE subject = 'Literature'");
  h.exec("UPDATE questions SET subject = 'Social and Citizenship Education' WHERE subject = 'Citizenship Education'");
  h.exec("UPDATE questions SET subject = 'Intermediate Science (Basic Science and Technology)' WHERE subject IN ('Intermediate Science', 'Integrated Science')");
  h.exec("UPDATE profiles SET subjects = REPLACE(subjects, 'Citizenship Education', 'Social and Citizenship Education') WHERE subjects LIKE '%Citizenship Education%' AND subjects NOT LIKE '%Social and Citizenship Education%'");
  h.exec("UPDATE profiles SET subjects = REPLACE(subjects, 'Intermediate Science', 'Intermediate Science (Basic Science and Technology)') WHERE subjects LIKE '%Intermediate Science%' AND subjects NOT LIKE '%Intermediate Science (%'");
  h.exec("UPDATE profiles SET subjects = REPLACE(subjects, 'Integrated Science', 'Intermediate Science (Basic Science and Technology)') WHERE subjects LIKE '%Integrated Science%'");
  h.exec("CREATE TABLE IF NOT EXISTS site_settings (key TEXT PRIMARY KEY, value TEXT NOT NULL DEFAULT '')");
  h.exec("CREATE TABLE IF NOT EXISTS admin_audit (id TEXT PRIMARY KEY, admin_id TEXT, action TEXT NOT NULL, target TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL DEFAULT (datetime('now')))");
  h.exec("CREATE TABLE IF NOT EXISTS transactions (id TEXT PRIMARY KEY, user_id TEXT REFERENCES users(id) ON DELETE SET NULL, email TEXT NOT NULL DEFAULT '', reference TEXT UNIQUE, amount_kobo INTEGER NOT NULL DEFAULT 0, plan TEXT NOT NULL DEFAULT 'UNLIMITED', status TEXT NOT NULL DEFAULT 'pending', channel TEXT NOT NULL DEFAULT 'paystack', promo_code TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL DEFAULT (datetime('now')))");
  h.exec("CREATE INDEX IF NOT EXISTS idx_tx_status_day ON transactions(status, created_at)");
  h.exec("CREATE TABLE IF NOT EXISTS plans (id TEXT PRIMARY KEY, name TEXT UNIQUE NOT NULL, amount_kobo INTEGER NOT NULL DEFAULT 100000, credits INTEGER NOT NULL DEFAULT 9999, active INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL DEFAULT (datetime('now')))");
  h.exec("CREATE TABLE IF NOT EXISTS promo_codes (code TEXT PRIMARY KEY, percent_off INTEGER NOT NULL DEFAULT 0, max_uses INTEGER NOT NULL DEFAULT 100, used INTEGER NOT NULL DEFAULT 0, active INTEGER NOT NULL DEFAULT 1, expires_on TEXT)");
  h.exec("CREATE TABLE IF NOT EXISTS announcements (id TEXT PRIMARY KEY, title TEXT NOT NULL, body TEXT NOT NULL DEFAULT '', segment TEXT NOT NULL DEFAULT 'all', created_by TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL DEFAULT (datetime('now')))");
  h.exec("CREATE TABLE IF NOT EXISTS announcement_reads (announcement_id TEXT NOT NULL REFERENCES announcements(id) ON DELETE CASCADE, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, read_at TEXT NOT NULL DEFAULT (datetime('now')), PRIMARY KEY (announcement_id, user_id))");
  h.exec("CREATE TABLE IF NOT EXISTS subject_config (subject TEXT PRIMARY KEY, active INTEGER NOT NULL DEFAULT 1, updated_at TEXT NOT NULL DEFAULT (datetime('now')))");
  h.exec("CREATE TABLE IF NOT EXISTS admin_allowlist (email TEXT PRIMARY KEY, role TEXT NOT NULL DEFAULT 'CONTENT_ADMIN', added_at TEXT NOT NULL DEFAULT (datetime('now')))");
  h.exec("CREATE TABLE IF NOT EXISTS error_logs (id TEXT PRIMARY KEY, source TEXT NOT NULL DEFAULT '', message TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL DEFAULT (datetime('now')))");
}

// ---- Postgres branch (Supabase, incl. pooler on :6543) ----

function pgDb(): Db {
  const g = globalThis as unknown as { __edupalPg?: import("pg").Pool };
  if (!g.__edupalPg) {
    g.__edupalPg = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 15000,
      application_name: "edupal-ai"
    });
  }
  const pool = g.__edupalPg;
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

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function pgTestConnection(pool: import("pg").Pool): Promise<void> {
  await pool.query("SELECT 1");
}

async function pgMigrate(): Promise<void> {
  let lastError: unknown = null;
  // Try up to 3 times with exponential backoff (Supabase pooler can be slow to wake)
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const db = pgDb();
      // Test connection first
      await pgTestConnection((globalThis as unknown as { __edupalPg?: import("pg").Pool }).__edupalPg!);
      const schema = fs.readFileSync(path.join(process.cwd(), "db", "schema-postgres.sql"), "utf8");
      // Split on semicolons: node-postgres takes one statement per query().
      for (const stmt of schema.split(";")) {
        const s = stmt.trim();
        if (s) await db.prepare(s).run();
      }
      // Later additive columns land here via information_schema checks.
      const has = async (col: string) =>
        ((await db.prepare("SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = ?").get(col)) ? true : false);
      if (!(await has("exam_start"))) await db.prepare("ALTER TABLE profiles ADD COLUMN exam_start TEXT").run();
      if (!(await has("exam_end"))) await db.prepare("ALTER TABLE profiles ADD COLUMN exam_end TEXT").run();
      if (!(await has("dates_confirmed"))) await db.prepare("ALTER TABLE profiles ADD COLUMN dates_confirmed INTEGER NOT NULL DEFAULT 1").run();
      if (!(await has("department"))) await db.prepare("ALTER TABLE profiles ADD COLUMN department TEXT NOT NULL DEFAULT ''").run();
      // Subscriptions expire: paid_until = ISO end date; NULL = no paid time.
      const hasWalletCol = async (col: string) =>
        ((await db.prepare("SELECT 1 FROM information_schema.columns WHERE table_name = 'wallets' AND column_name = $1").get(col)) ? true : false);
      if (!(await hasWalletCol("paid_until"))) await db.prepare("ALTER TABLE wallets ADD COLUMN paid_until TEXT").run();
      // Optional grant start (admin can schedule a trial to begin later).
      if (!(await hasWalletCol("paid_from"))) await db.prepare("ALTER TABLE wallets ADD COLUMN paid_from TEXT").run();
      // Expiry nudge bookkeeping: paid_until value the "ends soon" email was sent for.
      if (!(await hasWalletCol("nudge_for_until"))) await db.prepare("ALTER TABLE wallets ADD COLUMN nudge_for_until TEXT").run();
      // Parent link timestamps: newest row wins when a student re-checkouts.
      const hasParentCol = async (col: string) =>
        ((await db.prepare("SELECT 1 FROM information_schema.columns WHERE table_name = 'parent_links' AND column_name = $1").get(col)) ? true : false);
      if (!(await hasParentCol("created_at"))) await db.prepare("ALTER TABLE parent_links ADD COLUMN created_at TEXT").run();
      // One-time grace: existing UNLIMITED rows (test/manual grants) keep 30 days.
      await db.prepare("UPDATE wallets SET paid_until = to_char(now() + interval '30 days', 'YYYY-MM-DD\"T\"HH24:MI:SS.MS\"Z\"') WHERE plan = 'UNLIMITED' AND paid_until IS NULL").run();
      // Legacy pilots never had an end date; time-box them to 3 days from now.
      await db.prepare("UPDATE wallets SET paid_until = to_char(now() + interval '3 days', 'YYYY-MM-DD\"T\"HH24:MI:SS.MS\"Z\"') WHERE plan = 'PILOT' AND paid_until IS NULL").run();
      await db.prepare("UPDATE profiles SET exam_start = exam_date WHERE (exam_start IS NULL OR exam_start = '') AND exam_date IS NOT NULL AND exam_date != ''").run();
      await db.prepare("UPDATE questions SET subject = 'Literature in English' WHERE subject = 'Literature'").run();
      await db.prepare("UPDATE questions SET subject = 'Social and Citizenship Education' WHERE subject = 'Citizenship Education'").run();
      await db.prepare("UPDATE questions SET subject = 'Intermediate Science (Basic Science and Technology)' WHERE subject IN ('Intermediate Science', 'Integrated Science')").run();
      await db.prepare("UPDATE profiles SET subjects = REPLACE(subjects, 'Citizenship Education', 'Social and Citizenship Education') WHERE subjects LIKE '%Citizenship Education%' AND subjects NOT LIKE '%Social and Citizenship Education%'").run();
      await db.prepare("UPDATE profiles SET subjects = REPLACE(subjects, 'Intermediate Science', 'Intermediate Science (Basic Science and Technology)') WHERE subjects LIKE '%Intermediate Science%' AND subjects NOT LIKE '%Intermediate Science (%'").run();
      await db.prepare("UPDATE profiles SET subjects = REPLACE(subjects, 'Integrated Science', 'Intermediate Science (Basic Science and Technology)') WHERE subjects LIKE '%Integrated Science%'").run();
      return; // success
    } catch (e) {
      lastError = e;
      console.warn(`Postgres migration attempt ${attempt} failed:`, e instanceof Error ? e.message : String(e));
      if (attempt < 3) await sleep(2000 * attempt); // 2s, 4s backoff
    }
  }
  throw lastError;
}

const gflag = globalThis as unknown as { __edupalPgReady?: boolean };

// ---- Entry point ----
export async function getDb(): Promise<Db> {
  let fallbackReason = ""; // set when Postgres fails; keeps the real error visible
  if (usingPostgres() && process.env.DB_FORCE_SQLITE !== "1") {
    try {
      if (!gflag.__edupalPgReady) {
        await pgMigrate();
        gflag.__edupalPgReady = true;
      }
      const db = pgDb();
      // Verify connection is alive before returning
      await pgTestConnection((globalThis as unknown as { __edupalPg?: import("pg").Pool }).__edupalPg!);
      await ensureSeeded(db);
      dbMode = "postgres";
      dbModeReason = "Postgres (Supabase) connected";
      return db;
    } catch (e) {
      // Postgres unreachable at query time — fall back to SQLite for this request.
      console.warn("Postgres query failed, falling back to SQLite:", e instanceof Error ? e.message : String(e));
      fallbackReason = `Postgres unavailable: ${e instanceof Error ? e.message : String(e)}`;
    }
  } else if (!usingPostgres()) {
    fallbackReason = "DATABASE_URL not set";
  } else {
    fallbackReason = "DB_FORCE_SQLITE=1";
  }
  const db = sqliteDb();
  await sqliteMigrate();
  await ensureSeeded(db);
  dbMode = "sqlite";
  dbModeReason = fallbackReason || "SQLite (local dev.db)";
  return db;
}
