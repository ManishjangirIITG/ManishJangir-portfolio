# Manish Jangir Portfolio

Production-grade engineering portfolio. Phase 3 adds the private administration authentication boundary on top of the Phase 2 PostgreSQL content foundation.

## Phase 3 scope

- Database-backed administrator identity
- PBKDF2 password hashing
- Opaque, hashed session tokens
- HTTP-only secure session cookie
- Server-side admin authorization
- Protected `/admin` route
- Private `/admin/login` route
- Login and logout API boundaries
- Local administrator provisioning workflow
- Authentication-focused tests and documentation

Content CRUD, revisions, audit trails, analytics, media storage, and public database-backed content remain deferred to later phases.

## Requirements

- Node.js 20.9+
- npm 10+
- PostgreSQL 15+

## Setup

```bash
npm install
cp .env.example .env.local
```

Set `DATABASE_URL` in `.env.local`, then apply the committed migrations:

```bash
npm run db:migrate
```

Generate a password hash locally:

```bash
npm run admin:hash -- '<strong-password>'
```

Set the resulting `ADMIN_PASSWORD_HASH` and `ADMIN_EMAIL` in the environment used to provision the administrator, then run:

```bash
npm run admin:seed
```

Start the application:

```bash
npm run dev
```

Open `/admin/login` to authenticate.

## Quality checks

```bash
npm run typecheck
npm run lint
npm run test
npm run format:check
npm run build
npm run test:e2e
```

See `docs/authentication.md` for the session and password model.
