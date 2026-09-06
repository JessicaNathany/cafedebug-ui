# Spec: Contact Page

| Field | Value |
| --- | --- |
| **Status** | `Approved for implementation — deterministic mock-only behavior` |
| **Route** | `/contact` |
| **Domain** | `web/contact` |
| **Change class** | `Visual web` |
| **Design source** | `cafedebug.pen`; directly inspected desktop frames `hBoyk` (dark) and `Glg7r` (light) on 2026-08-16 |

## Objective and purpose

Provide Café Debug's primary communication page: a visitor can understand how to contact the community, find the social and commercial channels, and see the newsletter call to action. The page must preserve the designed information order without creating a backend integration or another website shell.

## Scope

- Serve `/contact` via a routing/metadata boundary in `apps/web/src/app/(beta)/contact/`; place all UI, local fixtures, form state, schema, and future feature services under `apps/web/src/features/contact/`.
- Inherit the existing Beta layout, and therefore its `Header variant="beta"` and `Footer variant="beta"`, theme toggle, responsive navigation, accessibility, and persistent-player ownership. No page-local header, footer, or navigation configuration is allowed.
- Activate the existing shared Footer's canonical `Contato` destination to `/contact` when the route is implemented; do not alter the other existing community destinations.
- Render this ordered composition: introduction; form and community/social sidebar; `Para empresas` cards; newsletter CTA; shared Beta Footer.
- Use deterministic, local fixture data only for repeated contact content. No API, CMS, `fetch`, remote runtime content, analytics, or production submission behavior is in scope.

## Explicit non-goals

- Editing `cafedebug.pen`, implementing code, creating the route, or changing production components in this specification phase.
- Contact-message delivery, email/newsletter subscription delivery, authentication, CAPTCHA, rate limiting, persistence, tracking, or a route handler/API.
- Guessing contact destinations, social URLs, subject categories, success/error copy, responsive artboards, child-node measurements, assets, or visual states that Pencil/current code do not establish.
- Duplicating Header, Footer, navigation, `NewsletterForm`, theme state, or player/audio state.

## Functional requirements

### FR-1 — Page and shared shell

- The future route uses the existing `(beta)` layout, not a new layout. Its Header and Footer are the Beta variants in both document themes.
- The page has one `main` landmark and preserves the visible hierarchy: contact introduction, primary contact region, business-contact region, newsletter region, Footer.
- The shared primary navigation remains unchanged; the page contains no page-specific navigation list.

### FR-2 — Introduction and main composition

- Render the Pencil-confirmed `FALE CONOSCO` eyebrow and `Vamos conversar?` page `h1`; the direct desktop copy and measurements are recorded in `design.md`.
- At the Pencil-confirmed 1440px desktop reference, use the 1,360px main container: 868px form card, 32px inter-column gap, and 460px sidebar. Tablet/mobile rearrangement remains unresolved.

### FR-3 — Contact form contract

- Use one semantic `<form>` with visible/explicit labels for `Nome`, `Email`, `Assunto`, and `Mensagem`; placeholders never substitute for labels.
- Desktop Pencil evidence establishes `Nome` and `Email` side-by-side, then full-width `Assunto`, `Mensagem`, and the `Enviar mensagem` submit action. Tablet/mobile rearrangement is unresolved.
- All fields (`Nome`, `Email`, `Assunto`, and `Mensagem`) are required before a message may be sent. `Email` uses semantic `type="email"` and suitable autocomplete. The Pencil-confirmed placeholders are `Seu nome completo`, `seu@email.com`, `Selecione um assunto`, and `Escreva sua mensagem aqui...`.
- The deterministic subject fixture is ordered as: `Selecione um assunto` (disabled default), `Dúvidas e sugestões`, `Parcerias`, `Publicidade e patrocínio`, `Quero participar do podcast`, `Pautas e sugestões de conteúdo`, and `Outros assuntos`.
- Future client validation and form state must live in `features/contact` and use React Hook Form plus a Zod schema. A valid submission calls a deterministic local mock service only—never `fetch`—and receives a mock success result.
- The approved mock success behavior resets the form, restores the default subject, and exposes `Mensagem enviada com sucesso.` in an accessible live status. It is an approved implementation constraint, not Pencil-confirmed desktop-state evidence.
- The CTA supports enabled, submitting/disabled, visible focus, Enter/Space/native keyboard activation, and accessible invalid-message association. Loading/success styling uses existing tokenized primitives where compatible.

### FR-4 — Community and social content

- Render the Pencil-confirmed Discord/community and separate social-links cards. Their desktop anatomy, copy, indicator, dimensions, order, and displayed handles/paths are recorded in `design.md`.
- Pencil-confirmed social display data is GitHub `@cafedebug`, X `@cafedebugcast`, YouTube `/cafedebug`, LinkedIn `/company/cafedebug`, and Instagram `@cafedebug`. Repeated rows belong in a deterministic local fixture with platform, display value, URL, icon, and accessible name.
- Discord and every social destination use external-link behavior with `target="_blank"` and `rel="noreferrer"`. Until production configuration exists, deterministic fixture URLs are mock-only `https://example.com/cafedebug/{discord,github,x,youtube,linkedin,instagram}` and must remain clearly non-production.

### FR-5 — Business contact

- Render Pencil-confirmed `Para empresas`, supporting copy, and the desktop two-card composition: `Parcerias & Patrocínios` and `Publicidade`.
- Pencil confirms `parcerias@cafedebug.com.br` and `publicidade@cafedebug.com.br`; render them as semantic `mailto:` actions.
- Card icon, exact copy, hover/focus treatment, sizing, and responsive reflow remain visual evidence gaps.

### FR-6 — Newsletter

- First assess whether the existing Homepage Beta `NewsletterSection` and its UI-only `NewsletterForm` can be composed without violating the Contact Pencil contract. The existing form prevents default submit and makes no network request.
- Reuse the existing UI-only newsletter submission/state responsibility through a compatible Contact composition. It prevents default submission and has no visible success/error result; do not fork its logic or introduce a second submit flow.
- Pencil confirms Contact CTA title `Receba o melhor da semana`, CTA text `Inscrever`, copy, and 280px input/124px action desktop geometry.

### FR-7 — Themes, responsiveness, and accessibility

- Use `packages/web-design-tokens` semantic values; no raw visual colors or arbitrary feature visual values. Any Pencil-to-token mismatch needs a documented decision before a token or style is added.
- Validate both directly inspected desktop themes and the 1440×1200, 768×1024, and 390×844 contracts. Header/Footer remain Beta variants. Tablet/mobile frames are not yet live-inspected.
- Ensure logical landmarks/headings, visible focus, keyboard-operable fields/select/links, error association, contrast, 40px-or-larger usable touch targets, zoom/long-copy resilience, and no horizontal overflow or clipped controls.

## Architecture and deterministic data

- Feature root: `apps/web/src/features/contact/`. The approved future responsibility split is `components/` (rendering only), `hooks/` (React Hook Form orchestration only), `schemas/` (Zod), `mock/` and `types/` (deterministic contact data/contracts). `services/`, `server/`, and `app/api` are **N/A**: this feature has no API, persistence, remote data, or route-handler responsibility.
- `apps/web/src/app/(beta)/contact/page.tsx` remains a thin route/metadata composition boundary. It must not validate fields, own fixtures, or call `fetch`.
- Potential fixture contracts: deterministic subject options only after approved; social links; business contact cards. Static structural copy should remain component-local where a fixture adds no reuse value.

## Evidence status and open questions

### Directly verified this task

- The app has no Contact feature or `/contact` route.
- `(beta)/layout.tsx` renders `Header variant="beta"` and `Footer variant="beta"`.
- The Contact route adds only the shared Footer `Contato → /contact` destination.
- Existing `NewsletterForm` is UI-only and prevents default submission.
- Pencil `hBoyk` and `Glg7r` are directly inspected 1440×2162 Contact frames. Their hierarchy, visible copy, desktop measurements, and core theme surfaces are captured in `design.md`.

### Pencil-confirmed desktop evidence

- `hBoyk` is the dark desktop frame and `Glg7r` is the light desktop frame; both use the same 1440px hierarchy and geometry.
- The introduction, form/sidebar, Discord/social cards, business row, newsletter strip, visible text, field geometry, card dimensions, and core dark/light surfaces are directly captured in `design.md`.

### Blocking before implementation approval

No product decision blocks the mock-only implementation. Production service integration, real external destinations, and any new Pencil state artboards remain non-goals for this delivery.

### Non-blocking after a documented implementation decision

- Exact component names and the minimal feature-folder subset.
- Whether email-card hover/focus visuals require a Pencil amendment after the semantic `mailto:` action is implemented.

## Acceptance criteria

| ID | Requirement |
| --- | --- |
| AC-01 | `/contact` is a thin route/metadata boundary under `(beta)` and inherits the Beta Header/Footer; no duplicate shell exists. |
| AC-02 | Live Pencil evidence records `hBoyk`, `Glg7r`, relevant children, screenshots, measurements, assets, and theme differences before implementation. |
| AC-03 | The rendered order is introduction → form/sidebar → business cards → Contact newsletter → shared Beta Footer. |
| AC-04 | The form has native semantics, explicit labels, keyboard behavior, accessible validation, no network activity, and the approved deterministic mock success result. |
| AC-05 | Subject options and mock external destinations come from deterministic local fixtures; mock URLs are visibly/documentedly non-production. |
| AC-06 | Existing newsletter behavior is reused or an approved non-duplicating alternative is documented. |
| AC-07 | Desktop, tablet, and mobile render in both themes with no overflow/clipping; shared navigation and theme switch remain functional. |
| AC-08 | Tokens, accessibility, feature boundaries, tests, lint, typecheck, build, browser review, and Pencil comparison meet the design contract. |
