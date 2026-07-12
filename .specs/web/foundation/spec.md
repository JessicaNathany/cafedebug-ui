# Spec: `apps/web` Foundation — Slice 1

| Field | Value |
|---|---|
| **Status** | `Draft` |
| **Domain** | `web/foundation` |
| **Spec path** | `.specs/web/foundation/` |
| **Affected app** | `apps/web` |
| **Strategy source** | `.specs/web/cafedebug-web-foundation-v2.md` (web source-of-truth) |
| **Related specs** | `.specs/admin/login/` (structural reference), `.specs/platform/nextjs-16-migration/` (platform baseline) |
| **Created** | 2026-07-12 |
| **Phase** | Phase 1 (Foundation) — first slice only |

---

## 1. Problem Statement

`apps/web` currently exists only as a **placeholder workspace package** (`@cafedebug/web`)
whose scripts print stub messages. There is no Next.js app, no routing, no styling, and no
UI. The public website — the SEO-sensitive, content-driven face of CafeDebug — cannot be
built until a real application foundation exists.

This spec defines the **first foundation slice**: converting the placeholder into a real
**Next.js 16 App Router** application with the minimum scaffold needed to render a themed,
navigable, SEO-aware shell containing a **mocked** Home page and a **mocked** episode detail
page, plus a **persistent audio player skeleton** that survives client-side navigation.

The slice deliberately stops short of real backend integration and all downstream community
features. It establishes the **architectural spine** (feature-based structure, app-local
design system, Server-Components-first rendering, one client island for theme and one for the
player) so that later slices add capability without re-litigating structure.

This spec follows the strategy locked in `cafedebug-web-foundation-v2.md`, adapted to the
**actual repository baseline** (see §8 for the reconciliations that matter — chiefly Tailwind
v4 for web while `apps/admin` remains on v3 pending a separate migration).

---

## 2. User and Business Context

| Dimension | Detail |
|---|---|
| **Primary audience** | Public visitors and podcast listeners (unauthenticated) |
| **Secondary audience** | Contributors navigating the codebase; a developer who knows `apps/admin` should navigate `apps/web` instantly (same folder shapes) |
| **Business criticality** | High for the platform roadmap — Website V1 (README Phased Plan step 3) cannot start without this foundation |
| **SEO posture** | Content-first: episode pages must be discoverable; metadata, canonical URLs, and structured data are part of the route definition, not an afterthought |
| **Brand** | Dark charcoal header/footer with warm orange accents; web is **dark-first** and brand-forward (distinct from admin's utilitarian light-first system) |
| **Locale** | `pt-BR` (Brazilian Portuguese) for this slice; English deferred |

The website is where CafeDebug is discovered and consumed. Even mocked, the foundation must
render the recognizable brand, be responsive, support light/dark parity, and emit valid SEO
signals so that swapping mock data for the real API in a later slice requires **no structural
change** — only the body of the feature `server/` data functions changes.

---

## 3. Scope

### In scope (Slice 1)

| # | Area | Detail |
|---|---|---|
| S-1 | App scaffold | Convert `@cafedebug/web` placeholder into a real Next.js 16 App Router app with real `dev`/`build`/`lint`/`typecheck`/`test`/`clean` scripts, extending shared `@cafedebug/tsconfig` and `@cafedebug/eslint-config` |
| S-2 | App-local design system | Tailwind v4 (`@theme inline`) with **web-only** tokens under `apps/web/src/styles/` (`tokens.css`, `theme.css`, `typography.css`). **Not** `packages/design-tokens` |
| S-3 | Theme provider | `next-themes`, cookie-backed for FOUC-free SSR, `attribute="class"`, `defaultTheme="dark"`, `enableSystem`; a client theme toggle |
| S-4 | Root layout | Server root layout: fonts, metadata defaults, `ThemeProvider`, `PlayerProvider`, header, footer, persistent mini-player |
| S-5 | Header / footer / nav | Web-specific layout chrome (charcoal in both themes), responsive, no dead links |
| S-6 | Mocked Home page | RSC home: hero (featured episode + Play), recent-episodes grid, news placeholder, newsletter placeholder (no form), social links |
| S-7 | Mocked episode detail | RSC `/episodes/[slug]`: hero, full player, show notes (mock HTML), related episodes, per-page metadata + JSON-LD, `generateStaticParams` from mock slugs |
| S-8 | Persistent audio player skeleton | Zustand store + `PlayerProvider` owning a single `<audio>` mounted in the root layout; persistent mini-player; full player on episode detail commands the same store; Media Session wiring; **no** third-party chrome library yet |
| S-9 | SEO basics | Metadata API defaults + per-episode `generateMetadata`; `PodcastEpisode`/`PodcastSeries`/`Organization` JSON-LD (`schema-dts`); `robots.ts`; `sitemap.ts` (from mock data); static default OG image |
| S-10 | Mock data seam | Per-feature mock fixtures read by feature `server/` functions; typed with domain types + Zod schemas mirroring backend DTO shape |
| S-11 | Route/error UX | `loading.tsx`, `error.tsx` (client), `not-found.tsx` |
| S-12 | Smoke tests | `node --test` smoke tests (parity with admin's test runner) for mock-data shape, JSON-LD builder, and theme resolution |
| S-13 | Follow-up plan (docs only) | Record the planned `apps/admin` Tailwind v3→v4 migration as a **separate** platform spec pointer (no admin changes in this slice) |

### Out of scope (deferred to later slices / phases)

| Area | Reason | Target |
|---|---|---|
| Real API integration / `@cafedebug/api-client` wiring | Explicitly excluded; mock data only | Later Phase-1 slice |
| Remark42 comments | Excluded by request | Phase 2 |
| Newsletter (form + double opt-in + Turnstile) | Excluded by request | Phase 2 |
| Analytics (Plausible/GA) + cookie banner | Excluded by request | Phase 2 |
| Contact form | Excluded by request | Phase 3 |
| RSS `/feed.xml` | Needs real audio/enclosure data | Later Phase-1 slice |
| Dynamic per-episode OG via `next/og` | Static default OG is enough for "basics" | Later Phase-1 slice |
| Episodes listing page (`/episodes`) | Not in the requested deliverable list; podcast apps mostly hit RSS | Optional later |
| `media-chrome` (or any player chrome lib) | Slice ships a skeleton, not final controls | Phase 2 |
| Docker parity + `web-ci.yml` gate | Not requested; web is not in the required CI gate today (README) | Later Phase-1 slice |
| `shadcn/ui` registry init | Hand-roll the 1–2 primitives this slice needs; full registry later | When component pressure exists |
| Full i18n (`next-intl`) | Ship `lang="pt-BR"` + a passthrough `t()` convention only | Phase 4 |
| Sentry wiring | Not requested; keep scaffold minimal | Later |
| `apps/admin` Tailwind v4 migration (execution) | Planned but tracked as its own platform spec | `.specs/platform/tailwind-v4-migration/` |

---

## 4. Functional Requirements

### FR-1 — App becomes a real Next.js 16 App Router app
`apps/web/package.json` (name `@cafedebug/web`) must define real scripts: `dev` (`next dev`
on a port distinct from admin's `3001`), `build` (`next build`), `start`, `lint` (`eslint .`),
`typecheck` (`tsc --noEmit`), `test` (`node --test tests/**/*.test.mjs`), `clean`. It must
extend `@cafedebug/tsconfig/nextjs` and `@cafedebug/eslint-config/next`, and depend on
`next`, `react`, `react-dom` at the repo's pinned majors (Next 16, React 19).

### FR-2 — App-local, web-only design tokens
Tokens live in `apps/web/src/styles/tokens.css` (`:root` + `.dark`), mapped to Tailwind
utilities in `theme.css` via `@theme inline`, with `typography.css` for fonts/prose.
`globals.css` imports Tailwind then the three token files. **No import of
`@cafedebug/design-tokens`.** Every visual value used by components resolves to a token; no
hardcoded hex/named-color values in components.

### FR-3 — Light/dark theme with no FOUC
Theme switching uses `next-themes` (`attribute="class"`, `defaultTheme="dark"`,
`enableSystem`, `disableTransitionOnChange`). The chosen theme is persisted in a cookie so the
**server** root layout can render the correct initial `<html>` class on first paint. The
header/footer remain charcoal in **both** themes (brand requirement). A client theme toggle
switches theme and keeps the cookie in sync.

### FR-4 — Thin routes, RSC by default
Files under `src/app/` contain routing/layout/metadata only. No business logic, no direct
`fetch`, no Zod schemas in pages. All data access goes through feature `server/` functions.
Components are Server Components unless they require interactivity; only the theme toggle,
the player provider/UI, and the play buttons are Client Components (`"use client"`).

### FR-5 — Root layout composition
The server root layout must:
1. Set `<html lang="pt-BR">` with the cookie-derived initial theme class and
   `suppressHydrationWarning`.
2. Apply default metadata (title template, description, `metadataBase`, OG defaults).
3. Wrap children in `ThemeProvider` then `PlayerProvider`.
4. Render `<Header />`, `{children}`, `<Footer />`, and the persistent `<MiniPlayer />`.
5. Emit `Organization` (+ `PodcastSeries`) JSON-LD once.

### FR-6 — Header / Footer / Nav
Header renders the brand mark, primary nav, and theme toggle on a charcoal surface;
collapses responsively on mobile. Footer renders brand, pt-BR copyright, and social
placeholders (accessible, labeled). **No links may point to non-existent routes** in this
slice (only `/` and `/episodes/[slug]` exist).

### FR-7 — Mocked Home page
`app/page.tsx` is a thin RSC delegating to feature components. It renders: a hero for a
featured episode with a working Play control; a grid of recent episode cards (each with a
Play control); a "news" placeholder section (pt-BR "em breve"); a newsletter placeholder
(copy only, **no form**); and social links. All content comes from mock fixtures via
`features/episodes/server/list-episodes.ts`.

### FR-8 — Mocked episode detail page
`app/episodes/[slug]/page.tsx` is a thin RSC that:
1. Resolves the episode via `features/episodes/server/get-episode.ts` (mock); calls
   `notFound()` for an unknown slug.
2. Renders hero, full player (commands the shared store — does **not** mount a second
   `<audio>`), show notes (mock HTML), and ≥1 related episode.
3. Exports `generateMetadata` (title/description/canonical/OG) and renders `PodcastEpisode`
   JSON-LD.
4. Exports `generateStaticParams` from mock slugs so pages prerender.

### FR-9 — Persistent audio player skeleton
A single `<audio>` element is owned by `PlayerProvider` (a Client Component mounted in the
root layout) and driven by a Zustand store (`track`, `isPlaying`, `position`, `rate`, plus
`load`/`toggle`/`setRate`). Because the provider lives in the persistent layout, playback
state and the mounted `<audio>` **survive navigation** between Home and episode detail. A
Play control anywhere calls `usePlayer.load(track)`. The mini-player (sticky bottom bar) and
the episode full player both read/command the same store. Media Session metadata + play/pause/
seek handlers are wired. Track audio/artwork use **placeholder** URLs (skeleton scope).

### FR-10 — SEO basics
- Default metadata (title template `%s · CafeDebug`, description, `metadataBase` from
  `NEXT_PUBLIC_SITE_URL`, OG defaults with a static default image, Twitter `summary_large_image`).
- Per-episode `generateMetadata` with canonical `/episodes/[slug]` and audio OG.
- JSON-LD: `Organization` (+ `PodcastSeries`) once in layout; `PodcastEpisode` per episode,
  typed with `schema-dts`.
- `app/robots.ts` and `app/sitemap.ts` (sitemap built from mock episode list + static routes).

### FR-11 — Mock data seam
Each domain exposes typed data through `features/<domain>/server/*` functions that read local
mock fixtures. Domain types + Zod schemas (in `features/<domain>/schemas.ts`) mirror the
expected backend DTO shape so the later real-API swap changes only the function body.

### FR-12 — Route/error UX
Provide top-level `loading.tsx` (skeleton), `error.tsx` (Client Component with `reset`), and
`not-found.tsx`, plus `loading.tsx` for the episode segment.

### FR-13 — Smoke tests
Provide `node --test` tests (parity with admin) covering: mock episode fixtures satisfy the
Zod schema; the `PodcastEpisode` JSON-LD builder returns valid required fields; the theme
cookie resolver maps values correctly.

---

## 5. Non-Functional Requirements

| NFR | Requirement |
|---|---|
| **Architecture** | Feature-based; `app/` is routing-only; feature logic in `features/<domain>/{server,components,schemas,types}`; infra in `lib/` (`.github/copilot-instructions.md`) |
| **Rendering** | Server Components by default; `"use client"` only for theme toggle/provider and player provider/UI/play-button |
| **Design tokens** | No hardcoded colors; all color/spacing/radius/shadow via tokens; light/dark parity (identical layout, preserved hierarchy/contrast/interaction states) |
| **Theme** | Applies instantly, persists (cookie), server-readable (no hydration flash) |
| **Accessibility** | Keyboard-reachable controls with visible focus; ARIA labels in pt-BR; player controls keyboard-operable; images have alt text |
| **SEO** | Valid metadata + canonical on every route; `PodcastEpisode` JSON-LD validates; `robots.txt`/`sitemap.xml` served |
| **Performance** | No layout shift from theme swap; player island kept small; images use `next/image` where applicable |
| **Isolation** | Web tokens/toolchain do not touch admin; adding Tailwind v4 to web must not break admin's v3 build (`turbo run build` green for both) |
| **Consistency** | Folder shapes and config-extension patterns mirror `apps/admin` |
| **No real network** | No calls to the .NET API or `@cafedebug/api-client` in this slice |

---

## 6. Scenarios

### Scenario A — Home renders themed and populated
Visitor opens `/` → server renders header/hero/recent-episodes/news+newsletter placeholders/
footer with the cookie's theme applied on first paint (no flash) → mock episodes appear.

### Scenario B — Play persists across navigation
On `/`, visitor clicks Play on an episode card → `usePlayer.load(track)` sets the store →
mini-player activates and `<audio>` plays → visitor navigates to that episode's detail via a
`<Link>` → the same `<audio>` keeps playing; the full player reflects the "currently playing"
state (no second `<audio>` mounts).

### Scenario C — Theme toggle, no FOUC
Visitor toggles theme → `.dark` class + cookie update instantly, no transition flash → reload
→ server reads the cookie and renders the same theme on first paint.

### Scenario D — Episode metadata & structured data
Crawler requests `/episodes/[slug]` → `generateMetadata` yields title/description/canonical/OG
→ page body includes `PodcastEpisode` JSON-LD that validates in Schema Markup Validator.

### Scenario E — Unknown episode
Request `/episodes/does-not-exist` → `get-episode` returns nothing → `notFound()` renders
`not-found.tsx`.

### Scenario F — Robots & sitemap
`GET /robots.txt` and `GET /sitemap.xml` return valid documents; the sitemap lists `/`, the
marketing/static routes that exist, and every mock episode URL.

### Scenario G — Monorepo build isolation
`turbo run build` builds `@cafedebug/web` (Tailwind v4) and `@cafedebug/admin` (Tailwind v3)
without cross-interference.

---

## 7. Acceptance Criteria

| ID | Criterion |
|---|---|
| AC-01 | `pnpm --filter @cafedebug/web run build` succeeds and produces a Next.js production build |
| AC-02 | `pnpm --filter @cafedebug/web run lint`, `typecheck`, and `test` all exit 0 |
| AC-03 | `apps/web/package.json` extends `@cafedebug/tsconfig` and `@cafedebug/eslint-config`; no `@cafedebug/design-tokens` dependency |
| AC-04 | Web tokens live only in `apps/web/src/styles/`; no component contains a hardcoded hex/named color |
| AC-05 | Home (`/`) renders hero, recent-episodes grid, news placeholder, newsletter placeholder, and socials from mock data |
| AC-06 | `/episodes/[slug]` renders for every mock slug and calls `notFound()` for unknown slugs |
| AC-07 | Clicking Play on Home starts audio; navigating to the episode detail keeps the same audio playing (persistent player) |
| AC-08 | Only one `<audio>` element exists in the DOM at any time |
| AC-09 | Theme toggle switches light/dark instantly, persists via cookie, and a cold reload shows the persisted theme with no FOUC |
| AC-10 | Header and footer use the charcoal surface token in both themes |
| AC-11 | Files under `src/app/` contain no business logic, no `fetch`, no Zod schemas |
| AC-12 | Only theme (toggle/provider) and player (provider/UI/play-button) files carry `"use client"` |
| AC-13 | `PodcastEpisode` JSON-LD is present on episode pages and passes structured-data validation |
| AC-14 | `/robots.txt` and `/sitemap.xml` are served; sitemap includes all mock episode URLs and only existing routes |
| AC-15 | Default + per-episode metadata (title template, canonical, OG, Twitter card) are emitted |
| AC-16 | `turbo run build` builds both `@cafedebug/web` and `@cafedebug/admin` successfully (v4/v3 isolation holds) |
| AC-17 | No navigation link points to a route that does not exist in this slice |
| AC-18 | `.specs/README.md` index includes a `web/foundation` row; a follow-up pointer for the admin Tailwind v4 migration is recorded |

---

## 8. Assumptions, Reconciliations, and Risks

### R-1 — Tailwind v4 (web) vs v3 (admin) coexistence
**Decision:** `apps/web` adopts Tailwind **v4** per the v2 strategy doc; `apps/admin` stays on
**v3** for now. Tailwind config and PostCSS are **app-local** (each app has its own
`postcss.config.mjs`), and web tokens are app-local, so the two versions coexist without a
shared styling surface. **Risk:** a future contributor may assume one Tailwind version repo-
wide. **Mitigation:** document the split in `design.md` §10 and register the admin migration as
its own platform spec (below). **Verify** with `turbo run build` across both apps (AC-16).

### R-2 — Planned `apps/admin` Tailwind v3→v4 migration
Per the request to "also plan to update the Tw v3," this slice **records** the follow-up but
does **not** modify admin. Recommendation: create `.specs/platform/tailwind-v4-migration/`
(spec/design/tasks) to migrate admin from `tailwind.config.ts` + `@tailwind` directives to the
v4 `@theme` model, aligning both apps. Tracked as a task pointer in `tasks.md` (Phase 11).

### R-3 — `next-themes` cookie persistence nuance
`next-themes` persists to `localStorage` by default, which the server cannot read. To keep SSR
FOUC-free (v2 §2.2), the toggle also writes a `cd-theme` cookie and the server layout reads it
to set the initial class. **Risk:** store drift between cookie and `localStorage`. **Mitigation:**
treat the cookie as the server hint and let `next-themes` reconcile on hydration; keep a single
`resolveInitialThemeClass` helper.

### R-4 — Mock→real API swap
Feature `server/` functions return mock fixtures now. **Risk:** mock shapes drift from the real
backend DTOs. **Mitigation:** Zod schemas in `features/<domain>/schemas.ts` model the expected
DTO; smoke tests assert fixtures satisfy them; the later API slice validates responses against
the same schemas.

### R-5 — Player skeleton audio sources
Track `audioUrl`/`artwork` are placeholders. **Risk:** real playback/Media Session artwork is
unverified until real data lands. **Mitigation:** wire the full control/state path now; mark
media-chrome and real sources as Phase-2 follow-ups.

### R-6 — Web dev port
Admin uses `3001`. Web will use a distinct port (proposed `3000`) so `pnpm dev` (parallel
Turborepo) does not collide. Confirmed as an implementation detail in `design.md` §9.

### R-7 — Not in the required CI gate
README states the required gate is admin-only and web is explicitly excluded. This slice keeps
web scripts real and green locally so a `web-ci.yml` can be added later without rework.
