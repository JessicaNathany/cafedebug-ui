# Tasks: Episode List — Server-Side Search

| Field | Value |
|---|---|
| **Status** | `Draft` |
| **Spec** | `.specs/admin/episode-search/spec.md` |
| **Design** | `.specs/admin/episode-search/design.md` |

---

## Phase 1 — Type & Defaults

- [ ] **`features/episodes/types/episode.types.ts`**
  - Add `search?: string` to `EpisodesQueryParams`

- [ ] **`features/episodes/defaults.ts`**
  - Add `search: ""` to `episodesListDefaultParams`

---

## Phase 2 — Service Layer

- [ ] **`features/episodes/services/episodes.service.ts`**
  - In `toSearchParams()`: append `search` to `URLSearchParams` when `params.search` is non-empty
  - No changes to `episodesQueryKeys` — `params` is already spread into the query key, so `search` is automatically included

---

## Phase 3 — Server Handler

- [ ] **`features/episodes/server/episodes-list.handler.ts`**
  - Extract `search` from `requestUrl.searchParams` (trim, default to `undefined`)
  - Pass `search` to `listEpisodesFromBackend`

- [ ] **`apps/admin/src/lib/api/episodes-admin-api.ts`**
  - Add `search?: string` to `BackendEpisodesQuery` (or equivalent query type)
  - Forward `search` in the params passed to the backend API client call

---

## Phase 4 — Page Component

- [ ] **`features/episodes/episodes-list-page.tsx`**
  - Import `useSearchParams` and `useRouter` from `next/navigation`
  - Initialize `searchInput` state from `searchParams.get("search") ?? ""`
  - Add `useEffect` to debounce `searchInput` → `debouncedSearch` (300ms)
  - Add `useEffect` to reset `page` to `1` when `debouncedSearch` changes
  - Add `useEffect` to sync `debouncedSearch` to the URL via `router.replace(..., { scroll: false })`
  - Pass `search: debouncedSearch` into the query params object for `useEpisodesList`
  - Pass `debouncedSearch` as `searchTerm` prop to `EpisodesEmptyState`
  - Wire `onClearSearch` to `() => setSearchInput("")`

- [ ] **`features/episodes/hooks/use-debounced-search.ts`**
  - Delete the hook (debounce is now inlined in the page component; client-side filter is no longer needed)
  - Remove all import sites (only used by `episodes-list-page.tsx`)

---

## Phase 5 — Validation

- [ ] TypeScript typecheck passes: `pnpm typecheck` (exit 0)
- [ ] ESLint passes: `pnpm lint` (0 errors)
- [ ] No `any` types introduced
- [ ] Typing in the search bar triggers a network request to `/api/admin/episodes?search=<term>` (verify in browser network tab)
- [ ] Pagination resets to page 1 when search term changes
- [ ] URL updates to `?search=<term>` after 300ms debounce
- [ ] Refreshing the page with `?search=foo` pre-fills the search input and fetches matching results
- [ ] Clearing the search input removes `?search=` from the URL and returns full episode list
- [ ] Empty state with active search shows `"No episodes match your search"` + `"Clear search"` button
- [ ] Clicking `"Clear search"` clears input, removes URL param, refetches full list
- [ ] Loading skeleton renders while search query is in-flight

---

## Phase 6 — Documentation

- [ ] Update `spec.md` status to `Implemented`
- [ ] Update `tasks.md` with final completion state
- [ ] Update `.specs/README.md` entry status to `Implemented`
