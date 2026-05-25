# Episode Editor Refactor Design

| Field | Value |
|---|---|
| **Status** | `Implemented` |
| **Token source** | `.specs/admin/DESIGN_SYSTEM.md` + `packages/design-tokens/styles.css` |

## Architecture

- Route files remain thin and render `EpisodeEditorPage`.
- `EpisodeEditorPage` remains the feature composition boundary.
- `useEpisodeEditor` owns data loading, mutation orchestration, dirty navigation guard, upload state, and lifecycle status exposure.
- `EpisodeEditorForm` owns the split-pane presentation and footer actions.

## Top Bar

- Back button on the left.
- Overline `EPISODES` and mode-aware subtitle.
- Lifecycle badge on the right.
- New mode resolves the badge to `draft` immediately.
- Edit mode resolves the badge from the parsed episode `status`, with `unknown` fallback.

## Footer Actions

- `Cancel` remains the navigation escape hatch.
- `Save Draft` is always available.
- `Archive` appears only in edit mode.
- `Archive` is disabled when the current status is `archived`.
- `Publish` remains available from any persisted state.

## Data Rules

- `EpisodeMutationAction` expands to `save-draft | archive | publish`.
- `toEpisodeRequestPayload` maps actions as follows:
  - `save-draft` -> `status: "draft"`
  - `archive` -> `status: "archived"`
  - `publish` -> omit `status`, send `publishedAt`
- `publishedAt` autofills to `now` only when publishing with a blank field.
- `publishedAt` is omitted for non-publish actions.
- Telemetry uses `episodes.mutation.outcome` with `archive` as a first-class action.

## Error and fallback behavior

- Unsupported API statuses surface as `Unknown` in both the top bar and list badge.
- The editor does not add extra helper copy for status-specific states in this change.
- Existing load, invalid-id, submit-error, and upload-error surfaces remain intact.
