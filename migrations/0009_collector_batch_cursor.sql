CREATE TABLE IF NOT EXISTS collector_run_state (
  id TEXT PRIMARY KEY,
  next_offset INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT OR IGNORE INTO collector_run_state(id,next_offset) VALUES('main',0);
