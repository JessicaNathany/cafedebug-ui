# Homepage Beta Launch Validation

| Field | Value |
| --- | --- |
| **Status** | `Approved` |
| **Date** | `2026-08-03` |
| **Reviewer workflow** | `web-design-reviewer` |
| **Runtime** | `http://localhost:3000/` |
| **Pencil dark/light** | `b3Kzt` / `F0E1s` |

## Reviewer verdict

**Approved.** The beta homepage matches the named Pencil pages at the required 1440px desktop reference, follows the root dark/light mode, and remains structurally sound at the inferred tablet and mobile breakpoints.

One responsive accessibility issue was detected and fixed during review: the header logo link exposed a 20px-tall touch box. Its interactive box is now 40px without changing the authored header geometry. No enabled mobile control remains below the 40px minimum.

## Pencil evidence

- Dark/light page nodes: `b3Kzt` / `F0E1s`, each `1440x2794`.
- Header: `M9Wiwt` / `VH3jo`, `1440x72`.
- Hero: `BjEw5` / `JG04K`, `1440x734`.
- Carousel: `H4D8y` / `np9bc`, `728x574`; viewport `728x520`.
- Player: `RXOIr` / `XEbWn`, `520x559`.
- Recent Episodes: `c3qKCJ` / `Ijlxy`, `1440x1084`; six-card grid `1312x848`.
- Disabled News/Events: `R2MZY` / `FcEf0`; no runtime beta equivalent.
- Newsletter: `wSlSh` / `n2DeHV`, `1440x574`.
- Footer: `Q77OEY` / `dG0vW`, `1440x330`.

## Runtime geometry

At `1440x1200`, the full document is exactly `1440x2794` with this contiguous stack:

| Area | Runtime bounds |
| --- | --- |
| Header | `x=0, y=0, 1440x72` |
| Hero | `x=0, y=72, 1440x734` |
| Carousel | `x=64, y=152, 728x574` |
| Featured player | `x=856, y=160, 520x559` |
| Recent Episodes | `x=0, y=806, 1440x1084` |
| Newsletter | `x=0, y=1890, 1440x574` |
| Footer | `x=0, y=2464, 1440x330` |

The episode grid renders two rows at `y=970` and `y=1406`, three columns at `x=64`, `509`, and `955`, with six `421x412` cards in EP 141 through EP 136 order.

## Theme and interaction evidence

- Dark mode shows `Ativar tema claro`; light mode shows `Ativar tema escuro`.
- Switching to light updates header and every beta section to `--background` (`rgb(242, 243, 240)`), elevated cards/footer to white, and persists after reload.
- Episode-detail content keeps the fixed-dark Header/Footer and visible `Assinar` action even when the root preference is light.
- Carousel begins at `01 / 04`, maintains exactly one non-hidden `tabpanel`, and uses roving `tabIndex`.
- Next/previous buttons and Left/Right/Home/End tab keys activate slides and wrap at both ends.
- Deferred slide CTAs remain focusable `aria-disabled` buttons; episode CTAs remain `#episodios` links; no autoplay timer exists.
- Runtime console review reported no warnings or errors.

## Responsive evidence

| Viewport | Result |
| --- | --- |
| `768x1024` | No horizontal overflow; `688x491` fluid carousel viewport; centered `520px` player; six cards in two columns by three rows. |
| `390x844` | No horizontal overflow; `358x420` carousel viewport; stacked 50px CTAs; `358px` player; six cards in one column. |

Pencil supplies no tablet/mobile beta artboards, so these results establish structural equivalence and overflow safety, not pixel-parity claims.

## Automated verification

- `pnpm --filter @cafedebug/web run test` — 44/44 passed.
- `pnpm --filter @cafedebug/web run lint` — passed.
- `pnpm --filter @cafedebug/web run typecheck` — passed.
- `pnpm --filter @cafedebug/web run build` — passed.
- `git diff --check` — passed.

## Preservation evidence

- `HomepageV2` retains the former stats, text hero, News, Agenda, recent episodes, and dark newsletter composition.
- The fixed-dark shell and `SubscriptionAction` remain the defaults for existing content routes.
- The G03-G10 tests remain active and were retargeted only where necessary.
- `homepage-v2-preservation-source.test.mjs` fails if protected 2.0 composition artifacts disappear.
- The user-modified `cafedebug.pen` was read only through Pencil MCP and was not edited during implementation.
