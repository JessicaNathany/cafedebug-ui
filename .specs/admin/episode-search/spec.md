# Spec: Episode List — Server-Side Search

| Field | Value |
|---|---|
| **Status** | `Draft` |
| **Domain** | `admin/episodes` |
| **Spec path** | `.specs/admin/episode-search/` |
| **Affected app** | `apps/admin` |
| **API endpoint** | `GET /api/v1/admin/episodes?search={string}` |
| **Design system** | `.specs/admin/DESIGN_SYSTEM.md` |

---

## 1. Problem Statement

The Episode List page has a search bar (`episodes-search-bar.tsx`) that filters results **client-side** via `use-debounced-search.ts`. This approach only filters the episodes already loaded in the current page — meaning a user searching for episode #3 while viewing page 2 will see no results, even though the episode exists.

The backend `GET /api/v1/admin/episodes` already accepts a `search` query parameter (confirmed in OpenAPI spec and the generated `GetApiV1AdminEpisodesParams` type). The frontend never sends it.

This spec wires the existing search input through all layers — service, server handler, backend client — so that search is evaluated server-side across all episodes, not just the current page.

---

## 2. Scope

### In scope

| Area | Detail |
|---|---|
| Type layer | Add `search?: string` to `EpisodesQueryParams` |
| Service layer | `toSearchParams()` forwards `search` to the query string when non-empty |
| Server handler | Extracts `search` from URL params and passes it to `listEpisodesFromBackend` |
| Backend API type | Add `search?: string` to `BackendEpisodesQuery` |
| Page component | Reads `search` from URL on mount; syncs debounced value back to URL; resets page to 1 on search change |
| URL state | `?search=` param persists the search term for shareable links and back-navigation |
| Debounce | Keep 300ms debounce; drive the API query instead of client-side filter |

### Out of scope

| Area | Reason |
|---|---|
| Visual changes to search bar | Component already matches design; no changes needed |
| Backend API changes | Backend already supports `search`; this spec is frontend-only |
| Sort controls or other filter params | Separate concern |
| Categories or other list pages | Separate feature scope |

---

## 3. User Context

| Dimension | Detail |
|---|---|
| **Audience** | Admin users managing podcast content |
| **Entry point** | `/episodes` |
| **Pain point** | Searching "Guest Name" on page 2 returns no results even if episodes exist on other pages |
| **Expected behavior** | Typing in the search box fetches matching episodes from the backend across all pages |

---

## 4. Functional Requirements

### 4.1 Search Input Behavior

- The `EpisodesSearchBar` component remains visually unchanged
- The input is controlled by local React state `searchInput` in `episodes-list-page.tsx`
- On mount, `searchInput` is initialized from the URL `?search=` param (if present)
- The user types into the search box; a 300ms debounce produces `debouncedSearch`

### 4.2 Query Execution

- `debouncedSearch` is passed as `EpisodesQueryParams.search` to `useEpisodesList`
- TanStack Query re-fetches whenever `search` changes (it is part of the query key)
- When `search` is an empty string, the param is **omitted** from the query string (not sent as `search=`)
- When `search` is non-empty, the query string includes `search={term}`

### 4.3 Page Reset

- Whenever `debouncedSearch` changes, `page` resets to `1`
- This ensures the user always sees the first page of results for a new search term

### 4.4 URL Synchronization

- When `debouncedSearch` settles (after debounce), the URL is updated via `router.replace` with `?search={term}`
- When `debouncedSearch` is empty, the `search` param is removed from the URL
- This happens silently (no navigation event, scroll preserved)

### 4.5 Empty State

- When the query returns zero results and a search term is active, the existing empty state renders `"No episodes match your search"` with a `"Clear search"` CTA
- `"Clear search"` sets `searchInput` to `""` and removes the URL param

### 4.6 Loading State

- While a search query is in-flight, the existing loading skeleton renders
- The search bar remains interactive (user can continue typing)

---

## 5. Component and Layer Changes

```
features/episodes/
  types/
    episode.types.ts           ← add `search?: string` to EpisodesQueryParams
  defaults.ts                  ← add `search: ""` to episodesListDefaultParams
  services/
    episodes.service.ts        ← toSearchParams() appends search when non-empty
  server/
    episodes-list.handler.ts   ← extract search from URL, pass to backend
  hooks/
    use-debounced-search.ts    ← remove filterEpisodes; keep or inline debounce util
    use-episodes-list.ts       ← no change needed (search flows via params)
  episodes-list-page.tsx       ← URL sync, pass search to query, reset page

apps/admin/src/lib/api/
  episodes-admin-api.ts        ← add search to BackendEpisodesQuery
```

---

## 6. API Contract

```
GET /api/v1/admin/episodes?search={string}&page={n}&pageSize={n}&sortBy={field}&descending={bool}
```

- `search` is optional; omitted when empty
- Backend performs full-text search across episode title, description, guest info, and episode number
- Response shape is unchanged (same `EpisodesPageData` structure)

```ts
{
  items: EpisodeRecord[];
  page: number;
  pageSize: number;
  pageCount: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
```

---

## 7. Non-functional Requirements

- No new dependencies
- Debounce: 300ms (unchanged from client-side implementation)
- URL update must not trigger a full navigation (use `router.replace` with `{ scroll: false }`)
- TanStack Query cache is keyed on `["episodes", params]` — search changes invalidate the relevant entry, not the entire cache
- TypeScript: no `any` types introduced
