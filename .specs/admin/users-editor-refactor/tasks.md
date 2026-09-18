# Tasks: Users Editor Refactor

## Phase 1 - Contracts and Types

- [ ] Confirm backend users editor contract for create/detail/update.
  - Paths: `.specs/admin/backend-openspec-api.json`, `packages/api-client/src/generated/**`
  - Deliverable: mapped request/response types for `name`, `email`, `password`, `createdAt`, `updatedAt`.
- [ ] Define feature-level editor types and defaults.
  - Paths: `apps/admin/src/features/users/types/users.types.ts`, `defaults.ts`
  - Deliverable: editor-safe form values and metadata shape.
- [ ] Create Zod schema for users editor.
  - Path: `apps/admin/src/features/users/schemas/user-editor.schema.ts`
  - Deliverable: create/edit validation with mode-aware password rule.

## Phase 2 - API and Server Layers

- [ ] Extend backend adapter for users create/detail/update.
  - Path: `apps/admin/src/lib/api/users-admin-api.ts`
  - Deliverable: typed adapter methods with auth/header forwarding.
- [ ] Add server handlers for users editor routes.
  - Paths: `features/users/server/users-create.handler.ts`, `users-detail.handler.ts`, `users-update.handler.ts`
  - Deliverable: normalized success/error envelopes.
- [ ] Add thin API route delegates.
  - Paths: `app/api/admin/users/route.ts`, `app/api/admin/users/[id]/route.ts`
  - Deliverable: no business logic in route files.

## Phase 3 - Service and Hooks

- [ ] Add service methods for create/detail/update internal calls.
  - Path: `features/users/services/users.service.ts`
  - Deliverable: route-safe parsing + error normalization.
- [ ] Add detail/mutation hooks.
  - Paths: `hooks/use-user-by-id.ts`, `use-create-user.ts`, `use-update-user.ts`
  - Deliverable: TanStack Query query/mutations with invalidation.
- [ ] Add orchestration hook.
  - Path: `hooks/use-user-editor.ts`
  - Deliverable: RHF wiring, mode orchestration, submit pipeline, dirty leave guard.

## Phase 4 - Editor UI

- [ ] Create route pages for new/edit.
  - Paths: `app/(admin)/users/new/page.tsx`, `app/(admin)/users/[id]/edit/page.tsx`
  - Deliverable: route-only entries rendering `UsersEditorPage`.
- [ ] Build editor composition and states.
  - Path: `features/users/users-editor-page.tsx`
  - Deliverable: invalid-id/loading/not-found/error/ready branches.
- [ ] Build form/topbar/error components.
  - Paths: `components/users-editor-topbar.tsx`, `users-editor-form.tsx`, `users-editor-error-state.tsx`
  - Deliverable: accessible inputs and actions, read-only created/updated metadata, consistent light/dark layout.

## Phase 5 - Validation

- [ ] Add or update focused tests.
  - Paths: `apps/admin/tests/users-editor-*.test.mjs`
  - Deliverable: schema rules, payload mapping, and key editor state coverage.
- [ ] Run targeted admin validation commands.
  - Commands:
    - `pnpm --filter @cafedebug/admin exec node --experimental-strip-types --test tests/users-editor-*.test.mjs`
    - `pnpm --filter @cafedebug/admin run typecheck`
    - `pnpm --filter @cafedebug/admin run lint`
- [ ] Verify architecture boundaries.
  - Deliverable: no direct `fetch()` in components/pages and no business logic in route files.

## Completion Criteria

- Users editor create/edit works end-to-end through internal routes.
- UI matches contract fields (`Name`, `Email`, `Password`, `Created`, `Updated`) and excludes `hashedPassword`.
- List behavior under `/users` remains unchanged.
