# Homepage Pencil Parity Plan

Goal: make the `apps/web` homepage match the Pencil design as closely as possible in both dark and light-content themes.

**Status: complete.** Goals `G01` through `G14` passed their validation gates and were approved. The audit sections below preserve the pre-parity baseline; the approval-gated register is the current delivery record.

## Evidence Used

- Pencil file: `cafedebug.pen`
- Pencil dark homepage node: `tWWON`
- Pencil light-content homepage node: `k71CIc`
- Pencil component nodes: `m9zV96` header, `LSgoB` footer, `FGSFI` episode card
- Running app: `http://localhost:3000/`
- Baseline implementation screenshots captured at 1440px desktop before the G01-G14 work:
  - `/Users/regis/.codex/visualizations/2026/07/25/019f9a64-ed48-7f80-8ee6-1b88f56a5002/homepage-implementation/homepage-dark.png`
  - `/Users/regis/.codex/visualizations/2026/07/25/019f9a64-ed48-7f80-8ee6-1b88f56a5002/homepage-implementation/homepage-light.png`
- Pencil design-system variables from `get_variables`
- Current web token package: `packages/web-design-tokens/styles.css`

## Design System Source-Of-Truth Constraint

The web app must use the Pencil design system as the source of truth before any homepage parity work is considered complete.

Required constraint:

- `packages/web-design-tokens` must mirror the Pencil variables, theme values, and naming contract.
- `apps/web` components must be built from the same component vocabulary shown in Pencil, including button variants, icon buttons, inputs, cards, labels, header, footer, episode card, and news card.
- Homepage implementation must not use ad hoc component styling when a Pencil reusable component exists.
- Tailwind theme aliases in `apps/web/src/styles/theme.css` must map to the Pencil-backed CSS variables, not to invented aliases.
- Visual parity must be validated at the design-system layer first, then at the page/section layer.

## Historical Baseline Audit (before G01)

Pencil defines a `Mode` theme axis with `Light` and `Dark` values. At the time of the initial audit, the CSS implementation mapped themes through `:root` and `.dark`, but did not yet fully mirror the Pencil token contract. G01 resolved the missing contract work.

### Token Values That Matched Pencil at Baseline

These `packages/web-design-tokens/styles.css` values already matched the Pencil variables at baseline:

| Token area | Pencil value | Baseline status |
| --- | --- | --- |
| Background | `#F2F3F0` light, `#111111` dark | Matches |
| Foreground | `#111111` light, `#FFFFFF` dark | Matches |
| Card | `#FFFFFF` light, `#1A1A1A` dark | Matches |
| Card foreground | `#111111` light, `#FFFFFF` dark | Matches |
| Primary | `#FF8400` both themes | Matches |
| Primary foreground | `#111111` both themes | Matches |
| Secondary | `#E7E8E5` light, `#2E2E2E` dark | Matches |
| Border/input | `#CBCCC9` light, `#2E2E2E` dark | Matches |
| Muted foreground | `#666666` light, `#B8B9B6` dark | Matches |
| Radius medium/pill | `16`, `999` | Matches as `px` CSS values |

### Token Gaps Resolved in G01

At baseline, `packages/web-design-tokens` did not fully follow Pencil.

The missing or mismatched variables were:

- Pencil has `--font-primary: JetBrains Mono` and `--font-secondary: Geist`; baseline CSS exposed `--font-mono` and `--font-sans` instead.
- Pencil has `--radius-none`; baseline CSS did not.
- Pencil has `--white` and `--black`; baseline CSS only had brand aliases like `--brand-white`.
- Pencil has `--color-success`, `--color-success-foreground`, `--color-warning`, `--color-warning-foreground`, `--color-error`, `--color-error-foreground`, `--color-info`, and `--color-info-foreground`; baseline CSS used unprefixed `--success`, `--warning`, `--error`, and `--info` names.
- Pencil has sidebar tokens: `--sidebar`, `--sidebar-foreground`, `--sidebar-primary`, `--sidebar-primary-foreground`, `--sidebar-accent`, `--sidebar-accent-foreground`, `--sidebar-border`, and `--sidebar-ring`; baseline web CSS did not expose them.
- Baseline CSS had `--header`, `--header-foreground`, `--footer`, `--footer-foreground`, `--brand-*`, `--shadow-card`, and `--shadow-float`; these may be useful aliases, but they are not direct Pencil variables and should not replace the Pencil contract.

G01 delivery:

- `packages/web-design-tokens/styles.css` now exposes the Pencil names and Light/Dark values, with convenience aliases mapped back to that contract.
- `apps/web/src/styles/theme.css` now exposes the Pencil-backed state, sidebar, font, and radius tokens to Tailwind.
- The goal validation established the token contract before component and page visual QA proceeded.

### Component System Gap Resolved in G02

Pencil exposes 105 reusable components. For homepage parity, the important web-facing reusable components are:

- `m9zV96`: Site Header
- `LSgoB`: Site Footer
- `FGSFI`: Episode Card
- `wQPNg`: News Card
- `ZETEA`, `U83R7`, `4x7RU`, `Svd9t`: button variants
- `ZGI9Z`, `89sf2`, `EAwax`, `zIDRN`: large button variants
- `pEY1B`, `HWbHA`, `xQWwZ`, `ubB6W`: icon button variants
- `gKpi4`, `z6HCm`, `T5yK2`, `Zksub`: input/search components
- `L8Rgv`, `it00G`, `7KC5U`, `rjvI1`: label/pill variants
- `ERkuB`, `ksvfk`, `wg5F3`, `eBwLd`: card variants

At baseline, the web implementation had only one shared UI primitive: `apps/web/src/components/ui/button.tsx`. Header, footer, episode card, newsletter form, news cards, and player controls were hand-built in feature/layout files.

G02 delivery:

- Shared button, icon-button, input/search, label/pill, and card primitives now map to the Pencil component vocabulary and sizes.
- Header, footer, episode-card, news-card, hero player, and newsletter form use those primitives or dedicated feature components with the approved Pencil anatomy.

## Target Page Measurements

Pencil target at desktop:

| Section | Dark node | Light node | Target height | Target y |
| --- | --- | --- | ---: | ---: |
| Header | `IkONX` | `SVnZw` | 72 | 0 |
| Hero | `dHS9G` | `LIrhS` | 719 | 72 |
| Recent Episodes | `dy62d` | `fx0wZ` | 648 | 791 |
| News & Events | `o5gLmf` | `j1TCV` | 713 | 1439 |
| Newsletter | `GzxFp` | `tEL7F` | 574 | 2152 |
| Footer | `P0nGW` | `Y2kvjd` | 330 | 2726 |
| Full page | `tWWON` | `k71CIc` | 3056 | 0 |

Baseline implementation at 1440px (before G01-G14):

| Section | Baseline height | Baseline y | Difference |
| --- | ---: | ---: | --- |
| Header | 73 | 0 | +1px height |
| Hero | 686 | 73 | -33px height |
| Recent Episodes | 658 | 759 | +10px height, starts 32px too high |
| News & Events | 520 | 1417 | -193px height, starts 22px too high |
| Newsletter | 438 | 1937 | -136px height, starts 215px too high |
| Footer | 370 | 2375 | +40px height, starts 351px too high |
| Full page | 2745 | 0 | -311px total height |

Delivered desktop geometry at 1440px (G11/G12):

| Section | Height | Y |
| --- | ---: | ---: |
| Header | 72 | 0 |
| Hero | 719 | 72 |
| Recent Episodes | 648 | 791 |
| News & Events | 713 | 1439 |
| Newsletter | 574 | 2152 |
| Footer | 330 | 2726 |
| Full page | 3056 | 0 |

## Historical Baseline Differences (resolved in G01-G14)

0. **Design system parity was incomplete at baseline.**
   - The token package was a partial manual approximation of Pencil variables.
   - The web component set did not mirror Pencil reusable components.
   - Resolved by G01 token parity and G02 core web primitives.

1. **Desktop section rhythm was compressed at baseline.**
   - Pencil page height was 3056px; the baseline page was 2745px.
   - Most of the missing height came from News & Events and Newsletter.
   - Resolved by G09-G12 composition work; the delivered page is 3056px.

2. **Content gutters did not match Pencil at baseline.**
   - Pencil homepage sections use 64px horizontal padding for main bands.
   - Baseline sections often used 24px/40px gutters and then `max-w-[1440px]`, making cards wider and content start too far left.
   - Resolved by G09-G12: main bands use the 64px visual gutter and 1312px content cap; chrome uses 40px gutters.

3. **Theme-locked dark sections lost contrast in light mode at baseline.**
   - In the light screenshot, text in the dark hero player and newsletter became nearly black.
   - Header active nav, header buttons, footer buttons, and footer newsletter input also used light-theme tokens on dark surfaces.
   - Resolved by G03-G05, G10, G13: locked dark regions now set their own foreground and component tokens.

4. **Images did not match Pencil at baseline.**
   - Pencil uses photo artwork from Unsplash-style fills.
   - The baseline implementation used local SVG placeholders with the CafeDebug wordmark and orange circles.
   - Resolved by G05-G09 with local photo fixtures matching the designed visual content.

5. **The Next.js dev indicator appeared in baseline screenshots.**
   - The small circular indicator near Recent Episodes is a dev-mode artifact, not a homepage component.
   - It was excluded from visual comparison and does not affect the delivered homepage.

## Historical Component Difference Record (completed in G03-G14)

The following differences and work items are retained as the original pre-parity audit. They are not outstanding implementation requirements; the approved goal register below is the authoritative current status.

### 1. Header

Target: Pencil node `m9zV96`.

Baseline differences:

- Baseline header included an extra theme-toggle button; Pencil shows only search and `Assinar`.
- In light mode, search and theme buttons render as light buttons, but Pencil keeps the search button dark on the locked dark header.
- Active `Inicio` uses `text-foreground`, which becomes black in light mode instead of staying white.
- Search icon is smaller than Pencil target.
- Header should be exactly 72px high with 40px horizontal padding.

Historical work items (completed in G03):

- Update `apps/web/src/components/layout/header.tsx` and `nav.tsx`.
- Remove the theme toggle from the visual header or move it to a Pencil-approved location before final parity.
- Use header-specific foreground tokens/classes for all header text and controls.
- Make search button match `40x40`, dark fill `#2E2E2E`, icon `18px`, muted icon color.
- Keep subscribe button at `40px` height with orange fill, mic icon, and `Assinar` label.

### 2. Hero

Target: Pencil nodes `dHS9G` and `LIrhS`.

Baseline differences:

- Baseline hero used equal-width grid columns; Pencil uses left content around 728px and player fixed at 520px, with a 64px gap.
- Baseline hero player was too wide: about 660px instead of 520px.
- Baseline hero started content at about 40px; Pencil starts at 64px.
- Baseline eyebrow had a separate `AO VIVO AGORA` pill plus a second episode line; Pencil uses one compact orange live-dot row with `EP 142 - EPISODIO EM DESTAQUE`.
- Hero subtitle copy differs. Pencil copy ends with `Novos episodios toda semana.`
- CTA buttons are 40px high; Pencil buttons are 52px high.
- Stats are rendered as bordered cards; Pencil stats are inline text groups separated by vertical dividers.
- Stats values differed: baseline `140+`, `50k+`, `9 anos`; Pencil `142`, `85k`, `4.9`.
- Hero player artwork height is 180px; Pencil artwork is 240px.
- Hero player artwork lacks category and `NOVO` overlay pills.
- Hero player header row (`Player ao vivo`) is not in Pencil.
- Hero player guest row lacks avatar and role text.
- Progress control lacks the Pencil knob and exact time values.
- Control layout differs: Pencil has speed pill on the left, centered previous/play/next cluster, and volume icon on the right.
- In light mode, hero player text inherits black on a dark card.

Historical work items (completed in G05):

- Update `apps/web/src/features/episodes/components/home-page.tsx`.
- Build the hero with Pencil dimensions: section padding `80px 64px`, gap `64px`, player width `520px`.
- Replace the baseline eyebrow/pill structure with the Pencil live-dot eyebrow.
- Restore Pencil subtitle copy.
- Add a large button variant for 52px CTAs in `apps/web/src/components/ui/button.tsx` or use a local parity class.
- Replace stat cards with inline stat groups and dividers.
- Rebuild the hero player anatomy: 240px artwork, overlay pills, meta row, title, avatar guest row, progress track with knob, time row, and three-zone controls.
- Force foreground colors inside the dark hero/player in both root themes.

### 3. Recent Episodes

Target: Pencil nodes `dy62d`, `fx0wZ`, and component `FGSFI`.

Baseline differences:

- Section gutters use 24px/40px in implementation; Pencil uses 64px.
- Section copy differs. Pencil subtitle is `Novas conversas toda semana com a comunidade dev.`
- `Ver todos` is missing the arrow icon.
- Card widths are about 448px in implementation; Pencil grid cards are about 421px inside a 1312px grid.
- Baseline cards used placeholder SVG artwork; Pencil cards use image fills.
- Baseline card body copy differed from Pencil for episode titles, excerpts, guests, dates, and durations.
- Baseline card guest row was text only; Pencil includes a 28px avatar circle before the guest.
- Light cards should keep image artwork dark/photo-based while body surface becomes white with subtle border/shadow.

Historical work items (completed in G06-G07):

- Update `home-page.tsx`, `episode-card.tsx`, and `episodes.mock.ts`.
- Set Recent Episodes section padding to `72px 64px`.
- Match section title/subtitle and `Ver todos` + arrow.
- Set card anatomy to Pencil component `FGSFI`: 200px artwork, category pill at `16,16`, centered `56x56` play button, duration pill at bottom right, 20px body padding, 10px vertical body gap.
- Add guest avatar support to the mock episode model or derive a parity placeholder image.
- Update mock content to the Pencil text values and durations.
- Add light-mode card styling to match white surface, `#CBCCC9` border, and soft shadow.

### 4. News & Events

Target: Pencil nodes `o5gLmf` and `j1TCV`.

Baseline differences:

- Baseline section height was 520px; Pencil target is 713px.
- Baseline dark section background was effectively transparent over page background; Pencil uses `#1A1A1A` with top and bottom border.
- Baseline heading said `Noticias & Eventos`; Pencil heading says `Ultimas Noticias`.
- Baseline subtitle differed from Pencil.
- Baseline news cards were plain text cards; Pencil uses image-led news cards with category/date pills, title, excerpt, and author/meta row.
- Baseline news cards stacked vertically; Pencil shows a two-card news grid beside the event panel.
- Baseline event panel was too simplified and used inline date strings; Pencil uses date badge blocks with month/day, type labels, title, location row, dividers, and a full-width `Ver agenda completa` button.
- Light section should preserve the same layout while switching surfaces to `#F2F3F0`, white cards, and `#CBCCC9` borders.

Historical work items (completed in G08-G09):

- Update `home-page.tsx`; consider extracting `NewsCard` and `EventsPanel` components under `apps/web/src/features/episodes/components/` if the markup gets heavy.
- Set section padding to `72px 64px`, height/rhythm matching Pencil.
- Use a grid of `884px + 380px` with 48px gap at desktop.
- Replace text-only news cards with Pencil image card anatomy.
- Replace event rows with date badges, type labels, location metadata, dividers, and the footer button.
- Add light/dark token variants for news cards and event panel.
- Update static mock content to match Pencil.

### 5. Newsletter

Target: Pencil nodes `GzxFp` and `tEL7F`.

Baseline differences:

- Baseline section height was 438px; Pencil target is 574px.
- Baseline card was 960px wide and left-aligned internally; Pencil card fills the 1312px content width and centers all content.
- Pencil includes a 56px icon circle above the title; the baseline implementation had only an eyebrow text.
- Pencil title and subtitle are centered; baseline title/subtitle were left aligned.
- Pencil subtitle copy differs: `Receba os melhores episodios, noticias e vagas direto no seu email. Toda semana, sem ruido.`
- Pencil form width is 560px, centered, with a mail icon inside the input and `Inscrever-se` button text.
- Baseline form had no input icon, used `Enviar`, and included social pills that are not in Pencil.
- Baseline card background lacked the same radial orange glow treatment.
- In light mode, newsletter title becomes black on a dark card.

Historical work items (completed in G10):

- Update `home-page.tsx`.
- Set newsletter section padding to `80px 64px`.
- Make the card `width: fill_container` equivalent, with `56px 48px` padding and centered vertical layout.
- Add icon circle with mail icon.
- Center title/subtitle and match Pencil widths (`640px` title, `560px` subtitle/form).
- Replace button label with `Inscrever-se`.
- Remove social pills from the homepage newsletter.
- Add explicit dark-card foreground tokens for both themes.

### 6. Footer

Target: Pencil node `LSgoB`.

Baseline differences:

- Baseline footer height was 370px; Pencil target is 330px.
- Baseline footer vertical spacing was larger than Pencil.
- In light mode, footer social buttons and newsletter input use light root tokens; Pencil keeps them dark.
- Some social icons differ from Pencil:
  - Baseline used link/message/radio/globe/rss.
  - Pencil uses GitHub, Twitter, YouTube, LinkedIn, Instagram icon set.
- Footer newsletter mini form should use a dark input with orange circular send button in both themes.
- Column spacing should match Pencil's dense 5-column layout.

Historical work items (completed in G04):

- Update `apps/web/src/components/layout/footer.tsx`.
- Dark-scope footer controls or use footer-specific semantic tokens.
- Replace social icon choices with the Pencil set.
- Tighten footer padding and grid spacing to hit the 330px target.
- Match newsletter mini input and send button sizes.

### 7. Theme Parity

Target: `tWWON` and `k71CIc` must share layout and only change the intended surfaces.

Baseline differences:

- Layout stayed mostly consistent between baseline dark and light screenshots, but dark-locked regions did not preserve foreground contrast.
- Header/footer controls change color incorrectly in light mode.
- Hero and newsletter text inherit root light foreground instead of section-local dark foreground.
- Recent and News sections need explicit light/dark surfaces to match Pencil, not incidental transparent backgrounds.

Historical work items (completed in G11-G13):

- Audit all `text-foreground`, `bg-secondary`, `border-border`, and `bg-card` usages inside locked dark sections.
- Prefer component-local semantic classes or add specific web tokens for locked dark chrome/card surfaces.
- Verify computed colors in both themes after each section is updated.

### 8. Historical Validation Plan (completed in G12-G14)

The validation sequence below was completed. G12 accepted the dark desktop reference, G13 accepted light-content theme behavior, and G14 accepted responsive and release validation with lint, typecheck, 32 focused tests, and `git diff --check` passing.

After implementation, validate in this order:

1. Compare `packages/web-design-tokens/styles.css` against Pencil `get_variables`; all Pencil token names and values must exist in the package.
2. Verify Tailwind aliases in `apps/web/src/styles/theme.css` map to Pencil-backed variables.
3. Verify homepage UI primitives map to Pencil reusable components instead of ad hoc styling.
4. Capture desktop dark homepage at 1440px and compare against Pencil node `tWWON`.
5. Capture desktop light-content homepage at 1440px and compare against Pencil node `k71CIc`.
6. Compare header against `m9zV96`.
7. Compare footer against `LSgoB`.
8. Compare episode cards against `FGSFI`.
9. Compare news cards against `wQPNg`.
10. Confirm page height is close to 3056px and section y/height values match the target table.
11. Run web lint, typecheck, and smoke tests.
12. Repeat a mobile responsive pass after desktop parity is reached.

## Suggested Implementation Order

The work below replaces the broad sequence with explicit, approval-gated goals. A goal becomes active only after the previous goal has passed automated review and the user has approved its visual result.

## Approval-Gated Goal Sequence

### Operating Rule

- The active goal is the only implementation work allowed at a time. After it is complete, the project stops for user validation; no later goal starts until approval is received in this task.
- Each goal uses the same handoff chain: **Frontend Blacksmith** implements in an isolated worktree, **Web Design Reviewer** compares the result to the named Pencil node(s), and **The Debugger** checks architecture, tokens, tests, accessibility, and regressions.
- Independent research or validation work may happen in parallel inside one goal when it has no overlapping write set. Page/component implementation goals never run in parallel with each other, so visual changes remain easy to review and approve.
- The goal tool supports one active goal. These IDs are therefore queued and will be activated one at a time after approval, rather than all being active concurrently.

| Goal ID | Approval gate | Scope and Pencil source | Expected write scope |
| --- | --- | --- | --- |
| `G01` (approved) | Design-token parity | Mirror every Pencil variable from `cafedebug.pen`; use `get_variables`. | `packages/web-design-tokens/styles.css`, `apps/web/src/styles/theme.css` |
| `G02` (approved) | Core web primitives | Button, large button, icon button, label/pill, input/search, and card primitives matching Pencil components `ZETEA`, `U83R7`, `4x7RU`, `Svd9t`, `ZGI9Z`, `89sf2`, `EAwax`, `zIDRN`, `pEY1B`, `HWbHA`, `xQWwZ`, `ubB6W`, `gKpi4`, `T5yK2`, `L8Rgv`, `it00G`, `ERkuB`, `eBwLd`. | Shared web UI component files only |
| `G03` (approved) | Header | Rebuild the always-dark site chrome from `m9zV96`. | `apps/web/src/components/layout/header.tsx`, `nav.tsx` and direct primitives |
| `G04` (approved) | Footer | Rebuild the always-dark footer from `LSgoB`. | `apps/web/src/components/layout/footer.tsx` and direct primitives |
| `G05` (approved) | Hero and player | Match Hero nodes `dHS9G` / `LIrhS`, including live row, CTAs, statistics, player anatomy, and centered wide-desktop content geometry. | Homepage feature components and parity data |
| `G06` (approved) | Episode card | Build the reusable episode card from `FGSFI`, including image overlays, play action, metadata, and guest avatar. | Episode-card component, types, and mock data |
| `G07` (approved) | Recent Episodes | Match the section layout and content for `dy62d` / `fx0wZ`, using the approved episode card. | Homepage feature components and mocks |
| `G08` (approved) | News card | Build the reusable news card from `wQPNg`. | News-card component and parity data |
| `G09` (approved) | News and Events plus wide containment correction | Matched page nodes `o5gLmf` / `j1TCV`, including the news grid and event-date panel, while capping Recent Episodes and News and Events content to the 1312px Pencil reference width above desktop. | Homepage feature components, focused source tests, and parity contract |
| `G10` (approved) | Newsletter | Matched newsletter nodes `GzxFp` / `tEL7F`, including the centered form, UI-only submit prevention, and pinned-dark surface. | Homepage feature components and direct primitives |
| `G11` (approved) | Page composition | Matched the full Home composition against `tWWON` / `k71CIc`: header `0/72`, hero `72/719`, Recent `791/648`, News `1439/713`, Newsletter `2152/574`, and footer `2726/330`, for a `3056px` desktop page. Desktop uses the 64px visual gutter and 1312px reference cap; tablet/mobile have no horizontal overflow, and the three hero stats remain aligned at 390px. Runtime dark scope and source-backed light-band mapping were independently revalidated. | Homepage composition and theme classes only |
| `G12` (approved) | Dark desktop acceptance | Revalidated the full 1440px dark homepage against `tWWON`: page `3056px`, header `0/72`, hero `72/719`, Recent `791/648`, News `1439/713`, Newsletter `2152/574`, and footer `2726/330`. Corrected the scrollbar-reserved `15px` width loss so all content bands again measure `1312px` at `x:64` and the chrome measures `1360px` at `x:40`; runtime colors, card anatomy, imagery, controls, and horizontal overflow passed. | Homepage composition, shell containers, and focused source tests only |
| `G13` (approved) | Light-content acceptance | Pencil `k71CIc`, the server-resolved light preference, and source-backed semantic scopes agree: header, hero, newsletter, and footer remain dark; Recent Episodes and News & Events resolve to the intended light tokens, light cards, and light rules. The G13 provider correction propagates the initial server theme through `next-themes`; a live browser screenshot remains unavailable because the Pencil-matched header intentionally has no theme control. | Theme provider, homepage/theme source, and focused tests only |
| `G14` (approved) | Responsive and release validation | The Recent Episodes action now provides a real 40px touch target without changing its approved desktop text baseline. Live dark-theme checks at 375px, 768px, 1280px, and 1920px found no document-level horizontal overflow; 1280px and 1920px retain the approved 3056px desktop section geometry and 1312px wide-content cap. Blacksmith, Web Design Reviewer, and Debugger independently approved the correction; lint, typecheck, 32 focused tests, and diff validation pass. | Homepage composition and focused source test only |

### Per-Goal Completion Packet

Every approval gate must include:

1. The active goal objective and the files changed.
2. Pencil node screenshots and implementation screenshots at the matching viewport/theme.
3. A short Web Design Reviewer report with remaining visual deltas, if any.
4. A Debugger decision: approved or changes required, including architecture and token compliance.
5. The exact user validation request: approve the goal, or name the remaining difference to correct. The next goal stays locked until approval.

### Initial Goal: `G01` — Design-Token Parity (Approved)

`G01` is intentionally limited to the token contract. It must not change page geometry or component markup.

Acceptance criteria:

- Every variable returned by Pencil `get_variables` exists in `packages/web-design-tokens/styles.css` with identical Light/Dark values and names.
- Existing convenience aliases remain only as aliases to the Pencil contract; they cannot replace or diverge from it.
- `apps/web/src/styles/theme.css` exposes the Pencil variables to Tailwind, including fonts, radii, state colors, sidebar variables, popover, input, and ring.
- The web still builds, typechecks, and retains its existing visual output before later component goals deliberately change it.
