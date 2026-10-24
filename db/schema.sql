-- EduPal AI local schema (SQLite). Applied automatically on boot by lib/db.ts.
-- Future Postgres migration: port these tables 1:1.

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT,
  avatar TEXT,
  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  password_hash TEXT,
  role TEXT NOT NULL DEFAULT 'STUDENT',
  level TEXT NOT NULL DEFAULT 'SECONDARY',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS profiles (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  exam TEXT NOT NULL DEFAULT 'JAMB',
  exam_date TEXT,
  exam_start TEXT,
  exam_end TEXT,
  dates_confirmed INTEGER NOT NULL DEFAULT 1,
  department TEXT NOT NULL DEFAULT '',
  subjects TEXT NOT NULL DEFAULT 'English,Mathematics',
  language TEXT NOT NULL DEFAULT 'SIMPLE'
);

CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  exam TEXT NOT NULL,
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  type TEXT NOT NULL,
  stem TEXT NOT NULL,
  options_json TEXT NOT NULL DEFAULT '[]',
  answer_key TEXT NOT NULL DEFAULT '',
  marking_rubric TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL DEFAULT 'CURATED',
  predicted_repeat INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_questions_exam_subject_topic ON questions(exam, subject, topic);
-- Self-heal: drop duplicate stems from pre-index seeds, then enforce uniqueness.
DELETE FROM questions WHERE rowid NOT IN (SELECT MIN(rowid) FROM questions GROUP BY stem);
CREATE UNIQUE INDEX IF NOT EXISTS idx_questions_stem_unique ON questions(stem);

CREATE TABLE IF NOT EXISTS attempts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  response TEXT NOT NULL DEFAULT '',
  correct INTEGER NOT NULL DEFAULT 0,
  theory_score INTEGER,
  feedback_json TEXT NOT NULL DEFAULT '{}',
  credits_spent INTEGER NOT NULL DEFAULT 1,
  flagged INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_attempts_user_question ON attempts(user_id, question_id);

CREATE TABLE IF NOT EXISTS topic_mastery (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  accuracy REAL NOT NULL DEFAULT 0,
  label TEXT NOT NULL DEFAULT 'WEAK',
  streak_count INTEGER NOT NULL DEFAULT 0,
  consecutive_correct INTEGER NOT NULL DEFAULT 0,
  overridden INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id, subject, topic)
);

CREATE TABLE IF NOT EXISTS streaks (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  current INTEGER NOT NULL DEFAULT 0,
  longest INTEGER NOT NULL DEFAULT 0,
  last_study_date TEXT,
  freeze_available INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS wallets (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  credits_left INTEGER NOT NULL DEFAULT 10,
  reset_at TEXT NOT NULL DEFAULT (datetime('now')),
  plan TEXT NOT NULL DEFAULT 'FREE',
  paid_until TEXT,
  paid_from TEXT,
  nudge_for_until TEXT
);

CREATE TABLE IF NOT EXISTS parent_links (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_email TEXT NOT NULL,
  magic_token TEXT NOT NULL UNIQUE,
  verified_at TEXT,
  created_at TEXT
);

-- Local email outbox (stand-in for Mailpit UI; ZeptoMail sends these in prod).
CREATE TABLE IF NOT EXISTS email_outbox (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_outbox_user_day ON email_outbox(user_id, kind, created_at);

-- Referrals: invite link rewards (+5 bonus questions/day, capped).
CREATE TABLE IF NOT EXISTS referrals (
  id TEXT PRIMARY KEY,
  referrer_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referred_email TEXT NOT NULL,
  converted INTEGER NOT NULL DEFAULT 0,
  bonus_granted_at TEXT
);
CREATE TABLE IF NOT EXISTS bonus_pool (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day TEXT NOT NULL,
  remaining INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, day)
);

-- AI-drafted questions awaiting owner approval (hybrid factory).
CREATE TABLE IF NOT EXISTS draft_questions (
  id TEXT PRIMARY KEY,
  exam TEXT NOT NULL,
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  type TEXT NOT NULL,
  stem TEXT NOT NULL,
  options_json TEXT NOT NULL DEFAULT '[]',
  answer_key TEXT NOT NULL DEFAULT '',
  marking_rubric TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_drafts_status ON draft_questions(status, subject);
CREATE TABLE IF NOT EXISTS deadlines (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL,
  title TEXT NOT NULL,
  detail TEXT NOT NULL DEFAULT '',
  source_url TEXT,
  opens_on TEXT,
  closes_on TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- AI tutor chat history (per user + optional question context).
CREATE TABLE IF NOT EXISTS chat_messages (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id TEXT REFERENCES questions(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_chat_user_q ON chat_messages(user_id, question_id, created_at);

-- Per-subject daily free usage (one row per user/subject/day).
CREATE TABLE IF NOT EXISTS subject_usage (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  day TEXT NOT NULL,
  used INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, subject, day)
);

-- Phase 1 admin: site-wide flags (maintenance) + audit trail.
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS admin_audit (
  id TEXT PRIMARY KEY,
  admin_id TEXT,
  action TEXT NOT NULL,
  target TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Phase 2: money (payments log, plans, promo codes).
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  email TEXT NOT NULL DEFAULT '',
  reference TEXT UNIQUE,
  amount_kobo INTEGER NOT NULL DEFAULT 0,
  plan TEXT NOT NULL DEFAULT 'UNLIMITED',
  status TEXT NOT NULL DEFAULT 'pending',
  channel TEXT NOT NULL DEFAULT 'paystack',
  promo_code TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_tx_status_day ON transactions(status, created_at);
CREATE TABLE IF NOT EXISTS plans (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  amount_kobo INTEGER NOT NULL DEFAULT 100000,
  credits INTEGER NOT NULL DEFAULT 9999,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS promo_codes (
  code TEXT PRIMARY KEY,
  percent_off INTEGER NOT NULL DEFAULT 0,
  max_uses INTEGER NOT NULL DEFAULT 100,
  used INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  expires_on TEXT
);

-- Phase 2: announcements + read receipts.
CREATE TABLE IF NOT EXISTS announcements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  segment TEXT NOT NULL DEFAULT 'all',
  created_by TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS announcement_reads (
  announcement_id TEXT NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  read_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (announcement_id, user_id)
);

-- Phase 2: subject visibility switches + admin allowlist + error log.
CREATE TABLE IF NOT EXISTS subject_config (
  subject TEXT PRIMARY KEY,
  active INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS admin_allowlist (
  email TEXT PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'CONTENT_ADMIN',
  added_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS error_logs (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- School Portal (institutional accounts). A school subscribes; its students
-- are normal EduPal users ADDITIONALLY linked to the school — personal
-- accounts and subscriptions are untouched by any of this.
CREATE TABLE IF NOT EXISTS school_groups (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS schools (
  id TEXT PRIMARY KEY,
  group_id TEXT REFERENCES school_groups(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  admin_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  active INTEGER NOT NULL DEFAULT 0,
  expires_at TEXT,
  max_seats INTEGER NOT NULL DEFAULT 1000,
  ai_prompts INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
-- A student belongs to at most ONE school (UNIQUE user_id); class grouping
-- inside the school (SS2, JSS3, ...).
CREATE TABLE IF NOT EXISTS school_members (
  id TEXT PRIMARY KEY,
  school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  class_name TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id)
);
CREATE INDEX IF NOT EXISTS idx_school_members_school ON school_members(school_id);

-- Stage C: teacher accounts, lesson notes with VP approval, assignments, broadcasts.
-- Teachers are normal EduPal users (role SCHOOL_TEACHER) who can log in at /login.
-- school_teachers links them to a school and records which classes they teach.
CREATE TABLE IF NOT EXISTS school_teachers (
  id TEXT PRIMARY KEY,
  school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  classes TEXT NOT NULL DEFAULT '',
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_school_teachers_school ON school_teachers(school_id);

-- Lesson notes: teachers write them (pending), VP Academics approves/rejects them.
-- Only approved notes are visible to students in the target class.
CREATE TABLE IF NOT EXISTS lesson_notes (
  id TEXT PRIMARY KEY,
  school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  teacher_id TEXT NOT NULL REFERENCES school_teachers(id) ON DELETE CASCADE,
  class_name TEXT NOT NULL DEFAULT '',
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  reviewed_by TEXT,
  reviewed_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_lesson_notes_school_status ON lesson_notes(school_id, status);

-- Assignments: teachers set work for a class (subject, topic, due date).
-- Completion is measured from existing attempts on that topic.
CREATE TABLE IF NOT EXISTS assignments (
  id TEXT PRIMARY KEY,
  school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  teacher_id TEXT NOT NULL REFERENCES school_teachers(id) ON DELETE CASCADE,
  class_name TEXT NOT NULL DEFAULT '',
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  instructions TEXT NOT NULL DEFAULT '',
  due_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_assignments_school_class ON assignments(school_id, class_name);

-- Broadcasts: one-line messages to a whole class (or the whole school when class_name is NULL).
CREATE TABLE IF NOT EXISTS broadcasts (
  id TEXT PRIMARY KEY,
  school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  class_name TEXT DEFAULT NULL,
  body TEXT NOT NULL DEFAULT '',
  starts_at TEXT NOT NULL DEFAULT (datetime('now')),
  ends_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_broadcasts_school ON broadcasts(school_id, starts_at, ends_at);
