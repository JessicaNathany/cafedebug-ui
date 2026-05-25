# Spec: GitHub Actions CI Validation Redesign

| Field | Value |
|---|---|
| **Status** | `Implemented` |
| **Domain** | `platform` |
| **Spec path** | `.specs/platform/ci-validation-redesign/` |
| **Affected areas** | `.github/workflows/validation-gates.yml`, root `package.json`, contributor-facing validation docs |

---

## 1. Overview

CafeDebug currently has a CI redesign spec and implementation that split validation across multiple named jobs and also validate `@cafedebug/api-client`. That is no longer the approved contract.

The new approved behavior is intentionally simpler:

- keep one workflow file: `.github/workflows/validation-gates.yml`
- validate only `@cafedebug/admin`
- use one workflow job, not multiple jobs
- run three sequential steps in that job:
  1. build
  2. test
  3. validate
- define `validate` as `lint` + `typecheck`

This spec replaces the previous multi-job, multi-package contract and sets the repository up for a simpler merge gate aligned with the current approval.

Documentation for this platform change must continue to follow the spec-driven workflow in `.specs/README.md`, and any future contributor-facing CI documentation updates should follow the `documentation-writer` skill under `.github/skills/`.

---

## 2. Problem

The existing spec and workflow no longer match the approved CI contract:

1. **Wrong scope**  
   The current contract still includes `@cafedebug/api-client`, which is now out of scope.

2. **Wrong workflow shape**  
   The current contract expects multiple named jobs, but the approved behavior is one job with sequential steps.

3. **Wrong branch-protection model**  
   The previous design optimized for granular required checks. The new direction explicitly prefers simplicity over branch-protection granularity.

4. **Wrong local command expectations**  
   The current root CI helpers and docs imply multiple package-scoped gates instead of one admin-only validation flow.

---

## 3. Goals

1. Keep exactly one validation workflow file at `.github/workflows/validation-gates.yml`.
2. Make CI validation cover only `@cafedebug/admin`.
3. Use exactly one workflow job for the validation contract.
4. Run the job as three sequential steps in this order:
   1. build
   2. test
   3. validate
5. Define `validate` exactly as admin `lint` followed by admin `typecheck`.
6. Preserve `pull_request` and `push` to `main`.
7. Keep local and CI behavior aligned with simple root scripts that mirror the admin-only flow.
8. Update spec and documentation expectations so they no longer imply `api-client`, contract drift checks, or multiple named required jobs.

---

## 4. Non-goals

1. Validating `@cafedebug/api-client` in this workflow.
2. Keeping or replacing the old eight-job contract with a smaller multi-job variant.
3. Introducing generated-client drift checks, OpenAPI regeneration checks, or any API-client-specific CI gate.
4. Splitting validation into multiple workflow files.
5. Adding path filters, affected-only CI, dynamic matrices, or other optimization layers.
6. Adding deployment, release, preview, or publish automation.
7. Requiring branch protection to depend on multiple granular statuses.
8. Expanding scope to `apps/web` or placeholder shared packages.

---

## 5. Users and Use Cases

### Primary users

- **Contributors opening pull requests**
- **Maintainers configuring branch protection**
- **Platform maintainers revising CI later**

### Use cases

1. A contributor opens a PR and sees one validation workflow job for the admin app.
2. A contributor reproduces the same admin-only validation flow locally from the repository root.
3. A maintainer configures branch protection using the single workflow job status instead of many package-specific checks.
4. A future maintainer extends CI later, but only after this simpler admin-only contract is implemented and stabilized.

---

## 6. User Flows

### Flow A — Pull request validation

1. Contributor opens or updates a pull request.
2. GitHub Actions starts `Validation Gates`.
3. The workflow runs one admin validation job.
4. That job runs build, then test, then validate.
5. If any step fails, the job stops and exposes the failing step in sequence.

### Flow B — Local reproduction

1. Contributor sees that the admin validation workflow failed.
2. Contributor runs the matching root command locally.
3. The same build → test → validate sequence runs against `@cafedebug/admin` only.
4. Contributor fixes the issue and pushes an update.

### Flow C — Branch protection

1. Maintainer configures `main` branch protection in GitHub.
2. The required check is the single validation workflow job, not multiple package-scoped job names.
3. Merge is blocked unless the admin validation job passes.

---

## 7. Routes or Screens

This platform change does not introduce application routes in `apps/admin` or `apps/web`.

Operational surfaces in scope:

- GitHub pull request **Checks** list
- GitHub Actions **workflow run summary**
- Repository documentation describing the admin-only validation contract

---

## 8. Success Criteria

| ID | Criterion |
|---|---|
| AC-01 | `.github/workflows/validation-gates.yml` remains the single validation workflow file and keeps `pull_request` plus `push` to `main` triggers |
| AC-02 | The workflow exposes exactly one validation job |
| AC-03 | That one job runs exactly three sequential steps in this order: build, test, validate |
| AC-04 | The job targets only `@cafedebug/admin` |
| AC-05 | The `validate` step runs admin `lint` and admin `typecheck`, and does not include any `api-client` or generated-client checks |
| AC-06 | Root CI helper scripts, if retained, are admin-only and align to the single-job contract |
| AC-07 | Spec and contributor-doc expectations no longer describe multiple named jobs, api-client validation, or generated-client drift checks |
| AC-08 | Branch-protection guidance reflects the simpler single-status workflow contract |
