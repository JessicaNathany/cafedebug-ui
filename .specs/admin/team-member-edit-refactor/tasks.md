# Team Members Editor — Canonical Layout Refactor Plan

| Field | Value |
|---|---|
| **Status** | `IMPLEMENTED — repository validation complete; manual authenticated-backend acceptance pending` |
| **Authority** | `spec.md` → `design.md` → this layout-only plan |
| **Route scope** | `/team-members/new` and `/team-members/[id]/edit` only |
| **Baseline** | The existing Team Members editor implementation and its current API, hooks, validation, dirty handling, fields, routes, and list integration |
| **Out of scope** | Any data/API/hook/schema/transformer/server/route behavior, Team Members list scope, Episodes/Banners, design tokens, and shared packages |

## Refactor contract

This is a **canonical-layout-only** refactor. It standardizes the existing Team Members editor with the shipped Episodes/Banners editor composition without copying their feature behavior or their arbitrary visual utilities.

- Preserve the current twelve fields, labels, RHF/Zod bindings, mutation paths, submission/error behavior, dirty Cancel/Back confirmation, `beforeunload` handling, route parameters, and all Team Members list files/behavior byte-for-byte unless a test fixture must be added.
- Preserve the required path already in place: `components → hooks → services → app/api → features/server → lib/api → @cafedebug/api-client → backend`. No component/page gains `fetch`, generated-client, service, parser, transformer, or router work.
- The only production files this refactor may modify are:
  - `apps/admin/src/features/team-members/team-member-editor-page.tsx`
  - `apps/admin/src/features/team-members/components/team-member-editor-topbar.tsx`
  - `apps/admin/src/features/team-members/components/team-member-editor-form.tsx`
  - `apps/admin/src/features/team-members/components/team-member-editor-error-state.tsx` only if its constrained state-panel markup must align with the common shell
  - `apps/admin/src/features/team-members/components/team-member-profile-photo-field.tsx` only if its local presentation must adopt the configuration-pane surface; do not change preview behavior
- Do **not** modify `app/(admin)/team-members/**`, `app/api/admin/team-members/**`, hooks, services, server handlers, schemas, types, defaults, parsers, transformers, `lib/api`, `packages/ui`, `packages/api-client`, or Team Members list files.
- Use existing semantic admin utility patterns only: `surface`, `surface-container-*`, `on-surface*`, `primary*`, `danger`, `outline-variant`, and `focus-ring`. Use the existing responsive `xl` editor split and normal Tailwind scale utilities. Do not add raw palette classes, arbitrary `[...]` visual values, raw colors, raw shadow values, theme branches, or copied Episode/Banner feature actions.
- Reuse existing local controls/primitives. No new shared primitive is justified by this layout-only scope.

## Target layout contract

1. **Persistent top bar:** every ready and non-ready screen renders the same sticky, full-width top bar. It has the editor-owned Back control, `Team members` eyebrow, mode-aware title, and form-derived Active/Inactive indicator. It uses the semantic header surface and an `outline-variant` lower separator; its pending disabled behavior remains unchanged.
2. **Ready body:** retain one semantic form page surface. Inside its constrained body, use sibling primary and configuration panes. Primary contains Identity, Profile, and Contact & social; configuration contains Profile photo, Joined at, and Active.
3. **Responsive panes:** use the established `xl` transition. Below `xl`, panes are DOM/visual order primary then configuration and use a top `outline-variant` separator. At `xl`, use the existing standard two-thirds/one-third proportion and change only that separator to the configuration pane's leading edge. Do not use arbitrary grid tracks or widths.
4. **State shells:** loading retains the page surface/top bar and mirrors the same primary/configuration stacked-to-split geometry with non-interactive, labelled skeleton blocks. Invalid ID, not-found, and load-error retain the top bar and a constrained state panel; only load error receives Retry. These screens have neither ready panes nor a footer.
5. **Ready-only footer:** the existing sticky footer appears only from `TeamMemberEditorForm`. It remains a semantic tonal surface with an `outline-variant` upper separator, constrained wrapping row, Cancel, and exactly one mode-aware primary submit action. Preserve disabled/pending and native submit behavior; introduce no draft/publish/upload/archive/delete action.

---

## Phase 1 — Foundation

**Dependency:** Approved `spec.md` and `design.md`; current Team Members editor is the functional baseline.  
**Validation checkpoint:** Scope is locked before markup changes.

- [ ] Freeze functional boundaries and map canonical references
  - **Files:** `.specs/admin/team-member-edit-refactor/tasks.md`; read-only references: `apps/admin/src/features/{episodes,banners}/**-editor-{page,topbar,form}.tsx`, `apps/admin/src/features/team-members/{hooks,services,server,schemas,types}/**`
  - **Expected result:** Record the four target layout files, the exact state/footer contract above, and the explicit exclusion of routes/API/hooks/list behavior. Derive only composition order, `xl` transition, semantic surface hierarchy, and footer/state-shell rules from Episodes/Banners.
  - **Layer:** planning / component boundary
  - **Architecture note:** No new feature layer is created. `app/` remains routing-only and existing UI → hook → service → API delegation is untouched.

- [ ] Audit available semantic admin patterns before class changes
  - **Files:** Read-only: `.specs/admin/DESIGN_SYSTEM.md`; `.github/instructions/nextjs-tailwind.instructions.md`; `apps/admin/src/features/team-members/components/*.tsx`
  - **Expected result:** Select existing semantic surface, text, border, primary, danger, and focus utilities. Replace any Team Members layout-specific arbitrary visual utility encountered in the target files with a token-mapped semantic/standard-scale equivalent; do not alter field behavior.
  - **Layer:** component
  - **Architecture note:** No raw colors, arbitrary values, custom visual tokens, dark-mode branch, or `packages/ui` expansion is permitted.

**Phase 1 validation**
- Confirm the implementation diff is limited to the allowed component/page/test paths before proceeding.

---

## Phase 2 — Core UI

**Dependency:** Phase 1 scope and semantic utility audit are accepted.  
**Validation checkpoint:** Ready editor has canonical top bar and responsive pane composition without changing controls.

- [ ] Refactor the Team Members editor top bar to the canonical header composition
  - **Files:** `apps/admin/src/features/team-members/components/team-member-editor-topbar.tsx`
  - **Expected result:** Keep the same `mode`, `active`, `disabled`, and `onBack` contract. Render the semantic sticky header with lower `outline-variant` separator, Back control, `Team members` eyebrow, mode-aware title, and semantic Active/Inactive indicator. Do not change navigation callback or derive new state.
  - **Layer:** component
  - **Architecture note:** Presentation only; no router, form mutation, fetch, or status endpoint.

- [ ] Refactor ready form into canonical primary and configuration panes
  - **Files:** `apps/admin/src/features/team-members/components/team-member-editor-form.tsx`; optionally `apps/admin/src/features/team-members/components/team-member-profile-photo-field.tsx`
  - **Expected result:** Preserve every field and RHF registration/error/ARIA attribute. Keep Identity, Profile, and Contact & social in primary; keep Profile photo URL presentation, Joined at, and Active in configuration. Below `xl`, stack primary then configuration with a semantic top separator. At `xl`, use standard two-thirds/one-third sibling panes and a semantic leading separator. Use one constrained editor body and token surfaces; no arbitrary tracks, widths, colors, or feature-specific Banner/Episode actions.
  - **Layer:** component
  - **Architecture note:** Form remains the sole ready-state owner of the native submit semantics; profile preview stays local and non-mutating.

- [ ] Normalize the ready-only action footer
  - **Files:** `apps/admin/src/features/team-members/components/team-member-editor-form.tsx`
  - **Expected result:** Retain the sticky footer only in the ready form. Use semantic tonal/footer and `outline-variant` separation with a constrained wrapping action row containing Cancel and exactly one Create Team Member/Save Changes submit button. Keep current pending labels, disabled state, and callbacks intact.
  - **Layer:** component
  - **Architecture note:** No business action is added, removed, or moved into `app/`; Cancel remains the existing hook-owned dirty-navigation path.

**Phase 2 validation**
- At narrow and `xl` widths, visually verify field order, full-width controls, no horizontal scroll, visible focus, and unchanged submit/Cancel behavior.

---

## Phase 3 — Data Integration

**Dependency:** Phase 2 ready composition is stable.  
**Validation checkpoint:** The layout refactor makes no data-layer changes.

- [ ] Verify data and route seams are unchanged
  - **Files:** Read-only: `apps/admin/src/features/team-members/hooks/use-team-member-editor.ts`; `apps/admin/src/features/team-members/services/team-members.service.ts`; `apps/admin/src/app/(admin)/team-members/new/page.tsx`; `apps/admin/src/app/(admin)/team-members/[id]/edit/page.tsx`; `apps/admin/src/app/api/admin/team-members/{route.ts,[id]/route.ts}`
  - **Expected result:** Confirm no modifications and no new imports from UI to service/API layers. New and edit retain their current modes/raw ID route behavior; list files remain untouched.
  - **Layer:** validation / architecture
  - **Architecture note:** The established `UI → hooks → services → app/api → feature server → lib/api` path is preserved, and `app/api` remains thin delegation.

- [ ] Preserve all ready-form state inputs while changing markup only
  - **Files:** `apps/admin/src/features/team-members/components/team-member-editor-form.tsx`; `apps/admin/src/features/team-members/team-member-editor-page.tsx`
  - **Expected result:** Continue passing/consuming the existing form, `active`, `isSubmitting`, `submitError`, `onCancel`, and `onSubmit` values. Submission error remains immediately below the top bar and above the form; values and panes remain mounted after error.
  - **Layer:** component / feature composition
  - **Architecture note:** No new local duplicate form, remote, or navigation state; no component fetch.

**Phase 3 validation**
- Run existing focused service/server/route tests unchanged to prove no request method, endpoint, envelope, dirty policy, or route behavior regressed.

---

## Phase 4 — UX Enhancements

**Dependency:** Phase 3 confirms functional seams are unchanged.  
**Validation checkpoint:** Every screen has the canonical identity; only ready has panes/footer.

- [ ] Refactor feature-page state shells around the common top bar
  - **Files:** `apps/admin/src/features/team-members/team-member-editor-page.tsx`; optionally `apps/admin/src/features/team-members/components/team-member-editor-error-state.tsx`
  - **Expected result:** Keep mutually exclusive invalid-ID, loading, not-found, load-error, and ready decisions unchanged. Every state has the same page surface/top bar. Invalid ID and not-found expose Back only; load error preserves Retry and Back; ready delegates to the form. Do not alter error classification, retry callback, or copy beyond semantic layout needs.
  - **Layer:** feature composition / component
  - **Architecture note:** The page calls the existing editor hook only; no fetch, payload transform, or API handling is introduced.

- [ ] Mirror the ready pane geometry in the loading shell
  - **Files:** `apps/admin/src/features/team-members/team-member-editor-page.tsx`
  - **Expected result:** Replace any arbitrary loading grid track/visual value with the same standard stacked-to-`xl` primary/configuration composition used by ready state. Keep an accessible loading label and inert skeleton blocks on semantic container surfaces. Do not render a form control, Cancel button, submit button, or footer while loading.
  - **Layer:** feature composition
  - **Architecture note:** Loading is visual state only; it must not start a second request or modify query behavior.

- [ ] Keep constrained non-ready panels distinct from ready panes
  - **Files:** `apps/admin/src/features/team-members/components/team-member-editor-error-state.tsx`; `apps/admin/src/features/team-members/team-member-editor-page.tsx`
  - **Expected result:** Use the semantic constrained state-panel pattern for invalid ID, not-found, and load error. Preserve alert/copy/actions and trace ID behavior. These branches contain no primary/configuration editor panes and no footer.
  - **Layer:** component / feature composition
  - **Architecture note:** Error state receives callbacks and data; it does not navigate, retry, or access services itself.

**Phase 4 validation**
- Manually inspect loading, invalid-ID, not-found, load-error, ready, and submission-error screens at narrow and `xl` widths. Confirm persistent top bar, correct pane/separator transition, and ready-only footer.

---

## Phase 5 — Testing & Hardening

**Dependency:** Phase 4 state shells render.  
**Validation checkpoint:** Focused source/layout assertions and manual acceptance cover the refactor without expanding test tooling.

- [ ] Strengthen focused source/layout assertions
  - **Files:** `apps/admin/tests/team-members-editor-states.test.mjs`; `apps/admin/tests/team-members-editor-routes.test.mjs`
  - **Expected result:** Add assertions that: (1) the top bar is present in ready and every non-ready branch; (2) the ready form has distinct primary/configuration panes; (3) primary precedes configuration below `xl`, and the standard two-thirds/one-third `xl` split plus top-to-leading `outline-variant` separator are represented; (4) loading represents both panes with the same responsive boundary; (5) invalid-ID/not-found/load-error have no footer; (6) only the ready form contains the sticky footer with Cancel and one mode-aware submit action; (7) the alert is between top bar and form; and (8) target Team Members layout sources contain no raw palette classes or arbitrary visual `[...]` utilities.
  - **Layer:** tests
  - **Architecture note:** Keep Node source-contract tests focused on this refactor. They supplement existing behavioral tests and do not introduce a new UI test framework.

- [ ] Retain focused architecture/source assertions
  - **Files:** `apps/admin/tests/team-members-editor-states.test.mjs`; `apps/admin/tests/team-members-editor-routes.test.mjs`
  - **Expected result:** Preserve assertions that pages are routing-only, API routes are direct delegates, form/components do not use direct fetch/router/parser/generated-client imports, and list page scope remains outside the editor change.
  - **Layer:** tests
  - **Architecture note:** No test should encourage bypassing the service/hook/API layers.

- [ ] Perform manual accessibility, responsive, and theme acceptance
  - **Files:** No production file change; record results in the implementation handoff/PR.
  - **Expected result:** Test keyboard Back/Cancel, visible focus, all field errors, Enter submit, Active, profile-preview failure, pending state, dirty Cancel/Back confirmation, `beforeunload`, retry, and no interception of sidebar/history/browser-back navigation. In light, dark, and system themes, test ready/loading/invalid-ID/not-found/load-error/submission-error at narrow and `xl` widths.
  - **Layer:** validation
  - **Architecture note:** Resolve defects with semantic tokens and layout composition only; never with raw color/theme-specific patches.

**Phase 5 validation**
```sh
pnpm --filter @cafedebug/admin exec node --experimental-strip-types --test tests/team-members-editor-states.test.mjs tests/team-members-editor-routes.test.mjs tests/team-members-editor-service.test.mjs tests/team-members-editor-server.test.mjs
pnpm --filter @cafedebug/admin run typecheck
pnpm --filter @cafedebug/admin run lint
```

---

## Phase 6 — Architecture Validation

**Dependency:** Phase 5 automated and manual acceptance pass.  
**Validation checkpoint:** Diff is limited to visual composition and its focused tests.

- [ ] Audit scope, layering, and design-system compliance
  - **Files:** Implementation diff; all allowed paths in the refactor contract; read-only route/API/hook/list paths named above
  - **Expected result:** Verify no functional/data-layer files changed; no Team Members list change; no direct fetch in pages/components; no `app/api` behavior change; no field/API/hook/dirty/route regression; and no raw palette, arbitrary visual value, custom raw shadow, or theme branch in the target UI files.
  - **Layer:** architecture validation
  - **Architecture note:** Reject cross-layer or scope-expanding fixes; return them for separate specification rather than accepting them in this refactor.

- [ ] Produce Frontend Blacksmith → Debugger handoff
  - **Files:** Pull request description/implementation handoff; this plan remains authoritative
  - **Expected result:** Report changed visual/test paths, command results, manual state/theme matrix, and confirmation that all functional layers and Team Members list files were unchanged. Request Debugger review only after this phase passes.
  - **Layer:** handoff
  - **Architecture note:** No documentation-writer task is required: this changes no public/contributor contract. Invoke it separately only if implementation expands scope or changes an extension point.

**Phase 6 validation**
```sh
pnpm --filter @cafedebug/admin run test
pnpm --filter @cafedebug/admin run lint
pnpm --filter @cafedebug/admin run typecheck
pnpm --filter @cafedebug/admin run build
pnpm run ci:validation
git diff --check
git diff -- apps/admin/src/features/team-members apps/admin/tests/team-members-editor-states.test.mjs apps/admin/tests/team-members-editor-routes.test.mjs
```

## Delivery status

**IMPLEMENTED — repository validation complete; manual authenticated-backend acceptance pending.** The implementation remains bounded by this plan: any future change to fields, API layers, hooks, dirty policy, route behavior, Team Members list scope, shared design tokens/primitives, or Episode/Banner source requires a separate approved specification.
