# Banner List Refactor Design

## Architecture Overview

- `app/(admin)/banners/page.tsx` remains a thin route file that renders `BannersListPage`.
- `app/api/admin/banners/route.ts` becomes a dual-purpose thin route: `GET` for list loading and `POST` for creation.
- `BannersListPage` becomes the feature composition boundary for list state and view state.
- `useBannersList` owns TanStack Query list fetching.
- `useDebouncedBannerSearch` owns client-side search input and debounced filtering for the current page.
- Presentational components own search, table, pagination, empty state, error state, and status badge rendering.

## Layer Flow

`app/(admin)/banners/page.tsx`
→ `features/banners/banners-list-page.tsx`
→ `features/banners/hooks/use-banners-list.ts`
→ `features/banners/services/banners.service.ts`
→ `app/api/admin/banners/route.ts`
→ `features/banners/server/banners-list.handler.ts`
→ `lib/api/banners-admin-api.ts`
→ `@cafedebug/api-client`
→ `GET /api/v1/admin/banners`

## Layer Responsibilities

### `app/(admin)/banners/page.tsx`

- Render the feature entry point only.
- Hold no business logic or direct fetch behavior.

### `features/banners/banners-list-page.tsx`

- Compose header, search, list states, table, and pagination.
- Own page-level local state such as current page number and current search input.
- Emit retry telemetry and list-failure logging through existing observability helpers.

### `features/banners/hooks/use-banners-list.ts`

- Wrap the list query in TanStack Query.
- Accept normalized query params.
- Return route-safe loading, error, and data states to the page layer.

### `features/banners/hooks/use-debounced-banner-search.ts`

- Debounce the current search input.
- Filter the currently loaded page items without mutating server query params.
- Return `searchInput`, `setSearchInput`, `searchTerm`, and `filteredItems`.

### `features/banners/services/banners.service.ts`

- Call internal admin routes only.
- Normalize route-safe error envelopes before they reach hooks.
- Parse and normalize banner list payloads into UI-safe list page data.

### `features/banners/server/banners-list.handler.ts`

- Parse query params from the internal route request.
- Call the backend adapter with cookie-auth forwarding.
- Return the standard `{ ok, data, traceId? }` envelope on success and route-safe error envelopes on failure.

### `lib/api/banners-admin-api.ts`

- Centralize backend list requests for banners.
- Reuse shared backend auth/header normalization utilities.
- Isolate backend contract mismatches from the hook and component layers.

## File Structure

```txt
apps/admin/src/
  app/
    (admin)/
      banners/
        page.tsx
    api/
      admin/
        banners/
          route.ts
  features/
    banners/
      banners-list-page.tsx
      components/
        banner-status-badge.tsx
        banners-search-bar.tsx
        banners-table.tsx
        banners-pagination.tsx
        banners-empty-state.tsx
        banners-error-state.tsx
      hooks/
        use-banners-list.ts
        use-debounced-banner-search.ts
      server/
        banners-list.handler.ts
      services/
        banners.service.ts
      parsers.ts
      defaults.ts
      types/
        banner.types.ts
```

## Route and Query Design

### Route behavior

- `/banners` renders the list feature.
- `/banners/new` and `/banners/[id]/edit` remain unchanged and are linked from the list.

### Query params

- Internal route uses:
  - `page`
  - `pageSize`
  - `sortBy`
  - `descending`
- The list page keeps these params in feature state, not in `page.tsx`.

### Suggested defaults

- `page = 1`
- `pageSize = 5`
- `sortBy = "order"`
- `descending = false`

If backend behavior proves different at runtime, the parser layer must normalize the response while preserving a stable UI contract.

## Contract Normalization Strategy

### Backend contract mismatch

- The generated admin banners client exposes `GET /api/v1/admin/banners` with paging params, but its generated success body type is `BannerResponse`, which does not model a paginated collection shape.
- The implementation must therefore treat the raw list payload as an unknown contract and normalize it in `parsers.ts`.
- The parser layer must support extracting:
  - list items
  - page
  - pageSize
  - totalCount
  - pageCount
  - hasPrevious
  - hasNext

### Banner record normalization

- `active` must normalize from backend string values to a UI boolean.
- `name`, `order`, `startDate`, and `endDate` must normalize into display-safe values.
- Missing names should fall back to `Banner #{id}`.

## API Contract

### Internal admin route

| Route | Method | Purpose |
|---|---|---|
| `/api/admin/banners` | `GET` | Load paginated banner list for `/banners` |
| `/api/admin/banners` | `POST` | Create banner from editor payload |

### Backend route

| Route | Method | Purpose |
|---|---|---|
| `/api/v1/admin/banners` | `GET` | Fetch paginated banner list |

### Response handling

- Success responses must normalize into a stable route-safe page envelope before reaching hooks:

```ts
type BannersPageData = {
  items: BannerListItem[];
  page: number;
  pageSize: number;
  pageCount: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
};
```

- Fetch failures must normalize into the same route-safe error shape already used by the banner editor and episodes list.

## UI Structure

### Header

- Title: `Banners`
- Subtitle: banner-management helper copy
- Primary CTA: `New Banner` with `add` icon

### Search

- Full-width search input below the header.
- Leading `search` icon.
- Search copy must stay banner-specific.

### Table

- Five columns:
  - `Order`
  - `Name`
  - `Status`
  - `Start Date`
  - `End Date`
- Entire row acts as the edit navigation trigger.

### Footer

- Pagination copy on the left.
- Previous/next icon buttons on the right.

### Empty and Error States

- Reuse the same structural pattern already established in `features/episodes`.
- Empty states must differentiate between no backend data and no search matches.

## Responsive Layout Rules

- Match the existing admin list-page width and spacing used by episodes.
- Keep the list vertically stacked as:
  - header
  - search
  - table
  - pagination
- Preserve the same tonal separation strategy in both themes; do not use hardcoded colors.

## Telemetry and Error Reporting

- Banner list observability follows the existing admin pattern:
  - load failure logging in the page orchestrator
  - route-level logging in `features/banners/server`
  - backend normalization in `lib/api`
- Retry actions emit a banner list retry event before calling `refetch`.

## Styling Rules

- Use semantic tokens from `packages/design-tokens/styles.css`.
- Follow Stitch spacing and grouping without copying raw HTML/CSS literally.
- Keep badge, table, and pagination styles aligned with the Stitch references and the Episodes list patterns.
- Maintain layout parity between light and dark themes.
