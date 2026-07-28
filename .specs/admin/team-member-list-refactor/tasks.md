# Team Members List Refactor Tasks

| Field | Value |
|---|---|
| **Status** | `Implemented` |
| **Spec** | `.specs/admin/team-member-list-refactor/spec.md` |
| **Design** | `.specs/admin/team-member-list-refactor/design.md` |

---

## Phase 1 — Spec package

> **Goal:** Finalize the package so implementation can start without ambiguity.

### Task 1.1 — Correct the spec package

| Field | Value |
|---|---|
| **Files** | `.specs/admin/team-member-list-refactor/spec.md`, `.specs/admin/team-member-list-refactor/design.md`, `.specs/admin/team-member-list-refactor/tasks.md` |
| **Layer** | `specs` |
| **Change type** | Modification |

**Steps:**
1. Align spec and design with the approved final list layout.
2. Replace client-side page filtering with server-side search via `search`.
3. Remove ambiguous `Actions` references and keep row click as the edit interaction.
4. Remove references to nonexistent editor spec artifacts.
5. Keep `tasks.md` as the canonical task file name for this package.

**Validation:**
- The package is implementation-ready and free of route, column, and API-contract ambiguity.

---

## Phase 2 — Feature data contract

> **Goal:** Define route-safe list types, defaults, and parser normalization before wiring UI.

### Task 2.1 — Add team members list types

| Field | Value |
|---|---|
| **File** | `apps/admin/src/features/team-members/types/team-member.types.ts` |
| **Layer** | `types` |
| **Change type** | Addition |

**Steps:**
1. Add query param types for `page`, `pageSize`, `sortBy`, `descending`, and `search`.
2. Add normalized list item and paginated page types.
3. Reuse the shared route-safe error type from `@cafedebug/api-client`.

### Task 2.2 — Add list defaults

| Field | Value |
|---|---|
| **File** | `apps/admin/src/features/team-members/defaults.ts` |
| **Layer** | `defaults` |
| **Change type** | Addition |

**Steps:**
1. Add list default params for initial page state.
2. Keep the defaults free of inline route literals elsewhere in the feature.

### Task 2.3 — Add list normalization

| Field | Value |
|---|---|
| **File** | `apps/admin/src/features/team-members/parsers.ts` |
| **Layer** | `parsers` |
| **Change type** | Addition |

**Steps:**
1. Normalize `TeamMemberResponsePagedResult` into a UI-safe page contract.
2. Normalize each team member row for the final approved columns.

**Validation:**
- The list feature exposes a stable data contract independent from backend nullability.

---

## Phase 3 — Server-side backend path

> **Goal:** Build the internal list route before client hooks depend on it.

### Task 3.1 — Add backend team members API adapter

| Field | Value |
|---|---|
| **File** | `apps/admin/src/lib/api/team-members-admin-api.ts` |
| **Layer** | `lib/api` |
| **Change type** | Addition |

**Steps:**
1. Add a list function that accepts normalized query params.
2. Reuse shared backend auth/header normalization utilities.
3. Keep generated contract details isolated from hooks and components.

### Task 3.2 — Add team members list server handlers

| Field | Value |
|---|---|
| **Files** | `apps/admin/src/features/team-members/server/team-members-list.handler.ts`, `apps/admin/src/features/team-members/server/team-members-error-response.ts` |
| **Layer** | `server` |
| **Change type** | Addition |

**Steps:**
1. Parse list query params from the incoming request.
2. Call the backend adapter with cookie-auth forwarding.
3. Return normalized success and error envelopes with trace ids preserved.

### Task 3.3 — Add the thin internal admin route

| Field | Value |
|---|---|
| **File** | `apps/admin/src/app/api/admin/team-members/route.ts` |
| **Layer** | `app/api` |
| **Change type** | Addition |

**Steps:**
1. Add `GET /api/admin/team-members` route delegation to the list handler.
2. Keep the route file free of business logic.

**Validation:**
- All list server logic lives in `features/team-members/server`.

---

## Phase 4 — Client services and hooks

> **Goal:** Wire the list page to the internal list route with isolated client orchestration.

### Task 4.1 — Add team members service layer

| Field | Value |
|---|---|
| **File** | `apps/admin/src/features/team-members/services/team-members.service.ts` |
| **Layer** | `services` |
| **Change type** | Addition |

**Steps:**
1. Add a list fetcher that calls `GET /api/admin/team-members`.
2. Normalize route-safe error handling for the hook layer.
3. Parse team members list payloads before returning data to hooks.

### Task 4.2 — Add team members hooks

| Field | Value |
|---|---|
| **Files** | `apps/admin/src/features/team-members/hooks/use-team-members-list.ts`, `apps/admin/src/features/team-members/hooks/use-debounced-team-member-search.ts` |
| **Layer** | `hooks` |
| **Change type** | Addition |

**Steps:**
1. Add a TanStack Query hook for list loading.
2. Add a debounced search hook for the server-side `search` term.
3. Keep query loading and search input responsibilities separate.

**Validation:**
- Components and pages never call the backend directly.

---

## Phase 5 — Route page and UI composition

> **Goal:** Replace the placeholder route with the full team members list experience.

### Task 5.1 — Add list presentational components

| Field | Value |
|---|---|
| **Files** | `apps/admin/src/features/team-members/components/team-member-status-badge.tsx`, `apps/admin/src/features/team-members/components/team-members-search-bar.tsx`, `apps/admin/src/features/team-members/components/team-members-table.tsx`, `apps/admin/src/features/team-members/components/team-members-pagination.tsx`, `apps/admin/src/features/team-members/components/team-members-empty-state.tsx`, `apps/admin/src/features/team-members/components/team-members-error-state.tsx` |
| **Layer** | `components` |
| **Change type** | Addition |

**Steps:**
1. Add a team member-specific status badge aligned with existing admin badge styling.
2. Render the approved six-column layout.
3. Support row click plus independent social links.

### Task 5.2 — Add `TeamMembersListPage`

| Field | Value |
|---|---|
| **File** | `apps/admin/src/features/team-members/team-members-list-page.tsx` |
| **Layer** | `feature composition` |
| **Change type** | Addition |

**Steps:**
1. Compose list query state, debounced search, loading, empty, error, and populated table states.
2. Sync `search` to the URL while keeping pagination in feature state.
3. Add create and edit navigation.
4. Emit retry telemetry and fetch-failure logging.

### Task 5.3 — Add route surfaces

| Field | Value |
|---|---|
| **Files** | `apps/admin/src/app/(admin)/team-members/page.tsx`, `apps/admin/src/app/(admin)/team-members/new/page.tsx`, `apps/admin/src/app/(admin)/team-members/[id]/edit/page.tsx`, `apps/admin/src/lib/routes.ts`, `apps/admin/src/lib/routes.js`, `apps/admin/src/features/admin-shell/admin-shell-nav-items.js` |
| **Layer** | `app` |
| **Change type** | Modification + Addition |

**Steps:**
1. Render `TeamMembersListPage` from the `/team-members` route.
2. Keep related create and edit routes addressable.
3. Update admin navigation and route helpers to include Team Members.

**Validation:**
- `/team-members` is reachable from the admin shell and renders the real feature entry point.

---

## Phase 6 — Validation

> **Goal:** Confirm the delivered list behavior is complete and architecture-safe.

### Task 6.1 — Add targeted automated coverage

| Field | Value |
|---|---|
| **File** | `apps/admin/tests/team-members-list-parsers.test.mjs` |
| **Layer** | `tests` |
| **Change type** | Addition |

**Steps:**
1. Add a focused parser normalization test for the team members list payload.
2. Cover fallback values, booleans, social links, and page metadata.

### Task 6.2 — Run objective validation commands

**Commands:**
1. `pnpm --filter @cafedebug/admin exec node --experimental-strip-types --test tests/team-members-list-parsers.test.mjs`
2. `pnpm --filter @cafedebug/admin run test`
3. `pnpm --filter @cafedebug/admin run lint`
4. `pnpm --filter @cafedebug/admin run typecheck`
5. `pnpm --filter @cafedebug/admin run build`

**Checklist:**
- [ ] `/team-members` loads backend data through the internal route.
- [ ] The table renders the correct columns.
- [ ] `Name` and `Email` appear together.
- [ ] `Updated` appears in the table.
- [ ] GitHub and LinkedIn icons render when URLs exist.
- [ ] Search placeholder is `search team members by...`.
- [ ] No UI text references episodes.
- [ ] No direct `fetch()` calls are added to components or route pages.
- [ ] Light and dark layouts remain structurally identical.

---

## Phase 7 — Documentation

> **Goal:** Keep the spec catalog and implementation status aligned after delivery.

### Task 7.1 — Update spec index and package status

| Field | Value |
|---|---|
| **Files** | `.specs/README.md`, `.specs/admin/team-member-list-refactor/*` |
| **Layer** | `docs/specs` |
| **Change type** | Modification |

**Steps:**
1. Ensure the feature is listed in the spec index.
2. Update the package status from `Draft` to `Implemented` once validation passes.
3. Keep wording aligned with the delivered behavior.

**Validation:**
- The spec catalog and package status reflect the delivered list feature.