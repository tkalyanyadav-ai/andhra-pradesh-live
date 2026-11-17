CREATE TABLE IF NOT EXISTS collector_queue (
  id TEXT PRIMARY KEY,
  fingerprint TEXT NOT NULL UNIQUE,
  source_id TEXT NOT NULL REFERENCES sources(id),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  category TEXT NOT NULL,
  source_url TEXT NOT NULL,
  published_at TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK(status IN ('PENDING','APPROVED','REJECTED')),
  detected_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TEXT,
  review_note TEXT
);
CREATE INDEX IF NOT EXISTS collector_queue_status_date ON collector_queue(status, detected_at DESC);
INSERT OR IGNORE INTO sources(id,name,url,source_type,active) VALUES
('src-appsc','Andhra Pradesh Public Service Commission','https://portal-psc.ap.gov.in/HomePages/RecruitmentNotifications','OFFICIAL',1),
('src-goir','Andhra Pradesh Government Orders','https://goir.ap.gov.in/','OFFICIAL',1),
('src-apgov','Government of Andhra Pradesh','https://www.ap.gov.in/','OFFICIAL',1),
('src-apcrda','Andhra Pradesh Capital Region Development Authority','https://crda.ap.gov.in/','OFFICIAL',1);
CREATE TABLE IF NOT EXISTS collector_source_state (
  source_id TEXT PRIMARY KEY REFERENCES sources(id),
  content_hash TEXT NOT NULL,
  last_checked_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_error TEXT
);
