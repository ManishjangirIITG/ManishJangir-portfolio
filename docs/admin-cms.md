# Admin CMS

Phase 4 adds authenticated server-rendered CRUD for projects, experience, and updates.

## Security boundary

Every admin page and every mutation calls `requireAdminSession()` on the server. Client-side visibility is never treated as authorization. Inputs are parsed with Zod before database writes.

## Publishing

Content supports `draft`, `published`, and `archived`. Publishing timestamps are set by the mutation layer. Public-site database reads remain a later phase.

## Revisions and audit

Before an existing entity is updated or deleted, its current database row is stored in `content_revisions`. Every mutation is appended to `audit_logs`. Audit rows are not editable from the CMS.

Revision snapshots are operational history, not the primary content model. The normalized content tables remain the source of truth.

## Deliberate boundaries

Phase 4 does not add media/S3, public content rendering, analytics, preview tokens, rich-text dependencies, or revision restoration. Project sections/technology assignment will be expanded with the project case-study experience when the public project system is implemented.

## Ongoing experience

Experience records explicitly store `is_current`. Current roles must have a `NULL` end date; past roles must have an end date, and an end date cannot precede the start date. These invariants are enforced in both server-side Zod validation and PostgreSQL constraints. The admin form disables and clears the end-date input while “I currently work here” is selected.

## Content ordering

Project and experience ordering is system-managed. New records receive the next available `sort_order`; editors do not enter ordering integers manually. `sort_order` is indexed but is not a unique identifier. Updates remain chronological and do not use manual sort ordering.
