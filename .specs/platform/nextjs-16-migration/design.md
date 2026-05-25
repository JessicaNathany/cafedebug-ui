# Design: Next.js 16 Migration

| Field | Value |
|---|---|
| **Status** | `Implemented` |
| **Spec** | `.specs/platform/nextjs-16-migration/spec.md` |

---

## 1. Dependency Changes

### `apps/admin/package.json`

| Package | Current | Target | Reason |
|---|---|---|---|
| `next` | `^15.3.3` | `^16.2.3` | Framework upgrade |
| `@next/eslint-plugin-next` | `^15.5.14` | `^16.2.3` | Match framework major |
| `@sentry/nextjs` | `^9.47.1` | `^10.48.0` | Next 16 peer dep support (`^16.0.0-0`) |

### `package.json` (root)

| Field | Current | Target | Reason |
|---|---|---|---|
| `engines.node` | `>=20.0.0` | `>=20.9.0` | Next 16 minimum Node version |

### Unchanged

- `react` / `react-dom` (`^19.1.0`) — Next 16 peers accept `^19.0.0`, already satisfied
- `typescript` (`^5.9.3`) — Next 16 requires `>=5.1.0`, already satisfied
- `tailwindcss` (`^3.4.17`) — no change required by Next 16

---

## 2. Middleware → Proxy Migration

### Current: `apps/admin/src/middleware.ts`

```ts
export async function middleware(request: NextRequest) { ... }
export const config = { matcher: [...] };
```

### Target: `apps/admin/src/proxy.ts`

```ts
export default async function proxy(request: NextRequest) { ... }
export const config = { matcher: [...] };
```

### Changes Required

1. **Rename file**: `middleware.ts` → `proxy.ts`
2. **Rename export**: `export async function middleware` → `export default async function proxy`
3. **Logic**: Identical — all auth/session protection stays the same
4. **Runtime**: Moves from Edge to Node.js (proxy runs on Node.js runtime)
5. **`config.matcher`**: Unchanged — still supported in `proxy.ts`

### Observability Event Names (Cosmetic)

Update `events.ts` to reflect the proxy naming:

| Current | Target |
|---|---|
| `middlewareSessionRedirect` | `proxySessionRedirect` |
| `middlewareSessionValidationError` | `proxySessionValidationError` |

Also update the string values:

| Current | Target |
|---|---|
| `"middleware.session.redirect"` | `"proxy.session.redirect"` |
| `"middleware.session.validation_error"` | `"proxy.session.validation_error"` |

And update references in `proxy.ts` (formerly `middleware.ts`) that log these events.

---

## 3. Sentry Configuration Impact

### `sentry.edge.config.ts`

With `proxy.ts` running on Node.js runtime (not Edge), `sentry.edge.config.ts` becomes
unused for request interception. However:

- The file is harmless — Sentry only loads it when Edge runtime code executes
- No removal needed in this migration — track as tech debt if desired
- Proxy-related Sentry initialization is covered by `sentry.server.config.ts`

### `withSentryConfig` wrapper

The `next.config.ts` wrapping pattern:

```ts
export default withSentryConfig(nextConfig, { silent: true });
```

Must be verified against `@sentry/nextjs` v10 API. The v10 SDK may require
additional or different options. If the API has changed, adjust accordingly.

---

## 4. Build and Turbopack

Next.js 16 defaults to Turbopack for both dev and build. The admin app has no
custom webpack configuration, so Turbopack should work out of the box.

If Turbopack causes issues during build:
- Fallback: `next build --webpack`
- Investigate and track as separate follow-up

---

## 5. Rollback Strategy

If the migration fails validation:

1. Revert `apps/admin/package.json` changes
2. Revert `package.json` engine change
3. Rename `proxy.ts` back to `middleware.ts` and restore named export
4. Revert `events.ts` changes
5. Run `pnpm install` to restore lockfile
6. Verify `pnpm ci:validation` passes on reverted state
