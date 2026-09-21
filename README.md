# Manish Jangir Portfolio

Production-grade engineering portfolio. Phase 1 establishes the application foundation only.

## Phase 1 scope

- Next.js App Router + TypeScript
- Strict TypeScript configuration
- Tailwind CSS v4
- Environment validation with Zod
- Base public application shell
- Initial route structure
- Accessible focus and reduced-motion foundations
- ESLint + Prettier
- Vitest unit-test setup
- Playwright E2E setup
- Central JSON logger abstraction
- Safe error boundary and 404 page
- `.env.example`

Database, authentication, CMS, analytics, observability integrations, media storage, and project content are intentionally deferred to later phases.

## Requirements

- Node.js 20.9+
- npm 10+

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Quality checks

```bash
npm run typecheck
npm run lint
npm run test
npm run format:check
npm run build
npm run test:e2e
```

## Architecture

Phase 0 architecture is recorded in `docs/architecture.md`. The Phase 1 implementation deliberately avoids adding database, auth, Redis, or external telemetry dependencies before their corresponding phases.
