# Design: Episodes List — Status Lifecycle Alignment

| Field | Value |
|---|---|
| **Status** | `Implemented` |
| **Source of truth** | `.specs/admin/stitch/cafedebug-admin/code/themes/*/episode-list.html` |
| **Visual reference** | `.specs/admin/stitch/cafedebug-admin/images/themes/*/episodes-list.png` |
| **Token source** | `.specs/admin/DESIGN_SYSTEM.md` + `packages/design-tokens/styles.css` |

---

## 1. Architecture

- `episodes-list-page.tsx` remains the thin orchestrator.
- `episodes-table.tsx` renders the list rows and date column.
- `episode-status-badge.tsx` renders the lifecycle badge from a shared status badge configuration.
- `parsers.ts` converts raw API payloads into the episode feature model with `status` as the lifecycle field.

---

## 2. Badge Rendering Contract

Shared badge geometry:

- `inline-flex items-center`
- `px-3 py-1`
- `rounded-full`
- `font-display text-[11px] font-semibold tracking-[0.05em]`

Badge variants:

| State | Label | Tailwind token classes |
|---|---|---|
| `draft` | `Draft` | `bg-status-draft-surface text-status-draft-on` |
| `scheduled` | `Scheduled` | `bg-status-scheduled-surface text-status-scheduled-on` |
| `published` | `Published` | `bg-status-published-surface text-status-published-on` |
| `archived` | `Archived` | `border border-status-archived-border bg-status-archived-surface text-status-archived-on` |
| `unknown` | `Unknown` | `border border-status-unknown-border bg-status-unknown-surface text-status-unknown-on` |

---

## 3. Data Flow

1. `useEpisodesList` fetches the paginated endpoint.
2. `parseEpisodesPageData` maps each raw record into `EpisodeRecord`.
3. `EpisodeRecord.status` carries the lifecycle value for rendering.
4. `EpisodeStatusBadge` selects the visual treatment from `episode-status-badge.config.ts`.

Unsupported or missing `status` values map to `unknown` in the parser so the list stays usable while surfacing contract drift visibly.

---

## 4. Date Column

- `publishedAt` remains the only displayed date source.
- No scheduled-specific or archived-specific date messaging is introduced.
- Missing or invalid dates render as `—`.

---

## 5. UX Boundaries

- Preserve existing search, pagination, and sort behavior.
- Preserve row click navigation to `/episodes/[id]/edit`.
- Do not add status-specific filter controls in this change.
