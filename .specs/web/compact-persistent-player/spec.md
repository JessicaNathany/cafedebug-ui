# Spec: Compact Persistent Episode Player

| Field | Value |
| --- | --- |
| **Status** | `Implemented` |
| **Domain** | `web/player` |
| **Route impact** | Persistent shell; exercised from `/episodes/[slug]` |
| **Scope** | The existing sticky player only |
| **Visual source** | `cafedebug.pen` — Episode Detail `VkDts` / `Oh9Bv`, player panel `E53fPU` |

## Problem

The persistent footer currently confirms that an episode is playing, but it only exposes
play/pause, metadata and a link. A listener who keeps reading the episode page must scroll
back to the full player to seek, skip, change speed or mute playback.

## Objective

Evolve the footer into a compact, persistent player that handles the most common listening
actions without recreating the full Episode Detail player. Playback remains owned by the existing
single `<audio>` element and its Zustand store.

## In scope

- An always-fixed player while a track is loaded, with space reserved at the end of document flow.
- Play/pause, truncated episode title, current time/duration and an accessible seek slider.
- Desktop controls for -15 seconds, +15 seconds, mute/unmute, playback speed and opening the
  current episode.
- Shared seek, bounded skip, duration formatting and speed-cycle behavior used by both players.
- Responsive and theme behavior, including mobile safe-area padding and focus states.
- Focused source/state tests and manual runtime validation.

## Out of scope

- A second `<audio>`, a second store, remote audio/data changes, playlist/queue controls,
  chapter navigation in the footer, or an Episode Details redesign.
- A volume-level slider. The existing mute state is the compact control that is carried forward.

## Functional requirements

1. The footer is absent until a track is loaded; thereafter it remains fixed at the viewport
   bottom while navigating and cannot cover the final page/footer content.
2. Its seek slider sets the same position used by the full player. The full player slider does
   the same, so either surface updates the other immediately.
3. -15s and +15s stay within `0..duration`; they use the active track and do not load a second
   audio element.
4. Play/pause, mute and speed changes update both player surfaces through the existing shared
   state. Speed cycles through the existing `1x`, `1.25x`, `1.5x` choices.
5. "Abrir episódio" navigates to the active track's detail route.
6. Every icon-only control has a Portuguese accessible name. Seek is keyboard operable, reports
   its numeric value and announces the current/total time through its label.

## Acceptance criteria

- A loaded track renders one fixed player, one `<audio>` and a document-flow inset.
- Desktop exposes play/pause, title, current/duration, seek, -15s, +15s, mute, speed and open.
- Mobile preserves play/pause, title, current/duration, seek and open; secondary controls do not
  consume the viewport.
- Long titles truncate instead of creating horizontal overflow.
- The full and compact players share a single store and playback control helpers; neither
  duplicates audio state.
- Dark/light surfaces, hover, focus and disabled states use existing semantic tokens.
- The detail page, footer and terminal content remain reachable above the player at 1440, 768 and
  390px.
