# Tasks: Railway Production Pre-Launch Deployment

| Field      | Value                                                     |
| ---------- | --------------------------------------------------------- |
| **Status** | `Ready for review`                                        |
| **Spec**   | `.specs/platform/railway-production-deployment/spec.md`   |
| **Design** | `.specs/platform/railway-production-deployment/design.md` |

## 1. Repository and application changes

- [x] Add this spec, design, and workflow state; supersede the historical admin-only CI contract.
- [x] Add standalone Next.js configuration, production Dockerfiles, a build-context ignore file, and root image-build scripts.
- [x] Add thin health routes with tested feature-server handlers and a no-index admin policy.
- [x] Harden `application-gate` with actionlint, pull-request-only cancellation, a running website production-image smoke, and the admin production-image build.
- [x] Add a trusted-main, non-mutating Railway IaC plan workflow with a redacted 14-day artifact and unsafe-plan rejection.
- [x] Add a manual protected-environment production smoke workflow with no deployment credentials.
- [x] Document Railway as the production pre-launch target in both READMEs.

## 2. Railway configuration

- [x] Upgrade the Railway CLI and import the existing project into IaC without exposing production values.
- [x] Verify the imported state produces a zero-change plan before adding frontend resources.
- [ ] Confirm the frontend IaC plan adds only `web` and `admin`, then apply it.
- [ ] Generate Railway HTTPS domains, configure watch paths, and re-import the resulting state.
- [ ] Confirm check suites / Wait for CI and the default `ON_FAILURE` restart policy for both services.
- [ ] Repository owner configures the protected `production` GitHub environment: `main` deployment branch policy, reviewer Jessica, the project-scoped `RAILWAY_TOKEN`, and the three generated public base-URL variables.
- [ ] Repository owner configures the `protect-main` ruleset: pull requests, one current approval, resolved conversations, up-to-date branch, `application-gate`, no force pushes/deletions/bypass actors.

## 3. Validation and acceptance

- [x] Run focused health tests, application validation, website production Docker runtime smoke, workflow linting, and local IaC plan validation.
- [ ] Push the reviewed canonical `main` commit, observe both Railway deployments, and verify their health endpoints.
- [ ] Manually dispatch the IaC plan with the protected token; confirm its redacted artifact has no deletion or destructive change.
- [ ] After Railway domains exist, manually dispatch production smoke; verify website canonical metadata and sitemap, admin no-index behavior, private API readiness, and an authorized admin read operation.
- [ ] Record deployed commit IDs, service IDs, domains, and rollback evidence in `workflow-state.md`.
