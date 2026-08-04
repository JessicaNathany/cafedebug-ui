# Design: Responsive Navigation Menu

| Field | Value |
| --- | --- |
| **Status** | `Implemented` |
| **Spec** | `.specs/web/responsive-navigation-menu/spec.md` |
| **Pencil file** | `/cafedebug.pen` |
| **Affected app** | `apps/web` |
| **Feature boundary** | `apps/web/src/components/layout` |

## 1. Pencil node map

| Surface | Node | Size | Theme/state |
| --- | --- | --- | --- |
| Desktop shared header | `m9zV96` | `1440x72` | Fixed dark source component |
| Footer status treatment | `LSgoB` | `1440x330` | Fixed dark source component |
| Compact beta header | `sYLaO` | `390x72` | Light, closed |
| Compact beta header | `jHEKy` | `390x72` | Dark, closed |
| Compact fixed-dark header | `l3At9Z` | `390x72` | Closed |
| Compact beta menu | `p4ky3` | `390x292` | Light, open |
| Compact beta menu | `wahud` | `390x292` | Dark, open |
| Compact fixed-dark menu | `fWEbw` | `390x292` | Open |

The desktop header and footer reusable components were updated in Pencil before implementation. The compact nodes are dedicated implementation contracts and do not claim to be full responsive page artboards.

## 2. Viewports

| Name | Size | Required |
| --- | --- | --- |
| Desktop | `1440x1200` | Yes |
| Breakpoint | `1024x768` | Yes |
| Below breakpoint | `1023x768` | Yes |
| Tablet | `768x1024` | Yes |
| Mobile | `390x844` | Yes |

## 3. Layout contract

### Desktop

- Preserve the `1440x72` shared header, 40px desktop gutters, 40px action controls, and 28px navigation gaps from `m9zV96`.
- Render exactly `Início`, `Episódios`, `Time`, and `Sobre` in the horizontal navigation.
- The compact trigger and panel are hidden at `lg` and above.

### Compact closed state

- Header is 72px high with 16px horizontal gutters at 390px.
- Left cluster: wordmark, 12px gap, 40px circular menu trigger.
- Right cluster: existing controls with 14px gaps.
- Trigger icon is Lucide `menu`, 18px.
- Beta uses Search + 40px ThemeToggle; fixed-dark uses Search + existing 40px-high `Assinar` pill.

### Compact open state

- Trigger changes to Lucide `x`, 18px.
- A 220px menu panel overlays content immediately below the header; total authored open-state height is 292px.
- Panel uses `--popover`, a bottom `--border`, 12/16/20/16 padding, and 4px item gaps.
- Each item is 44px high with 12px horizontal padding.
- `Início` uses `--secondary`, 12px radius, and semibold foreground text.
- `Episódios` uses foreground text without a filled surface.
- `Time` and `Sobre` use muted foreground text and remain inert.
- The panel spans the full header width and must not change document width or push page content.

### Footer

- Preserve `LSgoB` geometry and column order.
- The `Conteúdo` column renders `Notícias — Em breve`, `Eventos — Em breve`, and `Vagas — Em breve` as inline text using the existing footer-link typography and muted foreground token.

## 4. Component contract

| Component/module | Source | Responsibility |
| --- | --- | --- |
| `navigation-items.ts` | New | Canonical ordered discriminated union shared by desktop and compact navigation. |
| `Nav` | Existing | Server-rendered desktop navigation visible at `lg` and above. |
| `MobileNav` | New | The only new client boundary; owns trigger state, dismissal, and compact rendering below `lg`. |
| `Header` | Existing | Server shell, theme variant selection, positioning context, and composition. |
| `Footer` | Existing | Renders deferred status metadata without adding routes. |

`Header` remains a Server Component. `MobileNav` is inserted after the wordmark in the left cluster. Its absolutely positioned panel uses the header as its containing block.

## 5. State and interaction contract

- Initial state is closed.
- Trigger click toggles state and updates `aria-expanded`, `aria-controls`, accessible label, and icon synchronously.
- Focus remains on the trigger when opened; the next `Tab` reaches `Início`.
- Enabled link activation closes the menu.
- `Escape` closes and restores trigger focus.
- Capture-phase click activation outside the trigger/panel is cancelled, closes the menu, restores trigger focus, and does not activate the underlying control.
- A `matchMedia('(min-width: 64rem)')` change closes the menu when entering the desktop state.
- Closed menu content is unmounted.
- Opening and closing are immediate; no authored animation is required, so reduced-motion users receive the same stable behavior.

## 6. Theme and token contract

- Use only `bg-background`, `bg-popover`, `bg-secondary`, `text-foreground`, `text-muted-foreground`, `text-secondary-foreground`, `border-border`, and `outline-ring` mappings.
- Beta inherits the root Light/Dark theme.
- Fixed-dark retains the header's existing `.dark` scope.
- No token-package change is needed.
- No raw color, shadow, or arbitrary overlay color is introduced.

## 7. Accessibility contract

- Desktop and compact navigation use `aria-label="Navegação principal"`; CSS visibility plus conditional panel mounting ensures only one active landmark is exposed.
- Trigger labels are exactly `Abrir menu principal` and `Fechar menu principal`.
- Trigger uses `aria-expanded` and `aria-controls="compact-primary-navigation"`.
- Icons are decorative (`aria-hidden`).
- Enabled destinations are native links; disabled destinations are spans with `aria-disabled="true"`.
- Trigger and destinations keep visible focus indicators and at least 40px targets.
- The footer status is visible text and does not rely on color.

## 8. Architecture and testing contract

- No route file or feature data flow changes.
- No direct `fetch` or new package dependency.
- Update source-contract tests for canonical items, client boundary, trigger semantics, breakpoints, dismissal, and footer statuses.
- Protect the source contract with focused tests and record live disclosure behavior in `validation.md`; do not add a browser dependency solely for this shared-shell change.
- Run web lint, typecheck, tests, build, responsive browser checks, and `git diff --check`.

## 9. Acceptance mapping

| Spec area | Primary evidence |
| --- | --- |
| AC-NAV | Canonical model source tests + desktop/compact DOM inspection |
| AC-RESP | Browser screenshots and visibility checks at five required viewports |
| AC-A11Y | Runtime keyboard/pointer checks + source/component assertions |
| AC-FOOT | Footer source tests + runtime footer DOM/screenshot |
| AC-ARCH | Source inspection, typecheck, lint |
| AC-QA | Full command log in `validation.md` |
