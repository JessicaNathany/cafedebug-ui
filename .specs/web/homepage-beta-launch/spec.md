# Spec: Homepage Beta Launch Parity

| Field | Value |
| --- | --- |
| **Status** | `Implemented` |
| **Domain** | `web/homepage` |
| **Spec path** | `.specs/web/homepage-beta-launch/` |
| **Affected app** | `apps/web` |
| **Launch route** | `/` |
| **Design source** | `cafedebug.pen` |
| **Dark artboard/page** | `fm0R5` / `b3Kzt` |
| **Light artboard/page** | `B3qM0p` / `F0E1s` |
| **Supersedes on `/`** | `.specs/web/homepage-visual-parity/` composition only |
| **Preserves for website 2.0** | All implementation and artifacts from `.specs/web/homepage-visual-parity/` |

## 1. Problem statement

The current `/` route implements the full website 2.0 homepage: a static text hero with metrics, three recent episodes, News and Events, a dark-locked newsletter, and dark-locked chrome. The launch homepage must instead match the new Pencil **Homepage (Beta)** in dark and light themes.

The launch change must not delete, overwrite, or make unrecoverable any existing 2.0 component, fixture, asset, behavior, test, or specification. The 2.0 homepage remains a future product surface and must stay importable and testable even while it is not routed at `/`.

## 2. Product decisions

1. **Pencil is authoritative.** Desktop visual parity is measured against `b3Kzt` and `F0E1s`, not against the previous homepage nodes.
2. **“All white” means a full light-theme homepage.** No homepage band is forced dark in light mode. Exact Pencil tokens still apply: the page surface is `--background` (`#F2F3F0`) and elevated surfaces are `--card` (`#FFFFFF`). Do not replace the Pencil palette with literal white everywhere.
3. **The current 2.0 homepage is preserved by versioning, not CSS hiding.** Its composition must move behind an explicit `HomepageV2` boundary before beta composition work begins.
4. **The launch header uses a theme control.** The visible `Assinar` action is replaced on the beta homepage by Pencil's 40px icon-only theme button. The subscription action remains available to `HomepageV2`.
5. **The banner carousel is manual in the launch version.** Pencil does not define timing. It must not auto-advance. Tabs and previous/next controls change slides; the first slide is initially active.
6. **Six recent episodes exclude the featured episode.** EP 142 remains in the featured player; the two-row grid renders EP 141 through EP 136 in that order.
7. **News and Agenda do not render in beta.** Their components, mocks, assets, tests, and 2.0 composition remain in the repository.
8. **Newsletter and footer remain.** Both follow the root theme on the beta homepage.
9. **Responsive behavior is inferred.** Pencil supplies only a 1440px beta reference. Tablet/mobile require structural equivalence and no overflow, not pixel-parity claims.

## 3. Scope

### In scope

- Version and preserve the implemented 2.0 homepage.
- Route `/` to a separate Homepage Beta composition.
- Replace the beta header's `Assinar` action with the existing theme capability adapted to Pencil anatomy.
- Add a four-slide banner carousel with deterministic local assets.
- Remove the metrics row from beta rendering.
- Render exactly six recent episode cards in two desktop rows.
- Omit News and Agenda from beta rendering.
- Make every beta homepage band follow dark/light mode.
- Preserve the current player, newsletter, footer, episode cards, and their behavior where Pencil anatomy is unchanged.
- Add beta-specific source, component, accessibility, responsive, and visual-regression coverage.

### Out of scope

- Deleting or simplifying any 2.0 implementation.
- Real banner API integration or admin banner changes.
- Real newsletter submission.
- Changing episode-detail composition or its established fixed-dark chrome.
- Autoplay, swipe gestures, or carousel analytics unless separately specified.
- Claiming pixel parity for tablet/mobile without Pencil artboards.

## 4. Functional requirements

### FR-1 — Preservation boundary

- Freeze the current homepage composition as an exported `HomepageV2` feature before changing `/`.
- Preserve the stats, hero player, News and Events anatomy, newsletter, header subscription action, mocks, assets, and current tests.
- Existing 2.0 tests may be retargeted to versioned modules; they must not be deleted to make beta tests pass.
- The implemented `.specs/web/homepage-visual-parity/` package remains unchanged in meaning and status.

### FR-2 — Beta header and theme control

- Header remains 72px high with 40px desktop gutters.
- Search remains a 40px circular secondary control.
- Replace the beta-visible 111x40 `Assinar` control with a 40x40 circular secondary theme button.
- Show `sun` in dark mode and `moon` in light mode, both 18px.
- The control applies instantly, persists through the existing `cd-theme` cookie/provider path, is server-readable on reload, and has an action-oriented accessible label.
- No hydration flash or initial incorrect icon may be visible.

### FR-3 — Beta hero

- Desktop hero is `1440x734`, with `[80,64]` padding and a 64px column gap.
- Left column is the `728x574` banner carousel; right column is the existing `520x559` featured player anatomy.
- The `142 / 85k / 4.9` stats and the standalone text-hero composition do not render in beta.
- The orange radial treatment shown by Pencil is implemented through semantic web-design tokens, never raw values in a feature component.

### FR-4 — Banner carousel

- Render four deterministic slides in Pencil order with exact copy, CTA labels, and image intent from `H4D8y` / `np9bc`.
- Only one slide is visually and semantically active at a time.
- Initial state is slide 1 and counter `01 / 04`.
- Four semantic tabs, previous, and next controls are keyboard reachable and update the active slide.
- Tabs use `tablist` / `tab` / `tabpanel`, `aria-selected`, roving `tabIndex`, and `aria-controls` relationships. Left/Right arrow keys wrap and activate; Home/End select the first/last slide.
- Previous on slide 1 wraps to slide 4; next on slide 4 wraps to slide 1.
- The carousel does not auto-advance.
- Slide 1 `Ouvir agora` is a button using the featured-episode play action; slide 1 `Ver todos os episódios` and slide 4 `Ver episódios` are links to `#episodios`.
- Both slide 2 CTAs, both slide 3 CTAs, and slide 4 `Entrar na comunidade` are focusable buttons with `aria-disabled="true"`, no click handler, and unchanged Pencil appearance until their owning features are specified.
- Hidden slides must not expose duplicate headings or actionable controls to assistive technology.
- Transitions respect reduced-motion preferences and never change carousel height.

### FR-5 — Featured player

- Reuse the current `HeroPlayer` unless measured comparison requires a non-breaking variant.
- Preserve the EP 142 fixture, player artwork, badges, metadata, guest, timeline, `18:24 / 48:12`, speed, pause, skip, and volume anatomy.
- Do not create a second audio element or change shared player data flow in this goal.

### FR-6 — Recent episodes

- Render exactly EP 141, 140, 139, 138, 137, and 136.
- Desktop is three columns by two rows with 24px gaps.
- Tablet is two columns by three rows; mobile is one column by six rows.
- Reuse `EpisodeCard` / `FGSFI`; add missing deterministic fixtures and local assets without replacing or deleting EP 142-139 data.

### FR-7 — Dropped launch sections

- Beta output contains no News section, news cards, Agenda landmark, event list, or their headings.
- Do not hide these with CSS or an `aria-hidden` rendered subtree; omit them from `HomepageBeta` composition.
- `HomepageV2` continues to render and test the complete News and Agenda surface.

### FR-8 — Newsletter and footer

- Newsletter remains `1440x574` at the desktop reference and keeps its `1312x414` card and UI-only form.
- Footer remains `1440x330` with existing content and controls.
- On beta, both inherit dark/light root tokens; neither is pinned to `.dark`.
- A preserved 2.0/fixed-dark variant remains available for future use and existing non-beta contracts.

### FR-9 — Architecture and data flow

- `apps/web/src/app` remains routing, metadata, providers, and composition only.
- Homepage UI belongs under a homepage feature boundary; banner behavior belongs under `features/banners`.
- The beta page remains server-first. Only carousel interaction and theme interaction become client boundaries.
- No direct `fetch` in pages or components.
- Visual fixtures are deterministic and local. A later server adapter may use the generated public banner resource.
- Feature components use semantic tokens; raw colors and one-off visual constants are prohibited.

### FR-10 — Responsive and accessibility

- Required runtime viewports: 1440x1200, 768x1024, and 390x844.
- No horizontal overflow at any required viewport.
- Heading order, landmarks, alt treatment, keyboard order, focus visibility, and minimum 40px touch targets remain valid.
- On narrow screens, the hero stacks carousel before player. Compact progress tabs may replace desktop text tabs, but their accessible labels remain.
- Episode artwork alt is `Capa do episódio {number}: {title}`; guest-avatar alt is the guest name. Banner photos are decorative because each slide's text provides its accessible identity.
- Mobile/tablet navigation behavior is not expanded by this goal; any existing limitation is documented rather than disguised as Pencil parity.

## 5. Acceptance criteria

### Preservation

- **AC-PRES-01:** `HomepageV2` is exported, importable, and contains the pre-beta stats, hero, News/Agenda, and newsletter composition.
- **AC-PRES-02:** Subscription action, `HeroPlayer`, `NewsCard`, `NewsletterForm`, news/event fixtures, episode fixtures, assets, and their tests remain.
- **AC-PRES-03:** A preservation test fails if any protected 2.0 artifact is removed.

### Desktop parity

- **AC-PARITY-01:** Dark `/` matches `b3Kzt` at 1440px.
- **AC-PARITY-02:** Light `/` matches `F0E1s` at 1440px.
- **AC-PARITY-03:** Visible section geometry is 72 + 734 + 1084 + 574 + 330 = 2794px.
- **AC-PARITY-04:** Disabled Pencil nodes `R2MZY` / `FcEf0` have no rendered beta equivalent.

### Header/theme

- **AC-THEME-01:** Beta header contains Search plus exactly one 40x40 theme control and no visible `Assinar` label.
- **AC-THEME-02:** Dark shows Sun; light shows Moon; label announces the destination theme.
- **AC-THEME-03:** Cookie persistence, server first paint, focus, and no-flash behavior pass in both modes.
- **AC-THEME-04:** Every beta band follows root mode; light beta has no forced-dark subtree.

### Carousel and player

- **AC-CAR-01:** Four exact slides render in authored order with one active slide.
- **AC-CAR-02:** Tabs, arrows, counter, wrap behavior, keyboard/focus, hidden-slide semantics, and reduced motion pass.
- **AC-CAR-03:** No autoplay timer exists.
- **AC-PLAYER-01:** Player anatomy and existing shared-player behavior do not regress.

### Content

- **AC-EP-01:** Exactly six recent cards render in the order 141 through 136.
- **AC-EP-02:** Desktop 3x2, tablet 2x3, and mobile 1x6 layouts have no overflow.
- **AC-DROP-01:** Beta DOM has no News or Agenda content; `HomepageV2` still has both.
- **AC-NL-01:** Newsletter and footer remain and follow beta theme tokens.

### Architecture and quality

- **AC-ARCH-01:** Route files remain thin and no direct page/component `fetch` is introduced.
- **AC-ARCH-02:** Banner state is isolated to a client component; the rest of beta composition remains server-first.
- **AC-ARCH-03:** No raw visual colors are introduced in feature source.
- **AC-QA-01:** lint, typecheck, tests, build, and `git diff --check` pass.
- **AC-QA-02:** `web-design-reviewer` approves dark/light desktop comparison and responsive integrity, or reports explicit residual differences.

## 6. Evidence and known gaps

- Current live page was audited at 1440x1200, 768x1024, and 390x844. It has no horizontal overflow but fails beta composition in every named area.
- Pencil has no tablet/mobile beta artboards; responsive acceptance is structural.
- Pencil does not define autoplay, swipe, animation timing, or accessibility semantics. This spec resolves them conservatively as manual, keyboard-operable, stable-height behavior.
- Pencil image fills are remote. Implementation must localize exact approved imagery for deterministic regression.
