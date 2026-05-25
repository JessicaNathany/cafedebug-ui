# Episode Category Selector

## Problem

The category `<select>` in the episode editor currently displays four hardcoded options. This means categories cannot be added, renamed, or removed from the backend without a frontend code change. The selector must fetch its options from the real admin categories API.

## Goal

Replace the hardcoded category options with a dynamic list fetched from `GET /api/v1/admin/categories`, wired into the existing React Hook Form `categoryId` field, pre-selected correctly on edit, and defaulted to a placeholder on create or when no category is set.

## Scope

- Add a `features/categories/` domain with:
  - Type: `CategoryRecord { id: number; name: string }`
  - Parser: `parseCategoryList(source: unknown): CategoryRecord[]`
  - Server handler: `features/categories/server/categories-list.handler.ts`
  - Service fetch: `features/categories/services/categories.service.ts`
  - Hook: `features/categories/hooks/use-categories.ts`
- Add a thin proxy route: `app/api/admin/categories/route.ts`
- Update `episode-editor-form.tsx`: replace static `<option>` nodes with dynamic ones from `useCategories()`.
- The `useCategories()` hook is called inside `EpisodeEditorForm` directly (no prop drilling).

## Non-Goals

- No changes to existing visual styles or class names on the `<select>` element.
- No changes to `episodeEditorSchema`, `toEpisodeRequestPayload`, or `toEpisodeEditorDefaults`.
- No pagination — fetch a single page (`pageSize=100`) and render all results.
- No category CRUD management UI.
- No backend schema changes.

## Source Of Truth

- API contract: `.specs/admin/backend-openspec-api.json` — `GET /api/v1/admin/categories`
- Existing episode service pattern: `apps/admin/src/features/episodes/services/episodes.service.ts`
- Existing proxy route pattern: `apps/admin/src/app/api/admin/episodes/route.ts`
- Episode editor form: `apps/admin/src/features/episodes/components/episode-editor-form.tsx`

## API Contract

### Backend endpoint

`GET /api/v1/admin/categories?page=1&pageSize=100`

Expected response envelope (consistent with all admin endpoints):

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

Response fields used:

- `id` (integer) → `<option value="{id}">` — the value submitted in the episode create/update payload
- `name` (string) → `<option>` label displayed to the user

### NextJS proxy route

`GET /api/admin/categories` — thin route delegating to `categoriesListHandler(request)`.

## Component Behavior

### Loading

- While the categories query is in-flight:
  - The `<select>` renders only the placeholder option (`<option value="">Select a category</option>`) and is `disabled`.
- On success:
  - The `<select>` is enabled and populated with one `<option>` per `CategoryRecord` plus the leading placeholder.
- On error:
  - The `<select>` stays `disabled` with only the placeholder.
  - No inline error is shown — the field is optional and the user may submit without a category.
- On empty list (API returns 0 items):
  - The `<select>` is enabled with only the placeholder option.

### Selection

- Default in **create mode**: `categoryId` form value is `""` → placeholder selected.
- Default in **edit mode**:
  - `episode.categoryId` is a number → `categoryId` form value is `String(episode.categoryId)` → the matching `<option>` is pre-selected via the existing `toEpisodeEditorDefaults` transformer and `form.reset()` in `useEpisodeEditor`.
  - `episode.categoryId` is `null` → `categoryId` form value is `""` → placeholder selected.

### Submit

- No changes to the submit path.
- `toEpisodeRequestPayload` already converts `values.categoryId` via `parseOptionalInteger`:
  - `""` → `undefined` (omitted from payload)
  - `"1"` → `1` (included as `categoryId: 1`)

## Edit vs Create Mode

| Scenario | `categoryId` form value | Select state |
|---|---|---|
| Create (new episode) | `""` | Placeholder selected |
| Edit, category set (`categoryId: 2`) | `"2"` | Option with `value="2"` pre-selected |
| Edit, no category (`categoryId: null`) | `""` | Placeholder selected |

Pre-selection works transparently because `useEpisodeEditor` calls `form.reset(toEpisodeEditorDefaults(episode))` when the episode data loads, and React Hook Form re-renders the `<select>` to match the reset value.

## Edge Cases

| Case | Expected Behavior |
|---|---|
| Categories API returns an HTTP error | `<select>` disabled, placeholder only; user may still submit with no category |
| Categories API returns empty `items` array | `<select>` enabled, placeholder only |
| Categories API is slow (loading) | `<select>` disabled until the query resolves |
| `episode.categoryId` references an id absent from the fetched list | Browser treats unmatched value as empty; placeholder shown — no error |
| User selects placeholder and submits | `categoryId: ""` → `parseOptionalInteger("")` → `undefined` → omitted from payload |

## Functional Requirements

1. `GET /api/admin/categories` proxy route exists and forwards the request to the backend categories endpoint.
2. `useCategories()` hook returns `{ data: CategoryRecord[]; isLoading: boolean; isError: boolean }`.
3. The category `<select>` in `episode-editor-form.tsx` is populated from `useCategories().data`.
4. The `<select>` is `disabled` while `isLoading || isError`.
5. On edit mode, the `<select>` pre-selects the option matching `episode.categoryId` once the categories list loads.
6. The form submission payload is unchanged — `categoryId` continues to flow through `toEpisodeRequestPayload`.

## Acceptance Criteria

1. `/episodes/new`: category selector shows dynamic options from the backend; defaults to placeholder.
2. `/episodes/[id]/edit`: category selector pre-selects the saved category when `episode.categoryId` is set; shows placeholder when null.
3. Submitting with a category selected includes `categoryId: <number>` in the API payload.
4. Submitting with the placeholder selected omits `categoryId` from the payload.
5. No hardcoded category options remain in the component source.
6. If the categories API fails, the form remains usable (user can submit without a category).
7. No existing visual style or class name on the `<select>` element is changed.
8. Lint, typecheck, and tests for `@cafedebug/admin` pass.
