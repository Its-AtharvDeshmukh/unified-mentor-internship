# Silent SOS Emergency Web App — Unified Mentor Project 02

A full-stack internship project for discreet emergency alerts, trusted-contact management, alert status tracking, and permission-based location sharing.

**Stack:** Next.js 14 App Router, TypeScript, Prisma, SQLite for local development, Tailwind CSS, and Vitest.

## Quick start (macOS / Linux)

1. Install Node.js 20 or newer.
2. Open Terminal in this `silent-sos-app` folder.
3. Install packages:

   ```bash
   npm install
   ```

4. Create your local environment file:

   ```bash
   cp .env.example .env
   ```

5. Set a private session secret in `.env`. For example, generate one with:

   ```bash
   openssl rand -base64 32
   ```

   Paste the generated value into `JWT_SECRET`. Keep `.env` private and never commit it.

6. Create the local SQLite database and seed demo data:

   ```bash
   npm run db:push
   npm run db:seed
   ```

7. Run tests and TypeScript checks:

   ```bash
   npm test
   npm run typecheck
   ```

8. Start the app:

   ```bash
   npm run dev
   ```

9. Open http://localhost:3000.

## Demo accounts

- User: `demo@silentsos.example` / `SafetyFirst#2026`
- Admin: `admin@silentsos.example` / `AdminMonitor#2026`

These are demo credentials for local evaluation only. Change or remove them before any real deployment.

## Safe notification testing

The default `.env.example` uses `NOTIFICATION_MODE="sandbox"`. This records simulated notification attempts and does **not** send SMS or email. Keep sandbox mode for development and tests.

Live SMS/email requires correctly configured provider credentials, verified sender details, consent from contacts, and a deliberate switch to production mode. A provider accepting a message does not guarantee delivery to a recipient.

## Important limitations

- This is an educational project, not a certified emergency service. Do not rely on it as your only safety plan.
- Browser geolocation requires permission and a supported browser. A browser tab cannot guarantee uninterrupted background location tracking when minimized, locked, or closed.
- SMS/email dispatch and delivery depend on third-party services and network connectivity.
- The app does not automatically contact police or local emergency services.
- Review authentication, rate limiting, database configuration, privacy retention, deployment secrets, and provider callbacks before production use.

## Project structure

- `src/app/` — pages and API route handlers
- `src/lib/` — authentication, validation, database and notification helpers
- `prisma/` — database schema and safe demo seed
- `src/__tests__/` — workflow and validation tests
- `docs/PRD_AND_ARCHITECTURE.md` — product requirements and architecture notes
