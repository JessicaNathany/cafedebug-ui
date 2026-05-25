# Design: Episode List — Server-Side Search

| Field | Value |
|---|---|
| **Status** | `Draft` |
| **Spec** | `.specs/admin/episode-search/spec.md` |
| **Token source** | `.specs/admin/DESIGN_SYSTEM.md` + `packages/design-tokens/styles.css` |

---

## 1. Data Flow

### Before (client-side)

```
useEpisodesList(page, pageSize, sortBy, descending)
  → GET /api/admin/episodes?page=1&pageSize=5&...
  → returns all items for the page
  → use-debounced-search filters items in memory
  → EpisodesTable renders filtered items
```

### After (server-side)

```
URL ?search=foo
  → episodes-list-page reads searchParams on mount
  → searchInput (local state) initialized from URL
  → EpisodesSearchBar controlled input
  → 300ms debounce → debouncedSearch
  → page reset to 1
  → router.replace updates URL (?search=foo)
  → useEpisodesList({ search, page, pageSize, sortBy, descending })
  → TanStack Query fetches with search in queryKey
  → toSearchParams() → GET /api/admin/episodes?search=foo&page=1&...
  → server handler extracts search → listEpisodesFromBackend({ search, ... })
  → backend returns filtered + paginated results
  → EpisodesTable renders results (no in-memory filter)
```

---

## 2. State Management

| State | Location | Type | Purpose |
|---|---|---|---|
| `searchInput` | `episodes-list-page.tsx` | `string` (React state) | Controls search bar input value |
| `debouncedSearch` | `episodes-list-page.tsx` | `string` (derived from debounce) | Drives query param + URL update |
| `page` | `episodes-list-page.tsx` | `number` (React state) | Current page; resets to 1 on search change |
| `?search=` | URL | URL param | Source of truth on mount; synced from `debouncedSearch` |

### Initialization on Mount

```tsx
const searchParams = useSearchParams();
const router = useRouter();
const [searchInput, setSearchInput] = useState(
  () => searchParams.get("search") ?? ""
);
```

### Debounce → URL sync

```tsx
useEffect(() => {
  const id = setTimeout(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    } else {
      params.delete("search");
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  }, 300);
  return () => clearTimeout(id);
}, [debouncedSearch]);
```

> **Note:** The debounce for URL sync mirrors the debounce for query execution — both fire after 300ms of inactivity. The simplest implementation is to derive `debouncedSearch` once (via `useEffect` + `setTimeout`) and use it for both the query param and the URL update.

### Page Reset

```tsx
useEffect(() => {
  setPage(1);
}, [debouncedSearch]);
```

---

## 3. Type Changes

### `episode.types.ts`

```ts
export type EpisodesQueryParams = {
  search?: string;   // ← add
  page: number;
  pageSize: number;
  sortBy: string;
  descending: boolean;
};
```

### `defaults.ts`

```ts
export const episodesListDefaultParams: EpisodesQueryParams = {
  search: "",        // ← add
  page: 1,
  pageSize: 5,
  sortBy: "number",
  descending: true,
};
```

---

## 4. Service Layer

### `episodes.service.ts` — `toSearchParams()`

```ts
const toSearchParams = (params: EpisodesQueryParams): URLSearchParams => {
  const queryParams = new URLSearchParams();
  if (params.search) queryParams.set("search", params.search);  // ← add
  queryParams.set("page", String(params.page));
  queryParams.set("pageSize", String(params.pageSize));
  queryParams.set("sortBy", params.sortBy);
  queryParams.set("descending", String(params.descending));
  return queryParams;
};
```

---

## 5. Server Handler

### `episodes-list.handler.ts`

```ts
const search = requestUrl.searchParams.get("search")?.trim() || undefined;  // ← add
const page = parseInteger(requestUrl.searchParams.get("page"), 1);
const pageSize = parseInteger(requestUrl.searchParams.get("pageSize"), 5);
const sortBy = requestUrl.searchParams.get("sortBy")?.trim() || "number";
const descending = parseBoolean(requestUrl.searchParams.get("descending"), true);

const result = await listEpisodesFromBackend({ search, page, pageSize, sortBy, descending });
```

---

## 6. Backend API Type

### `episodes-admin-api.ts` — `BackendEpisodesQuery`

```ts
type BackendEpisodesQuery = {
  search?: string;   // ← add
  page: number;
  pageSize: number;
  sortBy: string;
  descending: boolean;
};
```

---

## 7. Hook: `use-debounced-search.ts`

The current hook both debounces the input and filters a list of episodes in memory. After this change, only the debounce logic is needed.

**Option A — Inline the debounce directly into `episodes-list-page.tsx` and delete the hook.**

**Option B — Reduce the hook to a generic `useDebounce<T>` utility.**

Recommended: **Option A**. The hook is only used by the episodes list page, and inlining it removes the abstraction without adding any complexity.

```tsx
// In episodes-list-page.tsx
const [debouncedSearch, setDebouncedSearch] = useState(searchInput);

useEffect(() => {
  const id = setTimeout(() => setDebouncedSearch(searchInput), 300);
  return () => clearTimeout(id);
}, [searchInput]);
```

---

## 8. No Visual Changes

The `EpisodesSearchBar` component is already implemented and matches the design. No token, layout, or markup changes are needed in the search bar component.

The `EpisodesEmptyState` component already renders search-aware copy (`"No episodes match your search"` + `"Clear search"` CTA) when `searchTerm` is non-empty. The page component must pass the active `debouncedSearch` as the `searchTerm` prop and wire `onClearSearch` to `() => setSearchInput("")`.
