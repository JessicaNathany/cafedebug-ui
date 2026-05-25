# Tasks: Episodes List — Status Lifecycle Alignment

| Field | Value |
|---|---|
| **Status** | `Implemented` |
| **Spec** | `.specs/admin/episodes-list-refactor/spec.md` |
| **Design** | `.specs/admin/episodes-list-refactor/design.md` |

---

## Phase 1 — Contract regeneration (✅ Complete)

- [x] Regenerate `@cafedebug/api-client` from `.specs/admin/backend-openspec-api.json`
- [x] Confirm `EpisodeRequest` now exposes `status` instead of `active`

## Phase 2 — Episode domain migration (✅ Complete)

- [x] Replace `active: boolean` with enum-like `status` in `features/episodes/types/episode.types.ts`
- [x] Update `parsers.ts` to read response `status` and map unsupported values to `unknown`
- [x] Keep table date formatting on `publishedAt`

## Phase 3 — Badge presentation (✅ Complete)

- [x] Extend shared badge tokens for `scheduled`, `archived`, and `unknown`
- [x] Update Tailwind token mapping in `apps/admin/tailwind.config.ts`
- [x] Replace the two-state badge component with a five-state display contract (`draft`, `scheduled`, `published`, `archived`, `unknown`)
- [x] Update `episodes-table.tsx` to render the new `status` field

## Phase 4 — Validation (✅ Complete)

- [x] Payload and parser tests cover lifecycle states
- [x] Admin tests pass
- [x] Admin typecheck passes
- [x] Admin lint passes with pre-existing warnings only

## Phase 5 — Documentation (✅ Complete)

- [x] Update list spec/design/tasks for the status lifecycle model
- [x] Align badge token documentation in `.specs/admin/DESIGN_SYSTEM.md`
