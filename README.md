# Manish Jangir Portfolio

Production-grade engineering portfolio. Phase 2 adds the PostgreSQL persistence foundation without adding CMS or authentication behavior yet.

## Phase 2 scope

- PostgreSQL database connection through `postgres`
- Drizzle ORM and Drizzle Kit
- Normalized relational content schema
- Initial database migration
- Projects and ordered case-study sections
- Technologies and project technology relationships
- Experience records
- Publishable updates
- Draft / Published / Archived content states
- Database-focused unit test coverage
- Database setup and migration documentation

Authentication, admin CRUD, revisions, audit trails, analytics, media storage, and seeded resume content remain deferred to their corresponding phases.

## Requirements

- Node.js 20.9+
- npm 10+
- PostgreSQL 15+

## Setup

```bash
npm install
cp .env.example .env.local
```

Set `DATABASE_URL` in `.env.local`, then apply the committed migration:

```bash
npm run db:migrate
```

Start the application:

```bash
npm run dev
```

## Quality checks

```bash
npm run typecheck
npm run lint
npm run test
npm run format:check
npm run build
npm run test:e2e
```

## Database workflow

Edit `src/db/schema.ts`, generate a migration, review the SQL, and then apply it:

```bash
npm run db:generate
npm run db:migrate
```

See `docs/database.md` for the Phase 2 model and boundaries.
