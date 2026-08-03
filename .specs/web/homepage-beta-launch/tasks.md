# Tasks: Homepage Beta Launch Parity

| Field | Value |
| --- | --- |
| **Status** | `Implemented` |
| **Spec** | `.specs/web/homepage-beta-launch/spec.md` |
| **Design** | `.specs/web/homepage-beta-launch/design.md` |
| **Plan** | `.specs/web/homepage-beta-launch/plan.md` |

## Phase 0 — Approval gates

- [x] Confirm spec validation status is `Approved` after `web-design-reviewer` review.
- [x] Record the inspected Pencil nodes in the approved spec/design package.
- [x] Preserve the user-modified `cafedebug.pen`; do not edit it during web implementation.

## Phase 1 — Preserve website 2.0 first

- [x] Move the current homepage composition behind an exported `HomepageV2` boundary without changing its behavior.
- [x] Extract or preserve the inline stats, News/Agenda, and newsletter composition so no existing UI is lost.
- [x] Preserve the header subscription action as an explicit reusable variant/component.
- [x] Retarget existing G03-G10 source tests to the preserved V2 modules without weakening their assertions.
- [x] Add a preservation contract test for protected components, mocks, assets, copy, and exports.

Gate: `AC-PRES-01`, `AC-PRES-02`, `AC-PRES-03` pass before beta implementation begins.

## Phase 2 — Establish beta shell and theme behavior

- [x] Create a route-scoped beta shell that renders theme-following Header/Footer on `/` without changing episode-detail chrome.
- [x] Adapt/reuse `ThemeToggle` to Pencil's 40x40 Sun/Moon control.
- [x] Prove cookie persistence, server-readable first paint, correct initial icon, and no hydration flash.
- [x] Preserve fixed-dark Header/Footer and Subscribe variants for V2/content routes.
- [x] Add focused header/theme source and runtime tests.

Gate: `AC-THEME-01` through `AC-THEME-04` pass in dark and light.

## Phase 3 — Build banner carousel

- [x] Add banner types and four deterministic fixtures under `features/banners`.
- [x] Localize the exact four Pencil image fills under `apps/web/public/mock`.
- [x] Implement `BannerCarousel` as the isolated client boundary.
- [x] Implement exact slide copy, CTA labels, tabs, active bars, counter, and arrows.
- [x] Implement manual wrap navigation, keyboard/focus behavior, hidden-slide semantics, and reduced motion.
- [x] Confirm no autoplay timer, layout shift, direct fetch, or raw visual colors.

Gate: `AC-CAR-01`, `AC-CAR-02`, `AC-CAR-03` pass.

## Phase 4 — Compose Homepage Beta

- [x] Add the server-first `HomepageBeta` composition and route `/` to it.
- [x] Match the 734px hero with `728x574` carousel and `520x559` player.
- [x] Omit stats, News, and Agenda from beta output.
- [x] Keep and theme the newsletter/footer to the beta root mode.
- [x] Promote the Pencil hero glow to semantic web-design tokens if no suitable token exists.

Gate: `AC-PARITY-01` through `AC-PARITY-04`, `AC-DROP-01`, and `AC-NL-01` pass.

## Phase 5 — Expand recent episode fixtures

- [x] Append EP 138, 137, and 136 with exact Pencil copy.
- [x] Add deterministic local artwork and guest avatars for Camila Ferreira, Diego Andrade, and Juliana Prado.
- [x] Render `episodes.slice(1, 7)` or an equivalent explicit selection that excludes featured EP 142.
- [x] Match desktop 3x2, tablet 2x3, and mobile 1x6 layouts while reusing `EpisodeCard`.
- [x] Add exact count/order and responsive-grid tests.

Gate: `AC-EP-01`, `AC-EP-02`, `AC-PLAYER-01` pass.

## Phase 6 — Debug and design validation

- [x] Run `pnpm --filter @cafedebug/web run lint`.
- [x] Run `pnpm --filter @cafedebug/web run typecheck`.
- [x] Run `pnpm --filter @cafedebug/web run test`.
- [x] Run `pnpm --filter @cafedebug/web run build`.
- [x] Run `git diff --check`.
- [x] Use `web-design-reviewer` with Pencil `b3Kzt` and `F0E1s` at 1440px.
- [x] Capture runtime dark/light at 1440x1200, 768x1024, and 390x844.
- [x] Check fonts, copy, section geometry, carousel state, theme persistence, focus, reduced motion, hidden slides, card count/order, and horizontal overflow.
- [x] Record every residual difference; do not approve subjective “close enough” parity.

Gate: `AC-QA-01`, `AC-QA-02` pass and reviewer verdict is approved.

## Phase 7 — Documentation handoff

- [x] Maintain the already-added Homepage Beta node index in `.specs/web/foundation/ux-design-reference.md`; update it only if implementation evidence changes this contract.
- [x] Mark this spec/design/tasks package with final delivery status.
- [x] Keep `.specs/web/homepage-visual-parity/` indexed as the preserved website 2.0 contract.
- [x] Document local banner asset provenance and any responsive inference.
- [x] Handoff with changed paths, test evidence, reviewed Pencil nodes, residual risks, and explicit approval/rejection.
