# GitHub Copilot Instructions

## Quick Orientation

Before generating code, use these documents in this order:

1. [AGENTS.md](../AGENTS.md) for governance, lifecycle, and handoff policy.
2. [README.md](../README.md) for product goals, architecture decisions, and stack truth.
3. [.specs/README.md](../.specs/README.md) for spec-driven workflow.
4. This file for executable coding constraints and anti-patterns.

For strategic context while applying these rules:

- Monorepo and platform decisions: [README.md](../README.md#monorepo-target-structure)
- API boundary strategy: [README.md](../README.md#content-and-api-strategy)
- Design-system strategy: [README.md](../README.md#design-system-rules)

- This repository is a monorepo with `apps/web`, `apps/admin`, `services/api`, and shared `packages/*`.
- Use Next.js App Router and TypeScript for frontend work.
- Default to Server Components in `apps/web`.
- Prefer `TanStack Query` for async state in `apps/admin`.
- Use generated API contracts from the backend OpenAPI schema.
- Do not hardcode colors, logos, or API base URLs in components.
- Use the design tokens from `packages/design-tokens`.
- Update the spec when behavior changes.


# 🧠 Architecture Rules (IMPORTANT)

You are working inside the Cafe Debug monorepo.

Before generating ANY code, you MUST follow these architectural rules strictly.

---

## 🧱 1. Core Principle

This project uses a **feature-based architecture** with strict separation of concerns:

- `app/` → routing ONLY (Next.js App Router)
- `features/` → ALL business logic
- `lib/` → infrastructure (API client, auth helpers, config)
- `packages/*` → shared cross-app modules (ui, api-client, tokens)

NEVER mix responsibilities.

---

## 📁 2. Folder Responsibilities

This section is the canonical folder rule for implementation work.

### ✅ `src/app/`

- Contains ONLY:
  - `page.tsx`
  - `layout.tsx`
  - `route.ts`
- NO business logic
- NO direct API calls
- NO validation schemas

---

### ✅ `src/features/<domain>/`

Each domain (auth, episodes, dashboard, etc.) MUST follow:

```
features/<domain>/
  components/
  hooks/
  services/
  server/
  schemas/
  types/
```

---

### Responsibilities per layer:

#### `components/`
- UI components specific to the feature
- Can use hooks
- ❌ NO direct API calls

#### `hooks/`
- React hooks (TanStack Query, state, orchestration)
- Calls services

#### `services/`
- Client-side API calls
- Uses shared API client

#### `server/`
- Server-only logic (used by route handlers)
- Handles cookies, auth, backend orchestration

#### `schemas/`
- Zod validation schemas

#### `types/`
- Domain types

---

### ✅ `src/lib/`

- Shared infrastructure only:
  - API client
  - auth/session helpers
  - config
  - utilities

---

## 🔌 3. API Routes (CRITICAL RULE)

All API routes in `app/api/*` MUST be THIN.

### ❌ NEVER:
- Write business logic inside `route.ts`

### ✅ ALWAYS:

```ts
import { handler } from "@/features/<domain>/server/<name>.handler";

export async function POST(req: Request) {
  return handler(req);
}
```

---

## 🧠 4. Data Fetching Rules

### ❌ NEVER:
- Call `fetch()` inside components or pages directly

### ✅ ALWAYS:
- Use services inside features
- Use hooks (TanStack Query) for async state

---

## 🧾 5. Forms

- Use `React Hook Form`
- Use `Zod` schemas from `features/<domain>/schemas`
- Validation MUST NOT live inside components

---

## 🎨 6. Design System Rules

- NEVER use hardcoded colors
- ALWAYS use tokens from `packages/design-tokens`
- Use shared components from `packages/ui`

---

🌗 6.1 Theme System (Light / Dark) — MANDATORY

Core Principle

All UI must support light and dark themes with full parity, using design tokens only.

---

Token Rules
	•	❌ Never use raw colors (#fff, #000, etc.)
	•	✅ Always use semantic tokens (surface, primary, etc.)

---

Light/Dark Parity

Every UI MUST:
	•	Keep identical layout
	•	Preserve hierarchy and contrast
	•	Preserve interaction states

---

Surface Layer Model

Always use:
	•	surface
	•	surface-container-*
	•	elevated

Never simulate depth with arbitrary colors.

---

Theme Switching
	•	Support: light, dark, system
	•	Must:
	•	Apply instantly
	•	Persist (cookie/storage)
	•	Be server-readable (avoid hydration issues)

---

Tailwind Rules

Tailwind must map ONLY to CSS variables:

colors: {
  surface: "var(--color-surface)",
  primary: "var(--color-primary)",
}


---

Component Requirements

All components must:
	•	Be theme-aware by default
	•	Support all states in both themes:
	•	hover
	•	focus
	•	disabled
	•	error

---

Accent Usage
	•	primary → actions & focus
	•	tertiary → analytics only
	•	❌ Never use accents as large backgrounds

---

No-Line Rule
	•	❌ Avoid borders
	•	✅ Use tonal layering
	•	Use outline-variant only when necessary

---

Enforcement Rule

If code violates theme rules:

👉 Refactor to use tokens
👉 Do not accept hardcoded styles

---

Final Rule

If it does not work correctly in both light and dark, it is not done.

---

## 🔐 7. Auth Rules

- Auth logic lives in `features/auth`
- Cookie/session logic lives in:
  - `features/auth/server`
  - or `lib/auth`

---

## 🧪 8. Code Generation Rules

When generating code:

1. First determine the **feature/domain**
2. Place files in correct structure
3. Split logic correctly:
   - UI → components
   - logic → hooks/services
   - server → handlers

---

## 🧩 9. Example: Login Feature

Correct structure:

```
features/auth/
  components/login-form.tsx
  hooks/use-login.ts
  services/login.service.ts
  server/login.handler.ts
  schemas/login.schema.ts
```

### `app/(auth)/login/page.tsx`

```tsx
import { LoginForm } from "@/features/auth/components/login-form";

export default function Page() {
  return <LoginForm />;
}
```

---

## 🚫 10. Anti-Patterns (STRICTLY FORBIDDEN)

- ❌ Business logic inside `page.tsx`
- ❌ Fetch inside components
- ❌ Huge `route.ts` files
- ❌ Global "utils" dumping logic
- ❌ Duplicated API calls across files
- ❌ Hardcoded styles/colors

---

## ✅ 11. Expected Output Style

- Small, composable files
- Clear separation of concerns
- Strong typing
- Scalable structure

---

## ⚠️ FINAL RULE

If a request would break this architecture:
👉 DO NOT follow the request blindly  
👉 Adapt it to fit this architecture  

Always prioritize consistency over convenience.
