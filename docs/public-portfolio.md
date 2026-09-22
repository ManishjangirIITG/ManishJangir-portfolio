# Phase 5 — Public portfolio

The public application now reads published content from PostgreSQL through `src/lib/public/content.ts`. Draft and archived rows are excluded at the query boundary.

## Routes

- `/` — database-backed featured work, experience, updates, and honest live content counts.
- `/projects` and `/projects/[slug]` — published project index and normalized case-study sections/technologies.
- `/experience` — published experience, including `Present` for current roles.
- `/updates` and `/updates/[slug]` — published update log; empty state is intentional when no real update exists.
- `/sitemap.xml` and `/robots.txt` — generated from public content and app URL.

Project `start_date` and `end_date` were added because the resume contains real project periods. Missing demo/repository URLs and experience location/employment type remain nullable and are omitted from the public UI rather than fabricated.

The homepage system card reports only database-derived content counts. It does not claim uptime, traffic, health, or performance telemetry; those belong to the observability/analytics phases.
