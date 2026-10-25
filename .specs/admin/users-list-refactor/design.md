# Users List Refactor Design

## Architecture Overview

- `app/(admin)/users/page.tsx` remains a thin route file that renders `UsersListPage` inside `Suspense`.
- `app/api/admin/users/route.ts` stays a thin `GET` delegation route for list loading only.
- `UsersListPage` becomes the feature composition boundary for list state, search state, and navigation state.
- `usersList` owns TanStack Query list fetching.
- `useDebouncedUserSearch` owns client-side input state and the debounced server-side search term.
- Presentational components own search, table, pagination, empty state, error state, and status badge rendering.
- `/users/new` and `/users/[id]/edit` remain route-only navigation surfaces and are outside the editor implementation scope.

## Layer Flow

`app/(admin)/users/page.tsx`
→ `features/users/users-list-page.tsx`
→ `features/users/hooks/use-users-list.ts`
→ `features/users/services/users.service.ts`
→ `app/api/admin/users/route.ts`
→ `features/users/server/users-list.handler.ts`
→ `lib/api/users-admin-api.ts`
→ `@cafedebug/api-client`
→ `GET /api/v1/admin/users`

## Layer Responsibilities

### `app/(admin)/users/page.tsx`

- Render the feature entry point only.
- Hold no business logic or direct fetch behavior.

### `features/users/users-list-page.tsx`

- Compose header, search, loading, empty, error, table, and pagination states.
- Own local page state for `page` and read the initial `search` term from the URL.
- Sync the debounced search term back into the URL.
- Navigate to `/users/new` and `/users/[id]/edit`.
- Emit retry telemetry and list-failure logging.

### `features/users/hooks/use-users-list.ts`

- Wrap the list query in TanStack Query.
- Accept normalized query params including `search`.
- Return loading, fetching, error, and page data states to the page layer.

### `features/users/hooks/use-debounced-user-search.ts`

- Hold the raw search input.
- Debounce the request term by `300ms`.
- Return `searchInput`, `setSearchInput`, and `debouncedSearch`.

### `features/users/services/users.service.ts`

- Call internal admin routes only.
- Normalize route-safe error envelopes before they reach hooks.
- Parse and normalize users list payloads into a UI-safe page contract.

### `features/users/server/users-list.handler.ts`

- Parse query params from the internal route request.
- Call the backend adapter with cookie-auth forwarding.
- Return the standard `{ ok, data, traceId? }` envelope on success and route-safe error envelopes on failure.

### `lib/api/users-admin-api.ts`

- Centralize backend list requests for users.
- Reuse shared backend auth/header normalization utilities.
- Isolate backend contract and transport details from hook and component layers.

## File Structure

```txt
apps/admin/src/
  app/
    (admin)/
      users/
        page.tsx
        new/
          page.tsx
        [id]/
          edit/
            page.tsx
    api/
      admin/
        users/
          route.ts
  features/
    users/
      users-list-page.tsx
      components/
        users-status-badge.tsx
        users-search-bar.tsx
        users-table.tsx
        users-pagination.tsx
        users-empty-state.tsx
        users-error-state.tsx
      hooks/
        use-users-list.ts
        use-debounced-user-search.ts
      server/
        users-error-response.ts
        users-list.handler.ts
      services/
        users.service.ts
      parsers.ts
      defaults.ts
      types/
        users.types.ts
  lib/
    api/
      users-admin-api.ts
```

## Route and Query Design

### Route behavior

- `/users` renders the list feature.
- `/users/new` stays the create navigation target.
- `/users/[id]/edit` stays the edit navigation target.

### Query params

- The browser URL mirrors only `search`.
- The internal route forwards:
  - `search`
  - `page`
  - `pageSize`
  - `sortBy`
  - `descending`
- The list page keeps pagination params in feature state, not in `page.tsx`.

### Suggested defaults

- `page = 1`
- `pageSize = 5`
- `sortBy = "name"`
- `descending = false`
- `search = ""`

## Contract Normalization Strategy

### Backend list contract

- The generated users resource exposes `GET /api/v1/admin/users` and returns `UsersResponsePagedResult`.
- The parser layer must normalize nullable and optional fields so UI code can rely on a stable shape.
- The parser layer must support extracting:
  - `items`
  - `page`
  - `pageSize`
  - `totalCount`
  - `pageCount`
  - `hasPrevious`
  - `hasNext`
  - `sortBy`
  - `descending`

### Users record normalization

- The list uses the exact generated field names where applicable: `gitHubUrl`, `linkedInUrl`, `createdAt`, `updatedAt`, `isActive`.
- Missing names fall back to `Users #{id}` when possible.
- Missing `email` and `podcastRole` normalize to `—` for display safety.
- `isActive` normalizes into a stable boolean.

## API Contract

### Internal admin route

| Route | Method | Purpose |
|---|---|---|
| `/api/admin/users` | `GET` | Load paginated users list for `/users` |

### Backend route

| Route | Method | Purpose |
|---|---|---|
| `/api/v1/admin/users` | `GET` | Fetch paginated team member list |

### Response handling

Success responses must normalize into a stable route-safe page envelope before reaching hooks:

```ts
type UsersPageData = {
  items: UsersListItem[];
  page: number;
  pageSize: number;
  pageCount: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
  sortBy: string;
  descending: boolean;
};
```

Fetch failures must normalize into the same route-safe error envelope shape already used by other admin routes.

## UI Structure

### Header

- Title: `Users`
- Subtitle: users management helper copy only
- Primary CTA: `New User` with `add` icon

### Search

- Full-width search input below the header.
- Leading `search` icon.
- Placeholder: `Search users by name, role or email...`

### Table

- Five columns in this order:
  - `Name`
  - `Email`
  - `Status`
  - `Created`
  - `Updated`
- The list does not render `Photo` or a separate `Actions` column.
- Entire rows remain clickable for edit navigation.

### Footer

- Pagination copy on the left.
- Previous and next icon buttons on the right.

### Empty and Error States

- Empty state without search includes `Create first users`.
- Search-empty state includes only `Clear search`.
- Error state includes retry support and optional trace id.

## Responsive Layout Rules

- Follow the same admin list-page spacing and tone used by Episodes.
- Keep the same table structure in both themes.
- Keep `Users` as the active navigation item in both themes.
- Preserve all columns on smaller screens via horizontal overflow rather than alternate mobile cards.
- Do not use hardcoded colors.

## Telemetry and Error Reporting

- Users list observability follows the existing admin pattern:
  - load failure logging in the page orchestrator
  - route-level logging in `features/users/server`
  - backend normalization in `lib/api`
- Retry actions emit a users list retry event before calling `refetch`.

## Styling Rules

- Use semantic tokens from `packages/design-tokens/styles.css`.
- Reuse the existing admin list visual language rather than copying raw Stitch HTML literally.
- Keep the status badge typography aligned with the existing admin status badge style.
- Render `Active` and `Inactive` in title case while preserving the existing badge visual treatment.