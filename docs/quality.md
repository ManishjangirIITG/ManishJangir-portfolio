# Quality gates

Phase 8 turns quality expectations into executable checks rather than portfolio claims.

## Local gate

Run `npm run quality` before opening a pull request. It executes type checking, linting, unit tests, formatting verification, and a production build. Run `npm run test:e2e` after the build when PostgreSQL is available.

## End-to-end coverage

Playwright covers the public shell, the admin authentication boundary, safe health/readiness endpoints, analytics rejection paths, application 404 behavior, browser-console failures, and serious/critical accessibility violations on all primary public routes.

Accessibility checks use axe-core through `@axe-core/playwright`. The gate intentionally blocks serious and critical violations. Lower-impact findings should still be reviewed rather than treated as proof that the site is fully accessible.

## Production-like CI

CI builds first and then starts `next start` for E2E tests. This prevents the browser suite from validating only the development server. Chromium is explicitly installed in CI.

## Performance

The portfolio retains the Lighthouse 95+ target, but Phase 8 does not invent a score or make timing assertions against GitHub-hosted runners. Lighthouse measurements should be captured against the deployed production artifact in the deployment/hardening phases, where network and runtime conditions can be defined and results can be retained.

## Failure artifacts

On Playwright failures, screenshots are captured, video is retained, and traces are recorded on the first retry. CI uploads the Playwright report and test-results directory to make failures diagnosable without rerunning them locally.
