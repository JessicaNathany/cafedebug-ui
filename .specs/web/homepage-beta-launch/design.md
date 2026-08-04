# Design: Homepage Beta Launch Parity

| Field | Value |
| --- | --- |
| **Status** | `Implemented` |
| **Spec** | `.specs/web/homepage-beta-launch/spec.md` |
| **Pencil file** | `/cafedebug.pen` |
| **Dark page** | `b3Kzt` |
| **Light page** | `F0E1s` |
| **Route** | `/` |

## 1. Design source and node map

| Area | Dark | Light |
| --- | --- | --- |
| Outer artboard | `fm0R5` | `B3qM0p` |
| 1440px page | `b3Kzt` | `F0E1s` |
| Header | `M9Wiwt` | `VH3jo` |
| Hero | `BjEw5` | `JG04K` |
| Banner carousel | `H4D8y` | `np9bc` |
| Carousel viewport | `Wpaiz` | `aE27Y` |
| Featured player | `RXOIr` | `XEbWn` |
| Recent episodes | `c3qKCJ` | `Ijlxy` |
| Episode grid | `Y2Tiu2` | `vAfyX` |
| Disabled News/Events | `R2MZY` | `FcEf0` |
| Newsletter | `wSlSh` | `n2DeHV` |
| Footer | `Q77OEY` | `dG0vW` |
| Reusable episode card | `FGSFI` | `FGSFI` with `Mode: Light` |

## 2. Viewports

| Name | Size | Validation rule |
| --- | --- | --- |
| Desktop | `1440x1200` | Exact Pencil geometry and visual parity |
| Tablet | `768x1024` | Inferred structural equivalence |
| Mobile | `390x844` | Inferred structural equivalence |

The Pencil outer presentation frames are `1600x2954` with 80px canvas padding. Use the inner `1440x2794` page nodes for implementation comparison.

## 3. Desktop layout contract

| Section | Y | Size | Rule |
| --- | ---: | ---: | --- |
| Header | 0 | `1440x72` | Theme-following beta chrome |
| Hero | 72 | `1440x734` | `[80,64]`, two columns, gap 64 |
| Recent Episodes | 806 | `1440x1084` | `[72,64]`, 3x2 grid |
| Newsletter | 1890 | `1440x574` | `[80,64]`, centered card |
| Footer | 2464 | `1440x330` | Theme-following beta chrome |

`News & Events` remains in Pencil and source preservation boundaries but is disabled and consumes no beta layout space.

## 4. Architecture and preservation design

### 4.1 Feature boundaries

```text
apps/web/src/features/
  homepage/
    components/
      homepage-beta.tsx        # server composition routed at /
      homepage-v2.tsx          # preserved future 2.0 composition
      recent-episodes.tsx
      newsletter-section.tsx
  banners/
    components/
      banner-carousel.tsx      # client interaction boundary
    mock/
      homepage-banners.mock.ts
    types.ts
```

Names may follow nearby conventions, but the versioned beta/V2 boundary and banner-domain separation are mandatory.

### 4.2 Route-specific shell

The beta homepage requires theme-following header/footer, while current episode-detail contracts keep fixed-dark chrome. Preserve both variants and compose them through route groups or another server-readable route boundary:

- Beta `/`: theme-following `Header` and `Footer`, Search + ThemeToggle.
- Existing content routes: current fixed-dark shell behavior remains until their Pencil contracts change.
- `RootLayout`: fonts, providers, metadata, structured data, and persistent mini-player only.

Do not use client-only pathname styling that causes the wrong shell on first paint.

### 4.3 Protected 2.0 artifacts

At minimum preserve:

- current text hero and `heroStats` values;
- `HeroPlayer`, `EpisodeCard`, `PlayButton`, `NewsletterForm`;
- complete News/Agenda JSX, `NewsCard`, mocks, types, and local assets;
- header `Assinar` action and its mic icon;
- current footer fixed-dark variant;
- `.specs/web/homepage-visual-parity/` and all G03-G10 tests.

Tests that read `home-page.tsx` may be retargeted to `homepage-v2.tsx`; their assertions remain meaningful.

## 5. Header contract

- 72px high; 40px desktop horizontal padding.
- Logo: JetBrains Mono 20/700.
- Nav: Geist 14px with 28px gaps.
- Right actions: 40x40 Search, 14px gap, 40x40 theme button.
- Theme icon: Sun 18px in dark, Moon 18px in light.
- Pencil implements the control by overriding Header component `m9zV96`: `ckr79` becomes `ThemeToggle`, icon `SJhVG` changes, label `JHypU` is disabled.
- Reuse the existing theme cookie/provider path. The SSR icon and accessible name must agree with the resolved server theme.

## 6. Hero, carousel, and player contract

### 6.1 Hero geometry

- Hero: `1440x734`, padding `[80,64]`, gap 64.
- Carousel: `728x574`.
- Player: `520x559` at desktop x=856.
- No metrics row exists in beta.
- Orange radial glow is part of both beta artboards. Promote it to a semantic value in `packages/web-design-tokens`; feature source must not embed raw gradient colors.

### 6.2 Carousel anatomy

- Viewport `728x520`, radius 16.
- Slide content inset 36px.
- Eyebrow JetBrains Mono 12/600.
- Headline Geist 42/700 at 1.12 line-height.
- Subtitle Geist 15 at 1.5 line-height.
- CTA height 50, pill radius, 12px CTA gap.
- Controls are 14px below viewport and `728x40`.
- Four desktop tabs are 120px wide with 20px gaps; active bar uses Primary, inactive bars use Border.
- Counter starts at `01 / 04`; previous/next are 40px circular controls with an 8px gap.

### 6.3 Deterministic slide fixtures

| # | Eyebrow | Headline | Subtitle | Primary CTA | Secondary CTA |
| ---: | --- | --- | --- | --- | --- |
| 1 | `EP 142 · EPISÓDIO EM DESTAQUE` | `Dê o próximo passo na sua carreira dev` | `Conversas profundas com os melhores desenvolvedores sobre carreira, tecnologia e crescimento profissional.` | `Ouvir agora` | `Ver todos os episódios` |
| 2 | `NOVA TEMPORADA · 2026` | `Seis meses de conversas que mudam carreiras` | `Uma temporada inteira dedicada a quem quer crescer de verdade na engenharia de software.` | `Ver a temporada` | `Assinar o feed` |
| 3 | `AO VIVO · 24 JUN · SÃO PAULO` | `CaféDebug ao vivo, pela primeira vez` | `Gravação aberta, painéis com convidados e networking com a comunidade dev.` | `Garantir ingresso` | `Saber mais` |
| 4 | `COMUNIDADE · 85 MIL DEVS` | `Feito com a comunidade, para a comunidade` | `Sugira pautas, indique convidados e participe das gravações ao vivo toda semana.` | `Entrar na comunidade` | `Ver episódios` |

Localize the exact Pencil image fills as:

- `/mock/home-beta-banner-featured.jpg`
- `/mock/home-beta-banner-season.jpg`
- `/mock/home-beta-banner-live.jpg`
- `/mock/home-beta-banner-community.jpg`

Keep the Pencil remote URL in fixture metadata for provenance, but render local files.

| # | Dark slide | Light slide | Pencil source photo |
| ---: | --- | --- | --- |
| 1 | `H9W1S` | `L26kS` | `https://images.unsplash.com/photo-1561726976-e4fb49f9813b` |
| 2 | `qxdnq` | `tbKTl` | `https://images.unsplash.com/photo-1546900703-cf06143d1239` |
| 3 | `pmTiN` | `WzOur` | `https://images.unsplash.com/photo-1762968280286-0bfcc4afd0ea` |
| 4 | `VjfSh` | `mB3ox` | `https://images.unsplash.com/photo-1576085898323-218337e3e43c` |

### 6.4 Interaction model

- Region accessible name: `Destaques do CaféDebug`; `aria-roledescription="carousel"` is allowed.
- Selectors implement a semantic `tablist` named `Selecione um destaque`. Each `tab` is named from its authored label, owns a stable `id`, sets `aria-controls` to its `tabpanel`, exposes `aria-selected`, and uses roving `tabIndex` (`0` active, `-1` inactive).
- Left/Right arrows on a focused tab wrap, move focus, and activate the adjacent slide; Home/End focus and activate the first/last slide. Enter/Space activation remains supported by native button behavior.
- Previous/next carousel buttons change selection but retain focus on the arrow button. The active tab and panel relationships update synchronously.
- Previous/next wrap at the ends.
- Slide 1 primary is a `<button>` reusing EP 142 play behavior. Slide 1 secondary and slide 4 secondary are `<a href="#episodios">` links.
- Slide 2 CTAs, slide 3 CTAs, and slide 4 primary are focusable `<button type="button" aria-disabled="true">` placeholders with no click handler. Preserve their Pencil appearance and do not invent routes.
- Active counter may use a polite live region; slide body must not announce on every focus move.
- Inactive slide content is `hidden`/inert rather than only transparent.
- No autoplay.
- Motion is a short token-backed transition and becomes instant under reduced motion.
- At mobile, four compact equal progress buttons replace 120px text tabs; labels remain accessible. Counter and arrows remain visible.

### 6.5 Player

- Artwork `520x240`; body `520x319` with 24px padding and 16px gap.
- Fixture EP 142, 12 Jun 2026, Ana Ribeiro, `Engenheira de Software · Google`, `18:24 / 48:12`, speed 1.0x.
- Center Pause action is 52px and represents the authored visual state.
- Preserve current disabled/inert placeholder semantics unless a separate player behavior spec changes them.

## 7. Recent Episodes contract

- Section padding `[72,64]`, gap 28.
- Header `1312x64`.
- Grid `1312x848`, two 412px rows, 24px row/column gaps.
- Desktop track width is approximately 421.33px.
- Cards reuse `FGSFI`, with 200px artwork and content-driven total height.
- Exact order and deterministic card data:

| EP | Category | Date | Duration | Title | Excerpt | Guest | Local artwork / avatar |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 141 | CARREIRA | 5 Jun 2026 | 52 min | Negociação salarial: como pedir o aumento que você merece | Táticas reais de negociação para devs em todos os níveis. | Marcos Vinícius | `/mock/episode-141.jpg` / `/mock/guest-marcos.jpg` |
| 140 | ARQUITETURA | 29 Mai 2026 | 1h 04min | Microsserviços valem a pena? Lições de quem migrou | Os trade-offs reais entre monolito e microsserviços na prática. | Letícia Souza | `/mock/episode-140.jpg` / `/mock/guest-leticia.jpg` |
| 139 | IA | 22 Mai 2026 | 47 min | Programando com IA: o novo fluxo de trabalho do dev | Como agentes de código estão mudando o dia a dia da engenharia. | Rafael Lima | `/mock/episode-139.jpg` / `/mock/guest-rafael.jpg` |
| 138 | TESTES | 15 Mai 2026 | 39 min | TDD sem dogma: o que realmente vale a pena testar | Onde investir esforço em testes e onde parar de perder tempo. | Camila Ferreira | `/mock/episode-138.jpg` / `/mock/guest-camila.jpg` |
| 137 | CARREIRA | 8 Mai 2026 | 58 min | De pleno a sênior: o que muda de verdade | As habilidades que ninguém te conta na hora da promoção. | Diego Andrade | `/mock/episode-137.jpg` / `/mock/guest-diego.jpg` |
| 136 | PRODUTO | 1 Mai 2026 | 44 min | Dev e produto: como parar de brigar e começar a construir | Alinhando engenharia e produto sem perder velocidade. | Juliana Prado | `/mock/episode-136.jpg` / `/mock/guest-juliana.jpg` |

New Pencil asset provenance:

- EP 138 artwork `https://images.unsplash.com/photo-1621839673705-6617adf9e890`; avatar `https://images.unsplash.com/photo-1546249041-2316761d7c1c`.
- EP 137 artwork `https://images.unsplash.com/photo-1777861845854-4f35ab170680`; avatar `https://images.unsplash.com/photo-1587397845856-e6cf49176c70`.
- EP 136 artwork `https://images.unsplash.com/photo-1700561571254-4fb2f1cbcbc8`; avatar `https://images.unsplash.com/photo-1595085610896-fb31cfd5d4b7`.

- Add EP 138-136 to the existing fixture array. Do not replace EP 142-139.
- Add deterministic local artwork and guest avatars for the three new fixtures.
- Episode artwork alt is `Capa do episódio {number}: {title}`. Guest-avatar alt is the exact guest name. Carousel background photos use empty alt because the slide heading/eyebrow identifies the content.

## 8. Newsletter and footer contract

- Newsletter section `1440x574`; card `1312x414`; padding `[56,48]`; radius 16.
- Title Geist 34/700; subtitle Geist 16/1.55.
- Input `401x52`; submit `147x52`.
- Footer `1440x330`; content, social icons, newsletter mini-control, legal items, and 2026 copyright remain.
- Beta variants inherit the current root theme instead of applying `.dark`.

## 9. Theme and token contract

| Token | Light | Dark |
| --- | --- | --- |
| `--background` | `#F2F3F0` | `#111111` |
| `--foreground` | `#111111` | `#FFFFFF` |
| `--card` | `#FFFFFF` | `#1A1A1A` |
| `--secondary` | `#E7E8E5` | `#2E2E2E` |
| `--border` | `#CBCCC9` | `#2E2E2E` |
| `--muted-foreground` | `#666666` | `#B8B9B6` |
| `--primary` | `#FF8400` | `#FF8400` |

The current token package already matches these Pencil values. “All white” is implemented by removing fixed-dark scopes from the beta composition, not by changing `--background` globally.

## 10. Responsive contract

- Desktop: exact two-column hero and 3x2 episode grid.
- Tablet (`768px`): hero stacks with 40px horizontal gutters and 40px vertical gap. Carousel is fluid `width: 100%` with a 688px maximum, so browser scrollbar width cannot create overflow; viewport keeps the desktop `728:520` ratio and uses `object-fit: cover`. Player is fluid up to 520px and centers. CTAs stay in one row. Carousel selectors and counter/arrows split into two stable 40px rows with a 12px gap. Episode grid is 2x3.
- Mobile (`390px`): hero uses 16px horizontal gutters and 32px vertical gap. Carousel is fluid `width: 100%` with a 358px maximum and a fixed 420px slide viewport, so it resolves to the actual scrollbar-safe content width. Use 24px content inset, 32px headline, and 14px body copy. CTAs stack as two full-width 50px controls. Four equal progress tabs occupy one row with visible labels replaced by screen-reader labels; counter/arrows occupy a second 40px row. Player is fluid up to the available width. Episode grid is 1x6.
- Every slide uses a stable viewport height at its breakpoint. Images use cover cropping and a per-fixture focal position validated against the Pencil desktop crop; content never changes carousel height.
- Preserve 40px minimum targets, readable CTA wrapping, and stable media ratios.
- No document-level horizontal scroll.
- Because no responsive Pencil artboards exist, any visual inference must be recorded in validation evidence and must not be described as pixel parity.

## 11. Validation contract

- Capture Pencil pages `b3Kzt` and `F0E1s`.
- Capture runtime `/` dark/light at all three required viewports. At the 1440x1200 desktop viewport, capture the full `1440x2794` page so Newsletter/Footer geometry is included.
- Compare geometry, fonts, copy, assets, colors, radii, control state, section order, and overflow.
- Exercise theme persistence, all carousel controls, keyboard order, focus visibility, hidden-slide semantics, and reduced motion.
- Confirm beta DOM has six episode cards and no News/Agenda.
- Render or source-test `HomepageV2` so preservation is proven.
- Run lint, typecheck, test, build, and `git diff --check`.
