# Banner List Refactor Tasks

| Field | Value |
|---|---|
| **Status** | `Draft` |
| **Spec** | `.specs/admin/banner-list-refactor/spec.md` |
| **Design** | `.specs/admin/banner-list-refactor/design.md` |

---

## Phase 1 — Spec package

> **Goal:** Define the banner list behavior before implementation starts.

### Task 1.1 — Finalize banner list spec package

| Field | Value |
|---|---|
| **File** | `.specs/admin/banner-list-refactor/spec.md`, `design.md`, `tasks.md` |
| **Layer** | `specs` |
| **Change type** | Addition |

**Steps:**
1. Confirm the Stitch banner list references and banner editor navigation targets.
2. Document list fields, row actions, empty/error states, and pagination behavior.
3. Document the backend list contract mismatch and required normalization strategy.

**Validation:**
- The spec package is implementation-ready and consistent with the existing banner editor spec.

---

## Phase 2 — Feature data contract

> **Goal:** Define route-safe list types, defaults, and parser normalization before wiring UI.

### Task 2.1 — Add banner list types

| Field | Value |
|---|---|
| **File** | `apps/admin/src/features/banners/types/banner.types.ts` |
| **Layer** | `types` |
| **Change type** | Modification |

**Steps:**
1. Add list query param types for page, pageSize, sortBy, and descending.
2. Add normalized list item and paginated list page types.
3. Reuse the existing route-safe error types already used by the banner editor flow.

**Validation:**
- Banner list modules share a stable type contract before services and hooks are added.

### Task 2.2 — Add list defaults

| Field | Value |
|---|---|
| **File** | `apps/admin/src/features/banners/defaults.ts` |
| **Layer** | `defaults` |
| **Change type** | Modification |

**Steps:**
1. Add list default params for initial page state.
2. Keep editor defaults intact.

**Validation:**
- The list page can initialize stable query params without inline literals.

### Task 2.3 — Extend banner parsers for list normalization

| Field | Value |
|---|---|
| **File** | `apps/admin/src/features/banners/parsers.ts` |
| **Layer** | `parsers` |
| **Change type** | Modification |

**Steps:**
1. Add normalization for unknown banner list payloads returned by `GET /api/v1/admin/banners`.
2. Normalize page metadata into a route-safe page shape.
3. Reuse banner record normalization so list rows and editor detail share the same active-value rules.

**Validation:**
- The feature can tolerate the current generated list contract mismatch without leaking raw backend shapes into the UI.

---

## Phase 3 — Server-side backend path

> **Goal:** Build the internal list route before client hooks depend on it.

### Task 3.1 — Extend backend banner API adapter

| Field | Value |
|---|---|
| **File** | `apps/admin/src/lib/api/banners-admin-api.ts` |
| **Layer** | `lib/api` |
| **Change type** | Modification |

**Steps:**
1. Add a list function that accepts normalized query params.
2. Reuse shared backend auth/header normalization utilities.
3. Keep generated contract mismatches isolated from hooks and components.

**Validation:**
- Banner backend list orchestration is centralized in `lib/api`.

### Task 3.2 — Add banner list server handler

| Field | Value |
|---|---|
| **File** | `apps/admin/src/features/banners/server/banners-list.handler.ts` |
| **Layer** | `server` |
| **Change type** | Addition |

**Steps:**
1. Parse list query params from the incoming request.
2. Call the backend adapter with cookie-auth forwarding.
3. Return normalized success and error envelopes with trace ids preserved.

**Validation:**
- `features/banners/server` owns all server-side banner list logic.

### Task 3.3 — Extend the thin internal admin route

| Field | Value |
|---|---|
| **File** | `apps/admin/src/app/api/admin/banners/route.ts` |
| **Layer** | `app/api` |
| **Change type** | Modification |

**Steps:**
1. Add `GET /api/admin/banners` route delegation to the list handler.
2. Keep `POST /api/admin/banners` delegation intact.

**Validation:**
- The route file remains a thin delegation layer only.

---

## Phase 4 — Client services and hooks

> **Goal:** Wire the list page to the internal list route with isolated client orchestration.

### Task 4.1 — Extend banner services for list loading

| Field | Value |
|---|---|
| **File** | `apps/admin/src/features/banners/services/banners.service.ts` |
| **Layer** | `services` |
| **Change type** | Modification |

**Steps:**
1. Add a list fetcher that calls `GET /api/admin/banners`.
2. Normalize route-safe error handling for the hook layer.
3. Parse banner list payloads before returning data to hooks.

**Validation:**
- Hooks and components never call the backend directly.

### Task 4.2 — Add banner list hooks

| Field | Value |
|---|---|
| **File** | `apps/admin/src/features/banners/hooks/use-banners-list.ts`, `use-debounced-banner-search.ts` |
| **Layer** | `hooks` |
| **Change type** | Addition |

**Steps:**
1. Add a TanStack Query hook for list loading.
2. Add a debounced client-side banner search hook.
3. Keep list query and search filtering responsibilities separate.

**Validation:**
- `useBannersList` and `useDebouncedBannerSearch` become the only list-state hooks needed by the page.

---

## Phase 5 — Route page and UI composition

> **Goal:** Replace the placeholder page with the full banner list experience.

### Task 5.1 — Add banner list presentational components

| Field | Value |
|---|---|
| **File** | `apps/admin/src/features/banners/components/banner-status-badge.tsx`, `banners-search-bar.tsx`, `banners-table.tsx`, `banners-pagination.tsx`, `banners-empty-state.tsx`, `banners-error-state.tsx` |
| **Layer** | `components` |
| **Change type** | Addition |

**Steps:**
1. Add the banner-specific status badge component.
2. Add the search bar, table, pagination, empty state, and error state components.
3. Mirror the successful Episodes list decomposition pattern while keeping banner-specific copy and columns.

**Validation:**
- Presentation components stay free of direct fetch and backend logic.

### Task 5.2 — Add `BannersListPage`

| Field | Value |
|---|---|
| **File** | `apps/admin/src/features/banners/banners-list-page.tsx` |
| **Layer** | `feature composition` |
| **Change type** | Addition |

**Steps:**
1. Compose list query state, debounced search, loading, empty, error, and populated table states.
2. Add `New Banner` navigation and row-click edit navigation.
3. Emit retry telemetry and fetch-failure logging using existing admin observability helpers.

**Validation:**
- `BannersListPage` becomes the single composition boundary for the list route.

### Task 5.3 — Replace the placeholder route page

| Field | Value |
|---|---|
| **File** | `apps/admin/src/app/(admin)/banners/page.tsx` |
| **Layer** | `app` |
| **Change type** | Modification |

**Steps:**
1. Replace the placeholder content with `BannersListPage`.
2. Keep the route file free of business logic.

**Validation:**
- `/banners` renders the real feature entry point instead of the placeholder.

---

## Phase 6 — Validation

> **Goal:** Confirm the delivered list behavior is complete and architecture-safe.

### Task 6.1 — Validate runtime behavior

**Checklist:**

- [ ] `/banners` loads backend data successfully through the internal route.
- [ ] `New Banner` navigates to `/banners/new`.
- [ ] Row click navigates to `/banners/[id]/edit`.
- [ ] Search debounce works and filters the visible page.
- [ ] Loading skeleton matches the five-column table layout.
- [ ] Empty state works with and without an active search term.
- [ ] Error state shows normalized title/detail and retry support.
- [ ] Pagination copy and button disabled states are correct.

### Task 6.2 — Validate architecture and styling rules

**Checklist:**

- [ ] No direct `fetch()` calls are added to components or route pages.
- [ ] No hardcoded colors are introduced.
- [ ] Light and dark layouts remain structurally identical.
- [ ] TypeScript remains strict without `any` casts.
- [ ] Existing banner editor routes and flows remain intact.

---

## Phase 7 — Documentation

> **Goal:** Keep the spec index and implementation status aligned after delivery.

### Task 7.1 — Register and maintain documentation

| Field | Value |
|---|---|
| **File** | `.specs/README.md`, `.specs/admin/banner-list-refactor/*` |
| **Layer** | `docs/specs` |
| **Change type** | Modification |

**Steps:**
1. Register the feature in the spec index.
2. Update the spec and tasks status when implementation is complete.
3. Use the documentation-writer skill if implementation changes require broader docs updates.

**Validation:**
- The spec catalog and banner list package reflect the final delivered behavior.
