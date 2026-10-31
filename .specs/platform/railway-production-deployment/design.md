# Design: Railway Production Pre-Launch Deployment

| Field      | Value                                                   |
| ---------- | ------------------------------------------------------- |
| **Status** | `Ready for review`                                      |
| **Spec**   | `.specs/platform/railway-production-deployment/spec.md` |

## Architecture

```text
Internet -> web (Railway HTTPS domain)
Internet -> admin (Railway HTTPS domain, application authentication)
admin -> cafedebug-backendapi.railway.internal:8080 -> cafedebugdb
```

The deployed `web` homepage reads public banners and episodes from the API through
`WEB_API_BASE_URL`; remaining fixture-backed features retain their existing behavior.
`admin` keeps browser traffic same-origin and sends
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

- `.railway/railway.ts` exports the named partial `ui` and declares only `web` and `admin`. API, MySQL, volumes, and backend variables remain external. CLI 5.71.0 / SDK 3.16.0 support the ownership boundary.
- `web` receives its generated Railway public domain as `NEXT_PUBLIC_SITE_URL` at build
  time, and `WEB_API_BASE_URL=https://cafedebug-backendapi-production.up.railway.app`
  for homepage API requests instead of the localhost development fallback.
  Validate the compiled web variable contract with `pnpm ci:iac` before applying.
  `admin` receives only the API's private URL and secure cookie policy.
- Each frontend has one `ams` replica, a 120-second health timeout, 20 seconds of overlap,
  30 seconds of draining, an explicit `ON_FAILURE` restart policy, and App Sleep disabled.
- IaC selects each service-specific Dockerfile and narrow watch paths while retaining the
  monorepo root as build context.
- The website Dockerfile declares `NEXT_PUBLIC_SITE_URL` as a build argument so Railway's
  generated HTTPS domain is available when Next.js produces canonical metadata and its sitemap.

## Delivery and rollback

GitHub has three deliberately separate workflow responsibilities:

1. `Validation Gates` runs on pull requests and `main`. Its single `application-gate` performs
   actionlint before dependency setup, validates both applications, runs the website standalone
   container with a CI-only canonical URL, and builds the admin production image. Its concurrency
   cancels superseded pull-request validation only; an in-progress `main` validation is retained
   for Railway Wait for CI.
2. `Railway IaC Plan` runs only for selected trusted `main` changes or manual dispatch. In the
   protected GitHub `production` environment it verifies the project token targets the fixed
   Railway project and production environment, then uses the token's scope directly to write
   `railway-plan.raw.json`, redacts it to the 14-day artifact, and rejects diagnostics,
   destructive changes, and every deletion. It has no `apply`, deployment, or mutation command.
3. `Production Smoke` is manual-only in the same protected environment. It has no Railway token
   and reads `WEB_BASE_URL`, `ADMIN_BASE_URL`, and `API_PUBLIC_BASE_URL` environment variables.
   It retries bounded public health and SEO checks. An admin 200 from `/api/health` is the
   automated evidence of its private API readiness dependency; login and read-only content checks
   remain human release acceptance.

The repository owner must configure the protected GitHub `production` environment (only `main`,
required reviewer Jessica, project-scoped `RAILWAY_TOKEN`, and the three post-domain URL
variables) and a `protect-main` ruleset. The ruleset requires pull requests, one current
approval, resolved conversations, an up-to-date branch, and `application-gate`, while blocking
force pushes, deletion, and bypass actors. Pull-request workflows remain `pull_request` with
read-only permissions; `pull_request_target` is prohibited.

Railway check suites must be enabled for each service. Failed health checks keep the previous
deployment active. A frontend rollback selects its own previous successful deployment; the API,
database, schema, and volumes are never rollback targets here.

## UI ownership migration

Inspect `railway config partials list --json` before applying. Unowned/absent frontends are claimed on first UI apply; transfer already-owned frontends only after a dry-run and etag check. Update previous authoring files before any later apply. Never transfer backend resources. Re-plan after ownership changes. The plan validator accepts only safe frontend create/update and variable-set operations and emits allowlisted review metadata. No ownership changes or apply occur in CI or this implementation PR.
