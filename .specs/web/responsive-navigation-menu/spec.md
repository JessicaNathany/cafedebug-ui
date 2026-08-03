# Spec: Responsive Navigation Menu

| Field | Value |
| --- | --- |
| **Status** | `Implemented` |
| **Domain** | `web/navigation` |
| **Spec path** | `.specs/web/responsive-navigation-menu/` |
| **Affected app** | `apps/web` |
| **Affected surfaces** | Shared site header and footer |
| **Design source** | `cafedebug.pen` |
| **Existing desktop header node** | `m9zV96` |
| **Existing footer node** | `LSgoB` |
| **Responsive source status** | Compact nodes documented in `design.md` |
| **Lifecycle** | `specification -> planning -> implementation -> debug/validation -> documentation` |

## 1. Problem statement

The shared site header hides the complete primary navigation below the Tailwind `lg` breakpoint. This prevents users on tablet and mobile screens from opening the site menu or reaching its available destinations.

The desktop header also presents `Notícias`, `Eventos`, and `Vagas` as inert top-level items even though these destinations are not available. Their unavailable status is not communicated in the footer beyond the items being non-interactive.

CafeDebug needs a responsive primary-navigation entry point, a focused top-menu information architecture, and a visible `Em breve` status for the deferred content destinations.

## 2. Product decisions

1. **Compact navigation has a real menu.** Below `lg`, the desktop navigation is replaced by an icon-only button with the conventional three horizontal lines (`Menu`, visually equivalent to `≡`). The icon is not decorative and must open and close a compact primary menu.
2. **The top-menu scope is reduced everywhere.** `Notícias`, `Eventos`, and `Vagas` are removed from both desktop and compact primary navigation. They must not remain hidden in the menu DOM.
3. **Available and deferred primary items are preserved.** The primary menu contains, in order, `Início`, `Episódios`, `Time`, and `Sobre`. Existing route availability is unchanged: `Início` and `Episódios` are links; `Time` and `Sobre` remain visibly disabled/inert until their routes ship.
4. **Deferred content stays discoverable in the footer.** `Notícias`, `Eventos`, and `Vagas` remain in the `Conteúdo` footer column and each displays an adjacent visible status with the exact copy `Em breve`.
5. **The existing breakpoint remains authoritative.** The desktop navigation is shown at `lg` and above. The compact menu trigger is shown below `lg`, so there is exactly one primary-navigation entry point at every supported viewport.
6. **Responsive visuals require a Pencil contract.** The existing Pencil index documents only the desktop header/footer anatomy. Exact compact-menu geometry must be added to `cafedebug.pen` and documented in this feature's design phase before implementation begins.

## 3. Scope

### In scope

- Replace the disappearing navigation below `lg` with a three-line menu trigger.
- Provide an operable compact menu containing the same four top-menu items as desktop.
- Remove `Notícias`, `Eventos`, and `Vagas` from all primary-navigation variants.
- Add visible `Em breve` statuses to those three items in the footer.
- Preserve the existing beta and fixed-dark header/footer theme variants.
- Define keyboard, focus, responsive, overflow, and assistive-technology behavior.
- Update focused source/component/browser coverage for the new contract.

### Out of scope

- Creating routes or content for `Notícias`, `Eventos`, `Vagas`, `Time`, or `Sobre`.
- Making deferred footer items clickable.
- Changing search, theme switching, subscription, newsletter, social, or legal behavior.
- Redesigning the header/footer outside the navigation and status changes named here.
- Changing the `lg` breakpoint.
- Adding nested navigation, authentication actions, gesture navigation, or menu analytics.

## 4. User scenarios

### US-1 — Open navigation on a small screen

As a tablet or mobile visitor, I can identify and activate the three-line menu button so that I can access the site's primary navigation even when the desktop navigation does not fit.

### US-2 — Navigate or dismiss without a pointer

As a keyboard or assistive-technology user, I can open, understand, traverse, activate, and dismiss the compact menu without losing my place in the header.

### US-3 — Understand deferred destinations

As a visitor looking for news, events, or jobs, I can see in the footer that these destinations are coming soon instead of mistaking inert labels for broken links.

## 5. Functional requirements

### FR-1 — Canonical primary-navigation items

- Define one canonical ordered navigation model for `Início`, `Episódios`, `Time`, and `Sobre` so desktop and compact variants cannot drift.
- `Início` links to `/` and keeps the existing active-page treatment when applicable.
- `Episódios` links to `/#episodios` under the current route contract.
- `Time` and `Sobre` remain non-interactive with `aria-disabled="true"` and no `href` until dedicated route specs activate them.
- `Notícias`, `Eventos`, and `Vagas` must not occur in the primary-navigation model or either rendered navigation variant.

### FR-2 — Responsive visibility

- At `lg` and above, render the existing horizontal desktop navigation and do not render a visible compact trigger.
- Below `lg`, hide the horizontal desktop navigation and show one compact menu trigger.
- The compact trigger occupies a minimum `40x40` target and sits in the header's left cluster after the CaféDebug wordmark, replacing the space used by the desktop navigation.
- The wordmark, menu trigger, and existing right-side header actions must fit without document-level horizontal overflow at all required viewports.
- Breakpoint transitions must never show both navigation variants or leave the header without a primary-navigation entry point.

### FR-3 — Menu trigger semantics

- Use an icon-only native button with `type="button"`.
- In the closed state, show the three-horizontal-line `Menu` icon; the SVG is `aria-hidden`.
- The button exposes `aria-expanded`, `aria-controls`, and an accessible name that communicates the action: `Abrir menu principal` when closed and `Fechar menu principal` when open.
- The open-state visual indicator and all icon sizing/spacing are locked in the Pencil design contract; they may not be improvised during implementation.
- Focus indication uses semantic web design tokens and remains visible in beta light/dark and fixed-dark variants.

### FR-4 — Compact menu behavior

- Activating the trigger opens a compact menu associated with the trigger through a stable ID.
- The menu presents `Início`, `Episódios`, `Time`, and `Sobre` once each and in that order.
- Opening the menu keeps focus on the trigger; the next `Tab` moves to the first enabled destination in the panel.
- `Escape` closes the menu and returns focus to the trigger.
- Activating an enabled destination closes the menu before navigation.
- Pointer activation outside the compact menu closes it without triggering an underlying control.
- Moving to `lg` or wider while the compact menu is open closes it and restores the desktop-only state.
- Hidden/closed menu content is not focusable and is not exposed as active navigation to assistive technology.
- Opening or closing the menu must not move page content horizontally or create document-level overflow.

### FR-5 — Footer coming-soon status

- Preserve `Notícias`, `Eventos`, and `Vagas` in the footer's `Conteúdo` column and in their current order after `Episódios`.
- Render the exact visible status copy `Em breve` adjacent to each of the three deferred labels.
- Each label/status pair remains non-interactive, has no `href`, and communicates the combined meaning (for example, `Notícias — Em breve`) to assistive technology.
- `Episódios` and all unrelated footer content keep their existing behavior and copy.
- The status treatment uses existing semantic tokens. A new token may be introduced only if the approved Pencil design cannot be represented by the current token set.

### FR-6 — Theme and visual boundaries

- Preserve both shared shell variants: beta follows the root theme and fixed-dark remains dark.
- Navigation geometry, item order, interaction state, and responsive behavior are identical across theme variants.
- Hover, focus-visible, open, active, and disabled states meet the existing semantic token rules in light and dark themes.
- No raw colors or one-off visual values may be added to header/footer components.
- Desktop changes are limited to removing the three deferred top-menu items; existing header height, wordmark, search, theme, and subscription contracts remain unchanged.

### FR-7 — Architecture

- Keep route files under `apps/web/src/app` unchanged unless composition wiring is strictly required; no navigation state belongs in a route file.
- Shared header/footer and navigation UI remain under the existing layout component boundary.
- Isolate only the compact menu interaction behind a client boundary; do not convert unrelated page or shell composition to client rendering.
- Reuse the repository's existing `Button` and accessible overlay/menu primitives when they satisfy the approved design and behavior.
- Do not add direct `fetch`, API integration, or new route contracts for this feature.

## 6. Responsive contract

| Viewport | Expected navigation behavior |
| --- | --- |
| Desktop `1440x1200` | Horizontal four-item navigation is visible; compact trigger/menu is not visible. |
| Breakpoint boundary `1024x768` | `lg` desktop state is active with no duplicate compact trigger. |
| Tablet `768x1024` | Horizontal navigation is absent; the three-line trigger is visible and opens the compact menu. |
| Mobile `390x844` | Same compact behavior; wordmark and all variant-specific header actions fit without clipping or overflow. |

- Validate one additional viewport immediately below `lg` to catch duplicate/missing states.
- The design phase may add a narrower safety viewport if the approved header action composition requires it.
- Pencil currently supplies no tablet/mobile compact-menu artboard. Responsive behavior is structural until new Pencil nodes are authored and inspected; no mobile pixel-parity claim is allowed before then.

## 7. Accessibility requirements

- Retain a single `nav` landmark named `Navegação principal` for the active viewport variant.
- The three-line icon never substitutes for the button's accessible name.
- Trigger state is programmatically exposed with `aria-expanded` and `aria-controls`.
- Enabled destinations use native links; disabled destinations are not links and cannot receive accidental activation.
- Keyboard order follows visual order and never enters closed menu content.
- `Escape`, focus return, outside dismissal, and breakpoint dismissal are covered by interaction tests.
- Focus is never trapped after the menu closes.
- Motion honors `prefers-reduced-motion`.
- Visible `Em breve` copy is not conveyed by color alone.

## 8. Acceptance criteria

### Navigation content

- **AC-NAV-01:** Desktop primary navigation contains exactly `Início`, `Episódios`, `Time`, and `Sobre`, in that order.
- **AC-NAV-02:** Compact primary navigation contains the same four items exactly once and in the same order.
- **AC-NAV-03:** `Notícias`, `Eventos`, and `Vagas` do not exist in either primary-navigation DOM subtree.
- **AC-NAV-04:** `Início` and `Episódios` retain their current destinations; `Time` and `Sobre` remain inert with no `href`.

### Responsive behavior

- **AC-RESP-01:** At `1440x1200` and `1024x768`, the horizontal navigation is available and the compact trigger is not visible.
- **AC-RESP-02:** At `768x1024` and `390x844`, the three-line trigger is visible and operable while the horizontal navigation is absent.
- **AC-RESP-03:** A viewport immediately below `lg` has exactly one visible primary-navigation entry point.
- **AC-RESP-04:** Header and open-menu states produce no document-level horizontal overflow at any required viewport.

### Interaction and accessibility

- **AC-A11Y-01:** The closed trigger is announced as `Abrir menu principal`, exposes `aria-expanded="false"`, and controls the compact menu ID.
- **AC-A11Y-02:** Pointer and keyboard activation open the menu, update the accessible state/name, and expose the four canonical items.
- **AC-A11Y-03:** `Escape` closes the menu and returns focus to the trigger; outside activation and transition to desktop also close it.
- **AC-A11Y-04:** Closed menu content is neither keyboard-focusable nor presented as an active navigation region.
- **AC-A11Y-05:** All interactive controls retain visible focus and at least `40x40` targets.

### Footer

- **AC-FOOT-01:** The `Conteúdo` column remains ordered `Episódios`, `Notícias`, `Eventos`, `Vagas`.
- **AC-FOOT-02:** `Notícias`, `Eventos`, and `Vagas` each have an adjacent visible `Em breve` status.
- **AC-FOOT-03:** The three deferred label/status pairs have no `href`, remain inert, and communicate their unavailable status without relying on color.
- **AC-FOOT-04:** No unrelated footer copy, control, ordering, or theme behavior changes.

### Architecture and quality

- **AC-ARCH-01:** Only compact interaction is client-side; route and unrelated shared-shell components remain server-first.
- **AC-ARCH-02:** No direct `fetch`, raw color, or unrelated route work is introduced.
- **AC-QA-01:** Focused navigation/footer tests, lint, typecheck, full web tests, build, and `git diff --check` pass.
- **AC-QA-02:** Browser validation covers both header variants, light/dark beta modes, keyboard dismissal, breakpoint transitions, and all required viewports.

## 9. Source-of-truth and supersession

- This spec supersedes `.specs/web/foundation/ux-design-reference.md` section 3.1 only for the primary-navigation item list and below-`lg` behavior.
- It supersedes the existing source-test expectation that tablet/mobile navigation stays hidden without a replacement.
- The existing desktop header node `m9zV96` and footer node `LSgoB` remain authoritative for unaffected anatomy.
- Before implementation, the design phase must add or identify Pencil nodes for:
  - compact header with the closed three-line trigger;
  - compact header/menu open state;
  - beta light and dark treatments;
  - fixed-dark treatment;
  - footer `Em breve` status treatment.
- The resulting `design.md` must use `.specs/web/page-contract-template.md`, record exact node IDs, geometry, tokens, component anatomy, open-state icon, layering, and focus behavior.

## 10. Validation evidence required in the debug phase

- Pencil inspection evidence from `get_editor_state`, `batch_get`, and screenshots for every new/updated node.
- Runtime screenshots for desktop, breakpoint boundary, tablet, and mobile in required theme/header variants.
- DOM assertions for exact primary-navigation contents and footer status contents.
- Keyboard evidence for open, traversal, activation, `Escape`, focus return, and closed-content exclusion.
- Browser evidence for resize across `lg` while open and for absence of horizontal overflow.
- Automated lint, typecheck, focused tests, full web tests, build, and `git diff --check` results.

## 11. Downstream lifecycle deliverables

This specification does not authorize implementation by itself. After approval:

1. **Planning/design:** create `design.md`, update the Pencil source/reference, and create `tasks.md` (plus `plan.md` if recording component-by-component visual differences).
2. **Implementation:** change the canonical nav model, compact interaction, header composition, footer status presentation, and focused tests according to the approved artifacts.
3. **Debug/validation:** capture the evidence listed above and record results in `validation.md`.
4. **Documentation:** align the spec index and any affected foundation/design reference with delivered behavior, then mark lifecycle artifacts `Implemented` only after validation passes.
