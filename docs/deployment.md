# Deployment Runbook

This document covers the Phase 9 deployment model for the portfolio.

## Target architecture

```text
GitHub
├── feature / pull-request branches
│   ├── GitHub Actions quality gates
│   └── Vercel Preview deployment
│       └── isolated Preview PostgreSQL / Neon branch
└── main
    ├── quality gates
    ├── controlled production migration
    └── Vercel Production deployment
        └── Production PostgreSQL
```

The application remains a standard Next.js deployment. Database schema mutation is **not**
embedded into `npm run build`.

---

## Why Vercel + Neon

Vercel is the deployment target for the Next.js application.

Neon provides managed PostgreSQL. When the Neon preview integration is used with an existing
Neon account, Vercel can create a database branch for preview deployments so preview CMS,
analytics, and schema work do not mutate production data.

The application still uses the existing `postgres` driver and Drizzle ORM. No database driver
replacement is required for this phase.

---

## Repository changes in Phase 9

### `scripts/verify-deployment.mjs`

Performs post-deployment smoke verification against the real deployment:

- `/api/health` returns safe liveness data;
- `/api/health/ready` confirms PostgreSQL readiness;
- all primary public routes return `200`;
- an unknown public route returns `404`.

Run it with:

```bash
npm run verify:deployment -- https://your-domain.example
```

or:

```bash
DEPLOYMENT_URL=https://your-domain.example npm run verify:deployment
```

PowerShell:

```powershell
$env:DEPLOYMENT_URL="https://your-domain.example"
npm run verify:deployment
```

### `src/lib/system/info.ts`

Vercel executes both Preview and Production deployments with a production-style Next.js runtime.
The public system information therefore uses `VERCEL_ENV` when present so a Preview deployment
is shown as `preview`, not incorrectly as `production`.

Git revision continues to use `VERCEL_GIT_COMMIT_SHA` with existing fallbacks.

---

# First deployment

## 1. Verify the repository locally

Run:

```bash
npm ci
npm run quality
npm run test:e2e
```

Do not start deployment work from a failing main branch.

---

## 2. Create / connect the Vercel project

In Vercel:

1. Add New → Project.
2. Import the GitHub repository.
3. Keep the Next.js framework preset.
4. Keep the repository root as the project root.
5. Keep the default Next.js build command (`npm run build`).
6. Do not add migrations to the build command.

The production branch should be `main`.

---

## 3. Enable Vercel system environment variables

In the Vercel project:

**Settings → Environment Variables**

Ensure system environment variables are exposed.

The application uses:

- `VERCEL_ENV` to distinguish Preview from Production;
- `VERCEL_GIT_COMMIT_SHA` for the safe public revision value.

These values are platform metadata, not application secrets.

---

## 4. Create or connect Neon PostgreSQL

Install the Neon integration from the Vercel Marketplace and connect it to the project.

The required application variable is:

```text
DATABASE_URL
```

Confirm that Vercel has injected a valid `DATABASE_URL` into the environments you intend to use.

Recommended model:

```text
Development  → local PostgreSQL
Preview      → Neon preview branch / isolated preview database
Production   → Neon production branch
```

Do not point Preview deployments at the Production database.

---

## 5. Configure application environment variables

### Production

Set:

```text
DATABASE_URL=<production Neon connection string>
NEXT_PUBLIC_APP_URL=https://<canonical production domain>
NEXT_PUBLIC_APP_NAME=Manish Jangir Portfolio
```

### Preview

Required:

```text
DATABASE_URL=<preview database supplied by Neon integration>
NEXT_PUBLIC_APP_NAME=Manish Jangir Portfolio
```

`NEXT_PUBLIC_APP_URL` may remain the canonical production URL unless a feature specifically
needs generated Preview URLs. This avoids accidentally publishing preview domains as canonical
metadata.

Never put secrets in `NEXT_PUBLIC_*` variables.

---

## 6. Apply the production schema before the first application deployment

The repository already uses committed Drizzle migrations.

Run migrations against the production database explicitly.

One option is to pull / run the Production environment through Vercel CLI:

```bash
vercel link
vercel env run -e production -- npm run db:migrate
```

Alternatively, supply the production `DATABASE_URL` securely in your local shell and run:

```bash
npm run db:migrate
```

Drizzle will apply only migrations that have not already been recorded in its migration log.

Do not use `drizzle-kit push` as the production release mechanism.

---

## 7. Seed the initial portfolio data

For the first production database only:

```bash
vercel env run -e production -- npm run db:seed
```

The seed script is expected to be idempotent, so running it again should not duplicate the
initial content.

---

## 8. Create the production admin account

Generate the password hash locally. Do not store a plaintext admin password in Git.

Use the repository's existing hash / seed workflow.

Example sequence:

```bash
npm run admin:hash -- "your-strong-password"
```

Then make `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, and `DATABASE_URL` available to the seed command
without committing them, and run:

```bash
npm run admin:seed
```

After creation, verify:

- `/admin` redirects unauthenticated users to login;
- the real admin can sign in;
- no admin credential is present in Git history.

---

## 9. Deploy

Push / merge the verified code to the production branch.

Vercel creates a Production deployment from `main`.

For a feature branch or pull request, Vercel creates a Preview deployment.

---

## 10. Verify the real deployment

After the deployment reports Ready:

```bash
npm run verify:deployment -- https://<deployment-domain>
```

Expected:

```text
✓ liveness
✓ readiness
✓ public routes (7)
✓ application 404
✓ deployment verification passed
```

Also manually check:

- the Inspect System revision is the deployed Git SHA;
- the Inspect System environment reads `production` on the live site;
- a Preview deployment reads `preview`;
- the CMS can read production content;
- Preview CMS changes cannot mutate Production.

---

# Preview workflow

For normal content / application changes:

```text
feature branch
    ↓
GitHub Actions
    ↓
Vercel Preview
    ↓
review
    ↓
merge to main
```

For a pull request containing a new database migration, migrate the isolated Preview database
before relying on the Preview application.

Example:

```bash
vercel env run -e preview --git-branch <branch-name> -- npm run db:migrate
```

Do not run a Preview migration against Production.

---

# Future production schema changes

Production schema changes must remain explicit.

Preferred release model:

```text
schema.ts change
    ↓
npm run db:generate
    ↓
review generated SQL
    ↓
commit migration
    ↓
CI
    ↓
apply compatible migration to Production
    ↓
deploy compatible application code
```

For destructive changes use an expand/contract migration:

1. add the new schema in a backwards-compatible migration;
2. deploy code that can work with both old and new schema;
3. migrate / backfill data;
4. deploy code that no longer uses the old schema;
5. remove the old schema in a later migration.

Do not combine destructive schema changes and dependent application changes into one unsafe
release.

---

# Preview protection

Preview deployments can contain unpublished CMS content or work-in-progress features.

Enable Vercel Authentication for Preview deployments under Deployment Protection unless a Preview
must intentionally be shared publicly.

Do not protect the final public production portfolio unless that is explicitly desired.

---

# Rollback model

## Application rollback

Use Vercel's deployment history to restore / promote a previously known-good application
deployment.

## Database rollback

Do not assume application rollback automatically rolls back PostgreSQL.

Database migrations should be designed to be backward-compatible wherever possible. For an
incorrect migration:

- prefer a forward-fix migration;
- restore from Neon recovery / point-in-time tooling only when operationally necessary;
- never edit an already-applied migration file and pretend it is a new database state.

---

# Production verification checklist

Before calling Phase 9 complete:

- [ ] GitHub Actions passes on the deployed commit.
- [ ] Production `DATABASE_URL` points to the production Neon database.
- [ ] Preview deployments do not use production PostgreSQL.
- [ ] All committed Drizzle migrations are applied.
- [ ] Initial public content exists.
- [ ] Production admin authentication works.
- [ ] `/api/health` returns `200`.
- [ ] `/api/health/ready` returns `200`.
- [ ] `npm run verify:deployment -- <url>` passes.
- [ ] Inspect System shows the real Git SHA.
- [ ] Inspect System shows `production` on Production.
- [ ] Inspect System shows `preview` on Preview.
- [ ] No private resume, private email, phone number, `.env.local`, or credential is public.
- [ ] Preview deployment protection is configured.
- [ ] A real production Lighthouse run has been performed before making any Lighthouse-score claim.

---

# Lighthouse

Run Lighthouse only after the production deployment exists.

The project target is 95+ for:

- Performance;
- Accessibility;
- Best Practices;
- SEO.

This is a target, not a claimed result. Record only actual measurements from the deployed site.
