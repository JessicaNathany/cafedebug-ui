# Team Members List Refactor Design

## Architecture Overview

- `app/(admin)/team-members/page.tsx` remains a thin route file that renders `TeamMembersListPage` inside `Suspense`.
- `app/api/admin/team-members/route.ts` stays a thin `GET` delegation route for list loading only.
- `TeamMembersListPage` becomes the feature composition boundary for list state, search state, and navigation state.
- `useTeamMembersList` owns TanStack Query list fetching.
- `useDebouncedTeamMemberSearch` owns client-side input state and the debounced server-side search term.
- Presentational components own search, table, pagination, empty state, error state, and status badge rendering.
- `/team-members/new` and `/team-members/[id]/edit` remain route-only navigation surfaces and are outside the editor implementation scope.

## Layer Flow

`app/(admin)/team-members/page.tsx`
→ `features/team-members/team-members-list-page.tsx`
→ `features/team-members/hooks/use-team-members-list.ts`
→ `features/team-members/services/team-members.service.ts`
→ `app/api/admin/team-members/route.ts`
→ `features/team-members/server/team-members-list.handler.ts`
→ `lib/api/team-members-admin-api.ts`
→ `@cafedebug/api-client`
→ `GET /api/v1/admin/team-members`

## Layer Responsibilities

### `app/(admin)/team-members/page.tsx`

- Render the feature entry point only.
- Hold no business logic or direct fetch behavior.

### `features/team-members/team-members-list-page.tsx`

- Compose header, search, loading, empty, error, table, and pagination states.
- Own local page state for `page` and read the initial `search` term from the URL.
- Sync the debounced search term back into the URL.
- Navigate to `/team-members/new` and `/team-members/[id]/edit`.
- Emit retry telemetry and list-failure logging.

### `features/team-members/hooks/use-team-members-list.ts`

- Wrap the list query in TanStack Query.
- Accept normalized query params including `search`.
- Return loading, fetching, error, and page data states to the page layer.

### `features/team-members/hooks/use-debounced-team-member-search.ts`

- Hold the raw search input.
- Debounce the request term by `300ms`.
- Return `searchInput`, `setSearchInput`, and `debouncedSearch`.

### `features/team-members/services/team-members.service.ts`

- Call internal admin routes only.
- Normalize route-safe error envelopes before they reach hooks.
- Parse and normalize team member list payloads into a UI-safe page contract.

### `features/team-members/server/team-members-list.handler.ts`

- Parse query params from the internal route request.
- Call the backend adapter with cookie-auth forwarding.
- Return the standard `{ ok, data, traceId? }` envelope on success and route-safe error envelopes on failure.

### `lib/api/team-members-admin-api.ts`

- Centralize backend list requests for team members.
- Reuse shared backend auth/header normalization utilities.
- Isolate backend contract and transport details from hook and component layers.

## File Structure

```txt
apps/admin/src/
  app/
    (admin)/
      team-members/
        page.tsx
        new/
          page.tsx
        [id]/
          edit/
            page.tsx
    api/
      admin/
        team-members/
          route.ts
  features/
    team-members/
      team-members-list-page.tsx
      components/
        team-member-status-badge.tsx
        team-members-search-bar.tsx
        team-members-table.tsx
        team-members-pagination.tsx
        team-members-empty-state.tsx
        team-members-error-state.tsx
      hooks/
        use-team-members-list.ts
        use-debounced-team-member-search.ts
      server/
        team-members-error-response.ts
        team-members-list.handler.ts
      services/
        team-members.service.ts
      parsers.ts
      defaults.ts
      types/
        team-member.types.ts
  lib/
    api/
      team-members-admin-api.ts
```

## Route and Query Design

### Route behavior

- `/team-members` renders the list feature.
- `/team-members/new` stays the create navigation target.
- `/team-members/[id]/edit` stays the edit navigation target.

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

- The generated team members resource exposes `GET /api/v1/admin/team-members` and returns `TeamMemberResponsePagedResult`.
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

### Team member record normalization

- The list uses the exact generated field names where applicable: `gitHubUrl`, `linkedInUrl`, `createdAt`, `updatedAt`, `isActive`.
- `instagramUrl` is intentionally ignored in list normalization for this delivery.
- Missing names fall back to `Team Member #{id}` when possible.
- Missing `email` and `podcastRole` normalize to `—` for display safety.
- `isActive` normalizes into a stable boolean.

## API Contract

### Internal admin route

| Route | Method | Purpose |
|---|---|---|
| `/api/admin/team-members` | `GET` | Load paginated team member list for `/team-members` |

### Backend route

| Route | Method | Purpose |
|---|---|---|
| `/api/v1/admin/team-members` | `GET` | Fetch paginated team member list |

### Response handling

Success responses must normalize into a stable route-safe page envelope before reaching hooks:

```ts
type TeamMembersPageData = {
  items: TeamMemberListItem[];
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

- Title: `Team Members`
- Subtitle: team member management helper copy only
- Primary CTA: `New Team Member` with `add` icon

### Search

- Full-width search input below the header.
- Leading `search` icon.
- Placeholder: `search team members by...`

### Table

- Six columns in this order:
  - `Name + Email`
  - `Role`
  - `Social Media`
  - `Status`
  - `Created`
  - `Updated`
- The list does not render a separate `Actions` column.
- Entire rows remain clickable for edit navigation.

### Social Media column

- GitHub and LinkedIn render as icon links when URLs exist.
- Icon links open in a new tab and do not trigger row navigation.
- Missing links render `—`.

### Footer

- Pagination copy on the left.
- Previous and next icon buttons on the right.

### Empty and Error States

- Empty state without search includes `Create first team member`.
- Search-empty state includes only `Clear search`.
- Error state includes retry support and optional trace id.

## Responsive Layout Rules

- Follow the same admin list-page spacing and tone used by Episodes.
- Keep the same table structure in both themes.
- Preserve all columns on smaller screens via horizontal overflow rather than alternate mobile cards.
- Do not use hardcoded colors.

## Telemetry and Error Reporting

- Team member list observability follows the existing admin pattern:
  - load failure logging in the page orchestrator
  - route-level logging in `features/team-members/server`
  - backend normalization in `lib/api`
- Retry actions emit a team member list retry event before calling `refetch`.

## Styling Rules

- Use semantic tokens from `packages/design-tokens/styles.css`.
- Reuse the existing admin list visual language rather than copying raw Stitch HTML literally.
- Keep the status badge typography aligned with the existing admin status badge style.
- Render `Active` and `Inactive` in title case while preserving the existing badge visual treatment.