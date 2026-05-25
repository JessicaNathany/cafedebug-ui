# Spec: Episodes List — Status Lifecycle Alignment

| Field | Value |
|---|---|
| **Status** | `Implemented` |
| **Domain** | `admin/episodes` |
| **Spec path** | `.specs/admin/episodes-list-refactor/` |
| **Affected app** | `apps/admin` |
| **API endpoint** | `GET /api/v1/admin/episodes` |
| **Source of truth** | `.specs/admin/stitch/cafedebug-admin/code/themes/*/episode-list.html` |
| **Design system** | `.specs/admin/DESIGN_SYSTEM.md` |

---

## 1. Problem Statement

The admin episodes list previously modeled episode state as `active: boolean`, which no longer matches the OpenAPI contract. The frontend must now consume `status` as the source of truth and present the episode lifecycle with four canonical states: `draft`, `scheduled`, `published`, and `archived`.

This spec updates the list behavior so the UI remains Stitch-aligned while reflecting the new contract accurately, including a safe `Unknown` fallback badge for unsupported API values.

---

## 2. Scope

### In scope

| Area | Detail |
|---|---|
| Status contract | Read `status` from the API response instead of `active` |
| Status badges | Render `Draft`, `Scheduled`, `Published`, `Archived`, and `Unknown` fallback badges |
| Shared tokens | Consume shared lifecycle badge tokens from `packages/design-tokens` |
| Date column | Continue showing only `publishedAt`, with `—` when absent |
| Table behavior | Preserve current search, pagination, sort, row navigation, loading, empty, and error flows |

### Out of scope

| Area | Reason |
|---|---|
| Status-based filters | Not part of this contract migration |
| New sorting rules | Existing sort behavior stays unchanged |
| Episode editor footer actions | Covered by `.specs/admin/episode-editor-refactor/` |
| Banner lifecycle behavior | Tokens are shared, but banner adoption is deferred |

---

## 3. User Context

| Dimension | Detail |
|---|---|
| **Audience** | Admin users managing podcast content |
| **Entry point** | `/episodes` |
| **Primary action** | Browse, search, and navigate to edit an episode |
| **Secondary action** | Create a new episode |

---

## 4. Functional Requirements

### 4.1 Status source of truth

- The list must read `status` from the episode response.
- Supported lifecycle values are `draft`, `scheduled`, `published`, and `archived`.
- If the API returns an unsupported or missing `status`, the UI must render `Unknown` as a safe visible fallback.
- The list domain model must not reuse `active` semantics.

### 4.2 Status badges

Component: `EpisodeStatusBadge`

| State | Label | Surface token | Text token | Border |
|---|---|---|---|---|
| `draft` | `Draft` | `status-draft-surface` | `status-draft-on` | none |
| `scheduled` | `Scheduled` | `status-scheduled-surface` | `status-scheduled-on` | none |
| `published` | `Published` | `status-published-surface` | `status-published-on` | none |
| `archived` | `Archived` | `status-archived-surface` | `status-archived-on` | `status-archived-border` |
| `unknown` | `Unknown` | `status-unknown-surface` | `status-unknown-on` | `status-unknown-border` |

Shared badge contract:

- Geometry: full pill (`rounded-full`)
- Typography: `Space Grotesk`, `11px`, `600`
- Labels remain title-case
- Badges must always include visible text labels

### 4.3 Date column

- `Publish Date` continues to display `publishedAt` only.
- Format remains `Intl.DateTimeFormat("en-US", { dateStyle: "medium" })`.
- When `publishedAt` is missing or invalid, render `—`.

### 4.4 Existing table behavior

- Search, pagination, sort, loading, error, empty state, and row navigation behavior remain unchanged.
- The list must not introduce status-specific filters or new query parameters in this change.

---

## 5. Component Structure

```
features/episodes/
  components/
    episode-status-badge.tsx
    episode-status-badge.config.ts
    episodes-table.tsx
  parsers.ts
  types/episode.types.ts
```

---

## 6. API Contract

```ts
type EpisodeStatus = "draft" | "scheduled" | "published" | "archived";

interface EpisodeResponseLike {
  status?: EpisodeStatus | string | null;
  publishedAt?: string | null;
}
```

- `status` is the contract field for list state.
- The list parser must surface unsupported values as `unknown` for display purposes.

---

## 7. Non-functional Requirements

- No hardcoded hex colors in app components.
- All badge visuals must resolve through design tokens.
- List changes must remain architecture-compliant within `features/episodes`.
- Search, pagination, and row navigation regressions are not acceptable.
