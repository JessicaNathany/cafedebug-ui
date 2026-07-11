# Design: Login Page Refactor

**Status:** Draft  
**Spec:** `spec.md` (same folder)  
**Design System:** `.specs/admin/DESIGN_SYSTEM.md`  
**Visual Reference:** `.specs/admin/stitch/cafedebug-admin/code/themes/dark/login.html`

---

## 1. Page Structure

```
<html data-theme="light|dark">
  <body>
    ┌─ (auth)/layout.tsx ──────────────────────────┐
    │  <AuthPageShell>                              │
    │  ┌─ Top Bar (sticky, h-16) ─────────────────┐│
    │  │  [Café Debug] brand name          [icons] ││
    │  └──────────────────────────────────────────┘│
    │                                               │
    │  <main> (flex-grow, center, relative)         │
    │    [bg orb — primary-container/60 blur — top-left]      │
    │    [bg orb — primary-container/30 blur — bottom-right]  │
    │                                               │
    │    ┌─ login/page.tsx ──────────────────────┐  │
    │    │  <LoginForm />                        │  │
    │    └───────────────────────────────────────┘  │
    │                                               │
    │  <footer> (links + copyright)                 │
    └───────────────────────────────────────────────┘
  </body>
</html>
```

---

## 2. Component Breakdown

### 2.1 `(auth)/layout.tsx` — Auth Page Shell (Server Component)

**Top bar:**
- Height: `h-16`
- Background: `bg-surface-container-lowest/50 backdrop-blur-md`
- Border bottom: `border-b border-outline-variant`
- Left: `<span>` "Café Debug" — `font-display font-bold text-xl tracking-tight text-on-surface`
- Right: icon slot area (reserved for future theme toggle + help; render nothing in V1)
- Full width, sticky top-0, z-20

**Background orbs:**
- Rendered inside `<main>` as `absolute inset-0 z-0 overflow-hidden`
- Orb 1 (top-left): `absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary-container/60 rounded-full blur-3xl`
- Orb 2 (bottom-right): `absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-primary-container/30 rounded-full blur-3xl`

**Main area:**
- `flex-grow flex items-center justify-center p-6 relative`
- Children render above orbs via `relative z-10`

**Page footer:**
- Links row: Privacy Policy · Terms of Service · Support (each `text-xs text-on-surface-variant hover:text-primary underline underline-offset-4 transition-colors`)
- Copyright: `text-xs text-on-surface-variant` — "© 2025 Café Debug Admin. All rights reserved."
- Layout: `flex flex-col items-center gap-4 py-8`

---

### 2.2 `features/auth/components/login-form.tsx` — Login Card (Client Component)

**Card container:**
- `w-full max-w-[440px] bg-surface-container-lowest rounded-xl border border-outline-variant shadow-float p-8 md:p-10 relative z-10`

**Logo block (top of card):**
- Wrapper: `flex flex-col items-center mb-8`
- Icon box: `w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4`
  - Shadow: `shadow-lg` with primary glow: not possible with pure tokens; use `shadow-float` as fallback
  - Icon: Material Symbol "mic" (filled), `text-on-primary text-2xl`
  - Note: Material Symbols must be loaded via `next/font` or a `<link>` in layout
- `<h1>` "Café Debug": `font-display text-2xl font-extrabold tracking-tight text-on-surface`
- `<p>` "Admin Console Login": `text-body-sm text-on-surface-variant mt-1`

**Form fields — shared label style:**
- `block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2`

**Email field:**
- Wrapper: `relative`
- Leading icon: `absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]` — Material Symbol "mail"
- Input: `h-11 w-full pl-10 pr-4 rounded-lg bg-surface-container-highest text-on-surface text-sm outline-none ring-1 ring-outline-variant focus:ring-2 focus:ring-focus-ring placeholder:text-on-surface-variant`

**Password field:**
- Wrapper: `relative`
- Leading icon: `absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]` — Material Symbol "lock"
- Input: `h-11 w-full pl-10 pr-12 rounded-lg bg-surface-container-highest text-on-surface text-sm outline-none ring-1 ring-outline-variant focus:ring-2 focus:ring-focus-ring placeholder:text-on-surface-variant`
  - `type` controlled by `showPassword` state: `"password"` | `"text"`
- Trailing toggle: `absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors`
  - Icon: "visibility" (show) / "visibility_off" (hide)
  - `aria-label`: "Show password" / "Hide password"
  - `type="button"` (prevent form submit)

**Submit button:**
- `w-full h-11 rounded-lg font-bold text-sm text-on-primary transition-all`
- Background: `bg-gradient-to-br from-primary to-primary-strong` (Design System CTA variant)
- Hover: `hover:opacity-90`
- Active: `active:scale-[0.98]`
- Focus: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2`
- Disabled: `disabled:cursor-not-allowed disabled:opacity-60`

**Security note (card footer):**
- Separator: `border-t border-outline-variant mt-8 pt-6`
- Text: `text-xs text-on-surface-variant text-center`
- Content: "Secure access for authorized administrators only."

---

## 3. State Management

| State | Owner | Purpose |
|---|---|---|
| `showPassword` (`useState<boolean>`) | `login-form.tsx` | Controls password input `type` |
| `form`, `formError`, `onSubmit` | `useLogin` hook (existing) | Form state, submission, errors |
| `initialStatusMessage` | `resolveLoginStatusMessage` + `useSearchParams` (existing) | Session redirect messages |

No new hooks or services are required.

---

## 4. Icon Strategy

**Material Symbols Outlined** is used for icons (consistent with Stitch reference).

- The font must be loaded in `(auth)/layout.tsx` via `<link>` in `<head>`, or globally if already present.
- Check if `apps/admin/src/app/layout.tsx` (root) already loads it. If not, add to auth layout.
- Icons rendered as: `<span className="material-symbols-outlined ...">icon_name</span>`
- Set `font-variation-settings: 'FILL' 1` inline for filled variants (e.g., mic icon)

---

## 5. Token Reference (All used in this feature)

| Token | Tailwind Class | Usage |
|---|---|---|
| `--color-surface` | `bg-surface` | Page body background |
| `--color-surface-container-lowest` | `bg-surface-container-lowest` | Card + top bar background |
| `--color-on-surface` | `text-on-surface` | Brand name, heading, input text |
| `--color-on-surface-variant` | `text-on-surface-variant` | Subtitle, label, icons, footer |
| `--color-primary-container` | `bg-primary-container` | Background orbs |
| `--color-primary` | `bg-primary`, `text-primary` | Logo icon box, CTA button |
| `--color-primary-strong` | `to-primary-strong` | CTA gradient end stop |
| `--color-on-primary` | `text-on-primary` | Icon and button text |
| `--color-outline-variant` | `ring-outline-variant`, `border-outline-variant` | Input ring, card border, divider |
| `--color-focus-ring` | `ring-focus-ring` | Input and button focus ring |
| `--shadow-float` | `shadow-float` | Card elevation |
| `--color-danger` | `text-danger`, `border-danger`, `bg-danger/10` | Error states (existing) |

---

## 6. Responsive Behavior

- Card: `w-full max-w-[440px]` — fills narrow screens, capped on wider viewports
- Card padding: `p-8 md:p-10` — tighter on mobile
- Orbs: remain consistent across breakpoints (decorative only)
- Top bar: full-width, no breakpoint changes needed

---

## 7. Accessibility Checklist

- [ ] All `<input>` elements have explicit `id` + `<label htmlFor>`
- [ ] Visibility toggle has `aria-label` that updates with state
- [ ] Password field error linked via `aria-describedby`
- [ ] Email field error linked via `aria-describedby`
- [ ] Submit button `aria-busy={isSubmitting}`
- [ ] Form error alert uses `role="alert"`
- [ ] Status message uses `role="status"`
- [ ] Focus ring visible on all interactive elements
