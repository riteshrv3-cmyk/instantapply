-- Slice 1 tables (subset of docs/03-design.md section 2). Safe to run many times.

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  firebase_uid TEXT UNIQUE NOT NULL,
  email TEXT,
  name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  consent_at TIMESTAMPTZ,
  consent_version TEXT,
  plan TEXT NOT NULL DEFAULT 'free',
  free_used INT NOT NULL DEFAULT 0,
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS profiles (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  resume_text TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS answers (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_key TEXT NOT NULL,
  answer TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'signup',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, question_key)
);

CREATE TABLE IF NOT EXISTS resumes (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,            -- master | tailored
  job_title TEXT,
  job_company TEXT,
  job_url TEXT,
  job_text TEXT,
  data JSONB NOT NULL,           -- resume JSON (+ cover_note, changes for tailored)
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_log (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT,
  action TEXT NOT NULL,
  at TIMESTAMPTZ NOT NULL DEFAULT now()
);
