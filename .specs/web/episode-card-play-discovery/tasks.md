# Tasks: Descoberta da ação Play no Episode Card

| Campo | Valor |
| --- | --- |
| Status | Completed — P07 light-theme surface intensity refined |
| Spec | .specs/web/episode-card-play-discovery/spec.md |
| Design contract | .specs/web/episode-card-play-discovery/design.md |
| Owner domain | apps/web/src/features/episodes |
| Routes/consumers | /, /episodes, /episodes/[slug] |
| Implementation boundary | EpisodeCard owns the interaction; PlayButton and player/store retain their current responsibilities |

## 1. Planning decision and non-negotiable constraints

The previously recorded state-evidence gap is resolved for this implementation plan:

- The restrained interactive highlight is the existing `secondary/50` surface lift on EpisodeCard.
  It changes only the tokenized card background while hover/focus is active; the Pencil `border`
  ring remains unchanged and no raw color, shadow, radius, border width or layout value is added.
- The centered Play control uses opacity-only reveal on fine-pointer default/hover/focus. It has no
  scale or transform. Reduced motion disables the opacity transition.
- The no-hover/coarse default is visible; capability media queries, not viewport breakpoints, decide
  this behavior.
- Decorative overlays do not receive pointer events. Only the Play button is pointer-active above
  the artwork link. This protects the existing detail route and playback split.
- No page-specific prop, CSS, event handler, API call, state hook or app-route change is permitted.

This is a token-only interaction judgement based on the requested restrained modern-media behavior.
The implementation must re-inspect FGSFI and verify that the `secondary/50` surface lift remains
visually restrained in both themes; if it does not, stop and return to Design rather than introduce
a new visual value.

## 2. Ordered execution tasks

### P01 — Freeze baseline and prepare acceptance tests

**Responsible:** Frontend Blacksmith, reviewed by The Debugger

1. Inspect the current EpisodeCard, PlayButton, usePlayer store, PlayerProvider and all five
   consumer classes named above.
2. Extend apps/web/tests/episode-card-source.test.mjs to preserve FGSFI anatomy and assert the
   shared interaction structure: a group owner, secondary-surface hover/focus treatment, opacity reveal,
   reduced-motion override, no raw visual values, and non-interactive decorative layers.
3. Extend the consumer/source coverage to prove Homepage Beta, HomepageV2, HomePage, catalogue and
   EpisodeRelated keep importing the same EpisodeCard. Do not add a card variant.
4. Preserve the existing route-source test that distinguishes detail link from Play. Add assertions
   that hit-testing structure does not rely on nested interactive elements or article onClick.

**Acceptance coverage:** AC-06, AC-08, AC-09, AC-10, AC-12.

**Exit evidence:** source tests fail before interaction code and describe behavior rather than
page-specific class sequences.

### P02 — Implement the shared media interaction in EpisodeCard

**Responsible:** Frontend Blacksmith

1. Change only apps/web/src/features/episodes/components/episode-card.tsx and focused source tests,
   unless an existing shared style location is demonstrably required.
2. Mark the existing card as the interaction group. Keep its h-103 total height, h-50 artwork,
   rounded-m, inset ring, card shadow, image sizing, badge/duration positions and body unchanged.
3. In fine-pointer hover-capable environments, make the existing Play wrapper visually opaque only
   on group hover or group focus-within; resting opacity is zero. Keep the button in DOM/tab order.
4. Use the existing `secondary/50` card surface on group hover and group focus-within. Retain the
   Pencil `ring-border` width and no other card/artwork visual treatment.
5. For no-hover and/or coarse pointer, reset Play to visible in rest. Keep the same 56px control and
   do not require a first touch to reveal it.
6. Use only opacity transition and disable it under prefers-reduced-motion: reduce. Do not add
   transform, scale, duration literal, new shadow, custom opacity value, inline style or new token.
7. Make category/duration and empty centering wrapper pointer-transparent; make only the Play button
   pointer-active. Confirm image link and title link retain their current href and accessible names.
8. Do not modify PlayButton, usePlayer, PlayerProvider, routes, fixtures or any consumer. The card
   must remain server-first with the existing PlayButton client boundary.

**Acceptance coverage:** AC-01 through AC-11.

**Exit evidence:** a small diff centered on the shared card; no fetch, hooks, app changes, raw
visual values or consumer-specific branches.

### P03 — Component and browser behavior verification

**Responsible:** The Debugger using webapp-testing

1. Component/source layer: run the focused Node test and inspect rendered source structure for
   focusable links/button, distinct accessible names and pointer-event separation.
2. Browser layer: start the web app and exercise a real rendered card on Homepage Beta, catalogue
   and related episodes. In each surface, test:
   - fine pointer rest, hover and leave;
   - Tab/Shift+Tab into artwork link, Play and title; Enter/Space behavior;
   - click/tap exact Play and artwork outside Play; assert playback versus navigation;
   - theme switch in light and dark;
   - no-hover/coarse emulation and prefers-reduced-motion: reduce.
3. At 1440×1200, 768×1024 and 390×844, record card/artwork/badge bounding rectangles before,
   during and after hover/focus and assert equality. Check document horizontal overflow.
4. No permanent browser test framework is currently configured. Do not add Playwright/Vitest/RTL
   infrastructure as part of this feature. Use the available browser automation for behavioral
   evidence; retain deterministic Node source tests for CI and document repeatable browser steps in
   the implementation validation artifact.

**Acceptance coverage:** AC-01 through AC-12, especially AC-03, AC-04, AC-05 and AC-10.

**Exit evidence:** screenshots/measurements for both themes and all viewports; playback does not
navigate, detail links do navigate, and no input capability leaves Play inaccessible.

### P04 — Pencil design review

**Responsible:** web-design-reviewer / Architect Guardian

1. Re-run Pencil MCP get_app_state, batch_get and get_screenshot for FGSFI before approving.
2. Compare runtime cards to the baseline at 1440, 768 and 390 in both themes. Confirm geometry,
   typography, clipping, category/duration legibility and no visual effect outside the existing
   secondary surface lift plus Play opacity.
3. Reject the implementation if the surface lift reads as noisy, increases geometry, causes
   overflow, uses an unapproved token/value or introduces an artwork filter/scale. Return to P02
   with the measured discrepancy; do not substitute a new effect.

**Acceptance coverage:** AC-02, AC-05, AC-06, AC-07 and AC-12.

**Exit evidence:** FGSFI and runtime screenshots named in validation notes, with an explicit pass
or rejection for the planned ring treatment.

### P05 — Regression, architecture and documentation gates

**Responsible:** The Debugger, Documentation Monk, Architect Guardian

1. Run the exact commands from repository root:

       pnpm --filter @cafedebug/web run test
       pnpm --filter @cafedebug/web run lint
       pnpm --filter @cafedebug/web run typecheck
       pnpm --filter @cafedebug/web run build
       git diff --check

2. Search changed web source to confirm app remains routing-only, no component/page fetch exists,
   no player/store responsibility moved, and no new raw colors/tokens appear in EpisodeCard.
3. Update the feature validation/documentation artifact with test results, Pencil evidence,
   browser matrix, known failures/retries and final acceptance trace. Update spec/design status to
   Implemented only after all gates pass.
4. Documentation Monk confirms this spec/design/tasks set remains the source of truth and that no
   public API, route or system documentation changed unnecessarily.

**Acceptance coverage:** AC-06 through AC-12.

**Exit evidence:** all commands pass, required evidence is documented, and Architect Guardian
performs the final architecture checklist.

## 3. Acceptance traceability

| Acceptance criterion | Primary task | Verification |
| --- | --- | --- |
| AC-01 default desktop hidden | P02 | P03 fine-pointer rest |
| AC-02 hover reveal/highlight | P02, P04 | P03 hover + Pencil comparison |
| AC-03 keyboard focus equivalence | P02 | P03 Tab and Enter/Space |
| AC-04 touch access | P02 | P03 no-hover/coarse first tap |
| AC-05 no layout shift | P02 | P03 rectangle measurements |
| AC-06 FGSFI anatomy | P01, P02 | P01 source guard + P04 |
| AC-07 theme/token parity | P02, P04 | P03 two themes + raw-value search |
| AC-08 all consumers | P01, P02 | P03 three consumer classes plus source inventory |
| AC-09 shared architecture | P01, P02 | changed-file review |
| AC-10 link/play semantics | P01, P02 | P03 hit targets, URL and player store |
| AC-11 reduced motion | P02 | P03 reduced-motion emulation |
| AC-12 tests and validation | P01, P03, P04, P05 | commands and validation artifact |

## 4. Risks, rollback and prohibited changes

| Risk | Mitigation/rollback |
| --- | --- |
| A zero-opacity Play remains focusable but is not revealed in time | group focus-within reveals before interaction; P03 keyboard test is required. |
| Absolute overlays still block artwork links | pointer-transparent decoration/centering wrapper; browser hit-test required. |
| Capability query varies on hybrid device | verify fine pointer and no-hover/coarse cases separately; do not key behavior to width. |
| Surface lift is visually too strong | P04 rejects it and returns to Design; do not introduce an alternate hardcoded treatment. |
| Source-only CI misses CSS runtime behavior | P03 supplies reproducible browser evidence without expanding testing infrastructure. |

Prohibited: production changes outside the shared card and focused tests; app route edits; fetch;
new API/schema/store state; raw colors/visual values; new tokens; page-specific variants; changes to
PlayButton semantics; layout dimensions; new analytics.

## 5. Planning exit

This plan maps every acceptance criterion to a task and validation gate. It authorizes the
implementation phase only under P01 through P05 in order. A failure at P03, P04 or P05 rejects the
implementation and returns it to P02; no partial promotion is allowed.

## 6. P06 — Surface highlight preference amendment

**Responsible:** Frontend Blacksmith, web-design-reviewer

1. Replace the fine-pointer hover and focus-within primary-ring treatment with the existing
   `bg-secondary/50` card surface lift, retaining the Pencil `ring-border` at every state.
2. Add `transition-colors` to the card and disable it under `prefers-reduced-motion`; retain the
   existing opacity-only Play reveal and all input/hit-testing rules.
3. Update the focused source test so it rejects the orange ring treatment and preserves the shared,
   token-only surface treatment.
4. Verify in light and dark at 1440, 768 and 390 that only the card background changes, no
   geometry/overflow changes, and no orange border remains.

**Acceptance coverage:** AC-02, AC-03, AC-05, AC-07, AC-11, AC-12.

**Exit evidence:** browser screenshots/measurements plus tests, lint, typecheck, build and
`git diff --check` pass; the web-design-reviewer approves the surface lift against FGSFI.

## 7. Completion

P06 replaced the orange primary-ring treatment with the existing `secondary/50` surface lift.
Runtime inspection in light and dark confirmed the retained neutral border, unchanged card/artwork
geometry, and opacity-only Play reveal. The full regression suite, lint, typecheck, production
build and whitespace check all passed.

P07 reduces only the light-theme lift to `secondary/25`, retaining `secondary/50` in dark mode.
The shared component, input behavior, geometry, and neutral border remain unchanged.
