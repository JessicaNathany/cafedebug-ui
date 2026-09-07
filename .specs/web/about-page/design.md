# Design: About Page — Web Page Implementation Contract

> **Status:** Draft. Direct Pencil desktop evidence was captured from the active
> root `cafedebug.pen`; responsive behavior is deliberately separated from
> desktop source-of-truth evidence.

## 1. Design source and evidence ledger

| Field | Value | Evidence state |
| --- | --- | --- |
| Pencil file | `/cafedebug.pen` | Pencil-confirmed; active file inspected through Pencil MCP |
| Dark parent / page | `Wax7y` / `MwqyG` | Pencil-confirmed |
| Light parent / page | `CCkvq` / `td6q3` | Pencil-confirmed |
| Desktop frames | Both `1440 × 3011` | Pencil-confirmed |
| Route | `/about` | User-confirmed |
| Feature folder | `apps/web/src/features/about` | Existing architecture adaptation |
| Shell | `apps/web/src/app/(beta)/layout.tsx` | Existing implementation inherited |
| Desktop captures | `TakeScreenshot([MwqyG, td6q3])` | Captured before this contract |
| Tablet/mobile source frame | None under `Wax7y` or `CCkvq` | Evidence gap |

Pencil is the visual source of truth. Existing implementation is the source of
truth for shared responsibilities. Every row below states its source rather
than turning an inference into a Pencil claim.

### Direct node map

| Area | Dark node | Light node | Contract |
| --- | --- | --- | --- |
| Page | `MwqyG` | `td6q3` | 1440px vertical About page |
| Header | `hyDYg` → shared `m9zV96` | `ubsqS` → shared `m9zV96` | Existing site-header anatomy; 72px desktop |
| Hero | `AnMix` | `P1bE4T` | Editorial intro and headline metrics |
| Hero eyebrow / heading / body / metrics | `dacIw` / `Rcg4n` / `aTEke` / `yZScQ` | `bElOs` / `SthTJ` / `x8uaL` / `MDSRA` | Confirmed copy and typography |
| Mission | `Q7N3ab` | `IZYMq` | Card surface containing asymmetric editorial head and Values |
| Mission head / Values | `s1bboW` / `M4YDi` | `GbLEv` / `SoaYb` | Two-column head; four card row |
| Value cards | `YQdSK`, `Wedbv`, `E4RZ9x`, `iu9oj` | `a1fkeC`, `OVuLp`, `K9sGJK`, `eIUOO` | Four fixed, repeated content items |
| Impact | `OL7GR` | `OF3Kp` | Community metric section |
| Impact head / metric surface | `l1YgoO` / `X4Nga` | `XUCGQ` / `x1rwID` | Heading plus four-cell surface |
| Timeline | `ZdGtq` | `RTbBQ` | Journey section |
| Timeline head / track | `x1U27` / `JH5UY` | `bbC7j` / `JgohA` | Heading plus five milestones |
| Milestones | `oys6R`, `ONvme`, `Y74HPY`, `S7bANT`, `v492m` | present under `JgohA` | 2018, 2019, 2021, 2023, 2026 |
| Footer | `ytukS` → shared `LSgoB` | `o30mD` → shared `LSgoB` | Existing site-footer anatomy; 330px desktop |

### Confirmed child hierarchy

```text
About Page
  dark MwqyG
    Header hyDYg -> m9zV96; Hero AnMix; Mission Q7N3ab; Impact OL7GR; Timeline ZdGtq; Footer ytukS -> LSgoB
    Timeline rows: oys6R, ONvme, Y74HPY, S7bANT, v492m
  light td6q3
    Header ubsqS -> m9zV96; Hero P1bE4T; Mission IZYMq; Impact OF3Kp; Timeline RTbBQ; Footer o30mD -> LSgoB
    Timeline rows: hCbeh, fsfb8, YgbVd, JE4jH, IgWLY
```

The direct-node map above and this hierarchy are implementation evidence,
not a request to create page-local Header or Footer variants.

### Screen captures and measurements still required at implementation

The dark/light whole-page captures establish desktop composition. The future
`web-design-reviewer` must recapture the two reference frames and also capture
each rendered section in the browser. Record the following in
`validation.md`:

- Browser/Pencil comparison for Hero, Mission/Values, Impact, Timeline, Header,
  and Footer.
- Desktop content/section dimensions, text wrapping, grid tracks, token
  surfaces, radii, icon appearance, and Footer transition.
- Every visual discrepancy with a measurable expected and actual value.
- The no-source status of tablet/mobile; browser evidence there is responsive
  validation, not a claim of supplied Pencil parity.

## 2. Desktop layout contract — Pencil-confirmed

| Section | Y | Size | Desktop rule |
| --- | ---: | ---: | --- |
| Header | 0 | `1440 × 72` | 40px inline padding; inherited shared component |
| Hero | 72 | `1440 × 648` | pad `[100,100,80,100]`, vertical 28px gap |
| Mission | 720 | `1440 × 648` | card surface; pad `[80,100]`, vertical 48px gap |
| Impact | 1368 | `1440 × 444` | pad `[80,100]`, vertical 36px gap |
| Timeline | 1812 | `1440 × 869` | card surface; pad `[80,100]`, vertical 44px gap |
| Footer | 2681 | `1440 × 330` | shared Footer composition |

The main desktop content width is 1240px inside 100px page gutters, except for
the intentionally narrower text columns below. At widths beyond 1440px, do not
stretch component anatomy beyond the confirmed 1240px content relationship
without an approved responsive decision.

### Hero

| Element | Node | Measured/anatomy contract |
| --- | --- | --- |
| Eyebrow | `dacIw` | 198×18; JetBrains Mono 14/600; 1.5px tracking; primary |
| Heading wrapper / heading | `kUWSP` / `Rcg4n` | 880×186; Geist 56/700, 1.1 line-height |
| Supporting copy | `aTEke` | 760×90; Geist 19/400, 1.6 line-height; muted foreground |
| Metrics | `yZScQ` | 511×90; 56px horizontal gap; 28px top pad |
| Metric values | `LGOwn`, `e24RN`, `lGitZ` | JetBrains Mono 30/700 |
| Metric labels | `zOnGK`, `KVDwC`, `d5ECgK` | Geist 14/400; muted foreground |

The confirmed hero copy is in `spec.md` and must remain fixed fixture
content. There is no image, action, or interactive behavior in the hero.

### Mission and Values

| Element | Contract | Source |
| --- | --- | --- |
| Mission surface | `background: card`, 80px vertical / 100px horizontal padding | Pencil-confirmed |
| Editorial head | `s1bboW` is 1240×209; left 380px, right 620px, 80px relationship | Pencil-confirmed |
| Section eyebrow | JetBrains Mono 13/600, 1.5px tracking, primary | Pencil-confirmed |
| Section title | Geist 36/700, 1.15 line-height | Pencil-confirmed |
| Mission prose | Geist 17/400, 1.6 line-height; first paragraph foreground then muted paragraph | Pencil-confirmed |
| Value row | 1240px, four equal cards, 24px gap | Pencil-confirmed |
| Value cards | background surface, 24px padding, 14px inner gap, semantic 16px radius | Pencil-confirmed + existing tokens |
| Icon disc | 44×44 secondary pill with a 20px primary Lucide icon | Pencil-confirmed |
| Card copy | Geist 18/600 title at 1.3; Geist 14/400 description at 1.55 | Pencil-confirmed |

Use one `AboutValueCard` visual responsibility. Its fixture identifies
`mic`, `users`, `heart`, and `compass`; it does not own colors, spacing,
or Tailwind classes.

### Community impact

The head is 680px wide, with a 13/600 Mono eyebrow and 36/700 Geist title. The
metrics surface is `X4Nga`, `1240 × 176`, `card` surface and 16px radius.
It has four equal 310px items with 32px padding and an 8px internal gap:

| Node | Value / label / description |
| --- | --- |
| `NC4TT` | 320k+ / ouvintes ativos / em todas as plataformas de áudio |
| `hNAY1` | 12.4k / membros no Discord / trocando código e vagas diariamente |
| `UHScL` | 8.7M / downloads totais / desde o primeiro episódio em 2018 |
| `ibdoA` | 1.2k+ / vagas divulgadas / conectando talentos a empresas |

Values are 42/700 JetBrains Mono primary; labels are 16/600 Geist foreground;
descriptions are 13/400 Geist muted at 1.5 line-height. Confirm the exact
divider treatment from screenshots during implementation; it must use the
existing semantic `border` token if rendered.

### Journey timeline

The head is 720px wide. The track is `1240 × 548`; each milestone is a
row with a 96px year column, 32px gap, 24px centered rail, and flexible body.

- Years: Mono 22/700 primary.
- Rail: 16px dot; the first dot `zBbt6` is solid primary, later dots are
  card-fill with primary stroke. A 2px `border` line joins every item except
  the final milestone.
- Body: title Geist 22/600 at 1.25; description Geist 15/400 at 1.6 and 720px
  width; 8px internal gap. Non-final bodies hold 44px bottom spacing.

| Row | Copy source |
| --- | --- |
| 2018 / `oys6R` | O primeiro episódio — Dois amigos, um microfone emprestado e uma conversa de 40 minutos sobre o primeiro emprego em tech. 200 downloads na primeira semana. |
| 2019 / `ONvme` | A comunidade nasce — Criamos o servidor no Discord para responder aos ouvintes. Em três meses, 1.000 pessoas já trocavam vagas e dúvidas. |
| 2021 / `Y74HPY` | 100 episódios — Marcamos a centena com um especial ao vivo e os primeiros patrocinadores. O podcast virou profissão. |
| 2023 / `S7bANT` | Eventos presenciais — O primeiro CaféDebug Meetup reuniu 400 pessoas em São Paulo. A comunidade saiu das telas. |
| 2026 / `v492m` | CaféDebug 2.0 — Nova plataforma, newsletter semanal e um quadro de vagas próprio. A comunidade entra em uma nova fase. |

## 3. Theme contract

### Pencil-confirmed content treatment

Both authored frames use the same hierarchy, copy, dimensions, and semantic
roles:

- Page: `background`
- Card bands and Impact metrics surface: `card`
- Primary type: `foreground`
- Secondary type: `muted-foreground`
- Eyebrows, metrics, and timeline emphasis: `primary`
- Icon discs: `secondary`
- Timeline rails/dividers: `border`
- Rounding: `radius-m` / `radius-pill`
- Fonts: `font-secondary` (Geist) and `font-primary` (JetBrains Mono)

Use `packages/web-design-tokens/styles.css` and semantic Tailwind mappings.
Do not hardcode raw colors, one-off radii, or feature-local theme classes.

### Shared-chrome evidence conflict

The light page `td6q3` contains Header `ubsqS` and Footer `o30mD` in
Pencil `Mode: Dark`. Its light main sections remain light. Conversely, the
current user-required `(beta)` shell deliberately uses
`Header variant="beta"` and `Footer variant="beta"`, which are
root-theme-following.

This page may not fork the shell or create an About-specific variant. Future
implementation therefore inherits Beta shared-shell behavior, and
`web-design-reviewer` must explicitly compare it to the Pencil light chrome:

1. If an approved shared-shell change is required, return to specification
   rather than changing only About.
2. Otherwise, log the difference, user impact, and approval in
   `validation.md`.

This is an inherited-system constraint, not permission to claim unreviewed
light-frame parity.

## 4. Component, file, and data contract

### Future feature structure

```text
apps/web/src/app/(beta)/about/page.tsx        route metadata + delegation only
apps/web/src/features/about/
  components/about-page.tsx                   server-first page composition
  components/about-value-card.tsx             repeated card responsibility
  components/about-impact-metrics.tsx         metric surface semantics
  components/about-timeline.tsx               ordered timeline semantics
  mock/about.mock.ts                          deterministic repeated content
  services/get-about-content.ts               local fixture read seam
  types.ts                                    fixture/UI contracts
  metadata.ts                                 canonical /about metadata
```

The exact minimum file set can contract when a responsibility is unnecessary;
do not create empty hooks, schemas, server handlers, or API routes merely to
mirror a generic feature diagram.

| Responsibility | Source | Rule |
| --- | --- | --- |
| Header/Footer/theme/nav | Existing `(beta)` layout and shared layout components | Reuse; future shared navigation configuration enables About |
| About composition | New feature `AboutPage` | One server-first composition with `main` / sections |
| Repeated cards/metrics/milestones | New typed local fixture + focused components | Ordering comes from fixtures; no visual values in data |
| Local content seam | `get-about-content.ts` or equivalent | Returns deterministic local content only; no `fetch` |
| Metadata/sitemap | Feature metadata helper + root sitemap update | Canonical `/about`, index/follow, website Open Graph; JSON-LD N/A |
| Player | Existing root Provider/MiniPlayer | No About ownership or second audio element |

### Fixture shapes

```ts
type AboutValue = {
  id: "real-conversations" | "community-first" | "open-access" | "career-without-hype";
  icon: "mic" | "users" | "heart" | "compass";
  title: string;
  description: string;
};

type AboutImpactMetric = {
  id: "listeners" | "discord-members" | "downloads" | "jobs";
  value: string;
  label: string;
  description: string;
};

type TimelineMilestone = {
  id: "2018" | "2019" | "2021" | "2023" | "2026";
  year: string;
  title: string;
  description: string;
};
```

Hero copy and its three metrics may remain a small immutable page-content
object. Do not force isolated static headings into a fixture just to make
every text field data-driven.

## 5. Responsive contract

| Viewport | Source status | Required behavior |
| --- | --- | --- |
| 1440 × 1200 | Pencil-confirmed desktop frame | Match all measured section geometry, widths, hierarchy, and desktop four-column/card/metric relationships. |
| 768 × 1024 | Responsive adaptation | Preserve 40px shared gutter convention when it fits; reflow values/metrics/timeline without a clipping rail or compressed readable text; inherited compact navigation. |
| 390 × 844 | Responsive adaptation | Use 16px mobile gutters from established project convention; one-column cards/metrics, intrinsic text height, compact navigation, readable timeline with no horizontal scroll. |

The implementation must choose exact breakpoint/grid rules during the approved
build from these constraints and record them as project responsive adaptations.
It must not describe them as Pencil-authored. The following invariants are
mandatory:

- Hero heading/body and metric groups wrap/reflow before viewport overflow.
- The Mission editorial relationship becomes readable stacked content when its
  380/620 desktop split no longer fits.
- Value cards and impact metrics retain their fixture order and do not clip
  descriptions.
- The timeline keeps year, dot/rail, title, and description associated in DOM
  and visual order. A controlled stacked treatment is allowed when required;
  no horizontal scrolling timeline is allowed.
- Header/mobile menu, Footer, theme control, and fixed player remain usable and
  unobstructed.

## 6. Accessibility contract

- One page `h1` uses the hero message; Purpose, Impact, and Journey use
  `h2` in visible source order.
- Use `section aria-labelledby` for the three major content sections.
- Represent metrics as a semantic list or `dl` with machine-readable
  value/label association.
- Represent timeline milestones in ordered DOM order; use a semantic list or
  articles within an ordered list. The rails/dots are `aria-hidden`.
- Principle icons are decorative because visible title text supplies the
  meaning. Do not add four redundant icon names to the accessibility tree.
- Existing Link/Button focus, mobile-menu Escape/focus-return, theme state,
  and footer disabled destinations retain the shared behavior.
- Verify 200% text zoom or an equivalent narrow-render resilience check,
  long copy wraps, contrast flows through tokens, and no item is hidden behind
  the persistent player.

## 7. Validation artifact contract

During the future implementation create
`.specs/web/about-page/validation.md` with one concrete row for every visual
review finding:

| Component/section | Viewport | Theme | Pencil expectation | Browser result | Concrete difference | Severity | Required correction | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

The mandatory review sequence is:

`frontend-blacksmith → render → screenshot → web-design-reviewer Pencil comparison → correction → re-review → webapp-testing → the-debugger when defects need investigation`.

No subjective “close enough” decision, source-only review, or dark-only
approval satisfies this contract.
