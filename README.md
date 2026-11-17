# Andhra Pradesh Live
**Every Update. Every District. Every Development. One Andhra Pradesh.**

A source-first Andhra Pradesh public information portal. The app includes a multi-section Next.js site, searchable content APIs, Cloudflare D1 data model, protected editorial write API and Workers deployment configuration.

## Sections
Amaravati projects; IAS and IPS posting history; districts; departments; Government Orders; news; schemes; recruitment; portal search; editorial admin console.

No fabricated news, Government Order numbers, officer transfers, district facts or project progress are seeded. Empty sections remain empty until source-linked records are entered and checked.

## Stack
Next.js 15 App Router, React 19, TypeScript, OpenNext Cloudflare adapter, Cloudflare Workers, D1 and Wrangler. Production records use D1. The earlier Prisma/PostgreSQL starter schema is no longer used by the Cloudflare app.

## Local development
1. Install Node.js 20+.
2. Run `npm install`.
3. Copy `.dev.vars.example` to `.dev.vars` and set a strong `ADMIN_API_TOKEN` for local editorial writes.
4. Run `npm run dev` for Next.js development.
5. Create the D1 database locally and apply schema: `npm run db:migrate:local`.
6. Use `npm run preview` to test the Cloudflare Worker runtime locally.

## Cloudflare deployment
1. Add the GitHub Actions secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
2. Push to `main` or manually run the Deploy Andhra Pradesh Live workflow. It creates or reuses the D1 database and injects its ID into the deployment config automatically.
3. Add Worker secret `ADMIN_API_TOKEN` in Cloudflare before using editorial write APIs. Never commit secrets.
4. Review the workflow result and verify `/api/health` after deployment.

The Worker is named `andhra-pradesh-live`. The D1 binding is `DB`.

## API
- GET /api/health — runtime and D1 status
- GET /api/search?q=... — articles, GOs, officers and districts
- GET /api/content/news, /government-orders, /districts, /departments, /officers, /amaravati, /schemes, /recruitment
- POST /api/subscribe — stores subscription request; confirmation/email delivery not enabled
- POST /api/admin/{collection} — token-protected content creation

Admin collections: news, government-orders, districts, departments, officers, amaravati, schemes, recruitment. Send `Authorization: Bearer <ADMIN_API_TOKEN>`. New news records default to `AWAITING_OFFICIAL_CONFIRMATION`; admin writes are audited.

## GitHub Actions
The deployment workflow uses `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repository secrets. It provisions the D1 database automatically. The Cloudflare API token needs permission to manage Workers Scripts and D1 databases.

## Source integrity
Official source starting points: https://www.ap.gov.in/ ; https://goir.ap.gov.in/ ; https://crda.ap.gov.in/ ; https://www.india.gov.in/ .
Do not assume RSS/API access or automated polling is permitted. Assess source terms, robots policy, access controls and rate limits before building connectors. The Cloudflare Cron Trigger checks sources every 30 minutes. The collector monitors four official sources (APPSC, Government Orders, the AP Government portal and APCRDA) plus 82 RSS discovery feeds: 13 statewide topic searches, 28 district searches, and 41 sports/entertainment feeds. The latter combine publisher feeds from Oneindia Telugu, MyKhel Telugu, Filmibeat Telugu, The Hindu and The Indian Express with Google News topic discovery for Andhra Pradesh sports, cricket, Telugu sports, Tollywood, movie releases/reviews, OTT, Indian cinema and Telugu film music. RSS headlines, descriptions, dates and feed-provided article links are retained and queued for editorial review. Google News article links may redirect to the publisher; they are not guaranteed to be direct publisher URLs; RSS collection does not consume a Gemini call per feed. Gemini is used for extraction from official HTML pages. Approved media stories are labelled as awaiting official confirmation; an editor must not present a media report as an official government confirmation. District-specific feed items are linked to their district record. Source fingerprints and duplicate fingerprints reduce repeat processing. This is a broad discovery layer, not a guarantee of every story in Andhra Pradesh: feed ranking, publisher availability, robots/terms, network access and RSS changes affect coverage. The Google News discovery feeds use the English India locale; several publisher sports and cinema feeds provide Telugu-language coverage. A fully translated Telugu interface and comprehensive direct feeds from every district-level sports association, cinema body and local publisher are not yet implemented. Google News RSS is a discovery service; use the feed-provided link to reach the publisher. Do not bypass paywalls or access controls.

## Production hardening still required
Add user-based authentication and role management, rate limiting, verified email subscriptions, backup/restore tests, abuse controls, monitoring and security review. Protect the admin API token and rotate it if exposed.
