# Workflow State: Railway Production Pre-Launch Deployment

| Field              | Value                                                        |
| ------------------ | ------------------------------------------------------------ |
| **State**          | `Ready for review`                                           |
| **Approved input** | User-approved Railway production pre-launch plan             |
| **Branch**         | `codex/railway-ui-ownership`                         |
| **Baseline**       | `main` at `f78c412aacdd7f9a9d4bc6ecf2818c296a3d9807` |

## Historical evidence — full-project configuration (superseded)

- Created an isolated worktree; the conflicting source checkout remains untouched.
- Upgraded Railway CLI from `5.49.2` to `5.57.6`.
- Imported `cafedebug-backend.api-railway` production state into `.railway/railway.ts`.
- Detected and corrected an unsafe omitted-variable import before any apply; the restored
  import now plans zero changes for API, database, volumes, and preserved variables.
- Added repository, container, health, CI, and documentation changes described in this spec.
- Hardened the sole required `application-gate`: actionlint runs first, superseded pull-request
  runs are cancelled without cancelling `main`, and the website production image is started and
  checked for health, cache policy, sitemap, and robots behavior.
- Added `Railway IaC Plan`, which can only produce a redacted production plan from trusted `main`
  or manual dispatch; it has no apply, redeploy, or variable-mutation capability.
- Added credential-free, manual `Production Smoke` checks for the deployed web, admin, and API
  contracts, with the admin health result proving its private API readiness dependency.
- Validated locally: actionlint `v1.7.12`, shell and Node script syntax, full `pnpm ci:validation`
  (85 website and 75 backoffice tests), the running website production image, and the backoffice
  production image. Existing admin lint warnings remain warnings only.
- Ran Railway CLI `5.57.6` locally without apply. The plan is safe at this baseline: two creates,
  zero updates, zero deletions, zero diagnostics, and `destructive: false`; the redaction script
  was exercised against that plan.

## Required before completion

- A manually dispatched protected-environment IaC plan artifact that adds only the two frontend
  services and confirms no destructive change.
- Owner-created protected GitHub environment/ruleset, canonical repository push, Railway apply/domain configuration, and production smoke evidence.

## Risks and guardrails

- The existing detached `mysql-volume-uzLX` and active `mysql-volume-r-7X` are not targets.
- Do not apply any plan that removes existing resources or preserved API variables.
- One replica is intentional for pre-launch and is not high availability.
- Website fixtures remain the source of production content in this release.
- The project-scoped `RAILWAY_TOKEN` belongs only to the protected GitHub `production`
  environment and is never present in pull-request or smoke workflows.
- Railway Wait for CI remains the deployment gate; GitHub Actions only validates and observes.

## UI ownership revision — ready for review

Approved input: user-approved UI-only ownership plan. Branch: `codex/railway-ui-ownership`. Earlier whole-project plan evidence is historical and does not validate the new partial. Live planning is pending: Railway login is unauthorized. No production ownership transfer, apply, deployment, or variable mutation is authorized in this PR.

### Implemented and validated

- CLI pin 5.71.0 and SDK 3.16.0; frozen lockfile install passes with only the SDK dependency change.
- `ui` evaluates to exactly `service.web` and `service.admin`; source branch main and existing runtime contracts verified. TypeScript configuration check passes.
- `pnpm ci:iac`: graph check and six plan safety/redaction/CLI tests pass. Graph and tests also run successfully on Node 22.
- actionlint 1.7.12 and `git diff --check` pass. No application code, images or deployment behavior changed; existing full application checks remain in CI.
- Read-only debugger review approved the boundary, supported pinned CLI schema and workflow safeguards; documentation inconsistencies corrected.
- Live CLI 5.71.0 status returns Unauthorized. Ownership inventory, private API reference resolution, remote UI plan, transfer/apply and deployment acceptance remain pending operator evidence.
