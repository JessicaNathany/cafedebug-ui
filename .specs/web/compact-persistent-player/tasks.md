# Tasks: Compact Persistent Episode Player

| Phase | Status | Evidence gate |
| --- | --- | --- |
| Specification | Complete | `spec.md` defines scope, controls and exclusions. |
| Design | Complete | `design.md` records the Pencil evidence gap and inferred responsive contract. |
| Planning | Complete | Tasks below map each requirement to a narrow write scope. |
| Implementation | Complete | Changes stay in the player feature and focused player tests. |
| Validation | Complete | Automated quality gates and runtime checks pass. |
| Documentation | Complete | `validation.md` records final evidence and residual design-source note. |

## P1 — Shared player primitives

1. Add player-only helpers for duration formatting, position clamping and speed cycling.
2. Add an accessible native range component that accepts the existing `Track`, position and a
   callback. It must use semantic tokens and no local state.
3. Convert the full player's decorative track to that range component and shared helpers.

**Gate:** Full player still loads/pauses the same track and keyboard seek changes store position.

## P2 — Compact player composition

1. Replace the sticky layout with fixed two-row mobile / compact desktop composition.
2. Expose the selected desktop controls (-15s, +15s, mute, speed and open) with progressive
   disclosure at `md` and `lg`.
3. Render an aria-hidden spacer with the player so footer and page end cannot sit behind it.

**Gate:** One loaded track yields exactly one audio owner and one visible fixed player; title
truncates and primary actions work without overflow.

## P3 — Tests and validation

1. Add focused source/state tests for the shared store, interactive range, progressive controls
   and fixed-space reservation.
2. Exercise play/pause, seek from both surfaces, ±15s, speed and mute synchronization.
3. Validate 1440/768/390 layouts in dark and light themes; run lint, typecheck, test, build and
   `git diff --check`.

**Gate:** All commands pass and `validation.md` contains the evidence, including any environment
limitation.
