# Design: GitHub Actions CI Validation Redesign

| Field | Value |
|---|---|
| **Status** | `Implemented` |
| **Spec** | `.specs/platform/ci-validation-redesign/spec.md` |

---

## 1. Overview

The approved redesign simplifies CI to one admin-only workflow job in `.github/workflows/validation-gates.yml`.

The workflow contract is:

- one workflow file
- one workflow job
- admin scope only
- sequential execution:
  1. build
  2. test
  3. validate

`validate` means:

1. `lint`
2. `typecheck`

This design intentionally replaces the previous multi-job model and removes `@cafedebug/api-client` from required validation.

---

## 2. Architecture decisions

### AD-01 — Keep one workflow file

- **Decision:** retain `.github/workflows/validation-gates.yml`
- **Why:** this is the approved contract and keeps CI discoverable in one place

### AD-02 — Use one workflow job

- **Decision:** define exactly one job in the workflow
- **Why:** simplicity is preferred over granular branch-protection statuses

### AD-03 — Scope validation to `@cafedebug/admin` only

- **Decision:** remove `@cafedebug/api-client` and any other package from required validation
- **Why:** the approved contract explicitly limits scope to the admin app

### AD-04 — Execute ordered sequential steps

- **Decision:** the single job must run `build`, then `test`, then `validate`
- **Why:** the contract is explicit, and step ordering should remain readable in GitHub Actions logs

### AD-05 — Define `validate` as `lint + typecheck`

- **Decision:** implement `validate` as admin lint followed by admin typecheck
- **Why:** this keeps the workflow simple while still making the final gate explicit

### AD-06 — Preserve local/CI parity with simple root helpers

- **Decision:** root scripts should support the same admin-only flow used in CI
- **Why:** contributors should be able to reproduce the sequence locally without reading workflow YAML

### AD-07 — Remove contract-drift behavior from this redesign

- **Decision:** do not keep generated-client drift checks, OpenAPI regeneration checks, or api-client contract gates in this workflow
- **Why:** they are no longer part of the approved CI contract

---

## 3. UI/UX structure

There is no product UI in scope. The relevant experience is GitHub Actions and pull request checks.

### PR Checks presentation

- The Checks list should show one validation job for the workflow.
- The step list within that job should clearly show:
  1. build
  2. test
  3. validate

### Failure messaging

- A failed build step should point to the admin build command.
- A failed test step should point to the admin test command.
- A failed validate step should make it clear whether lint or typecheck failed in the step output.

### Branch-protection UX

- Maintainers should rely on the single workflow job status.
- The old model of requiring multiple named jobs should be removed from branch-protection expectations.

---

## 4. Components

This platform change is composed of the following implementation components:

### 4.1 Workflow component

- **File:** `.github/workflows/validation-gates.yml`
- **Responsibility:** define triggers, optional concurrency, one validation job, and the three sequential admin-only steps

### 4.2 Root command component

- **File:** `package.json`
- **Responsibility:** expose simple admin-only root scripts for local reproduction of build, test, validate, and the aggregate CI flow

### 4.3 Documentation component

- **Files:** `README.md`, `.specs/README.md`, and this spec folder
- **Responsibility:** describe the single-job admin-only CI contract and remove stale references to api-client and multi-job protection

---

## 5. Data flow (UI → hooks → services → server → API)

This is a platform workflow, not an application feature, so the standard app flow does not directly apply. The equivalent execution flow must be:

`GitHub event / PR checks UI → validation-gates workflow → single validation job → root CI script or direct package command → @cafedebug/admin script execution`

Detailed step flow:

`pull_request or push → validation job → admin build command → admin test command → admin validate command → lint then typecheck`

No React hooks, feature services, or server handlers are added in this change.

---

## 6. API contracts (mapping to OpenAPI)

There is no OpenAPI or generated-client contract validation in scope for this redesign.

### Explicit exclusions

- No api-client generation check
- No generated artifact drift check
- No backend contract verification step
- No change to backend OpenAPI files
- No new frontend API route contracts

---

## 7. State management

There is no runtime application state management in scope.

Operational state in scope:

- GitHub Actions job status (`queued`, `in_progress`, `success`, `failure`)
- step-level status for `build`, `test`, and `validate`
- branch-protection required-check configuration maintained in GitHub settings and documented in-repo

The workflow should remain stateless between runs aside from normal dependency caching.

---

## 8. Edge cases

1. **Old multi-job assumptions remain in docs**  
   All references to granular required checks must be removed or replaced.

2. **Validate step becomes ambiguous**  
   The spec must state that `validate` means lint plus typecheck, in that order.

3. **Root scripts still imply api-client scope**  
   Root CI helpers must be revised so the admin-only contract is obvious.

4. **Branch protection still points to old job names**  
   Maintainers must update required checks to the new single-job contract after implementation lands.

5. **Future CI expansion is requested later**  
   That work must be treated as a separate follow-up change, not folded into this simplified redesign.

---

## 9. Accessibility and responsiveness

No end-user UI or responsive layout changes are introduced.

Accessibility-equivalent requirements for this platform change:

- the single job and its step names must be easy to understand in GitHub's Checks UI
- failure output must let contributors identify whether build, test, lint, or typecheck failed without guesswork

---

## Architecture Definition

### File Structure

```text
.github/
  workflows/
    validation-gates.yml

.specs/
  platform/
    ci-validation-redesign/
      spec.md
      design.md
      tasks.md

package.json
README.md
```

### Responsibilities

- **`.github/workflows/validation-gates.yml`**
  - workflow triggers
  - optional concurrency
  - exactly one validation job
  - sequential build, test, validate steps
  - no package scope beyond `@cafedebug/admin`

- **Root `package.json` scripts**
  - stable local entry points for admin-only CI reproduction
  - command composition only
  - no hidden inclusion of `@cafedebug/api-client`, `apps/web`, or placeholder packages

- **README / spec docs**
  - document the single-job contract
  - document `validate = lint + typecheck`
  - document branch-protection expectations at the single-job level

### API Layer

- No `app/api/*` routes are added or changed.
- No application route handlers participate in this platform change.
- The standing architecture rule remains: if future work touches `app/api/*`, route handlers must stay thin and delegate to feature server logic. That is not part of this scope.

### Validation Rules

- No business logic in `app/`
- No fetch in components
- No change to feature-layer responsibilities in `apps/admin` or `apps/web`
- CI required validation must target only `@cafedebug/admin`
- The workflow must expose exactly one job
- The job must run build, test, then validate
- `validate` must run lint and typecheck
- No api-client validation or generated-client drift checks may remain in the required CI contract
