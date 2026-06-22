# Banner Editor Refactor Design

## Architecture Overview

- Route files remain thin and render `BannerEditorPage`.
- `BannerEditorPage` is the feature composition boundary for `/banners/new` and `/banners/[id]/edit`.
- `useBannerEditor` owns form orchestration, detail hydration in edit mode, mutation flow, dirty-navigation protection, and submit state.
- `BannerEditorPage` owns state branching for invalid-id, loading, fetch-error, and editor-ready rendering.
- `BannerEditorForm` owns the split-pane happy-path UI and submit-error presentation within the editor form state.
- Client-side services call internal admin routes only.
- Internal admin routes delegate to `features/banners/server/*` handlers only.
- Server handlers delegate backend communication to `src/lib/api/banners-admin-api.ts`.
- `src/lib/api/banners-admin-api.ts` uses `@cafedebug/api-client` as the only backend contract client.

## Layer Flow

The Banner Editor must follow this data flow exactly:

```text
BannerEditorForm / BannerEditorPage
  -> useBannerEditor
  -> banner editor services
  -> app/api/admin/banners route handlers
  -> features/banners/server handlers
  -> lib/api/banners-admin-api.ts
  -> @cafedebug/api-client
  -> backend
```

### Layer Responsibilities

| Layer | Location | Responsibility |
|---|---|---|
| `app/` routes | `src/app/(admin)/banners/...` | Route entrypoints only; render the feature page and pass route params. |
| `components/` | `src/features/banners/components/` | UI only. No direct API calls. Receives state and callbacks from hooks. |
| `hooks/` | `src/features/banners/hooks/` | Orchestrates form state, detail fetching, mutation flow, leave confirmation, and retry behavior. |
| `services/` | `src/features/banners/services/` | Calls internal admin routes such as `/api/admin/banners` and `/api/admin/banners/{id}`. |
| `app/api/` | `src/app/api/admin/banners/...` | Thin route handlers that delegate to `features/banners/server`. |
| `server/` | `src/features/banners/server/` | Validates request context, calls `lib/api`, normalizes response envelopes, and returns route-safe responses. |
| `lib/api/` | `src/lib/api/banners-admin-api.ts` | Bridges auth/cookies to the backend and uses the generated API client. |
| `@cafedebug/api-client` | `packages/api-client` | Generated backend contract client. |

## File Structure

```text
apps/admin/src/
  app/
    (admin)/
      banners/
        new/
          page.tsx
        [id]/
          edit/
            page.tsx
    api/
      admin/
        banners/
          route.ts
          [id]/
            route.ts

  features/
    banners/
      components/
        banner-editor-form.tsx
        banner-editor-topbar.tsx
      hooks/
        use-banner-editor.ts
        use-banner-by-id.ts
        use-create-banner.ts
        use-update-banner.ts
      services/
        banners.service.ts
      server/
        banners-create.handler.ts
        banners-detail.handler.ts
        banners-update.handler.ts
        banners-error-response.ts
      schemas/
        banner.schema.ts
      types/
        banner.types.ts
      defaults.ts
      parsers.ts
      transformers.ts
      banner-editor-page.tsx

  lib/
    api/
      banners-admin-api.ts
```

## Route and Mode Design

### Route pages

- `src/app/(admin)/banners/new/page.tsx`
  - Renders `BannerEditorPage` with `mode="new"`.
- `src/app/(admin)/banners/[id]/edit/page.tsx`
  - Renders `BannerEditorPage` with `mode="edit"` and the route param `id`.

### Internal admin API routes

- `src/app/api/admin/banners/route.ts`
  - `POST` delegates to `bannersCreateHandler`
- `src/app/api/admin/banners/[id]/route.ts`
  - `GET` delegates to `bannersDetailHandler`
  - `PUT` delegates to `bannersUpdateHandler`

No business logic is allowed in these route files.

## State Orchestration

### New mode

- `BannerEditorPage` renders immediately with empty defaults.
- `useBannerEditor` initializes the form with `bannerEditorDefaultValues`.
- No detail query runs before the form is shown.
- The media action uploads a selected file through the internal admin image route and stores the returned `imageUrl` in form state.
- `Save Draft` and `Publish` both submit through the same payload transformer, differing only by action-derived `active` value.

### Edit mode

- `useBannerEditor` parses the route `id`.
- Invalid values (`missing`, `NaN`, `< 1`) produce the invalid-id state and skip all network calls.
- Valid ids trigger a detail query through `useBannerById`.
- When detail data resolves, the hook resets the form using `toBannerEditorDefaults`.
- Existing `urlImage` values render the media field in preview state.

### Submit orchestration

- `Save Draft` maps to `active = false`
- `Publish` maps to `active = true`
- New mode uses create mutation against `POST /api/admin/banners`
- Edit mode uses update mutation against `PUT /api/admin/banners/{id}`
- Submit failures preserve current form values and surface a visible submit error
- Success clears submit error state and navigates back to `/banners`

### Navigation protection

- `useBannerEditor` is responsible for dirty-form leave confirmation.
- In dirty state:
  - in-app cancel/navigation prompts before leaving
  - browser refresh/close warns before leaving

## Contract Normalization Strategy

### Detail and update response normalization

- Backend detail and update flows return `BannerResponse`.
- `parsers.ts` must normalize nullable backend fields into editor-safe values before hydration.
- `BannerResponse.active` is generated as `string | null`; the editor layer must normalize that value into a UI boolean before rendering status or deriving action state.
- `toBannerEditorDefaults` must work only with normalized banner detail data, not raw generated response values.

### Create response normalization

- Backend create flow returns `Result`, not `BannerResponse`.
- The create handler and services must normalize the create response into the same route-safe success/error envelope used by the hook layer.
- The hook layer must not depend on the create response containing full banner detail data.

## API Contract

### Internal admin routes

| Route | Method | Purpose |
|---|---|---|
| `/api/admin/banners` | `POST` | Create banner from editor payload |
| `/api/admin/banners/{id}` | `GET` | Load existing banner for edit mode |
| `/api/admin/banners/{id}` | `PUT` | Update existing banner from editor payload |
| `/api/admin/images/upload` | `POST` | Upload banner artwork and return an `imageUrl` |

### Backend routes

| Route | Method | Purpose |
|---|---|---|
| `/api/v1/admin/banners` | `POST` | Create banner |
| `/api/v1/admin/banners/{id}` | `GET` | Fetch banner detail |
| `/api/v1/admin/banners/{id}` | `PUT` | Update banner |
| `/api/v1/admin/images/upload` | `POST` | Upload banner artwork |

### Payload mapping rules

- `name` maps from the large title input.
- `urlImage` maps from the cover artwork upload result. Empty values normalize to `null`.
- `url` maps from the destination URL input. Empty or whitespace-only values normalize to `null`.
- `startDate` and `endDate` map from `datetime-local` inputs and must be converted to backend date string format.
- `active` is derived from the footer action, not an independent form control.
- `order` is not user-editable in this screen. Create payloads omit `order`; update payloads preserve the loaded backend `order` value.

### Response handling

- Detail responses must be parsed into banner editor defaults before hydrating the form.
- Create/update responses must be normalized into a consistent success/error envelope for the hook layer.
- Fetch and submit failures must be normalized into a route-safe error shape before reaching the UI.

## Telemetry and Error Reporting

- Banner editor observability must follow the existing admin feature pattern used by episodes.
- `useBannerEditor` is responsible for client-side telemetry around:
  - detail load failure
  - save-draft success/failure
  - publish success/failure
  - submit error normalization
- Banner telemetry payloads must use the same metadata shape as episodes:
  - `module`
  - `action`
  - normalized `status`
  - optional `traceId`
  - `reason` on failures
- `features/banners/server/*` handlers are responsible for route-level logging and error envelopes.
- `lib/api/banners-admin-api.ts` reuses the shared backend normalization utilities so trace ids and normalized failures can propagate to the UI.

## UI Structure

### Top Bar

- Back button on the left.
- Overline `BANNERS` and mode-aware subtitle.
- Status badge on the right.

### Left Pane

- Large banner name input.

### Right Pane

- Cover artwork field with preview/upload-empty state.
- Banner destination URL input with leading icon.
- Start Date field.
- End Date field.

### Footer

- Sticky footer separated from the content region.
- Cancel, Save Draft, Publish actions aligned to the right.

## Responsive Layout Rules

- The editor uses a split-pane layout on desktop and a stacked layout on smaller screens.
- Desktop layout:
  - main content on the left
  - configuration sidebar on the right
  - sticky footer remains visible across the full editor width
- Mobile/tablet layout:
  - top bar remains fixed/sticky
  - left and right panes stack vertically
  - footer actions remain accessible without hiding form content
- The right-side configuration pane must keep visual separation through tonal surfaces and layout depth, not heavy custom borders.
- The sticky footer must not overlap form content; the main content area must reserve bottom space for footer visibility.

## Data Rules

- Continue using `bannerEditorSchema`, `toBannerEditorDefaults`, and `toBannerRequestPayload`.
- Preserve `startDate` and `endDate` conversion between `datetime-local` and the API date string format.
- Preserve existing telemetry and API error reporting behavior.
- Media field behavior must stay consistent with the Episode editor: show the existing image preview when an image already exists, and show the empty upload/select state when no image exists.

## Styling Rules

- Use semantic tokens from `packages/design-tokens/styles.css`.
- Follow Stitch spacing and grouping, but do not copy raw CSS.
- Prefer tonal surfaces over heavy borders.
- Maintain visible focus rings and accessible error states.
- Maintain layout parity between light and dark themes; token changes must not change structure or interaction behavior.
