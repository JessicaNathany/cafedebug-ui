# Banner List Refactor

## Problem

The admin `/banners` route still renders a placeholder instead of the real banner listing experience. This breaks the normal post-save navigation from the banner editor and leaves admins without a way to browse, search, and reopen banners already stored in the backend.

## Goal

Implement the banner list so `/banners` matches the approved Stitch list layout in light and dark themes while providing the expected admin flow for loading backend data, searching visible items, paging through results, and navigating to banner creation and editing.

## Scope

- Replace the `/banners` placeholder with a real list experience.
- Keep route files thin and move list behavior into `features/banners`.
- Reuse the same protected admin route flow already used by other top-level admin sections.
- Preserve the existing banner editor routes as the destination for create and edit actions.

## Non-Goals

- Backend schema or API changes.
- Changes to the banner editor fields or submission flow.
- Inline deletion, publish toggles, or reorder controls from the list screen.

## Source Of Truth

- Layout and composition:
  - `.specs/admin/stitch/cafedebug-admin/code/themes/light/banner-list.html`
  - `.specs/admin/stitch/cafedebug-admin/code/themes/dark/banner-list.html`
- Expected visuals:
  - `.specs/admin/stitch/cafedebug-admin/images/themes/light/banner-list.png`
  - `.specs/admin/stitch/cafedebug-admin/images/themes/dark/banner-list.png`
- Theming and tokens:
  - `.specs/admin/DESIGN_SYSTEM.md`
  - `packages/design-tokens/styles.css`

## Field Contract

The banner list must align with the backend banner contract and treat each list field as follows:

| Field | Source | Visible in UI | Rule |
|---|---|---|---|
| `id` | Backend record | No direct column | Required for row identity and row-click navigation to `/banners/[id]/edit`. Missing or invalid ids must prevent edit navigation for that row. |
| `order` | Backend record | Yes | Rendered in the first column. Numeric values display as-is. Missing values render as `—`. |
| `name` | Backend record | Yes | Primary list label. Required for search matching and row identification. Empty values fall back to `Banner #{id}`. |
| `active` | Backend record | Yes | Rendered as a status badge. Because the generated banner contract exposes `active?: string | null`, the list layer must normalize backend values into a UI boolean before rendering `Published` or `Draft`. |
| `startDate` | Backend record | Yes | Rendered in the fourth column as a formatted date-only value. Missing or invalid values render as `—`. |
| `endDate` | Backend record | Yes | Rendered in the fifth column as a formatted date-only value. Missing or invalid values render as `—`. |
| `url`, `urlImage`, `updateDate` | Backend record | No | May exist in the backend response but are not displayed as list columns in this delivery. They may still be preserved in normalized list records if needed for future features. |

## Action Mapping

The banner list actions must map to route behavior as follows:

| UI action | Expected behavior |
|---|---|
| `New Banner` | Navigate to `/banners/new` |
| Row click | Navigate to `/banners/[id]/edit` for that banner |
| Search input | Apply client-side filtering against the currently loaded page |
| Previous page | Request the previous backend page when available |
| Next page | Request the next backend page when available |
| Retry fetch | Re-run the list query for the current page |

## Behavior Rules

### List loading

- Route: `/banners`
- The page must fetch banner list data from the internal admin route before rendering the steady-state table.
- While the request is pending, the UI must show a skeleton aligned to the final five-column table layout.

### Search behavior

- Search input must remain visible above the table.
- Search must filter the currently loaded page client-side with a 300ms debounce.
- Search matching must include at least `name`, normalized status label, and `order`.
- When a search term returns zero visible rows, the page must render an empty state with search-aware messaging and a clear-search action.

### Pagination behavior

- Pagination controls must stay visible only when the table state is rendering.
- The footer copy must show `Showing X to Y of Z banners`.
- Previous and next buttons must disable when the corresponding page does not exist or while a refetch is in progress.

### Row interaction behavior

- The whole row must be clickable and keyboard-focusable through its interactive content.
- Row click must navigate to `/banners/[id]/edit`.
- Rows without a valid id must not attempt navigation.

### Empty state behavior

- If the backend returns zero banners and no search is active, the page must render a create-oriented empty state.
- If search is active and no rows match, the page must render a search-oriented empty state and preserve the active term until the user clears it.

### Error behavior

- Fetch failures must render a dedicated error state with retry support.
- Error states must preserve normalized status, title, detail, and optional trace id for observability.

### Telemetry behavior

- Banner list telemetry must follow the same admin event shape already used by the episodes list and banner editor flows.
- List load failures must emit banner-specific telemetry with:
  - `module: "banners"`
  - `action: "list"`
  - normalized `status`
  - optional `traceId`
- Explicit retry actions must emit a banner list retry event before re-fetching.

## Acceptance Criteria

1. `/banners` no longer renders a placeholder and instead shows the real list flow.
2. The page header, search bar, table, and pagination visually align with the Stitch banner list references in both themes.
3. The list loads backend data through a dedicated `features/banners` list path and thin `app/api` route delegation.
4. Row click opens `/banners/[id]/edit`, and `New Banner` opens `/banners/new`.
5. Loading, empty, search-empty, fetch-error, and populated states all render correctly.
6. The list normalizes backend `active` values before rendering status badges.
