# Validation: Compact Persistent Episode Player

| Check | Result | Evidence |
| --- | --- | --- |
| Shared state / single audio | Pass | `PlayerProvider` remains the only `<audio>` owner; mini/full controls use `usePlayer`. |
| Full → compact seek | Pass | Keyboard arrow on the full range updated all three mounted range values to `13`. |
| Compact → full seek | Pass | Keyboard arrow on the visible compact range updated every range value to `1`. |
| ±15 seconds | Pass | Compact -15s from position `13` bounded all controls at `0`. |
| Speed synchronization | Pass | Compact speed changed the shared state to `1.25x`; the full-player pill reflected it. |
| Mute synchronization | Pass | Compact `Silenciar` changed its shared control to `Ativar volume`. |
| Play/pause synchronization | Pass | Pausing from the compact control changed the shared playback state and both player surfaces' labels. |
| Title / overflow | Pass | Desktop title truncates; runtime reported no horizontal overflow at 1440, 768 or 390px. |
| Responsive priority | Pass | 1440 exposes all selected controls; 768 retains skip/mute and hides speed; 390 renders the two-row core composition. |
| Footer clearance | Pass | At mobile document end, footer bottom was `731.75px`, above fixed-player top `763px`. |
| Keyboard / labels | Pass | Both players render native labeled range controls with integer steps and visible focus styling. |
| Dark / light parity | Pass | Player followed the theme toggle; light runtime surface resolved to the semantic card color with 95% opacity. |

## Automated commands

All were executed from the repository root on 2026-08-06:

```text
pnpm --filter @cafedebug/web run test       # 73 passed
pnpm --filter @cafedebug/web run typecheck  # passed
pnpm --filter @cafedebug/web run lint       # passed
pnpm --filter @cafedebug/web run build      # passed
git diff --check                            # passed
```

## Design-source note

`E53fPU` was inspected through Pencil and remains the authoritative anatomy for the full player.
Pencil has no dedicated rich sticky-player node; the compact player is the documented, token-based
responsive condensation of its top/progress/transport controls. No canvas node was changed.
