# Architecture — Phase 1 Foundation

## Product boundary

The portfolio is a modular Next.js application. It is intentionally not a microservice system. Domain, server, UI, and infrastructure boundaries are established before adding persistence or external services.

## Current runtime

```mermaid
flowchart TD
  Browser --> Next[Next.js App Router]
  Next --> UI[React Server Components]
  Next --> Config[Application Config]
  Next --> Logger[Structured Logger]
```

## Planned runtime

```mermaid
flowchart TD
  User[Browser] --> Edge[CDN / Edge]
  Edge --> App[Next.js Application]
  App --> Domain[Domain Services]
  Domain --> Repo[Repositories]
  Repo --> DB[(PostgreSQL)]
  App --> Storage[S3-compatible Object Storage]
  App --> Auth[Authentication]
  App --> Telemetry[Telemetry / Monitoring]
  App --> Analytics[Analytics Provider]
  GitHub --> CI[GitHub Actions]
  CI --> App
```

## Principles

1. Server Components by default.
2. Client Components only when interaction requires them.
3. No dependency is introduced without a concrete operational purpose.
4. Public content is separated from private administration.
5. The database and CMS arrive before dynamic portfolio content.
6. Telemetry shown publicly must be real or explicitly unavailable.
7. Security boundaries are enforced server-side.
