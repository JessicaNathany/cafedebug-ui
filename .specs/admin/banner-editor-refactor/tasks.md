# Tasks: Banner Editor Refactor

| Field | Value |
|---|---|
| **Status** | Draft |
| **Spec** | `.specs/admin/banner-editor-refactor/spec.md` |
| **Design** | `.specs/admin/banner-editor-refactor/design.md` |
| **Execution order** | Phases must be completed in sequence — each phase validates before the next begins |

---

## Execution Rules

- Each task specifies: **file**, **layer**, **change type**, **validation step**
- Tasks within the same phase may be executed in parallel unless noted
- Do NOT begin a phase until all tasks in the previous phase are validated
- All implementation must follow `.github/copilot-instructions.md` architecture rules

---

## Phase 1 — Contract, routing, and feature foundation

> **Goal:** Confirm the backend contract and prepare the banner editor feature boundaries before implementation starts.

### Task 1.1 — Verify banner contract shape

| Field | Value |
|---|---|
| **File** | `packages/api-client/src/generated/models/*`, `packages/api-client/src/generated/admin-banners/*` |
| **Layer** | `api-client` |
| **Change type** | Verification |

**Steps:**
1. Confirm the generated banner fields used by the editor: `id`, `name`, `urlImage`, `url`, `startDate`, `endDate`, `active`, and `order`.
2. Confirm that create returns a `Result`-style response while detail/update return `BannerResponse`.
3. Confirm that `BannerResponse.active` is generated as `string | null` and must be normalized before UI use.

**Validation:**
- Contract differences between create and detail/update are documented before implementation begins.

### Task 1.2 — Create the banner feature structure

| Field | Value |
|---|---|
| **File** | `apps/admin/src/features/banners/` |
| **Layer** | `feature structure` |
| **Change type** | Addition |

**Steps:**
1. Create the `banners` feature folder if it does not exist.
2. Prepare subfolders:
   - `components/`
   - `hooks/`
   - `services/`
   - `server/`
   - `schemas/`
   - `types/`
3. Add support files:
   - `defaults.ts`
   - `parsers.ts`
   - `transformers.ts`
   - `banner-editor-page.tsx`

**Validation:**
- The feature folder matches the required project architecture.

### Task 1.3 — Update route helpers and layout support

| Field | Value |
|---|---|
| **File** | `apps/admin/src/lib/routes.ts`, admin shell layout files as needed |
| **Layer** | `lib` / `layout` |
| **Change type** | Modification |

**Steps:**
1. Add centralized route helpers for:
   - `/banners`
   - `/banners/new`
   - `/banners/{id}/edit`
2. Confirm the admin shell can render the banner editor in the required split-pane/full-width layout.

**Validation:**
- Banner editor navigation does not depend on inline route strings.
- Banner editor routes can render the required layout without clipping.

---

## Phase 2 — Schema, types, defaults, parsers, and transformers

> **Goal:** Define the editor contract and normalization rules before wiring backend flows.

### Task 2.1 — Add banner editor schema and form values

| Field | Value |
|---|---|
| **File** | `apps/admin/src/features/banners/schemas/banner.schema.ts` |
| **Layer** | `schemas` |
| **Change type** | Addition |

**Steps:**
1. Add `bannerEditorSchema` with fields required by the editor UI.
2. Define the editor form value type from the schema.
3. Encode validation rules for `name`, `url`, `startDate`, `endDate`, and the uploaded `urlImage` value stored in form state.

**Validation:**
- The schema expresses the editor contract without validation logic inside UI components.

### Task 2.2 — Add banner types

| Field | Value |
|---|---|
| **File** | `apps/admin/src/features/banners/types/banner.types.ts` |
| **Layer** | `types` |
| **Change type** | Addition |

**Steps:**
1. Define banner editor mode and mutation action types.
2. Define route-safe error types for fetch and submit flows.
3. Define normalized detail and mutation result types shared by hooks/services/components.

**Validation:**
- Banner editor modules share a stable type contract.

### Task 2.3 — Add editor defaults and hydration mapping

| Field | Value |
|---|---|
| **File** | `apps/admin/src/features/banners/defaults.ts`, `apps/admin/src/features/banners/transformers.ts` |
| **Layer** | `defaults` / `transformers` |
| **Change type** | Addition |

**Steps:**
1. Define default values for new mode.
2. Add `toBannerEditorDefaults` for edit-mode hydration.
3. Add helpers for converting `datetime-local` values to and from backend date strings.

**Validation:**
- New-mode defaults and edit-mode hydration are defined outside the UI layer.

### Task 2.4 — Add parser normalization rules

| Field | Value |
|---|---|
| **File** | `apps/admin/src/features/banners/parsers.ts` |
| **Layer** | `parsers` |
| **Change type** | Addition |

**Steps:**
1. Normalize nullable backend detail fields into editor-safe values.
2. Normalize `BannerResponse.active` from generated `string | null` into the UI boolean/status representation used by the editor.
3. Normalize create (`Result`) and detail/update (`BannerResponse`) into route-safe shapes before they reach hooks.

**Validation:**
- Raw generated responses are not consumed directly by form or component layers.

### Task 2.5 — Add submit payload transformer

| Field | Value |
|---|---|
| **File** | `apps/admin/src/features/banners/transformers.ts` |
| **Layer** | `transformers` |
| **Change type** | Addition |

**Steps:**
1. Add `toBannerRequestPayload`.
2. Map `Save Draft` to `active = false`.
3. Map `Publish` to `active = true`.
4. Serialize empty `url` and `urlImage` values to `null`.
5. Omit `order` on create and preserve the loaded `order` value on update.

**Validation:**
- Create and update payloads are explicit and backend-aligned.

---

## Phase 3 — Server-side backend path

> **Goal:** Build the internal API path before client hooks and services depend on it.

### Task 3.1 — Add backend API adapter

| Field | Value |
|---|---|
| **File** | `apps/admin/src/lib/api/banners-admin-api.ts` |
| **Layer** | `lib/api` |
| **Change type** | Addition |

**Steps:**
1. Add detail, create, and update backend adapter functions.
2. Reuse shared backend auth/header normalization utilities.
3. Keep create vs detail/update response-shape differences isolated from hooks and components.
4. Add banner image upload backend orchestration using the admin images resource.
5. Use `@cafedebug/api-client` as the only backend contract client.

**Validation:**
- Backend orchestration is centralized in `lib/api`.

### Task 3.2 — Add server handlers

| Field | Value |
|---|---|
| **File** | `apps/admin/src/features/banners/server/banners-create.handler.ts`, `banners-detail.handler.ts`, `banners-update.handler.ts`, `banners-error-response.ts` |
| **Layer** | `server` |
| **Change type** | Addition |

**Steps:**
1. Add detail handler for edit-mode loading.
2. Add create handler for new-mode submission.
3. Add update handler for edit-mode submission.
4. Add image upload handler for cover artwork uploads.
5. Normalize route-safe success and error responses.
6. Preserve trace ids and route-safe error metadata for observability.

**Validation:**
- `features/banners/server` becomes the only server-side banner editor logic layer.

### Task 3.3 — Add thin internal admin API routes

| Field | Value |
|---|---|
| **File** | `apps/admin/src/app/api/admin/banners/route.ts`, `apps/admin/src/app/api/admin/banners/[id]/route.ts`, `apps/admin/src/app/api/admin/images/upload/route.ts` |
| **Layer** | `app/api` |
| **Change type** | Addition |

**Steps:**
1. Add `POST /api/admin/banners` route delegation.
2. Add `GET /api/admin/banners/{id}` route delegation.
3. Add `PUT /api/admin/banners/{id}` route delegation.
4. Add `POST /api/admin/images/upload` route delegation.

**Validation:**
- API route files contain delegation only.

---

## Phase 4 — Client services and hook orchestration

> **Goal:** Wire the editor’s client state to the internal API path.

### Task 4.1 — Add banner editor services

| Field | Value |
|---|---|
| **File** | `apps/admin/src/features/banners/services/banners.service.ts` |
| **Layer** | `services` |
| **Change type** | Addition |

**Steps:**
1. Add detail, create, update, and image-upload service functions for the editor.
2. Call internal admin routes only:
   - `GET /api/admin/banners/{id}`
   - `POST /api/admin/banners`
   - `PUT /api/admin/banners/{id}`
   - `POST /api/admin/images/upload`
3. Normalize route-safe error handling for the hook layer.

**Validation:**
- No direct backend fetch is required from hooks or components.

### Task 4.2 — Add detail and mutation hooks

| Field | Value |
|---|---|
| **File** | `apps/admin/src/features/banners/hooks/use-banner-by-id.ts`, `use-create-banner.ts`, `use-update-banner.ts`, `use-upload-banner-image.ts` |
| **Layer** | `hooks` |
| **Change type** | Addition |

**Steps:**
1. Add a detail hook for edit mode.
2. Add create, update, and image-upload mutation hooks.
3. Use TanStack Query patterns consistent with `apps/admin/src/features/episodes`.

**Validation:**
- Detail fetch and create/update mutations are isolated from presentation components.

### Task 4.3 — Add `useBannerEditor`

| Field | Value |
|---|---|
| **File** | `apps/admin/src/features/banners/hooks/use-banner-editor.ts` |
| **Layer** | `hooks` |
| **Change type** | Addition |

**Steps:**
1. Parse route mode and id.
2. Initialize React Hook Form with the banner schema and defaults.
3. Hydrate form values in edit mode from the normalized detail query result.
4. Implement dirty-form leave confirmation.
5. Implement image-upload orchestration that stores the returned `imageUrl` in form state.
6. Implement submit orchestration for draft and publish actions.
7. Surface invalid-id, loading, fetch-error, and submit-error states.
8. Emit banner editor telemetry using the same metadata shape as the episodes editor flow.

**Validation:**
- `useBannerEditor` becomes the single client orchestration boundary for the editor page.

---

## Phase 5 — Route pages and UI composition

> **Goal:** Compose the route pages and the editor UI with strict separation between state and presentation.

### Task 5.1 — Add thin route pages

| Field | Value |
|---|---|
| **File** | `apps/admin/src/app/(admin)/banners/new/page.tsx`, `apps/admin/src/app/(admin)/banners/[id]/edit/page.tsx` |
| **Layer** | `app` |
| **Change type** | Addition |

**Steps:**
1. Add the new-mode page that renders `BannerEditorPage`.
2. Add the edit-mode page that renders `BannerEditorPage` and passes route params.
3. Keep route files free of business logic.

**Validation:**
- Route pages only compose the feature page.

### Task 5.2 — Add editor page composition

| Field | Value |
|---|---|
| **File** | `apps/admin/src/features/banners/banner-editor-page.tsx` |
| **Layer** | `feature composition` |
| **Change type** | Addition |

**Steps:**
1. Compose `useBannerEditor` with editor states and UI.
2. Render invalid-id, loading, fetch-error, and editor-ready form states.
3. Keep the page as the composition boundary between hook state and presentational components.

**Validation:**
- Top-level editor state branching lives in `BannerEditorPage`, not the form component.

### Task 5.3 — Add editor form UI

| Field | Value |
|---|---|
| **File** | `apps/admin/src/features/banners/components/banner-editor-form.tsx`, `banner-editor-topbar.tsx` |
| **Layer** | `components` |
| **Change type** | Addition |

**Steps:**
1. Implement the Stitch-inspired top bar.
2. Implement the large inline title input in the left pane.
3. Implement the right-side configuration pane with:
   - cover artwork field
   - destination URL input
   - start date field
   - end date field
4. Implement the sticky footer with `Cancel`, `Save Draft`, and `Publish`.
5. Limit the form component to editor-ready and submit-error presentation.
6. Use design tokens only.

**Validation:**
- The editor UI matches the approved structure without taking ownership of top-level loading/error/invalid-id states.

---

## Phase 6 — Tests and hardening

> **Goal:** Prove the editor behavior and visual parity before approval.

### Task 6.1 — Add payload and parser tests

| Field | Value |
|---|---|
| **File** | `apps/admin/tests/banners-editor-payload.test.mjs`, additional parser tests as needed |
| **Layer** | `tests` |
| **Change type** | Addition |

**Steps:**
1. Test `toBannerRequestPayload` for draft and publish actions.
2. Test detail-to-defaults hydration rules.
3. Test date conversion behavior used by the editor.
4. Test backend response normalization, including `active` conversion.

**Validation:**
- Payload mapping and parser normalization are covered by tests.

### Task 6.2 — Add state coverage tests

| Field | Value |
|---|---|
| **File** | `apps/admin/tests/` banner editor state tests |
| **Layer** | `tests` |
| **Change type** | Addition |

**Steps:**
1. Cover invalid-id behavior.
2. Cover loading and fetch-error handling.
3. Cover submit-error preservation behavior where practical.
4. Cover dirty-form leave protection behavior where practical.

**Validation:**
- Core editor state transitions are covered by tests.

### Task 6.3 — Validate light/dark parity against Stitch

| Field | Value |
|---|---|
| **File** | Stitch HTML/image references and implemented banner editor UI |
| **Layer** | `validation` |
| **Change type** | Validation |

**Steps:**
1. Compare the implemented editor against the light Stitch HTML/image references.
2. Compare the implemented editor against the dark Stitch HTML/image references.
3. Confirm layout, pane structure, top bar, sticky footer, and field placement remain equivalent across themes.

**Validation:**
- Light and dark implementations satisfy the acceptance criterion for Stitch-aligned parity.

### Task 6.4 — Run validation gates

| Field | Value |
|---|---|
| **File** | N/A |
| **Layer** | `validation` |
| **Change type** | Validation |

**Steps:**
1. Run lint for `@cafedebug/admin`
2. Run typecheck for `@cafedebug/admin`
3. Run tests for `@cafedebug/admin`

**Validation:**
- Lint, typecheck, and tests complete successfully.

---

## Phase 7 — Documentation alignment

> **Goal:** Ensure documentation reflects the final editor behavior and architecture.

### Task 7.1 — Update feature documentation

| Field | Value |
|---|---|
| **File** | Relevant spec/feature docs as required by final implementation |
| **Layer** | `documentation` |
| **Change type** | Update |

**Steps:**
1. Use the `documentation-writer` skill for final documentation work.
2. Update documentation to reflect the final editor flow and file structure.
3. Document the data flow from UI to backend.
4. Ensure the delivered behavior matches the implemented banner editor.

**Validation:**
- Documentation reflects final behavior and architecture decisions.
