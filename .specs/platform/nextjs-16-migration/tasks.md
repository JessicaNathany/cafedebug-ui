# Tasks: Next.js 16 Migration

| Field | Value |
|---|---|
| **Status** | `Implemented` |
| **Spec** | `.specs/platform/nextjs-16-migration/spec.md` |
| **Design** | `.specs/platform/nextjs-16-migration/design.md` |
| **Execution order** | Phases must be completed in sequence — each phase validates before the next begins |

---

## Execution Rules

- Each task specifies: **file**, **change type**, **validation step**
- Do NOT begin a phase until all tasks in the previous phase are validated
- All implementation must follow `.github/copilot-instructions.md` architecture rules

---

## Phase 1 — Dependency Upgrades

> **Goal:** Bump all Next.js 16 related dependencies and tighten the engine constraint.

### Task 1.1 — Upgrade admin dependencies

| Field | Value |
|---|---|
| **File** | `apps/admin/package.json` |
| **Change type** | Modification |

**Steps:**
1. Change `"next"` from `"^15.3.3"` to `"^16.2.3"`
2. Change `"@next/eslint-plugin-next"` from `"^15.5.14"` to `"^16.2.3"`
3. Change `"@sentry/nextjs"` from `"^9.47.1"` to `"^10.48.0"`

### Task 1.2 — Tighten root engine constraint

| Field | Value |
|---|---|
| **File** | `package.json` (root) |
| **Change type** | Modification |

**Steps:**
1. Change `engines.node` from `">=20.0.0"` to `">=20.9.0"`

### Task 1.3 — Regenerate lockfile

| Field | Value |
|---|---|
| **Change type** | Regeneration |

**Steps:**
1. Run `pnpm install` from the repository root

**Validation:**
- `pnpm install` exits with code 0
- Lockfile resolves `next` to 16.x
- Lockfile resolves `@sentry/nextjs` to 10.x

### Task 1.4 — Validation gate

**Steps:**
1. Run `pnpm --filter @cafedebug/admin lint`
2. Run `pnpm --filter @cafedebug/admin typecheck`
3. Run `pnpm --filter @cafedebug/admin build`

**Pass criteria:** All three commands exit with code 0.

---

## Phase 2 — Middleware to Proxy Migration

> **Goal:** Rename middleware.ts to proxy.ts and update the export signature.
> Depends on Phase 1 passing validation.

### Task 2.1 — Rename and re-export

| Field | Value |
|---|---|
| **File** | `apps/admin/src/middleware.ts` → `apps/admin/src/proxy.ts` |
| **Change type** | Rename + modification |

**Steps:**
1. Rename `apps/admin/src/middleware.ts` to `apps/admin/src/proxy.ts`
2. Change `export async function middleware(request: NextRequest)` to `export default async function proxy(request: NextRequest)`
3. Keep all logic, imports, types, and `config.matcher` unchanged

### Task 2.2 — Update observability event names

| Field | Value |
|---|---|
| **File** | `apps/admin/src/lib/observability/events.ts` |
| **Change type** | Modification |

**Steps:**
1. Rename `middlewareSessionRedirect` key to `proxySessionRedirect`
2. Change its value from `"middleware.session.redirect"` to `"proxy.session.redirect"`
3. Rename `middlewareSessionValidationError` key to `proxySessionValidationError`
4. Change its value from `"middleware.session.validation_error"` to `"proxy.session.validation_error"`

### Task 2.3 — Update event references in proxy.ts

| Field | Value |
|---|---|
| **File** | `apps/admin/src/proxy.ts` |
| **Change type** | Modification |

**Steps:**
1. Replace all `observabilityEvents.middlewareSessionRedirect` with `observabilityEvents.proxySessionRedirect`
2. Replace all `observabilityEvents.middlewareSessionValidationError` with `observabilityEvents.proxySessionValidationError`
3. Update `module: "middleware"` log fields to `module: "proxy"`

### Task 2.4 — Validation gate

**Steps:**
1. Run `pnpm --filter @cafedebug/admin lint`
2. Run `pnpm --filter @cafedebug/admin typecheck`
3. Run `pnpm --filter @cafedebug/admin build`
4. Run `pnpm --filter @cafedebug/admin test`

**Pass criteria:** All four commands exit with code 0.

---

## Phase 3 — Full Validation

> **Goal:** Run the complete validation gate to confirm nothing is broken.

### Task 3.1 — Root validation

**Steps:**
1. Run `pnpm ci:validation`

**Pass criteria:** Exits with code 0.

---

## Phase 4 — Documentation

> **Goal:** Update spec index and mark migration as implemented.

### Task 4.1 — Update spec index

| Field | Value |
|---|---|
| **File** | `.specs/README.md` |
| **Change type** | Addition |

**Steps:**
1. Add a `platform` section to the Spec Index table
2. Add row: `| Next.js 16 Migration | Implemented | .specs/platform/nextjs-16-migration/ | Framework upgrade from Next.js 15 to 16 with middleware-to-proxy migration |`

### Task 4.2 — Mark spec as Implemented

| Field | Value |
|---|---|
| **Files** | `spec.md`, `design.md`, `tasks.md` in `.specs/platform/nextjs-16-migration/` |
| **Change type** | Status update |

**Steps:**
1. Change Status from `In Progress` to `Implemented` in all three files

---

## Phase Summary

| Phase | Focus | Risk Level | Depends On |
|---|---|---|---|
| 1 | Dependency upgrades + lockfile | Medium | — |
| 2 | Middleware → Proxy migration | Low | Phase 1 |
| 3 | Full validation | Low | Phase 2 |
| 4 | Documentation | Trivial | Phase 3 |
