# Tasks: Episode Show Notes Editor (`Write | HTML`)

**Status:** Draft  
**Spec:** `.specs/admin/episode-editor-tiptap/spec.md`  
**Design:** `.specs/admin/episode-editor-tiptap/design.md`  
**Assigned to:** Frontend Blacksmith -> The Debugger -> Documentation Monk

---

## Prerequisites

- [ ] Spec approved by Architect Guardian
- [ ] Design approved by Architect Guardian
- [ ] Scope confirmed: Show Notes only, no backend contract changes

---

## Phase 1 — Dependencies and foundation

### Task 1.1 — Add source editor dependencies

- [ ] Add `@uiw/react-codemirror`, `@codemirror/lang-html`, `@codemirror/view`
- [ ] Update `apps/admin/package.json` and `pnpm-lock.yaml`

### Task 1.2 — Extend serialization helper service

- [ ] Add helper to apply source HTML to Tiptap and return canonical HTML
- [ ] Keep `description` empty-content helpers intact

---

## Phase 2 — Hook orchestration

### Task 2.1 — Replace preview state with source state

- [ ] Remove `previewHtml` / `updatePreviewHtml` from `useEpisodeShowNotesEditor`
- [ ] Add `sourceHtml` state and source update callbacks

### Task 2.2 — Add live two-way sync with debounce

- [ ] Source editor updates RHF immediately
- [ ] Debounced source->editor apply (`setContent(..., false)`)
- [ ] Canonicalization via `getHTML()` after apply

### Task 2.3 — Add loop guards and lifecycle safety

- [ ] Prevent editor↔RHF sync loops (`isInternalUpdate`, source-origin guard)
- [ ] Flush pending source sync on mode change back to `Write`
- [ ] Clear debounce timer on unmount

---

## Phase 3 — UI integration

### Task 3.1 — Update Show Notes mode toggle

- [ ] Change mode union from `write | preview` to `write | html`
- [ ] Update segmented control labels to `Write` and `HTML`

### Task 3.2 — Replace preview panel with CodeMirror

- [ ] Render CodeMirror in HTML mode
- [ ] Wire HTML language extension and line wrapping
- [ ] Preserve validation error slot and existing shell layout

### Task 3.3 — Keep toolbar behavior compatible

- [ ] Disable toolbar while in HTML mode
- [ ] Keep existing command set and active-state behavior in Write mode

### Task 3.4 — Remove preview-only artifacts

- [ ] Remove preview component and preview sanitizer service if unused
- [ ] Ensure no stale imports remain

---

## Phase 4 — Tests and regressions

### Task 4.1 — Add serialization regression tests

- [ ] Cover empty HTML semantics
- [ ] Cover source->editor canonicalization helper behavior

### Task 4.2 — Run existing payload compatibility tests

- [ ] Ensure `episodes-editor-payload.test.mjs` remains green
- [ ] Confirm `description` remains string in payload contract

### Task 4.3 — Manual behavior checks

- [ ] `Write -> HTML -> Write` switching preserves content
- [ ] Submit from HTML mode works
- [ ] Unsupported HTML normalizes without crashing

---

## Phase 5 — Quality gates and docs

### Task 5.1 — Run quality gates

- [ ] `pnpm --filter @cafedebug/admin lint`
- [ ] `pnpm --filter @cafedebug/admin typecheck`
- [ ] `pnpm --filter @cafedebug/admin test`

### Task 5.2 — Keep SDD artifacts aligned

- [ ] Confirm this spec/design/tasks set reflects final behavior (`Write | HTML`)

---

## Validation checklist (Debugger gate)

### Architecture

- [ ] All new behavior remains under `features/episodes/*`
- [ ] No route-layer business logic added to `app/*`
- [ ] Schema/transformer/API contract unchanged

### Behavior

- [ ] Mode toggle is `Write | HTML`
- [ ] Source editor is editable and synced with RHF `description`
- [ ] Debounced live sync updates Tiptap from source edits
- [ ] `HTML -> Write` flushes pending source updates
- [ ] No infinite sync loops

### Regression

- [ ] Dirty-state behavior remains correct
- [ ] Create/edit flows remain intact
- [ ] Save draft/publish flows remain intact
- [ ] Existing tests pass

---

## Definition of done

- [ ] Preview mode removed from Show Notes v1 scope
- [ ] HTML source mode implemented with CodeMirror
- [ ] Live two-way sync with canonicalization is stable
- [ ] No backend/API contract changes
- [ ] Admin lint/typecheck/test gates pass
