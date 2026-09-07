# Spec: About Page

| Field | Value |
| --- | --- |
| Status | Draft |
| Change class | Visual web |
| Domain | web/about |
| Route | `/about` |
| Affected app | `apps/web` |
| Design source | `cafedebug.pen` |
| Dark desktop frame | `MwqyG` |
| Light desktop frame | `td6q3` |
| Design parents | `Wax7y` / `CCkvq` |

## 1. Objective

Create the Café Debug About / Sobre page. It tells the editorial, community-led
story of Café Debug: what it is, why it exists, the reach of its community, and
the milestones that shaped it. The result must reproduce the approved Pencil
composition rather than introduce a corporate or generic marketing layout.

This package authorizes specification and planning only. It does **not**
authorize production implementation.

## 2. Scope

The future page is a mock-only, server-first public route at `/about` with:

1. The existing shared Homepage Beta Header and Footer shell.
2. An editorial hero with its three headline metrics.
3. The purpose narrative and four principle cards.
4. A community-impact metric surface.
5. A chronological Café Debug journey.
6. Metadata, sitemap coverage, keyboard-safe semantics, and dark/light
   treatment.

All visible repeated data is deterministic local fixture data. The approved
Pencil content is the fixture source for this delivery; it must not be
replaced with live, inferred, or externally researched statistics.

## 3. Non-goals

- API, CMS, analytics, remote image, or runtime network integration.
- A new About-specific Header, Footer, theme mechanism, player, or audio state.
- Episode cards, episode playback, community-account destinations, or social
  interactions that Pencil/the existing shared shell does not require.
- Claiming pixel parity at tablet or mobile sizes where Pencil has no authored
  frame.
- New design tokens unless a measured Pencil value cannot map to the existing
  semantic web-token system.
- JSON-LD beyond existing site-level organization/podcast structured data:
  there is no meaningful About-specific schema confirmed by the request or
  Pencil.

## 4. User-facing requirements

### FR-01 — Route and shared shell

- `/about` is rendered under the existing `(beta)` route group and inherits
  its shared Header and Footer. The route file remains metadata/composition
  only.
- Shared primary navigation activates its existing `Sobre` label at
  `/about`; the shared Footer activates its existing `Sobre` entry at the
  same route. This is a single canonical navigation configuration change in
  the future implementation, not About-local navigation logic.
- Existing `Debuggers` navigation, compact navigation behavior, theme
  persistence, and the single global player remain intact.

### FR-02 — Editorial hero

Render, in this order:

- `// SOBRE O CAFÉDEBUG`
- `Café, código e conversas que movem a comunidade dev brasileira.`
- `Desde 2018, o CaféDebug reúne pessoas desenvolvedoras de todo o Brasil para
  falar de carreira, tecnologia, cultura e os bastidores reais de quem constrói
  software. Um podcast que virou comunidade.`
- `180+ episódios publicados`, `6 anos no ar, sem pausa`, and
  `320k+ ouvintes na comunidade`.

The hero remains an editorial introduction, not a CTA or interactive banner.
Exact desktop geometry, typography, and nodes are specified in
`design.md`.

### FR-03 — Purpose and principles

Render the `// PROPÓSITO` eyebrow and `Por que existimos` heading beside
the two Pencil-confirmed mission paragraphs. Render one fixture-driven card for
each of these four principles, in this order:

1. Conversas reais — `mic`
2. Comunidade primeiro — `users`
3. Acesso aberto — `heart`
4. Carreira sem hype — `compass`

The implementation must preserve the asymmetrical desktop editorial header and
use a single principle-card responsibility rather than four duplicated
components.

### FR-04 — Community impact

Render the `// IMPACTO NA COMUNIDADE` eyebrow,
`Números que viraram histórias`, and exactly these deterministic metrics:

| Value | Label | Description |
| --- | --- | --- |
| 320k+ | ouvintes ativos | em todas as plataformas de áudio |
| 12.4k | membros no Discord | trocando código e vagas diariamente |
| 8.7M | downloads totais | desde o primeiro episódio em 2018 |
| 1.2k+ | vagas divulgadas | conectando talentos a empresas |

They are display content, not live counters or calculated analytics.

### FR-05 — Journey timeline

Render `// A JORNADA` and
`De um microfone na cozinha à maior comunidade dev em português` above one
chronological, fixture-driven timeline. Its DOM reading order must match the
visible order:

1. 2018 — O primeiro episódio
2. 2019 — A comunidade nasce
3. 2021 — 100 episódios
4. 2023 — Eventos presenciais
5. 2026 — CaféDebug 2.0

Each milestone has an accessible year, title, and description. The rail and
dots are supplementary visual treatment; they cannot be the only way to
understand sequence or current/starting state.

### FR-06 — Themes and responsive behavior

- A single token-driven component tree supports both themes; no duplicate
  light/dark About components are allowed.
- Dark `MwqyG` and light `td6q3` have the same main content hierarchy,
  copy, desktop geometry, and semantic token roles.
- Validate dark and light at `1440 × 1200`, `768 × 1024`, and
  `390 × 844`.
- Every viewport prevents horizontal page scrolling, clipped content, timeline
  rail collision, and player obstruction. Responsive transformations are
  documented in `design.md` as adaptations until a dedicated Pencil frame
  exists.

### FR-07 — Accessibility and resilience

- Use one `main` landmark, named `section` landmarks where useful, one
  `h1`, and sequential `h2` headings.
- Metrics are represented as meaningful value/label pairs, not unlabeled
  visual text.
- Decorative principle icons and timeline rail/dots are hidden from assistive
  technology; icon meaning is represented by each card title.
- Existing Header/Footer, compact navigation, theme control, and player
  controls retain keyboard behavior and visible token-backed focus.
- Long localized copy, text zoom, and narrow viewports wrap/reflow instead of
  imposing fixed text heights.

## 5. Data and architecture boundaries

- Future feature UI, types, fixtures, a local read seam, metadata helper, and
  any page composition live under `apps/web/src/features/about/`.
- Repeated value cards, impact metrics, and timeline milestones are typed
  fixtures. Static page-heading copy may stay in the server page composition.
- The future `apps/web/src/app/(beta)/about/page.tsx` exposes route metadata
  and delegates rendering; it does not own fixtures, visual logic, or
  `fetch`.
- There is no About API route, hook, schema, server-side remote reader, loading
  state, empty state, or error state in this mock-only scope. They are
  **N/A with rationale**, rather than fabricated.
- `packages/web-design-tokens` and existing semantic Tailwind aliases are
  the only visual-value source. No raw colors, magic shadows, or feature-local
  token forks are permitted.

## 6. Evidence gaps / open questions

| Item | Evidence state | Required resolution |
| --- | --- | --- |
| Tablet/mobile About artboards | No dedicated frame exists under Pencil parents `Wax7y` / `CCkvq`. | Follow the documented responsive adaptation; validate browser behavior and do not call it Pencil pixel parity. |
| Light-frame chrome | Light `td6q3` nests Header `ubsqS` and Footer `o30mD` in `Mode: Dark`, while the existing Homepage Beta shell follows root theme. | Preserve the user-required shared Beta shell in this feature. The future visual reviewer must record, resolve through an approved shared-shell decision, or explicitly accept the resulting delta—without creating About-specific variants. |
| Hover, focus, motion, and touch states of new static content | Pencil defines no page-local interactive controls or animation. | Reuse established semantic focus/reduced-motion behavior; do not invent interactions. |
| Remote visual assets | No About-specific image fill is used by the authored page. | No asset migration is required. |

## 7. Acceptance criteria

| ID | Criterion |
| --- | --- |
| AC-01 | `/about` is a thin `(beta)` route with canonical metadata, sitemap coverage, and feature-owned composition/data; it has no direct `fetch`. |
| AC-02 | The existing shared Beta Header/Footer, canonical `Sobre → /about` navigation, compact menu behavior, theme infrastructure, and global player are reused without duplication or regression. |
| AC-03 | The desktop dark and light page match the confirmed hero, Mission/Values, Impact, Timeline, and Footer anatomy, copy, hierarchy, token roles, and measured geometry from `MwqyG` / `td6q3`. |
| AC-04 | Principle cards, impact metrics, and milestones are deterministic typed fixtures in their confirmed order, with no remote/statistical calculation. |
| AC-05 | The timeline remains semantically understandable and visually intact with long text, zoom, keyboard navigation, and assistive technology. |
| AC-06 | Dark/light at all three required viewports have no horizontal overflow, clipping, unreadable wrapping, theme mismatch, or player obstruction; tablet/mobile outcomes are labeled responsive adaptations. |
| AC-07 | `web-design-reviewer` compares live browser screenshots with Pencil at every viewport/theme, logs concrete differences in `validation.md`, and completes the correction loop before visual approval. |
| AC-08 | Focused tests plus `pnpm --filter @cafedebug/web run test`, `lint`, `typecheck`, `build`, and `git diff --check` pass; architecture review verifies no route/business-logic or shared-responsibility regression. |

## 8. Implementation gate

Specification and planning are approved. Implementation remains rejected in
this `$spec` command: begin only through an approved implementation request
and the `frontend-blacksmith` role.
