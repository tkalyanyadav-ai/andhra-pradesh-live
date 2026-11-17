-- Attach district-specific discovery feeds to the matching district record.
ALTER TABLE collector_queue ADD COLUMN district_id TEXT REFERENCES districts(id);
INSERT OR IGNORE INTO sources(id,name,url,source_type,active) VALUES
('src-rss-district-27','Google News RSS – Markapuram district','https://news.google.com/rss/search?q=Markapuram%20Andhra%20Pradesh%20news&hl=en-IN&gl=IN&ceid=IN:en','NEWS',1),
('src-rss-district-28','Google News RSS – Polavaram district','https://news.google.com/rss/search?q=Polavaram%20Andhra%20Pradesh%20news&hl=en-IN&gl=IN&ceid=IN:en','NEWS',1);
