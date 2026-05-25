# Tasks: Episode Category Selector

**Status:** Implemented  
**Spec:** `.specs/admin/episode-category-selector/spec.md`  
**Design:** `.specs/admin/episode-category-selector/design.md`  
**Assigned to:** Frontend Blacksmith

---

## Prerequisites

- [ ] Spec reviewed and approved by Architect Guardian
- [ ] Design reviewed and approved by Architect Guardian
- [ ] Scope confirmed: `features/categories/` domain + thin proxy route + `episode-editor-form.tsx` select block only
- [ ] No changes to `episodeEditorSchema`, `toEpisodeRequestPayload`, or `toEpisodeEditorDefaults`

---

## Phase Dependencies

- Phase 1 must finish before Phase 2 (hook depends on service).
- Phase 2 must finish before Phase 3 (form integration depends on hook).
- Phase 4 depends on all previous phases being complete.
- Phase 5 depends on all validation checks passing.

---

## Phase 1 — Categories Domain Foundation

### Task 1.1 — Create `CategoryRecord` type

- [ ] **Task:** Define the category type
  - **File:** `apps/admin/src/features/categories/types/category.types.ts`
  - **Expected result:** Exports `CategoryRecord { id: number; name: string }`
  - **Layer:** type
  - **Note:** Minimal type — only the fields used by the selector.

### Task 1.2 — Create categories service

- [ ] **Task:** Implement fetch and parser for the categories list
  - **File:** `apps/admin/src/features/categories/services/categories.service.ts`
  - **Expected result:**
    - Exports `categoriesQueryKeys.all`
    - Exports `fetchCategoriesList(): Promise<CategoryRecord[]>`
    - Fetches `GET /api/admin/categories?page=1&pageSize=100` via `fetchProtectedAdminRoute`
    - Parses response envelope (`data.items`) into `CategoryRecord[]`
    - Filters out entries missing `id` (integer) or `name` (non-empty string)
    - Returns `[]` on parse failure — never throws for empty/malformed data
    - Throws `AdminRouteError` on HTTP error (consistent with `episodes.service.ts`)
  - **Layer:** service
  - **Reference:** `apps/admin/src/features/episodes/services/episodes.service.ts`

### Task 1.3 — Create categories server handler

- [ ] **Task:** Implement proxy handler for the categories list route
  - **File:** `apps/admin/src/features/categories/server/categories-list.handler.ts`
  - **Expected result:**
    - Exports `categoriesListHandler(request: Request): Promise<Response>`
    - Reads auth session and proxies request to backend `GET /api/v1/admin/categories`
    - Passes through all query params
    - Returns backend response envelope as-is
  - **Layer:** server
  - **Reference:** `apps/admin/src/features/episodes/server/episodes-list.handler.ts`

### Task 1.4 — Create NextJS proxy route

- [ ] **Task:** Add thin GET route for categories
  - **File:** `apps/admin/src/app/api/admin/categories/route.ts`
  - **Expected result:**
    - Exports `GET(request: Request)` that delegates to `categoriesListHandler(request)`
    - No logic beyond delegation
  - **Layer:** route
  - **Reference:** `apps/admin/src/app/api/admin/episodes/route.ts`

---

## Phase 2 — Query Hook

### Task 2.1 — Create `useCategories` hook

- [ ] **Task:** Implement TanStack Query hook
  - **File:** `apps/admin/src/features/categories/hooks/use-categories.ts`
  - **Expected result:**
    - Exports `useCategories()` returning `{ data: CategoryRecord[]; isLoading: boolean; isError: boolean; ... }`
    - Uses `categoriesQueryKeys.all` as query key
    - Uses `fetchCategoriesList` as query function
    - Sets `staleTime: 5 * 60 * 1000` (5 min — categories change rarely)
  - **Layer:** hook
  - **Reference:** `apps/admin/src/features/episodes/hooks/use-episode-by-id.ts`

---

## Phase 3 — Form Integration

### Task 3.1 — Replace hardcoded options in `episode-editor-form.tsx`

- [ ] **Task:** Wire dynamic categories into the category `<select>`
  - **File:** `apps/admin/src/features/episodes/components/episode-editor-form.tsx`
  - **Lines:** 252–276 (the category label + select block)
  - **Expected result:**
    - `useCategories()` is called at the top of `EpisodeEditorForm`
    - `<select>` is `disabled` when `isCategoriesLoading || isCategoriesError`
    - `<select>` renders one `<option key={category.id} value={String(category.id)}>` per `CategoryRecord`
    - Leading placeholder `<option value="">Select a category</option>` is preserved
    - All existing class names (`inputClassName`, `cursor-pointer`, `appearance-none`, `pr-12`) are unchanged
    - `aria-invalid` prop, error message block, and `expand_more` icon span are unchanged
    - No other code in the file changes
  - **Layer:** component

---

## Phase 4 — Validation and Regression

### Task 4.1 — Protect existing payload compatibility

- [ ] **Task:** Verify `categoryId` payload behavior is unaffected
  - **File:** `apps/admin/tests/episodes-editor-payload.test.mjs`
  - **Expected result:** Existing test cases for `categoryId` still pass; `parseOptionalInteger` behavior for `""` → omit and `"2"` → `2` is confirmed
  - **Layer:** service
  - **Note:** Extend with cases if not already covered: submit with value, submit with placeholder.

### Task 4.2 — Route and boundary audit

- [ ] **Task:** Confirm no architectural leakage
  - **Files to inspect:**
    - `apps/admin/src/app/api/admin/categories/route.ts`
    - `apps/admin/src/features/categories/` (all new files)
    - `apps/admin/src/features/episodes/components/episode-editor-form.tsx`
  - **Expected result:** Route is thin; all business logic lives in `features/categories/`; `episode-editor-form.tsx` changes are limited to the select block
  - **Layer:** server + component

---

## Phase 5 — Quality Gates and Documentation

### Task 5.1 — Run admin quality gates

- [ ] **Task:** Run lint, typecheck, tests
  - **Commands:**
    - `pnpm --filter @cafedebug/admin lint`
    - `pnpm --filter @cafedebug/admin typecheck`
    - `pnpm --filter @cafedebug/admin test`
  - **Expected result:** All three pass with no errors
  - **Layer:** validation

### Task 5.2 — Manual smoke test

- [ ] Open `/episodes/new` → category selector is populated from backend; placeholder is default; submitting without a selection omits `categoryId` from payload.
- [ ] Open `/episodes/[id]/edit` (episode with `categoryId` set) → correct option is pre-selected.
- [ ] Open `/episodes/[id]/edit` (episode with `categoryId: null`) → placeholder is shown.
- [ ] Simulate categories API error (network tab) → selector is disabled; form can still be saved/published.
- [ ] Submit with a category selected → `categoryId: <number>` appears in the request payload.

### Task 5.3 — Update spec lifecycle status

- [ ] **Task:** Mark spec artifacts as `Implemented`
  - **Files:**
    - `.specs/admin/episode-category-selector/spec.md` — update `Status` header
    - `.specs/admin/episode-category-selector/design.md` — update `Status` field in header table
    - `.specs/admin/episode-category-selector/tasks.md` — update `Status` header
    - `.specs/README.md` — change `Draft` → `Implemented` for this feature row
  - **Layer:** documentation

---

## Execution Order

1. Task 1.1 — type
2. Task 1.2 — service
3. Task 1.3 — server handler
4. Task 1.4 — proxy route
5. Task 2.1 — hook
6. Task 3.1 — form integration
7. Task 4.1 — payload regression
8. Task 4.2 — boundary audit
9. Task 5.1 — quality gates
10. Task 5.2 — smoke test
11. Task 5.3 — status update

---

## Validation Checklist (Debugger Gate)

### Architecture

- [ ] `features/categories/` exists with `types/`, `services/`, `server/`, `hooks/` sub-folders
- [ ] `app/api/admin/categories/route.ts` is thin — no business logic, only delegation
- [ ] `useCategories()` is called inside `EpisodeEditorForm`, not prop-drilled through `EpisodeEditorPage`
- [ ] No fetch calls in components other than through hooks
- [ ] `features/episodes/` files other than `episode-editor-form.tsx` are unchanged
- [ ] `episodeEditorSchema`, `toEpisodeRequestPayload`, `toEpisodeEditorDefaults` are unchanged

### Behavior

- [ ] Create mode: `categoryId` defaults to `""`, placeholder shown
- [ ] Edit mode with category: matching option pre-selected after `form.reset()`
- [ ] Edit mode without category: placeholder shown
- [ ] `<select>` is `disabled` while categories are loading
- [ ] `<select>` is `disabled` on categories API error
- [ ] `<select>` is enabled with placeholder only when category list is empty
- [ ] Submitting with category set sends `categoryId: <number>` in payload
- [ ] Submitting with placeholder sends no `categoryId` field in payload

### No Regressions

- [ ] All existing episode editor flows (load, invalid-id, fetch-error, submit-error, dirty-state guard) are unaffected
- [ ] Save Draft and Publish flows work for both create and edit modes
- [ ] `episode-editor-form.tsx` class names on the `<select>` are unchanged
- [ ] `aria-invalid`, error message, and icon span in the category field block are unchanged

---

## Definition of Done

- [ ] `features/categories/` domain is scaffolded with type, service, handler, and hook
- [ ] `app/api/admin/categories/route.ts` proxy route exists and delegates correctly
- [ ] Category `<select>` in `episode-editor-form.tsx` shows dynamic backend options
- [ ] Pre-selection works correctly in edit mode; placeholder in create mode and null-category edit
- [ ] `<select>` degrades gracefully (disabled) on load and error states
- [ ] No hardcoded category options remain in the component
- [ ] No visual or layout changes introduced
- [ ] Admin lint, typecheck, and test gates pass
