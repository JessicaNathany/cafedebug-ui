# Admin Team Members Editor

| Field | Value |
|---|---|
| **Status** | `Implemented — repository validation complete; manual authenticated-backend acceptance pending` |
| **Domain** | `admin/team-members` |
| **Routes in scope** | `/team-members/new`, `/team-members/[id]/edit` |
| **Contract source** | `.specs/admin/backend-openspec-api.json` and generated `@cafedebug/api-client` Team Members resource |
| **Implementation guidance** | `.github/copilot-instructions.md`, `.specs/admin/DESIGN_SYSTEM.md`, and the existing Episode editor patterns |

## 1. Overview

Deliver a dedicated Team Members create and edit experience for the admin application. It replaces only the current placeholder pages at `/team-members/new` and `/team-members/[id]/edit`.

This is intentionally adjacent to, and independent from, `.specs/admin/team-member-list-refactor/`. That source package explicitly excludes editors; its implemented `/team-members` list behavior, table, search, pagination, routes, and list API behavior are out of scope and must remain unchanged.

## 2. Problem

The Team Members list can navigate to create and edit destinations, but both destinations currently render a coming-soon placeholder. Administrators therefore cannot create a team member or correct an existing member’s profile through the UI, despite the backend exposing create, detail, and update endpoints.

## 3. Goals

1. Provide production-ready create and edit workflows on the two scoped routes only.
2. Allow an administrator to edit exactly these fields: `name`, `podcastRole`, `nickname`, `email`, `bio`, `jobTitle`, `gitHubUrl`, `linkedInUrl`, `profilePhotoUrl`, `joinedAt`, and `isActive`.
3. Require non-empty, trimmed `name` and `podcastRole`.
4. Validate optional email, web URLs, and ISO date-time input before submission.
5. Default `isActive` to `true` in new mode; hydrate its stored value in edit mode.
6. Use the generated Team Members OpenAPI client through the prescribed admin API layers.
7. Present complete editor loading, invalid-id, not-found, error, scoped dirty-state protection, validation, submission, and success states with light/dark parity.

## 4. Non-goals

- Any change to `/team-members`, including its list UI, search, table normalization, pagination, list route, or list handler behavior.
- Delete, bulk action, sorting, filtering, reordering, or an independent status-toggle workflow.
- Image-file upload, image processing, social-link previews, or automatic URL discovery. `profilePhotoUrl` is a validated URL field only.
- Backend endpoint, schema, authorization, persistence, or OpenAPI changes.
- Public website team-member rendering.
- Adding unsupported fields such as display order, featured status, or a publication/draft workflow.
- Changing global design tokens, theme switching, navigation, or the episode editor.

## 5. Users and Use Cases

| User | Use case | Expected outcome |
|---|---|---|
| Authenticated administrator | Create a new member from the list’s **New Team Member** action. | A valid member is created through `POST /api/v1/admin/team-members`, then the administrator returns to the existing list. |
| Authenticated administrator | Edit a member selected from a list row. | Current data loads, can be changed, and saves through `PUT /api/v1/admin/team-members/{id}`. |
| Authenticated administrator | Correct a form or service error. | Entered values remain visible; field errors or a normalized retryable error explain the failure. |
| Authenticated administrator | Leave an unsaved editor. | Editor-owned Cancel/Back actions and browser close/refresh warn before discarding dirty values; arbitrary App Router, sidebar, history, and browser-back navigation are not intercepted. |

## 6. User Flows

### Create

1. The administrator opens `/team-members/new`.
2. The editor immediately renders empty defaults, with **Active** selected.
3. The administrator supplies `name` and `podcastRole`, optionally completes the remaining fields, and presses **Create Team Member**.
4. React Hook Form and Zod block invalid input and focus/describe invalid fields.
5. The client submits the normalized payload to the internal route.
6. On the backend `201` success response, the feature invalidates Team Member queries, clears dirty state, and navigates to `/team-members`.
7. On failure, it retains values, ends the pending state, and displays the route-safe error and optional trace ID.

### Edit

1. The administrator opens `/team-members/[id]/edit`.
2. A positive integer `id` triggers a detail request; any other `id` renders an invalid-id state and makes no request.
3. While valid detail data loads, the editor renders its structural loading skeleton.
4. A `200` response hydrates the form from a normalized Team Member record.
5. A `404` response renders a dedicated not-found state. Other load failures render an error state with **Retry** and **Back to team members**.
6. The administrator changes fields and presses **Save Changes**.
7. On `200`, the feature accepts the returned canonical record, resets the form to it (clearing dirty state), invalidates Team Member list/detail queries, and keeps the administrator on the same edit route.
8. A failed update retains entered values and displays the normalized submission error.

### Cancel or leave

1. Cancel/back returns to `/team-members` immediately when the form is pristine.
2. If dirty, an editor-owned Cancel or Back action asks for confirmation before departure.
3. Browser refresh/close receives the standard browser unsaved-changes warning while dirty. Arbitrary App Router, sidebar, history, and browser-back navigation are intentionally not intercepted.

## 7. Routes or Screens

| Route | Screen | Mode | Data behavior |
|---|---|---|---|
| `/team-members/new` | Team Member Editor | `new` | No detail request; use new-member defaults. |
| `/team-members/[id]/edit` | Team Member Editor | `edit` | Validate ID, load detail, hydrate, and update. |

There is no editor route under `/team-members` in this package; it remains owned by the list specification.

## 8. Field and Validation Contract

All fields below are present in the editor and map one-for-one to `TeamMemberRequest`. The OpenAPI schema requires `name` and `podcastRole` properties but marks their values nullable; this UI adds the product-required non-empty validation described here without changing backend behavior.

| Field | Input and requirement | Client normalization before payload |
|---|---|---|
| `name` | Text; required, trimmed non-empty string. | Trimmed string. |
| `podcastRole` | Text; required, trimmed non-empty string. | Trimmed string. |
| `nickname` | Text; optional. | Trimmed non-empty string or `null`. |
| `email` | Email input; optional; valid email when present. | Trimmed non-empty string or `null`. |
| `bio` | Multiline text; optional. | Trimmed non-empty string or `null`. |
| `jobTitle` | Text; optional. | Trimmed non-empty string or `null`. |
| `gitHubUrl` | URL input; optional; valid absolute `http` or `https` URL when present. | Trimmed non-empty string or `null`. |
| `linkedInUrl` | URL input; optional; valid absolute `http` or `https` URL when present. | Trimmed non-empty string or `null`. |
| `profilePhotoUrl` | URL input; optional; valid absolute `http` or `https` URL when present. | Trimmed non-empty string or `null`. |
| `joinedAt` | Optional `datetime-local`; must be a real ISO 8601 local date-time when present. | `YYYY-MM-DDTHH:mm:ss`, or `null`; no timezone conversion. |
| `isActive` | Boolean switch/checkbox; defaults to `true` in new mode. | Boolean, always included. |

The `joinedAt` contract is `string` with OpenAPI `date-time` format. The implementation must follow the existing Episode editor’s local `datetime-local` convention: preserve date and time components and add seconds when absent. The contract does not state a timezone interpretation; this package must not invent UTC conversion or a timezone selector.

## 9. Success Criteria

1. The two scoped routes replace their placeholders with one accessible Team Member editor feature.
2. Create calls only `POST /api/admin/team-members` internally and results in the documented backend `201` behavior.
3. Edit calls only `GET` and `PUT /api/admin/team-members/{id}` internally and distinguishes invalid IDs, `404`, and other fetch failures.
4. All twelve requested fields render, hydrate, validate, normalize, and submit with their exact OpenAPI names.
5. New mode defaults `isActive` to `true`; edit mode preserves the API value, with a safe false fallback only when the optional response value is absent.
6. No component or route page calls `fetch()`, and no business logic is added to `app/`.
7. The end-to-end data path is `UI → hooks → services → app/api → features/server → lib/api → @cafedebug/api-client → backend`.
8. Field, load, not-found, submission, and retry states work in both themes using only semantic design tokens.
9. The existing Team Members list remains behaviorally and structurally unchanged.
