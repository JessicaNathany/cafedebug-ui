# Admin Login — Feature Documentation

> **Status:** Implemented — Approved by The Debugger (⚠️ APPROVED WITH NOTES)
>
> **Spec:** [`.specs/admin/login/spec.md`](./spec.md) · **Design:** [`.specs/admin/login/design.md`](./design.md) · **Tasks:** [`.specs/admin/login/tasks.md`](./tasks.md)

---

## What It Is

The Admin Login feature is the authentication gate for the `apps/admin` backoffice. It
accepts an admin email and password, validates them client-side with Zod, forwards the
credentials to the backend API (`POST /api/v1/admin/auth/token`), extracts the returned
JWT tokens from the JSON response body, sets them as `HttpOnly` cookies, establishes a
session signal cookie, and redirects the user to `/episodes`. Every error scenario —
from invalid form input to a 401 from the backend to a transport failure — produces a
typed result that the UI surfaces as a field error or a top-level alert banner.

---

## Data Flow

```
LoginForm (component)                     apps/admin/src/features/auth/components/
  │  onSubmit → RHF handleSubmit
  ▼
useLogin (hook)                           apps/admin/src/features/auth/hooks/
  │  loginService(payload)
  ▼
loginService (service)                    apps/admin/src/features/auth/services/
  │  POST /api/auth/login
  ▼
app/api/auth/login/route.ts               apps/admin/src/app/api/auth/login/
  │  loginHandler(request)  ← thin delegator, no logic
  ▼
loginHandler (server)                     apps/admin/src/features/auth/server/
  │  1. parseBody            → 400 if invalid JSON
  │  2. loginSchema.parse    → 400 + fieldErrors if invalid
  │  3. check apiBaseUrl     → 500 if env missing
  │  4. adminApiClient.auth.token({ body })
  ▼
Backend API
  POST /api/v1/admin/auth/token
  │
  ├─ 200 OK → { accessToken, refreshToken, tokenType, expiresIn }
  │     Strategy A: forward any Set-Cookie headers from backend (defensive)
  │     Strategy B: setAccessTokenCookie + setRefreshTokenCookie  ← confirmed path
  │     Always:     setSessionCookie (cafedebug_admin_session)
  │     Return:     { ok: true, redirectTo: "/episodes" }
  │
  ├─ 401 → { type, title, status, detail }
  │     normalizeApiError → clearKnownAuthCookies
  │     Return: { ok: false, error: { status: 401, title, detail, type } }
  │
  ├─ 502 → malformed/missing token fields in response body
  │     Return: { ok: false, error: { status: 502, detail: "Authentication response was incomplete." } }
  │
  └─ network catch → captureException
        Return: { ok: false, error: { status: 503, detail: "Unable to reach the authentication service." } }
  ▼
loginService                              apps/admin/src/features/auth/services/
  │  parses LoginServiceResult
  ▼
useLogin (hook)
  │  result.ok  → router.replace(redirectTo) + router.refresh()
  │  !result.ok → form.setError(...) or setFormError(detail)
  ▼
LoginForm (component)
     renders: formError banner (role="alert") | field errors via RHF | loading state
```

---

## File Structure

```
apps/admin/src/
├── app/
│   ├── (auth)/login/
│   │   └── page.tsx                    # Route — renders <LoginForm />, no logic
│   └── api/auth/login/
│       └── route.ts                    # Thin delegator → loginHandler(request)
│
├── features/auth/
│   ├── components/
│   │   └── login-form.tsx              # UI only; delegates all state to useLogin
│   ├── hooks/
│   │   └── use-login.ts                # Orchestrates RHF, calls loginService, routes on result
│   ├── services/
│   │   └── login.service.ts            # fetch POST /api/auth/login; returns LoginServiceResult
│   ├── server/
│   │   └── login.handler.ts            # Validates, calls backend, sets cookies, returns envelope
│   ├── schemas/
│   │   └── login.schema.ts             # Zod schemas: loginSchema, loginErrorResponseSchema
│   ├── types/
│   │   └── auth.types.ts               # RefreshTokenPayload, TokenResponse, LoginServiceResult
│   ├── errors/
│   │   └── createErrorResponse.ts      # Builds standardized NextResponse error envelopes
│   ├── login-status-message.ts         # Resolves ?reason= query param to a status banner message
│   ├── auth-flow-rules.js              # Runtime rules for auth flow decisions
│   └── index.ts                        # Public barrel export
│
└── lib/auth/
    ├── next-response-cookies.ts        # Cookie helpers: setAccessTokenCookie, setRefreshTokenCookie,
    │                                   #   setSessionCookie, appendSetCookieHeaders,
    │                                   #   clearKnownAuthCookies, hasSessionSignalCookie
    ├── session-constants.ts            # Cookie names, session signal value, max-age constants
    ├── session-strategy.js             # Runtime session detection rules
    └── route-rules.js                  # Auth-aware routing rules for middleware
```

### Layer Responsibilities

| Layer | Location | Rule |
|---|---|---|
| **components** | `features/auth/components/` | UI and presentation only. No API calls, no business logic. Uses hooks for state. |
| **hooks** | `features/auth/hooks/` | Orchestration and client state. Calls services, drives form state (RHF), handles routing on result. |
| **services** | `features/auth/services/` | Client-side `fetch` calls to internal Next.js API routes. Returns typed result objects. Never called from components directly. |
| **server** | `features/auth/server/` | Server-only logic. Validates requests, calls the backend API via the generated client, manages cookies. Used only by `app/api/*` route handlers. |
| **app routes** | `app/api/auth/login/route.ts` | Thin delegators. One line: `return loginHandler(request)`. No business logic here. |

---

## API Contract

### Internal Route (Service → Handler)

```
POST /api/auth/login
Content-Type: application/json

{ "email": "user@example.com", "password": "secretpass" }
```

### Backend Endpoint (Handler → Backend)

```
POST /api/v1/admin/auth/token
Content-Type: application/json

{ "email": "user@example.com", "password": "secretpass" }
```

### Success Response — 200

```json
{
  "accessToken": "<jwt>",
  "refreshToken": {
    "token": "<refresh-token-string>",
    "expirationDate": "2026-04-04T00:29:29Z"
  },
  "tokenType": "Bearer",
  "expiresIn": 3600
}
```

### Failure Response — 401

```json
{
  "type": "https://tools.ietf.org/html/rfc7235#section-3.1",
  "title": "Unauthorized",
  "status": 401,
  "detail": "User not found or invalid credentials."
}
```

### Internal Success Envelope (Handler → Service)

```json
{ "ok": true, "redirectTo": "/episodes" }
```

### Internal Error Envelope (Handler → Service)

```json
{
  "ok": false,
  "error": {
    "status": 401,
    "title": "Unauthorized",
    "detail": "User not found or invalid credentials.",
    "type": "https://tools.ietf.org/html/rfc7235#section-3.1"
  }
}
```

`type`, `traceId`, and `fieldErrors` are optional — omitted when not applicable.

---

## Cookie Strategy

### Why the handler sets cookies manually (Strategy B)

The backend returns tokens exclusively in the JSON response body. It does **not** emit
`Set-Cookie` headers. Because the browser never talks to the backend directly (all API
calls go through the Next.js route handler), the handler is responsible for converting
the JSON token data into `HttpOnly` cookies before sending the response to the browser.

### Dual-strategy implementation

The handler applies **both** strategies defensively:

| Strategy | Mechanism | When it applies |
|---|---|---|
| **Strategy A** (fallback) | `appendSetCookieHeaders` forwards any `Set-Cookie` headers from the backend response | Only if the backend starts emitting them (currently none) |
| **Strategy B** (primary, confirmed) | `setAccessTokenCookie` + `setRefreshTokenCookie` extract tokens from the JSON body | Always — this is the active path |

The session signal cookie (`cafedebug_admin_session`) is always set independently of
both strategies via `setSessionCookie`. Middleware reads this cookie to detect an active
session without inspecting the actual tokens.

### Cookie helpers — `src/lib/auth/next-response-cookies.ts`

| Function | Purpose |
|---|---|
| `setAccessTokenCookie(response, accessToken, expiresIn)` | Sets the access token cookie with `maxAge = expiresIn` (seconds) |
| `setRefreshTokenCookie(response, refreshToken, expirationDate)` | Sets the refresh token cookie with `expires = new Date(expirationDate)` |
| `setSessionCookie(response)` | Sets the session signal cookie with an 8-hour `maxAge` |
| `appendSetCookieHeaders(response, headers)` | Forwards raw `Set-Cookie` strings from a backend response (Strategy A) |
| `clearKnownAuthCookies(response)` | Clears all known auth cookies — called on 401 to prevent stale cookies |
| `hasSessionSignalCookie(request)` | Returns `true` if the request carries any known auth cookie — used by middleware |

### Cookie security settings

All auth cookies inherit settings from `adminRuntimeEnv`:

| Setting | Env var | Dev default | Production requirement |
|---|---|---|---|
| `httpOnly` | — | `true` | `true` — always |
| `secure` | `ADMIN_COOKIE_SECURE` | `false` | `true` — required for HTTPS |
| `sameSite` | `ADMIN_COOKIE_SAMESITE` | `"Lax"` | `"Lax"` or `"Strict"` |
| `domain` | `ADMIN_COOKIE_DOMAIN` | `localhost` | production domain |

---

## Error Handling

### Error matrix

| Scenario | HTTP Status | User-facing message |
|---|---|---|
| Empty or invalid email format | 400 | `"Please enter a valid email address."` (field error) |
| Empty password | 400 | `"Password is required."` (field error) |
| Password shorter than 8 characters | 400 | `"Password must be at least 8 characters."` (field error) |
| Invalid credentials | 401 | Backend `detail` string, e.g. `"User not found or invalid credentials."` (form banner) |
| Backend response missing token fields | 502 | `"Authentication response was incomplete."` (form banner) |
| Backend API unreachable or network failure | 503 | `"Unable to reach the authentication service."` (form banner) |

### Where errors are surfaced

```
LoginForm
  ├── formError banner  (role="alert")   ← form-level errors: 401, 502, 503
  └── field errors via RHF              ← field-level errors: 400 validation
        errors.email.message
        errors.password.message
```

### Session-expired and redirect status banners

When middleware redirects an unauthenticated request to `/login`, it appends a `?reason=`
query param. The `resolveLoginStatusMessage` function in `login-status-message.ts`
converts this into a UI banner above the login form:

| `reason` value | Message |
|---|---|
| `session-required` | `"Please sign in to access the admin area."` |
| `session-expired` | `"Your session expired. Sign in again to continue."` |
| `session-check-failed` | `"We couldn't validate your session. Sign in to continue."` |

This banner is separate from `formError` and is not affected by form submission.

---

## How to Extend

### Add a new auth error type

**Where:** `apps/admin/src/features/auth/server/login.handler.ts`

The handler reads `normalizedError.status` to decide which response to return. Add a new
`case` in the status-based switch (or extend the conditional chain) to handle a new
backend status code. Follow the existing pattern:

```ts
// In loginHandler, after normalizeApiError:
if (normalizedError.status === 429) {
  return createErrorResponse(429, "Too Many Requests", undefined, {
    detail: "Too many login attempts. Please wait and try again."
  });
}
```

Then update `login.schema.ts` if the error shape includes new fields, and add the
scenario to the error matrix in this document.

---

### Change token cookie names or attributes

**Where:** `apps/admin/src/lib/auth/session-constants.ts` + environment variables

Cookie names are driven by `adminRuntimeEnv.accessCookieName` and
`adminRuntimeEnv.refreshCookieName` (with hardcoded fallbacks `"accessToken"` and
`"refreshToken"`). To rename them:

1. Update `ADMIN_ACCESS_COOKIE_NAME` / `ADMIN_REFRESH_COOKIE_NAME` in `.env` and
   `.env.example`.
2. Verify `session-constants.ts` and `adminRuntimeEnv` read those variables correctly.
3. Verify `clearKnownAuthCookies` in `next-response-cookies.ts` includes the new names
   so stale cookies are cleaned up on 401.

Do **not** change cookie attributes (e.g., `httpOnly`, `secure`) inside
`setAccessTokenCookie` directly — those are controlled by `createCookieBaseOptions()`
which reads from `adminRuntimeEnv`. Change the env vars instead.

---

### Add "Remember Me" (deferred from V1)

**Status:** Deliberately excluded from V1. The checkbox was removed from the login form.

**Where to implement:**

1. **Schema** — `features/auth/schemas/login.schema.ts`: add `rememberMe: z.boolean().optional()` to `loginSchema`.
2. **Component** — `features/auth/components/login-form.tsx`: add the checkbox and wire it to RHF.
3. **Service** — `features/auth/services/login.service.ts`: include `rememberMe` in the POST body.
4. **Handler** — `features/auth/server/login.handler.ts`: pass `rememberMe` to `setAccessTokenCookie` / `setSessionCookie` as a `maxAge` override. Long-lived cookies should use a configurable extended duration (e.g., 30 days).
5. **Cookie helper** — `lib/auth/next-response-cookies.ts`: `setSessionCookie` accepts an optional `maxAge` parameter.

The server-side handler is the correct place to control cookie lifetime. The UI only
passes the boolean preference — cookie duration decisions must not live in client code.

---

### Add "Forgot Password"

**Where to implement:**

| Step | File | Layer | What to do |
|---|---|---|---|
| 1 | `features/auth/schemas/login.schema.ts` | Schema | Add `forgotPasswordSchema` (email only) |
| 2 | `features/auth/types/auth.types.ts` | Types | Add `ForgotPasswordRequest`, `ForgotPasswordServiceResult` |
| 3 | `features/auth/services/forgot-password.service.ts` | Service | `fetch POST /api/auth/forgot-password` — new file |
| 4 | `features/auth/server/forgot-password.handler.ts` | Server | Validates request, calls `POST /api/v1/admin/auth/forgot-password` (or equivalent backend endpoint), returns envelope — new file |
| 5 | `app/api/auth/forgot-password/route.ts` | Route | Thin delegator: `return forgotPasswordHandler(request)` — new file |
| 6 | `features/auth/hooks/use-forgot-password.ts` | Hook | RHF + service call + success/error state — new file |
| 7 | `features/auth/components/forgot-password-form.tsx` | Component | UI only, delegates to hook — new file |

Follow the same four-layer pattern (component → hook → service → handler) as the login
flow. Do not add business logic to the route handler or the component.

---

## Known Limitations

### `as unknown as TokenResponse` type assertion

The OpenAPI-generated `Result` type in `packages/api-client/src/generated/schema.ts`
only captures `isSuccess`, `error`, and `isFailure` — it does not include the token
fields (`accessToken`, `refreshToken`, `tokenType`, `expiresIn`). The backend Swagger
schema does not fully describe the success payload.

As a result, `login.handler.ts` uses:

```ts
const tokenData = apiResult.data as unknown as TokenResponse;
```

This is intentional and safe given the runtime guard that follows (a 502 is returned if
`tokenData.accessToken` is absent). It will self-heal when the backend OpenAPI
description is updated and `pnpm --filter @cafedebug/api-client run contract:check` regenerates the types.

**Do not remove the runtime guard** that validates token fields before setting cookies.

---

### Duplicate log entries on transport errors (ISSUE-05)

In `login.handler.ts`, the `catch` block calls `logger.error(apiRequestFailed)` before
`createErrorResponse` also logs the same error. This results in two log entries per
transport failure. It is a cosmetic observability issue and does not affect behaviour.
This is tracked as a carry-forward item — fix it by removing the redundant `logger.error`
call inside the `catch` block (the one in `createErrorResponse` is sufficient).

---

## Observability Reference

| Event constant | Location | Log level | Triggered when |
|---|---|---|---|
| `authLoginValidationFailed` | Handler + Hook | `warn` | Schema validation fails (server or client) |
| `authLoginFailed` | Handler | `warn` | Backend returns 401 or other 4xx |
| `authLoginSuccess` | Handler + Hook | `info` | Successful login and cookie establishment |
| `authLoginServiceUnavailable` | Handler + Hook | `error` | Config missing or network/transport failure |
| `apiRequestFailed` | Handler | `warn` | Any non-success response from backend |

Sentry breadcrumbs are added before the backend call, after success, and after service
failure. `captureException` is called only on transport errors (not on 4xx responses,
which are expected failure modes).

---

## Architecture Decisions

### Why tokens are set as HttpOnly cookies by the handler

Tokens must not be accessible to browser JavaScript. Setting them as `HttpOnly` cookies
in the server-side handler ensures they are never exposed to the client-side JavaScript
bundle. The browser automatically sends them with subsequent requests, and the middleware
can read them server-side without any client involvement.

### Why there is a session signal cookie

The middleware needs to quickly decide whether to attempt session validation or redirect
immediately to `/login`. Reading and validating a JWT on every middleware invocation is
expensive. The `cafedebug_admin_session` cookie acts as a lightweight signal: if it is
absent, the middleware can skip token validation entirely and redirect. The actual token
validation happens only when the signal cookie is present.

### Why the service calls `/api/auth/login` and not the backend directly

Client-side code cannot set `HttpOnly` cookies. Only server-side code (the Next.js route
handler and its handler) can do that. The service POSTs to the internal Next.js API
route, which in turn calls the backend — this is the only architecture that allows
session cookies to be set securely.

### Why the route handler has no logic

`app/api/auth/login/route.ts` contains exactly one line of logic: `return loginHandler(request)`. This keeps all testable business logic in `features/auth/server/login.handler.ts`, which can be imported and tested without instantiating a full Next.js route environment.
