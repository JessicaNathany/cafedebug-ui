# Spec: Episode List — Number Column Display Cleanup

| Field | Value |
|---|---|
| **Status** | `Implemented` |
| **Domain** | `admin/episodes` |
| **Spec path** | `.specs/admin/episode-list-number-display/` |
| **Affected app** | `apps/admin` |
| **Route** | `/episodes` |
| **API endpoint** | `GET /api/v1/admin/episodes` |
| **Design system** | `.specs/admin/DESIGN_SYSTEM.md` |

---

## 1. Problem Statement

The admin episodes list uses the number column to identify episodes in the table. The current presentation prefixes the episode number values with `#`, producing rows like `#12`.

This change removes the `#` prefix from the column presentation while preserving the same numeric information, table structure, and list behavior. The column header must render `Number`, and the cell values must render plain numeric content such as `12`.

---

## 2. Scope

### In scope

| Area | Detail |
|---|---|
| Table header | Ensure the first column header renders `Number` |
| Table cell formatting | Render `episode.number` without the `#` prefix |
| Fallback display | Continue rendering `—` when the episode number is absent or invalid |
| Existing list behavior | Preserve search, pagination, sort, row navigation, loading, empty, and error states |

### Out of scope

| Area | Reason |
|---|---|
| API contract changes | Number data already exists in the current response |
| Sorting changes | This request only changes visual formatting |
| Column order or width changes | Existing table layout stays intact |
| Episode editor labels | Form field labels are separate UI scope |

---

## 3. User Context

| Dimension | Detail |
|---|---|
| **Audience** | Admin users managing podcast content |
| **Entry point** | `/episodes` |
| **Primary task** | Scan the list and identify episodes by number |
| **Expected behavior** | The number column shows `Number` in the header and plain values like `12` in each row |

---

## 4. Functional Requirements

### 4.1 Header label

- The first column in `EpisodesTable` must display the visible header label `Number`.
- The loading skeleton table must use the same header label for consistency.

### 4.2 Number formatting

- When `episode.number` is a valid number, the table cell must render the number as plain text with no `#` prefix.
- Example: `12`, not `#12`.
- No extra suffix, punctuation, or localization marker is introduced in this change.

### 4.3 Missing values

- When `episode.number` is missing, null, or not a valid number, the table must continue rendering `—`.
- This fallback behavior must remain unchanged from the current list experience.

### 4.4 Existing states and flows

- Loading, empty, and error states remain unchanged.
- Search, pagination, sorting, and row click navigation remain unchanged.
- No new user interaction is added.

---

## 5. Component and Layer Changes

```
features/episodes/
  components/
    episodes-table.tsx        ← remove `#` prefix from displayed number values
```

- No changes are required in `app/`, hooks, services, server handlers, schemas, or shared packages.
- The change stays fully contained within the `features/episodes` presentation layer.

---

## 6. API Contract

```ts
interface EpisodeResponseLike {
  number?: number | null;
}
```

- The list continues consuming `number` from the existing `GET /api/v1/admin/episodes` response.
- No request or response shape changes are required.
- This is a presentation-only adjustment on top of the existing typed contract.

---

## 7. Validation, Responsive Behavior, Edge Cases, and Observability

### 7.1 Validation rules

- No new form validation or input validation is introduced.
- The existing display guard remains: only numeric values are rendered as episode numbers.

### 7.2 Responsive behavior

- The table keeps the current responsive behavior, spacing, and column layout.
- Removing the prefix must not introduce truncation or alignment regressions.

### 7.3 Edge cases

- Large episode numbers must still render as plain numeric text.
- Missing or invalid values must continue rendering `—`.
- Sorting or searching by episode number must remain unaffected because the underlying data does not change.

### 7.4 Observability

- No new telemetry event is required.
- Existing episodes list observability remains unchanged because no network or workflow behavior changes.

---

## 8. Non-functional Requirements

- No new dependencies.
- No direct `fetch()` calls in components.
- No business logic moves outside `features/episodes`.
- No hardcoded colors or token changes.
- The change must preserve current accessibility and table semantics.
