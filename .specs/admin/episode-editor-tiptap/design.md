# Design: Episode Show Notes Editor (`Write | HTML`)

| Field | Value |
|---|---|
| **Status** | `Draft` |
| **Spec** | `.specs/admin/episode-editor-tiptap/spec.md` |
| **Source of truth** | `.specs/admin/stitch/cafedebug-admin/code/themes/*/episode-edit.html` |
| **Token source** | `.specs/admin/DESIGN_SYSTEM.md` + `packages/design-tokens/styles.css` |

---

## 1. Overview

This design replaces Show Notes `Preview` mode with an editable HTML source mode.  
The feature remains fully inside `features/episodes` and keeps the same form/payload contract (`description: string`).

---

## 2. Architecture decisions

Preserved boundaries:

- `app/` routes remain thin.
- `useEpisodeEditor` remains owner of fetch/reset/mutation/telemetry/navigation orchestration.
- `episodeEditorSchema` and `toEpisodeRequestPayload` remain unchanged.
- `description` remains HTML string in RHF and API payload.

New authoring model:

- `Write`: Tiptap editor surface.
- `HTML`: CodeMirror source editor.
- Single persisted value: RHF `description`.

---

## 3. File structure

```text
apps/admin/src/features/episodes/
  components/
    episode-editor-form.tsx
    episode-show-notes-field.tsx
    episode-show-notes-toolbar.tsx
  hooks/
    use-episode-editor.ts
    use-episode-show-notes-editor.ts
  services/
    episode-show-notes-serialization.ts
  schemas/
    episode.schema.ts
```

---

## 4. Responsibilities

- `episode-show-notes-field.tsx`
  - Renders label, `Write | HTML` toggle, editor surface, helper copy, and field errors.
  - Keeps toolbar disabled while in HTML mode.
- `use-episode-show-notes-editor.ts`
  - Owns Tiptap init, command set, active states.
  - Owns source-mode sync helpers and loop guards.
- `episode-show-notes-serialization.ts`
  - Owns HTML extraction + source-to-editor canonicalization helper.

---

## 5. UI/UX structure

### 5.1 Field changes

| Path | Change |
|---|---|
| `apps/admin/src/features/episodes/components/episode-show-notes-field.tsx` | Replace `Preview` tab with `HTML`; render CodeMirror source editor panel instead of rendered preview block. |
| `apps/admin/src/features/episodes/hooks/use-episode-show-notes-editor.ts` | Add source HTML state, debounced source->editor sync, explicit flush/sync methods, and loop guards. |
| `apps/admin/src/features/episodes/services/episode-show-notes-serialization.ts` | Add `syncEditorFromHtmlSource()` for canonicalization after applying source HTML. |
| `apps/admin/package.json` + `pnpm-lock.yaml` | Add CodeMirror dependencies. |

### 5.2 Source editor UX

- Code editor: `@uiw/react-codemirror` + `@codemirror/lang-html`.
- No HTML rendering in source mode.
- Helper text: unsupported HTML can be normalized by Tiptap schema.

---

## 6. Data flow

### 6.1 Write mode updates

1. User edits Tiptap content.
2. Hook serializes with `editor.getHTML()`.
3. RHF `description` is updated (`setValue` with dirty/touch/validate flags).
4. Source editor state mirrors latest canonical HTML.

### 6.2 HTML mode updates

1. User edits source HTML in CodeMirror.
2. RHF `description` updates immediately.
3. Hook debounces source->editor apply.
4. On apply: `setContent(html, false)` and canonicalize with `getHTML()`.
5. If canonical HTML differs, RHF is updated with canonical value.

### 6.3 Mode transitions

- `Write -> HTML`: sync source state from current editor HTML.
- `HTML -> Write`: flush pending source sync before switching.

---

## 7. Sync and loop-guard rules

- `isInternalUpdate` ref prevents editor-originated `onChange` from re-applying to editor.
- `isSourceUpdate` ref prevents source-originated form updates from triggering immediate duplicate apply path.
- Debounce timer governs source->editor live sync.
- Cleanup on unmount clears pending timer.

---

## 8. Edge cases

| Risk | Mitigation |
|---|---|
| Infinite editor/form update loops | Dual guard refs + controlled sync points. |
| Source HTML incompatible with schema | Canonicalization path; never crash on apply attempts. |
| False dirty-state on mode switch | Flush/sync methods avoid noop churn and preserve existing RHF semantics. |
| Hydration mismatch | Existing `immediatelyRender: false` remains. |

---

## 9. Accessibility and tokens

- Keep programmatic label association for Show Notes.
- Preserve focus-visible states for toggle/buttons/editor.
- Keep token-based styling (no new hardcoded hex values).
- Toolbar remains keyboard reachable; disabled when source mode is active.

---

## 10. Acceptance mapping

| Spec acceptance | Design mechanism |
|---|---|
| `Write | HTML` mode toggle | Updated segmented control in `EpisodeShowNotesField`. |
| Editable HTML source | CodeMirror integration with HTML language mode. |
| Live two-way sync | Debounced source->editor + editor->RHF immediate sync. |
| Canonicalization | `syncEditorFromHtmlSource()` helper. |
| No contract drift | Unchanged schema/transformer/API payload shape. |

---

## 11. Governance handoff (Design phase)

- **Phase:** Design
- **What changed:** Replaced preview-render architecture with editable HTML source architecture and canonicalization flow.
- **Where:** `.specs/admin/episode-editor-tiptap/design.md`
- **Unresolved risks:** arbitrary HTML lossiness due to schema normalization.
- **Approval status:** Draft design ready for task execution.
