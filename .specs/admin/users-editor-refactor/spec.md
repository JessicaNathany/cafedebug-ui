# Admin Users Editor

| Field | Value |
|---|---|
| **Status** | `Draft` |
| **Domain** | `admin/users` |
| **Routes in scope** | `/users/new`, `/users/[id]/edit` |
| **Primary contract source** | Backend users API + generated `@cafedebug/api-client` users resource |
| **Data reference for this spec** | `UserAdmin` fields: `id`, `name`, `email`, `hashedPassword`, `createdAt`, `updatedAt` |

## 1. Overview

Deliver a production-ready Users editor for create and edit flows in the admin app. This spec covers only `/users/new` and `/users/[id]/edit`, preserving list responsibilities under `users-list-refactor`.

## 2. Problem

The users list can navigate to create/edit routes, but the editor flow is not specified end-to-end. Without a concrete contract, implementation risks mismatched fields, payload drift, and inconsistent state handling.

## 3. Goals

1. Provide complete create and edit workflows for admin users.
2. Keep route files thin and concentrate behavior under `features/users`.
3. Align editable fields with backend contract: `name`, `email`, and `password` (write-only).
4. Expose `createdAt` and `updatedAt` in edit mode as read-only metadata.
5. Reuse architecture flow: `UI -> hooks -> services -> app/api -> features/server -> lib/api -> @cafedebug/api-client -> backend`.
6. Ensure light/dark parity with semantic tokens only.

## 4. Non-goals

- Any change to `/users` list behavior.
- Direct display or edit of `hashedPassword`.
- Delete user workflow, role/permission management, or bulk actions.
- Backend schema/endpoint changes.

## 5. User Flows

### Create flow

1. Open `/users/new`.
2. Form renders empty defaults.
3. Admin fills `name`, `email`, and `password`.
4. Validation runs through RHF + Zod.
5. Submit to `POST /api/admin/users`.
6. On success, invalidate users queries and navigate to `/users`.
7. On error, keep values and render normalized submit error.

### Edit flow

1. Open `/users/[id]/edit`.
2. Parse positive integer `id`; invalid ids render invalid-id state and skip fetch.
3. Load detail from `GET /api/admin/users/{id}`.
4. Hydrate form with `name` and `email`.
5. Show `createdAt` and `updatedAt` read-only (`updatedAt` may be `null`).
6. Password is optional in edit mode:
   - empty password: keep current hash
   - non-empty password: submit as plain password for backend hashing
7. Submit to `PUT /api/admin/users/{id}`.
8. On success, reset form from response, clear dirty state, remain on route.

## 6. Routes and API Scope

| Route | Mode | Behavior |
|---|---|---|
| `/users/new` | `new` | No detail fetch; submit create |
| `/users/[id]/edit` | `edit` | Validate id, fetch detail, submit update |

| Internal route | Method | Purpose |
|---|---|---|
| `/api/admin/users` | `POST` | Create user |
| `/api/admin/users/{id}` | `GET` | Load user detail |
| `/api/admin/users/{id}` | `PUT` | Update user |

## 7. Field Contract

| UI field | Editable | Rule |
|---|---|---|
| `id` | No | Positive integer route param in edit mode |
| `name` | Yes | Required, trimmed non-empty |
| `email` | Yes | Required valid email, trimmed/lowercased |
| `password` | Yes | Required in create; optional in edit; never hydrated from backend |
| `createdAt` | No | Read-only in edit mode |
| `updatedAt` | No | Read-only in edit mode; render `—` when null |
| `hashedPassword` | No | Never shown and never sent by client |

### Payload rules

- Create payload: `name`, `email`, `password`.
- Update payload: `name`, `email`, `password?` (only when non-empty).
- `hashedPassword`, `createdAt`, and `updatedAt` are excluded from request payloads.

## 8. Error and State Behavior

- Invalid ID -> invalid-id state (no request).
- `404` on detail -> not-found state with back action.
- Other detail failures -> load-error state with retry + back.
- Submit failures -> inline submit-error alert; preserve values.

## 9. Acceptance Criteria

1. `/users/new` and `/users/[id]/edit` deliver full editor flows.
2. Editor supports `name`, `email`, and write-only `password`.
3. Edit mode shows `createdAt` and `updatedAt` as read-only values.
4. UI never renders or submits `hashedPassword`.
5. Empty password in edit mode preserves current hash.
6. Routes remain thin and components avoid direct backend fetches.
