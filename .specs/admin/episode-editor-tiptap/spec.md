# Episode Show Notes Editor (Tiptap + HTML Source)

## Overview

Keep the existing Tiptap-based Show Notes editor and replace the `Preview` mode with an editable `HTML` source mode.  
The Show Notes control becomes `Write | HTML`, where:

- `Write` is the rich-text Tiptap surface;
- `HTML` is a CodeMirror-based source editor for the same `description` field.

The backend contract stays unchanged: `description` remains an HTML string in form state and API payloads.

## Problem

The current Show Notes control gives rich editing, but it does not provide direct source-level control for advanced editors who need to inspect and adjust generated HTML.

## Goals

- Replace `Write | Preview` with `Write | HTML`.
- Keep `description` as the only persisted source-of-truth in RHF.
- Add an HTML source editor with live two-way sync (debounced) to Tiptap.
- Preserve create/edit lifecycle behavior, dirty-state semantics, and submit flows.
- Keep route files thin and feature boundaries unchanged.

## Non-goals

- No backend schema or endpoint changes.
- No migration of non-Show-Notes fields to Tiptap.
- No collaboration/version-history features.
- No arbitrary HTML fidelity guarantee outside Tiptap schema support.

## Users and Use Cases

### Primary user

- Admin editors maintaining episode show notes.

### Use cases

- Write and format notes visually in Tiptap.
- Switch to `HTML` and edit source directly.
- Return to `Write` and continue visual editing after normalization.
- Submit from either mode with unchanged payload semantics.

## User Flows

### Flow 1 — Write to HTML source

1. Admin opens `/episodes/new` or `/episodes/[id]/edit`.
2. Admin edits content in `Write`.
3. Admin switches to `HTML`.
4. Source editor shows latest canonical HTML from Tiptap.
5. Admin adjusts HTML; RHF `description` updates immediately.

### Flow 2 — HTML source back to Write

1. Admin edits source in `HTML`.
2. Debounced sync applies source back to Tiptap.
3. Unsupported markup is normalized/dropped per Tiptap schema rules.
4. Admin switches to `Write` and sees normalized rich content.

## Routes or Screens

- `apps/admin/src/app/(admin)/episodes/new/page.tsx`
- `apps/admin/src/app/(admin)/episodes/[id]/edit/page.tsx`
- `apps/admin/src/features/episodes/components/episode-editor-form.tsx`

## Constraints

- Must follow feature architecture (`features/episodes/*` owns behavior).
- Must keep `episodeEditorSchema.description` as a `string`.
- Must preserve `toEpisodeRequestPayload` behavior for save-draft/publish.
- Must remain client-safe for App Router (`'use client'`, hydration-safe editor init).
- Must not render raw HTML in source mode (`dangerouslySetInnerHTML` is not used there).

## Success Criteria

1. Mode toggle is `Write | HTML` (no `Preview` in v1).
2. HTML mode uses a code editor and allows direct HTML edits.
3. Write and HTML modes stay in sync without infinite update loops.
4. Switching modes without content edits does not create false-dirty state.
5. Existing HTML loads correctly on edit routes and remains editable in both modes.
6. Save Draft and Publish continue submitting `description` as HTML string.
7. Existing loading/error/invalid-id/submit-error/telemetry behavior remains unchanged.

## Risks and Open Questions

- Risk: source HTML may be normalized when parsed by Tiptap.
  - Mitigation: helper copy in UI clarifies normalization behavior.
- Risk: aggressive mode switching could cause sync churn.
  - Mitigation: debounced source-to-editor sync + explicit flush on `HTML -> Write`.
- Risk: unsupported HTML can be lossy.
  - Mitigation: accept schema-bound normalization as product default in v1.

## Handoff Status

- **Phase:** Specification
- **What changed:** Re-scoped mode behavior from `Write | Preview` to `Write | HTML` with live two-way sync and CodeMirror source editing.
- **Where:** `.specs/admin/episode-editor-tiptap/spec.md`
- **Unresolved risks or blockers:** schema normalization differences for arbitrary source HTML.
- **Approval status:** Draft, ready for design/task execution.
