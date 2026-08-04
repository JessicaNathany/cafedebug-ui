# Homepage Beta Launch Difference Plan

## Status

Implementation and reviewer validation are complete. The launch `/` route now uses `HomepageBeta`; the former implementation remains preserved and testable as `HomepageV2`.

## Evidence

- Current app: `http://localhost:3000/`
- Live dark viewports: `1440x1200`, `768x1024`, `390x844`
- Pencil dark: `fm0R5` / `b3Kzt`
- Pencil light: `B3qM0p` / `F0E1s`
- Pencil component: Header `m9zV96`, Episode Card `FGSFI`, Footer `LSgoB`
- Current source: `apps/web/src/features/episodes/components/home-page.tsx`
- Current baseline tests: `pnpm --filter @cafedebug/web run test` passed 32/32 on 2026-08-02 during this specification audit.

Final runtime evidence, including light-theme persistence, carousel interaction, exact desktop geometry, and inferred responsive behavior, is recorded in `validation.md`.

## Measured page difference

| Section | Current live | Homepage Beta | Required change |
| --- | ---: | ---: | --- |
| Header | 72px | 72px | Replace visible Assinar with ThemeToggle; make beta chrome theme-following |
| Hero | 719px | 734px | Replace left text/stats with 728x574 carousel; retain 520x559 player |
| Recent Episodes | 648px / 3 cards | 1084px / 6 cards | Add second 3-card row and EP 138-136 fixtures |
| News & Events | 713px visible | Disabled | Omit from beta; preserve in `HomepageV2` |
| Newsletter | 574px dark-pinned | 574px theme-following | Retain anatomy; remove beta fixed-dark scope |
| Footer | 330px dark-pinned | 330px theme-following | Retain anatomy; add beta theme-following variant |
| Full page | 3056px | 2794px | Match contiguous beta section stack |

## Component-by-component difference register

| Priority | Component | Current | Beta target | Preservation rule | Acceptance IDs |
| --- | --- | --- | --- | --- | --- |
| P0 | Homepage composition | One mixed 2.0 `HomePage` | Separate `HomepageBeta` and `HomepageV2` | Freeze current composition before edits | AC-PRES-01..03 |
| P1 | Header action | 111x40 Mic + Assinar | 40x40 Sun/Moon button | Keep Subscribe action importable | AC-THEME-01..03 |
| P1 | Theme scope | Header, hero, newsletter, footer forced dark | Entire beta follows root mode | Preserve fixed-dark V2/content variant | AC-THEME-04 |
| P1 | Hero left | Eyebrow, H1, body, CTAs, stats | Four-slide banner carousel | Preserve text hero and stats in V2 | AC-PARITY-01..03, AC-CAR-01 |
| P1 | Carousel | Absent | 728x520 viewport + tabs/counter/arrows | New banner-domain component | AC-CAR-01..03 |
| P2 | Featured player | 520x559 rich player | Same authored player | Reuse; no player data-flow rewrite | AC-PLAYER-01 |
| P1 | Recent Episodes | EP 141-139, one row | EP 141-136, two rows | Append fixtures; do not replace existing | AC-EP-01..02 |
| P1 | News | Two visible cards | Not in beta DOM | Preserve component, mock, assets, tests | AC-DROP-01 |
| P1 | Agenda | Visible event rail | Not in beta DOM | Preserve JSX, mocks, types, tests | AC-DROP-01 |
| P2 | Newsletter | Dark-locked | Same anatomy, root-themed | Preserve UI-only form and V2 variant | AC-NL-01 |
| P2 | Footer | Dark-locked | Same anatomy, root-themed | Preserve fixed-dark variant | AC-NL-01 |
| P2 | Responsive | Existing layout has no overflow | New carousel + six cards have no overflow | No mobile pixel-parity claim | AC-EP-02, AC-QA-02 |
| P2 | Tests | Assert old composition in `home-page.tsx` | Versioned V2 + beta coverage | Retarget, never delete to bypass | AC-PRES-03, AC-QA-01 |

## Validation gates

1. **Preservation gate:** protected 2.0 artifacts and source tests remain meaningful.
2. **Architecture gate:** thin routes, server-first composition, client-only interaction islands, token-only visuals.
3. **Desktop parity gate:** dark and light runtime match beta Pencil pages at 1440px.
4. **Responsive gate:** 768px and 390px remain usable and overflow-free.
5. **Interaction gate:** theme persistence and manual carousel semantics pass.
6. **Quality gate:** lint, typecheck, tests, build, and diff check pass.

## Specification validation result

- Pencil contract review: **Approved** against `b3Kzt` and `F0E1s`.
- `web-design-reviewer`: **Approved** after verifying whole-page theme scope, deterministic fixtures/assets, carousel semantics and CTA outcomes, evidence wording, and scrollbar-safe responsive constraints.
- Current live implementation: **Rejected for beta parity** and accepted only as the preserved website 2.0 baseline.

## Current implementation audit verdict

**Approved for beta parity.** The launch composition matches the named dark/light Pencil pages at the exact desktop geometry, passes the required interaction and responsive checks, and retains the full website 2.0 implementation behind `HomepageV2`.
