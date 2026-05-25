# Tasks: Episode Editor Refactor

| Field | Value |
|---|---|
| **Status** | `Implemented` |
| **Spec** | `.specs/admin/episode-editor-refactor/spec.md` |
| **Design** | `.specs/admin/episode-editor-refactor/design.md` |

## Phase 1 — Contract and domain update (✅ Complete)

- [x] Regenerate Orval and consume `EpisodeRequest.status`
- [x] Replace editor lifecycle state from `active` to `status`
- [x] Add `archive` to the mutation action model

## Phase 2 — Editor UI update (✅ Complete)

- [x] Update top-bar badge to read lifecycle status
- [x] Show `Draft` immediately in new mode
- [x] Add edit-only `Archive` action to the footer
- [x] Disable `Archive` when the current status is `archived`

## Phase 3 — Payload and telemetry (✅ Complete)

- [x] Map `save-draft` to `status: "draft"`
- [x] Map `archive` to `status: "archived"`
- [x] Keep `publish` on `publishedAt` with blank-field autofill to `now`
- [x] Track `archive` as a first-class telemetry action

## Phase 4 — Validation and docs (✅ Complete)

- [x] Update payload tests for draft / archive / publish semantics
- [x] Add lifecycle status parsing and badge coverage tests
- [x] Update editor spec/design/tasks and shared badge documentation
- [x] Run admin and api-client validation commands
