-- Add durable per-source collection fingerprints and error state.
-- Separate migration because 0003 may already be applied in existing D1 databases.
CREATE TABLE IF NOT EXISTS collector_source_state (
  source_id TEXT PRIMARY KEY REFERENCES sources(id),
  content_hash TEXT NOT NULL,
  last_checked_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_error TEXT
);
