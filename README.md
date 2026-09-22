# Manish Jangir — Engineering Portfolio

A production-oriented personal portfolio built as an engineering system, not just a static profile.

The site presents my work across **software engineering, backend systems, machine learning, data science, full-stack development, and infrastructure**, while also exposing selected details about how the portfolio itself is designed and operated.

> The goal is simple: the portfolio should demonstrate engineering ability through its architecture, code quality, security, observability, testing, and maintainability — not only through the projects it displays.

---

## What this repository contains

This project includes:

- a public portfolio with project case studies, experience, updates, and a sanitized professional profile;
- a private admin CMS for managing portfolio content without code changes;
- a PostgreSQL-backed relational content model using Drizzle ORM;
- publishing states for draft, published, and archived content;
- content revision history and audit logging;
- first-party, privacy-conscious analytics;
- safe public observability through health checks, readiness checks, build/runtime information, and browser Web Vitals;
- structured application logging;
- authentication and server-side authorization for admin routes;
- automated unit, integration-quality, accessibility, and end-to-end checks;
- CI quality gates before deployment.

The application intentionally avoids fake traffic, uptime, user counts, benchmarks, and other manufactured production metrics.

---

## Tech stack

### Application

- Next.js — App Router
- TypeScript
- React
- Tailwind CSS
- Zod

### Data

- PostgreSQL
- Drizzle ORM
- versioned SQL migrations

### Testing and quality

- Vitest
- Playwright
- `@axe-core/playwright`
- ESLint
- TypeScript strict mode
- formatting checks

### Infrastructure and operations

- structured application logging
- liveness and readiness endpoints
- safe runtime/build metadata
- CI through GitHub Actions
- environment-based configuration

---

## Public routes

| Route              | Purpose                               |
| ------------------ | ------------------------------------- |
| `/`                | Main portfolio and system overview    |
| `/about`           | Engineering background and trajectory |
| `/experience`      | Professional experience               |
| `/projects`        | Published project case studies        |
| `/projects/[slug]` | Project deep dives                    |
| `/resume`          | Sanitized public professional profile |
| `/updates`         | Published build/project updates       |
| `/updates/[slug]`  | Individual update                     |
| `/contact`         | Public professional contact channels  |

The public site does **not** expose a downloadable private resume, personal phone number, or private email address.

---

## Admin CMS

The private `/admin` area is protected using server-side authentication and authorization.

The CMS supports:

- project CRUD;
- experience CRUD;
- update CRUD;
- `Draft`, `Published`, and `Archived` states;
- revision history;
- audit events;
- safe publishing workflows;
- content updates without application code changes.

Admin authorization is enforced on the server rather than relying on client-side route hiding.

---

## Content model

The portfolio uses normalized PostgreSQL tables rather than storing the entire site inside a monolithic JSON document.

Core entities include:

```text
projects
├── project_sections
└── project_technologies
        └── technologies

experiences

updates

admin_users
admin_sessions

content_revisions
audit_logs

analytics_events
```

Published public content is queried through a dedicated public data-access boundary so draft or archived records are not accidentally rendered.

---

## Publishing vs presentation

The homepage deliberately separates **system state** from **presentation limits**.

For example:

```text
Database
4 published projects
        │
        ├── SYSTEM card → published projects: 4
        │
        └── Featured Work → latest/featured 3
```

Similarly, the homepage can display only a few recent updates while the SYSTEM panel reports the real total number of published updates.

This prevents presentation limits from being misrepresented as system totals.

---

## Inspect System

The homepage includes a public observability section intended to demonstrate how the portfolio itself behaves.

It exposes only safe information such as:

- application version;
- Git revision when available;
- runtime environment;
- API liveness state;
- database readiness state;
- browser-reported Web Vitals.

It deliberately does **not** expose:

- environment secrets;
- database connection details;
- authentication data;
- raw infrastructure internals;
- fabricated traffic or uptime statistics.

---

## Health endpoints

### Liveness

```text
GET /api/health
```

Answers whether the web application process is responding.

It does not depend on PostgreSQL, so infrastructure failures can be distinguished from application-process failures.

### Readiness

```text
GET /api/health/ready
```

Performs a bounded database readiness check.

A deployment or runtime can therefore be:

```text
alive      = application process responds
ready      = required dependencies are available
```

The responses are intentionally restricted to safe operational data.

---

## Privacy-conscious analytics

The site includes a replaceable first-party analytics abstraction.

Currently supported event types include:

```text
page_view
project_view
resume_download
```

Only events that correspond to real product behavior should be emitted. For example, because the public site intentionally does not expose a downloadable private resume, `resume_download` should not be emitted unless a privacy-safe downloadable artifact is introduced later.

Stored analytics data is intentionally minimal.

The implementation avoids collecting:

- IP addresses;
- persistent visitor identifiers;
- fingerprints;
- user-agent profiles;
- referrers;
- arbitrary metadata;
- private contact information.

Client analytics also respects browser privacy signals such as Global Privacy Control and Do Not Track.

---

## Security model

Security is treated as part of the application architecture rather than as a deployment afterthought.

Current protections include:

- strict server-side admin authorization;
- password hashing;
- opaque admin session tokens;
- hashed session-token storage;
- HttpOnly session cookies;
- `SameSite` cookie protection;
- secure production cookies;
- Zod validation at API and mutation boundaries;
- same-origin enforcement for first-party analytics;
- sanitized error responses;
- no committed credentials;
- environment-based secrets;
- security headers and CSP support;
- no secrets in structured logs.

The repository should never contain real production credentials.

---

## Project structure

A simplified view:

```text
src/
├── app/
│   ├── (public)/
│   ├── admin/
│   └── api/
│       ├── admin/
│       ├── analytics/
│       └── health/
├── components/
│   ├── admin/
│   ├── analytics/
│   ├── layout/
│   ├── public/
│   ├── system/
│   └── ui/
├── config/
├── db/
│   └── schema.ts
└── lib/
    ├── analytics/
    ├── auth/
    ├── public/
    └── system/

drizzle/
scripts/
tests/
├── e2e/
└── unit/

docs/
.github/workflows/
```

---

## Local development

### Prerequisites

Install:

- Node.js
- npm
- PostgreSQL

Create a local PostgreSQL database before starting the application.

---

### 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-directory>
```

---

### 2. Install dependencies

```bash
npm ci
```

For normal local development after the initial install, `npm install` is also acceptable when dependency changes are intentional.

---

### 3. Configure environment variables

Copy the example file:

```bash
cp .env.example .env.local
```

On PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Populate the required local values.

At minimum the application requires a PostgreSQL connection string.

Never commit `.env.local`.

---

### 4. Apply database migrations

Use the migration command defined by the repository:

```bash
npm run db:migrate
```

Migrations are versioned and should be applied in order.

Do not replace production migrations with ad-hoc schema pushes.

---

### 5. Seed initial content

If the local database is empty:

```bash
npm run db:seed
```

If an admin account has not yet been created, use the repository's admin setup scripts and environment variables rather than committing credentials.

---

### 6. Run the application

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

---

## Quality gates

Before a change is considered ready, run:

```bash
npm run typecheck
npm run lint
npm run test
npm run format:check
npm run build
npm run test:e2e
```

The repository also includes an aggregated quality command:

```bash
npm run quality
```

The quality pipeline is designed to fail at the first broken gate while preserving the underlying command output.

---

## End-to-end testing

Playwright tests cover important system behavior including:

- public routes;
- admin authentication;
- browser runtime errors;
- unknown-route handling;
- health endpoints;
- PostgreSQL readiness;
- analytics request validation;
- cross-origin analytics rejection;
- accessibility checks.

Run:

```bash
npm run test:e2e
```

Or target a specific suite:

```bash
npx playwright test tests/e2e/public-quality.spec.ts --project=chromium --workers=1
```

---

## Accessibility

Public routes are scanned with Axe during Playwright tests.

Serious and critical accessibility violations are treated as test failures rather than informational warnings.

This includes issues such as insufficient color contrast.

The design tokens are therefore part of the tested system rather than purely visual styling.

---

## CI

GitHub Actions runs the repository quality pipeline against PostgreSQL.

The intended CI flow is:

```text
install
   ↓
typecheck
   ↓
lint
   ↓
unit tests
   ↓
format verification
   ↓
production build
   ↓
Playwright / accessibility checks
```

Deployment is intentionally kept separate from quality validation so database mutations and releases are explicit operations.

---

## Environment strategy

Environment configuration follows these rules:

- `.env.local` is local-only;
- secrets are never committed;
- `NEXT_PUBLIC_*` values must be safe for browser exposure;
- preview environments must not accidentally mutate production content;
- production database credentials belong in the deployment platform's secret store.

See `.env.example` for the supported configuration surface.

---

## Database migrations

Schema changes are handled with Drizzle and committed SQL migrations.

The migration history is treated as immutable release history.

General workflow:

```text
schema change
    ↓
generate migration
    ↓
review SQL
    ↓
commit migration
    ↓
CI validation
    ↓
controlled migration during release
```

Application startup should not silently mutate the production schema.

---

## Design principles

### Server-first

Server Components are the default.

Client Components are introduced only when browser state or interaction genuinely requires them.

### No unnecessary infrastructure

The project intentionally avoids introducing systems such as Redis, Kafka, Kubernetes, or GraphQL unless a concrete requirement justifies them.

### No fake production

The portfolio never invents:

- uptime;
- traffic;
- active users;
- benchmark results;
- production scale;
- monitoring data.

### Privacy by default

Personal contact details and the private resume are not published simply because they exist.

### Small, reviewable changes

The project is developed incrementally. New functionality should fit the existing architecture instead of regenerating or replacing unrelated parts of the codebase.

---

## Engineering system map

One of the portfolio's signature elements is a restrained interactive map showing the progression:

```text
Chemical Science
       ↓
Graph ML
       ↓
Backend Systems
       ↓
Infrastructure
```

It connects the portfolio's personal, project, engineering, and system layers rather than treating individual projects as isolated cards.

---

## Development status

Implemented:

- foundation and public routing;
- PostgreSQL + Drizzle data model;
- admin authentication;
- admin CMS;
- publishing workflow;
- revision and audit infrastructure;
- database-backed public content;
- project case-study routes;
- system map;
- health/readiness APIs;
- Inspect System observability;
- privacy-conscious analytics;
- accessibility testing;
- Playwright E2E quality gates;
- sanitized public About / Profile / Contact experience;
- accurate published-content counts in the homepage system panel.

In progress / next:

- production deployment architecture;
- production environment and secret configuration;
- controlled release migrations;
- deployment verification;
- production Lighthouse measurement;
- final hardening.

No deployment, uptime, Lighthouse score, or production-performance claim should be considered verified until it has been measured against the deployed application.

---

## Documentation

Additional implementation notes live under:

```text
docs/
```

These documents cover architecture, database design, authentication, public content, observability, analytics, and quality workflows as the project evolves.

---

## Repository philosophy

This repository is intentionally more than a collection of portfolio pages.

The application itself is part of the portfolio:

> **This isn't just a website showing projects. The website itself is a project.**
