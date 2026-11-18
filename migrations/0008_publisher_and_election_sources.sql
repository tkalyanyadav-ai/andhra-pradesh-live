-- Publisher discovery feeds and a third-party AP election-results monitor.
-- Google News RSS is an index of publisher links, not a publisher-owned RSS feed.
-- All collected items remain in the editorial queue and media/monitor items are not officially verified.
INSERT OR IGNORE INTO sources(id,name,url,source_type,active) VALUES
('src-rss-publisher-way2news-ap','Google News index — Way2News Andhra Pradesh','https://news.google.com/rss/search?q=site%3Away2news.com%20%22Andhra%20Pradesh%22&hl=te&gl=IN&ceid=IN%3Ate','NEWS',1),
('src-rss-publisher-way2news-politics','Google News index — Way2News AP politics','https://news.google.com/rss/search?q=site%3Away2news.com%20(Andhra%20Pradesh%20OR%20AP)%20(politics%20OR%20election%20OR%20government)&hl=te&gl=IN&ceid=IN%3Ate','NEWS',1),
('src-rss-publisher-abn-ap','Google News index — ABN Andhra Jyothy AP','https://news.google.com/rss/search?q=site%3Aabn.andhrajyothy.com%20OR%20site%3Aandhrajyothy.com%20%22Andhra%20Pradesh%22&hl=te&gl=IN&ceid=IN%3Ate','NEWS',1),
('src-rss-publisher-abn-politics','Google News index — ABN Andhra Jyothy politics','https://news.google.com/rss/search?q=site%3Aabn.andhrajyothy.com%20OR%20site%3Aandhrajyothy.com%20(Andhra%20Pradesh%20OR%20AP)%20(politics%20OR%20election%20OR%20government)&hl=te&gl=IN&ceid=IN%3Ate','NEWS',1),
('src-rss-publisher-sakshi-ap','Google News index — Sakshi Andhra Pradesh','https://news.google.com/rss/search?q=site%3Asakshi.com%20%22Andhra%20Pradesh%22&hl=te&gl=IN&ceid=IN%3Ate','NEWS',1),
('src-rss-publisher-sakshi-politics','Google News index — Sakshi AP politics','https://news.google.com/rss/search?q=site%3Asakshi.com%20(Andhra%20Pradesh%20OR%20AP)%20(politics%20OR%20election%20OR%20government)&hl=te&gl=IN&ceid=IN%3Ate','NEWS',1),
('src-rss-publisher-etv-ap','Google News index — ETV Bharat Andhra Pradesh','https://news.google.com/rss/search?q=site%3Aetvbharat.com%20%22Andhra%20Pradesh%22&hl=te&gl=IN&ceid=IN%3Ate','NEWS',1),
('src-rss-publisher-etv-politics','Google News index — ETV Bharat AP politics','https://news.google.com/rss/search?q=site%3Aetvbharat.com%20(Andhra%20Pradesh%20OR%20AP)%20(politics%20OR%20election%20OR%20government)&hl=te&gl=IN&ceid=IN%3Ate','NEWS',1),
('src-monitor-apelectionresults','AP Election Results — third-party results monitor','https://apelectionresults.com/','NEWS',1);
