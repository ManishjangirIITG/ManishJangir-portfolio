# Signature system

Phase 6 makes the portfolio itself inspectable without pretending to be a monitoring product.

## Engineering System Map

The homepage map connects four resume-supported stages: Chemical Science, Graph ML, Backend Systems, and Infrastructure. Interaction is deliberately restrained: selecting a stage changes its explanation, with no decorative animation dependency.

## Inspect System

The public runtime panel exposes only safe values:

- application version from `package.json`
- a seven-character Git revision when the deployment environment provides one
- runtime environment
- `/api/health` liveness
- `/api/health/ready` database readiness
- Web Vitals reported by the current visitor's browser session

It does not expose environment variables, database details, host information, traffic, user counts, historical uptime, or invented aggregate performance metrics.

## Health semantics

`GET /api/health` proves the web process can respond. It deliberately does not depend on PostgreSQL.

`GET /api/health/ready` verifies the database with a bounded `SELECT 1`. It returns HTTP 503 with a generic public response when PostgreSQL is unavailable. Detailed connection errors are not returned to the client.

Both endpoints send `Cache-Control: no-store`.

## Git revision

The runtime checks `VERCEL_GIT_COMMIT_SHA`, then `GIT_SHA`, then `GITHUB_SHA`. Only a hexadecimal commit-like value is accepted and only the first seven characters are exposed. Local development therefore normally displays `local / unavailable`.
