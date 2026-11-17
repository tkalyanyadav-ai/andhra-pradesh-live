# Andhra Pradesh Live

A Next.js + PostgreSQL starter for a source-first Andhra Pradesh information portal.

## Included
- Responsive homepage and navigation for Amaravati, IAS/IPS postings, districts, GOs, schemes, recruitment and departments.
- Prisma data model for articles, sources, districts, departments, officers, posting history, Government Orders, schemes, recruitment, projects, source checks, subscriptions and corrections.
- PostgreSQL + Redis Docker Compose.
- Health endpoint.
- Source-monitoring and verification implementation contract.
- No fabricated news, GO numbers, officers, project progress or live-data claims.

## Run locally
1. Install Node.js 20+ and Docker.
2. Copy `.env.example` to `.env` and set a strong database password.
3. Start services: `docker compose up -d`
4. Install packages: `npm install`
5. Generate Prisma client: `npm run db:generate`
6. Create database tables: `npm run db:migrate`
7. Start development server: `npm run dev`
8. Open `http://localhost:3000`; health endpoint is `/api/health`.

## Important production work still required
This is a working foundation, not a deployed production service. Before public launch:
- Configure real authentication and role-based authorization for all admin operations.
- Build admin CRUD screens and audit trails.
- Implement and test individual source connectors, with permission/rate-limit checks.
- Implement editorial review and document storage with malware scanning.
- Add search indexing, pagination, Telugu translation/review workflow and notification delivery.
- Add monitoring, backups, secrets management, CI/CD, security testing and deployment.
- Verify district/department master data against current official government records.

## Verification model
Only publish government decisions as `CONFIRMED` when supported by an authoritative official record.
News reports without official confirmation remain `DEVELOPING` or `AWAITING_OFFICIAL_CONFIRMATION`.
Preserve source publication date, retrieval/check time and the original source URL.

## Initial official source directory
- https://www.ap.gov.in/
- https://goir.ap.gov.in/
- https://crda.ap.gov.in/
- https://cdma.ap.gov.in/
- https://www.india.gov.in/

Do not assume a source supports RSS/API access or automated polling until checked.
