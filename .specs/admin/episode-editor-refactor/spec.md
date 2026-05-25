# Spec: Episode Editor Refactor

| Field | Value |
|---|---|
| **Status** | `Implemented` |
| **Domain** | `admin/episodes` |
| **Spec path** | `.specs/admin/episode-editor-refactor/` |
| **Affected app** | `apps/admin` |

## Problem

The admin episode editor was designed around a boolean `active` lifecycle and did not cover the newer `status`-driven contract. The editor must now support `draft`, `scheduled`, `published`, and `archived` as lifecycle states, while preserving the existing form architecture and Stitch-aligned layout.

## Goal

Refactor the editor so both `/episodes/new` and `/episodes/[id]/edit` keep the current split-pane design while aligning payloads, top-bar badges, footer actions, telemetry, and post-submit behavior with the `status` contract.

## Scope

- Keep route files thin and orchestration inside `features/episodes`.
- Show the top-bar badge immediately as `Draft` on `/episodes/new`.
- Show backend-returned `status` on edit mode, with `Unknown` fallback for unsupported values.
- Add edit-only `Archive` action.
- Preserve existing validation, loading, error, and image upload flows.
- Keep title, show notes, metadata, and tag editing behavior intact.

## Non-Goals

- Backend API redesign beyond the approved OpenAPI contract.
- New status helper copy or restore-specific UI.
- Status filters or workflow dashboards.

## Lifecycle contract

Canonical episode lifecycle values:

```ts
type EpisodeStatus = "draft" | "scheduled" | "published" | "archived";
```

Safe UI fallback:

```ts
type EpisodeDisplayStatus = EpisodeStatus | "unknown";
```

## Action semantics

- `Save Draft` always sends `status: "draft"`.
- `Archive` always sends `status: "archived"` and is only available in edit mode.
- `Publish` omits `status` and sends `publishedAt`.
- If `publishedAt` is blank when publishing, the frontend sends `now`.
- If `publishedAt` is already filled when publishing, the frontend preserves the user-entered value.
- `publishedAt` is omitted for `Save Draft` and `Archive`.
- Archived episodes can be republished through `Publish`.

## Footer behavior

- `/episodes/new`: `Cancel`, `Save Draft`, `Publish`
- `/episodes/[id]/edit`: `Cancel`, `Save Draft`, `Archive`, `Publish`
- `Save Draft` stays enabled even when the current status is `draft`.
- `Archive` is disabled when the current status is `archived`.

## Post-submit behavior

- Successful edit-mode mutations stay on the editor page and refresh the visible status badge.
- Successful create-mode mutations keep the existing redirect behavior.

## Acceptance Criteria

1. The editor top bar renders `Draft`, `Scheduled`, `Published`, `Archived`, or `Unknown` badges.
2. `/episodes/new` shows the `Draft` badge immediately before the first save.
3. Edit mode supports `Archive` and tracks it as a first-class mutation action.
4. The payload transformer uses `status` for draft/archive and `publishedAt` for publish.
5. Edit success stays on the editor page and reflects the refreshed lifecycle state.
6. Unsupported response statuses render `Unknown` visibly instead of failing silently.
