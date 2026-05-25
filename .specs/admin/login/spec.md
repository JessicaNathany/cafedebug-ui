# Spec: Admin Login Feature

| Field | Value |
|---|---|
| **Status** | `Implemented` |
| **Approved by** | The Debugger (⚠️ APPROVED WITH NOTES) |
| **Domain** | `admin/auth` |
| **Spec path** | `.specs/admin/login/` |
| **Related specs** | `.specs/admin/login-refactor/` (UI — Implemented), `.specs/admin/auth-error-normalization/` (Implemented) |
| **Affected app** | `apps/admin` |
| **API endpoint** | `POST /api/v1/admin/auth/token` |

---

## 1. Problem Statement

The admin backoffice (`apps/admin`) requires a secure, reliable authentication gate.
Administrators must supply their email and password on the login page; the system must
verify credentials against the backend API, establish an authenticated session, and
redirect the user into the protected area of the application.

The login feature must be **fully specified** against the backend API contract so that
every layer — form, hook, service, Next.js API route, and server-side handler — behaves
consistently and handles all response scenarios without guesswork.

This spec does **not** revisit the visual design (covered by `login-refactor`). It
specifies the **functional correctness and data-flow contract** of the login flow from
input validation through session establishment.

---

## 2. User and Business Context

| Dimension | Detail |
|---|---|
| **Audience** | Admin users (authorized backoffice personnel only) |
| **Entry point** | `/login` — the authentication gate before any protected admin route |
| **Business criticality** | High — no admin features are accessible without a valid session |
| **Session model** | Server-side session signal cookie (cafedebug_admin_session) + HttpOnly auth token cookies translated into backend bearer headers on the server |
| **Protected routes** | `/dashboard`, `/episodes`, `/settings` (and all sub-paths) |

The login page is the **single authentication gate** for the entire admin app. The session
established here is the only mechanism that allows middleware to pass requests through
to protected routes.

---

## 3. Scope

### In scope

| Area | Detail |
|---|---|
| Login form validation (client-side) | Email (required) + password (required), using React Hook Form + Zod |
| Server-side request validation | Schema enforcement in `loginHandler` before calling the backend |
| Backend API call | `POST /api/v1/admin/auth/token` via `adminApiClient.auth.token` |
| Success flow | Token receipt, session cookie establishment, redirect to `/episodes` |
| Failure flows | 400 Validation Failed, 401 Unauthorized, 500 Configuration Error, 503 Service Unavailable, transport errors |
| Field-level error propagation | Backend field errors surfaced to the appropriate form field |
| Session signal cookie | Setting `cafedebug_admin_session` on success |
| Token cookie strategy | Forwarding `Set-Cookie` headers from the backend response (if present) |
| Token body extraction | Reading `accessToken` / `refreshToken` from the JSON body and setting them as HttpOnly cookies when the backend does NOT emit `Set-Cookie` headers |
| Cookie-to-bearer translation | Building backend bearer auth from the HttpOnly access-token cookie for protected admin requests |
| Error envelope normalization | Using `createErrorResponse` for all failure paths |
| Observability | Structured logging and Sentry breadcrumbs at each key decision point |

### Out of scope (V1)

| Area | Reason |
|---|---|
| Refresh token rotation | Handled by `validateSessionWithSingleRefresh` in middleware — separate lifecycle |
| "Remember me" persistence | No backend support — form element is decorative only |
| "Forgot password" flow | Requires backend password-reset endpoint — out of scope |
| Account lockout / rate limiting | Backend concern — frontend renders the error detail as-is |
| Token expiry countdown / auto-refresh in UI | Background concern — handled by middleware refresh logic |
| Multi-factor authentication | Not in the current API contract |
| Theme/locale switching on the login page | Separate feature |

---

## 4. Functional Requirements

### FR-1 — Client-Side Form Validation

Before the form is submitted, React Hook Form + Zod must enforce:

- **email**: required, non-empty after trim
- **password**: required, non-empty

On client-side validation failure:
- Field-level error messages appear below each failing field
- The form sets `formError` to `"Please review the highlighted fields."`
- A structured warning is logged via `observabilityEvents.authLoginValidationFailed`
- The HTTP call is NOT made

### FR-2 — Service Call (Client → Next.js API Route)

On valid form submission:
- `loginService(payload)` is called
- A `POST /api/auth/login` request is sent with `{ email, password }` as JSON
- The service returns a `LoginServiceResult` discriminated union

### FR-3 — Next.js API Route Thinness

`app/api/auth/login/route.ts` must remain a thin pass-through:
```ts
import { loginHandler } from "@/features/auth/server/login.handler";
export async function POST(request: Request) {
  return loginHandler(request);
}
```
No business logic is allowed in this file.

### FR-4 — Server-Side Request Validation (Handler)

`loginHandler` must:
1. Parse the request body with `request.json()` — return `400 Bad Request` on parse failure
2. Validate the body with `loginSchema.safeParse` — return `400 Validation Failed` with field errors on failure
3. Check `adminRuntimeEnv.apiBaseUrl` — return `500 Configuration Error` if missing

### FR-5 — Backend API Call (Handler → Backend)

`loginHandler` must call the backend using:
```ts
adminApiClient.auth.token({ email, password })
```
The target endpoint is `POST /api/v1/admin/auth/token`.

### FR-6 — Success Response Handling (200 OK)

On a successful `200 OK` from the backend:

1. Extract any `Set-Cookie` headers from the backend response via `extractSetCookieHeaders`
2. **If the backend emits `Set-Cookie` headers** → forward them to the browser via `appendSetCookieHeaders`
3. **If the backend does NOT emit `Set-Cookie` headers** → read `accessToken` and `refreshToken.token` from the JSON body and set them as HttpOnly cookies manually (see Token Cookie Strategy in design.md)
4. Set the session signal cookie `cafedebug_admin_session` via `setSessionCookie`
5. Return `{ ok: true, redirectTo: "/episodes" }` with HTTP 200
6. Log `observabilityEvents.authLoginSuccess`
7. Add Sentry breadcrumb "Admin login success"

### FR-7 — 401 Unauthorized Handling

When the backend returns `401 Unauthorized`:
```json
{
  "type": "https://tools.ietf.org/html/rfc7235#section-3.1",
  "title": "Unauthorized",
  "status": 401,
  "detail": "User not found or invalid credentials."
}
```
- `normalizeApiError` maps it to `{ status: 401, title: "Unauthorized", detail: "User not found or invalid credentials." }`
- `createErrorResponse` returns `{ ok: false, error: { status: 401, title, detail } }` with HTTP 401
- Auth cookies are cleared via `clearKnownAuthCookies`
- `observabilityEvents.authLoginFailed` is logged
- The service propagates this to the hook as `{ ok: false, error: { kind: "response", status: 401, ... } }`
- The hook sets `formError` to the `detail` string
- No field-level errors are set (this is a credential error, not a field format error)

### FR-8 — 400 Validation Failure from Backend

If the backend returns `400` with field errors:
- `normalizeApiError` extracts `fieldErrors` if present
- `createErrorResponse` includes them in the response envelope
- The service surfaces them in `errorPayload.fieldErrors`
- The hook calls `form.setError("email", ...)` and/or `form.setError("password", ...)` if matching keys exist

### FR-9 — 503 / Transport Error Handling

On network failure or unexpected error:
- The handler's `try/catch` returns `503 Service Unavailable` with detail:  
  `"Unable to reach the authentication service. Please try again."`
- `captureException` is called with Sentry scope
- `observabilityEvents.authLoginServiceUnavailable` is logged at `error` level
- The service's outer `try/catch` returns `{ ok: false, error: { kind: "transport", status: 503, ... } }`
- The hook logs the error, captures it via Sentry, and sets `formError`

### FR-10 — Protected Backend Auth Header Translation

For protected admin backend requests made after login:

1. Server-side helpers under lib/auth and lib/api must parse the incoming cookie header
2. The access token must be resolved using the known access-cookie names
3. Protected backend calls must send an Authorization bearer header
4. Refresh uses body-token exchange (`{ refreshToken }`) without forwarding auth cookies to the backend
5. Tokens must never be exposed to client components, logs, or response bodies

### FR-11 — Post-Login Redirect

On success, the hook calls:
```ts
router.replace(result.redirectTo);
router.refresh();
```
The default redirect target is `postLoginRedirectRoute` = `"/episodes"`.

---

## 5. Non-Functional Requirements

| NFR | Requirement |
|---|---|
| **Security** | Auth tokens stored as HttpOnly cookies only — never in `localStorage` or JS-accessible state |
| **Security** | Session cookie (`cafedebug_admin_session`) uses `httpOnly: true`, `sameSite`, `secure` from env config |
| **Security** | Auth cookies are cleared on any failure path that previously set them |
| **Observability** | Every decision branch has a structured log with `module: "auth"`, `action: "login"`, `status` |
| **Observability** | Sentry breadcrumbs mark login attempt and result |
| **Observability** | `captureException` on transport errors only (not on expected 401/400) |
| **Correctness** | The `normalizeClientResponse` result is checked via `"error" in normalizedTokenResponse` — never by inspecting raw HTTP status in the handler |
| **Architecture** | No business logic in `app/api/auth/login/route.ts` |
| **Architecture** | No `fetch()` inside components |
| **Architecture** | All logic in `features/auth/` subdirectories |
| **Accessibility** | Form inputs have ARIA attributes wired to field errors |
| **Reliability** | The session cannot be established without a valid backend token response |
| **Correctness** | Protected admin backend calls translate the access-token cookie into backend bearer auth on the server boundary |

---

## 6. Scenarios

### Scenario A — Happy Path (200 OK)

```
User fills email + password → form validates → loginService → POST /api/auth/login
  → loginHandler → POST /api/v1/admin/auth/token
  → 200 OK: { accessToken, refreshToken, tokenType, expiresIn }
  → Session cookies set → { ok: true, redirectTo: "/episodes" }
  → hook: router.replace("/episodes") + router.refresh()
```

### Scenario B — Client Validation Failure

```
User submits with empty email → loginSchema fails
  → hook: form.setError("email", ...) + setFormError("Please review the highlighted fields.")
  → No HTTP call made
```

### Scenario C — 401 Unauthorized

```
User submits wrong credentials → backend returns 401
  → normalizeApiError → createErrorResponse (401)
  → loginService: { ok: false, error: { kind: "response", status: 401, detail: "User not found or invalid credentials." } }
  → hook: setFormError("User not found or invalid credentials.")
```

### Scenario D — 400 Validation from Backend

```
Handler receives malformed payload → loginSchema rejects it
  → createErrorResponse (400) with fieldErrors
  → loginService: { ok: false, error: { kind: "response", fieldErrors: {...} } }
  → hook: form.setError per field
```

### Scenario E — 503 / Transport Error

```
Backend unreachable → catch block in handler
  → createErrorResponse (503), captureException
  → loginService: { ok: false, error: { kind: "transport", status: 503 } }
  → hook: captureException + setFormError("Unable to reach the authentication service...")
```

### Scenario F — Protected Backend Request After Login

A valid HttpOnly access-token cookie is parsed server-side, translated into a backend bearer header, and used for protected admin backend requests. After refresh rotation, the retry probe rebuilds bearer auth from the rotated cookie set.

### Scenario G — Missing API Base URL

```
adminRuntimeEnv.apiBaseUrl is undefined → handler early exit
  → createErrorResponse (500, "Configuration Error")
  → loginService: { ok: false, error: { kind: "response", status: 500 } }
  → hook: setFormError(detail)
```

---

## 7. Acceptance Criteria

| ID | Criterion |
|---|---|
| AC-01 | Submitting valid credentials results in a session being established and a redirect to `/episodes` |
| AC-02 | Submitting empty email or password shows field-level error messages without making an HTTP call |
| AC-03 | A 401 from the backend shows the error detail in the form-level error alert |
| AC-04 | A transport failure shows `"Unable to reach the authentication service. Please try again."` |
| AC-05 | On success, `cafedebug_admin_session` cookie is set with `httpOnly: true` |
| AC-06 | On any failure, no auth cookies are left in a partial/stale state |
| AC-07 | `app/api/auth/login/route.ts` contains only the thin delegator pattern — no logic |
| AC-08 | No `fetch()` calls exist inside `login-form.tsx` or `use-login.ts` |
| AC-09 | All login error shapes conform to `AuthErrorEnvelope` |
| AC-10 | `loginHandler` uses `adminApiClient.auth.token` — never a hand-written `fetch` |
| AC-11 | Field errors returned by the backend are propagated to the correct RHF field |
| AC-12 | The `type` field from the backend 401 response body is preserved in the error envelope |
| AC-13 | Access token and refresh token from the JSON body are stored as HttpOnly cookies |
| AC-14 | Zod schema enforces email format validation (`.email()`) for UX-quality error messaging |
| AC-15 | `loginSchema` enforces password minimum length (≥ 8 characters) for UX-quality messaging |
| AC-16 | Protected admin backend requests send backend bearer auth resolved from the HttpOnly access-token cookie |
| AC-17 | Session probe retry rebuilds bearer auth from rotated cookies after a successful refresh |

---

## 8. Gaps and Risks

This section compares the **current implementation** against the **API contract** and documents
every inconsistency, missing behaviour, and risk.

---

### GAP-01 — Token Body Extraction: CRITICAL

**Current behaviour:**  
`loginHandler` extracts `Set-Cookie` headers from the backend response via
`extractSetCookieHeaders(normalizedTokenResponse.response)` and forwards them to the browser.

**API contract:**  
`POST /api/v1/admin/auth/token` returns tokens in the **JSON body**:
```json
{
  "accessToken": "eyJ...",
  "refreshToken": { "token": "tdASqq...", "expirationDate": "2026-04-03T..." },
  "tokenType": "Bearer",
  "expiresIn": 3600
}
```
There is **no documented `Set-Cookie` header** in the backend contract.

**Risk:**  
If the backend does not emit `Set-Cookie` headers, `setCookieHeaders` will be an empty
array, `appendSetCookieHeaders` is a no-op, and **no auth token is stored anywhere**.
The `cafedebug_admin_session` session-signal cookie will be set (allowing the user to
appear logged in), but subsequent API calls made server-side will have **no bearer token**
to send, causing every protected API call to fail with 401.

**Required action:**  
The handler must read `normalizedTokenResponse.data.accessToken` and
`normalizedTokenResponse.data.refreshToken.token` from the JSON body and set them as
HttpOnly cookies if the backend does not emit `Set-Cookie` headers. A fallback
strategy: check if `setCookieHeaders` is empty before falling back to JSON body extraction.

---

### GAP-02 — `isSuccess` Field: Dead Code Risk

**Current behaviour:**  
`loginHandler` checks `normalizedTokenResponse.data.isSuccess === false` after confirming
no error is present in the response.

**API contract:**  
The 200 OK response body has no `isSuccess` field:
```json
{ "accessToken": "...", "refreshToken": {...}, "tokenType": "Bearer", "expiresIn": 3600 }
```

**Risk:**  
This check evaluates `undefined === false` → `false` and is permanently a no-op. It is
dead code. While it causes no current bug, it is misleading and may confuse future
maintainers or mask future regressions if the backend changes its response shape.

**Required action:**  
Remove the `isSuccess` check or replace it with a typed guard that validates the
expected response fields (`accessToken` must be a non-empty string).

---

### GAP-03 — Missing `TokenResponse` Frontend Types

**Current behaviour:**  
`auth.types.ts` defines `LoginRequest`, `LoginErrorPayload`, `LoginServiceResult`, etc.
There is **no type** that models the backend's success response body.

**API contract fields:**
```ts
{
  accessToken: string;
  refreshToken: { token: string; expirationDate: string };
  tokenType: "Bearer";
  expiresIn: number;
}
```

**Risk:**  
Without a typed `TokenResponse`, TypeScript cannot guard against shape mismatches when
reading `normalizedTokenResponse.data`. Any access to `.accessToken` or `.refreshToken`
is untyped and silently `any`.

**Required action:**  
Add `TokenResponse` and `RefreshTokenPayload` types to `auth.types.ts` (or generate them
from the OpenAPI schema) and use them in the handler's success branch.

---

### GAP-04 — Email Validation: No Format Check

**Current behaviour:**  
`loginSchema` uses `z.string().trim().min(1, "Email is required.")` — validates presence
only, not format.

**Risk:**  
A user can submit `"notanemail"` and the client-side validation will pass. The backend
will return a 400 or 401 but the user gets no early format hint.

**Required action:**  
Add `.email("Please enter a valid email address.")` to the email field in `loginSchema`.
Chain after `.trim()`: `z.string().trim().min(1).email(...)`.

---

### GAP-05 — Password Validation: No Minimum Length

**Current behaviour:**  
`loginSchema` uses `z.string().min(1, "Password is required.")`.

**Risk:**  
One-character passwords pass client validation. The backend may reject them, causing
an extra round-trip with a confusing error. UX quality is reduced.

**Required action:**  
Add a minimum length: `z.string().min(8, "Password must be at least 8 characters.")`.
Coordinate with the backend's actual minimum if different.

---

### GAP-06 — `type` Field Lost in Error Normalization

**Current behaviour:**  
`normalizeApiError` extracts `{ status, title, detail, fieldErrors, traceId }` but
**does not extract the `type` field** from the backend error body.

**API contract (401):**
```json
{
  "type": "https://tools.ietf.org/html/rfc7235#section-3.1",
  "title": "Unauthorized",
  "status": 401,
  "detail": "User not found or invalid credentials."
}
```

**Risk:**  
The `type` field is part of the RFC 7807 Problem Details standard. Losing it means the
frontend cannot use it for programmatic error classification. The `createErrorResponse`
function does accept a `type` parameter but it is never populated.

**Required action:**  
Extend `NormalizedApiError` (in `packages/api-client`) to include `type?: string` and
extract it in `normalizeApiError`. Propagate it through `createErrorResponse`. (This may
be tracked as a follow-up to the `auth-error-normalization` spec.)

---

### GAP-07 — "Remember Me" Checkbox: Decorative with No Behaviour

**Current behaviour:**  
`login-form.tsx` renders a `<input type="checkbox" name="remember-me">` that is not
registered with React Hook Form and has no handler. It is purely decorative.

**Risk:**  
Users may reasonably expect this to extend their session. If it never works, it creates
a trust gap. More practically, it is an accessibility concern: interactive elements must
have meaningful behaviour.

**Required action:**  
Either (a) remove the checkbox entirely from the form until backend session persistence
is supported, or (b) wire it to a boolean form field that is submitted to the handler
(requires backend support for session duration extension).

V1 decision: **remove** the checkbox. Add a `{/* TODO: Remember Me — requires backend session duration support */}` comment.

---

### GAP-08 — Backend Token Cookie Strategy: Unverified Assumption

**Current behaviour:**  
The handler relies on the backend to set auth cookies via `Set-Cookie` headers. The
middleware's `validateSessionWithSingleRefresh` reads cookies named `accessToken`,
`refreshToken`, etc. (per `session-constants.ts`) to validate and refresh sessions.

**Risk:**  
If the backend sends tokens only in the JSON body (as the provided contract shows), the
cookie-based session check in middleware will always fail after login, effectively
breaking all protected routes even after a successful login.

**Required action (design.md):**  
Document two strategies and pick one:
- **Strategy A (backend-sets-cookies):** Backend emits `Set-Cookie` headers for the tokens → frontend forwards them unchanged. Verify this with the backend team.
- **Strategy B (frontend-sets-cookies):** Frontend reads `accessToken` and `refreshToken.token` from the JSON body and sets them as HttpOnly cookies with appropriate `maxAge` (using `expiresIn`) and security settings. This is the fallback if Strategy A is not available.

The spec recommends **Strategy B** as the safe implementation-ready default, since the provided API contract shows only a JSON body response.

---

### GAP-09 — `loginErrorResponseSchema` Missing `type` Field

**Current behaviour:**  
`loginErrorResponseSchema` in `login.schema.ts` does not parse the `type` field from
the error envelope.

**Risk:**  
Consistent with GAP-06 — the `type` field from RFC 7807 responses is silently dropped
at the service layer.

**Required action:**  
Add `type: z.string().optional()` to `loginErrorResponseSchema.error` shape.

---

### RISK-01 — OpenAPI Type Coverage of Auth Token Endpoint

**Concern:**  
If the OpenAPI schema for `POST /api/v1/admin/auth/token` was generated before the
current response shape was finalised, the TypeScript types from `openapi-typescript`
may not accurately reflect `{ accessToken, refreshToken, tokenType, expiresIn }`.

**Required action:**  
Run `pnpm --filter @cafedebug/api-client run contract:check` to verify the generated types match the current backend
response. If the OpenAPI spec is outdated, regenerate the client types before
implementing GAP-01 / GAP-03 fixes.

---

### RISK-02 — Dual Logging in Hook and Handler

**Concern:**  
Both `loginHandler` and `useLogin` log `observabilityEvents.authLoginFailed` on
credential errors. This may produce duplicate log entries for the same authentication
failure event.

**Required action:**  
Review whether the hook's `logger.warn` call on `result.error.kind === "response"` adds
value beyond what the handler already logs. If redundant, consider removing it from the
hook, keeping observability at the server layer only.
