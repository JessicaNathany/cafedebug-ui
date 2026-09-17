# Tasks: Railway Production Pre-Launch Deployment

| Field      | Value                                                     |
| ---------- | --------------------------------------------------------- |
| **Status** | `In progress`                                             |
| **Spec**   | `.specs/platform/railway-production-deployment/spec.md`   |
| **Design** | `.specs/platform/railway-production-deployment/design.md` |

## 1. Repository and application changes

- [x] Add this spec, design, and workflow state; supersede the historical admin-only CI contract.
- [x] Add standalone Next.js configuration, production Dockerfiles, a build-context ignore file, and root image-build scripts.
- [x] Add thin health routes with tested feature-server handlers and a no-index admin policy.
- [x] Extend CI to validate both deployable applications and production images.
- [x] Document Railway as the production pre-launch target in both READMEs.

## 2. Railway configuration

- [x] Upgrade the Railway CLI and import the existing project into IaC without exposing production values.
- [x] Verify the imported state produces a zero-change plan before adding frontend resources.
- [ ] Confirm the frontend IaC plan adds only `web` and `admin`, then apply it.
- [ ] Generate Railway HTTPS domains, configure watch paths, and re-import the resulting state.
- [ ] Confirm check suites / Wait for CI and the default `ON_FAILURE` restart policy for both services.

## 3. Validation and acceptance

- [ ] Run focused health tests, application validation, and production Docker runtime checks.
- [ ] Push the reviewed canonical `main` commit, observe both Railway deployments, and verify their health endpoints.
- [ ] Verify website canonical metadata and sitemap, admin no-index behavior, private API readiness, and an authorized admin read operation.
- [ ] Record deployed commit IDs, service IDs, domains, and rollback evidence in `workflow-state.md`.
