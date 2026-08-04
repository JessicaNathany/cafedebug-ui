# Validation: Responsive Navigation Menu

| Field | Value |
| --- | --- |
| **Status** | `Passed` |
| **Date** | `2026-08-03` |
| **Spec** | `.specs/web/responsive-navigation-menu/spec.md` |
| **Design** | `.specs/web/responsive-navigation-menu/design.md` |

## 1. Pencil evidence

- Active authoritative document verified as `/Users/regis/Work/CafeDebug/cafedebug-ui/cafedebug.pen` with schema and canvas guidance loaded.
- Desktop header `m9zV96` contains exactly `Início`, `Episódios`, `Time`, and `Sobre`.
- Footer `LSgoB` contains `Notícias — Em breve`, `Eventos — Em breve`, and `Vagas — Em breve` in the `Conteúdo` column.
- Compact nodes created and inspected:
  - beta Light closed/open: `sYLaO` / `p4ky3`;
  - beta Dark closed/open: `jHEKy` / `wahud`;
  - fixed-dark closed/open: `l3At9Z` / `fWEbw`.
- Closed nodes resolve to `390x72`; open nodes resolve to `390x292` with a 220px panel.
- Item radius resolves through `--radius-m` (16px), not a raw implementation value.
- Structural problem visitors reported no remaining clipping, collapse, or overflow issues for all eight source/contract nodes.
- Screenshots of desktop header, footer, beta Light closed/open, beta Dark open, and fixed-dark open were visually inspected.

## 2. Automated validation

| Command | Result |
| --- | --- |
| `node --test tests/header-source.test.mjs tests/mobile-nav-source.test.mjs tests/footer-source.test.mjs` | Passed: 15/15 |
| `pnpm --filter @cafedebug/web run test` | Passed: 48/48 |
| `pnpm --filter @cafedebug/web run lint` | Passed |
| `pnpm --filter @cafedebug/web run typecheck` | Passed |
| `pnpm --filter @cafedebug/web run build` | Passed; production routes generated |
| `git diff --check` | Passed |

The first sandboxed build attempt could not fetch the configured Google Fonts. The required rerun with network permission fetched Geist and JetBrains Mono and completed successfully.

## 3. Runtime viewport matrix

Validated against the live Next.js application through the in-app Browser at `http://localhost:3000/`.

| Viewport | Desktop nav | Compact trigger | Trigger size | Horizontal overflow |
| --- | --- | --- | --- | --- |
| `1440x1200` | `flex` | Hidden | `0x0` | No (`scrollWidth=1440`) |
| `1024x768` | `flex` | Hidden | `0x0` | No (`scrollWidth=1024`) |
| `1023x768` | Hidden | Visible | `40x40` | No (`scrollWidth=1023`) |
| `768x1024` | Hidden | Visible | `40x40` | No (`scrollWidth=768`) |
| `390x844` | Hidden | Visible | `40x40` | No (`scrollWidth=390`) |

Tablet open-state evidence: panel width `768`, panel top `71`, exact items `Início`, `Episódios`, `Time`, `Sobre`, and no overflow.

Mobile open-state evidence: panel text resolves to the same four items, panel width matches the viewport, `aria-expanded="true"`, and `scrollWidth` remains `390`.

## 4. Interaction and accessibility evidence

- Closed trigger exposes `Abrir menu principal`, `aria-expanded="false"`, and `aria-controls="compact-primary-navigation"`.
- Opening changes the label to `Fechar menu principal`, changes the icon from Menu to X, mounts the named navigation panel, and retains trigger focus.
- Sequential focus candidates are ordered: wordmark, trigger, `Início`, `Episódios`, Search, then the theme/subscription action.
- `Início` and `Episódios` are native links with `tabIndex=0`.
- `Time` and `Sobre` are spans with `aria-disabled="true"`, no `href`, and `tabIndex=-1`.
- `Escape` closes the panel, unmounts its contents, returns `aria-expanded` to false, and restores focus to `Abrir menu principal`.
- Capture-phase outside activation closes the panel, restores trigger focus, and prevents the underlying theme action from changing the root class.
- Activating `Início` from the fixed-dark content route navigates to `/`, closes/unmounts the panel, and leaves the trigger collapsed.
- Resizing an open menu from 390px to 1024px detaches the panel, collapses the trigger state, hides the compact wrapper, and exposes the desktop navigation.
- Closed panel content is unmounted and therefore absent from the accessibility tree and tab order.

## 5. Theme and variant evidence

| Variant | Header background | Panel background | Overflow |
| --- | --- | --- | --- |
| Beta Light | `rgb(242, 243, 240)` | `rgb(255, 255, 255)` | No |
| Beta Dark | `rgb(17, 17, 17)` | `rgb(26, 26, 26)` | No |
| Fixed dark | Token-backed dark header/panel with Search + `Assinar` | Token-backed dark popover | No |

Fixed-dark mobile runtime kept the exact header action order `Fechar menu principal`, `Pesquisar`, `Assinar` and fit within 390px.

## 6. Footer evidence

Runtime `Conteúdo` order remains:

1. `Episódios`
2. `Notícias — Em breve`
3. `Eventos — Em breve`
4. `Vagas — Em breve`

All four items have zero descendant links. The three deferred items expose the same combined accessible labels as their visible copy. Mobile footer validation produced no horizontal overflow.

## 7. Tooling notes and residual risk

- The standalone Playwright wrapper could not launch because its configured Chrome distribution is not installed. Equivalent live validation was completed with the installed in-app Browser and its Playwright/DOM inspection APIs.
- The current Pencil server exposes `get_app_state` plus `execute`/`Get`; these were used as the current equivalents of the legacy `get_editor_state`/`batch_get` names referenced by the original spec text.
- The existing `127.0.0.1` dev origin carried a pre-existing theme hydration mismatch and a blocked HMR-origin warning. The authoritative runtime pass used the equivalent `localhost` origin, which loaded with no console warnings/errors and fully hydrated interactions.
- No new runtime or browser-test dependency was added. Interaction behavior is protected by focused source-contract tests and the live evidence above.
- No unresolved feature blocker or acceptance gap remains.
