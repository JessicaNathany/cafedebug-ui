# Design: Episode Category Selector

| Field | Value |
|---|---|
| **Status** | `Implemented` |
| **Spec** | `.specs/admin/episode-category-selector/spec.md` |
| **API contract** | `.specs/admin/backend-openspec-api.json` — `GET /api/v1/admin/categories` |
| **Reference patterns** | `apps/admin/src/features/episodes/` (service, hook, proxy route) |

---

## 1. Architecture Scope

This design introduces a new `features/categories/` domain and a NextJS proxy route to replace the hardcoded `<option>` nodes in the episode editor category selector.

Preserved boundaries:

- `app/` routes remain thin and unchanged.
- `useEpisodeEditor` retains full ownership of episode load/reset/mutation/telemetry/navigation.
- `episodeEditorSchema`, `toEpisodeRequestPayload`, and `toEpisodeEditorDefaults` are unchanged.
- `categoryId` stays a `string` in RHF model and is converted to `number | undefined` in the transformer — no contract change.
- No visual or layout changes to the episode editor.

Out of scope:

- Category CRUD UI.
- Backend contract changes.
- Pagination of categories (single-page fetch, `pageSize=100`).
- Prop drilling — `useCategories()` is called directly inside `EpisodeEditorForm`.

---

## 2. Component and File Architecture

### 2.1 File map

| Path | Status | Responsibility | Layer |
|---|---|---|---|
| `apps/admin/src/app/api/admin/categories/route.ts` | New | Thin GET handler — delegates to `categoriesListHandler`. | route |
| `apps/admin/src/features/categories/types/category.types.ts` | New | `CategoryRecord` type definition. | type |
| `apps/admin/src/features/categories/server/categories-list.handler.ts` | New | Proxies `GET /api/admin/categories` to backend `GET /api/v1/admin/categories`. | server |
| `apps/admin/src/features/categories/services/categories.service.ts` | New | Fetches categories list, parses response into `CategoryRecord[]`. | service |
| `apps/admin/src/features/categories/hooks/use-categories.ts` | New | TanStack Query hook returning `{ data, isLoading, isError }`. | hook |
| `apps/admin/src/features/episodes/components/episode-editor-form.tsx` | Changed | Replace hardcoded `<option>` nodes with dynamic options from `useCategories()`. Disable `<select>` during load/error. | component |
| `apps/admin/src/features/episodes/hooks/use-episode-editor.ts` | Unchanged | Episode state orchestration. | hook |
| `apps/admin/src/features/episodes/transformers.ts` | Unchanged | `categoryId` payload shaping. | service |
| `apps/admin/src/features/episodes/schemas/episode.schema.ts` | Unchanged | `categoryId` validation. | schema |

### 2.2 Route boundary

The proxy route at `app/api/admin/categories/route.ts` follows the same delegation pattern as `app/api/admin/episodes/route.ts` — it is thin and contains no business logic.

---

## 3. Type Contract

### `CategoryRecord`

```ts
// apps/admin/src/features/categories/types/category.types.ts

export type CategoryRecord = {
  id: number;
  name: string;
};
```

This is the only type the categories domain exposes publicly. No additional types are needed.

---

## 4. Data Flow

### 4.1 Categories fetch flow

```
EpisodeEditorForm
  └── useCategories()                          [hook]
        └── useQuery({ queryKey, queryFn })
              └── fetchCategoriesList()        [service]
                    └── GET /api/admin/categories?page=1&pageSize=100
                          └── [proxy route]
                                └── GET /api/v1/admin/categories?page=1&pageSize=100 [backend]
```

Response envelope (consistent with all admin endpoints):

```json
{
  "data": {
    "items": [
      { "id": 1, "name": "Design" },
      { "id": 2, "name": "Development" }
    ]
  }
}
```

The service parser extracts `items`, maps each entry to `CategoryRecord`, and filters out malformed entries defensively.

### 4.2 Create mode flow

1. `EpisodeEditorForm` mounts; `useCategories()` fetches.
2. While loading: `<select>` is `disabled`, placeholder only.
3. On success: `<select>` enabled, populated; `categoryId` form value is `""` → placeholder shown.
4. User selects a category → RHF `categoryId` value becomes `"<id>"`.
5. Submit → `toEpisodeRequestPayload` converts `"2"` → `categoryId: 2` in payload.

### 4.3 Edit mode flow

1. `useEpisodeEditor` fetches episode, calls `form.reset(toEpisodeEditorDefaults(episode))`.
2. `toEpisodeEditorDefaults` sets `categoryId: String(episode.categoryId)` or `""` if null.
3. `useCategories()` fetches in parallel (no sequential dependency).
4. Once both resolve, RHF value (`"2"`) matches the loaded option's `value` attribute → browser pre-selects automatically.
5. Edit/submit flow identical to create mode.

### 4.4 State ownership

| State | Owner |
|---|---|
| Categories list, loading, error | `useCategories()` → TanStack Query |
| `categoryId` form value | RHF form (`useEpisodeEditor`) |
| Episode load, reset, mutation, telemetry | `useEpisodeEditor` |
| `<select>` disabled state | `EpisodeEditorForm` (derived from `isLoading \|\| isError`) |

---

## 5. Service Design

### `categories.service.ts`

```ts
// Exports:
export const categoriesQueryKeys = Object.freeze({
  all: ["categories"] as const
});

export const fetchCategoriesList = async (): Promise<CategoryRecord[]>
```

- Uses the same `fetchProtectedAdminRoute` and envelope-parsing pattern as `episodes.service.ts`.
- Requests `page=1&pageSize=100` — a single flat fetch, no pagination state.
- Returns `CategoryRecord[]` (empty array on parse failure — never throws on empty data).
- Throws an `AdminRouteError` on HTTP error (consistent with episode service behavior), which TanStack Query surfaces as `isError`.

### Parser

```ts
// Internal to categories.service.ts
const parseCategoryList = (source: unknown): CategoryRecord[]
```

- Extracts `items` array from the response envelope (same `resolveResultPayload` → `items` path used by `parseEpisodesPageData`).
- Filters each item: must have integer `id` and non-empty string `name`.
- Returns `[]` on any structural mismatch (defensive, never crashes the form).

---

## 6. Hook Design

### `use-categories.ts`

```ts
export const useCategories = () =>
  useQuery({
    queryKey: categoriesQueryKeys.all,
    queryFn: fetchCategoriesList,
    staleTime: 5 * 60 * 1000   // 5 min — categories change rarely
  });
```

Returns the standard TanStack Query shape: `{ data, isLoading, isError, ... }`.

The `staleTime` prevents redundant re-fetches when the editor mounts multiple times within a session (e.g. navigating between episodes).

---

## 7. Server Handler Design

### `categories-list.handler.ts`

```ts
export async function categoriesListHandler(request: Request): Promise<Response>
```

- Reads auth session and forwards the request to `GET /api/v1/admin/categories` with credentials — same proxy pattern as `episodes-list.handler.ts`.
- Passes through query params unchanged.
- Returns the backend response envelope as-is (the service parser handles normalization).

---

## 8. Form Component Changes

Only the category `<select>` block in `episode-editor-form.tsx` changes (lines 252–276).

### Before

```tsx
<select ... {...register("categoryId")}>
  <option value="">Select a category</option>
  <option value="1">1 - Design</option>
  <option value="2">2 - Development</option>
  <option value="3">3 - Product</option>
  <option value="4">4 - Career</option>
</select>
```

### After

```tsx
const { data: categories = [], isLoading: isCategoriesLoading, isError: isCategoriesError } = useCategories();

<select
  disabled={isCategoriesLoading || isCategoriesError}
  {...register("categoryId")}
>
  <option value="">Select a category</option>
  {categories.map((category) => (
    <option key={category.id} value={String(category.id)}>
      {category.name}
    </option>
  ))}
</select>
```

- All existing class names (`inputClassName`, `cursor-pointer`, `appearance-none`, `pr-12`) are preserved.
- The `aria-invalid` prop and error message block are preserved unchanged.
- The `expand_more` icon span is preserved unchanged.
- No other code in the file changes.

---

## 9. Edge Cases and Mitigations

| Case | Design decision |
|---|---|
| Categories API HTTP error | `isError: true` → `<select disabled>` with placeholder. Form remains submittable with no category (field is optional). |
| Empty `items` array | Parser returns `[]` → `categories` is `[]` → only placeholder rendered; `<select>` enabled. |
| Slow API response | `isLoading: true` → `<select disabled>` until resolved. No skeleton or spinner added (non-goal: no visual change). |
| `episode.categoryId` not in fetched list | Browser treats unmatched `value` as empty → placeholder shown. No error, consistent with optional field semantics. |
| Placeholder submitted | `categoryId: ""` → `parseOptionalInteger("")` → `undefined` → `categoryId` omitted from payload. |
| Stale categories in session | `staleTime: 5min` covers normal editing session; background refetch handles longer sessions. |

---

## 10. Acceptance Criteria Mapping

| Spec acceptance | Design mechanism |
|---|---|
| Dynamic options from backend | `useCategories()` hook inside `EpisodeEditorForm` |
| Create mode: placeholder default | `episodeEditorDefaultValues.categoryId = ""` (unchanged) |
| Edit mode: pre-selection | `toEpisodeEditorDefaults` maps `episode.categoryId → String`; RHF `form.reset()` drives `<select>` value |
| Submit includes `categoryId` when set | `toEpisodeRequestPayload` → `parseOptionalInteger` (unchanged) |
| Submit omits `categoryId` when placeholder | Same transformer (unchanged) |
| No hardcoded options | Static `<option>` nodes replaced by `categories.map(...)` |
| Form usable on API error | `disabled` state only; no blocking error, no required validation on `categoryId` |
| No visual changes | Same CSS classes, same surrounding markup |
| Quality gates pass | Only `episode-editor-form.tsx` and new `features/categories/` files touched |

---

## 11. Governance Handoff (Design Phase)

- **Phase:** Design → Ready for Planning
- **What changed:** Defined `features/categories/` domain structure, service/hook/handler contracts, proxy route, and the exact diff in `episode-editor-form.tsx`.
- **Where:** `.specs/admin/episode-category-selector/design.md`
- **No unresolved risks** — scope is narrow, all patterns replicate existing episodes domain.
- **Approval status:** Draft design ready for `tasks.md` phase.
