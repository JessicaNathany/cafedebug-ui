# Design: Homepage Visual Parity with Pencil

| Field | Value |
| --- | --- |
| **Status** | `Implemented` |
| **Spec** | `.specs/web/homepage-visual-parity/spec.md` |
| **Design source** | `cafedebug.pen` |
| **Node index** | `.specs/web/foundation/ux-design-reference.md` |
| **Mandatory node IDs** | `tWWON`, `k71CIc`, `m9zV96`, `LSgoB`, `FGSFI` |

---

## 1. Architecture Guardrails

1. `apps/web/src/app/page.tsx` remains thin and delegates to feature composition.
2. Homepage implementation stays in `apps/web/src/features/episodes/components/home-page.tsx`.
3. Reusable shell remains in:
   - `apps/web/src/components/layout/header.tsx`
   - `apps/web/src/components/layout/footer.tsx`
4. Episode card parity is implemented in `apps/web/src/features/episodes/components/episode-card.tsx`.
5. No direct network calls in page/component layer.

### 1.1 G03 Header Screen Contract

| Field | Value |
| --- | --- |
| Pencil file | `/cafedebug.pen` |
| Node index | `/.specs/web/foundation/ux-design-reference.md` |
| Component node | `m9zV96` (Site Header) |
| Route | Global web shell, including `/` |
| Implementation | `apps/web/src/components/layout/header.tsx`, `apps/web/src/components/layout/nav.tsx` |
| Required desktop viewport | `1440 x 1200` |
| Required tablet viewport | `768 x 1024` |
| Required mobile viewport | `390 x 844` |

- The header is always a dark token scope in both document themes. At desktop it is exactly 72px high, full width, with 40px horizontal padding and a 1px dark-border bottom rule.
- The left group is a 20px/700 JetBrains Mono wordmark followed by seven 14px Geist navigation items at 28px gaps. Only `Início` and `Episódios` may be active links in this slice; the remaining entries are inert placeholders.
- The right group has a 40px secondary circular search control with an 18px Search icon and a 40px primary `Assinar` button with a 16px Mic icon and 8px icon/text gap. The visible theme toggle is excluded because Pencil does not include it.
- The desktop geometry must not use a centered max-width container. At tablet and mobile, hide navigation before it overflows and preserve a 40px minimum touch target for visible controls. No horizontal overflow is allowed.
- Reuse the G02 Button primitive and only token-backed Tailwind classes. The fixed-dark scope must keep nav, border, search, and button colors identical in light and dark document modes.
- Accessibility: use the existing `banner` and `nav` landmarks; retain the search accessible name, preserve semantic links and inert placeholder semantics, and ensure keyboard focus remains visible.

### 1.2 G04 Footer Screen Contract

| Field | Value |
| --- | --- |
| Pencil file | `/cafedebug.pen` |
| Node index | `/.specs/web/foundation/ux-design-reference.md` |
| Component node | `LSgoB` (Site Footer) |
| Route | Global web shell, including `/` |
| Implementation | `apps/web/src/components/layout/footer.tsx` |
| Required desktop viewport | `1440 x 1200` |
| Required tablet viewport | `768 x 1024` |
| Required mobile viewport | `390 x 844` |

- The footer is always a dark token scope in both document themes. At desktop it is full-width `#1A1A1A`, with a 1px top `#2E2E2E` rule, 56px top, 40px horizontal, and 32px bottom padding; its vertical groups are separated by 40px.
- The desktop top row is five columns: a 320px brand column, three link columns, and a 300px newsletter mini column. It uses `space-between` with a 64px gap and must not have a centered max-width wrapper.
- The brand uses a 22px/700 JetBrains Mono wordmark, 14px Geist/1.6 tagline, and five 36px secondary social pills at 10px gaps with GitHub, Twitter, YouTube, LinkedIn, and Instagram icons.
- Link and newsletter titles are 12px/600 JetBrains Mono with 1.5px letter spacing. Link lists use 14px Geist muted text at 14px gaps. Deferred destinations remain inert placeholders, without dead links.
- The newsletter mini-form is a 44px `#111111` pill with a 1px secondary border, 16px left padding, `seu@email.com` placeholder, and a 36px primary ArrowRight send control. It remains UI-only for this goal.
- The bottom row has 13px Geist muted copyright text and legal placeholders at 20px gaps. The top-row grid collapses without horizontal overflow at tablet/mobile while preserving content order and 36px minimum interactive targets.
- Reuse approved shared primitives where their dimensions match; direct token-backed footer composition is allowed for the 36px social/send controls. Preserve semantic footer landmarks, readable labels for icon-only controls, and visible focus treatment for interactive elements.

### 1.3 G05 Hero And Player Screen Contract

| Field | Value |
| --- | --- |
| Pencil file | `/cafedebug.pen` |
| Node index | `/.specs/web/foundation/ux-design-reference.md` |
| Dark component node | `dHS9G` (Home Hero) |
| Light-content component node | `LIrhS` (Home Hero) |
| Route | `/` |
| Implementation | `apps/web/src/features/episodes/components/home-page.tsx` and direct, reusable hero/player support components when needed |
| Required desktop viewport | `1440 x 1200` |
| Required tablet viewport | `768 x 1024` |
| Required mobile viewport | `390 x 844` |

- The Home hero is an always-dark token scope in both document themes. At desktop it is a 719px band below the 72px header, with 80px vertical and 64px horizontal padding, a 64px inter-column gap, an approximately 728px content column, and a 520px player column. It must not use a centered max-width container that changes this geometry.
- Above the 1440px reference viewport, the combined 1312px content row is centered within the full-width hero band. At 1440px it resolves to the same 64px side gutters as Pencil; the player must not remain pinned at the reference x-position and leave an asymmetric empty area on wide desktop screens.
- The information column uses one compact live-dot eyebrow: `EP 142 - EPISODIO EM DESTAQUE`; the title emphasizes `na sua carreira dev` in the primary token; the Pencil description ends with `Novos episodios toda semana.`; and the CTA row uses the approved 52px large primary and outline button variants.
- Statistics are inline metric groups with vertical dividers, not bordered cards. Their Pencil fixture values are `142`, `85k`, and `4.9`, with the exact associated labels from the inspected component.
- The player is a token-backed dark card with 240px artwork, category and `NOVO` overlays, episode metadata, title, guest avatar and role, a progress track with a visible knob, time labels, and controls arranged as speed at left, previous/play/next centered, and volume at right. It is UI-only in this goal: no player-service or data-flow changes.
- Reuse G02 primitives and Lucide icons where available. All colors, borders, text, radii, and shadows must resolve through Pencil-backed design tokens; no hardcoded visual values or route/business logic may be introduced.
- At tablet and mobile, the hero stacks without horizontal overflow, preserves the information before player order, keeps 40px minimum touch targets, and avoids clipped controls or unreadable text. Its dark colors and contrast must remain identical under both root document themes.
- Accessibility: preserve the heading hierarchy; use semantic buttons with accessible names for player controls; decorative artwork remains descriptive or intentionally hidden as appropriate; and keyboard focus stays visible. Deferred player controls may remain inert placeholders.

### 1.4 G06 Episode Card Screen Contract

| Field | Value |
| --- | --- |
| Pencil file | `/cafedebug.pen` |
| Node index | `/.specs/web/foundation/ux-design-reference.md` |
| Component node | `FGSFI` (Episode Card) |
| Route | `/`, as the reusable card before G07 section composition work |
| Implementation | `apps/web/src/features/episodes/components/episode-card.tsx`, episode fixture types/data, and focused source tests |
| Required desktop viewport | `1440 x 1200` |
| Required tablet viewport | `768 x 1024` |
| Required mobile viewport | `390 x 844` |

- `FGSFI` is a 384px-wide, 412px-high reference card. In a responsive grid the card fills its grid track, while its 200px artwork, 16px corner radius, 1px border, and 20px body padding remain fixed. The card clips its image and overlays.
- The artwork contains a category pill at `(16,16)` with 12px horizontal and 6px vertical padding, a centered 56px primary circular Play control with a 22px icon, and a bottom-right duration pill at `(right:16,bottom:18)` using a 12px Headphones icon, 11px Geist text, 10px horizontal and 5px vertical padding.
- The body is a vertical 10px rhythm: 12px metadata row (`EP {number}`, divider, date), 18px/600 Geist title at 1.35 leading, 14px muted Geist excerpt at 1.55 leading, then a guest row after 6px top padding with a 28px circular avatar and `com {guest}` label at a 10px gap.
- In dark scope, card body is `--card`/`--card-foreground` with `--border` and no elevation; in light-content scope it is white with the light border and the approved token-backed soft card elevation. Artwork overlays remain dark translucent in both themes, and the primary Play control remains orange.
- Use `EpisodeCard` with the approved primary/icon primitives and `next/image`. Its Play control must retain the existing player-store interaction and an episode-specific Portuguese accessible name. No data flow, route, or shared-token changes are permitted in G06.
- Deterministic G06 fixtures must provide local artwork and guest-avatar paths for every rendered card. Preserve the inspected Pencil copy, category, date, duration, excerpt, and guest values used by the card; G07 alone may change the section’s card selection or grid geometry.
- At tablet and mobile, the card remains one coherent clipped unit, image overlays remain reachable and visible, body text wraps without clipping, touch targets remain at least 40px, and no horizontal overflow is allowed. Pencil has no distinct mobile card artboard, so structural equivalence is the acceptance criterion there.
- Design gap for the later G07 full-section check: the standalone `FGSFI` reference is 384px wide, while the Pencil desktop homepage instances expand in a 3-column grid. G06 keeps the Play control centered and duration inset from the artwork edges at any card width; G07 must validate the final grid widths against the full page references.

### 1.5 G07 Recent Episodes Screen Contract

| Field | Value |
| --- | --- |
| Pencil file | `/cafedebug.pen` |
| Node index | `/.specs/web/foundation/ux-design-reference.md` |
| Dark section node | `dy62d` (Recent Episodes) |
| Light-content section node | `fx0wZ` (Recent Episodes) |
| Reused component node | `FGSFI` (Episode Card) |
| Route | `/` |
| Implementation | `apps/web/src/features/episodes/components/home-page.tsx`, focused source test, and this contract only |
| Required desktop viewport | `1440 x 1200` |
| Required tablet viewport | `768 x 1024` |
| Required mobile viewport | `390 x 844` |

- The section is a full-width 648px desktop band immediately after the 719px hero. It has `72px` top/bottom and `64px` left/right padding, then a `28px` vertical gap between the header row and grid. It must not add a centered max-width wrapper that changes the 1312px desktop content width.
- The header is a horizontal `space-between` row aligned at its bottom edge. Its title column has a 30px/700 Geist `Episódios Recentes` title and, 6px below it, the exact 15px Geist subtitle `Novas conversas toda semana com a comunidade dev.`. Do not render the previous mono eyebrow.
- The trailing action is an inline `Ver todos` control: 14px/600 Geist primary text, a 16px Lucide ArrowRight, and a 6px icon gap. It is an anchor to the section until a routed episode index exists.
- The grid has three equal desktop tracks, 24px gaps, and the approved `EpisodeCard` component instances for episodes 141, 140, and 139. At 1440px its 1312px inner width yields approximately 421px card tracks; preserve the G06 412px card anatomy and do not alter the approved component.
- In the dark root the section resolves to `#111111`, title to white, and subtitle to `#B8B9B6`; in the light root it resolves to `#F2F3F0`, title to `#111111`, and subtitle to `#666666`. Card light/dark surfaces, borders, and elevation remain owned by G06 semantic tokens.
- At tablet, the grid becomes two tracks; at mobile it becomes one track. The header may stack with the action below the title column when necessary, but the title, action, and cards must not overflow horizontally or obscure one another. Touch targets must remain at least 40px and the approved card remains unchanged.
- Use semantic token-backed Tailwind utilities, the approved G02/G06 primitives, `next/link`, and Lucide. Do not change shared design tokens, hero/header/footer, News and Events, Newsletter, fixtures, episode data, or player behavior in G07.

### 1.6 G08 News Card Screen Contract

| Field | Value |
| --- | --- |
| Pencil file | `/cafedebug.pen` |
| Node index | `/.specs/web/foundation/ux-design-reference.md` |
| Component node | `wQPNg` (News Card) |
| Dark instance evidence | `tMcrh` in `o5gLmf` |
| Light instance evidence | `o2oLS` in `j1TCV` |
| Route | Reusable homepage component before G09 section composition |
| Implementation | `apps/web/src/features/news/` component, types, deterministic fixtures, local assets, and focused source test |
| Required desktop viewport | `1440 x 1200` |
| Required tablet viewport | `768 x 1024` |
| Required mobile viewport | `390 x 844` |

- `wQPNg` is a 384px-wide, content-height card that fills its parent track responsively. It clips its contents with a 16px radius and 1px inner semantic border. It must not inherit episode-card controls or impose a fixed height; the body grows for the inspected title/excerpt copy.
- The artwork stays exactly 200px high. It has only one overlay: a category pill at `(16,16)` with 12px horizontal and 6px vertical padding, 11px/600 JetBrains Mono text at 1px letter spacing, and the primary token foreground. There is no play, duration, or date overlay.
- The body has 20px padding and a 10px vertical rhythm: 18px/600 Geist title at 1.35 leading, 14px Geist excerpt at 1.55 leading, then a meta row after 6px top padding. The meta row has an authored 24px circular image, an 8px gap, 13px/500 author, muted `·`, and muted `N min de leitura` copy.
- Deterministic fixtures reproduce the two inspected homepage instances: `SEGURANÇA` / Camila Torres / `Vulnerabilidade crítica em framework JS é corrigida` / `Patch de emergência lançado após descoberta de falha que afetava milhões de aplicações.` / `4 min de leitura`; and `COMUNIDADE` / Pedro Antunes / `CaféDebug Conf 2026: inscrições abertas` / `O maior evento da comunidade dev brasileira volta em outubro, agora em formato híbrido.` / `3 min de leitura`. Both artwork and author photos must be local public mock assets.
- In dark scope the card resolves to `--card`/`--card-foreground` with `--border` and no elevation; in light-content scope it resolves to white, the light semantic border, and the approved token-backed soft card elevation. Image artwork and category overlay remain visually stable in both roots.
- At tablet and mobile, the card fills its available grid track; the 200px artwork and overlay insets remain fixed, copy wraps without clipping, and no horizontal overflow is allowed. Pencil has no standalone small card variant, so structural equivalence is the acceptance criterion.
- Use `next/image`, semantic token-backed Tailwind utilities, and a feature-local `NewsArticle` type. Meaningful artwork and author images need descriptive alt text. No route, data-fetching, shared-token, header/footer, hero, EpisodeCard, or G09 News and Events section changes are permitted in G08.

### 1.7 G09 News And Events Screen Contract

| Field | Value |
| --- | --- |
| Pencil file | `/cafedebug.pen` |
| Dark section node | `o5gLmf` (News & Events) |
| Light section node | `j1TCV` (News & Events) |
| Reused component | `wQPNg` (News Card) |
| Route | `/` |
| Implementation | `apps/web/src/features/episodes/components/home-page.tsx`, feature-local deterministic event fixtures, and focused source tests |
| Required desktop viewport | `1440 x 1200` |
| Required tablet viewport | `768 x 1024` |
| Required mobile viewport | `390 x 844` |

- At the 1440px reference, the theme-following section is exactly 713px tall with 72px vertical and 64px horizontal padding, 48px between an 884px news column and a 380px event panel, and a 1px top/bottom token border. It uses `--card` as its band surface and `--border` for the rules in both document themes.
- The news column has a 64px heading group: `Últimas Notícias` (30px/700 Geist) and `O que está acontecendo no mundo do desenvolvimento.` (15px Geist), with a token-primary `Ver todas` action and 16px ArrowRight. A 24px gap separates its header from two approved `NewsCard` instances in a two-up desktop grid with a 24px gap. G09 must not change the G08 card anatomy or fixtures.
- The 380px `Agenda de Eventos` rail is a token card with a 16px radius, 1px border, 24px padding, and 20px vertical rhythm. Its title is 20px/700 Geist with an 18px token-primary Calendar icon. Four static event rows use 52px by 57px date badges, 16px row vertical padding, 14px badge/content gaps, 1px separators, and a full-width 44px secondary `Ver agenda completa` button.
- Event fixtures are deterministic and match Pencil: `OUT 12`, `ONLINE`, `Workshop: Clean Architecture na prática`, `Online · 19h`; `OUT 24`, `PRESENCIAL`, `CaféDebug Conf 2026`, `São Paulo, SP`; `NOV 08`, `ONLINE`, `Live: Carreira internacional para devs`, `Online · 20h`; `NOV 21`, `PRESENCIAL`, `Meetup CaféDebug Rio`, `Rio de Janeiro, RJ`.
- Desktop uses a two-card news grid and event rail. At tablet and mobile, the section may stack with the news content before events, but must preserve 24px-or-greater reading gaps, full-width cards, 40px minimum touch targets, semantic headings/buttons, descriptive image alt text, and no horizontal overflow.
- The section follows the document theme through semantic token classes: dark has `--card`/`--border`/`--secondary` values from the Dark mode, and light has their Pencil Light values. Do not pin it to a dark scope or introduce raw colors, direct fetches, route logic, or changes to the approved G08 card.

### 1.8 G09 Wide Desktop Containment Correction

| Field | Value |
| --- | --- |
| User-reported evidence | Wide desktop screenshots supplied after initial G09 validation |
| Pencil reference width | 1440px, with 64px side gutters and a 1312px content width |
| Affected sections | Recent Episodes `dy62d` / `fx0wZ`; News and Events `o5gLmf` / `j1TCV` |
| Required maximum content width | 1312px |

- The visual reference establishes a 1312px inner content width at its 1440px desktop artboard. The wide desktop behavior was unspecified in Pencil, and the user requires this width to remain the maximum rather than allowing cards, headings, or event rails to stretch across wider screens.
- Keep the full-width background, padding, and News and Events border rules on their section bands. Center only their inner content grids with `width: 100%` and `max-width: 1312px`; at 1440px this must retain the original 64px gutters and all approved G07/G09 measurements.
- At narrower desktop, tablet, and mobile, the inner container must continue to fill the available content width, preserve the existing grid breakpoints, and introduce no horizontal overflow. This correction must not change card anatomy, fixtures, tokens, or the hero container.

### 1.9 G10 Newsletter Screen Contract

| Field | Value |
| --- | --- |
| Pencil file | `/cafedebug.pen` |
| Dark section node | `GzxFp` (Newsletter) |
| Light section node | `tEL7F` (Newsletter) |
| Related reusable components | `gKpi4` (Input Group/Default), `z6HCm` (Input Group/Filled), `ZETEA` (Button/Default), `ZGI9Z` (Button/Large/Default) |
| Route | Homepage, after News and Events and before the footer |
| Required desktop viewport | `1440 x 1200` |
| Required tablet viewport | `768 x 1024` |
| Required mobile viewport | `390 x 844` |

- At the 1440px reference, the section is exactly 574px high, spans the full viewport width, and remains dark-locked in both document themes. It has 80px vertical and 64px horizontal outer padding and contains a centered 1312px by 414px card.
- The card uses the dark token card surface, a 1px token border, a 16px radius, 56px top/bottom and 48px side padding, and a 20px vertical rhythm. Its inner content is center aligned. The Pencil card contains a faint orange radial effect; repository visual guidance prohibits decorative gradients and orb effects, so this is an explicit accepted residual rather than an implementation requirement.
- The 56px secondary icon circle contains a 24px primary Mail icon. The exact title is `Fique por dentro do universo dev` (34px/700 Geist, 1.15 leading), followed by the exact centered subtitle `Receba os melhores episódios, notícias e vagas direto no seu email. Toda semana, sem ruído.` (16px Geist, 1.55 leading).
- The form is 560px wide with 8px top padding. At desktop it contains a 401px by 52px email input and a 147px by 52px primary subscribe button, separated by 12px. The input shows a 16px Mail icon and the placeholder `Seu melhor email`; the button label is `Inscrever-se`. Use a semantic label, email input, and submit button, with visible keyboard focus. The helper copy is exactly `Sem spam. Cancele quando quiser.` in 13px muted text.
- The newsletter must set its own dark surface, foreground, muted foreground, input, and border token scope so the component remains visually dark in the root Light mode. Use semantic token-backed utilities only. Do not use raw color values, direct fetches, client-side state unless required for native form semantics, or unrelated changes to shared tokens, other sections, fixtures, header, footer, or the hero.
- Below desktop, retain 40px-or-greater touch targets and prevent horizontal overflow. The card/container must stay capped at the approved 1312px content width, while the form may stack with full-width input and button at narrow widths. Preserve readable centered copy and the exact dark-section hierarchy at tablet and mobile.

---

## 2. Section-Level Design Mapping

### 2.1 Hero (from `tWWON` and `k71CIc`)

Must include:

1. Left content cluster: eyebrow, title, full description, CTA row, stats row.
2. Live indicator element (dot + label) in the hero information hierarchy.
3. Right rich player card containing:
   - artwork
   - playback controls group
   - time labels and progress affordance
   - speed indicator/control
   - volume indicator/control

### 2.2 Recent Episodes (card uses `FGSFI`)

Must include:

1. Section subtitle + title hierarchy.
2. Card image block with:
   - category label
   - centered play icon button (56x56)
   - duration pill with icon
3. Card body text rhythm aligned to Pencil spacing and typography hierarchy.

### 2.3 News & Events

Must include:

1. News column with cards mirroring Pencil structure.
2. Events column with schedule anatomy mirroring Pencil.
3. No placeholder-only panel.

### 2.4 Newsletter

Must include:

1. Correct title/body copy.
2. Main email pill input-style element with send button.
3. UI-only treatment (no submit integration in this phase).

---

## 3. Theme Behavior Mapping

1. Dark reference: `tWWON`.
2. Light-content reference: `k71CIc`.
3. Header and footer parity is anchored to `m9zV96` and `LSgoB` in both modes.
4. Homepage sections that are dark-pinned vs light-content must follow Pencil section behavior.

---

## 4. Verification Strategy

1. Visual check per section against required node IDs.
2. Verify no regressions on header/footer while updating homepage sections.
3. Verify mobile responsive equivalence for hero, cards, news/events, newsletter.
4. Verify token-only styling and no architecture violations.
