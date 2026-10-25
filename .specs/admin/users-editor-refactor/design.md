# Users Editor Refactor Design

## Architecture Overview

- `app/(admin)/users/new/page.tsx` and `app/(admin)/users/[id]/edit/page.tsx` remain route-only entries.
- `UsersEditorPage` is the feature composition boundary for create/edit state orchestration.
- Hooks own query/mutation and form lifecycle.
- Services call internal routes only.
- API routes remain thin delegates to feature server handlers.
- Server handlers call backend adapters in `lib/api/users-admin-api.ts`.

## Layer Flow

`app/(admin)/users/{new|[id]/edit}/page.tsx`
-> `features/users/users-editor-page.tsx`
-> `features/users/hooks/use-user-editor.ts`
-> `features/users/services/users.service.ts`
-> `app/api/admin/users/{route|[id]/route}.ts`
-> `features/users/server/users-{create|detail|update}.handler.ts`
-> `lib/api/users-admin-api.ts`
-> `@cafedebug/api-client`
-> backend users endpoints

## Layer Responsibilities

### `app/(admin)/users/.../page.tsx`

- Render `UsersEditorPage` with route mode/params only.
- No schema, parsing, mutations, or API calls.

### `features/users/users-editor-page.tsx`

- Compose invalid-id, loading, not-found, load-error, and ready states.
- Render topbar + form composition.
- Keep dirty-leave confirmation scoped to editor-owned back/cancel actions.

### `features/users/hooks/*`

- `use-user-editor.ts`: RHF orchestration, mode selection, submit pipeline, navigation.
- `use-user-by-id.ts`: detail query in edit mode.
- `use-create-user.ts` and `use-update-user.ts`: mutations and invalidations.

### `features/users/services/users.service.ts`

- Call `/api/admin/users` and `/api/admin/users/{id}`.
- Normalize route-safe error envelopes.
- Parse backend detail responses to UI-safe shape.

### `features/users/server/*`

- Parse route params and request body.
- Call backend adapter with auth/cookie forwarding.
- Return normalized `{ ok, data, traceId? }` success and route-safe failures.

### `lib/api/users-admin-api.ts`

- Isolate backend transport contract for create/detail/update users.
- Reuse shared auth/header normalization utilities.

## File Structure

```txt
apps/admin/src/
  app/
    (admin)/
      users/
        new/
          page.tsx
        [id]/
          edit/
            page.tsx
    api/
      admin/
        users/
          route.ts
          [id]/
            route.ts
  features/
    users/
      users-editor-page.tsx
      components/
        users-editor-topbar.tsx
        users-editor-form.tsx
        users-editor-error-state.tsx
      hooks/
        use-user-editor.ts
        use-user-by-id.ts
        use-create-user.ts
        use-update-user.ts
      schemas/
        user-editor.schema.ts
      services/
        users.service.ts
      server/
        users-create.handler.ts
        users-detail.handler.ts
        users-update.handler.ts
        users-error-response.ts
      types/
        users.types.ts
      defaults.ts
      parsers.ts
      transformers.ts
  lib/
    api/
      users-admin-api.ts
```

## API Contract

| Internal route | Method | Purpose |
|---|---|---|
| `/api/admin/users` | `POST` | Create user |
| `/api/admin/users/{id}` | `GET` | Fetch detail |
| `/api/admin/users/{id}` | `PUT` | Update user |

### Payload strategy

- Create payload includes `name`, `email`, `password`.
- Update payload includes `name`, `email`, and optional `password`.
- `hashedPassword`, `createdAt`, `updatedAt` are response/storage-only and not submitted.

## UI Structure

### Header

- Eyebrow: `Users`
- Title: `Create User` or `Edit User`
- Back action: navigate to `/users`

### Form fields

- Editable:
  - `Name`
  - `Email`
  - `Password`
- Read-only metadata (edit mode only):
  - `Created`
  - `Updated`

### Footer actions

- `Cancel`
- Primary submit:
  - `Create User` in new mode
  - `Save Changes` in edit mode

## Behavior Rules

- Password is required in new mode.
- Password is optional in edit mode; blank means no password change.
- Detail `404` produces not-found state.
- Invalid ID produces local invalid-id state.
- Submit and load errors use normalized route-safe envelopes.

## Styling Rules

- Use semantic tokens only.
- Preserve identical field/order layout in light and dark themes.
- Keep existing admin editor visual language; do not copy raw Stitch values.
- Keep `Users` as the active navigation item in both themes.
