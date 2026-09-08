# Validation: About Page

## Scope

- Route: `/about`
- Pencil source: dark `MwqyG`, light `td6q3` in the active root `cafedebug.pen`.
- Visual source inspection: Pencil `get_app_state`, direct node reads, and
  `TakeScreenshot([MwqyG, td6q3])`.
- Render target: local `http://localhost:3000/about` in Pencil’s integrated
  browser and the in-app browser.

## Automated validation

| Check | Result | Evidence |
| --- | --- | --- |
| Feature-branch aggregate validation | pass | `pnpm ci:web:validation` completed production build, 91/91 tests, lint, and typecheck before PR isolation. |
| Isolated PR-branch validation | pass | Jessica `main` baseline builds `/about`; its direct web checks completed 84/84 tests, lint, and typecheck after conflict resolution. |
| Production route | pass | Next build listed `/about` and generated the site successfully. |
| Diff whitespace | pass | `git diff --check` completed with no output. |
| Feature content/architecture coverage | pass | `apps/web/tests/about-source.test.mjs` covers fixture order, no-network seam, route metadata/delegation, semantic landmarks, decoration, responsive classes, and no local shared chrome. |
| Shared destination coverage | pass | Header/Footer focused source tests pass with canonical `Sobre → /about`; sitemap includes the static About URL. |

## Visual review and correction loop

| Severity | Finding | Resolution | Result |
| --- | --- | --- |
| P1 | At desktop, the initial equal-width Hero metric grid wrapped labels, making Hero 666px tall and moving every following section 18px below the Pencil design. | Replaced the equal grid with Pencil’s intrinsic-width flex statistics row and preserved the documented 56px desktop gap. | Fixed and rechecked. At 1440px the page is 3011px tall and section starts/heights are Header 72; Hero `72/648`; Mission `720/648`; Impact `1368/444`; Timeline `1812/869`, exactly matching Pencil. |
| P2 | Mission was missing the top/bottom section stroke authored on dark `Q7N3ab` and light `IZYMq`. | Added `border-y border-border` to the Mission section. | Fixed. The browser computes 1px semantic-border strokes in both themes. |
| P2 | The four value cards were missing the authored 1px outline from `YQdSK` / `Wedbv` / `E4RZ9x` / `iu9oj` and their light equivalents. | Added `border border-border` to `AboutValueCard`. | Fixed. The browser retains the 16px radius and computes the Pencil-aligned 1px outline. |
| P2 | The Impact metric surface lacked the outer stroke from `X4Nga` / `x1rwID`; desktop metric dividers needed to remain token-backed. | Added `border border-border` to `AboutImpactMetrics`, retaining its existing desktop `divide-border` treatment. | Fixed. The outer 1px border and four-column dividers match the Pencil anatomy. |
| P2 | Timeline was missing the authored top separator from `ZdGtq` / `RTbBQ`. | Added `border-t border-border` to the Timeline section. | Fixed. The section transition now uses the same semantic 1px stroke in both themes. |
| Accepted shared delta | Light `td6q3` scopes its Header/Footer to dark mode, while the existing Beta shell follows the root theme. | Retained the user-required shared root-theme-following Beta Header/Footer. No About-only chrome variant was introduced. | Recorded shared-system decision; light main content matches `td6q3` and the shell remains intentionally shared. |
| Evidence gap | Pencil has no authored tablet or mobile About frame. | Tested documented responsive adaptations without representing them as pixel-parity frames. | Accepted as a spec-recorded evidence gap. |

## Theme and viewport matrix

| Viewport | Dark | Light | Result |
| --- | --- | --- |
| `1440 × 1200` | `MwqyG` compared with browser capture; desktop section geometry, typography, cards, metrics, timeline, footer, and no overflow checked. | `td6q3` compared with browser capture; same content geometry and token hierarchy checked, with the recorded shared-chrome delta. | pass |
| `768 × 1024` | Compact navigation, 2-up value/impact grids, single-column timeline, footer reflow, and no overflow checked. | Same adaptation and no-overflow checks completed. | pass — responsive adaptation |
| `390 × 844` | Compact navigation, one-column cards/metrics/timeline, readable wrapping, footer reflow, and no overflow checked. | Same adaptation and no-overflow checks completed. | pass — responsive adaptation |

`scrollWidth` equaled `clientWidth` in every captured browser viewport. The
small floating `N` visible in local captures is Next.js development tooling,
not Café Debug product UI.

### Border correction follow-up

Direct Pencil reads confirmed the dark/light border tokens before the fix:
Mission uses only 1px top/bottom strokes; every value card and the Impact
surface uses a 1px full outline; the Impact surface uses vertical desktop
dividers; and Timeline has a 1px top stroke. The corrected local page was
reviewed in the connected in-app browser at `1440 × 1200` in dark and light,
plus `768 × 1024` and `375 × 844` responsive light renders. The Pencil
integrated-browser capture confirmed the dark responsive page. No content,
ordering, or reflow regression was observed. The browser was returned to its
initial dark theme and normal viewport after the review.

## Browser and accessibility behavior

| Check | Result | Evidence |
| --- | --- | --- |
| Canonical About destinations | pass | Header and Footer both expose `Sobre` links to `/about`. |
| Current navigation state | pass | `/about` renders the shared primary navigation with `Sobre` as the active destination. |
| Compact-menu keyboard behavior | pass | At `390px`, the menu changed from `Abrir menu principal` / `aria-expanded=false` to `Fechar menu principal` / `true`; Escape restored `Abrir menu principal`, `false`, and focus to the trigger. |
| Semantic content | pass | One `h1`; ordered `h2`/`h3` hierarchy; definition lists with label-before-value DOM order; decorative value icons and timeline rail/dots hidden from assistive technology; five chronological timeline items. |
| Player and shared shell | pass | About owns neither Header/Footer nor player state; persistent shared chrome remained in the route during viewport checks. |

## Tooling limitation

Terminal Playwright and the repository `playwright-cli` could not start
because their configured Google Chrome binary is absent. The required browser
matrix was instead completed in the connected in-app browser; the live route
was also inspected through Pencil’s integrated browser.
