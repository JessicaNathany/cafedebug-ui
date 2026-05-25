# Tasks: Admin Login Feature

| Field | Value |
|---|---|
| **Status** | Draft |
| **Spec** | `.specs/admin/login/spec.md` |
| **Design** | `.specs/admin/login/design.md` |
| **Execution order** | Phases must be completed in sequence — each phase validates before the next begins |

---

## Execution Rules

- Each task specifies: **file**, **layer**, **change type**, **validation step**
- Tasks within the same phase may be executed in parallel unless noted
- Do NOT begin a phase until all tasks in the previous phase are validated
- All implementation must follow `.github/copilot-instructions.md` architecture rules

---

## Phase 1 — Contract Verification (Prerequisite)

> **Goal:** Confirm the OpenAPI generated types match the current backend response before
> touching any implementation files. No code changes in this phase.

### Task 1.1 — Verify OpenAPI Contract Currency

| Field | Value |
|---|---|
| **File** | `packages/api-client/src/` (generated types) |
| **Layer** | `api-client` |
| **Change type** | Verification only |

**Steps:**
1. Run `pnpm --filter @cafedebug/api-client run contract:check` from the repository root
2. Confirm the generated types for `POST /api/v1/admin/auth/token` include response fields:
   `accessToken`, `refreshToken.token`, `refreshToken.expirationDate`, `tokenType`, `expiresIn`
3. If types are stale, regenerate via `openapi-typescript` before proceeding

**Validation:**
- `pnpm --filter @cafedebug/api-client run contract:check` exits with code 0
- The success response type for `auth.token` POST includes all five fields listed above

### Task 1.2 — Verify Backend Set-Cookie Behaviour

| Field | Value |
|---|---|
| **File** | N/A |
| **Layer** | Backend / Infrastructure |
| **Change type** | Investigation |

**Steps:**
1. Call `POST /api/v1/admin/auth/token` against the running backend with valid credentials
2. Inspect the HTTP response headers for `Set-Cookie` entries
3. **Record the result** in this task as one of:
   - ✅ Backend emits `Set-Cookie` for `accessToken` and/or `refreshToken` → use **Strategy A**
   - ❌ Backend does NOT emit `Set-Cookie` → use **Strategy B** (JSON body extraction)

**Validation:**
- Decision on Strategy A vs B is documented
- Phase 2 tasks reference the confirmed strategy

---

## Phase 2 — Type and Schema Alignment

> **Goal:** Align `auth.types.ts` and `login.schema.ts` with the API contract.
> These are foundational — all subsequent phases depend on correct types.

### Task 2.1 — Add `TokenResponse` and `RefreshTokenPayload` Types

| Field | Value |
|---|---|
| **File** | `apps/admin/src/features/auth/types/auth.types.ts` |
| **Layer** | `types` |
| **Change type** | Addition |

**Steps:**
1. Add the following types:
```ts
export type RefreshTokenPayload = {
  token: string;
  expirationDate: string; // ISO 8601 UTC
};

export type TokenResponse = {
  accessToken: string;
  refreshToken: RefreshTokenPayload;
  tokenType: "Bearer";
  expiresIn: number; // seconds until access token expiry
};
```
2. Do NOT remove any existing types — these are additions only

**Validation:**
- `pnpm typecheck` passes
- `TokenResponse` is importable from `auth.types.ts`

### Task 2.2 — Fix Email Validation in `loginSchema`

| Field | Value |
|---|---|
| **File** | `apps/admin/src/features/auth/schemas/login.schema.ts` |
| **Layer** | `schemas` |
| **Change type** | Modification |

**Steps:**
1. Update the `email` field from:
   ```ts
   email: z.string().trim().min(1, "Email is required.")
   ```
   To:
   ```ts
   email: z
     .string()
     .trim()
     .min(1, "Email is required.")
     .email("Please enter a valid email address.")
   ```

**Validation:**
- `z.parse({ email: "notanemail", password: "validpass" })` throws with email format error
- `z.parse({ email: "a@b.com", password: "validpass" })` succeeds

### Task 2.3 — Add Password Minimum Length to `loginSchema`

| Field | Value |
|---|---|
| **File** | `apps/admin/src/features/auth/schemas/login.schema.ts` |
| **Layer** | `schemas` |
| **Change type** | Modification |

**Steps:**
1. Update the `password` field from:
   ```ts
   password: z.string().min(1, "Password is required.")
   ```
   To:
   ```ts
   password: z
     .string()
     .min(1, "Password is required.")
     .min(8, "Password must be at least 8 characters.")
   ```
   > Note: If the backend enforces a different minimum, coordinate and use that value.

**Validation:**
- `z.parse({ email: "a@b.com", password: "short" })` throws with password length error
- `z.parse({ email: "a@b.com", password: "validpass" })` succeeds

### Task 2.4 — Add `type` Field to `loginErrorResponseSchema`

| Field | Value |
|---|---|
| **File** | `apps/admin/src/features/auth/schemas/login.schema.ts` |
| **Layer** | `schemas` |
| **Change type** | Modification |

**Steps:**
1. In `loginErrorResponseSchema`, extend the `error` shape to include:
   ```ts
   type: z.string().optional()
   ```
2. In `LoginErrorPayload` (in `auth.types.ts`), confirm `type?: string` is present
   (it is, via `AuthErrorEnvelope.type?`)

**Validation:**
- `loginErrorResponseSchema.safeParse({ error: { type: "...", status: 401, ... } }).success` is `true`

---

## Phase 3 — Handler Alignment

> **Goal:** Fix `loginHandler` to correctly handle the API response and establish a valid
> session. This is the highest-risk phase (see GAP-01, GAP-02).

### Task 3.1 — Remove Dead `isSuccess` Check

| Field | Value |
|---|---|
| **File** | `apps/admin/src/features/auth/server/login.handler.ts` |
| **Layer** | `server` |
| **Change type** | Removal / replacement |

**Steps:**
1. Locate the block:
   ```ts
   if (normalizedTokenResponse.data.isSuccess === false) { ... }
   ```
2. Replace with a typed guard that validates the token response shape:
   ```ts
   const tokenData = normalizedTokenResponse.data as TokenResponse;
   if (!tokenData.accessToken || typeof tokenData.accessToken !== "string") {
     return createErrorResponse({
       detail: "Authentication failed. Invalid token response from server.",
       status: 401,
       title: "Authentication Failed",
       setCookieHeaders,
       clearAuthCookies: true,
       event: observabilityEvents.authLoginFailed
     });
   }
   ```
3. Import `TokenResponse` from `../types/auth.types`

**Validation:**
- TypeScript compilation passes
- The check now validates a real field from the API contract

### Task 3.2 — Implement Token Cookie Strategy (Strategy B or A)

| Field | Value |
|---|---|
| **File** | `apps/admin/src/features/auth/server/login.handler.ts` |
| **Layer** | `server` |
| **Change type** | Addition |

> Complete Task 1.2 before this task. Use confirmed strategy.

**Steps (Strategy B — JSON body extraction, default):**

1. After validating `tokenData.accessToken` in the success branch:
   ```ts
   const response = NextResponse.json({
     ok: true,
     redirectTo: postLoginRedirectRoute
   });

   // Forward backend Set-Cookie headers if present (Strategy A path)
   if (setCookieHeaders.length > 0) {
     appendSetCookieHeaders(response, setCookieHeaders);
   } else {
     // Strategy B: extract tokens from JSON body and set as HttpOnly cookies
     const accessCookieName =
       adminRuntimeEnv.accessCookieName || "accessToken";
     const refreshCookieName =
       adminRuntimeEnv.refreshCookieName || "refreshToken";
     const cookieBase = {
       httpOnly: true,
       secure: adminRuntimeEnv.cookieSecure,
       sameSite: adminRuntimeEnv.cookieSameSite as "lax" | "strict" | "none",
       domain: adminRuntimeEnv.cookieDomain || undefined,
       path: "/"
     };

     response.cookies.set({
       ...cookieBase,
       name: accessCookieName,
       value: tokenData.accessToken,
       maxAge: tokenData.expiresIn
     });

     response.cookies.set({
       ...cookieBase,
       name: refreshCookieName,
       value: tokenData.refreshToken.token,
       expires: new Date(tokenData.refreshToken.expirationDate)
     });
   }

   setSessionCookie(response);
   return response;
   ```

2. Do NOT set the session cookie before the token cookies

**Validation:**
- On successful login with Strategy B, browser receives:
  - `Set-Cookie: accessToken=...; HttpOnly; Path=/; MaxAge=3600`
  - `Set-Cookie: refreshToken=...; HttpOnly; Path=/; Expires=...`
  - `Set-Cookie: cafedebug_admin_session=active; HttpOnly; ...`
- `pnpm lint && pnpm typecheck && pnpm build` passes

### Task 3.3 — Verify `adminRuntimeEnv` has `accessCookieName` and `refreshCookieName`

| Field | Value |
|---|---|
| **File** | `apps/admin/src/lib/env.ts` (or equivalent) |
| **Layer** | `lib` |
| **Change type** | Verification / addition |

**Steps:**
1. Check if `adminRuntimeEnv.accessCookieName` and `adminRuntimeEnv.refreshCookieName` are
   already exposed. If not, add them reading from environment variables:
   - `ADMIN_ACCESS_COOKIE_NAME` (default: `"accessToken"`)
   - `ADMIN_REFRESH_COOKIE_NAME` (default: `"refreshToken"`)
2. Update `.env.example` if new env vars are added

**Validation:**
- `adminRuntimeEnv.accessCookieName` and `adminRuntimeEnv.refreshCookieName` are accessible
  in the handler without TypeScript errors

---

## Phase 4 — Service Alignment

> **Goal:** Ensure the client-side service correctly parses all response fields from the
> handler, including the `type` field in error envelopes.

### Task 4.1 — Propagate `type` Field in `loginService`

| Field | Value |
|---|---|
| **File** | `apps/admin/src/features/auth/services/login.service.ts` |
| **Layer** | `services` |
| **Change type** | Modification |

**Steps:**
1. In the error branch of `loginService`, extract the `type` field from `errorPayload`:
   ```ts
   return {
     ok: false,
     error: {
       kind: "response",
       detail: errorPayload?.detail ?? "Unable to sign in...",
       status: errorPayload?.status ?? response.status,
       title: errorPayload?.title ?? "Authentication Failed",
       ...(errorPayload?.type ? { type: errorPayload.type } : {}),
       ...(errorPayload?.traceId ? { traceId: errorPayload.traceId } : {}),
       ...(errorPayload?.fieldErrors ? { fieldErrors: errorPayload.fieldErrors } : {})
     }
   };
   ```
2. Confirm `LoginErrorPayload` (via `AuthErrorEnvelope`) already carries `type?: string`

**Validation:**
- TypeScript compilation passes
- `loginErrorResponseSchema.error.type` is parsed correctly

---

## Phase 5 — Hook Alignment

> **Goal:** Ensure `useLogin` handles all error kinds correctly and the "Remember me"
> checkbox is addressed.

### Task 5.1 — Remove or Annotate "Remember Me" Checkbox Logic

> This task is in the hook because the fix is in the form component, but the hook owns
> the form definition. If the checkbox is removed, the hook needs no change. If it is
> wired, the hook's `defaultValues` and schema must be updated.

| Field | Value |
|---|---|
| **File** | `apps/admin/src/features/auth/components/login-form.tsx` |
| **Layer** | `components` |
| **Change type** | Removal / annotation |

**Steps:**
1. Confirm V1 decision: **remove** the "Remember me" checkbox from `login-form.tsx`
2. Replace it with a comment block:
   ```tsx
   {/* TODO: Remember Me — requires backend session duration support (out of scope V1) */}
   ```
3. The "Forgot Password?" link already has a TODO comment — retain it

**Validation:**
- The checkbox is not rendered in the form
- No RHF field named `remember-me` is registered
- The TODO comment is present at the correct location

### Task 5.2 — Audit Duplicate Observability Logging in Hook

| Field | Value |
|---|---|
| **File** | `apps/admin/src/features/auth/hooks/use-login.ts` |
| **Layer** | `hooks` |
| **Change type** | Review / possible removal |

**Steps:**
1. Review `logger.warn(observabilityEvents.authLoginFailed, ...)` in the hook's
   `result.error.kind === "response"` branch
2. This fires after the handler already logged `observabilityEvents.authLoginFailed`
3. **Decision:** If both logs carry different context (server: endpoint/status, client: form
   action/traceId), retain both. If they are redundant, remove the hook's `logger.warn`
   and keep only the `addSentryBreadcrumb` call.

**Validation:**
- No duplicate log entry appears in the observability output for a single 401 login attempt
- OR: if both logs are intentional, document the distinction with a comment

---

## Phase 6 — Component Validation

> **Goal:** Confirm the UI correctly surfaces all error states from the updated hook and
> service, and that design tokens are used throughout.

### Task 6.1 — Verify Component Design Token Compliance

| Field | Value |
|---|---|
| **File** | `apps/admin/src/features/auth/components/login-form.tsx` |
| **Layer** | `components` |
| **Change type** | Verification |

**Steps:**
1. Audit every Tailwind class in `login-form.tsx` for hardcoded color values
2. Confirm all color references use design tokens (e.g., `text-danger`, `bg-primary`,
   `border-outline-variant`) — no hex values, no raw Tailwind color scale values
   (e.g., no `text-red-500`, no `bg-orange-500`)
3. Confirm `aria-describedby` is set for both fields when errors are present
4. Confirm `role="alert"` on the `formError` banner and `role="status"` on the session
   status message

**Validation:**
- No hardcoded color values found in `login-form.tsx`
- Accessibility attributes are present and correct

### Task 6.2 — Validate All Error UI States Render Correctly

| Field | Value |
|---|---|
| **File** | `apps/admin/src/features/auth/components/login-form.tsx` |
| **Layer** | `components` |
| **Change type** | Verification |

**Steps:**
Using the dev server or a mock service worker (MSW), trigger each scenario manually or
in a test:

| Scenario | Expected UI |
|---|---|
| Empty submission | Field errors below email + password; form-level "Please review..." message |
| Invalid email format | Email field error: "Please enter a valid email address." |
| Short password | Password field error: "Password must be at least 8 characters." |
| 401 Unauthorized | Form banner (role=alert): "User not found or invalid credentials." |
| 503 Transport | Form banner (role=alert): "Unable to reach the authentication service..." |
| isSubmitting | Button shows "Signing in...", inputs disabled, "Validating session..." status |

**Validation:**
- All six scenarios render the correct UI state
- No hardcoded test data left in production components

---

## Phase 7 — Route Thinness Check

> **Goal:** Final enforcement pass — confirm the API route remains a pure delegator.

### Task 7.1 — Assert Route Thinness

| Field | Value |
|---|---|
| **File** | `apps/admin/src/app/api/auth/login/route.ts` |
| **Layer** | `app` |
| **Change type** | Verification |

**Steps:**
1. Open `app/api/auth/login/route.ts`
2. Confirm the file contains ONLY:
   ```ts
   import { loginHandler } from "@/features/auth/server/login.handler";
   export async function POST(request: Request) {
     return loginHandler(request);
   }
   ```
3. No logic, no validation, no imports from `next/server`, no inline error handling

**Validation:**
- File length is ≤ 6 lines (import + blank + export + return + closing braces)
- ESLint / TypeScript passes with no warnings

---

## Phase 8 — Spec Index Update

### Task 8.1 — Update `.specs/README.md`

| Field | Value |
|---|---|
| **File** | `.specs/README.md` |
| **Layer** | Documentation |
| **Change type** | Addition |

**Steps:**
1. Add the following row to the Spec Index table:

```markdown
| Admin Login | `Draft` | `.specs/admin/login/` | Full feature spec for admin login flow against POST /api/v1/admin/auth/token |
```

**Validation:**
- Row appears in the correct table position (alphabetical or chronological within `admin` section)
- Status shows `Draft`

---

## Phase Summary

| Phase | Focus | Risk Level | Depends On |
|---|---|---|---|
| 1 | Contract verification | High (blocking) | — |
| 2 | Type and schema alignment | Medium | Phase 1 |
| 3 | Handler alignment + token cookie strategy | Critical | Phase 1, 2 |
| 4 | Service alignment | Low | Phase 2 |
| 5 | Hook alignment + "Remember Me" cleanup | Low | Phase 2 |
| 6 | Component validation | Low | Phase 5 |
| 7 | Route thinness check | Low | Phase 3 |
| 8 | Spec index update | Trivial | Phase 1–7 |
