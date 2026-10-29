# Spec: Railway Production Pre-Launch Deployment

| Field              | Value                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------- |
| **Status**         | `Ready for review`                                                                          |
| **Domain**         | `platform`                                                                                  |
| **Spec path**      | `.specs/platform/railway-production-deployment/`                                            |
| **Affected areas** | website, backoffice, CI, container images, Railway infrastructure, deployment documentation |

## Overview

Cafe Debug needs a small but production-grade pre-launch deployment for the public
website and authenticated backoffice. Both apps will run in the existing Railway
production project with the existing API and MySQL, which remain external to this repository’s infrastructure ownership.

## Goals

1. Deploy fixture-backed `web` and authenticated `admin` from `JessicaNathany/cafedebug-ui:main`.
2. Use standalone Next.js containers that bind Railway's injected `PORT` and retain no state.
3. Gate deployment on CI and app-specific readiness checks.
4. Keep admin-to-API traffic private and database credentials out of both frontends.
5. Expose temporary Railway HTTPS domains without changing `cafedebug.com.br`.

## Non-goals

- Replace website fixtures with public API content.
- Change the API, MySQL, database schema, existing API domain, or any Railway volume.
- Migrate DNS, add custom domains, configure CORS, or promise high availability.
- Add App Sleep, arbitrary resource limits, or persistent frontend storage.
- Grant GitHub Actions authority to apply Railway configuration, redeploy services, mutate
  production variables, or access Railway from pull-request workflows.

## CI and production governance

- `Validation Gates` is the only required repository check. It has read-only pull-request
  permissions, cancels superseded pull-request runs only, validates workflow syntax first, and
  exercises both applications plus the website's running production image.
- `Railway IaC Plan` runs only on trusted `main` changes or manual dispatch in the protected
  GitHub `production` environment. It uses the project-scoped `RAILWAY_TOKEN` only to produce
  a redacted, non-destructive plan artifact; it never applies or deploys.
- `Production Smoke` is manual-only in the protected `production` environment and has no
  Railway credential. It verifies public endpoints using protected-environment base-URL
  variables after Railway deployment.
- The repository owner configures the protected environment and the `main` ruleset. These
  settings are intentionally not modified by this repository change.

## Success criteria

| ID    | Criterion                                                                                                                                                                 |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AC-01 | `web` and `admin` are one-replica Railway services in `ams`, sourced from the canonical repository's `main` branch.                                                       |
| AC-02 | Both apps build to minimal standalone images and listen on `0.0.0.0:$PORT`.                                                                                               |
| AC-03 | `/api/health` returns a non-cacheable 2xx for web; admin returns 2xx only when its API readiness probe succeeds.                                                          |
| AC-04 | Admin uses `http://cafedebug-backendapi.railway.internal:8080`, secure host-only cookies, and a no-index policy.                                                          |
| AC-05 | The sole required `application-gate` validates workflow syntax, both apps, the running website image, and the admin production image before Railway autodeploys `main`.   |
| AC-06 | A protected-environment, trusted-main plan creates only a redacted artifact and fails on diagnostics, destructive changes, or deletions.                                  |
| AC-07 | Manual production smoke verifies generated HTTPS URLs, canonical metadata, no-index behavior, and admin-to-API readiness; a human verifies an authorized admin read flow. |

## UI ownership revision

- AC-08: The stable named partial `ui` declares exactly `service.web` and `service.admin`; API, database, volumes, and backend variables are not declared or managed here.
- AC-09: CLI 5.71.0 and SDK 3.16.0 compile the UI configuration; frontend settings remain unchanged except explicit source branch `main`.
- AC-10: Plans fail closed on malformed/unsupported structures, diagnostics, destructive changes, deletions, or any change outside those two services. Safe summaries expose only operation, address, and field names.
- AC-11: Ownership inspection/transfer, configuration apply, and deployments are documented operator steps, excluded from this implementation PR. Live evidence remains pending until authentication is available.
- AC-12: CI verifies the partial graph, validator cases, and secret-safe artifacts. Ownership rollback requires a fresh review rather than restoring whole-project configuration blindly.
