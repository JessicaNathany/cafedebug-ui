# Team Members List Refactor

## Problem

The admin `/team-members` route does not yet provide a usable team member listing workflow. That blocks admins from browsing existing team members, searching the dataset, and reopening records from a stable list entry point.

## Goal

Implement the team members list so `/team-members` provides a production-ready admin listing flow backed by the backend list endpoint, aligned with the final approved table layout and the existing admin architecture.

## Scope

- Replace the `/team-members` placeholder state with a real list experience.
- Keep route files thin and move list behavior into `features/team-members`.
- Load list data through the internal admin route and backend API client layers.
- Preserve `/team-members/new` and `/team-members/[id]/edit` as the create and edit navigation targets.
- Align the final list layout to the manually approved column model rather than literal Stitch parity.

## Non-Goals

- Backend schema or API changes.
- Team member editor form implementation.
- Inline delete, status toggle, or reorder actions from the list.
- Rendering Instagram or other non-approved social links in the list UI.

## Source Of Truth

- Theme and admin tokens:
  - `.specs/admin/DESIGN_SYSTEM.md`
  - `packages/design-tokens/styles.css`
- Route and architecture rules:
  - `README.md`
  - `AGENTS.md`
  - `.github/copilot-instructions.md`
- Final list layout decisions for this delivery:
  - `Name + Email`
  - `Role`
  - `Social Media`
  - `Status`
  - `Created`
  - `Updated`

## Field Contract

The team members list must align with the generated backend contract and normalize each field as follows:

| Field | Source | Visible in UI | Rule |
|---|---|---|---|
| `id` | Backend record | No direct column | Required for row identity and row-click navigation to `/team-members/[id]/edit`. Missing or invalid ids must disable edit navigation for that row. |
| `name` | Backend record | Yes | Primary label in the `Name + Email` column. Empty values fall back to `Team Member #{id}` when possible, otherwise `Team Member`. |
| `email` | Backend record | Yes | Secondary text in the `Name + Email` column. Missing values render as `—`. |
| `podcastRole` | Backend record | Yes | Rendered in the `Role` column. Empty or invalid values normalize to `—`. |
| `gitHubUrl` | Backend record | Yes | Rendered as a GitHub icon in `Social Media` when present. Empty values do not render an icon. |
| `linkedInUrl` | Backend record | Yes | Rendered as a LinkedIn icon in `Social Media` when present. Empty values do not render an icon. |
| `instagramUrl` | Backend record | No | Ignored by list normalization for this delivery. |
| `isActive` | Backend record | Yes | Normalized into a UI-safe boolean before rendering `Active` or `Inactive`. |
| `createdAt` | Backend record | Yes | Rendered in the `Created` column using the Episodes date style. Invalid or missing values render as `—`. |
| `updatedAt` | Backend record | Yes | Rendered in the `Updated` column using the Episodes date style. Invalid or missing values render as `—`. |
| `nickname` | Backend record | No | Not displayed in the final approved list layout. |
| `jobTitle` | Backend record | No | Not displayed in the final approved list layout. |
| `bio` | Backend record | No | Not displayed in the final approved list layout. |
| `profilePhotoUrl` | Backend record | No | Not displayed in the final approved list layout. |

## Column Contract

The final table must render these columns, in this order:

1. `Name + Email`
2. `Role`
3. `Social Media`
4. `Status`
5. `Created`
6. `Updated`

The list does not render a separate `Actions` column in this delivery.

## Action Mapping

| UI action | Expected behavior |
|---|---|
| `New Team Member` | Navigate to `/team-members/new` |
| Row click | Navigate to `/team-members/[id]/edit` when the row has a valid id |
| GitHub / LinkedIn icon click | Open the social profile in a new tab and do not trigger row navigation |
| Search input | Debounce and send the `search` query to the backend list endpoint |
| Previous page | Request the previous backend page when available |
| Next page | Request the next backend page when available |
| Retry fetch | Re-run the current list query |
| Clear search | Remove the current search term and reload the list |

## Behavior Rules

### List loading

- Route: `/team-members`
- The page must fetch team member list data through the internal admin route before rendering the steady-state table.
- While the request is pending, the UI must show a skeleton aligned to the final six-column table layout.

### Search behavior

- The search input stays visible above the table.
- Placeholder text must be exactly `search team members by...`.
- Search is server-side and uses the backend `search` query parameter.
- Search input must debounce by `300ms` before updating the request.
- The debounced search term must be mirrored in the browser URL as `?search=...`.
- Pagination resets to page `1` when the debounced search term changes.

### Pagination behavior

- Pagination controls render only in the populated table state.
- Footer copy must show `Showing X to Y of Z team members`.
- Previous and next buttons disable when the corresponding page does not exist or while a refetch is in progress.

### Row interaction behavior

- The list uses row click for edit navigation.
- The list does not render a separate `Actions` column.
- The row must remain clickable without hijacking GitHub or LinkedIn link clicks.
- Rows without a valid id must not attempt navigation.

### Social media behavior

- `gitHubUrl` and `linkedInUrl` render as independent links inside the `Social Media` column when present.
- Each social link opens in a new browser tab.
- If neither social URL exists, the `Social Media` column renders `—`.

### Empty state behavior

- If the backend returns zero team members and no search is active, the page renders a create-oriented empty state with `Create first team member`.
- If search is active and no results match, the page renders a search-oriented empty state with only `Clear search`.

### Error behavior

- Fetch failures render a dedicated error state with retry support.
- Error states must preserve normalized `status`, `title`, `detail`, and optional `traceId` values.

### Telemetry behavior

- List load failures must log module `team-members` and action `list`.
- Retry actions must emit a team member retry event before re-fetching.
- Route-level failures must preserve optional trace ids for observability.

### Responsive behavior

- The list remains a table on smaller screens.
- The table may overflow horizontally, but the column set must remain intact.
- The layout must maintain light and dark theme parity using semantic tokens only.

## Acceptance Criteria

1. `/team-members` renders a real team members list flow instead of a placeholder.
2. The table renders exactly `Name + Email`, `Role`, `Social Media`, `Status`, `Created`, and `Updated`.
3. `Name` and `Email` render together in the first column.
4. `Updated` renders in the table and uses the same date formatting approach as Episodes.
5. GitHub and LinkedIn icons render per row when those URLs exist and open independently from row navigation.
6. Search uses the placeholder `search team members by...` and no UI copy references episodes.
7. The list loads through `components -> hooks -> services -> app/api -> features/server -> lib/api -> @cafedebug/api-client -> backend`.
8. No direct `fetch()` calls are introduced in components or `page.tsx`.
9. The minimum validation pipeline executes: lint, typecheck, build, tests.