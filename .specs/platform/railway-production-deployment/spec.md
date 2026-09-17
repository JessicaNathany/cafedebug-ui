# Spec: Railway Production Pre-Launch Deployment

| Field              | Value                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------- |
| **Status**         | `In progress`                                                                               |
| **Domain**         | `platform`                                                                                  |
| **Spec path**      | `.specs/platform/railway-production-deployment/`                                            |
| **Affected areas** | website, backoffice, CI, container images, Railway infrastructure, deployment documentation |

## Overview

Cafe Debug needs a small but production-grade pre-launch deployment for the public
website and authenticated backoffice. Both apps will run in the existing Railway
production project with the existing API and MySQL, which are explicitly preserved.

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

## Success criteria

| ID    | Criterion                                                                                                                            |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------ |
| AC-01 | `web` and `admin` are one-replica Railway services in `ams`, sourced from the canonical repository's `main` branch.                  |
| AC-02 | Both apps build to minimal standalone images and listen on `0.0.0.0:$PORT`.                                                          |
| AC-03 | `/api/health` returns a non-cacheable 2xx for web; admin returns 2xx only when its API readiness probe succeeds.                     |
| AC-04 | Admin uses `http://cafedebug-backendapi.railway.internal:8080`, secure host-only cookies, and a no-index policy.                     |
| AC-05 | CI validates both apps and both production images before Railway autodeploys `main`.                                                 |
| AC-06 | Railway IaC planning shows only the intended frontend additions and never deletes preserved production state.                        |
| AC-07 | Generated HTTPS domains, canonical metadata, no-index behavior, internal readiness, and one authorized admin read flow are verified. |
