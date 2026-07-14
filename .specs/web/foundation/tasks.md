# Tasks: `apps/web` Foundation — Slice 1

| Field | Value |
|---|---|
| **Status** | `Ready for implementation` |
| **Spec** | `.specs/web/foundation/spec.md` |
| **Design** | `.specs/web/foundation/design.md` |
| **UX design reference** | `.specs/web/foundation/ux-design-reference.md` (from `cafedebug.pen`) — visual source of truth; §8 is the Slice-1 build checklist |
| **Affected app** | `apps/web` |
| **Execution order** | Phases are sequential; validate each phase before starting the next |

---

## Execution Rules

- Each task specifies **file(s)**, **layer**, **change type**, **steps**, **validation**.
- Tasks within a phase may run in parallel unless a dependency is noted.
- Follow `.github/copilot-instructions.md`: `app/` routing-only, feature logic in
  `features/<domain>`, infra in `lib/`, no hardcoded colors, no `fetch` in components/pages.
- Server Components by default; add `"use client"` **only** to the theme and player files
  listed in `design.md` §1.2.
- Match the finished design in `ux-design-reference.md` (extracted from `cafedebug.pen`): use its
  token values (§1), site components (§3), and per-page/player guidance (§4–§5). Slice-1 scope is
  its §8 checklist; pages tagged `[Deferred]` are reference-only.
- Do **not** implement anything in spec §3 "Out of scope."
 - Modify `packages/design-tokens` only for the approved atomic rename to `packages/admin-design-tokens`, add `packages/web-design-tokens`, and update the required admin package references. Do not change admin token CSS values, selectors, or UI behavior.

---

## Phase 0 — Prerequisites & Decisions

### Task 0.1 — Confirm versions & port
| Field | Value |
|---|---|
| **File** | N/A (decision record) |
| **Layer** | Planning |
| **Change type** | Verification |

**Steps:**
1. Confirm pinned majors from `apps/admin/package.json`: `next ^16.2.3`, `react/react-dom
   ^19.1.0`, `zod ^4.3.6`, `typescript ^6.0.0`, `eslint ^9`, `@next/eslint-plugin-next ^16.2.3`.
2. Confirm web dev port = `3000` (admin = `3001`; no collision under `pnpm dev`).
3. Confirm Tailwind target = **v4** for web (per spec decision R-1).

**Validation:** versions/port/Tailwind target recorded; no conflict with admin scripts.

---

## Phase 0.5 — Token Package Split & Admin Compatibility

> **Goal:** establish independent token ownership without changing admin behavior.

### Task 0.2 — Rename the admin token package and add the web token package

**Files:** `packages/design-tokens/` → `packages/admin-design-tokens/`; `packages/web-design-tokens/{package.json,styles.css}`
**Layer:** packages
**Change type:** Rename / Addition

**Steps:** rename the existing package to `@cafedebug/admin-design-tokens` without changing `styles.css`; create `@cafedebug/web-design-tokens` with the authoritative web token contract from `ux-design-reference.md` §1.

**Validation:** the two package names and CSS exports are distinct; web values do not appear in the admin package.

### Task 0.3 — Migrate admin token-package references

**Files:** `apps/admin/package.json`, `apps/admin/src/app/layout.tsx`, `apps/admin/next.config.ts`, `infra/docker/admin/Dockerfile`, `pnpm-lock.yaml`
**Layer:** config / infrastructure
**Change type:** Modification / Regeneration

**Steps:** update every package name, CSS import, transpilation entry, and Docker manifest-copy path; regenerate the lockfile.

**Validation:** no old package references remain; admin imports the renamed CSS package and its existing checks remain green.

---

## Phase 1 — Scaffold & Config

> **Goal:** replace the placeholder package with a buildable (empty) Next.js 16 app.

### Task 1.1 — Replace `package.json`
| Field | Value |
|---|---|
| **File** | `apps/web/package.json` |
| **Layer** | config |
| **Change type** | Replacement |

**Steps:** set real scripts and deps per `design.md` §9.1 (name stays `@cafedebug/web`, keep
`private`, `type: module`, `version 0.1.0`). Add `@cafedebug/web-design-tokens` as a `workspace:*` dependency; keep `@cafedebug/eslint-config` and `@cafedebug/tsconfig` as `workspace:*` devDependencies.

**Validation:** `pnpm install` from repo root resolves with no errors; `@cafedebug/web` shows
the new deps.

### Task 1.2 — `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, `next.config.ts`
| Field | Value |
|---|---|
| **Files** | `apps/web/{tsconfig.json,eslint.config.mjs,postcss.config.mjs,next.config.ts}` |
| **Layer** | config |
| **Change type** | Addition |

**Steps:** author each per `design.md` §9.2–§9.5. `postcss.config.mjs` uses
`@tailwindcss/postcss` (NOT `autoprefixer`). `next.config.ts` = `reactStrictMode` +
`outputFileTracingRoot` (repo root), no Sentry.

**Validation:** `pnpm --filter @cafedebug/web run typecheck` runs (may report "no inputs" until
Phase 2) with no config errors.

### Task 1.3 — `.env.example` + `lib/env.ts`
| Field | Value |
|---|---|
| **Files** | `apps/web/.env.example`, `apps/web/src/lib/env.ts` |
| **Layer** | lib |
| **Change type** | Addition |

**Steps:** per `design.md` §9.6. Only `NEXT_PUBLIC_SITE_URL` for this slice.

**Validation:** importing `env` typechecks; missing/invalid URL throws at boot.

### Task 1.4 — App entry + global CSS shell
| Field | Value |
|---|---|
| **Files** | `apps/web/src/app/globals.css`, minimal `apps/web/src/app/layout.tsx`, `apps/web/src/app/page.tsx` (temporary "Hello"), `apps/web/next-env.d.ts` |
| **Layer** | app |
| **Change type** | Addition |

**Steps:** create `globals.css` with the `@import "tailwindcss"` + token imports (token files
land in Phase 2 — import paths must resolve, so create empty placeholders if needed). Add a
minimal server `layout.tsx` (`<html lang="pt-BR"><body>{children}</body></html>`) and a
temporary `page.tsx` to prove the build.

**Validation:** `pnpm --filter @cafedebug/web run build` succeeds; `dev` serves a page on
`:3000`.

---

## Phase 2 — Web Design System

> **Goal:** web-only tokens + Tailwind v4 mapping. Depends on Phase 0.5 and Phase 1.

### Task 2.1 — `packages/web-design-tokens/styles.css`
| Field | Value |
|---|---|
| **File** | `packages/web-design-tokens/styles.css` |
| **Layer** | styles |
| **Change type** | Addition |

**Steps:** define `:root` and `.dark` semantic variables using the **authoritative values from `ux-design-reference.md` §1**: constant `#FF8400` primary, JetBrains Mono + Geist, 16px cards, pill controls, and always-dark header/footer tokens. The decision is final; do not re-open it.

**Validation:** no raw colors outside this file (grep components later); file imported by
`globals.css`; values match `ux-design-reference.md` §1.

### Task 2.2 — `apps/web/src/styles/theme.css` (+ dark variant) and `typography.css`
| Field | Value |
|---|---|
| **Files** | `apps/web/src/styles/{theme.css,typography.css}`, `apps/web/src/app/globals.css` |
| **Layer** | styles |
| **Change type** | Addition |

**Steps:** import `@cafedebug/web-design-tokens/styles.css` from `globals.css`; add `@custom-variant dark (&:where(.dark, .dark *));` + `@theme inline` mapping per
`design.md` §2.3; typography `@font-face`/prose (system-font fallbacks acceptable for skeleton).

**Validation:** `build` succeeds; a probe element using `bg-header`, `text-primary`,
`rounded-card`, `dark:bg-background` compiles and renders correctly under `.dark`.

---

## Phase 3 — Theme System

> **Goal:** FOUC-free light/dark via `next-themes` + cookie. Depends on Phase 2.

### Task 3.1 — `lib/theme.ts`
| Field | Value |
|---|---|
| **File** | `apps/web/src/lib/theme.ts` |
| **Layer** | lib |
| **Change type** | Addition |

**Steps:** `THEME_COOKIE`, `ThemePref`, `DEFAULT_THEME="dark"`, `getThemePref()`,
`resolveInitialThemeClass()` per `design.md` §3.2.

**Validation:** unit-covered in Phase 9; typechecks.

### Task 3.2 — `components/theme-provider.tsx` + `app/providers.tsx`
| Field | Value |
|---|---|
| **Files** | `apps/web/src/components/theme-provider.tsx`, `apps/web/src/app/providers.tsx` |
| **Layer** | components / app |
| **Change type** | Addition |

**Steps:** `theme-provider.tsx` (`"use client"`) wraps `next-themes` `ThemeProvider`
(`attribute="class"`, `defaultTheme="dark"`, `enableSystem`, `disableTransitionOnChange`).
`providers.tsx` (`"use client"`) composes `<ThemeProvider>` **and** `<PlayerProvider>` (the
latter added in Phase 6 — leave a typed slot / import once it exists).

**Validation:** provider renders without hydration warnings.

### Task 3.3 — `components/theme-toggle.tsx`
| Field | Value |
|---|---|
| **File** | `apps/web/src/components/theme-toggle.tsx` |
| **Layer** | components |
| **Change type** | Addition |

**Steps:** `"use client"`; `useTheme()`; on toggle, `setTheme(next)` **and** write `cd-theme`
cookie (`document.cookie`); `lucide-react` sun/moon icons; pt-BR `aria-label`.

**Validation:** toggling flips `.dark` on `<html>` and updates the cookie.

### Task 3.4 — Wire theme into root layout
| Field | Value |
|---|---|
| **File** | `apps/web/src/app/layout.tsx` |
| **Layer** | app |
| **Change type** | Modification |

**Steps:** `await getThemePref()` → `resolveInitialThemeClass()` → `<html lang="pt-BR"
className={initialClass} suppressHydrationWarning>`; wrap `{children}` in `<Providers>`; apply
`defaultMetadata` (Phase 8 provides it — temporary inline until then).

**Validation (DoD AC-09):** cold load with `cd-theme=light` renders light on first paint (no
flash); with `dark`/absent renders dark; toggling persists across reload.

---

## Phase 4 — Layout & Shell

> **Goal:** header/footer/nav. Depends on Phase 3.

### Task 4.1 — `components/ui/button.tsx` + `lib/utils.ts`
| Field | Value |
|---|---|
| **Files** | `apps/web/src/components/ui/button.tsx`, `apps/web/src/lib/utils.ts` |
| **Layer** | components / lib |
| **Change type** | Addition |

**Steps:** `cn()` = `clsx` + `tailwind-merge`; minimal token-themed `Button` (server-safe, no
client hooks) with variants used by the shell/hero.

**Validation:** typechecks; renders with token classes only (no hardcoded colors).

### Task 4.2 — `components/layout/{header,footer,nav}.tsx`
| Field | Value |
|---|---|
| **Files** | `apps/web/src/components/layout/{header.tsx,footer.tsx,nav.tsx}` |
| **Layer** | components |
| **Change type** | Addition |

**Steps:** server components per `design.md` §4. Header `bg-header text-header-foreground` +
brand + `<Nav/>` + `<ThemeToggle/>`. Footer brand + labeled social placeholders + pt-BR
copyright. Nav links only to `/` and `#episodios` (no dead links, FR-6/AC-17).

**Validation:** header/footer charcoal in both themes (AC-10); no link 404s.

### Task 4.3 — Render shell in root layout
| Field | Value |
|---|---|
| **File** | `apps/web/src/app/layout.tsx` |
| **Layer** | app |
| **Change type** | Modification |

**Steps:** render `<Header/>`, `{children}`, `<Footer/>` inside `<Providers>`;
`<MiniPlayer/>` slot added in Phase 6.

**Validation:** every route shows header/footer; layout is the persistent shell.

---

## Phase 5 — Episodes Feature (mock data)

> **Goal:** typed mock data + episode UI. Depends on Phase 4.

### Task 5.1 — `types.ts`, `schemas.ts`, `mock/episodes.mock.ts`
| Field | Value |
|---|---|
| **Files** | `apps/web/src/features/episodes/{types.ts,schemas.ts,mock/episodes.mock.ts}` |
| **Layer** | features/episodes |
| **Change type** | Addition |

**Steps:** `Episode` type + `episodeSchema` (Zod) per `design.md` §6.1; ≥4 pt-BR fixtures with
placeholder `audioUrl`/`artworkUrl` (local `public/mock/*` or silent-audio placeholder).

**Validation:** every fixture satisfies `episodeSchema` (asserted in Phase 9).

### Task 5.2 — `server/{list-episodes,get-episode}.ts` + `mappers.ts`
| Field | Value |
|---|---|
| **Files** | `apps/web/src/features/episodes/server/{list-episodes.ts,get-episode.ts}`, `apps/web/src/features/episodes/mappers.ts` |
| **Layer** | features/episodes/server |
| **Change type** | Addition |

**Steps:** functions per `design.md` §6.2 (read fixtures); `episodeToTrack(ep): Track` mapper.
Add a `// TODO(api): replace mock with @cafedebug/api-client + "use cache"/cacheTag` marker.

**Validation:** `getEpisode("unknown")` returns `null`; `listEpisodes()` returns fixtures.

### Task 5.3 — Episode components
| Field | Value |
|---|---|
| **Files** | `apps/web/src/features/episodes/components/{episode-hero,episode-card,episode-related,show-notes,play-button}.tsx` |
| **Layer** | features/episodes/components |
| **Change type** | Addition |

**Steps:** all server components **except** `play-button.tsx` (`"use client"`, calls
`usePlayer.getState().load(episodeToTrack(ep))`). `show-notes.tsx` renders mock HTML with prose
classes. Cards/hero use `next/image` with placeholder art (local files, no remote patterns).

**Validation:** components render from mock data; only `play-button.tsx` has `"use client"`.

### Task 5.4 — `structured-data.ts`
| Field | Value |
|---|---|
| **File** | `apps/web/src/features/episodes/structured-data.ts` |
| **Layer** | features/episodes |
| **Change type** | Addition |

**Steps:** `podcastEpisodeJsonLd(ep, baseUrl): WithContext<PodcastEpisode>` (`schema-dts`) with
`partOfSeries` → `PodcastSeries` (design §8.2).

**Validation:** returns required fields (`@context`, `@type`, `name`, `url`, `datePublished`);
asserted in Phase 9.

---

## Phase 6 — Persistent Player Skeleton

> **Goal:** one `<audio>`, persistent across navigation. Depends on Phase 5 (Track mapper) & 3
> (providers).

### Task 6.1 — `features/player/{types.ts,store.ts}`
| Field | Value |
|---|---|
| **Files** | `apps/web/src/features/player/{types.ts,store.ts}` |
| **Layer** | features/player |
| **Change type** | Addition |

**Steps:** `Track` type; Zustand store per `design.md` §5.1.

**Validation:** `usePlayer.getState().load(track)` sets `track` + `isPlaying=true`.

### Task 6.2 — `player-provider.tsx` + `media-session.ts`
| Field | Value |
|---|---|
| **Files** | `apps/web/src/features/player/{player-provider.tsx,media-session.ts}` |
| **Layer** | features/player |
| **Change type** | Addition |

**Steps:** `"use client"` provider owns the single `<audio>`, drives it from the store, and
calls `useMediaSession(audioRef)` (play/pause/seek handlers, metadata). Mount `<PlayerProvider>`
in `app/providers.tsx` (Task 3.2 slot).

**Validation (AC-08):** exactly one `<audio>` in the DOM.

### Task 6.3 — `mini-player.tsx` (persistent) + render in layout
| Field | Value |
|---|---|
| **Files** | `apps/web/src/features/player/mini-player.tsx`, `apps/web/src/app/layout.tsx` |
| **Layer** | features/player / app |
| **Change type** | Addition / Modification |

**Steps:** `"use client"` sticky bottom bar reading the store; hidden when `track === null`;
Play/Pause + progress placeholder. Render `<MiniPlayer/>` in the root layout (persistent).

**Validation (AC-07):** Play on Home → mini-player appears and audio plays → `<Link>` navigate
to episode → same audio keeps playing.

### Task 6.4 — `full-player.tsx`
| Field | Value |
|---|---|
| **File** | `apps/web/src/features/player/full-player.tsx` |
| **Layer** | features/player |
| **Change type** | Addition |

**Steps:** `"use client"`; commands the shared store (no second `<audio>`); play/pause,
±15/30s, rate; reflects "playing" when the store track is this episode.

**Validation:** controls mutate the shared store; no duplicate `<audio>`.

---

## Phase 7 — Pages & Route UX

> **Goal:** thin Home + episode detail. Depends on Phases 5–6.

### Task 7.1 — Home `app/page.tsx`
| Field | Value |
|---|---|
| **File** | `apps/web/src/app/page.tsx` |
| **Layer** | app |
| **Change type** | Replacement (removes temporary Phase-1 page) |

**Steps:** thin RSC per `design.md` §7.1: hero + episode grid (`#episodios`) + news placeholder
+ newsletter placeholder (no form) + socials, from `listEpisodes()`.

**Validation (AC-05, AC-11):** renders all sections from mock data; no logic/`fetch`/schema in
the file.

### Task 7.2 — Episode detail `app/episodes/[slug]/page.tsx` (+ segment `loading.tsx`)
| Field | Value |
|---|---|
| **Files** | `apps/web/src/app/episodes/[slug]/{page.tsx,loading.tsx}` |
| **Layer** | app |
| **Change type** | Addition |

**Steps:** thin RSC per `design.md` §7.2: `generateStaticParams`, `generateMetadata`,
`notFound()` on miss, hero + full player + show notes + related + `PodcastEpisode` JSON-LD.

**Validation (AC-06, AC-13):** renders for every mock slug; unknown → 404; JSON-LD present.

### Task 7.3 — `loading.tsx`, `error.tsx`, `not-found.tsx` (top level)
| Field | Value |
|---|---|
| **Files** | `apps/web/src/app/{loading.tsx,error.tsx,not-found.tsx}` |
| **Layer** | app |
| **Change type** | Addition |

**Steps:** `error.tsx` is `"use client"` with `{ error, reset }`; others are server components.

**Validation:** 404 route renders `not-found.tsx`; forced error renders `error.tsx` with a
working reset.

---

## Phase 8 — SEO Basics

> **Goal:** metadata, JSON-LD, robots, sitemap. Depends on Phase 5 (data) & 7 (pages).

### Task 8.1 — `lib/seo/metadata.ts` + `lib/seo/jsonld.ts`
| Field | Value |
|---|---|
| **Files** | `apps/web/src/lib/seo/{metadata.ts,jsonld.ts}` |
| **Layer** | lib/seo |
| **Change type** | Addition |

**Steps:** `defaultMetadata` + `buildEpisodeMetadata(ep)` (design §8.1); `organizationJsonLd()`
+ `podcastSeriesJsonLd()` (design §8.2). Wire `defaultMetadata` into `app/layout.tsx` and inject
Organization/PodcastSeries JSON-LD once.

**Validation (AC-15):** home + episode emit title template, canonical, OG, Twitter card.

### Task 8.2 — `app/robots.ts` + `app/sitemap.ts` + `public/og-default.png`
| Field | Value |
|---|---|
| **Files** | `apps/web/src/app/{robots.ts,sitemap.ts}`, `apps/web/public/og-default.png` |
| **Layer** | app / public |
| **Change type** | Addition |

**Steps:** per `design.md` §8.3; sitemap from `listEpisodes()` + existing routes only; add a
placeholder OG image.

**Validation (AC-14):** `/robots.txt` and `/sitemap.xml` serve; sitemap lists all mock episode
URLs and no non-existent routes.

### Task 8.3 — `lib/i18n.ts` passthrough
| Field | Value |
|---|---|
| **File** | `apps/web/src/lib/i18n.ts` |
| **Layer** | lib |
| **Change type** | Addition |

**Steps:** `export const t = (s: string) => s;` — seed the pt-BR convention (strategy §2.14);
use for user-facing strings where convenient. `<html lang="pt-BR">` already set (Phase 3).

**Validation:** typechecks; no behavior change.

---

## Phase 9 — Smoke Tests

> **Goal:** `node --test` parity with admin. Depends on Phases 3, 5.

### Task 9.1 — Tests
| Field | Value |
|---|---|
| **Files** | `apps/web/tests/{mock-episodes.test.mjs,structured-data.test.mjs,theme-resolve.test.mjs}` |
| **Layer** | tests |
| **Change type** | Addition |

**Steps:**
- `mock-episodes`: every fixture parses against `episodeSchema`.
- `structured-data`: `podcastEpisodeJsonLd` returns required fields for a sample episode.
- `theme-resolve`: `resolveInitialThemeClass`/`getThemePref` mapping (`light→""`,
  `dark/system/absent→"dark"`).

**Validation (AC-02):** `pnpm --filter @cafedebug/web run test` exits 0.

---

## Phase 10 — Validation Gate

### Task 10.1 — Full app validation
| Field | Value |
|---|---|
| **File** | N/A |
| **Layer** | CI-equivalent (local) |
| **Change type** | Verification |

**Steps (in order):**
1. `pnpm --filter @cafedebug/web run lint`
2. `pnpm --filter @cafedebug/web run typecheck`
3. `pnpm --filter @cafedebug/web run test`
4. `pnpm --filter @cafedebug/web run build`
5. `pnpm turbo run build` (root) — confirm **both** `@cafedebug/web` (v4) and
   `@cafedebug/admin` (v3) build (AC-16).

**Validation (AC-01, AC-02, AC-16):** all commands exit 0.

### Task 10.2 — Manual DoD checks
| Field | Value |
|---|---|
| **File** | N/A |
| **Layer** | QA |
| **Change type** | Verification |

**Steps:** run `dev` on `:3000` and verify AC-05, AC-06, AC-07, AC-08, AC-09, AC-10, AC-17;
validate one episode's JSON-LD in the Schema Markup Validator (AC-13); confirm `/robots.txt` and
`/sitemap.xml` (AC-14). Grep for hardcoded colors (AC-04) and stray `"use client"` (AC-12).

**Validation:** all listed acceptance criteria pass.

---

## Phase 11 — Documentation & Follow-ups

### Task 11.1 — Update `.specs/README.md` index
| Field | Value |
|---|---|
| **File** | `.specs/README.md` |
| **Layer** | docs |
| **Change type** | Addition |

**Steps:** add a `web` section (or row) to the Spec Index:
```markdown
### `web`

| Feature | Status | Path | Description |
|---|---|---|---|
| Web Foundation (Slice 1) | `Ready for implementation` | `.specs/web/foundation/` | Next.js 16 App Router scaffold: independent web token package, Tailwind v4, next-themes, shell, mocked Home + episode detail, persistent player skeleton, SEO basics |
```

**Validation (AC-18):** row present under a `web` section.

### Task 11.2 — Record follow-up specs (pointers only)
| Field | Value |
|---|---|
| **File** | this `tasks.md` (this section) |
| **Layer** | docs |
| **Change type** | Record |

**Deferred to later slices / specs (do NOT implement here):**
- **`.specs/platform/tailwind-v4-migration/`** — migrate `apps/admin` Tailwind v3 → v4 (R-2);
  align token model and PostCSS plugin while retaining `@cafedebug/admin-design-tokens` ownership.
- Real API integration slice — swap mock `server/*` for `@cafedebug/api-client` + `"use cache"`/
  `cacheTag`; add `NEXT_PUBLIC_API_URL`, `images.remotePatterns`.
- RSS `/feed.xml`; dynamic per-episode OG via `next/og`.
- `media-chrome` player chrome; real audio sources.
- Docker parity (`output: "standalone"` + `infra/docker/web/`); `web-ci.yml` gate.
- shadcn/ui registry init when component pressure grows; full `next-intl` i18n.
- Phase 2+ features: Remark42, newsletter, analytics + cookie banner, contact.

**Validation:** pointers recorded; no scope creep into this slice.

---

## Phase Summary

| Phase | Focus | Depends on | Risk |
|---|---|---|---|
| 0 | Versions/port/Tailwind decision | — | Trivial |
| 1 | Scaffold & config | 0 | Medium (toolchain) |
| 2 | App-local design system (Tw v4) | 1 | Medium |
| 3 | Theme system (next-themes + cookie) | 2 | Medium (FOUC) |
| 4 | Layout & shell | 3 | Low |
| 5 | Episodes feature (mock) | 4 | Low |
| 6 | Persistent player skeleton | 5, 3 | Medium (persistence) |
| 7 | Pages & route UX | 5, 6 | Low |
| 8 | SEO basics | 5, 7 | Low |
| 9 | Smoke tests | 3, 5 | Low |
| 10 | Validation gate | 1–9 | Medium (v4/v3 isolation) |
| 11 | Docs & follow-ups | 10 | Trivial |
