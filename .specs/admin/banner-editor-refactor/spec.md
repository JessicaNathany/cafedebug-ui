# Banner Editor Refactor

## Problem

The admin banner editor flow is not yet aligned with the approved Stitch source-of-truth layout for the banner edit screen. The target experience uses an editorial split-pane layout with an oversized inline title, a media field, a destination URL field, start and end dates, and a detached sticky footer.

## Goal

Refactor the banner editor so both `/banners/new` and `/banners/[id]/edit` match the Stitch layout near pixel-accurately in light and dark themes, while preserving the intended banner create and update behavior.

## Scope

- Rebuild the banner editor UI to match the Stitch banner edit references.
- Keep the route files thin and move orchestration into the banners feature.
- Preserve the intended validation, payload mapping, telemetry, and loading/error behavior defined by this spec package.
- Keep `url`, `startDate`, and `endDate` visible in the right-side configuration panel, with lower visual prominence than the banner title.

## Non-Goals

- Backend schema or API changes.
- Changes to the banner list screen.

## Source Of Truth

- Layout and composition:
  - `.specs/admin/stitch/cafedebug-admin/code/themes/light/banner-edit.html`
  - `.specs/admin/stitch/cafedebug-admin/code/themes/dark/banner-edit.html`
- Expected visuals:
  - `.specs/admin/stitch/cafedebug-admin/images/themes/light/banner-edit.png`
  - `.specs/admin/stitch/cafedebug-admin/images/themes/dark/banner-edit.png`
- Theming and tokens:
  - `.specs/admin/DESIGN_SYSTEM.md`
  - `packages/design-tokens/styles.css`

## Field Contract

The banner editor must align with the backend banner contract and treat each field as follows:

| Field | Source | Editable in UI | Rule |
|---|---|---|---|
| `id` | Route param / backend record | No | Required only in edit mode. Invalid, missing, non-numeric, or non-positive values must trigger the invalid-id state without calling the backend. |
| `name` | Form input | Yes | Primary editor field. Rendered as the large inline banner title input in the left pane. Required for create and update flows. |
| `urlImage` | Backend record / media field | Yes | Backed by the cover artwork field. The editor must let the user upload an image through the media action, persist the returned `imageUrl` into `urlImage`, show the existing image preview when a value already exists, and show an empty media state when it does not. Empty values must serialize to `null`. |
| `url` | Form input | Yes | Banner destination URL. Rendered in the right-side configuration panel and preserved in create and update flows. Empty or whitespace-only values are allowed and must serialize to `null`. |
| `startDate` | Form input | Yes | Rendered as a `datetime-local` input in the right-side configuration panel. Must be converted between UI date format and backend date string format. Required for create and update flows. |
| `endDate` | Form input | Yes | Rendered as a `datetime-local` input in the right-side configuration panel. Must be converted between UI date format and backend date string format. Empty values are allowed to represent an open-ended banner window. |
| `active` | Derived from editor action and normalized backend value | No direct field | Controlled by the footer action. `Save Draft` maps to inactive state and `Publish` maps to active state. Because the generated `BannerResponse` model exposes `active?: string | null`, the editor must normalize backend values into a UI boolean before rendering status. |
| `order` | Backend record | No | Out of scope for direct editing in this screen. Create payloads must omit `order`. Update payloads must preserve the current backend `order` value from the loaded record. |

## Action Mapping

The editor footer actions must map to banner status behavior as follows:

| UI action | Backend intent | Expected payload behavior |
|---|---|---|
| `Save Draft` | Save without publishing | `active = false` |
| `Publish` | Save as published/active | `active = true` |
| `Cancel` | Leave editor without saving | No mutation request; navigate back to `/banners` |

## Behavior Rules

### Validation rules

- `name` is required and must not submit as an empty or whitespace-only value.
- `url` may be empty; empty or whitespace-only values must normalize to `null`.
- `startDate` is required.
- `endDate` is optional, but when provided it must not be earlier than `startDate`.
- If `urlImage` is empty, the editor must stay in the empty media state instead of rendering a broken preview, and it must serialize to `null`.
- Cover artwork upload must happen through the image-upload action, not a manual text input.

### New mode

- Route: `/banners/new`
- The editor opens with empty default values.
- No banner detail fetch is required before rendering the form.
- The screen must support both draft and publish submission paths.

### Edit mode

- Route: `/banners/[id]/edit`
- The editor must fetch the existing banner record using the route id.
- The form must hydrate from the backend record before editing begins.
- Existing `urlImage` data must render as a preview state in the media field when available.
- Backend `active` values must be normalized before they are used to render status badges or editor action state.

### Success behavior

- Successful create and update flows must clear submit error state.
- Successful create and update flows must not leave the editor in a pending invalid state.
- The success navigation target must be `/banners`.
- Create success and update success must both navigate back to `/banners` instead of staying in the editor.

### Cancel behavior

- If the form is not dirty, `Cancel` navigates directly to `/banners`.
- If the form is dirty, the editor must show a leave-confirmation prompt before navigation.

### Dirty form behavior

- Create and edit modes must both protect against accidental navigation loss when the form has unsaved changes.
- Browser refresh or close behavior must warn when unsaved changes exist.

### Retry behavior

- If banner detail loading fails in edit mode, the screen must render a retry action.
- Retry must re-run the detail fetch for the current banner id.

### Invalid ID behavior

- If the route param is missing, non-numeric, or less than 1 in edit mode, the screen must render the invalid-id state.
- Invalid-id state must not attempt a backend fetch or mutation.

### Error behavior

- Fetch failure must render a dedicated error state with retry support.
- Submit failure must keep the user on the editor screen, preserve entered values, and surface the error clearly.

### Telemetry behavior

- Banner telemetry must follow the same event shape used by the Episodes editor flow.
- Save-draft success/failure and publish success/failure must emit banner-specific telemetry with:
  - `module: "banners"`
  - action scoped to `create`, `update`, `save-draft`, or `publish`
  - normalized `status`
  - optional `traceId`
  - `reason` on failures
- Detail-load failures must emit a banner detail failure event using the same normalized metadata shape.
- Transport or route-safe errors must preserve enough normalized metadata to support logging and tracing in the admin UI.

## Acceptance Criteria

1. The editor uses a top bar, split content area, and sticky footer consistent with the Stitch references.
2. The left pane contains the inline banner title input.
3. The right pane contains cover artwork, banner destination URL, start date, and end date.
4. Banner fields remain editable and submit through a dedicated payload transformer aligned with the backend contract.
5. Create, edit, save-draft, publish, loading, invalid-id, fetch-error, and submit-error flows continue to work.
6. Light and dark themes both visually align with their respective references.
