# Design: Railway Production Pre-Launch Deployment

| Field      | Value                                                   |
| ---------- | ------------------------------------------------------- |
| **Status** | `In progress`                                           |
| **Spec**   | `.specs/platform/railway-production-deployment/spec.md` |

## Architecture

```text
Internet -> web (Railway HTTPS domain)
Internet -> admin (Railway HTTPS domain, application authentication)
admin -> cafedebug-backendapi.railway.internal:8080 -> cafedebugdb
```

`web` remains fixture-backed. `admin` keeps browser traffic same-origin and sends
authenticated backend requests from its server layer, so no browser-visible API URL or
database credential is introduced.

## Runtime and health contracts

- Each app uses `output: "standalone"`, a multi-stage Node 22 Alpine image, a non-root
  runtime user, and `HOSTNAME=0.0.0.0` with Railway's `PORT`.
- `GET /api/health` delegates from the thin route file to a feature server handler.
- Website health reports local readiness only. Admin health probes the API's existing
  `/health/ready` with a three-second timeout and returns only `ok` or `unavailable`.
- Both responses are `Cache-Control: no-store`; no health endpoint leaks variables,
  upstream errors, or credentials.
- Admin supplies `robots.txt` disallow-all and metadata `noindex, nofollow`; this limits
  discovery but is not an authorization control.

## Railway model

- `.railway/railway.ts` imports the current API, MySQL, and volumes with `preserve()` for
  production variables, then declares the two frontend services.
- `web` receives its generated Railway public domain as `NEXT_PUBLIC_SITE_URL` at build
  time. `admin` receives only the API's private URL and secure cookie policy.
- Each frontend has one `ams` replica, a 120-second health timeout, 20 seconds of overlap,
  30 seconds of draining, an explicit `ON_FAILURE` restart policy, and App Sleep disabled.
- IaC selects each service-specific Dockerfile and narrow watch paths while retaining the
  monorepo root as build context.
- The website Dockerfile declares `NEXT_PUBLIC_SITE_URL` as a build argument so Railway's
  generated HTTPS domain is available when Next.js produces canonical metadata and its sitemap.

## Delivery and rollback

GitHub `main` validation builds, tests, lints, type-checks, and builds production images
for both apps. Railway check suites must be enabled for each service. Failed health checks
keep the previous deployment active. A frontend rollback selects its own previous successful
deployment; the API, database, schema, and volumes are never rollback targets here.
