# Spec: Login Page Refactor (Stitch Theme Alignment)

**Status:** Implemented  
**Scope:** `apps/admin` — auth login feature  
**Reference (dark):** `.specs/admin/stitch/cafedebug-admin/code/themes/dark/login.html`  
**Reference (light):** `.specs/admin/stitch/cafedebug-admin/code/themes/light/login.html`  
**Design Authority:** `.specs/admin/DESIGN_SYSTEM.md`

---

## 1. Problem Statement

The current login page (`/login`) is a minimal placeholder card with basic inputs and no visual identity. The Stitch design specification defines a richer, brand-aligned full-page login experience that includes:

- A top navigation bar with the brand name
- Decorative background ambient orbs
- A centered card with a branded logo block
- Inputs with leading icons and a password visibility toggle
- A security footer inside the card
- A page-level footer with legal/support links

The goal is to implement this layout while:
1. Translating all visual decisions from Stitch's raw hex/zinc tokens to the project's semantic token system
2. Preserving all existing functional logic (React Hook Form, Zod validation, session handling)
3. Maintaining architecture compliance (features/, app/, lib/ separation)

---

## 2. Scope

### In scope

| Area | Detail |
|---|---|
| Auth page chrome | New `(auth)/layout.tsx`: top bar + background orbs + page footer |
| Login card — brand block | Logo icon (mic symbol) + "Café Debug" heading + "Admin Console Login" subtitle |
| Login card — email field | Input with leading mail icon |
| Login card — password field | Input with leading lock icon + password visibility toggle button |
| Login card — security note | "Secure access for authorized administrators only." text below form |
| Page footer | Privacy Policy · Terms of Service · Support links + copyright |
| Login page layout | `(auth)/login/page.tsx` simplified to render just `<LoginForm />` inside layout |

### Out of scope (V1)

| Area | Reason |
|---|---|
| "Remember me" checkbox | No backend session persistence support yet |
| "Forgot Password?" link | No backend reset flow yet — placeholder comment only |
| Theme toggle (dark/light) | Global theme control is a separate feature |
| Help button action | No help system in V1 |

---

## 3. Functional Requirements

### FR-1: Auth Layout Shell
- A new `(auth)/layout.tsx` must render:
  - A sticky top bar (height: 64px) with the "Café Debug" brand name on the left
  - Background ambient orbs: two blurred circles using primary with low opacity
  - A page footer with three links (Privacy Policy, Terms of Service, Support) and a copyright line
- This layout wraps all auth routes (currently only `/login`)

### FR-2: Login Card — Brand Block
- The card must display, above the form:
  - A 48×48 icon box with `--color-primary` background, `--radius-xl` radius, and a filled mic symbol (white)
  - An `<h1>` reading "Café Debug" (display font, 2xl, extrabold)
  - A subtitle `<p>` reading "Admin Console Login" (body-sm, on-surface-variant)

### FR-3: Email Input with Icon
- The email `<input>` must have a leading mail icon (left-padded)
- The icon uses `on-surface-variant` color
- The label must read "Email Address" (uppercase, xs, semibold, tracking-wider)

### FR-4: Password Input with Icon and Visibility Toggle
- The password `<input>` must have a leading lock icon and a trailing visibility toggle button
- The toggle button switches `type` between `"password"` and `"text"` (client state)
- Icon uses `on-surface-variant` color
- The label must read "Password" (same label style as FR-3)

### FR-5: Submit Button
- Full-width, height 44px (h-11)
- Background: `linear-gradient(135deg, var(--color-primary), var(--color-primary-strong))` (per Design System button primary variant)
- Text: "Sign In" (bold), `on-primary`
- Loading state: "Signing in..." text, disabled, reduced opacity
- Focus: 2px ring with `--color-focus-ring`, offset 2px

### FR-6: Security Note (Card Footer)
- Below the form, above the card border:
  - A horizontal divider (`--color-outline-variant`)
  - Text: "Secure access for authorized administrators only." (label-sm, on-surface-variant, centered)

### FR-7: Error and Status Messages
- Global form error: danger-bordered alert box (already implemented, retain)
- Field-level errors: `text-danger`, `text-xs` below the field (already implemented, retain)
- Session status messages: tonal info box (already implemented, retain)

### FR-8: Accessibility
- All inputs have `id` and `<label for>` association (explicit `htmlFor`)
- Visibility toggle has `aria-label` ("Show password" / "Hide password")
- Submit button uses `type="submit"`
- Focus styles are visible on all interactive elements
- Error messages are linked via `aria-describedby`

---

## 4. Non-Functional Requirements

- No hardcoded hex colors — all values via design tokens
- No business logic in `page.tsx` or `layout.tsx`
- Auth layout must be a Server Component
- Login form (client interactivity) remains a Client Component
- Password visibility toggle state is isolated inside `login-form.tsx`

---

## 5. Token Mapping (Stitch → Semantic, Both Themes)

All Stitch raw values are translated to semantic tokens. No hex values allowed in production code.
Because the implementation uses only semantic tokens, **light/dark parity is automatic** — no conditional theming logic is needed in components.

| Stitch (dark HTML) | Stitch (light HTML) | Semantic Token | Dark value | Light value |
|---|---|---|---|---|
| `#0F0F11` body bg | `bg-zinc-50` body bg | `--color-surface` | `#1d100c` | `#f8f4f2` |
| `#18181B` card/header bg | `bg-white` card bg | `--color-surface-container-lowest` | `#231410` | `#ffffff` |
| `border-zinc-800` | `border-zinc-200` | `--color-outline-variant` | `rgb(244 233 228 / 18%)` | `rgb(31 26 24 / 16%)` |
| `#FF6B35` primary | `#ea580c` primary | `--color-primary` | `#ff6b35` | `#ff6b35` |
| `text-zinc-100` | `text-zinc-900` | `--color-on-surface` | `#f4e9e4` | `#1f1a18` |
| `text-zinc-400/500` | `text-zinc-500` | `--color-on-surface-variant` | `#c5b2aa` | `#6a5d57` |
| `#FF6B35/10` orb | `bg-orange-100/50` orb | `bg-primary/10` | via opacity | via opacity |
| `focus:ring-[#FF6B35]/20` | `focus:ring-orange-500/20` | `--color-focus-ring` | `rgb(255 107 53 / 50%)` | `rgb(255 107 53 / 45%)` |

> **Note:** Café Debug uses warm tonal surfaces instead of zinc. The semantic token values differ from Stitch's zinc-based prototype; DESIGN_SYSTEM.md resolved this in favor of warm tones for both themes. The Stitch light and dark prototypes are visual direction references only — not pixel-exact targets.

### Theme parity guarantee

The implementation requires **zero conditional theming code** in components. All semantic tokens resolve automatically when `data-theme` changes on `<html>`. This is enforced by:
- `packages/design-tokens/styles.css` defining `:root[data-theme="light"]` and `:root[data-theme="dark"]`
- `apps/admin/tailwind.config.ts` mapping all colors to `var(--color-*)` only

---

## 6. Files Affected

| File | Change |
|---|---|
| `apps/admin/src/app/(auth)/layout.tsx` | **CREATE** — Auth page chrome (top bar, background, footer) |
| `apps/admin/src/app/(auth)/login/page.tsx` | **SIMPLIFY** — Remove direct layout wrapping; layout handled by `(auth)/layout.tsx` |
| `apps/admin/src/features/auth/components/login-form.tsx` | **UPDATE** — Add logo block, input icons, visibility toggle, security note |

---

## 7. Out-of-Scope Notes

- `"Remember me"` checkbox: excluded; no backend support. Future spec required.
- `"Forgot Password?"` link: excluded; no backend reset flow. Add a `{/* TODO: Forgot Password — requires backend reset flow */}` comment at the appropriate location.
- Theme toggle: separate feature; header renders a placeholder icon slot only.
