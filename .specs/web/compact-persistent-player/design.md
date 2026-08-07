# Design: Compact Persistent Episode Player

| Field | Value |
| --- | --- |
| **Status** | `Implemented` |
| **Pencil file** | `/cafedebug.pen` |
| **Node index** | `.specs/web/foundation/ux-design-reference.md` |
| **Dark page node** | `VkDts` |
| **Light page node** | `Oh9Bv` |
| **Component node** | `E53fPU` (full player; inspected as the component source) |
| **Feature folder** | `apps/web/src/features/player` |

## Design-source decision

Pencil has no separate rich sticky-player frame. `E53fPU` explicitly defines the existing full
player's top, progress and transport anatomy, while the design reference defines the mini-player
as a condensed top + progress version. This feature therefore reuses that anatomy and tokens; its
desktop/mobile composition below is an intentional responsive inference, not a copied external
reference. No Pencil document is modified.

## Desktop composition

The fixed surface is a compact single-row bar. Its composition, in priority order, is:

`[play/pause] [title] [current time] [seek track] [duration] [-15s] [+15s] [mute] [speed] [open]`

- Play/pause is the orange primary action.
- Title is a single line, `min-w-0`, and truncates before it can displace controls.
- The seek track is the widest flexible item and is a native range control, not a decorative
  progress bar. Time values use tabular mono text.
- Skip, mute and speed are compact secondary actions. Open episode is a text link with an external
  route purpose, not a full-player control.
- Five-second controls and the chapters link remain exclusive to the full player.

## Mobile composition

At widths below `md`, the player uses two compact rows:

`[play/pause] [title + current/duration] [open]`

`[full-width seek track]`

Skip, mute and speed are hidden. The bar adds `env(safe-area-inset-bottom)` padding; all visible
touch controls retain a 40px minimum target. At `md`, skip and mute return; at `lg`, speed returns.

## Layout and visual contract

- `fixed inset-x-0 bottom-0 z-40`; a matching rendered spacer reserves its responsive height in
  flow only when a track is loaded.
- The outer surface uses `bg-card/95`, `backdrop-blur` and the existing `border-border` top edge;
  inner content uses the established page container and responsive gutters.
- Reuse `Button`, semantic text/surface tokens, `rounded-pill`, `font-primary` and
  `font-secondary`. Do not add raw colors, radii, shadows or new global tokens.
- The progress uses existing primary/secondary theme colors through native control styling. Its
  focus state uses `outline-ring`; its label includes formatted current time and duration.
- Popovers are intentionally not introduced: speed preserves the established cycle button and mute
  is a direct toggle. This keeps the persistent bar compact and prevents upward/downward popover
  collision concerns.

## Component and state contract

| Component | Change | Responsibility |
| --- | --- | --- |
| `player-controls.ts` | New feature helper | Shared formatting, bounded seek/skip and rate cycle values. |
| `player-progress.tsx` | New feature component | Accessible range slider driven by a passed track/position callback. |
| `mini-player.tsx` | Evolve | Fixed responsive compact player composed from shared controls. |
| `full-player.tsx` | Evolve | Replace decorative progress with the shared interactive seek control. |
| `store.ts` | Reuse | Remains the sole playback state; no new audio state. |
| `player-provider.tsx` | Reuse | Remains the sole `<audio>` owner. |

## Interaction and accessibility

- Slider `min`, `max`, `step` and current value are numeric seconds; arrows/Home/End work through
  native range behavior. Its accessible name includes current and total formatted time.
- A user drag or keyboard seek calls `setPosition`; the provider synchronizes that store change to
  the one audio element. Time updates from the audio update both controls.
- Buttons have pt-BR names and visible tokenized focus. `aria-pressed` stays on mute; speed states
  its current value in its name.
- The fixed player is an `aside` with a clear label. The inert spacer is `aria-hidden`.
- The slider is bounded even when state is stale; a missing track renders no control.

## Viewports and themes

| Viewport | Required behavior |
| --- | --- |
| 1440 × 1200 | Complete desktop control set, no wrapping or footer obstruction. |
| 768 × 1024 | Title/seek retain priority; skip and mute remain available. |
| 390 × 844 | Two-row core composition only, safe area included, no horizontal overflow. |

The component follows the document theme in both `VkDts` and `Oh9Bv`; only site chrome remains
always-dark. Hover/focus/active states remain visible in both modes.
