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
1. Create a D1 database named `andhra-pradesh-live-db`.
2. Replace `00000000000000000000000000000000 (replace this placeholder with your D1 database ID)` in `wrangler.jsonc` with the D1 database ID.
3. Apply schema using `npm run db:migrate:remote`.
4. Add Worker secret `ADMIN_API_TOKEN` in Cloudflare. Never commit secrets.
5. Run `npm run preview`, then `npm run deploy`.

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
Do not assume RSS/API access or automated polling is permitted. Assess source terms, robots policy, access controls and rate limits before building connectors. Live source monitoring, email delivery, Telugu translation and automatic verification are not yet enabled.

## Production hardening still required
Add user-based authentication and role management, rate limiting, verified email subscriptions, backup/restore tests, abuse controls, monitoring and security review. Protect the admin API token and rotate it if exposed.
