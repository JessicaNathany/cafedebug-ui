# Tasks: Login Page Refactor

**Status:** Ready for implementation  
**Spec:** `spec.md`  
**Design:** `design.md`  
**Assigned to:** Frontend Blacksmith

---

## Prerequisites

- [ ] Spec reviewed and approved by Architect Guardian
- [ ] Design reviewed and approved by Architect Guardian
- [ ] `packages/design-tokens` has all required tokens ✅ (completed in previous refactor)
- [ ] `apps/admin/tailwind.config.ts` maps all required tokens ✅ (completed in previous refactor)

---

## Phase 1 — Auth Layout Shell

### Task 1.1 — Create `(auth)/layout.tsx`

**File:** `apps/admin/src/app/(auth)/layout.tsx`  
**Type:** Server Component (no `"use client"`)  
**Creates:** New file

**Deliverables:**
1. Top bar: sticky, `h-16`, brand name "Café Debug" left-aligned, icon slot on right (empty in V1)
2. `<main>` wrapper with `flex-grow flex items-center justify-center p-6 relative`
3. Two background orbs inside main as absolute decorative elements
4. Page footer: three links (Privacy Policy, Terms of Service, Support) + copyright text
5. `{children}` rendered inside main, above orbs via `relative z-10`

**Architecture rules:**
- Must be a Server Component
- No `useRouter`, no `useState`, no event handlers
- Background orbs are decorative `<div>` elements only
- Children prop typed as `ReactNode`

**Token compliance:**
- Top bar: `bg-surface-container-lowest/50 backdrop-blur-md border-b border-outline-variant`
- Orb 1: `bg-primary/10 rounded-full blur-[120px]`
- Orb 2: `bg-primary/5 rounded-full blur-[120px]`
- Footer links: `text-on-surface-variant hover:text-primary`
- No raw hex values

---

### Task 1.2 — Update `(auth)/login/page.tsx`

**File:** `apps/admin/src/app/(auth)/login/page.tsx`  
**Type:** Server Component  
**Change:** Remove the full-page `<main>` wrapper (now handled by layout)

**Before:**
```tsx
<main className="flex min-h-screen items-center justify-center px-4 py-10">
  <LoginForm />
</main>
```

**After:**
```tsx
export default function LoginPage() {
  return <LoginForm />;
}
```

> The layout now handles the full-page structure. The page renders only the form.

---

## Phase 2 — Login Form Refactor

### Task 2.1 — Add logo block to `login-form.tsx`

**File:** `apps/admin/src/features/auth/components/login-form.tsx`  
**Change:** Replace the `<header>` with a centered logo block

**Deliverables:**
1. `<div className="flex flex-col items-center mb-8">`
2. Icon box: `w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4 shadow-float`
   - Material Symbol "mic" with `FILL=1`, color `text-on-primary`, size `text-2xl`
3. `<h1>` "Café Debug": `font-display text-2xl font-extrabold tracking-tight text-on-surface`
4. `<p>` "Admin Console Login": `text-sm text-on-surface-variant mt-1`

**Note:** Material Symbols font must be available. Verify it's loaded in a parent layout or add to `(auth)/layout.tsx` via `<link>`.

---

### Task 2.2 — Update email field with leading icon

**File:** `apps/admin/src/features/auth/components/login-form.tsx`  
**Change:** Wrap email `<input>` in a relative container and add leading mail icon

**Deliverables:**
1. Update label text from "Email" → "Email Address" with uppercase tracking style
2. Wrap input in `<div className="relative">`
3. Add `<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]" aria-hidden="true">mail</span>`
4. Input: add `pl-10`, retain all existing ring/focus/disabled classes
5. Link error message via `aria-describedby="email-error"` on input; add `id="email-error"` to error `<p>`

---

### Task 2.3 — Update password field with icon + visibility toggle

**File:** `apps/admin/src/features/auth/components/login-form.tsx`  
**Change:** Add leading lock icon, password visibility toggle, update label

**State change:**
- Add `const [showPassword, setShowPassword] = useState(false)` at the top of `LoginForm`

**Deliverables:**
1. Update label text from "Password" → "Password" (keep, but add uppercase tracking style matching email label)
2. Wrap input in `<div className="relative">`
3. Leading lock icon: `<span className="material-symbols-outlined absolute left-3 ..."  aria-hidden="true">lock</span>`
4. Input: `type={showPassword ? "text" : "password"}`, add `pl-10 pr-12`
5. Trailing visibility toggle:
   ```tsx
   <button
     type="button"
     className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
     onClick={() => setShowPassword(prev => !prev)}
     aria-label={showPassword ? "Hide password" : "Show password"}
   >
     <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
       {showPassword ? "visibility_off" : "visibility"}
     </span>
   </button>
   ```
6. Link error message via `aria-describedby="password-error"` on input; add `id="password-error"` to error `<p>`

---

### Task 2.4 — Update submit button style

**File:** `apps/admin/src/features/auth/components/login-form.tsx`  
**Change:** Apply gradient CTA style per Design System button primary variant

**Before:**
```tsx
className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary ..."
```

**After:**
```tsx
className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-strong font-bold text-on-primary transition-all hover:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
```

Also add `aria-busy={isSubmitting}` to the button.

---

### Task 2.5 — Add security note and card divider

**File:** `apps/admin/src/features/auth/components/login-form.tsx`  
**Change:** Add a footer section below the form with a security note

**Deliverables:**
```tsx
<div className="mt-8 border-t border-outline-variant pt-6">
  <p className="text-center text-xs text-on-surface-variant">
    Secure access for authorized administrators only.
  </p>
</div>
```

Place after the closing `</form>` tag.

---

### Task 2.6 — Add TODO for Forgot Password

**File:** `apps/admin/src/features/auth/components/login-form.tsx`  
**Change:** Add a code comment after the submit button area

```tsx
{/* TODO: Forgot Password — requires backend password reset flow (out of scope V1) */}
```

---

## Phase 3 — Validation

### Task 3.1 — Architecture compliance check

Verify:
- [ ] `(auth)/layout.tsx` has no `"use client"` and no business logic
- [ ] `login/page.tsx` has no direct layout wrappers
- [ ] `login-form.tsx` remains `"use client"` and handles all interactivity
- [ ] No hardcoded hex values in any modified file
- [ ] No hardcoded Tailwind color classes (text-zinc-*, bg-gray-*, etc.)
- [ ] All colors sourced from semantic tokens only

### Task 3.2 — Functional regression check

Verify:
- [ ] Existing form validation still works (Zod schema via React Hook Form)
- [ ] Form submission still calls `useLogin` → `onSubmit`
- [ ] `initialStatusMessage` (session redirect messages) still renders
- [ ] `formError` (global API error) still renders with correct styling
- [ ] Field-level errors still render for email and password
- [ ] Submit disables inputs and button during `isSubmitting`
- [ ] Password visibility toggle functions correctly (show/hide)

### Task 3.3 — Accessibility check

Verify:
- [ ] `<input id="email">` has `<label htmlFor="email">`
- [ ] `<input id="password">` has `<label htmlFor="password">`
- [ ] Visibility toggle button has dynamic `aria-label`
- [ ] Error messages linked via `aria-describedby`
- [ ] Submit button has `aria-busy`
- [ ] All icons have `aria-hidden="true"`
- [ ] Tab order is logical: top bar → form fields → submit button

### Task 3.4 — Dual-theme visual check

Both light and dark themes must be visually verified. Because the implementation uses only semantic tokens, no code changes are expected — this task confirms parity at runtime.

**Method:** Set `data-theme="light"` and `data-theme="dark"` on `<html>` and compare against the Stitch reference images.

**Light theme — verify against:** `.specs/admin/stitch/cafedebug-admin/images/themes/light/login.png`  
**Dark theme — verify against:** `.specs/admin/stitch/cafedebug-admin/images/themes/dark/login.png`

Checklist (repeat for each theme):
- [ ] Page background uses correct surface color (warm, not zinc)
- [ ] Card surface uses correct container-lowest color
- [ ] Input backgrounds are correct surface-container-highest
- [ ] Text on inputs and labels is legible (on-surface / on-surface-variant)
- [ ] Primary color (orange) renders correctly on icon box and button
- [ ] On-primary text (white / off-white) is legible on primary background
- [ ] Ambient orbs are visible but subtle
- [ ] Focus ring is visible on tab through the form
- [ ] Error state (danger) renders correctly in both themes
- [ ] Security note text is visible but subdued

---

## Phase 4 — Documentation

### Task 4.1 — Update spec status

Mark `spec.md` status from `Draft` → `Implemented`.

### Task 4.2 — Update `DESIGN_SYSTEM.md` if needed

If the login page introduces patterns not covered by the Design System (e.g., ambient orb decoration, auth layout shell), document them as new component contracts in `DESIGN_SYSTEM.md`.

---

## Execution Order

```
1.1 Create (auth)/layout.tsx
1.2 Update login/page.tsx
2.1 Add logo block to login-form.tsx
2.2 Email field with icon
2.3 Password field with icon + toggle
2.4 Submit button gradient
2.5 Security note
2.6 TODO comment
3.1 Architecture compliance
3.2 Functional regression
3.3 Accessibility
3.4 Dual-theme visual check (light + dark)
4.1 Update spec status
4.2 Update DESIGN_SYSTEM.md if needed
```

---

## Definition of Done

- [ ] All tasks 1.1–2.6 implemented
- [ ] All validation checks (3.1–3.4) pass
- [ ] No hardcoded colors in modified files
- [ ] Existing auth flow (login, error, redirect) still works
- [ ] Light theme visually verified against Stitch light login reference
- [ ] Dark theme visually verified against Stitch dark login reference
- [ ] Documentation updated (4.1–4.2)
