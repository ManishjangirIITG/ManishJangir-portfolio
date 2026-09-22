# Initial content seed

The initial content seed bootstraps the CMS from the verified resume before the public site begins consuming database content.

Run after migrations:

```bash
npm run db:seed
```

The seed is intentionally idempotent. Projects are keyed by slug, technologies by slug, project sections by project/order, and the experience entry by organization + role + start date.

The seed publishes the four resume projects and the current EXL experience. It does not create updates because the resume does not provide update/news content. It does not create audit-log or revision entries because this is bootstrap data rather than an administrator-authored CMS mutation.

The resume gives project date ranges, but the current `projects` table has no start/end date columns. Those dates are therefore not fabricated into another field. If project dates are required on the public case-study UI, add explicit project date fields in the public-content phase rather than encoding them into prose.

After the initial bootstrap, normal content maintenance should happen through `/admin`; the seed should not become the routine editing mechanism.
