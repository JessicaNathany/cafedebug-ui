# Admin Team Members Editor Design

| Field | Value |
| --- | --- |
| **Design status** | `IMPLEMENTED — repository validation complete; manual authenticated-backend acceptance pending` |
| **Canonical layout references** | `apps/admin/src/features/episodes/{episode-editor-page.tsx,components/episode-editor-{topbar,form}.tsx}` and `apps/admin/src/features/banners/{banner-editor-page.tsx,components/banner-editor-{topbar,form}.tsx}` |
| **Refinement scope** | Layout composition and state shells for Team Members editor routes only; no functional, data-flow, API, field, or list behavior change |

## 1. Overview

`TeamMemberEditorPage` is a dedicated feature composition boundary for both editor routes. It follows the existing Episode editor’s viable patterns—React Hook Form + Zod, TanStack Query detail/mutation hooks, protected internal routes, normalized route errors, invalid-id handling, retry, dirty-form protection, and token-based responsive layout—without copying episode-specific fields, draft/publish actions, or image upload behavior.

The editor adds capabilities beside the implemented Team Members list. It may extend the shared Team Members feature types, parser, client service, server helpers, and backend adapter, but it must not alter any list behavior or list-specific query semantics.

The Team Members editor must also use the canonical, already-shipped Episodes/Banners editor composition: persistent top bar, editor-ready primary/configuration panes, one responsive stacked-to-split transition, and an editor-ready action footer. The state shells must preserve the same page identity rather than falling back to an unrelated card or placeholder layout.

## 2. Architecture Decisions

1. **One feature, two explicit modes.** `/new` passes `mode="new"`; `/[id]/edit` passes `mode="edit"` plus the raw `id`. Routes do not fetch, validate, transform, or manage state.
2. **No backend behavior is inferred.** The implementation uses only generated operations: `get`, `create`, and `update`. It does not call the generated delete operation and does not add a status endpoint, upload endpoint, or client-owned persistence.
3. **Product validation is client-side and typed.** `team-member.schema.ts` is the sole form-validation source. Server handlers preserve backend validation/errors rather than duplicating undocumented backend rules.
4. **The generated contract remains authoritative.** `TeamMemberRequest`/`TeamMemberResponse` names and nullability drive the adapter and payload transformer. A feature parser converts nullable responses to editor-safe strings and booleans.
5. **Use protected internal routes.** Client services use `fetchProtectedAdminRoute`, never a backend base URL or generated client directly. Server handlers forward the request cookie through existing backend auth utilities.
6. **Use the existing route-safe envelope.** Internal success responses are `{ ok: true, data, traceId? }`; failures retain normalized `status`, `title`, `detail`, and optional `traceId`, plus forwarded `Set-Cookie` headers where supplied.
7. **No automatic timezone conversion.** The backend advertises `joinedAt` as nullable `date-time`, while the Episode editor already formats `datetime-local` values as local ISO-shaped timestamps. The transformer uses that convention and sends `YYYY-MM-DDTHH:mm:ss`; it does not append `Z`, infer a timezone, or change calendar components.
8. **Dirty-state protection is deliberately scoped.** Follow the existing Episode editor: confirm only editor-owned Cancel/Back actions when RHF is dirty, and register the standard browser `beforeunload` warning while dirty. Do not intercept arbitrary App Router, sidebar/link, history, or browser-back navigation; no reusable global navigation guard is in scope.

## 3. Required Architecture Definition

### File Structure

```text
apps/admin/src/
  app/
    (admin)/
      team-members/
        new/
          page.tsx                         # modify: route entry only
        [id]/
          edit/
            page.tsx                       # modify: route entry only
    api/
      admin/
        team-members/
          route.ts                         # modify: POST only; retain existing GET unchanged
          [id]/
            route.ts                       # add: GET and PUT only

  features/
    team-members/
      team-member-editor-page.tsx          # add: state-screen composition
      components/
        team-member-editor-form.tsx        # add: editor-ready form UI
        team-member-editor-topbar.tsx      # add: mode title, back action
        team-member-profile-photo-field.tsx # add: URL preview/empty presentation
        team-member-editor-error-state.tsx # add: reusable load/not-found state
      hooks/
        use-team-member-editor.ts          # add: RHF orchestration and navigation guard
        use-team-member-by-id.ts           # add: detail query
        use-create-team-member.ts          # add: create mutation
        use-update-team-member.ts          # add: update mutation
      schemas/
        team-member.schema.ts              # add: Zod schema + form type
      services/
        team-members.service.ts            # modify: add detail/create/update internal calls
      server/
        team-members-create.handler.ts     # add
        team-members-detail.handler.ts     # add
        team-members-update.handler.ts     # add
        team-members-error-response.ts     # reuse unchanged
        team-members-list.handler.ts       # unchanged
      types/
        team-member.types.ts               # modify: add editor contracts without changing list ones
      defaults.ts                          # modify: add editor defaults without changing list defaults
      parsers.ts                           # modify: add detail/mutation parsing without changing list parsing
      transformers.ts                      # add: defaults and request payload conversion

  lib/
    api/
      team-members-admin-api.ts            # modify: add get/create/update backend adapters

  tests/
    team-members-editor-schema.test.mjs    # add
    team-members-editor-transformers.test.mjs # add
    team-members-editor-states.test.mjs    # add
    team-members-editor-payload.test.mjs   # add
```

### Responsibilities

| Layer | Responsibility |
|---|---|
| `app/(admin)` | Routing only: render `TeamMemberEditorPage` and pass a literal mode/raw route param. No data access, schema, field parsing, mutation, or business logic. |
| Feature components | Presentational layout and accessible controls. They receive form state and callbacks; they do not call `fetch`, generated clients, or backend adapters. |
| Feature hooks | TanStack Query, React Hook Form orchestration, load hydration, mutation selection, query invalidation, scoped dirty-state protection (editor-owned Cancel/Back plus `beforeunload` only), retry, and client observability. |
| `schemas/` | Zod input validation and inferred `TeamMemberEditorValues`; no component-local validation. |
| `services/` | Browser-side calls to `/api/admin/team-members...`, route-envelope/error parsing, and feature parser invocation. |
| `server/` | Server-only id/context handling, cookie forwarding, backend invocation, observability, response-envelope construction, and `Set-Cookie` propagation. |
| `lib/api` | Backend transport adapter only: generated resource invocation plus existing auth/header/result normalization utilities. |
| `@cafedebug/api-client` | Generated OpenAPI request/response types and Team Members resource. |

### API Layer

- `app/api/admin/team-members/route.ts` retains its current `GET` delegation byte-for-byte in behavior and adds only `POST`, delegating directly to `teamMembersCreateHandler`.
- `app/api/admin/team-members/[id]/route.ts` is a new thin handler: `GET` delegates to `teamMembersDetailHandler`; `PUT` delegates to `teamMembersUpdateHandler`.
- API route files contain no `NextResponse` construction, parameter parsing, validation, backend calls, logging, cookie handling, or error normalization.

### Validation Rules

- No business logic, direct fetch, Zod schema, query, mutation, parser, or transformer belongs in `app/`.
- No component calls `fetch`, `fetchProtectedAdminRoute`, `@cafedebug/api-client`, or `lib/api`.
- Only services call the internal API; only `lib/api` invokes `@cafedebug/api-client`.
- The client must never call `/api/v1/admin/*` directly.
- The editor must not change the list route, its components, its existing `GET` route behavior, its defaults, or its parser outputs.

## 4. UI/UX Structure

### Canonical layout-parity contract

This contract standardizes **only** the Team Members editor layout against the existing Episodes and Banners editors. It is intentionally structural: retain the approved Team Members fields, copy, mutations, dirty-state policy, routes, and data layers elsewhere in this design.

| Area | Required Team Members treatment | Existing pattern source |
| --- | --- | --- |
| Top bar | Use the editor top-bar composition: sticky full-width semantic header, editor-owned back button to `/team-members`, domain eyebrow, mode-aware contextual title, and a right-side form-derived Active/Inactive indicator. It remains visible in ready and non-ready screens. | `EpisodeEditorTopBar`, `BannerEditorTopBar` |
| Editor-ready body | Use one page-surface shell containing a constrained editor body with two semantic sibling panes: a primary content pane and a configuration pane. The primary pane contains Identity, Profile, and Contact & social; the configuration pane contains profile photo URL presentation, `joinedAt`, and `isActive`. | `EpisodeEditorForm`, `BannerEditorForm` |
| Desktop split | At the existing admin editor desktop split breakpoint, render the primary pane and configuration pane side by side using the established primary-wide/metadata-narrow proportion. Both panes must be present; configuration is not a modal, drawer, overlay, or a duplicate field group. | Banner editor ready form and both editor loading shells |
| Narrow viewport | Below that same split breakpoint, stack primary before configuration in DOM and visual order. Preserve normal vertical reading and keyboard order, full-width controls, and access to the action footer without horizontal scrolling. | Episode/Banner editor stacked forms |
| Pane separation | Use the canonical surface hierarchy: page `surface`, a distinct configuration `surface-container-*` layer, and the existing responsive outline separator (top when stacked, leading edge when split) only where needed for pane distinction. Do not add arbitrary shadows, raw palette utilities, or a theme-specific layout branch. | Banner editor pane treatment; design-system semantic tokens |
| Submission error | Render the existing editor-style inline alert region immediately below the top bar and above the ready form. It carries title, detail, and optional trace ID, uses semantic danger/surface tokens, and never removes entered values or panes. | Episode/Banner editor forms |
| Loading shell | Keep the common page shell and top bar. Render an accessible, non-interactive two-pane skeleton that mirrors the ready body's stacked/split geometry and pane boundary. It contains no editor footer or actionable form controls. | `EpisodeEditorPage` / `BannerEditorPage` loading shells |
| Invalid-ID, not-found, and load-error shells | Keep the common page shell and top bar, then use the canonical constrained state panel. Invalid-ID and not-found offer Back only; non-404 load error offers Retry and Back. These shells contain no ready editor panes or action footer. Not-found is Team Members-specific because its contract distinguishes backend `404`. | Episode/Banner invalid-ID and load-error shells |
| Footer | Only the editor-ready state renders the sticky editor action footer. It uses the canonical full-width tonal footer and constrained, wrapping action row: Cancel as the navigation action and exactly one Team Members primary action (**Create Team Member** or **Save Changes**). Pending state disables duplicate navigation/submission as already specified. It must not introduce Episode/Banner draft, publish, archive, delete, or upload actions. | Banner sticky footer; Episode footer action grouping |

The implementation must reuse the semantic utility and responsive layout conventions visible in those sources, not copy their arbitrary utility values or their feature-specific raw-color/shadow usage. `nextjs-tailwind.instructions.md`, `.github/copilot-instructions.md`, and `.specs/admin/DESIGN_SYSTEM.md` remain controlling: select token-mapped utilities and available shared primitives rather than inventing visual constants.

### Profile photo behavior

- A non-empty, valid `profilePhotoUrl` may render an `<img>` preview with descriptive alt text such as “Profile photo preview for {name}”; failures render the URL input and a non-blocking unavailable-preview message.
- The preview is not proof that a remote URL is safe or available; submit validation is URL syntax only.
- There is no file input, upload request, image conversion, or images API route.

### Layout and themes

- Apply the canonical layout-parity contract in every editor state. Loading must mirror the ready pane geometry; error and not-found shells retain the top bar and use the canonical state-panel treatment; only ready mode exposes the sticky footer.
- Use `surface` / `surface-container-*` tonal layers, semantic text, primary, danger, outline-variant only when needed, and focus-ring tokens. Reuse existing admin spacing, typography, radius, elevation, responsive, and shared-primitive conventions.
- Do not add raw color values, raw palette utilities, arbitrary Tailwind visual values, theme-specific layout branches, raw Stitch markup, or arbitrary visual tokens. The same hierarchy, controls, states, pane order, and actions must exist under light, dark, and system themes.
- Use `nextjs-tailwind.instructions.md` compatibility where present, together with `.github/copilot-instructions.md`; no proposed Tailwind usage may bypass design tokens.

## 5. Components

| Component | Responsibility |
|---|---|
| `TeamMemberEditorPage` | Chooses invalid-id, loading, not-found, load-error, and editor-ready screen states. |
| `TeamMemberEditorTopbar` | Pure header/back UI; receives title, mode, active state, and callback. |
| `TeamMemberEditorForm` | Renders the semantic `<form>`, all registered fields, field errors, inline submit error, and sticky actions. |
| `TeamMemberProfilePhotoField` | Renders URL input presentation and non-mutating preview/preview-error. |
| `TeamMemberEditorErrorState` | Reusable not-found or load-error content with its supplied retry/back actions. |

The top-level `<form>` uses `onSubmit={form.handleSubmit(...)}`. Buttons use native submit semantics; Enter submits when valid. The switch/checkbox remains keyboard-operable and visibly labelled.

## 6. Data Flow

The required path is:

```text
TeamMemberEditorForm / TeamMemberEditorPage
  → useTeamMemberEditor
  → useTeamMemberById | useCreateTeamMember | useUpdateTeamMember
  → team-members.service.ts
  → /api/admin/team-members or /api/admin/team-members/{id}
  → team-members-*.handler.ts
  → lib/api/team-members-admin-api.ts
  → @cafedebug/api-client createTeamMembersResource()
  → backend /api/v1/admin/team-members[/{id}]
```

### Detail flow

1. `useTeamMemberEditor` parses a strictly positive integer id only in edit mode.
2. `useTeamMemberById` is disabled for new mode and invalid IDs; for valid IDs it queries `fetchTeamMemberById(id)`.
3. The service requests `GET /api/admin/team-members/{id}`, unwraps the route envelope, and uses `parseTeamMemberRecord`.
4. On success, the editor hook resets RHF from `toTeamMemberEditorDefaults`; it must not set individual fields during render.

### Create/update flow

1. RHF validates through `zodResolver(teamMemberEditorSchema)`.
2. `useTeamMemberEditor` passes form values to `toTeamMemberRequestPayload`.
3. The create mutation calls `POST /api/admin/team-members`; the update mutation calls `PUT /api/admin/team-members/{id}`.
4. The service throws normalized `TeamMembersRouteError` on non-success; on success it parses a Team Member record.
5. Mutation success invalidates `teamMembersQueryKeys.all`. New mode clears dirty state then replaces the route with `/team-members`; edit mode resets from the returned record and remains on route.

## 7. API Contracts

### Internal routes and backend mapping

| Internal route | Method | Server handler | Generated resource call | Backend contract | Success |
|---|---|---|---|---|---|
| `/api/admin/team-members` | `POST` | `teamMembersCreateHandler` | `teamMembers.create(payload, options)` | `POST /api/v1/admin/team-members` | `201 TeamMemberResponse` |
| `/api/admin/team-members/{id}` | `GET` | `teamMembersDetailHandler` | `teamMembers.get(id, options)` | `GET /api/v1/admin/team-members/{id}` | `200 TeamMemberResponse` |
| `/api/admin/team-members/{id}` | `PUT` | `teamMembersUpdateHandler` | `teamMembers.update(id, payload, options)` | `PUT /api/v1/admin/team-members/{id}` | `200 TeamMemberResponse` |

The existing list `GET /api/admin/team-members` remains exclusively under the list specification and is not redesigned here.

### Request payload

`toTeamMemberRequestPayload` produces exactly this `TeamMemberRequest` shape, with no additional properties:

```ts
{
  name: string,
  podcastRole: string,
  nickname: string | null,
  email: string | null,
  bio: string | null,
  jobTitle: string | null,
  gitHubUrl: string | null,
  linkedInUrl: string | null,
  profilePhotoUrl: string | null,
  joinedAt: string | null,
  isActive: boolean
}
```

The field sequence is irrelevant JSON-wise; field spelling and null versus non-empty normalized values are not. The generated OpenAPI schema lists all fields above, `additionalProperties: false`, and `name`/`podcastRole` as required properties. `createdAt` and `updatedAt` are response-only and must never be submitted.

### Error contracts

Generated Team Members operations document `400`, `401`, and `403` for create; `400`, `401`, `403`, and `404` for detail/update. Internal handlers additionally map unexpected transport/runtime failures to a route-safe `503`, following existing episode/server conventions. Do not promise a backend message beyond normalized `ProblemDetails`.

| Situation | UI behavior |
|---|---|
| Invalid edit route ID | Local invalid-id state; no request. |
| Backend detail `404` | Distinct not-found state with back action; retry is not required. |
| Detail `400/401/403` or unexpected failure | Load-error state with normalized error, optional trace ID, retry, and back. |
| Create/update validation/auth failure | Inline submission alert; preserve all form values. |
| Network/runtime failure | Inline submission alert with fallback `503` error; preserve all form values. |

## 8. State Management

- **RHF:** owns editor values, dirty state, field-level errors, submit lifecycle, and reset.
- **Zod:** owns field validity; transforms/normalizes only at the feature transformer boundary so form inputs remain strings/booleans suitable for controls.
- **TanStack Query:** owns the edit detail request and create/update mutation pending/error state. Query keys extend the existing Team Members key factory with `detail(id)` and preserve current list keys.
- **Local hook state:** only submission error, pending-navigation acknowledgement, and profile-preview failure state; it must not duplicate RHF field values or remote query data.
- **Navigation:** `useRouter` is used in the hook after editor-owned Cancel/Back confirmation or success, never in a route page. Query invalidation occurs before navigating away in new mode. Arbitrary App Router, sidebar/link, history, and browser-back navigation are not intercepted.

## 9. Edge Cases

| Case | Required handling |
|---|---|
| Missing, decimal, zero, negative, nonnumeric, or whitespace ID | Invalid-id state; do not issue detail/update request. |
| `TeamMemberResponse.id` missing or invalid | Parse failure becomes a normalized not-found/invalid-record load error; do not construct an update target from the response. The route ID remains the update target only after its own validation. |
| Nullable backend text values | Hydrate optional controls as `""`; required nullable values still surface a form validation error after hydration rather than silently submitting `null`. |
| Absent `isActive` response | Hydrate as `false`, because the generated response makes it optional; do not apply the new-mode `true` default to an existing record. |
| Whitespace-only optional values | Submit as `null`, not empty strings. |
| Invalid calendar date or malformed local date-time | Zod blocks submit and displays an associated field error. |
| Already-submitting action | Disable both footer controls that would navigate/submit appropriately; show pending action text and prevent duplicate requests. |
| Backend response after a second navigation | Mutation/query state must not force navigation after the hook unmounts; rely on TanStack Query lifecycle and pending-navigation state. |
| Remote profile image load failure | Keep form usable; show a local preview warning only, with no service/API error. |
| Form reset after successful update | Reset from parsed returned backend record so dirty state reflects canonical saved data. |

## 10. Accessibility and Responsiveness

- Use a real `<form>`, explicit `<label htmlFor>`, appropriate `type="email"`, `type="url"`, and `type="datetime-local"` controls, and a labelled checkbox/switch.
- Link every field error with `aria-describedby`; set `aria-invalid` only for fields with errors. Errors need text, not color alone.
- Submission and load errors use an announced alert/status pattern; loading skeleton is appropriately labelled as loading, mirrors the ready two-pane structure, and does not masquerade as data.
- The back/cancel control, preview field, switch, and footer buttons are usable via keyboard with visible `focus-ring` token focus states.
- The mobile stacked layout preserves primary-before-configuration field order and sticky-footer access; the desktop split pane retains both independently distinguishable panes and does not hide essential controls or require horizontal scrolling.
- Ensure readable text, error, disabled, hover, focus, and active states in light, dark, and system themes using semantic tokens only.

## 11. Observability

- Client hook logs detail failures and mutation failures through the existing observability/telemetry conventions with `module: "team-members"` and actions `detail`, `create`, or `update`, status, endpoint/method, and optional trace ID.
- Server handlers add breadcrumbs and log backend failures with the same module/action data. They capture unexpected exceptions and issue the normalized `503`.
- Do not log names, emails, biography text, URLs, or complete request bodies in telemetry.
