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
import { canonicalSubject } from "./syllabus";

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
  // ---- Curriculum restructure: one canonical name per subject, Art (not Arts) ----
  const RENAMES: { to: string; from: string[] }[] = [
    { to: "English Studies", from: ["English", "English Language"] },
    { to: "Social and Citizenship Studies", from: ["Social and Citizenship Education", "Citizenship Education"] },
    { to: "Intermediate Science", from: ["Intermediate Science (Basic Science and Technology)", "Integrated Science"] },
    { to: "Digital Technologies", from: ["Digital Technologies (Computer Studies/ICT)", "Computer Studies", "ICT"] },
    { to: "Christian Religious Studies", from: ["Christian Religious Knowledge", "CRK", "CRS"] }
  ];
  for (const { to, from } of RENAMES) {
    for (const oldName of from) {
      const old = oldName.replace(/'/g, "''");
      const now = to.replace(/'/g, "''");
      // Only touch tables that actually exist with a subject column. Older
      // databases may have been created before some of these tables/columns.
      for (const t of ["questions", "topic_mastery", "lesson_notes", "assignments", "school_questions", "school_teachers"]) {
        if (cols(t).has("subject")) h.exec(`UPDATE ${t} SET subject = '${now}' WHERE subject = '${old}'`);
      }
      h.exec(`UPDATE profiles SET subjects = TRIM(REPLACE(','||subjects||',', ',${old},', ',${now},'), ',') WHERE ','||subjects||',' LIKE '%,${old},%'`);
    }
  }
  h.exec("UPDATE profiles SET department = 'Art' WHERE department = 'Arts'");
  h.exec("UPDATE school_students SET department = 'Art' WHERE department = 'Arts'");
  // Fresh databases add school_teachers.department later in this migration,
  // so only rewrite it when the column already exists.
  if (cols("school_teachers").has("department")) {
    h.exec("UPDATE school_teachers SET department = 'Art' WHERE department = 'Arts'");
  }
  h.exec("CREATE TABLE IF NOT EXISTS site_settings (key TEXT PRIMARY KEY, value TEXT NOT NULL DEFAULT '')");
  // Keep saved notes-access overrides pointing at the new subject names.
  try {
    const rows = h.prepare("SELECT key, value FROM site_settings WHERE key = 'notes_access'").all() as { key: string; value: string }[];
    for (const row of rows) {
      const map = JSON.parse(row.value || "{}") as Record<string, string>;
      let changed = false;
      const next: Record<string, string> = {};
      for (const [k, v] of Object.entries(map)) {
        const parts = k.split("|");
        if (parts.length >= 2) {
          const canon = canonicalSubject(parts[1]);
          if (canon !== parts[1]) {
            parts[1] = canon;
            changed = true;
          }
        }
        next[parts.join("|")] = v;
      }
      if (changed) h.exec(`UPDATE site_settings SET value = '${JSON.stringify(next).replace(/'/g, "''")}' WHERE key = 'notes_access'`);
    }
  } catch { /* ignore malformed settings */ }

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

  // Add missing columns to existing questions table (for databases created before these were added)
  if (!cols("questions").has("options_json")) h.exec("ALTER TABLE questions ADD COLUMN options_json TEXT NOT NULL DEFAULT '[]'");
  if (!cols("questions").has("answer_key")) h.exec("ALTER TABLE questions ADD COLUMN answer_key TEXT NOT NULL DEFAULT ''");
  if (!cols("questions").has("marking_rubric")) h.exec("ALTER TABLE questions ADD COLUMN marking_rubric TEXT NOT NULL DEFAULT ''");
  if (!cols("questions").has("source")) h.exec("ALTER TABLE questions ADD COLUMN source TEXT NOT NULL DEFAULT 'CURATED'");
  if (!cols("questions").has("predicted_repeat")) h.exec("ALTER TABLE questions ADD COLUMN predicted_repeat INTEGER NOT NULL DEFAULT 0");

  // ---- Stage C migrations: teacher accounts, lesson notes, assignments, broadcasts ----
  // CREATE TABLE IF NOT EXISTS handles new databases; ALTER COLUMN handles existing
  // databases where the table was created by an earlier partial migration.
  const stCols = cols("school_teachers");
  if (!stCols.has("id")) h.exec("CREATE TABLE IF NOT EXISTS school_teachers (id TEXT PRIMARY KEY, school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE, name TEXT NOT NULL, email TEXT NOT NULL, password_hash TEXT NOT NULL, classes TEXT NOT NULL DEFAULT '', subject TEXT, department TEXT, active INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL DEFAULT (datetime('now')))");
  if (!stCols.has("active")) h.exec("ALTER TABLE school_teachers ADD COLUMN active INTEGER NOT NULL DEFAULT 1");
  if (!stCols.has("classes")) h.exec("ALTER TABLE school_teachers ADD COLUMN classes TEXT NOT NULL DEFAULT ''");
  if (!stCols.has("subject")) h.exec("ALTER TABLE school_teachers ADD COLUMN subject TEXT");
  if (!stCols.has("department")) h.exec("ALTER TABLE school_teachers ADD COLUMN department TEXT");
  // Older "simple" school_teachers tables lack the login columns that the full
  // Stage C table has. Add them so bulk import and teacher login both work.
  if (!stCols.has("email")) h.exec("ALTER TABLE school_teachers ADD COLUMN email TEXT NOT NULL DEFAULT ''");
  if (!stCols.has("password_hash")) h.exec("ALTER TABLE school_teachers ADD COLUMN password_hash TEXT NOT NULL DEFAULT ''");

  const lnCols = cols("lesson_notes");
  if (!lnCols.has("id")) h.exec("CREATE TABLE IF NOT EXISTS lesson_notes (id TEXT PRIMARY KEY, school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE, teacher_id TEXT NOT NULL REFERENCES school_teachers(id) ON DELETE CASCADE, teacher_name TEXT NOT NULL DEFAULT '', class_name TEXT NOT NULL DEFAULT '', subject TEXT NOT NULL, topic TEXT NOT NULL, body TEXT NOT NULL DEFAULT '', status TEXT NOT NULL DEFAULT 'pending', reviewed_by TEXT, reviewed_at TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')))");
  if (!lnCols.has("teacher_name")) h.exec("ALTER TABLE lesson_notes ADD COLUMN teacher_name TEXT NOT NULL DEFAULT ''");
  if (!lnCols.has("reviewed_by")) h.exec("ALTER TABLE lesson_notes ADD COLUMN reviewed_by TEXT");
  if (!lnCols.has("reviewed_at")) h.exec("ALTER TABLE lesson_notes ADD COLUMN reviewed_at TEXT");

  const asCols = cols("assignments");
  if (!asCols.has("id")) h.exec("CREATE TABLE IF NOT EXISTS assignments (id TEXT PRIMARY KEY, school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE, teacher_id TEXT NOT NULL REFERENCES school_teachers(id) ON DELETE CASCADE, class_name TEXT NOT NULL DEFAULT '', subject TEXT NOT NULL, topic TEXT NOT NULL, instructions TEXT NOT NULL DEFAULT '', due_at TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')))");
  if (!asCols.has("school_id")) h.exec("ALTER TABLE assignments ADD COLUMN school_id TEXT NOT NULL DEFAULT ''");
  if (!asCols.has("teacher_id")) h.exec("ALTER TABLE assignments ADD COLUMN teacher_id TEXT NOT NULL DEFAULT ''");
  if (!asCols.has("instructions")) h.exec("ALTER TABLE assignments ADD COLUMN instructions TEXT NOT NULL DEFAULT ''");
  if (!asCols.has("start_date")) h.exec("ALTER TABLE assignments ADD COLUMN start_date TEXT");
  if (!asCols.has("end_date")) h.exec("ALTER TABLE assignments ADD COLUMN end_date TEXT");
  if (!asCols.has("attachment_url")) h.exec("ALTER TABLE assignments ADD COLUMN attachment_url TEXT");
  if (!asCols.has("attachment_name")) h.exec("ALTER TABLE assignments ADD COLUMN attachment_name TEXT");
  if (!asCols.has("due_at")) h.exec("ALTER TABLE assignments ADD COLUMN due_at TEXT");

  const bcCols = cols("broadcasts");
  if (!bcCols.has("id")) h.exec("CREATE TABLE IF NOT EXISTS broadcasts (id TEXT PRIMARY KEY, school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE, class_name TEXT DEFAULT NULL, body TEXT NOT NULL DEFAULT '', starts_at TEXT NOT NULL DEFAULT (datetime('now')), ends_at TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')))");
  if (!bcCols.has("school_id")) h.exec("ALTER TABLE broadcasts ADD COLUMN school_id TEXT NOT NULL DEFAULT ''");

  h.exec("CREATE INDEX IF NOT EXISTS idx_school_teachers_school ON school_teachers(school_id)");
  h.exec("CREATE INDEX IF NOT EXISTS idx_lesson_notes_school_status ON lesson_notes(school_id, status)");
  h.exec("CREATE INDEX IF NOT EXISTS idx_assignments_school_class ON assignments(school_id, class_name)");
  h.exec("CREATE INDEX IF NOT EXISTS idx_broadcasts_school ON broadcasts(school_id, starts_at, ends_at)");

  // ---- School Subscription migrations ----
  // Add new columns to schools table
  if (!cols("schools").has("email")) h.exec("ALTER TABLE schools ADD COLUMN email TEXT DEFAULT ''");
  if (!cols("schools").has("password_hash")) h.exec("ALTER TABLE schools ADD COLUMN password_hash TEXT DEFAULT ''");
  if (!cols("schools").has("address")) h.exec("ALTER TABLE schools ADD COLUMN address TEXT DEFAULT ''");
  if (!cols("schools").has("location")) h.exec("ALTER TABLE schools ADD COLUMN location TEXT DEFAULT ''");
  if (!cols("schools").has("seats_used")) h.exec("ALTER TABLE schools ADD COLUMN seats_used INTEGER NOT NULL DEFAULT 0");

  // Create new tables for school subscription system
  h.exec("CREATE TABLE IF NOT EXISTS school_students (id TEXT PRIMARY KEY, school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE, user_id TEXT REFERENCES users(id) ON DELETE SET NULL, name TEXT NOT NULL, class_name TEXT NOT NULL DEFAULT '', department TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')))");

  // Add missing columns to existing school_students table (for databases created before class_name was added)
  if (!cols("school_students").has("class_name")) h.exec("ALTER TABLE school_students ADD COLUMN class_name TEXT NOT NULL DEFAULT ''");
  if (!cols("school_students").has("department")) h.exec("ALTER TABLE school_students ADD COLUMN department TEXT");

  h.exec("CREATE INDEX IF NOT EXISTS idx_school_students_school ON school_students(school_id)");
  h.exec("CREATE INDEX IF NOT EXISTS idx_school_students_class ON school_students(class_name)");
  h.exec("CREATE INDEX IF NOT EXISTS idx_school_students_user ON school_students(user_id)");

  h.exec("CREATE TABLE IF NOT EXISTS school_teachers (id TEXT PRIMARY KEY, school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE, user_id TEXT REFERENCES users(id) ON DELETE SET NULL, name TEXT NOT NULL, class_name TEXT NOT NULL DEFAULT '', subject TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL DEFAULT (datetime('now')))");
  // Add missing columns to existing school_teachers table
  if (!cols("school_teachers").has("user_id")) h.exec("ALTER TABLE school_teachers ADD COLUMN user_id TEXT REFERENCES users(id) ON DELETE SET NULL");
  if (!cols("school_teachers").has("class_name")) h.exec("ALTER TABLE school_teachers ADD COLUMN class_name TEXT NOT NULL DEFAULT ''");
  if (!cols("school_teachers").has("subject")) h.exec("ALTER TABLE school_teachers ADD COLUMN subject TEXT NOT NULL DEFAULT ''");
  h.exec("CREATE INDEX IF NOT EXISTS idx_school_teachers_school ON school_teachers(school_id)");
  h.exec("CREATE INDEX IF NOT EXISTS idx_school_teachers_class ON school_teachers(class_name)");

  h.exec("CREATE TABLE IF NOT EXISTS lesson_notes (id TEXT PRIMARY KEY, school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE, teacher_id TEXT NOT NULL REFERENCES school_teachers(id) ON DELETE CASCADE, teacher_name TEXT NOT NULL DEFAULT '', class_name TEXT NOT NULL DEFAULT '', subject TEXT NOT NULL, topic TEXT NOT NULL, body TEXT NOT NULL DEFAULT '', attachment_url TEXT, attachment_name TEXT, status TEXT NOT NULL DEFAULT 'pending', reviewed_by TEXT, reviewed_at TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')))");
  // Older lesson_notes tables were created before file attachments were added.
  // CREATE TABLE IF NOT EXISTS does not add columns, so patch them in explicitly.
  if (!cols("lesson_notes").has("attachment_url")) h.exec("ALTER TABLE lesson_notes ADD COLUMN attachment_url TEXT");
  if (!cols("lesson_notes").has("attachment_name")) h.exec("ALTER TABLE lesson_notes ADD COLUMN attachment_name TEXT");
  h.exec("CREATE INDEX IF NOT EXISTS idx_lesson_notes_school_status ON lesson_notes(school_id, status)");

  h.exec("CREATE TABLE IF NOT EXISTS school_announcements (id TEXT PRIMARY KEY, school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE, title TEXT NOT NULL DEFAULT '', body TEXT NOT NULL DEFAULT '', class_name TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')))");
  h.exec("CREATE INDEX IF NOT EXISTS idx_school_announcements_school ON school_announcements(school_id)");

  h.exec("CREATE TABLE IF NOT EXISTS mock_exams (id TEXT PRIMARY KEY, school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE, title TEXT NOT NULL, subjects TEXT NOT NULL DEFAULT '', class_name TEXT NOT NULL DEFAULT '', duration_minutes INTEGER NOT NULL DEFAULT 30, scheduled_at TEXT, status TEXT NOT NULL DEFAULT 'scheduled', created_at TEXT NOT NULL DEFAULT (datetime('now')))");
  h.exec("CREATE INDEX IF NOT EXISTS idx_mock_exams_school ON mock_exams(school_id)");

  h.exec("CREATE TABLE IF NOT EXISTS school_questions (id TEXT PRIMARY KEY, school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE, subject TEXT NOT NULL, topic TEXT NOT NULL, stem TEXT NOT NULL, options_json TEXT NOT NULL DEFAULT '[]', answer TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL DEFAULT (datetime('now')))");
  h.exec("CREATE INDEX IF NOT EXISTS idx_school_questions_school ON school_questions(school_id)");

  h.exec("CREATE TABLE IF NOT EXISTS school_subscriptions (id TEXT PRIMARY KEY, school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE, students_count INTEGER NOT NULL DEFAULT 0, term_months INTEGER NOT NULL DEFAULT 3, amount_paid INTEGER NOT NULL DEFAULT 0, discount_percent REAL NOT NULL DEFAULT 0, paystack_reference TEXT DEFAULT '', status TEXT NOT NULL DEFAULT 'pending', paid_at TEXT, expires_at TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')))");
  h.exec("CREATE INDEX IF NOT EXISTS idx_school_subscriptions_school ON school_subscriptions(school_id)");

  h.exec("CREATE TABLE IF NOT EXISTS school_sessions (id TEXT PRIMARY KEY, school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE, student_name TEXT NOT NULL, class_name TEXT NOT NULL DEFAULT '', session_start TEXT NOT NULL DEFAULT (datetime('now')), last_activity TEXT NOT NULL DEFAULT (datetime('now')))");
  h.exec("CREATE INDEX IF NOT EXISTS idx_school_sessions_school ON school_sessions(school_id)");
  h.exec("CREATE INDEX IF NOT EXISTS idx_school_sessions_last_activity ON school_sessions(last_activity)");

  h.exec("CREATE TABLE IF NOT EXISTS school_notifications (id TEXT PRIMARY KEY, school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE, type TEXT NOT NULL DEFAULT '', sent_at TEXT NOT NULL DEFAULT (datetime('now')))");
  h.exec("CREATE INDEX IF NOT EXISTS idx_school_notifications_school ON school_notifications(school_id)");

  // ---- Leaderboard: weekly XP + study time ----
  h.exec("CREATE TABLE IF NOT EXISTS study_time (user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, day TEXT NOT NULL, seconds INTEGER NOT NULL DEFAULT 0, updated_at TEXT NOT NULL DEFAULT (datetime('now')), PRIMARY KEY (user_id, day))");
  h.exec("CREATE INDEX IF NOT EXISTS idx_study_time_day ON study_time(day)");
  h.exec("CREATE TABLE IF NOT EXISTS leaderboard_settings (user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE, hidden INTEGER NOT NULL DEFAULT 0, updated_at TEXT NOT NULL DEFAULT (datetime('now')))");

  // ---- Security migration: failed login tracking + two-factor auth ----
  const ucols = cols("users");
  if (!ucols.has("failed_login_attempts")) h.exec("ALTER TABLE users ADD COLUMN failed_login_attempts INTEGER NOT NULL DEFAULT 0");
  if (!ucols.has("locked_until")) h.exec("ALTER TABLE users ADD COLUMN locked_until TEXT");
  if (!ucols.has("two_factor_enabled")) h.exec("ALTER TABLE users ADD COLUMN two_factor_enabled INTEGER NOT NULL DEFAULT 0");
  if (!ucols.has("two_factor_secret")) h.exec("ALTER TABLE users ADD COLUMN two_factor_secret TEXT");
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
      // ---- Curriculum restructure (canonical subject names, Art not Arts) ----
      // Runs after every table/column exists, further down this migration.
      // Keep saved notes-access overrides pointing at the new subject names.
      try {
        const rows = (await db.prepare("SELECT value FROM site_settings WHERE key = 'notes_access'").all()) as { value: string }[];
        for (const row of rows) {
          const map = JSON.parse(row.value || "{}") as Record<string, string>;
          let changed = false;
          const next: Record<string, string> = {};
          for (const [k, v] of Object.entries(map)) {
            const parts = k.split("|");
            if (parts.length >= 2) {
              const canon = canonicalSubject(parts[1]);
              if (canon !== parts[1]) {
                parts[1] = canon;
                changed = true;
              }
            }
            next[parts.join("|")] = v;
          }
          if (changed) await db.prepare("UPDATE site_settings SET value = ? WHERE key = 'notes_access'").run(JSON.stringify(next));
        }
      } catch { /* ignore malformed settings */ }
      // ---- Stage C migrations ----
      // Add missing columns to existing questions table (PostgreSQL)
      const hasQCol = async (col: string) =>
        ((await db.prepare("SELECT 1 FROM information_schema.columns WHERE table_name = 'questions' AND column_name = $1").get(col)) ? true : false);
      if (!(await hasQCol("options_json"))) await db.prepare("ALTER TABLE questions ADD COLUMN options_json TEXT NOT NULL DEFAULT '[]'").run();
      if (!(await hasQCol("answer_key"))) await db.prepare("ALTER TABLE questions ADD COLUMN answer_key TEXT NOT NULL DEFAULT ''").run();
      if (!(await hasQCol("marking_rubric"))) await db.prepare("ALTER TABLE questions ADD COLUMN marking_rubric TEXT NOT NULL DEFAULT ''").run();
      if (!(await hasQCol("source"))) await db.prepare("ALTER TABLE questions ADD COLUMN source TEXT NOT NULL DEFAULT 'CURATED'").run();
      if (!(await hasQCol("predicted_repeat"))) await db.prepare("ALTER TABLE questions ADD COLUMN predicted_repeat INTEGER NOT NULL DEFAULT 0").run();

      const hasStCol = async (col: string) =>
        ((await db.prepare("SELECT 1 FROM information_schema.columns WHERE table_name = 'school_teachers' AND column_name = $1").get(col)) ? true : false);
      if (!(await hasStCol("id"))) await db.prepare("CREATE TABLE IF NOT EXISTS school_teachers (id TEXT PRIMARY KEY, school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE, name TEXT NOT NULL, email TEXT NOT NULL, password_hash TEXT NOT NULL, classes TEXT NOT NULL DEFAULT '', active INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL DEFAULT (TO_CHAR(NOW() AT TIME ZONE 'UTC', 'YYYY-MM-DD\"T\"HH24:MI:SS.MS\"Z\"')))").run();
      if (!(await hasStCol("active"))) await db.prepare("ALTER TABLE school_teachers ADD COLUMN active INTEGER NOT NULL DEFAULT 1").run();
      if (!(await hasStCol("classes"))) await db.prepare("ALTER TABLE school_teachers ADD COLUMN classes TEXT NOT NULL DEFAULT ''").run();
      // Older "simple" school_teachers tables lack the login columns that the
      // full Stage C table has. Add them so bulk import and teacher login work.
      if (!(await hasStCol("email"))) await db.prepare("ALTER TABLE school_teachers ADD COLUMN email TEXT NOT NULL DEFAULT ''").run();
      if (!(await hasStCol("password_hash"))) await db.prepare("ALTER TABLE school_teachers ADD COLUMN password_hash TEXT NOT NULL DEFAULT ''").run();
      const hasLnCol = async (col: string) =>
        ((await db.prepare("SELECT 1 FROM information_schema.columns WHERE table_name = 'lesson_notes' AND column_name = $1").get(col)) ? true : false);
      if (!(await hasLnCol("id"))) await db.prepare("CREATE TABLE IF NOT EXISTS lesson_notes (id TEXT PRIMARY KEY, school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE, teacher_id TEXT NOT NULL REFERENCES school_teachers(id) ON DELETE CASCADE, teacher_name TEXT NOT NULL DEFAULT '', class_name TEXT NOT NULL DEFAULT '', subject TEXT NOT NULL, topic TEXT NOT NULL, body TEXT NOT NULL DEFAULT '', status TEXT NOT NULL DEFAULT 'pending', reviewed_by TEXT, reviewed_at TEXT, created_at TEXT NOT NULL DEFAULT (TO_CHAR(NOW() AT TIME ZONE 'UTC', 'YYYY-MM-DD\"T\"HH24:MI:SS.MS\"Z\"')))").run();
      if (!(await hasLnCol("teacher_name"))) await db.prepare("ALTER TABLE lesson_notes ADD COLUMN teacher_name TEXT NOT NULL DEFAULT ''").run();
      if (!(await hasLnCol("reviewed_by"))) await db.prepare("ALTER TABLE lesson_notes ADD COLUMN reviewed_by TEXT").run();
      if (!(await hasLnCol("reviewed_at"))) await db.prepare("ALTER TABLE lesson_notes ADD COLUMN reviewed_at TEXT").run();
      // Existing tables predate the attachment columns; CREATE TABLE IF NOT EXISTS
      // will not add them, so add them here.
      if (!(await hasLnCol("attachment_url"))) await db.prepare("ALTER TABLE lesson_notes ADD COLUMN attachment_url TEXT").run();
      if (!(await hasLnCol("attachment_name"))) await db.prepare("ALTER TABLE lesson_notes ADD COLUMN attachment_name TEXT").run();
      const hasAsCol = async (col: string) =>
        ((await db.prepare("SELECT 1 FROM information_schema.columns WHERE table_name = 'assignments' AND column_name = $1").get(col)) ? true : false);
      if (!(await hasAsCol("id"))) await db.prepare("CREATE TABLE IF NOT EXISTS assignments (id TEXT PRIMARY KEY, school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE, teacher_id TEXT NOT NULL REFERENCES school_teachers(id) ON DELETE CASCADE, class_name TEXT NOT NULL DEFAULT '', subject TEXT NOT NULL, topic TEXT NOT NULL, instructions TEXT NOT NULL DEFAULT '', due_at TEXT, created_at TEXT NOT NULL DEFAULT (TO_CHAR(NOW() AT TIME ZONE 'UTC', 'YYYY-MM-DD\"T\"HH24:MI:SS.MS\"Z\"')))").run();
      if (!(await hasAsCol("school_id"))) await db.prepare("ALTER TABLE assignments ADD COLUMN school_id TEXT NOT NULL DEFAULT ''").run();
      if (!(await hasAsCol("teacher_id"))) await db.prepare("ALTER TABLE assignments ADD COLUMN teacher_id TEXT NOT NULL DEFAULT ''").run();
      if (!(await hasAsCol("instructions"))) await db.prepare("ALTER TABLE assignments ADD COLUMN instructions TEXT NOT NULL DEFAULT ''").run();
      if (!(await hasAsCol("start_date"))) await db.prepare("ALTER TABLE assignments ADD COLUMN IF NOT EXISTS start_date TEXT").run();
      if (!(await hasAsCol("end_date"))) await db.prepare("ALTER TABLE assignments ADD COLUMN IF NOT EXISTS end_date TEXT").run();
      if (!(await hasAsCol("attachment_url"))) await db.prepare("ALTER TABLE assignments ADD COLUMN IF NOT EXISTS attachment_url TEXT").run();
      if (!(await hasAsCol("attachment_name"))) await db.prepare("ALTER TABLE assignments ADD COLUMN IF NOT EXISTS attachment_name TEXT").run();
      if (!(await hasAsCol("due_at"))) await db.prepare("ALTER TABLE assignments ADD COLUMN due_at TEXT").run();
      const hasBcCol = async (col: string) =>
        ((await db.prepare("SELECT 1 FROM information_schema.columns WHERE table_name = 'broadcasts' AND column_name = $1").get(col)) ? true : false);
      if (!(await hasBcCol("id"))) await db.prepare("CREATE TABLE IF NOT EXISTS broadcasts (id TEXT PRIMARY KEY, school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE, class_name TEXT DEFAULT NULL, body TEXT NOT NULL DEFAULT '', starts_at TEXT NOT NULL DEFAULT (TO_CHAR(NOW() AT TIME ZONE 'UTC', 'YYYY-MM-DD\"T\"HH24:MI:SS.MS\"Z\"')), ends_at TEXT, created_at TEXT NOT NULL DEFAULT (TO_CHAR(NOW() AT TIME ZONE 'UTC', 'YYYY-MM-DD\"T\"HH24:MI:SS.MS\"Z\"')))").run();
      if (!(await hasBcCol("school_id"))) await db.prepare("ALTER TABLE broadcasts ADD COLUMN school_id TEXT NOT NULL DEFAULT ''").run();
      const hasScCol = async (col: string) =>
        ((await db.prepare("SELECT 1 FROM information_schema.columns WHERE table_name = 'schools' AND column_name = $1").get(col)) ? true : false);
      if (!(await hasScCol("max_seats"))) await db.prepare("ALTER TABLE schools ADD COLUMN max_seats INTEGER NOT NULL DEFAULT 1500").run();
      if (!(await hasScCol("admin_emails"))) await db.prepare("ALTER TABLE schools ADD COLUMN admin_emails TEXT DEFAULT ''").run();
      if (!(await hasScCol("email"))) await db.prepare("ALTER TABLE schools ADD COLUMN email TEXT DEFAULT ''").run();
      if (!(await hasScCol("password_hash"))) await db.prepare("ALTER TABLE schools ADD COLUMN password_hash TEXT DEFAULT ''").run();
      if (!(await hasScCol("address"))) await db.prepare("ALTER TABLE schools ADD COLUMN address TEXT DEFAULT ''").run();
      if (!(await hasScCol("location"))) await db.prepare("ALTER TABLE schools ADD COLUMN location TEXT DEFAULT ''").run();
      if (!(await hasScCol("seats_used"))) await db.prepare("ALTER TABLE schools ADD COLUMN seats_used INTEGER NOT NULL DEFAULT 0").run();
      await db.prepare("CREATE TABLE IF NOT EXISTS school_students (id TEXT PRIMARY KEY, school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE, user_id TEXT REFERENCES users(id) ON DELETE SET NULL, name TEXT NOT NULL, class_name TEXT NOT NULL DEFAULT '', department TEXT, created_at TEXT NOT NULL DEFAULT (TO_CHAR(NOW() AT TIME ZONE 'UTC', 'YYYY-MM-DD\"T\"HH24:MI:SS.MS\"Z\"')))").run();
      // Add missing columns to existing school_students table
      const hasSsCol = async (col: string) => ((await db.prepare("SELECT 1 FROM information_schema.columns WHERE table_name = 'school_students' AND column_name = $1").get(col)) ? true : false);
      if (!(await hasSsCol("class_name"))) await db.prepare("ALTER TABLE school_students ADD COLUMN class_name TEXT NOT NULL DEFAULT ''").run();
      if (!(await hasSsCol("department"))) await db.prepare("ALTER TABLE school_students ADD COLUMN department TEXT").run();
      if (!(await hasSsCol("user_id"))) await db.prepare("ALTER TABLE school_students ADD COLUMN user_id TEXT REFERENCES users(id) ON DELETE SET NULL").run();
      await db.prepare("CREATE TABLE IF NOT EXISTS school_teachers (id TEXT PRIMARY KEY, school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE, user_id TEXT REFERENCES users(id) ON DELETE SET NULL, name TEXT NOT NULL, class_name TEXT NOT NULL DEFAULT '', subject TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL DEFAULT (TO_CHAR(NOW() AT TIME ZONE 'UTC', 'YYYY-MM-DD\"T\"HH24:MI:SS.MS\"Z\"')))").run();
      const hasStCol2 = async (col: string) => ((await db.prepare("SELECT 1 FROM information_schema.columns WHERE table_name = 'school_teachers' AND column_name = $1").get(col)) ? true : false);
      if (!(await hasStCol2("user_id"))) await db.prepare("ALTER TABLE school_teachers ADD COLUMN user_id TEXT REFERENCES users(id) ON DELETE SET NULL").run();
      if (!(await hasStCol2("class_name"))) await db.prepare("ALTER TABLE school_teachers ADD COLUMN class_name TEXT NOT NULL DEFAULT ''").run();
      if (!(await hasStCol2("subject"))) await db.prepare("ALTER TABLE school_teachers ADD COLUMN subject TEXT NOT NULL DEFAULT ''").run();
      if (!(await hasStCol2("department"))) await db.prepare("ALTER TABLE school_teachers ADD COLUMN department TEXT").run();
      await db.prepare("CREATE TABLE IF NOT EXISTS lesson_notes (id TEXT PRIMARY KEY, school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE, teacher_id TEXT NOT NULL REFERENCES school_teachers(id) ON DELETE CASCADE, teacher_name TEXT NOT NULL DEFAULT '', class_name TEXT NOT NULL DEFAULT '', subject TEXT NOT NULL, topic TEXT NOT NULL, body TEXT NOT NULL DEFAULT '', attachment_url TEXT, attachment_name TEXT, status TEXT NOT NULL DEFAULT 'pending', reviewed_by TEXT, reviewed_at TEXT, created_at TEXT NOT NULL DEFAULT (TO_CHAR(NOW() AT TIME ZONE 'UTC', 'YYYY-MM-DD\"T\"HH24:MI:SS.MS\"Z\"')))").run();
      await db.prepare("CREATE TABLE IF NOT EXISTS school_announcements (id TEXT PRIMARY KEY, school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE, title TEXT NOT NULL DEFAULT '', body TEXT NOT NULL DEFAULT '', class_name TEXT, created_at TEXT NOT NULL DEFAULT (TO_CHAR(NOW() AT TIME ZONE 'UTC', 'YYYY-MM-DD\"T\"HH24:MI:SS.MS\"Z\"')))").run();
      await db.prepare("CREATE TABLE IF NOT EXISTS mock_exams (id TEXT PRIMARY KEY, school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE, title TEXT NOT NULL, subjects TEXT NOT NULL DEFAULT '', class_name TEXT NOT NULL DEFAULT '', duration_minutes INTEGER NOT NULL DEFAULT 30, scheduled_at TEXT, status TEXT NOT NULL DEFAULT 'scheduled', created_at TEXT NOT NULL DEFAULT (TO_CHAR(NOW() AT TIME ZONE 'UTC', 'YYYY-MM-DD\"T\"HH24:MI:SS.MS\"Z\"')))").run();
      await db.prepare("CREATE TABLE IF NOT EXISTS school_questions (id TEXT PRIMARY KEY, school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE, subject TEXT NOT NULL, topic TEXT NOT NULL, stem TEXT NOT NULL, options_json TEXT NOT NULL DEFAULT '[]', answer TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL DEFAULT (TO_CHAR(NOW() AT TIME ZONE 'UTC', 'YYYY-MM-DD\"T\"HH24:MI:SS.MS\"Z\"')))").run();
      await db.prepare("CREATE TABLE IF NOT EXISTS school_subscriptions (id TEXT PRIMARY KEY, school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE, students_count INTEGER NOT NULL DEFAULT 0, term_months INTEGER NOT NULL DEFAULT 3, amount_paid INTEGER NOT NULL DEFAULT 0, discount_percent REAL NOT NULL DEFAULT 0, paystack_reference TEXT DEFAULT '', status TEXT NOT NULL DEFAULT 'pending', paid_at TEXT, expires_at TEXT, created_at TEXT NOT NULL DEFAULT (TO_CHAR(NOW() AT TIME ZONE 'UTC', 'YYYY-MM-DD\"T\"HH24:MI:SS.MS\"Z\"')))").run();
      await db.prepare("CREATE TABLE IF NOT EXISTS school_sessions (id TEXT PRIMARY KEY, school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE, student_name TEXT NOT NULL, class_name TEXT NOT NULL DEFAULT '', session_start TEXT NOT NULL DEFAULT (TO_CHAR(NOW() AT TIME ZONE 'UTC', 'YYYY-MM-DD\"T\"HH24:MI:SS.MS\"Z\"')), last_activity TEXT NOT NULL DEFAULT (TO_CHAR(NOW() AT TIME ZONE 'UTC', 'YYYY-MM-DD\"T\"HH24:MI:SS.MS\"Z\"')))").run();
      await db.prepare("CREATE TABLE IF NOT EXISTS school_notifications (id TEXT PRIMARY KEY, school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE, type TEXT NOT NULL DEFAULT '', sent_at TEXT NOT NULL DEFAULT (TO_CHAR(NOW() AT TIME ZONE 'UTC', 'YYYY-MM-DD\"T\"HH24:MI:SS.MS\"Z\"')))").run();
      await db.prepare("CREATE INDEX IF NOT EXISTS idx_school_teachers_school ON school_teachers(school_id)").run();
      await db.prepare("CREATE INDEX IF NOT EXISTS idx_lesson_notes_school_status ON lesson_notes(school_id, status)").run();
      await db.prepare("CREATE INDEX IF NOT EXISTS idx_assignments_school_class ON assignments(school_id, class_name)").run();
      await db.prepare("CREATE INDEX IF NOT EXISTS idx_broadcasts_school ON broadcasts(school_id, starts_at, ends_at)").run();
      await db.prepare("CREATE INDEX IF NOT EXISTS idx_school_students_school ON school_students(school_id)").run();
      await db.prepare("CREATE INDEX IF NOT EXISTS idx_school_students_class ON school_students(class_name)").run();
      await db.prepare("CREATE INDEX IF NOT EXISTS idx_school_students_user ON school_students(user_id)").run();
      await db.prepare("CREATE INDEX IF NOT EXISTS idx_school_subscriptions_school ON school_subscriptions(school_id)").run();
      await db.prepare("CREATE INDEX IF NOT EXISTS idx_school_sessions_school ON school_sessions(school_id)").run();
      await db.prepare("CREATE INDEX IF NOT EXISTS idx_school_sessions_last_activity ON school_sessions(last_activity)").run();
      await db.prepare("CREATE INDEX IF NOT EXISTS idx_school_notifications_school ON school_notifications(school_id)").run();
      // ---- Leaderboard: weekly XP + study time ----
      await db.prepare("CREATE TABLE IF NOT EXISTS study_time (user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, day TEXT NOT NULL, seconds INTEGER NOT NULL DEFAULT 0, updated_at TEXT NOT NULL DEFAULT (TO_CHAR(NOW() AT TIME ZONE 'UTC', 'YYYY-MM-DD\"T\"HH24:MI:SS.MS\"Z\"')), PRIMARY KEY (user_id, day))").run();
      await db.prepare("CREATE INDEX IF NOT EXISTS idx_study_time_day ON study_time(day)").run();
      await db.prepare("CREATE TABLE IF NOT EXISTS leaderboard_settings (user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE, hidden INTEGER NOT NULL DEFAULT 0, updated_at TEXT NOT NULL DEFAULT (TO_CHAR(NOW() AT TIME ZONE 'UTC', 'YYYY-MM-DD\"T\"HH24:MI:SS.MS\"Z\"')))").run();
      // ---- Security migration: failed login tracking + two-factor auth ----
      const hasUCol = async (col: string) =>
        ((await db.prepare("SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = $1").get(col)) ? true : false);
      if (!(await hasUCol("failed_login_attempts"))) await db.prepare("ALTER TABLE users ADD COLUMN failed_login_attempts INTEGER NOT NULL DEFAULT 0").run();
      if (!(await hasUCol("locked_until"))) await db.prepare("ALTER TABLE users ADD COLUMN locked_until TEXT").run();
      if (!(await hasUCol("two_factor_enabled"))) await db.prepare("ALTER TABLE users ADD COLUMN two_factor_enabled INTEGER NOT NULL DEFAULT 0").run();
      if (!(await hasUCol("two_factor_secret"))) await db.prepare("ALTER TABLE users ADD COLUMN two_factor_secret TEXT").run();
      // ---- Curriculum restructure: one canonical name per subject, Art (not Arts) ----
      // Placed last so every table/column above already exists.
      const pgRenames: { to: string; from: string[] }[] = [
        { to: "English Studies", from: ["English", "English Language"] },
        { to: "Social and Citizenship Studies", from: ["Social and Citizenship Education", "Citizenship Education"] },
        { to: "Intermediate Science", from: ["Intermediate Science (Basic Science and Technology)", "Integrated Science"] },
        { to: "Digital Technologies", from: ["Digital Technologies (Computer Studies/ICT)", "Computer Studies", "ICT"] },
        { to: "Christian Religious Studies", from: ["Christian Religious Knowledge", "CRK", "CRS"] }
      ];
      for (const { to, from } of pgRenames) {
        for (const oldName of from) {
          await db.prepare("UPDATE questions SET subject = ? WHERE subject = ?").run(to, oldName);
          await db.prepare("UPDATE topic_mastery SET subject = ? WHERE subject = ?").run(to, oldName);
          await db.prepare("UPDATE lesson_notes SET subject = ? WHERE subject = ?").run(to, oldName);
          await db.prepare("UPDATE assignments SET subject = ? WHERE subject = ?").run(to, oldName);
          await db.prepare("UPDATE school_questions SET subject = ? WHERE subject = ?").run(to, oldName);
          await db.prepare("UPDATE school_teachers SET subject = ? WHERE subject = ?").run(to, oldName);
          await db.prepare("UPDATE profiles SET subjects = btrim(REPLACE(',' || subjects || ',', ?, ?), ',') WHERE ',' || subjects || ',' LIKE ?").run(`,${oldName},`, `,${to},`, `%,${oldName},%`);
        }
      }
      await db.prepare("UPDATE profiles SET department = 'Art' WHERE department = 'Arts'").run();
      await db.prepare("UPDATE school_students SET department = 'Art' WHERE department = 'Arts'").run();
      await db.prepare("UPDATE school_teachers SET department = 'Art' WHERE department = 'Arts'").run();
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
