# Source monitoring worker (implementation contract)

Do not publish scraped content directly. Each connector must:
1. Respect the source site's terms, robots policy, rate limits and applicable law.
2. Prefer official APIs, RSS feeds, public document repositories and permitted feeds.
3. Store the source URL, retrieval timestamp, HTTP status and content hash.
4. Detect duplicates using canonical URL and normalized content hash.
5. Parse document metadata without inventing missing GO numbers, dates or officers.
6. Create a review item with `AWAITING_OFFICIAL_CONFIRMATION` unless authenticity is established.
7. Keep original PDFs/URLs and extracted text separately.
8. Never bypass CAPTCHA, authentication, access controls or technical restrictions.

Suggested cadence is a target only; actual polling must be negotiated per source and rate limits.
Use Redis-backed queues and a scheduler in a separate deployment. Add connectors one by one
after validating source access and legal permission. The starter does not contain a running
scraper or claim that GOIR/APCRDA are monitored live.
