# Product Requirements Document (PRD) & Technical Architecture
## Project 02: Silent SOS Emergency Web App (Unified Mentor Internship)

### 1. Problem Statement & Core Objectives
Victims of domestic abuse, stalking, harassment, or sudden medical emergencies often cannot safely make a verbal phone call or explain their coordinates under duress. Silent SOS provides a zero-audio, low-glare web interface that dispatches an idempotent server-side alert and live browser Geolocation telemetry to pre-configured trusted contacts in under 2 seconds.

### 2. Alert Lifecycle State Machine
- `CREATED`: Server record persisted; zero outbound contacts configured.
- `PROCESSING`: Transaction committed; notification adapters executing.
- `SENT`: At least one SMS or Email provider confirmed dispatch (`SENT` or `DELIVERED_SANDBOX`).
- `ACKNOWLEDGED`: Trusted contact opened the cryptographic responder link (`/respond/[token]`) and confirmed receipt.
- `RESOLVED`: User confirmed safety; continuous GPS watch stopped and share token expired.
- `FAILED`: All configured notification providers returned errors after retry.

### 3. Security & Privacy Architecture
- **Authentication**: `bcryptjs` (10 rounds) password hashing + `jose` HS256 signed `HttpOnly`, `SameSite=Lax` cookies.
- **Cross-User Isolation**: Every `/api/alerts/[id]` and `/api/contacts/[id]` endpoint verifies `record.userId === session.userId` (or `session.role === "ADMIN"` with mandatory audit logging).
- **Idempotency**: Repeated frantic presses within a 10-second window share an idempotency key and return the active alert without spamming duplicate SMS messages.

