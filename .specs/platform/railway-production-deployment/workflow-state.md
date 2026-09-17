# Workflow State: Railway Production Pre-Launch Deployment

| Field              | Value                                                        |
| ------------------ | ------------------------------------------------------------ |
| **State**          | `In progress`                                                |
| **Approved input** | User-approved Railway production pre-launch plan             |
| **Branch**         | `codex/railway-production-prelaunch`                         |
| **Baseline**       | `jessica/main` at `648537c28f5a98d6a1111661344931a19bbd08d0` |

## Completed

- Created an isolated worktree; the conflicting source checkout remains untouched.
- Upgraded Railway CLI from `5.49.2` to `5.57.6`.
- Imported `cafedebug-backend.api-railway` production state into `.railway/railway.ts`.
- Detected and corrected an unsafe omitted-variable import before any apply; the restored
  import now plans zero changes for API, database, volumes, and preserved variables.
- Added repository, container, health, CI, and documentation changes described in this spec.

## Required before completion

- A local validation report for both applications and images.
- A non-destructive Railway plan that adds only the two frontend services.
- Canonical repository push, Railway apply/domain configuration, and production smoke evidence.

## Risks and guardrails

- The existing detached `mysql-volume-uzLX` and active `mysql-volume-r-7X` are not targets.
- Do not apply any plan that removes existing resources or preserved API variables.
- One replica is intentional for pre-launch and is not high availability.
- Website fixtures remain the source of production content in this release.
