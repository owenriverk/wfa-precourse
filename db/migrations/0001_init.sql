-- OpenWFA sync: optional accounts for cross-device progress.
-- Data minimization: an email address and a blob of wfa_* progress keys. Nothing else.
CREATE TABLE IF NOT EXISTS users (
  id         TEXT PRIMARY KEY,            -- uuid
  email      TEXT UNIQUE NOT NULL,        -- lowercased
  created_at INTEGER NOT NULL             -- epoch seconds
);
CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,            -- sha256 of the cookie token
  user_id    TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  last_seen  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE TABLE IF NOT EXISTS login_tokens (
  token_hash TEXT PRIMARY KEY,            -- sha256 of the emailed token
  email      TEXT NOT NULL,
  ip         TEXT,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  used       INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_login_email ON login_tokens(email, created_at);
CREATE INDEX IF NOT EXISTS idx_login_ip ON login_tokens(ip, created_at);
CREATE TABLE IF NOT EXISTS progress (
  user_id    TEXT PRIMARY KEY,
  data       TEXT NOT NULL,               -- JSON: { "wfa_completed_01": "true", ... }
  updated_at INTEGER NOT NULL
);
