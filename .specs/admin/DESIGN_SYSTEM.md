# CafeDebug Admin Unified Design System

**Status:** Canonical specification  
**Scope:** `apps/admin`, `packages/ui`, `packages/design-tokens`  
**Supersedes for system decisions:** `.specs/admin/Design.md`, `.specs/admin/stitch/Stitch-DESIGN.md`
**Stitch Project Reference:** `projects/1651449068364997707` (CafeDebug - Admin)

---

## 1) Purpose

This document is the single source of truth for the CafeDebug admin design system.

It merges:

- Stitch's editorial identity (organic minimalism, tonal depth, expressive hierarchy)
- The production constraints and implementation consistency from `Design.md`

The output is implementation-ready for **Next.js + Tailwind**, reusable across teams, and safe for long-term scaling.

### 1.1 How to use the Stitch reference

Use the referenced Stitch project as the live visual companion to this specification.

1. When implementing new UI, check this spec first for tokens, typography, spacing, and component contracts.
2. If visual intent is unclear in code, verify in Stitch project `projects/1651449068364997707`.
3. If Stitch and this document differ, treat this document as the canonical implementation baseline and log any needed update before changing UI behavior.
4. When design changes are approved, update both the Stitch project and this file in the same delivery cycle to keep parity.
5. During review, validate three things explicitly: token usage, theme parity (light/dark), and component contract compliance.

### 1.2 Ownership and update policy

- Designers own visual exploration in Stitch.
- Engineering owns production token contracts and implementation behavior in this document.
- Any change to foundational design decisions (color roles, typography scale, spacing scale, component contracts) must include a spec update in this file.

---

## 2) Merged Design Philosophy

### 2.1 Creative direction: **Digital Curator, Operationally Grounded**

The admin should feel premium and editorial, but never ambiguous or difficult to operate.

- **Editorial hierarchy first:** typography and spacing communicate importance.
- **Organic minimalism:** fewer hard separators, more tonal grouping and breathing room.
- **Practical consistency:** predictable components, predictable states, predictable tokens.
- **System thinking:** all UI decisions map to reusable tokens and contracts.
- **Accessibility by default:** focus visibility, contrast, keyboard support, non-color-only semantics.

### 2.2 Non-negotiable rules

1. No hardcoded hex colors in feature components.
2. No direct per-screen style drift; use shared token contracts.
3. Prefer tonal layering over hard borders ("No-Line Rule"), except accessibility-critical separation.
4. Keep component APIs simple and composable over one-off visual exceptions.

---

## 3) Source Analysis Summary

### 3.1 Overlap between source systems

- Token-first implementation and semantic naming.
- Shared primitive model: buttons, inputs, cards, lists, badges.
- Dark mode support and theme-aware behavior.
- Emphasis on typography hierarchy and spacing rhythm.

### 3.2 Key conflicts and resolutions

| Conflict | Source A | Source B | Unified decision |
| --- | --- | --- | --- |
| Primary orange values | `#ff6b35` (light) / `#ff6b35` (dark) | `#ea580c` (stitch reference) | Light theme uses `#ea580c` (`--color-primary`) and `#c2410c` (`--color-primary-strong`); dark theme retains `#ff6b35` / `#f56e3d`. |
| Body font family | Plus Jakarta Sans | Liberation Sans / Cabinet Grotesk mix | Standardize body/UI to **Plus Jakarta Sans**. |
| Spacing values | Editorial token rhythm | Observed raw values incl. `18` and `25` | Normalize to Tailwind-friendly scale; deprecate `18` and `25`. |
| Boundary treatment | No-line tonal separation | Frequent bordered surfaces | Default to tonal layering; allow low-contrast outline token only when needed. |

### 3.3 Unique strengths preserved

- From Stitch: warm surfaces, Heat/Cold accents, expressive editorial tone, no-line philosophy.
- From Design.md: concrete operational component inventory, accessibility constraints, implementation pragmatism.

---

## 4) Unified Token Architecture (Single Source of Truth)

## 4.1 Token naming model

- **Foundation tokens:** raw values (`--ref-*`) used only inside token package.
- **Semantic tokens:** role-based values (`--color-*`, `--space-*`, `--radius-*`).
- **Component tokens (optional):** stable abstractions when repeated by multiple components.

Use semantic tokens in app code. Foundation tokens stay internal to `packages/design-tokens`.

## 4.2 Color system

### Semantic roles

- `surface` and `surface-container-*` define depth.
- `primary` (Heat) drives core actions and brand emphasis.
- `tertiary` (Cold) marks technical/analytical highlights.
- `auth-ambient-*` supports subtle decorative backgrounds for auth surfaces.
- `outline-variant` supports accessibility fallback separation.

### Light mode tokens

```css
:root[data-theme="light"] {
  --color-surface: #f8f4f2;
  --color-surface-container-lowest: #ffffff;
  --color-surface-container-low: #f4eeeb;
  --color-surface-container: #ede4df;
  --color-surface-container-high: #e6d9d3;
  --color-surface-container-highest: #decec7;

  --color-on-surface: #1f1a18;
  --color-on-surface-variant: #6a5d57;

  --color-primary: #ea580c;
  --color-primary-strong: #c2410c;
  --color-primary-container: #ffb59d;
  --color-on-primary: #ffffff;
  --color-on-primary-container: #3c1206;
  --color-auth-ambient-strong: #ffedd5;
  --color-auth-ambient-soft: #fff7ed;

  --color-tertiary: #59d5fb;
  --color-tertiary-container: #d8f3fb;
  --color-on-tertiary-container: #10313c;

  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-danger: #dc2626;

  --color-outline-variant: rgb(31 26 24 / 16%);
  --color-focus-ring: rgb(234 88 12 / 45%);
}
```

### Dark mode tokens

```css
:root[data-theme="dark"] {
  --color-surface: #1d100c;
  --color-surface-container-lowest: #231410;
  --color-surface-container-low: #2a1914;
  --color-surface-container: #33201a;
  --color-surface-container-high: #402923;
  --color-surface-container-highest: #4a312a;

  --color-on-surface: #f4e9e4;
  --color-on-surface-variant: #c5b2aa;

  --color-primary: #ff6b35;
  --color-primary-strong: #f56e3d;
  --color-primary-container: #5e2411;
  --color-on-primary: #fff3ee;
  --color-on-primary-container: #ffd8cb;
  --color-auth-ambient-strong: #5e2411;
  --color-auth-ambient-soft: #33201a;

  --color-tertiary: #59d5fb;
  --color-tertiary-container: #143844;
  --color-on-tertiary-container: #d1f4ff;

  --color-success: #34d399;
  --color-warning: #fbbf24;
  --color-danger: #f87171;

  --color-outline-variant: rgb(244 233 228 / 18%);
  --color-focus-ring: rgb(255 107 53 / 50%);
}
```

### Color usage policy

- Use `primary-strong` for filled CTA surfaces when higher contrast is required.
- Use `primary` for accents, active indicators, icons, and subtle emphasis.
- Use `tertiary` only for analytics/technical highlights, not as a second brand color.
- Prefer container shifts over visible lines for grouping.

## 4.3 Typography system

### Font families

- Display/headline: `Space Grotesk`
- Body/UI: `Plus Jakarta Sans`
- Monospace: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`

### Type scale tokens

| Token | Class alias | Font | Size / Line | Use |
| --- | --- | --- | --- | --- |
| `--text-display-lg` | `text-display-lg` | Space Grotesk | `3.5rem / 1.05` | Hero metrics, major impact numbers |
| `--text-display-md` | `text-display-md` | Space Grotesk | `3rem / 1.1` | High-emphasis dashboard numbers |
| `--text-headline-lg` | `text-headline-lg` | Space Grotesk | `2rem / 1.2` | Page-level headings |
| `--text-headline-md` | `text-headline-md` | Space Grotesk | `1.75rem / 1.25` | Section headers |
| `--text-headline-sm` | `text-headline-sm` | Space Grotesk | `1.25rem / 1.3` | Card section headings |
| `--text-title-md` | `text-title-md` | Plus Jakarta Sans | `1.125rem / 1.4` | Card titles, tabs |
| `--text-body-lg` | `text-body-lg` | Plus Jakarta Sans | `1rem / 1.6` | Longer body text |
| `--text-body-md` | `text-body-md` | Plus Jakarta Sans | `0.875rem / 1.5` | Default UI text |
| `--text-body-sm` | `text-body-sm` | Plus Jakarta Sans | `0.75rem / 1.45` | Secondary metadata |
| `--text-label-sm` | `text-label-sm` | Plus Jakarta Sans | `0.6875rem / 1.4` | Labels, captions, chips |

### Typography behavior

- Overline style allowed for editorial sections: all-caps with `0.1em` tracking.
- Preserve high contrast in scale before increasing visual decoration.
- Do not mix alternate body fonts in production admin UI.

## 4.4 Spacing scale

Use a 4px-rooted scale with selected half steps for UI density.

| Token | Value | Tailwind key | Notes |
| --- | --- | --- | --- |
| `--space-1` | `0.25rem` (4px) | `1` | micro-gap |
| `--space-1-5` | `0.375rem` (6px) | `1.5` | compact controls |
| `--space-2` | `0.5rem` (8px) | `2` | base small gap |
| `--space-2-5` | `0.625rem` (10px) | `2.5` | form rhythm |
| `--space-3` | `0.75rem` (12px) | `3` | control internals |
| `--space-4` | `1rem` (16px) | `4` | default block spacing |
| `--space-5` | `1.25rem` (20px) | `5` | medium section gap |
| `--space-6` | `1.5rem` (24px) | `6` | card and list spacing |
| `--space-8` | `2rem` (32px) | `8` | major section spacing |
| `--space-10` | `2.5rem` (40px) | `10` | large region spacing |
| `--space-12` | `3rem` (48px) | `12` | page rhythm |
| `--space-14` | `3.5rem` (56px) | `14` | global gutters |

### Spacing normalization rules

- Legacy `18px` is deprecated; map to `16px` (`space-4`) or `20px` (`space-5`) by context.
- Legacy `25px` is deprecated; map to `24px` (`space-6`) or `32px` (`space-8`) by context.

## 4.5 Radius and elevation

```css
:root {
  --radius-sm: 0.25rem;   /* 4px */
  --radius-md: 0.375rem;  /* 6px */
  --radius-lg: 0.5rem;    /* 8px */
  --radius-xl: 1rem;      /* 16px */
  --radius-full: 9999px;

  --shadow-ambient: 0 8px 30px rgb(0 0 0 / 4%);
  --shadow-float: 0 12px 32px rgb(31 26 24 / 8%);
}
```

Use shadows for floating layers only. Prefer tonal layering for base composition.

---

## 5) Component Contracts

## 5.1 Buttons

### Button Variants

| Variant | Surface | Text | Border | Intent |
| --- | --- | --- | --- | --- |
| `primary` | `linear-gradient(135deg, var(--color-primary), var(--color-primary-strong))` | `--color-on-primary` | none | Main CTA |
| `secondary` | `--color-surface-container-high` | `--color-on-surface` | none | Standard action |
| `tertiary` | transparent | `--color-primary` | none | Low-emphasis action |
| `danger` | `--color-danger` | `#fff` | none | Destructive action |

### States

- **hover:** shift to next container tier or stronger gradient stop.
- **active/pressed:** `transform: scale(0.98)`.
- **focus-visible:** `2px` ring with `--color-focus-ring`, offset `2px`.
- **disabled:** `opacity: 0.5`, remove pointer interactions.

## 5.2 Inputs

### Input Variants

- Text input
- Textarea
- Select/combobox input shell

### Input Contract

- Surface: `--color-surface-container-highest`
- Text: `--color-on-surface`
- Placeholder/helper: `--color-on-surface-variant`
- Default: no hard border
- Focus: 2px focus ring + optional ghost outline
- Error: `--color-danger` ring + error text
- Radius: `--radius-lg`
- Control height baseline: 42px

## 5.3 Cards

### Card Variants

| Variant | Background | Border | Shadow | Use |
| --- | --- | --- | --- | --- |
| `tonal` | `--color-surface-container-low` | none | none | Default grouped content |
| `elevated` | `--color-surface-container-lowest` | none | `--shadow-ambient` | Key metrics / elevated blocks |
| `interactive` | `--color-surface-container-low` | none | none | Clickable card rows |

### Behavior

- Hover on interactive cards moves to `surface-container-high`.
- No heavy card-in-card shadows.
- Add ghost outline only when required for contrast or keyboard clarity.

## 5.4 Lists

### List Contract

- Do not use hard divider lines by default.
- Separate list items with vertical spacing (`space-4` to `space-6`).
- Keep row affordances visible via tonal change on hover/focus.
- For dense data tables, use subtle container contrast and semantic status chips instead of harsh grid lines.

## 5.5 Badges

### Badge Variants

| Variant | Background | Text | Radius | Use |
| --- | --- | --- | --- | --- |
| `heat` | `--color-primary-container` | `--color-on-primary-container` | `--radius-full` | Brand/active |
| `cold` | `--color-tertiary-container` | `--color-on-tertiary-container` | `--radius-full` | Tech/analytics |
| `success` | color-mix(success, surface) | `--color-success` | `--radius-full` | Published/success |
| `neutral` | `--color-surface-container-high` | `--color-on-surface` | `--radius-full` | Default status |

### Lifecycle badge contract

Shared lifecycle badges for admin content use these semantic tokens:

| State | Surface token | Text token | Border token | Notes |
| --- | --- | --- | --- | --- |
| `draft` | `--color-status-draft-surface` | `--color-status-draft-on` | none | Active editing state |
| `scheduled` | `--color-status-scheduled-surface` | `--color-status-scheduled-on` | none | Future publish date |
| `published` | `--color-status-published-surface` | `--color-status-published-on` | none | Live content |
| `archived` | `--color-status-archived-surface` | `--color-status-archived-on` | `--color-status-archived-border` | Retired content |
| `unknown` | `--color-status-unknown-surface` | `--color-status-unknown-on` | `--color-status-unknown-border` | Unsupported API fallback |

Lifecycle badge rules:

- Geometry: full pill (`--radius-full`)
- Typography: `Space Grotesk`, `11px`, `600`
- Labels stay title-case
- Light theme `published` uses a neutral gray chip with dark text (`--color-status-published-surface: #f3f4f6`, `--color-status-published-on: #1a1a1a`) to match Stitch episodes-list references.
- `unknown` is intentionally neutral and outlined to expose contract drift without appearing destructive
- Badges must always include text labels; color alone is never sufficient.

---

## 6) Tailwind Mapping (Implementation-Ready)

```ts
// tailwind.config.ts (example)
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "var(--color-surface)",
        "surface-container-lowest": "var(--color-surface-container-lowest)",
        "surface-container-low": "var(--color-surface-container-low)",
        "surface-container": "var(--color-surface-container)",
        "surface-container-high": "var(--color-surface-container-high)",
        "surface-container-highest": "var(--color-surface-container-highest)",
        "on-surface": "var(--color-on-surface)",
        "on-surface-variant": "var(--color-on-surface-variant)",
        primary: "var(--color-primary)",
        "primary-strong": "var(--color-primary-strong)",
        "primary-container": "var(--color-primary-container)",
        "auth-ambient-strong": "var(--color-auth-ambient-strong)",
        "auth-ambient-soft": "var(--color-auth-ambient-soft)",
        "on-primary": "var(--color-on-primary)",
        "on-primary-container": "var(--color-on-primary-container)",
        tertiary: "var(--color-tertiary)",
        "tertiary-container": "var(--color-tertiary-container)",
        "on-tertiary-container": "var(--color-on-tertiary-container)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        danger: "var(--color-danger)",
        "outline-variant": "var(--color-outline-variant)",
        "focus-ring": "var(--color-focus-ring)",
      },
      spacing: {
        1: "var(--space-1)",
        1.5: "var(--space-1-5)",
        2: "var(--space-2)",
        2.5: "var(--space-2-5)",
        3: "var(--space-3)",
        4: "var(--space-4)",
        5: "var(--space-5)",
        6: "var(--space-6)",
        8: "var(--space-8)",
        10: "var(--space-10)",
        12: "var(--space-12)",
        14: "var(--space-14)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        full: "var(--radius-full)",
      },
      fontFamily: {
        display: ["Space Grotesk", "ui-sans-serif", "system-ui"],
        body: ["Plus Jakarta Sans", "ui-sans-serif", "system-ui"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      fontSize: {
        "display-lg": ["3.5rem", { lineHeight: "1.05", fontWeight: "600" }],
        "display-md": ["3rem", { lineHeight: "1.1", fontWeight: "600" }],
        "headline-lg": ["2rem", { lineHeight: "1.2", fontWeight: "600" }],
        "headline-md": ["1.75rem", { lineHeight: "1.25", fontWeight: "600" }],
        "headline-sm": ["1.25rem", { lineHeight: "1.3", fontWeight: "600" }],
        "title-md": ["1.125rem", { lineHeight: "1.4", fontWeight: "600" }],
        "body-lg": ["1rem", { lineHeight: "1.6", fontWeight: "400" }],
        "body-md": ["0.875rem", { lineHeight: "1.5", fontWeight: "400" }],
        "body-sm": ["0.75rem", { lineHeight: "1.45", fontWeight: "400" }],
        "label-sm": ["0.6875rem", { lineHeight: "1.4", fontWeight: "500" }],
      },
      boxShadow: {
        ambient: "var(--shadow-ambient)",
        float: "var(--shadow-float)",
      },
    },
  },
};

export default config;
```

---

## 7) Interaction and Accessibility Standards

- All interactive elements must expose visible `:focus-visible` style.
- Minimum target size: 40x40 where feasible.
- Contrast validation required for theme variants before release.
- Status communication must include text/icon, not color alone.
- Keyboard interaction parity required for list rows, menus, and table actions.

---

## 8) Migration Crosswalk

| Previous reference | Unified token/contract |
| --- | --- |
| `#ea580c` in scattered components | `--color-primary` (light theme) |
| `#c2410c` in scattered components | `--color-primary-strong` (light theme) |
| `#ff6b35` in scattered components | `--color-primary` (dark theme) |
| `#f56e3d` in scattered components | `--color-primary-strong` (dark theme) |
| `#fafafa` page bg | `--color-surface` |
| `#ffffff` card bg | `--color-surface-container-lowest` |
| Frequent 1px borders | tonal containers + optional `--color-outline-variant` |
| Mixed body fonts (`Liberation Sans`, `Cabinet Grotesk`) | `font-body` = Plus Jakarta Sans |
| spacing `18px` | map to `space-4` or `space-5` |
| spacing `25px` | map to `space-6` or `space-8` |

---

## 9) Implementation Checklist

1. Create/update token files in `packages/design-tokens` using this namespace.
2. Map Tailwind theme extension to semantic CSS variables only.
3. Refactor shared primitives in `packages/ui` to component contracts above.
4. Replace app-level hardcoded color/spacing/font usages in `apps/admin`.
5. Validate dark/light theme parity and focus/contrast requirements.

This document is the canonical baseline for future admin UI work.
