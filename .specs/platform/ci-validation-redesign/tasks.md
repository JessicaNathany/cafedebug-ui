# Tasks: GitHub Actions CI Validation Redesign

| Field | Value |
|---|---|
| **Status** | `Implemented` |
| **Spec** | `.specs/platform/ci-validation-redesign/spec.md` |
| **Design** | `.specs/platform/ci-validation-redesign/design.md` |
| **Execution order** | Complete each phase in sequence and validate before moving forward |

---

## 1. Setup phase

### Task 1.1 — Confirm the approved CI contract

| Field | Value |
|---|---|
| **Files to inspect** | `.github/workflows/validation-gates.yml`, `package.json`, `apps/admin/package.json`, `.specs/platform/ci-validation-redesign/spec.md`, `.specs/platform/ci-validation-redesign/design.md` |
| **Change type** | Validation only |

**Steps**

1. Confirm the workflow stays in `.github/workflows/validation-gates.yml`.
2. Confirm the validation scope is only `@cafedebug/admin`.
3. Confirm the workflow contract is exactly one job.
4. Confirm the job sequence is exactly:
   1. build
   2. test
   3. validate
5. Confirm `validate` means lint plus typecheck.

**Validation**

- No implementation begins until the single-job, admin-only contract is reflected consistently across spec, design, and tasks.

### Task 1.2 — Mark the spec lifecycle state correctly

| Field | Value |
|---|---|
| **Files** | `.specs/platform/ci-validation-redesign/spec.md`, `.specs/platform/ci-validation-redesign/design.md`, `.specs/platform/ci-validation-redesign/tasks.md`, `.specs/README.md` |
| **Change type** | Modification |

**Steps**

1. Change lifecycle/status fields so the spec no longer claims the redesign is already implemented.
2. Update the spec index entry summary to reflect the new simpler contract.

**Validation**

- The spec set clearly signals that the existing implementation must be revised.

---

## 2. Core feature implementation

### Task 2.1 — Simplify root CI scripts to admin-only helpers

| Field | Value |
|---|---|
| **File** | `package.json` |
| **Change type** | Modification |

**Steps**

1. Remove or stop using root CI scripts that imply `@cafedebug/api-client` validation.
2. Add or keep only admin-focused CI helper scripts needed for local/CI parity.
3. Ensure the root contract supports:
   - admin build
   - admin test
   - admin validate (`lint && typecheck`)
   - aggregate admin validation in build → test → validate order
4. Make `ci:validation` the simple admin-only aggregate command, or introduce an equivalent clearly documented root entry point if naming changes are required.
5. Do not depend on root umbrella commands like `pnpm build`, `pnpm test`, `pnpm lint`, or `pnpm typecheck` for the required CI gate.

**Validation**

- Root CI commands are admin-only.
- Local reproduction of the CI flow is obvious from `package.json`.
- No retained helper script implies api-client scope.

### Task 2.2 — Redesign the workflow into one sequential job

| Field | Value |
|---|---|
| **File** | `.github/workflows/validation-gates.yml` |
| **Change type** | Modification |

**Steps**

1. Keep the workflow name `Validation Gates` unless implementation requires a clearer equivalent.
2. Keep triggers:
   - `pull_request`
   - `push` on `main`
3. Keep or add workflow concurrency only if it does not complicate the single-job design.
4. Replace the current multi-job workflow with exactly one job.
5. In that one job, perform:
   - checkout
   - pnpm setup
   - Node.js 22 setup with pnpm cache
   - `pnpm install --frozen-lockfile`
   - build step for `@cafedebug/admin`
   - test step for `@cafedebug/admin`
   - validate step for `@cafedebug/admin`
6. Ensure the validate step runs lint and typecheck in sequence.
7. Remove all api-client, contract drift, and multi-job-specific logic from the workflow.

**Validation**

- The workflow is syntactically valid YAML.
- Exactly one job exists.
- The job order is build → test → validate.
- No workflow step validates `@cafedebug/api-client`.

---

## 3. UI integration

### Task 3.1 — Align GitHub Checks and branch-protection expectations

| Field | Value |
|---|---|
| **Files** | `.github/workflows/validation-gates.yml`, `README.md` |
| **Change type** | Modification |

**Steps**

1. Ensure the displayed workflow/job naming matches the simpler single-status branch-protection intent.
2. Remove documentation guidance that tells maintainers to require multiple named jobs.
3. Document that the required status is the single admin validation job produced by `validation-gates.yml`.

**Validation**

- A maintainer does not need to infer whether branch protection should require multiple checks.

### Task 3.2 — Update contributor-facing validation documentation

| Field | Value |
|---|---|
| **Files** | `README.md` and any adjacent contributor doc that owns CI guidance |
| **Change type** | Modification |

**Steps**

1. Update the validation section to describe the admin-only CI contract.
2. Document the build → test → validate order.
3. Document that `validate` means lint + typecheck.
4. Remove stale references to api-client validation, generated-client drift checks, and multiple named required jobs.

**Validation**

- A contributor can identify the local admin-only command flow that matches CI.

---

## 4. Validation and testing

### Task 4.1 — Validate each admin CI command locally

| Field | Value |
|---|---|
| **Commands** | admin build command, admin test command, admin validate command, aggregate admin validation command |
| **Change type** | Validation |

**Steps**

1. Run each admin-only root helper independently from repository root.
2. Confirm each command targets only `@cafedebug/admin`.
3. Confirm the validate helper runs lint and typecheck, in that order.

**Validation**

- Each admin helper exits with code 0 on the intended implementation state.

### Task 4.2 — Validate the aggregate local sweep

| Field | Value |
|---|---|
| **Command** | `pnpm ci:validation` or the approved equivalent aggregate command |
| **Change type** | Validation |

**Steps**

1. Run the aggregate command from repository root.
2. Confirm it executes only the approved admin sequence:
   1. build
   2. test
   3. validate

**Validation**

- The aggregate command exits with code 0 and does not run api-client checks.

### Task 4.3 — Validate workflow semantics

| Field | Value |
|---|---|
| **Files/commands** | `.github/workflows/validation-gates.yml`, optional local workflow lint tooling if already available |
| **Change type** | Validation |

**Steps**

1. Review final YAML for trigger correctness and single-job shape.
2. Confirm the job exposes sequential build, test, and validate steps.
3. Confirm the validate step contains lint and typecheck.
4. Confirm no legacy api-client or generated-client checks remain in the required workflow contract.

**Validation**

- Workflow behavior matches the simplified spec exactly.

---

## 5. Polish

### Task 5.1 — Update spec index and lifecycle state after implementation

| Field | Value |
|---|---|
| **Files** | `.specs/README.md`, `.specs/platform/ci-validation-redesign/spec.md`, `.specs/platform/ci-validation-redesign/design.md`, `.specs/platform/ci-validation-redesign/tasks.md` |
| **Change type** | Documentation |

**Steps**

1. Ensure `.specs/README.md` reflects the new admin-only single-job contract while implementation is pending.
2. After implementation is accepted, update the lifecycle state from `Draft` to `Implemented` in the spec set.

**Validation**

- The spec index reflects both the current contract and its implementation state correctly.

### Task 5.2 — Record final branch-protection rollout note

| Field | Value |
|---|---|
| **Files** | `README.md` or the doc chosen in Task 3.2 |
| **Change type** | Documentation |

**Steps**

1. Document the final single required status produced by the validation workflow.
2. Remove any rollout note that still refers to switching from one generic check to many named checks.

**Validation**

- Maintainers have explicit single-status branch-protection guidance.
