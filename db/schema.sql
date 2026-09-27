-- EduPal AI local schema (SQLite). Applied automatically on boot by lib/db.ts.
-- Future Postgres migration: port these tables 1:1.

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
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
  plan TEXT NOT NULL DEFAULT 'FREE'
);

CREATE TABLE IF NOT EXISTS parent_links (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_email TEXT NOT NULL,
  magic_token TEXT NOT NULL UNIQUE,
  verified_at TEXT
);
