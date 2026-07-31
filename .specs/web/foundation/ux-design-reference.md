# UX Design Reference — CafeDebug 2.0 Website (`cafedebug.pen`)

| Field | Value |
|---|---|
| **Status** | `Implemented` |
| **Domain** | `web/foundation` |
| **Audience** | UX Team + `apps/web` implementers |
| **Design source** | `cafedebug.pen` (Pencil file, repo root) |
| **Companion docs** | `spec.md` (scope), `design.md` (architecture/tokens), `tasks.md` (execution) |
| **Created** | 2026-07-12 |

---

## 0. How to read this document

This is the **single source of truth for the visual design** of the CafeDebug 2.0 website.
It is extracted from the Pencil design file `cafedebug.pen` at the repo root, which contains a
full design system (105 components) plus **11 fully designed page screens**, each drawn in both
**Light** and **Dark** themes.

> ⚠️ **Scope vs. the design file.** The `cafedebug.pen` file designs the **whole website**
> (Phases 1–4 of the README roadmap). The **Foundation Slice 1** (`spec.md` §3) ships only a
> **subset**: the shell (header/footer/nav), the **Home** page, the **episode detail** page, and
> the **persistent audio player skeleton**. Everything else in this document (Episodes listing,
> News, Team, Contact, Jobs, Events, About, Advertisement) is **design reference for later
> slices** — build the components generically now, wire the deferred pages later. Each page
> section below is tagged **`[Slice 1]`** or **`[Deferred]`**.

### Opening the design in Pencil (for the UX team)

The `.pen` file is encrypted — open it with the **Pencil MCP tools**, not a text editor. Every
screen and component below lists its **Pencil node ID**. To inspect one:

- `get_editor_state({ include_schema: true })` — load the document + schema first.
- `get_screenshot({ filePath: "cafedebug.pen", nodeId: "<id>" })` — render a screen/component.
- `batch_get({ filePath: "cafedebug.pen", nodeIds: ["<id>"], readDepth: 3 })` — inspect structure/copy.

The canvas is laid out as: design-system component library at the top; the **12 page frames**
in a row at `y ≈ 4200` (dark-theme content on the left, "Light Content" duplicates further
right); the site-specific reusable components (`m9zV96`, `LSgoB`, `FGSFI`, `wQPNg`, `e3Drx`)
just above the pages. The remaining top-of-canvas frames are the Pencil welcome/tutorial and
are **not** part of the product.

---

## 1. Design tokens (authoritative — from `cafedebug.pen` variables)

These are the **real** token values defined in the design file. They **supersede** the
illustrative values sketched in `design.md` §2.2 — see the **reconciliation** callout at the
end of this section. All theming is driven by a single `Mode` axis: **Light** / **Dark**.

### 1.1 Color tokens

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--background` | `#F2F3F0` | `#111111` | Page background |
| `--foreground` | `#111111` | `#FFFFFF` | Primary text |
| `--card` | `#FFFFFF` | `#1A1A1A` | Card / panel surfaces, footer |
| `--card-foreground` | `#111111` | `#FFFFFF` | Text on cards |
| `--primary` | `#FF8400` | `#FF8400` | **Brand orange** — CTAs, accents, links, "Debug" wordmark (identical in both themes) |
| `--primary-foreground` | `#111111` | `#111111` | Text/icon on orange (dark, both themes) |
| `--secondary` | `#E7E8E5` | `#2E2E2E` | Chips, icon pills, muted buttons, avatars |
| `--secondary-foreground` | `#111111` | `#FFFFFF` | Text on secondary |
| `--muted` | `#F2F3F0` | `#2E2E2E` | Muted surfaces |
| `--muted-foreground` | `#666666` | `#B8B9B6` | Secondary text, captions, inactive nav |
| `--accent` | `#F2F3F0` | `#111111` | Accent surface |
| `--accent-foreground` | `#111111` | `#F2F3F0` | Text on accent |
| `--border` | `#CBCCC9` | `#2E2E2E` | Card/section borders, dividers |
| `--input` | `#CBCCC9` | `#2E2E2E` | Input borders |
| `--ring` | `#666666` | `#666666` | Focus ring |
| `--popover` | `#FFFFFF` | `#1A1A1A` | Popover/dropdown surface |
| `--destructive` | `#D93C15` | `#FF5C33` | Destructive actions |

**Status colors** (surface + foreground pairs, used by alerts/badges):

| Token | Light surface / fg | Dark surface / fg |
|---|---|---|
| `--color-success` / `-foreground` | `#DFE6E1` / `#004D1A` | `#222924` / `#B6FFCE` |
| `--color-warning` / `-foreground` | `#E9E3D8` / `#804200` | `#291C0F` / `#FF8400` |
| `--color-error` / `-foreground` | `#E5DCDA` / `#8C1C00` | `#24100B` / `#FF5C33` |
| `--color-info` / `-foreground` | `#DFDFE6` / `#000066` | `#222229` / `#B2B2FF` |

> Sidebar tokens (`--sidebar*`) also exist but are for admin-style layouts and are **not used**
> by the public website screens.

### 1.2 Typography

| Token | Value | Role |
|---|---|---|
| `--font-primary` | **JetBrains Mono** | Wordmark, section eyebrows/labels, category tags, EP numbers, dates, durations, stats/metrics, footer column titles, code — the "monospace/technical" voice |
| `--font-secondary` | **Geist** | Nav, headings, body copy, article prose, buttons — the "humanist/reading" voice |

Type scale seen across screens (px, unitless line-height ratios): display headings **46–56 / 1.05–1.1**,
section titles **26–38 / 700**, card titles **18 / 600**, body **16–17 / 1.6–1.7**, captions/labels
**11–14**, eyebrows **11–14** with `letterSpacing` 1.5–2.

### 1.3 Radii & elevation

| Token | Value | Usage |
|---|---|---|
| `--radius-m` | `16px` | Cards, panels, images, inputs (rectangular) |
| `--radius-pill` | `999px` | Buttons, chips, avatars, tags, icon buttons, progress track |
| `--radius-none` | `0` | — |

Elevation: cards use a 1px `--border` stroke + subtle outer drop shadow. Hero/newsletter cards
add a **radial orange glow** (`#FF8400` at low alpha, ~top/top-left) behind them for brand warmth.

### 1.4 ⚠️ Reconciliation with `design.md` §2.2

The current `design.md` token sketch **does not match** the finished design and must be updated
to these values before/while building. Specifically:

1. **Header/footer render dark in BOTH themes → resolved.** Both Homepage frames (dark and the
   "Light Content" one) render the header and footer **dark** — see §1.5 for the section-by-section
   diff. This aligns with `design.md` FR-3's "charcoal in both themes." Build the header/footer as
   an **always-dark scope** (§1.5), not a theme-flipping surface.
2. **Fonts differ.** Design is **JetBrains Mono + Geist**, not `design.md`'s
   "Bricolage Grotesque + Inter + JetBrains Mono". Use the two fonts above.
3. **Palette is hex, not oklch charcoal/cream.** Backgrounds are near-black `#111111` (dark) /
   off-white `#F2F3F0` (light); orange is `#FF8400` in **both** themes. Replace the oklch
   primitives in `design.md` §2.2 with the §1.1 table (keep the app-local Tailwind v4 `@theme`
   mapping mechanism from `design.md` §2.3 — only the values change).
4. **Buttons are pill-shaped** (`--radius-pill`), not the `0.5rem` `radius-button` in `design.md`.
5. **Icon library is `lucide`** everywhere (matches `design.md` §9.1 `lucide-react`).

### 1.5 Theme model (Slice-1 pages) — always-dark chrome, per-page theming  `[Slice 1]`

**Shared invariant (verified on both Slice-1 pages): the Site Header and Site Footer are dark in
both themes.** Beyond that, the two pages theme **differently** — Home is dark-first with only two
content bands flipping; Episode Detail is a conventional whole-page flip with the chrome pinned
dark. Build the header/footer as always-dark chrome; treat the rest per page below.

#### Home — dark-first, content-band theming (`tWWON` dark / `k71CIc` light)

The design ships **two Homepage frames**: a fully **dark** page (`tWWON`) and a **"Light Content"**
page (`k71CIc`). Diffed section-by-section, the *only* difference is **two content bands** — the
chrome and the hero/newsletter bands are **identical (dark)** in both:

| Section (top → bottom) | Dark page `tWWON` | Light page `k71CIc` | Rule |
|---|---|---|---|
| Site Header | dark | dark | **always dark** (chrome) |
| Hero | dark | dark | **always dark** (brand band) |
| Recent Episodes | dark | **light** | follows theme |
| News & Events | dark | **light** | follows theme |
| Newsletter | dark | dark | **always dark** (pinned `Mode: Dark`) |
| Site Footer | dark | dark | **always dark** (chrome) |

So the homepage is **dark-first**: switching to "light" only lightens the **Recent Episodes** and
**News & Events** content bands; the header, hero, newsletter CTA, and footer stay dark as a
constant brand frame. (In Pencil this is done with per-section `theme` overrides — the Newsletter
is explicitly pinned `Mode: Dark`; header/hero/footer stay dark with the page baseline; only the
two content bands carry `Mode: Light` in the light frame.)

On Home, then, the **hero and newsletter stay dark** alongside the chrome, and only the episode/
news content is theme-responsive.

#### Episode Detail — conventional whole-page flip, dark chrome (`VkDts` dark / `Oh9Bv` light)

Episode Detail themes **differently** from Home. Its light frame (`Oh9Bv`) sets the **page root to
`Mode: Light`**, so the hero, audio player, show notes, chapters, sidebar, comments, and related
episodes **all go light**. **Only the Site Header and Site Footer carry an explicit `Mode: Dark`
pin** — the hero is *not* locked dark here (unlike Home).

| | Home light `k71CIc` | Episode Detail light `Oh9Bv` |
|---|---|---|
| Page baseline | **dark** | **light** |
| Site Header / Footer | dark | dark (pinned) |
| Hero | dark | **light** |
| Newsletter | dark (pinned) | — |
| Content bands | light | light |

**Implementation for Slice 1:**
- **Always-dark chrome (both pages):** give Site Header/Footer the dark `--header`/`--footer`
  tokens (dark in both themes) — see §1.4/`design.md` §2.2.
- **Episode Detail:** a standard themed page — the hero + player + content follow the document
  `.dark`/light class set by `next-themes`; no forced-dark regions except the chrome.
- **Home:** content bands follow the theme; wrap the **hero and newsletter** subtrees in a forced
  `<div className="dark">…</div>` (the Tailwind v4 `dark` variant resolves against the nearest
  `.dark` ancestor) so they stay dark under a light document class.
- This **resolves the header/footer chrome question** in §1.4: dark in both themes, both pages.

---

## 2. Component library

The `.pen` file ships a design system (top-of-canvas frame `frame-1761929672442`) with **105
reusable components**. The website screens compose from both the generic DS primitives and a
handful of **site-specific** components.

### 2.1 Generic DS primitives used by the site (map to `components/ui/`)

Buttons (`Button/Default` `ZETEA`, `Button/Outline` `4x7RU`, `Button/Secondary`, `Button/Ghost`,
`Button/Destructive` + `Large` variants), `Icon Button`, `Label` badges
(`Label/Orange` `L8Rgv`, `Label/Success` `7KC5U`, `Label/Violet` `rjvI1`, `Label/Secondary` `it00G`),
`Input Group` (`gKpi4`), `Select Group` (`XhJWF`), `Textarea Group` (`QFzE8`),
`Search Box` (`T5yK2`), `Tab Item` (`KbyBJ`/`BdBJJ`), `Pagination` (`9PVw5` + items
`oT0d2`/`Doslm`/`Irk3I`), `Avatar/Text` (`90SQo`), `Avatar/Image` (`4AN1p`), `Card`, `Accordion`,
`Alert`, `Tooltip`, `Switch`, `Checkbox`, `Radio`, `Dropdown`, `Table`/`Data Table`, `Sidebar`
(admin), `Modal`/`Dialog`, `Breadcrumb`.

> The completed homepage-parity work extends the initial Slice 1 primitive set with `Button`,
> `IconButton`, `Label`, `Input`, `SearchBox`, and `Card` under `components/ui/`. The remaining
> generic primitives are still deferred until a designed route requires them.

### 2.2 Site-specific components (build these in `features/` / `components/layout/`)

| Component | Pencil ID | Where used | Slice |
|---|---|---|---|
| **Site Header** | `m9zV96` | every page | **Slice 1** (`components/layout/header.tsx`) |
| **Site Footer** | `LSgoB` | every page | **Slice 1** (`components/layout/footer.tsx`) |
| **Episode Card** | `FGSFI` | Home, Episodes listing, Related | **Slice 1** (`features/episodes/components/episode-card.tsx`) |
| **News Card** | `wQPNg` | Home, News listing/detail | Homepage parity (`features/news/components/news-card.tsx`); News listing/detail routes deferred |
| **Profile Card** | `e3Drx` | Team page | Deferred (Team feature) |

---

## 3. Site components — anatomy & copy

### 3.1 Site Header — `m9zV96`  `[Slice 1]`

- **1440 × 72**, fill `--background`, 1px bottom `--border`, padding `[0, 40]`, space-between,
  center-aligned.
- **Left:** wordmark **"Café"** (`--foreground`) + **"Debug"** (`--primary`), `--font-primary`
  20px/700 — then nav (`--font-secondary` 14px, gap 28): **`Início`** · **`Episódios`** ·
  **`Notícias`** · **`Eventos`** · **`Vagas`** · **`Time`** · **`Sobre`**. The current page's item
  is `--foreground`/600; the rest are `--muted-foreground`.
- **Right:** 40×40 round search button (`--secondary`, lucide `search`) + **`Assinar`** pill
  button (`--primary`, lucide `mic`).

> **Slice-1 nav caveat.** `spec.md` FR-6/AC-17 forbids links to non-existent routes. In Slice 1
> only `/` and `/episodes/[slug]` exist. Render the full 7-item nav visually but point only
> `Início`→`/` (and an in-page `#episodios` anchor); keep the other items as **disabled/inert**
> placeholders (no `href`) until their routes ship, or gate them behind a feature flag.

### 3.2 Site Footer — `LSgoB`  `[Slice 1]`

- Full width, vertical, fill `--card`, 1px top `--border`, padding `[56, 40, 32, 40]`, gap 40.
- **Top row (5 columns):**
  1. **Brand** (w320): wordmark + tagline **"Conversas profundas sobre carreira, tecnologia e a
     comunidade de desenvolvimento."** + 5 social pills (36×36): `github`, `twitter`, `youtube`,
     `linkedin`, `instagram`.
  2. **`Conteúdo`**: `Episódios`, `Notícias`, `Eventos`, `Vagas`.
  3. **`Comunidade`**: `Time`, `Discord`, `Sobre`, `Contato`.
  4. **`Empresa`**: `Publicidade`, `Newsletter`, `Imprensa`, `RSS Feed`.
  5. **Newsletter mini** (w300): title **"Newsletter semanal"**, desc **"As melhores discussões
     da semana no seu email."**, email input (`seu@email.com`) + 36×36 primary send button.
- **Divider** (1px `--border`), then **bottom row:** copyright **"© 2026 CaféDebug. Todos os
  direitos reservados."** + legal links **`Privacidade`** · **`Termos`** · **`Cookies`**.
- Column titles: `--font-primary` 12px/600, letterSpacing 1.5. Links: 14px `--muted-foreground`.

> **Slice-1 footer caveat.** Same rule as the header — most footer links target deferred routes.
> Render them as non-interactive placeholders (accessible, `aria`-labeled, no dead `href`) and
> activate as routes land. The newsletter mini-form is **copy-only** in Slice 1 (no submit).

### 3.3 Episode Card — `FGSFI`  `[Slice 1]`

- **384 wide**, vertical, fill `--card`, 1px `--border`, `--radius-m`, clipped.
- **Artwork (h200):** image fill; overlaid (absolute) — top-left category pill (e.g. `"CARREIRA"`,
  11px/600 `--primary` on `#111111cc`); centered 56×56 `--primary` **play button** (lucide `play`);
  bottom-right duration pill (lucide `headphones` + e.g. `"48 min"`).
- **Body (padding 20, gap 10):** eyebrow `"EP 142"` (`--primary`) `·` date; title 18px/600;
  excerpt 14px `--muted-foreground`; guest row (28px avatar + `"com Ana Ribeiro"`).
- **Override keys** (for instancing): `BYjeq` category, `GtuC6`/`v2leaP` images, `krOa3` EP,
  `P06jvv` date, `sMemi` title, `dS4uz` excerpt, `P6VtCY` guest, `xfOCu` duration.
- The centered **play button is the primary Play control** → wire to `usePlayer.load(track)`
  (`design.md` §5.3). Category/duration pills are absolutely positioned over the artwork —
  recompute overlay positions at responsive card widths.

### 3.4 News Card — `wQPNg`  `[Homepage parity; News routes deferred]`

- Same shell as Episode Card (384 wide, `--card`, `--radius-m`). Image (h200) with **only** a
  top-left category pill (no play/duration overlays — this is what distinguishes it from the
  Episode Card). Body: title 18px/600, excerpt 14px, meta row (24px avatar + author `·` read-time
  e.g. `"5 min de leitura"`).
- Override keys: `KDrO3` category, `gCfvF`/`ZcWTU` image, `h9Ls0` title, `vd9jA` excerpt,
  `Vixj9` author, `uEbIu` read-time.

### 3.5 Profile Card — `e3Drx`  `[Deferred — Team feature]`

- **420 wide**, vertical, centered, fill `--card`, 1px `--border`, `--radius-m`, padding 28.
- 92×92 round avatar → name (18px/600) → role in `--primary` 11px/600 uppercase → centered bio
  (14px) → 3 social icon pills (34×34 `--secondary`: `github`, `twitter`, `linkedin`).
- Override keys: `zXlMn` avatar, `v4oT9` name, `UzAJM` role, `Enxxn` bio.

---

## 4. Page-by-page guidance

Screens exist in both themes; the "Light Content" duplicates are structurally identical (only the
`Mode` axis differs). **Build each page once as a themed component set** — never two pages.
Node IDs below are the **dark-theme** frames.

### 4.1 Homepage — `tWWON`  `[Slice 1]`

> **Theme:** dark-first with section-scoped theming — header, hero, newsletter, and footer are
> **always dark**; only **Recent Episodes** and **News & Events** follow the light/dark toggle
> (see §1.5). The `k71CIc` frame is the "light" variant, not a whole-page flip.

1440 vertical, fill `--background`. Top → bottom:

1. **Site Header** (`m9zV96`).
2. **Hero** (two columns, padding `[80,64]`, radial orange glow):
   - **Left:** eyebrow **"EP 142 · EPISÓDIO EM DESTAQUE"** (orange live-dot + label); headline
     **"Dê o próximo passo"** (foreground) / **"na sua carreira dev"** (orange), 56px/1.05;
     subtitle **"Conversas profundas com os melhores desenvolvedores sobre carreira, tecnologia e
     crescimento profissional. Novos episódios toda semana."**; CTAs — primary pill
     **"Ouvir agora"** (lucide `play`) + outline pill **"Ver todos os episódios"**; stats row
     **"142 / Episódios"**, **"85k / Ouvintes/mês"**, **"4.9 / Avaliação"** (divided).
   - **Right — Hero player card** (w520, `--card`): artwork (h240); meta **"EP 142 · 12 Jun 2026"**;
     title **"Como passar numa entrevista técnica em 2026"**; guest **"com Ana Ribeiro / Engenheira
     de Software · Google"**; inline audio player — progress track (fill + knob), times
     **"18:24 / 48:12"**, speed pill, transport controls, `volume-2`.
3. **Recent Episodes** (`#episodios`): header **"Episódios Recentes"** + **"Novas conversas toda
   semana com a comunidade dev."** + **"Ver todos"** link (arrow); 3-up grid of **Episode Card**
   (`FGSFI`). Sample copy: EP 141 `CARREIRA` "Negociação salarial…", EP 140 `ARQUITETURA`
   "Microsserviços valem a pena?…", EP 139 `IA` "Programando com IA…".
4. **News & Events** (fill `--card`, 2-column): **News** column ("Últimas Notícias" + "Ver todas"
   + 2× News Card) alongside the **Events** rail (w380 card, "Agenda de Eventos" + 4 dated rows
   + full-width secondary "ver todos" button). The homepage uses parity mock data; standalone
   News and Events routes remain deferred.
5. **Newsletter** (centered card, radial glow): **"Fique por dentro do universo dev"** + subtext
   + email pill input (`seu@email.com`) + **"Inscrever-se"** + note **"Sem spam. Cancele quando
   quiser."** → UI-only form in this phase (no backend submission).
6. **Site Footer** (`LSgoB`).

> **Homepage-parity extension.** The original Foundation scope documented a reduced Home surface.
> G01-G14 completed the Pencil-backed News & Events section and newsletter form as visual,
> mock-data/UI-only surfaces. Dedicated News, Events, and newsletter-submission workflows remain
> deferred to their respective route and integration specs.

### 4.2 Episode Detail — `VkDts`  `[Slice 1]`

> **Theme:** conventional whole-page light/dark flip (`VkDts` dark / `Oh9Bv` light). Everything —
> hero, audio player, and all content — follows the toggle; **only the Site Header and Site Footer
> are locked dark** (see §1.5). Unlike Home, the hero is **not** always-dark here.

The most important deferred-detail-becomes-Slice-1 page. Top → bottom:

1. **Site Header** (`m9zV96`).
2. **Breadcrumb:** `Início` / `Episódios` / `EP 147`.
3. **Hero** (horizontal): 380×380 artwork; info column — `Label/Violet` category `"BACKEND"`,
   eyebrow **"EPISÓDIO 147"**, title **"Arquitetura de microsserviços que não viram um monólito
   distribuído"** (38px/700); meta row (`calendar` "05 Jun 2026", `timer` "52 min", `headphones`
   "8.4k reproduções"); guest row (48px avatar + "Rafael Tomasi / Staff Engineer · Nubank");
   actions — primary **"Reproduzir episódio"** (`play`), secondary **"Compartilhar"** (`share-2`),
   secondary **"Salvar"** (`bookmark`).
4. **Audio player panel** (`--card`, full width) — **see §5** (maps to the Slice-1 persistent
   player skeleton).
5. **Lower** (2-column):
   - **Main:** **"Sobre este episódio"** (show notes — 3 prose paragraphs) + **"Capítulos"**
     (8 rows: 28px play button + timestamp in orange + title; first row active).
   - **Sidebar (w360):** **"SOBRE O CONVIDADO"** guest card (avatar, name/role, bio, social pills)
     + **"RECURSOS & LINKS"** card (5 link rows with lucide icons + `arrow-up-right`).
6. **Comments (w860):** **"Comentários (24)"** + composer (avatar + field "Compartilhe o que achou
   do episódio…" + hint "Seja gentil. Markdown suportado." + primary Send) + 3 comment items.
7. **Related:** **"Episódios relacionados"** + **"Ver todos"** + 3-up **Episode Card** row.
8. **Site Footer** (`LSgoB`).

> **Slice-1 mapping.** `spec.md` FR-8 requires: hero, **full player** (commands the shared store,
> no 2nd `<audio>`), **show notes** (mock HTML), ≥1 **related** episode, per-page metadata +
> `PodcastEpisode` JSON-LD. Build hero + player + show notes + related now. **Chapters, guest
> card, resources, comments** are richer than Slice 1 — treat as **[Deferred]** (comments are
> Remark42, Phase 2 per `spec.md` §3). Keep the 2-column layout so the sidebar/chapters slot in
> later.

### 4.3 Episodes Listing — `iDkzC`  `[Deferred]`

Header intro (eyebrow **"PODCAST"**, H1 **"Episódios"**, subtitle "…Mais de 140 episódios para
maratonar."); toolbar — search pill ("Buscar episódios, convidados ou temas…") + sort pill
("Ordenar: Mais recentes"); filter chips (`Todos`/`Carreira`/`Backend`/`Frontend`/`IA & Dados`/
`DevOps`/`Mobile`/`Comunidade`, first active); 2-row × 3-up **Episode Card** grid; **Pagination**.
Not in the deliverable list (`spec.md` §3 defers `/episodes`).

### 4.4 News Listing — `Ak8qX`  ·  News Detail — `L6vLI`  `[Deferred — Phase 2]`

- **Listing:** H1 **"Notícias"** + subtitle; `Search Box` ("Buscar notícias…"); filter tabs
  (`Todas` active, `Carreira`/`Frontend`/`Backend`/`IA & Dados`/`Comunidade`/`Open Source`);
  **Featured** article (680×440 image + `Label/Orange` category + 34px title + excerpt + author
  meta with `Avatar/Text`); **"Últimas notícias"** 2-row × 3-up **News Card** grid; **Pagination**
  (Anterior/Próxima disabled at edges; items 1·2·3·…·12).
- **Detail:** centered article — `Label/Orange` category, 42px centered title, author meta;
  520px hero image; **720px reading column** (lede, H2s, body, **pull-quote** with left orange
  accent, **code block** with macOS traffic-light chrome + filename + syntax-highlighted lines);
  share row (Twitter/LinkedIn/Copiar link pills); **"Comentários (12)"** (composer + list with
  relative timestamps "há 2 horas"); **"Artigos relacionados"** 3-up News Card row.

### 4.5 Team Page — `n4YNV`  ·  Contact Page — `hBoyk`  `[Deferred — Phase 3]`

- **Team:** intro (eyebrow **"COMUNIDADE"**, H1 **"As pessoas por trás do CaféDebug"**); three
  sections — **Apresentadores** ("03 pessoas", 3 Profile Cards), **Contribuidores** ("06 pessoas",
  6 cards), **Comunidade** ("03 pessoas", 3 cards). Section head shows a right-aligned count →
  drive from data length.
- **Contact:** intro (eyebrow **"FALE CONOSCO"**, H1 **"Vamos conversar?"**); 2-column — **form
  card** (`Input Group` Nome + Email, `Select Group` Assunto, `Textarea Group` Mensagem,
  `Button/Large/Default` **"Enviar mensagem"**) + **sidebar** (Discord card with online count;
  social card: GitHub `@cafedebug`, X `@cafedebugcast`, YouTube `/cafedebug`, LinkedIn
  `/company/cafedebug`, Instagram `@cafedebug`); **Para empresas** (2 cards: Parcerias →
  `parcerias@cafedebug.com.br`, Publicidade → `publicidade@cafedebug.com.br`); newsletter strip.
  Contact form is a **Phase 3** deliverable (`spec.md` §3).

### 4.6 Jobs Page — `o7i2GD`  ·  Events Page — `xZXa3`  `[Deferred]`

- **Jobs:** eyebrow **"QUADRO DE VAGAS"**, H1 **"Vagas para desenvolvedores"**, stat "248 vagas
  abertas · atualizado hoje"; filter bar (search pill + `Buscar` + 4 selects: Modelo de trabalho /
  Stack / Senioridade / Localização); 6 job cards (logo + title + company·location + work-model
  badge + tech tag chips + salary + "Candidatar"). **Badge color encodes work model:** green
  `Label/Success` = **Remoto**, violet `Label/Violet` = **Híbrido**, gray `Label/Secondary` =
  **Presencial**. Pagination.
- **Events:** eyebrow **"AGENDA"**, H1 **"Eventos da comunidade"**; segmented control
  (`Todos`/`Online`/`Presencial`) + city select; **Próximos eventos** (timeline, orange dots,
  primary **"Inscrever-se"**) and **Eventos passados** (muted dots, `opacity 0.82`, outline
  **"Assistir gravação"**). Timeline = date column (day/month/weekday) + marker rail (dot + line)
  + event card (type label + time + title + meta + speaker avatars + CTA).

### 4.7 About Page — `MwqyG`  ·  Advertisement Page — `a43Qtw`  `[Deferred]`

- **About:** hero (eyebrow **"// SOBRE O CAFÉDEBUG"**, headline "Café, código e conversas…",
  stats 180+/6 anos/320k+); **"Por que existimos"** (mission + 4 value cards); **"Números que
  viraram histórias"** (4-metric grid); **"A jornada"** timeline (2018 → 2026). Static content.
- **Advertisement (mídia kit):** hero (**"// MÍDIA KIT 2026"**, "Conecte sua marca…", QuickStats
  card) + **"Quem nos ouve"** (audience metrics + role bars + platform breakdown) + **"Formatos"**
  (3 opportunity cards) + **"Pacotes"** (3 pricing cards, **Growth** highlighted with 2px orange
  stroke) + **"Testemunhos"** (3 quote cards) + **CTA** ("Agendar reunião" + commercial email).
  Uses `Button/Large/Default` ("Baixar mídia kit (PDF)", "Agendar reunião") and
  `Button/Large/Outline` ("Falar com o time").

---

## 5. Audio player — design → Slice 1 skeleton  `[Slice 1]`

The Episode Detail **audio player panel** (`E53fPU`) is the visual target for the persistent
player (`design.md` §5). It is a `--card` panel (`--radius-m`, 1px border, padding 24) with three
stacked rows:

1. **Top row:** 56px **primary circular play/pause** (swaps lucide `play`↔`pause`; drawn in the
   **playing/`pause`** state) + **"TOCANDO AGORA"** label + track title + **speed pill**
   (`gauge` + "1.5x").
2. **Progress row:** current time **"12:30"** + **track** (h6, `--secondary`, pill) with an orange
   **fill** + circular **knob** (white fill, orange stroke) + total time **"52:18"**. The knob/fill
   are absolutely positioned — a real player must **drive fill width + knob x from playback
   position** (design hardcodes ~24%).
3. **Controls row:** `skip-back` **"Voltar 15s"** · `rewind` · `fast-forward` · `skip-forward`
   **"Avançar 15s"** · `volume-2` · `list` **"Capítulos"** — all `--muted-foreground`.

**Mapping to `design.md` §5:**
- **Mini-player** (sticky bottom bar, persistent, hidden when `track === null`) = a condensed
  version of the Top + Progress rows (artwork/title + play/pause + progress).
- **Full player** (episode detail) = the full 3-row panel above, **commanding the same Zustand
  store** — no second `<audio>`.
- Store fields (`track`, `isPlaying`, `position`, `rate`) cover play/pause, progress, and the
  speed pill. `±15s` maps to `skip-back`/`skip-forward`; the `list`/**Capítulos** trigger and
  chapter list are **[Deferred]** (Slice 1 has no chapters). Track `src`/`artwork` are placeholder
  URLs in the skeleton (`spec.md` R-5).
- **pt-BR ARIA** (`design.md` §5.4): `"Reproduzir"` / `"Pausar"`, plus labeled transport controls.

---

## 6. Global layout, responsiveness & accessibility

- **Canvas is a fixed 1440px desktop layout.** Sections use `fill_container` with **40–64px side
  gutters** — the natural place for breakpoints. There is **no wrapping in Pencil**: multi-column
  grids are explicit row frames. In code, convert them to responsive grids that reflow
  **3 → 2 → 1** columns (e.g. `repeat(auto-fill, minmax(320px, 1fr))`).
- **2-column splits** (hero copy/player card, episode detail main/sidebar, contact form/sidebar,
  news article/media) should **stack vertically** on tablet/mobile; fixed-width rails
  (player card 520, episode sidebar 360, contact sidebar 460, events rail 380) drop below their
  main column.
- **Reading columns** on article/detail pages are intentionally narrower than the media
  (news body 720, header 820; comments 860) — preserve that constraint.
- **Theme via `next-themes`** (cookie-backed, FOUC-free, per `design.md` FR-3). The one invariant
  across both Slice-1 pages: **Site Header + Site Footer are locked dark** in both themes. Beyond
  that, **Home** is dark-first (only content bands flip; hero + newsletter also locked dark) while
  **Episode Detail** is a plain whole-page flip — see §1.5. Orange `--primary` is constant across
  themes.
- **Interactive surfaces to wire:** all "Ver todos/todas" links; hero/CTAs; play controls
  (cards + players); newsletter inputs; search/sort/filter chips; pagination (with disabled edge
  states); mailto links (`--primary`-styled emails). Foundation and homepage-parity work wire the
  shell, Home controls, UI-only newsletter form, episode-detail player, and theme system. Real
  submissions, deferred-route navigation, search/filtering, pagination, and mailto integration
  remain deferred.
- **Accessibility:** keyboard-reachable controls with visible focus (`--ring`), pt-BR `aria-label`s,
  alt text on artwork, labeled social/icon buttons (`design.md` NFRs).

---

## 7. Pencil node ID reference

| Screen / component | Dark node | Light-content node | Parent frame |
|---|---|---|---|
| Homepage | `tWWON` | `k71CIc` | `HAxHA` / `Ht41g` |
| Episodes Listing | `iDkzC` | `S0iYm0` | `WK05Z` / `eLqVe` |
| Episode Detail | `VkDts` | `Oh9Bv` | `WK05Z` / `eLqVe` |
| News Listing | `Ak8qX` | `aRUEn` | `iW8sy` / `Z3pVZ` |
| News Detail | `L6vLI` | `VpqtD` | `iW8sy` / `Z3pVZ` |
| Team Page | `n4YNV` | `a0eA8` | `s7nKs5` / `bXNd4` |
| Contact Page | `hBoyk` | `Glg7r` | `s7nKs5` / `bXNd4` |
| Jobs Page | `o7i2GD` | `Vica2` | `Q1oJGf` / `ufghO` |
| Events Page | `xZXa3` | `DPYMC` | `Q1oJGf` / `ufghO` |
| About Page | `MwqyG` | `td6q3` | `Wax7y` / `CCkvq` |
| Advertisement Page | `a43Qtw` | `N0NgQ` | `Wax7y` / `CCkvq` |
| Site Header | `m9zV96` | — | (component) |
| Site Footer | `LSgoB` | — | (component) |
| Episode Card | `FGSFI` | — | (component) |
| News Card | `wQPNg` | — | (component) |
| Profile Card | `e3Drx` | — | (component) |
| DS component library | `frame-1761929672442` | — | (top of canvas) |

---

## 8. What was built in Slice 1 (design checklist)

From this reference, Slice 1 (`spec.md` §3, `tasks.md`) builds:

- [x] **Tokens** — Pencil-backed hex palette, JetBrains Mono + Geist, pill buttons, and
      `--radius-m` cards. Header and footer are always-dark chrome in both themes.
- [x] **Site Header** (`m9zV96`) with the 7-item nav; only `Início`/`#episodios` are live while deferred routes remain non-interactive.
- [x] **Site Footer** (`LSgoB`) with non-interactive deferred links and a copy-only newsletter mini form.
- [x] **Episode Card** (`FGSFI`) with a working Play control connected to the player store.
- [x] **Homepage** (`tWWON` / `k71CIc`) — hero, featured player, recent-episodes grid, News & Events, and the Pencil-aligned UI-only newsletter form.
- [x] **Episode Detail** (`VkDts`) — hero, full player, show notes, and related episodes; chapters, guest,
      resources, and comments remain deferred.
- [x] **Audio player** (`E53fPU`) — persistent mini player and full player share one `<audio>` element, per §5.
- [x] Light/dark parity via the single `Mode` axis, including Home's section-scoped dark-first behavior.

Homepage visual parity was completed and approved through G01-G14; see the [homepage parity plan](../homepage-visual-parity/plan.md) for the component-level baseline and acceptance record.

Everything else in §4 is design reference for later slices — build components generically so the
deferred pages compose without rework.
