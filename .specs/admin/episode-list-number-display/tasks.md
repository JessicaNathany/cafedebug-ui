# Tasks: Episode List — Number Column Display Cleanup

| Field | Value |
|---|---|
| **Status** | `Implemented` |
| **Spec** | `.specs/admin/episode-list-number-display/spec.md` |

---

## Phase 1 — Planning

- [x] Confirm the change is limited to the admin episodes list route `/episodes`
- [x] Confirm the column header must render `Number`
- [x] Confirm values must keep the numeric content and remove only the `#` prefix

---

## Phase 2 — Frontend Implementation

- [x] **`apps/admin/src/features/episodes/components/episodes-table.tsx`**
  - Keep the first column header as `Number`
  - Remove the `#` prefix from rendered episode number values
  - Preserve the `—` fallback for missing or invalid values
  - Preserve row navigation, status badges, publish date, and existing table layout

---

## Phase 3 — Debug and Validation

- [x] **`apps/admin/tests/episodes-table-number-display.test.mjs`**
  - Add direct coverage that the table keeps the `Number` header
  - Add direct coverage that the old `#${episode.number}` rendering is no longer present

- [x] Run existing admin validation commands
  - `pnpm --filter @cafedebug/admin run test`
  - `pnpm --filter @cafedebug/admin run lint`
  - `pnpm --filter @cafedebug/admin run typecheck`
  - `pnpm --filter @cafedebug/admin run build`

---

## Phase 4 — Documentation Sync

- [x] Update `.specs/admin/episode-list-number-display/spec.md` status to `Implemented`
- [x] Update `.specs/README.md` entry status to `Implemented`
- [x] Record final completion state in this `tasks.md`
