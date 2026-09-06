# Validation: Contact Page

> **Status:** Implementation and visual corrections are complete. The product owner completed the literal 200% zoom observation on 2026-08-16; no clipping or overflow was reported.

## Resolved visual correction record — 2026-08-16

This review supersedes the earlier statement that no blocking desktop parity
difference was found. The active `cafedebug.pen` remains authoritative. It was
re-checked with dark `hBoyk`/`B0RP9`/`hemB6`/`u7rdZ`/`tx0aR` and light
`Glg7r`; the live route was inspected at `http://localhost:3000/contact` at
`1440 × 1200` in both themes.

| Priority | Resolved runtime difference | Delivered Pencil-aligned result |
| --- | --- | --- |
| P1 | Social card used a single-line, right-aligned anatomy. | `Redes sociais` now has one accessible external link per platform with a 42px secondary circular icon, 14px text gap, bold label, muted handle/path, and no row-end arrow. |
| P1 | Discord used stale copy and inconsistent visual treatment. | `hemB6`/light counterpart now use the approved paragraph, success presence dot, 48px secondary rounded-square MessageCircle, and the user-approved ArrowUpRight CTA with a 12px gap. |
| P1 | Business descriptions and mail actions differed. | Both final descriptions match Pencil, including `em todo o Brasil.`; mail icon/text are primary, non-underlined, and JetBrains Mono 14px/500. |
| P2 | Card typography/icon spacing and input error composition differed. | Sidebar headings are 19px, business headings 18px semibold, and validation errors render outside labels while retaining `aria-describedby`, ids, and `role="alert"`. |

The currently implemented desktop container/card geometry remains aligned:
the sidebar cards are `460px` wide and the business cards are `668 × 245px`.
The correction is limited to the content anatomy, copy, icon treatment, and
link styling above. The dark and light Pen frames were updated with the
user-approved visual decisions; mock-only behavior and the Beta shell remain
unchanged.

### User-directed Discord CTA override

After the correction handoff, the product owner explicitly retained only the
`ArrowUpRight` icon in the `Entrar no Discord` CTA, with a 12px text-to-icon
gap. The online presence indicator retains its success treatment; the Discord
badge follows the business-card pattern (secondary rounded square with a
primary icon). The corresponding dark and light Pen Discord cards were
updated together.

## Automated checks

| Check | Result | Evidence |
| --- | --- | --- |
| Focused and project tests | pass | `pnpm --filter @cafedebug/web run test` — 86/86 passing, including `contact-source.test.mjs` |
| Lint | pass | `pnpm --filter @cafedebug/web run lint` |
| Typecheck | pass | `pnpm --filter @cafedebug/web run typecheck` |
| Production build | pass | `pnpm --filter @cafedebug/web run build`; Next emitted `/contact` |
| Diff integrity | pass | `git diff --check` |

## Pencil visual review

Pencil MCP was connected to `/cafedebug.pen` and compared against dark `hBoyk`
and light `Glg7r` after implementation. The desktop route preserves the shared
Beta Header/Footer and the inspected composition: intro, 2-column form/sidebar,
business cards, newsletter, and Footer. The following visual details were
checked against the direct Pencil evidence in `design.md`:

- 1,360px desktop content intent, form/sidebar relationship, card hierarchy,
  field labels/order, CTA copy, Discord/social order, business and newsletter
  copy.
- Semantic-token dark/light surfaces, borders, typography hierarchy, and
  accent CTA treatment.
- Pencil source screenshots were recaptured on 2026-08-16 with
  `TakeScreenshot(["hBoyk", "Glg7r"])`. Browser captures were inspected in
  the same validation session at the viewports below.

The browser's visible scrollbar means the rendered desktop content box is
1,345px wide at a 1,440px viewport, while the Pencil canvas has no browser
scrollbar; the 460px sidebar and two-column relationship remain preserved.
The resolved correction record above has been re-checked against active dark
and light Pencil nodes. The product owner also completed the literal 200%
browser zoom observation, with no clipping or overflow reported.

## Browser behavior and responsive matrix

| Viewport | Theme | Result | Evidence |
| --- | --- | --- | --- |
| 1440 × 1200 | Dark | pass | Shared desktop navigation; two-column form/sidebar; no horizontal overflow. |
| 1440 × 1200 | Light | pass | Theme toggle applies light semantic surfaces; two-column form/sidebar; no horizontal overflow. |
| 768 × 1024 | Light | pass | Form and sidebar stack cleanly; Name/Email retain their two-column row; no horizontal overflow. |
| 768 × 1024 | Dark | pass | Same responsive stack and token mapping; no horizontal overflow. |
| 390 × 844 | Light | pass | Compact navigation replaces desktop nav; cards, business, and newsletter controls use a single column without clipping. |
| 390 × 844 | Dark | pass | Compact navigation, dark tokens, visible focus-capable controls, and no horizontal overflow. |
| 200% browser zoom | User-observed | pass | Product owner confirmed the page remains usable at 200% zoom with no clipping or horizontal overflow reported. |

## Interaction and accessibility checks

- Empty submission exposes four required-field messages, each referenced by
  its control's `aria-describedby`: `name-error`, `email-error`,
  `subject-error`, and `message-error`. All four messages announce with
  `role="alert"`.
- A valid local submission with `Parcerias` displays the approved live status
  `Mensagem enviada com sucesso.` and resets Nome, Email, Assunto, and
  Mensagem to their defaults. The deterministic mock service does not call
  `fetch`.
- The external Discord link and five social links use the approved mock
  `https://example.com/cafedebug/<platform>` destinations with
  `target="_blank" rel="noreferrer"`. Business actions are semantic
  `mailto:` links.
- At mobile width, the compact menu opens with `Abrir menu principal` and
  closes with Escape. The shared Beta theme toggle works in both directions.
- The Contact controls and actions are at least 40px high, and runtime
  scroll-width checks at all validation widths found no horizontal overflow.

## Known scope boundary

The selected mock behavior is intentional: Contact and newsletter submissions
make no network request, and external `example.com` URLs are not production
destinations. Real delivery/configuration is deferred.
