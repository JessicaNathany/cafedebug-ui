# Design: Contact Page Implementation Contract

> **Status:** Draft. Desktop Pencil evidence was directly inspected on 2026-08-16; interaction and responsive gaps remain explicit.

## Design source and evidence classification

| Field | Value | Evidence status |
| --- | --- | --- |
| Pencil file | `/cafedebug.pen` | authoritative; live MCP connected and scanned 2026-08-16 |
| Node index | `.specs/web/foundation/ux-design-reference.md` | repository-confirmed |
| Dark frame | `hBoyk` | directly inspected, `1440 × 2162` |
| Light frame | `Glg7r` | directly inspected, `1440 × 2162` |
| Indexed parents | `s7nKs5` / `bXNd4` | indexed, not directly inspected |
| Route | `/contact` | confirmed request |
| Feature folder | `apps/web/src/features/contact` | architecture decision |
| Shell | existing `(beta)` layout; Beta Header/Footer | directly inspected repository |

Pencil MCP was connected before implementation on 2026-08-16. Both frames were inspected with hierarchy/bounds reads and screenshots. The exact desktop evidence below is Pencil-confirmed. Interactive state styling and tablet/mobile behavior remain unresolved.

## Required screen captures and measurement record

| Artifact | Required before approval |
| --- | --- |
| Dark desktop `hBoyk` screenshot and hierarchy | Yes |
| Light desktop `Glg7r` screenshot and hierarchy | Yes |
| Header/Footer child references and Beta-shell comparison | Yes |
| Intro, form, Discord, social, business, newsletter child IDs | Yes |
| Container/grid widths, gutters, section gaps, card/control sizes, radii, borders | Yes |
| Typography family/weight/size/line-height and text constraints | Yes |
| Assets/icons and dark/light surface/text/icon deltas | Yes |
| Tablet/mobile artboards or documented absence | Yes |

## Viewports

| Name | Size | Contract status |
| --- | --- | --- |
| Desktop | `1440 × 1200` | indexed two-column main and two-card business relationship; exact geometry unresolved |
| Tablet | `768 × 1024` | required validation target; no confirmed Pencil frame |
| Mobile | `390 × 844` | required validation target; no confirmed Pencil frame |

## Page composition

```text
Beta Header (existing shared layout)
main
  ContactIntro
  ContactMain
    ContactForm
    ContactSidebar
      DiscordCommunityCard
      SocialLinksCard
  BusinessContactSection
    BusinessContactCard × 2
  NewsletterSection or approved compatible composition
Beta Footer (existing shared layout)
```

The names describe responsibilities only. Avoid components that merely wrap decorative markup. The ordering and desktop anatomy are Pencil-confirmed; responsive and inactive states remain evidence gates.

## Direct Pencil desktop contract

- **Dark nodes:** Contact Page `hBoyk`; Header `XM0gC`; Main `e00Lm`; Intro `V0eqb`; main Row `zNIP4`; Form Card `RC6pk`; Sidebar `B0RP9`; Business `KdGHZ`; Newsletter `r3lHdb`; Footer `s6Dfg`.
- **Light nodes:** Contact Page `Glg7r`; Header `T1YSS`; Main `pOtu0`; Intro `a6kAl`; main Row `C5VQYm`; Form Card `M1WPK`; Sidebar `n9FZI`; Business `e9Kwpv`; Newsletter `OLeO3`; Footer `J878rb`.
- **Key dark descendants:** form title `P5UsPe`; Name `VQbIB`; Email `ExYoQ`; Assunto `rdJsz`; Mensagem `CSl3c`; submit `AwOtv`; Discord `hemB6`; Social `u7rdZ`; business row `tx0aR`; newsletter form `SYN8K`.
- Both frames are `1440 × 2162`: Header `72px`, Main `1760px`, Footer `330px`; Main has 40px gutters and a 1360px content width.
- Intro is `1360 × 154`: `FALE CONOSCO`, `Vamos conversar?`, and `Tem uma sugestão de pauta, quer ser convidado de um episódio ou apenas dar um oi? Escolha o melhor canal abaixo — adoramos ouvir a comunidade.`
- Main row is `1360 × 755`: Form Card `868 × 585`; Sidebar `460 × 755`; 32px gap. Form Card has 40px padding, 24px vertical gaps, 16px radius, and 1px inner border.
- Name/Email are `386 × 66` columns with 16px gap. Assunto is `788 × 66` with `Selecione um assunto`; Mensagem is `788 × 176`, using a 150px textarea with `Escreva sua mensagem aqui...`; submit is `788 × 48` and says `Enviar mensagem`.
- Sidebar contains Discord Card `460 × 338` and Social Card `460 × 389` separated by 24px. The final Discord badge is a `48px` secondary rounded square with a primary MessageCircle; its presence dot is success-colored. Discord copy is `Comunidade no Discord`, `Mais de 8.200 desenvolvedores trocando ideias sobre carreira, vagas e tecnologia todos os dias. Entre e apresente-se no #boas-vindas.`, `1.340 membros online agora`, and `Entrar no Discord` with a 12px-gapped ArrowUpRight. Social rows use `42px` secondary circular icons with a 14px text gap, bold label, and muted handle/path in the captured GitHub, X / Twitter, YouTube, LinkedIn, Instagram order.
- Business cards are two `668 × 245` cards with 24px gap. Their `48px` secondary rounded-square icons use the primary accent; titles are 18px semibold and the primary, non-underlined `mailto:` actions use JetBrains Mono 14px/500. Pencil copy and emails are `Parcerias & Patrocínios` / `parcerias@cafedebug.com.br` and `Publicidade` / `publicidade@cafedebug.com.br`; the advertising copy ends `milhares de devs em todo o Brasil.`.
- Newsletter is `1360 × 188`, with 48px padding, 640px text column, and 416px form: 280px input, 12px gap, 124px `Inscrever` action. Copy is `Receba o melhor da semana` plus the scanned supporting paragraph.
- Dark root/form/newsletter surfaces are `#111111` / `#1A1A1A` / `#2E2E2E`; light equivalents are `#F2F3F0` / `#FFFFFF` / `#E7E8E5`. Form borders are dark `#2E2E2E` and light `#CBCCC9`.
- Typography read: eyebrow is JetBrains Mono 13px/600 with 2px tracking and `#FF8400`; H1 is Geist 46px/700 at 1.1 line-height and constrained to 820px; desktop subtitle is Geist 17px/normal at 1.6 line-height and constrained to 640px. Form, business, and newsletter headings are Geist 22px/700, 26px/700, and 28px/700 respectively. Dark text uses `#FFFFFF` with `#B8B9B6` muted body text; light H1 uses `#111111`.

## Layout and responsive contract

| Area | Desktop | Tablet and mobile |
| --- | --- | --- |
| Page shell | Inherit `(beta)`; Beta Header/Footer are theme-following, not fixed-dark substitutes. | Same shared layout and compact navigation. |
| Intro | Eyebrow `FALE CONOSCO`, `h1` `Vamos conversar?`; width/alignment/gaps pending Pencil. | Wrap without clipping; exact geometry unresolved. |
| Main | Form beside a 460px sidebar with Name/Email in one row then full-width fields/action. | Inherit the foundation responsiveness contract: stack the contact sidebar below the form; keep controls full-width/no overflow. |
| Business | Two 668px cards in one desktop row. | Inherit the existing grid reflow constraint and stack cards without horizontal overflow. |
| Newsletter | 640px copy plus 416px form. | Use the existing tokenized responsive form pattern: stack/reflow controls without clipping. |

No arbitrary container, spacing, card, border, or control value may be introduced. Map inspected values to existing tokens first; document any token gap before a change.

## Typography and token contract

| Element | Contract | Evidence status |
| --- | --- | --- |
| Eyebrow | Existing semantic primary/accent typography if it matches Pencil | copy indexed; styling unresolved |
| H1 | Existing semantic heading typography if it matches Pencil | copy indexed; sizing unresolved |
| Body/muted text | `foreground` / `muted-foreground` token family | inherited token system; measurements unresolved |
| Cards and controls | `card`, `background`, `border`/`input`, `ring`, and approved radii | inherited tokens; visual mapping unresolved |
| CTA | existing Button primitive if inspected dimensions/states match | CTA text indexed; state/geometry unresolved |

Use `packages/web-design-tokens`; themes must flow through its semantic variables. Do not create dark/light component copies. The established Beta Header/Footer are the route's only shell decision.

## Component and responsibility contract

| Responsibility | Source | Contract |
| --- | --- | --- |
| Header/Footer/navigation/theme | existing `(beta)` layout, shared layout components | Reuse untouched; Footer `Contato → /contact` is one shared configuration update at implementation. |
| Button/Input/InputGroup | existing UI primitives | Reuse only after their anatomy matches inspected Contact controls. |
| Contact form | new feature component + feature hook/schema | Native form, React Hook Form, Zod, no `fetch`, explicit local submission outcome. |
| Social links/business cards | new feature components + deterministic fixture | Fixture-driven repeated content; no guessed URLs or address values. |
| Newsletter | existing Homepage Beta UI-only newsletter responsibility, through an approved compatible Contact composition | Preserve one submission/state owner; prevent default/no network/no visible result. |

## Future file structure and boundary contract

```text
apps/web/src/app/(beta)/contact/page.tsx        # route and metadata composition only
apps/web/src/features/contact/
  components/                                  # visual/semantic rendering only
  hooks/                                       # React Hook Form orchestration only
  schemas/                                     # Zod validation contract only
  mock/                                        # deterministic subject/social/business data
  types/                                       # fixture and view-model types
```

`services/`, `server/`, and `app/api` are **N/A with rationale**: no API, persistence, remote loader, or route-handler behavior is authorized. Components and the app route must not call `fetch`. A newsletter wrapper, if approved, only composes the single existing UI-only newsletter responsibility; it does not create a second hook or submit state.

## Data, interaction, and state contract

| Item | Confirmed | Must remain unresolved until approved |
| --- | --- | --- |
| Form fields | Names: Nome, Email, Assunto, Mensagem; all required; Pencil placeholders | deterministic subject fixture and Zod messages are approved implementation constraints |
| Submit CTA | `Enviar mensagem` | mock service success resets fields/default and reports accessible `Mensagem enviada com sucesso.` |
| Social display values | GitHub `@cafedebug`; X `@cafedebugcast`; YouTube `/cafedebug`; LinkedIn `/company/cafedebug`; Instagram `@cafedebug` | mock external URLs use `example.com/cafedebug/<platform>` |
| Discord | `Entrar no Discord` CTA exists | mock external URL uses `https://example.com/cafedebug/discord` |
| Business | `Parcerias & Patrocínios`, `Publicidade`; indexed emails | card copy/icon/action styling |
| Newsletter | `Receba o melhor da semana`, `Inscrever`; existing UI-only no-network submission | Contact wrapper/prop structure for copy and layout |

Any local valid submit prevents default, calls the deterministic local mock service, makes no network call, resets the form/default subject on mock success, and reports the approved accessible success status. External mock links open in a new tab with `rel="noreferrer"`; their `example.com` URLs are explicitly non-production fixtures.

## Theme, accessibility, and resilience

- Inspect and compare dark `hBoyk` and light `Glg7r`; document every surface, typography, icon, border, and interaction delta. Header/Footer Beta behavior must be verified as part of that comparison.
- Use `main`, nested `section`s, one `h1`, heading levels without skips, real labels, semantic email/textarea controls, and `aria-describedby` for validation messages. The Assunto control is only a native select **if** Phase 1 evidence approves that semantics; otherwise its semantic/control contract must be approved before implementation.
- Links must state Café Debug plus platform in their accessible name; decorative icons are hidden. Confirmed destinations use the existing safe external-link convention; URLs still require fixture/configuration evidence.
- Keyboard order follows visual/DOM order; focus must be visible in both themes. Support 200% zoom, long labels/handles/emails, localization-length copy, touch interaction, wrapping, and no horizontal overflow.

## Acceptance and evidence gate

Implementation may start only after the table below is complete.

| Gate | Evidence | Status |
| --- | --- | --- |
| Visual source | Live Pencil node inspection/screenshots for `hBoyk` and `Glg7r` | blocked |
| Form behavior | Approved required fields, subject fixture, mock local service, and success result | resolved implementation constraint |
| Destinations | Approved mock external URLs and safe external behavior | resolved implementation constraint |
| Newsletter | Existing UI-only ownership and no-network behavior | resolved |
| Responsive | Foundation contact-split stack/reflow contract | inherited implementation constraint; live Contact artboards still uninspected |

When unblocked, validate browser and Pencil at every required viewport/theme, then record concrete differences in `.specs/web/contact-page/validation.md` (section, viewport, theme, expected, actual, severity, corrective action, resolution).
