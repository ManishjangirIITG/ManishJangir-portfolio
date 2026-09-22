# Analytics

Phase 7 adds a small first-party analytics abstraction for portfolio product signals.

## Privacy model

Stored events contain only an allow-listed event type, a relative site path, an optional project slug, and a server timestamp. The application does not store IP addresses, cookies, persistent visitor/session IDs, referrers, query strings, user-agent strings, screen fingerprints, or arbitrary client metadata. Browser-side collection also opts out when Global Privacy Control or `Do Not Track: 1` is present.

## Events

- `page_view`: public route view.
- `project_view`: project case-study view, with the published project slug.
- `resume_download`: reserved for the real resume-download control. It is intentionally not emitted until a downloadable resume asset is wired to the public resume route.

## Collection

`PageViewTracker` observes App Router pathname changes. `ProjectViewTracker` emits the project-specific signal. Both call the replaceable `trackEvent()` client abstraction, which prefers `sendBeacon` and falls back to a same-origin keepalive request.

`POST /api/analytics/events` validates a strict Zod contract and writes to `analytics_events`. Invalid or cross-origin requests are rejected. Analytics failures never block navigation or page rendering.

## Admin view

`/admin/analytics` is server-authorized and shows aggregate event totals plus project-view counts. It intentionally does not provide visitor-level inspection because no visitor identity is collected.

## Database

Migration `0006_privacy_analytics.sql` creates a narrow relational event table and indexes for time/event/project aggregation. No JSON metadata blob is stored.
