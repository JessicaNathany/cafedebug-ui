# CafeDebug `apps/web` — Foundation Plan (v2)

**Bottom line:** Scaffold `apps/web` as a Next.js 16 App Router + Tailwind v4 application that mirrors the **structure** (not the design) of `apps/admin`, lean on Server Components by default, ship a Zustand-backed persistent audio player from day one, and self-host Remark42 alongside the existing .NET backend — Remark42 has built-in Discord OAuth and a Slack-compatible webhook endpoint, so the Discord community bridges with near-zero glue code.

**Design-system stance (v2 update):** admin and web have **completely independent design systems and tokens**. Tokens are app-local (`apps/web/src/styles/tokens.css`, `apps/admin/src/styles/tokens.css`); they do not share a package. Each app owns its own shadcn/ui registry. `packages/ui` is downgraded to optional/slim (behavior-only utilities) or retired entirely.

## TL;DR
- **Stack you should commit to today:** Next.js 16 (App Router, RSC-first, Turbopack), Tailwind v4 with `@theme` CSS variables (app-local, web-only tokens), shadcn/ui + lucide-react (each app owns its own registry), `next-themes` for dark/light (cookie-backed for FOUC-free SSR), Zustand for the persistent audio player, React Hook Form + Zod for forms, Vitest/Playwright/MSW for tests (parity with `apps/admin`), Remark42 self-hosted for comments, Plausible (self-hosted) for analytics.
- **Architectural spine:** Server Components fetch from the .NET API via your generated `@cafedebug/api-client`; Cache Components (`use cache` + `cacheTag`) make episode/news pages effectively SSG with on-demand revalidation from `apps/admin` saves; one Client-Component island in the root layout owns the persistent audio player and Media Session API integration.
- **Build order:** Phase 1 = scaffold + app-local tokens + Home page + episode detail with player + SEO basics + sitemap/robots/RSS; Phase 2 = News + Remark42 + Newsletter + analytics; Phase 3 = Team/About/Contact + i18n hooks; Phase 4 = Events/Jobs/Advertisement + white-label theming.

---

## 1. Folder structure for `apps/web`

Mirror `apps/admin`'s **structural** conventions (`src/app`, `src/features/<domain>`, `src/lib`) so a developer who knows admin can navigate web instantly. The **visual** language is completely different (see §3) — but the folder shapes match.

Coming from C#/Java: think of `src/features/<domain>` as a vertical slice / bounded context — each folder owns its UI, server queries, schemas (Zod = "DTO + validation attributes"), and hooks.

```
apps/web/
├─ src/
│  ├─ app/                                 # App Router (file-system routes)
│  │  ├─ layout.tsx                        # Root layout: ThemeProvider, PlayerProvider, fonts, header/footer
│  │  ├─ page.tsx                          # Home (RSC)
│  │  ├─ loading.tsx                       # Top-level Suspense fallback
│  │  ├─ error.tsx                         # Top-level error boundary (Client Component)
│  │  ├─ not-found.tsx
│  │  ├─ globals.css                       # @import "tailwindcss"; imports app-local tokens
│  │  ├─ sitemap.ts                        # Built-in MetadataRoute.Sitemap (dynamic)
│  │  ├─ robots.ts
│  │  ├─ manifest.ts                       # PWA manifest (Media Session benefits)
│  │  ├─ feed.xml/route.ts                 # Podcast RSS 2.0 + iTunes namespace
│  │  ├─ opengraph-image.tsx               # Default OG image (next/og)
│  │  ├─ (marketing)/                      # Route group for unauth pages (no URL impact)
│  │  │  ├─ about/page.tsx
│  │  │  ├─ team/page.tsx
│  │  │  ├─ contact/page.tsx
│  │  │  └─ advertise/page.tsx
│  │  ├─ episodes/
│  │  │  ├─ page.tsx                       # Listing (optional; podcast apps mostly hit RSS)
│  │  │  └─ [slug]/
│  │  │     ├─ page.tsx                    # Episode detail (RSC, JSON-LD, related)
│  │  │     ├─ loading.tsx
│  │  │     └─ opengraph-image.tsx         # Dynamic OG per episode
│  │  ├─ news/
│  │  │  ├─ page.tsx                       # Paginated list
│  │  │  └─ [slug]/page.tsx                # Article detail (Article JSON-LD)
│  │  ├─ events/page.tsx                   # Phase 4
│  │  ├─ jobs/page.tsx                     # Phase 4
│  │  └─ api/
│  │     ├─ newsletter/route.ts            # POST → forwards to .NET API w/ Turnstile verify
│  │     ├─ contact/route.ts               # POST → forwards to .NET API w/ Turnstile verify
│  │     └─ revalidate/route.ts            # POST from admin → revalidateTag('episodes' | ...)
│  ├─ styles/                              # Web-only design system (NOT shared with admin)
│  │  ├─ tokens.css                        # :root + .dark — raw CSS variables
│  │  ├─ theme.css                         # @theme inline → maps tokens to Tailwind utilities
│  │  └─ typography.css                    # @font-face + prose styles for news/about
│  ├─ components/
│  │  ├─ ui/                               # Web's own shadcn registry (local, app-specific)
│  │  │  ├─ button.tsx
│  │  │  ├─ card.tsx
│  │  │  ├─ dialog.tsx
│  │  │  └─ ...                            # All shadcn primitives, themed with web tokens
│  │  ├─ layout/{header,footer,nav}.tsx    # Web-specific layout
│  │  ├─ theme-toggle.tsx                  # "use client"
│  │  └─ cookie-banner.tsx                 # LGPD/GDPR consent
│  ├─ features/                            # Vertical slices (bounded contexts)
│  │  ├─ episodes/
│  │  │  ├─ server/
│  │  │  │  ├─ get-episode.ts              # "use cache"; cacheTag(`episode:${slug}`)
│  │  │  │  └─ list-episodes.ts
│  │  │  ├─ components/
│  │  │  │  ├─ episode-card.tsx            # RSC
│  │  │  │  ├─ episode-hero.tsx            # RSC
│  │  │  │  ├─ episode-related.tsx
│  │  │  │  └─ play-button.tsx             # "use client" — pushes to player store
│  │  │  ├─ schemas.ts                     # Zod schemas (mirrors backend DTOs)
│  │  │  └─ structured-data.ts             # PodcastEpisode/PodcastSeries JSON-LD builder
│  │  ├─ player/                           # The persistent audio player (its own feature)
│  │  │  ├─ store.ts                       # Zustand store: current track, isPlaying, queue
│  │  │  ├─ player-provider.tsx            # "use client" — mounts <audio>, MediaSession
│  │  │  ├─ mini-player.tsx                # Sticky bottom bar (rendered in root layout)
│  │  │  ├─ full-player.tsx                # Inline player on episode detail
│  │  │  └─ media-session.ts               # navigator.mediaSession wiring
│  │  ├─ news/
│  │  ├─ events/
│  │  ├─ jobs/
│  │  ├─ team/
│  │  ├─ newsletter/
│  │  │  ├─ newsletter-form.tsx            # "use client" — RHF + Zod
│  │  │  └─ actions.ts                     # Server Action: validates, calls .NET
│  │  ├─ contact/
│  │  ├─ banners/
│  │  └─ comments/
│  │     └─ remark42.tsx                   # "use client" — loads Remark42 embed script
│  ├─ lib/
│  │  ├─ api.ts                            # Wraps @cafedebug/api-client (server-only)
│  │  ├─ env.ts                            # zod-validated process.env (typed config)
│  │  ├─ seo/
│  │  │  ├─ metadata.ts                    # default metadata + per-route helpers
│  │  │  ├─ og.tsx                         # next/og helpers
│  │  │  └─ jsonld.ts                      # schema-dts-typed builders
│  │  ├─ analytics.ts                      # Plausible / GA loader (consent-aware)
│  │  ├─ cookies.ts                        # theme + consent cookies
│  │  └─ utils.ts
│  ├─ types/
│  └─ proxy.ts                             # Renamed from middleware.ts in Next.js 16
├─ public/
├─ Dockerfile                              # Multi-stage; parity with apps/admin
├─ next.config.ts
├─ tsconfig.json                           # extends @cafedebug/tsconfig/nextjs.json
├─ eslint.config.ts                        # extends @cafedebug/eslint-config
├─ package.json
└─ .env.example
```

**Monorepo packages — updated stance:**
- `packages/api-client` — keep, shared (typed client from backend OpenAPI)
- `packages/eslint-config` — keep, shared (lint rules apply identically)
- `packages/tsconfig` — keep, shared (TS compiler settings)
- `packages/design-tokens` — **retire**, or rename to `@cafedebug/admin-tokens` and keep admin-only. **Recommendation: retire it.** Move admin's tokens app-local too, mirroring the web pattern.
- `packages/ui` — **slim or retire.** Three options in §10.5; recommended: retire for Phase 1, revisit if real duplication emerges.

**Server vs client rule of thumb (C#/Java analogy):** Server Components are like an ASP.NET Razor page rendered on the server — they can `await` data, never ship JS for themselves, and cannot have state. Client Components (`"use client"`) are like a Blazor WebAssembly island inside the page — interactive, with hooks, but they must serialize props from the server. **Default everything to server**, mark only the leaves that need state or browser APIs as client.

---

## 2. Library recommendations

For each concern, **one pick** with a one-line rationale and a code snippet.

### 2.1 Styling — Tailwind CSS v4 (locked)
v4 moves configuration from `tailwind.config.ts` to a CSS-first model with `@theme` and `@theme inline`. Tokens become real CSS variables that DevTools can read, and shadcn/ui ships v4-native components. Keep the thin `postcss.config.mjs` Next.js still needs.

```css
/* apps/web/src/app/globals.css */
@import "tailwindcss";
@import "../styles/tokens.css";       /* :root + .dark variables */
@import "../styles/theme.css";        /* @theme inline mapping */
@import "../styles/typography.css";   /* @font-face + prose */
```

### 2.2 Theme switching — `next-themes`
Best-in-class for App Router: it injects a synchronous `<script>` in `<head>` that reads localStorage/cookie before the React tree hydrates, so there is no flash. Set `attribute="class"` and pair with Tailwind v4's `@variant dark (.dark &)`.

**Recommendation:** use `next-themes` with `attribute="class"` and `defaultTheme="system"`, and additionally store the chosen theme in a cookie so Server Components can render the correct `<html class="dark">` on first paint. This eliminates the residual icon-FOUC that pure localStorage suffers from.

```tsx
// app/layout.tsx
import { cookies } from "next/headers";
import { ThemeProvider } from "@/components/theme-provider";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = (await cookies()).get("cd-theme")?.value ?? "system";
  return (
    <html lang="pt-BR" className={theme === "dark" ? "dark" : ""} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme={theme} enableSystem disableTransitionOnChange>
          {/* PlayerProvider, Header, children, Footer */}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### 2.3 Component primitives — shadcn/ui (app-local registry)
**Each app runs its own `pnpm dlx shadcn@latest init` and gets its own `components/ui/` directory.** The same component name (`<Button>`) lives in both apps but renders differently because the tokens differ — that's the whole point of shadcn's "you own the code" model.

For web specifically, customize `button.tsx` to use `font-display` for emphasis, `rounded-button` from web tokens, and the generous spacing scale. For admin, the same file is tighter, neutral, and functional. **Do not extract to a shared package.** If you find yourself wanting to, document why in an ADR (see §10.5).

shadcn v4 considerations: with v4 + React 19, shadcn dropped `forwardRef` and adds `data-slot` attributes to every primitive; `components.json` should target `style: "new-york"` and `cssVariables: true`.

### 2.4 Icons — `lucide-react`
Tree-shakable, consistent stroke, and is the de facto pair for shadcn/ui. Install at the app level.

### 2.5 Audio player — Media Chrome (web components) + custom Zustand store
**Pick:** `media-chrome` (github.com/muxinc/media-chrome) — created by Mux and Video.js's creator, in use on TED.com, Syntax.fm, and every Mux Player site — as the **chrome** (controls), with your own `<audio>` element owned by a Zustand store and React context.

Rationale: `media-chrome` gives you accessible, themeable controls as framework-agnostic custom elements (play/pause/scrub/playback rate/mute/volume out of the box). Because they slot around a plain `<audio>` element you control, you can keep that one `<audio>` mounted at the root layout level for persistence across navigations.

Alternatives considered:
- `react-h5-audio-player` — works but you don't get persistence for free and the styling is opinionated.
- `react-modern-audio-player` — single-instance pattern that fights mini-player persistence.
- Custom on top of Howler.js — overkill; `<audio>` + Media Session API is enough for podcasts.

```tsx
"use client";
import "media-chrome";   // registers <media-controller> etc.
```

### 2.6 Forms — React Hook Form + Zod (locked, mirrors admin)
RHF for ergonomics; Zod for type-safe schemas that double as DTOs (think C# data-annotations or `javax.validation` — except the same schema validates client and server). Use `@hookform/resolvers/zod`.

### 2.7 Data fetching — Server `fetch` first, TanStack Query for islands
- 95% of pages are RSC; just `await fetch(...)` or `await api.episodes.getBySlug(slug)`. Tag the fetch so admin can invalidate it:
  ```ts
  "use cache";
  cacheTag(`episode:${slug}`);
  ```
- Only when a Client Component does real-time client-driven fetching (search-as-you-type, comment counts, "now playing" badge) reach for TanStack Query v5. Wrap it in a single `<QueryClientProvider>` mounted only where needed (lazy via `dynamic`).

### 2.8 State — Zustand for the player; React Context for theme
Zustand is ~1 KB gzipped; no providers, no `forwardRef` ceremony — DI-light, like a tiny static IoC container per slice. The player store is your only global runtime state worth managing.

```ts
// features/player/store.ts
import { create } from "zustand";

type Track = { id: string; title: string; src: string; episodeSlug: string; artwork: string };
type PlayerState = {
  track: Track | null; isPlaying: boolean; position: number; rate: number;
  load: (t: Track) => void; toggle: () => void; setRate: (r: number) => void;
};
export const usePlayer = create<PlayerState>((set) => ({
  track: null, isPlaying: false, position: 0, rate: 1,
  load: (t) => set({ track: t, isPlaying: true, position: 0 }),
  toggle: () => set((s) => ({ isPlaying: !s.isPlaying })),
  setRate: (r) => set({ rate: r }),
}));
```

### 2.9 Comments — Remark42 (self-hosted, Discord OAuth built in)
See §6. Big finding: Remark42 has native Discord OAuth (`AUTH_DISCORD_CID` / `AUTH_DISCORD_CSEC`), so the same Discord users who chat in your server can log in to comment.

### 2.10 Newsletter — POST to .NET (no SaaS)
A single Server Action that validates with Zod, runs Cloudflare Turnstile server-side verification, then forwards to the backend's new `/api/v1/public/newsletter/subscribe` endpoint. **Double opt-in is essentially mandatory for LGPD** — cleanest audit trail for ANPD.

### 2.11 Analytics — Plausible (self-hosted Community Edition)
GDPR/LGPD-compliant out of the box (no cookies → no consent banner just for analytics), 1 KB gzipped script. Umami is a fine alternative if ClickHouse RAM is a concern. GA4 only if you need Google Ads attribution.

### 2.12 SEO — Next.js Metadata API + `schema-dts` + built-in `sitemap.ts`
- Use `app/sitemap.ts` + `generateSitemaps()` for splitting; only fall back to `next-sitemap` if you need exotic XML extensions Next doesn't model.
- Type JSON-LD with `schema-dts` (Google's official types).
- Use `next/og` for dynamic episode OG images (Edge runtime; ~50ms renders).

### 2.13 Testing — Vitest + RTL + Playwright + MSW (locked)
Already consistent with admin. Add `@axe-core/playwright` for automated a11y assertions in e2e.

### 2.14 i18n — Plan now, ship without it
Use `next-intl` v4 when you switch on. Don't pay the cost yet, but adopt three conventions in Phase 1 so future migration is mechanical:
1. Wrap user-facing strings in a `t()` helper that today is a passthrough.
2. Use `lang="pt-BR"` on `<html>` and write metadata in pt-BR.
3. Keep route segments unprefixed (no `/pt-br/...`); when EN ships, `next-intl` adds a `[locale]` segment via `proxy.ts` (Next.js 16 renamed `middleware.ts` to `proxy.ts`).

### 2.15 Images — `next/image` + remote pattern to your backend's CDN
Configure `images.remotePatterns` with your backend's image host. Use AVIF + WebP, prefer 16:9 thumbs at 1280×720, 800w and 400w. See §10.2 for CDN recommendation.

### 2.16 Loading / error UX — `loading.tsx` + `error.tsx` per route segment
- `loading.tsx` renders the Suspense fallback (skeleton); pair with React 19.2 Activity for "hidden but mounted" content.
- `error.tsx` is a Client Component receiving `{ error, reset }`; wire Sentry's `captureException` there.

---

## 3. Theming strategy (rewritten — app-local design system)

### 3.1 Where tokens live
**Each app owns its tokens.** No shared package. The web app is brand-forward (podcast, editorial); admin is utilitarian (data, forms). They evolve at different speeds with different vocabularies.

```
apps/web/src/styles/
├─ tokens.css       # :root + .dark — raw CSS variables (web-only)
├─ theme.css        # @theme inline → maps tokens to Tailwind utilities
└─ typography.css   # @font-face + prose styles for news/about pages
```

Coming from C#/Java: this is the same instinct as separating `CafeDebug.Admin.UI` from `CafeDebug.Web.UI` into independent assemblies. Shared abstraction sounds DRY, but it couples two products that should evolve at different speeds.

### 3.2 Web tokens — brand-forward, dark-first

```css
/* apps/web/src/styles/tokens.css */
:root {
  /* === Brand primitives (the only place hex/oklch lives) === */
  --brand-charcoal-900: oklch(0.18 0.01 270);  /* deepest — body bg in dark */
  --brand-charcoal-800: oklch(0.22 0.01 270);  /* header/footer (both themes) */
  --brand-charcoal-700: oklch(0.28 0.01 270);  /* elevated surfaces in dark */
  --brand-cream-50:     oklch(0.98 0.01 80);   /* body bg in light */
  --brand-cream-100:    oklch(0.96 0.012 80);  /* card bg in light */
  --brand-orange-500:   oklch(0.74 0.17 50);   /* primary accent */
  --brand-orange-600:   oklch(0.66 0.20 45);   /* hover / pressed */
  --brand-orange-200:   oklch(0.92 0.07 60);   /* subtle accent surfaces */

  /* === Semantic — light theme === */
  --background:          var(--brand-cream-50);
  --foreground:          oklch(0.15 0.01 270);
  --card:                var(--brand-cream-100);
  --card-foreground:     oklch(0.15 0.01 270);
  --muted:               oklch(0.92 0.008 80);
  --muted-foreground:    oklch(0.45 0.01 270);
  --border:              oklch(0.88 0.01 80);
  --primary:             var(--brand-orange-500);
  --primary-foreground:  oklch(0.12 0.01 270);
  --accent:              var(--brand-orange-200);

  /* Header/footer keep charcoal in BOTH themes (brand requirement) */
  --header:              var(--brand-charcoal-800);
  --header-foreground:   var(--brand-cream-50);

  /* === Typography — web-specific (expressive) === */
  --font-display: "Bricolage Grotesque", "Inter", system-ui, sans-serif;
  --font-body:    "Inter", system-ui, sans-serif;
  --font-mono:    "JetBrains Mono", ui-monospace, monospace;

  --text-hero:    clamp(2.5rem, 5vw + 1rem, 4.5rem);   /* fluid display */
  --text-h1:      clamp(2rem, 3vw + 1rem, 3rem);
  --text-h2:      clamp(1.5rem, 2vw + 1rem, 2.25rem);
  --text-lead:    1.125rem;                            /* article intros */
  --text-body:    1rem;
  --leading-prose: 1.7;                                /* article body */

  /* === Spacing rhythm — generous (content site) === */
  --space-section: clamp(4rem, 8vw, 8rem);
  --space-block:   clamp(2rem, 4vw, 3.5rem);

  /* === Radii — friendly === */
  --radius-button: 0.5rem;
  --radius-card:   1rem;       /* generous; admin uses ~0.375rem */
  --radius-hero:   1.5rem;
  --radius-full:   9999px;

  /* === Shadows — soft, editorial === */
  --shadow-card:  0 1px 2px oklch(0.15 0.01 270 / 0.06), 0 8px 24px oklch(0.15 0.01 270 / 0.08);
  --shadow-float: 0 12px 40px oklch(0.15 0.01 270 / 0.18);  /* mini-player */

  /* === Motion === */
  --ease-out:       cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast:  150ms;
  --duration-base:  240ms;
}

.dark {
  --background:          var(--brand-charcoal-900);
  --foreground:          var(--brand-cream-50);
  --card:                var(--brand-charcoal-800);
  --card-foreground:     var(--brand-cream-50);
  --muted:               var(--brand-charcoal-700);
  --muted-foreground:    oklch(0.70 0.01 80);
  --border:              oklch(0.32 0.01 270);
  --primary:             var(--brand-orange-500);
  --primary-foreground:  oklch(0.10 0.01 270);
  --accent:              oklch(0.30 0.05 50);

  --shadow-card:  0 1px 2px oklch(0 0 0 / 0.3), 0 8px 24px oklch(0 0 0 / 0.4);
  --shadow-float: 0 12px 40px oklch(0 0 0 / 0.6);
}

/* White-label hook — a tenant overrides 3 brand primitives, everything cascades */
[data-tenant="acme"] {
  --brand-orange-500: oklch(0.70 0.15 220);
  --brand-orange-600: oklch(0.62 0.18 220);
  --brand-charcoal-800: oklch(0.20 0.02 240);
}
```

### 3.3 Tailwind v4 mapping

```css
/* apps/web/src/styles/theme.css */
@theme inline {
  /* Colors → expose tokens as Tailwind utilities */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-accent: var(--accent);
  --color-header: var(--header);
  --color-header-foreground: var(--header-foreground);

  /* Fonts */
  --font-display: var(--font-display);
  --font-sans: var(--font-body);
  --font-mono: var(--font-mono);

  /* Radii */
  --radius-button: var(--radius-button);
  --radius-card: var(--radius-card);
  --radius-hero: var(--radius-hero);

  /* Shadows */
  --shadow-card: var(--shadow-card);
  --shadow-float: var(--shadow-float);
}
```

Now `bg-card`, `text-foreground`, `font-display`, `rounded-card`, `shadow-float` all resolve to web-specific values that admin knows nothing about.

### 3.4 Contrast with admin (why this split is worth it)

The fact that you can describe both at this surface level without overlap is proof the split is correct.

| Token concern | Admin (productivity) | Web (brand) |
|---|---|---|
| Default theme | Light (data legibility) | Dark (podcast/dev mood) |
| Surface palette | Neutral grays | Warm charcoal + cream |
| Accent usage | Orange used sparingly (CTAs only) | Orange dominant (hero, links, brand) |
| Radius scale | 4 / 6 / 8 px | 8 / 12 / 16 / 24 px (friendlier) |
| Card radius | `sm` (compact) | `xl` (generous) |
| Heading font | Inter (system-like) | Display font (Bricolage Grotesque) |
| Body font | Inter 14 px | Inter 16–18 px (reading comfort) |
| Spacing rhythm | 4 / 8 / 12 / 16 | 8 / 16 / 24 / 32 / 48 / 80 |
| Density | Compact rows, tight tables | Spacious sections, big air |
| Motion | Instant, snappy (work tool) | Easing, micro-delays (editorial) |
| Dark mode strategy | Optional, mirrors light | Primary mode, light is opt-in |

A "card" in admin is a 6 px-radius dense container. A "card" in web is a 16 px-radius hero-sized episode showcase with generous padding. Both can be called `<Card>` in code — but they're different components in different files, and that's fine.

### 3.5 FOUC prevention
Read the cookie in the server layout (shown in §2.2), set `<html class="dark">` server-side, and let `next-themes` reconcile on hydration. Zero flash on first paint, zero flash on system-preference toggle.

### 3.6 White-label readiness
Per-app white-label. Web tenants override web tokens; admin doesn't care. Because every brand value is one CSS variable, supporting a future tenant is "add `data-tenant="acme"` and override 3 variables." No code changes, no cross-app coordination.

---

## 4. SEO strategy

### 4.1 Per-route metadata via the Metadata API
```ts
// app/episodes/[slug]/page.tsx
import type { Metadata } from "next";
import { getEpisode } from "@/features/episodes/server/get-episode";

export async function generateMetadata(
  { params }: PageProps<"/episodes/[slug]">,
): Promise<Metadata> {
  const { slug } = await params;
  const ep = await getEpisode(slug);
  return {
    title: `${ep.title} · CafeDebug`,
    description: ep.summary,
    alternates: { canonical: `/episodes/${slug}` },
    openGraph: {
      type: "music.song",
      url: `/episodes/${slug}`,
      title: ep.title,
      description: ep.summary,
      images: [`/episodes/${slug}/opengraph-image`],
      audio: [{ url: ep.audioUrl, type: "audio/mpeg" }],
    },
    twitter: { card: "summary_large_image" },
  };
}
```

### 4.2 Dynamic OG with `next/og`
```tsx
// app/episodes/[slug]/opengraph-image.tsx
import { ImageResponse } from "next/og";
import { getEpisode } from "@/features/episodes/server/get-episode";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG({ params }: { params: { slug: string } }) {
  const ep = await getEpisode(params.slug);
  return new ImageResponse(
    (
      <div style={{ display: "flex", height: "100%", width: "100%", background: "#1c1917", color: "#fff", padding: 64, flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ fontSize: 24, color: "#f59e42" }}>CafeDebug · Episódio {ep.number}</div>
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1 }}>{ep.title}</div>
        <div style={{ fontSize: 24, opacity: 0.8 }}>{ep.hosts.join(" · ")}</div>
      </div>
    ),
    size,
  );
}
```

### 4.3 Sitemap and robots
```ts
// app/sitemap.ts
import type { MetadataRoute } from "next";
import { listAllEpisodes, listAllNews } from "@/lib/api";

export const revalidate = 600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL!;
  const [episodes, news] = await Promise.all([listAllEpisodes(), listAllNews()]);
  return [
    { url: base, changeFrequency: "daily", priority: 1.0 },
    { url: `${base}/about`, changeFrequency: "monthly" },
    { url: `${base}/team`, changeFrequency: "monthly" },
    ...episodes.map((e) => ({ url: `${base}/episodes/${e.slug}`, lastModified: new Date(e.publishedAt) })),
    ...news.map((n) => ({ url: `${base}/news/${n.slug}`, lastModified: new Date(n.updatedAt) })),
  ];
}
```

### 4.4 Structured data
Type with `schema-dts`. Render as a server-rendered `<script>` inside the page body:

```ts
// features/episodes/structured-data.ts
import type { WithContext, PodcastEpisode } from "schema-dts";

export function podcastEpisodeJsonLd(ep: Episode, baseUrl: string): WithContext<PodcastEpisode> {
  return {
    "@context": "https://schema.org",
    "@type": "PodcastEpisode",
    url: `${baseUrl}/episodes/${ep.slug}`,
    name: ep.title,
    datePublished: ep.publishedAt,
    timeRequired: `PT${ep.durationMinutes}M`,
    description: ep.summary,
    associatedMedia: { "@type": "MediaObject", contentUrl: ep.audioUrl },
    partOfSeries: { "@type": "PodcastSeries", name: "CafeDebug", url: baseUrl },
  };
}
```

Page type → schema mapping: **Episode** → `PodcastEpisode` (+ `PodcastSeries` once on home); **News** → `Article`; **Event** → `Event`; **Job** → `JobPosting`; **Organization** → once in root layout; **BreadcrumbList** → per non-home page; **FAQPage** → on About / Sponsorship.

### 4.5 Core Web Vitals targets
- **LCP** ≤ 2.0s
- **INP** ≤ 200ms
- **CLS** ≤ 0.05

Measure with Vercel Speed Insights or `web-vitals` posting to your analytics endpoint.

### 4.6 Internal linking
- Every episode page links to ≥3 related episodes (same category) and the latest 2 news items.
- News articles link back to related episodes when relevant.
- Footer carries permanent links to Home, Episodes (latest 5), About, RSS.

---

## 5. Audio player architecture

### 5.1 Persistence pattern: Provider in root layout
Put a single `<PlayerProvider>` Client Component in `app/layout.tsx`. It owns the `<audio>` element and the Zustand store. Navigations preserve the layout, so the `<audio>` stays mounted and playback continues.

```tsx
// app/layout.tsx (sketch)
<ThemeProvider ...>
  <PlayerProvider>            {/* "use client" — owns <audio> + MediaSession */}
    <Header />
    {children}
    <Footer />
    <MiniPlayer />            {/* sticky bottom bar; reads Zustand */}
  </PlayerProvider>
</ThemeProvider>
```

### 5.2 The provider
```tsx
"use client";
import { useEffect, useRef } from "react";
import { usePlayer } from "@/features/player/store";

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { track, isPlaying, rate, toggle } = usePlayer();

  // Drive the <audio> element from the store
  useEffect(() => {
    const a = audioRef.current; if (!a || !track) return;
    if (a.src !== track.src) a.src = track.src;
    if (isPlaying) a.play(); else a.pause();
    a.playbackRate = rate;
  }, [track, isPlaying, rate]);

  // Media Session API → lock-screen / Bluetooth headset controls
  useEffect(() => {
    if (!track || !("mediaSession" in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title, artist: "CafeDebug", album: "Podcast",
      artwork: [{ src: track.artwork, sizes: "512x512", type: "image/png" }],
    });
    navigator.mediaSession.setActionHandler("play",  () => toggle());
    navigator.mediaSession.setActionHandler("pause", () => toggle());
    navigator.mediaSession.setActionHandler("seekbackward", () => { audioRef.current!.currentTime -= 15; });
    navigator.mediaSession.setActionHandler("seekforward",  () => { audioRef.current!.currentTime += 30; });
  }, [track, toggle]);

  return (<>
    <audio ref={audioRef} preload="metadata" />
    {children}
  </>);
}
```

### 5.3 Mini vs full player
- **Mini-player** (`features/player/mini-player.tsx`): a slim `media-chrome` chrome with Play/Pause + scrub + time, slotted around the shared `<audio>` ref.
- **Full player** on `/episodes/[slug]`: same store, more controls (speed, skip, share). Does NOT mount a second `<audio>`; it commands the global one.

### 5.4 Accessibility
- All buttons keyboard-focusable, ARIA labels in pt-BR (`aria-label="Reproduzir episódio"`).
- Space toggles play; ←/→ skip 15s/30s; J/K/L like YouTube.
- `<audio>` carries a hidden `controls` fallback for screen-reader resilience.

### 5.5 Mobile
- Media Session metadata + `seekbackward`/`seekforward` → lock-screen + Bluetooth headset controls work on iOS/Android.
- `preload="metadata"` (never `auto`) to save mobile data.

### 5.6 Home and episode-detail integration
- **Home:** episode card's "Play" button dispatches `usePlayer.getState().load(episodeAsTrack)`. Mini-player at page bottom activates.
- **Episode detail:** the full player on the page reads from the store. If already playing this episode, the page mounts in the "currently playing" state seamlessly.

---

## 6. Comments — Remark42 + Discord

### 6.1 Self-hosting on Docker Swarm
Add a `remark42` service on the same network as your .NET API, behind Traefik for TLS. Storage is a single BoltDB file mounted as a volume — scales to hundreds of thousands of comments without external DB.

```yaml
# stack.yml (excerpt)
services:
  remark42:
    image: umputun/remark42:latest
    environment:
      - REMARK_URL=https://comments.cafedebug.com.br
      - SITE=cafedebug
      - SECRET=${REMARK_SECRET}                  # 32+ random bytes
      - ALLOWED_HOSTS=https://cafedebug.com.br
      - AUTH_SAME_SITE=none
      # Discord OAuth — the same Discord users in your community
      - AUTH_DISCORD_CID=${DISCORD_CLIENT_ID}
      - AUTH_DISCORD_CSEC=${DISCORD_CLIENT_SECRET}
      # Email fallback so non-Discord users can still comment
      - AUTH_EMAIL_ENABLE=true
      - SMTP_HOST=${SMTP_HOST}
      - SMTP_PORT=587
      - SMTP_USERNAME=${SMTP_USER}
      - SMTP_PASSWORD=${SMTP_PASS}
      # Notify admins + mirror to Discord (see §6.3)
      - NOTIFY_ADMINS=webhook,email
      - NOTIFY_WEBHOOK_URL=${DISCORD_WEBHOOK_URL_SLACK}     # Discord webhook URL + /slack
    volumes:
      - remark42-data:/srv/var
    networks: [edge, backend]
    deploy: { restart_policy: { condition: any } }
```

### 6.2 Next.js embed
```tsx
"use client";
import { useTheme } from "next-themes";
import { useEffect } from "react";

export function Remark42({ id }: { id: string }) {
  const { resolvedTheme } = useTheme();
  useEffect(() => {
    (window as any).remark_config = {
      host: "https://comments.cafedebug.com.br",
      site_id: "cafedebug",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${id}`,
      components: ["embed"],
      theme: resolvedTheme === "dark" ? "dark" : "light",
      locale: "pt",
      max_shown_comments: 10,
    };
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://comments.cafedebug.com.br/web/embed.mjs";
    document.body.appendChild(s);
    return () => { s.remove(); (window as any).REMARK42?.destroy?.(); };
  }, [id, resolvedTheme]);
  return <div id="remark42" />;
}
```

### 6.3 Bridging to Discord
**Login bridge (built-in):** Remark42 ships Discord OAuth as a first-class provider. Create a Discord OAuth app, set redirect to `https://comments.cafedebug.com.br/auth/discord/callback`, and Discord users sign in to comment with their Discord identity.

**Notification bridge (use Discord's Slack-compat endpoint):** Remark42's default `NOTIFY_WEBHOOK_TEMPLATE` emits `{"text": "..."}` — that's Slack format. Append `/slack` to your Discord webhook URL and Discord's Slack-compatible endpoint converts the payload for you.

```bash
NOTIFY_WEBHOOK_URL=https://discord.com/api/webhooks/<id>/<token>/slack
```

For richer messages, override the template to native Discord JSON:

```bash
NOTIFY_WEBHOOK_URL=https://discord.com/api/webhooks/<id>/<token>
NOTIFY_WEBHOOK_HEADERS=Content-Type:application/json
NOTIFY_WEBHOOK_TEMPLATE={"content":"Novo comentário de {{.User.Name | escapeJSONString}} em {{.Locator.URL}}: {{.Text | escapeJSONString}}"}
```

### 6.4 Moderation and spam
- Make yourself admin via `ADMIN_SHARED_ID` (your Discord user id with the `discord_` prefix).
- Enable email-confirmed `auth_email` and disable anonymous → cuts bots ~99%.
- Remark42 throttles globally (up to 1000 simultaneous requests) and per-user (up to 10 req/sec). Pair with Cloudflare Turnstile if spam appears.

### 6.5 LGPD
- Privacy policy must disclose Remark42 stores comments, truncated IPs, provider IDs. Link Remark42's privacy at `${REMARK_URL}/web/privacy.html`.
- Right-to-delete: Remark42 exposes user-controlled deletion endpoint; admin can delete a user's content via admin UI.
- ADMIN_SHARED_EMAIL = role mailbox (e.g., `privacy@cafedebug.com.br`).

---

## 7. Google Stitch workflow

### 7.1 What Stitch outputs
As of the March 2026 Stitch 2.0 update, Stitch exports **HTML + Tailwind CSS** directly, can extract design tokens from any URL, and pushes designs to Figma with editable layers. React/JSX export is not yet available. Tailwind output is **scaffold-quality** — not production code, but usable structure.

### 7.2 Workflow (full-page first, then componentize)
1. **Brand prompt template:**
   > "Design a Brazilian developer-community podcast website. Dark charcoal header and footer (#2A2A2A), warm orange accents (#F59E42). Sections: hero with current episode and Play button, latest episodes grid, recent news, upcoming events, newsletter signup, social links. Generate light and dark variants. Mobile + desktop."
2. **Generate home page first**, iterate verbally ("Move newsletter below events; make episode cards 16:9 with cover on left on desktop").
3. **Export Tailwind**, paste into a scratch `apps/web/playground/home.html`. Don't ship directly.
4. **Extract tokens manually** and update `apps/web/src/styles/tokens.css`. Stitch emits raw hex/pixels; normalize to OKLCH and your spacing scale.
5. **Componentize**: identify reusable atoms (episode card, news card, CTA button), create them in `apps/web/src/components/` using your tokens.
6. **Replace dummy data** with `@cafedebug/api-client` calls.

### 7.3 Keeping Stitch in sync
Treat Stitch like a **whiteboard**, not source of truth. Each new feature: prompt → screenshot in `docs/designs/<feature>.png` PR'd to git → translate to code by hand. Don't re-export and overwrite.

### 7.4 Brand drift guard
Stitch invents colors. Include literal hex values in prompts. After generation: "Replace all primary colors with `var(--primary)` and all surfaces with `var(--background)`/`var(--card)`."

---

## 8. Open-source community practices

- **License:** MIT (matches backend).
- **CONTRIBUTING.md:** prerequisites (pnpm, Node 22, .NET SDK), setup, env templates, branch naming (`feature/<scope>-<short-desc>`), Conventional Commits via commitlint, PR checklist.
- **Issue templates:** bug, feature, design-review, accessibility. Add a 🇧🇷 pt-BR variant.
- **good-first-issue** candidates: pt-BR copy fixes, a11y tweaks, unit-test gaps in `apps/web/src/components/`, refactoring a feature folder to conventions.
- **Code of Conduct:** Contributor Covenant 2.1; translate to pt-BR.
- **GitHub Discussions vs Discord:** Discord = real-time chat, episode reactions, ad-hoc help (NOT indexed by Google); GitHub Discussions = RFCs, "how do I build feature X?" (indexed, durable). Pin a Discord `#oss-contrib` channel that links new Discussions and PRs via webhook.
- **Commitlint:** `@commitlint/config-conventional` + Husky `commit-msg` hook. `scope-enum`: `web`, `admin`, `api-client`, `eslint`, `tsconfig`, `repo`. ("ui" and "tokens" drop out since they're no longer shared.)

---

## 9. Phased build plan

### Phase 1 — Scaffold + Home + Episode detail (Weeks 1–3)
**Scope:** App scaffold; app-local tokens (`apps/web/src/styles/`); theme switching; root layout + persistent player; Home (banner, recent episodes, news placeholders, newsletter placeholder, socials); episode detail with full player; SEO basics; sitemap; robots; RSS feed; Docker parity with admin; CI gate for `apps/web`.

**Backend endpoints needed:**
- `GET /api/v1/public/banners` ✓
- `GET /api/v1/public/episodes?take=&skip=` ✓ (list)
- `GET /api/v1/public/episodes/{slug}` (single episode w/ audio URL, hosts, related)
- `GET /api/v1/public/categories` ✓

**DoD:**
- Lighthouse Performance ≥ 90 on home + episode detail (mobile profile).
- `PodcastEpisode` + `PodcastSeries` JSON-LD validates in Schema Markup Validator.
- `/feed.xml` validates with Cast Feed Validator.
- Persistent mini-player survives navigation Home ↔ Episode ↔ Home.
- Dark/light toggle works without FOUC on cold load.
- Dockerfile + GitHub Actions CI: typecheck, lint, vitest, playwright smoke.

### Phase 2 — News + Comments + Newsletter + Analytics (Weeks 4–6)
**Scope:** News list with pagination, news detail, Remark42 on episodes + news, double-opt-in newsletter, Plausible, cookie banner, Turnstile on forms.

**Backend endpoints needed:**
- `GET /api/v1/public/news?page=`
- `GET /api/v1/public/news/{slug}`
- `POST /api/v1/public/newsletter/subscribe`
- `GET /api/v1/public/newsletter/confirm?token=`

**DoD:**
- Remark42 live at `comments.cafedebug.com.br`, Discord OAuth working, comments mirror to Discord.
- Newsletter: Turnstile-protected, confirmation email, only confirmed addresses receive newsletters.
- Plausible dashboard receiving events; cookie banner respects opt-out.

### Phase 3 — Team + About + Contact + i18n primitives (Weeks 7–8)
**Scope:** Team page, About (markdown-from-API), Contact form, `t()` helper installed everywhere (still pt-BR only).

**Backend endpoints needed:**
- `GET /api/v1/public/team`
- `GET /api/v1/public/about`
- `POST /api/v1/public/contact`

**DoD:**
- All forms pass automated axe + Playwright a11y checks.
- Contact form Turnstile + server-side validation; rate-limited 3 req/min per IP at Traefik.
- E2E suite ≥ 70% coverage of core user journeys.

### Phase 4 — Events + Jobs + Advertisement + White-label (Weeks 9–11)
**Scope:** Events, Jobs, Advertisement/sponsorship, `Event` + `JobPosting` JSON-LD, optional `data-tenant` override, English locale via `next-intl`.

**Backend endpoints needed:**
- `GET /api/v1/public/events`
- `GET /api/v1/public/jobs`
- `GET /api/v1/public/sponsorships`

**DoD:**
- Job postings appear in Google for Jobs (Rich Results Test).
- Second "preview tenant" (`data-tenant="preview"`) demonstrates white-label via 3 CSS-variable overrides.
- pt-BR ↔ EN toggle on Home + one content page.

---

## 10. Things you should also consider

### 10.1 Performance budget
- JS per route ≤ 150 KB gzipped (excluding persistent player ~25 KB).
- LCP image (episode artwork) preloaded with `<link rel="preload" as="image">`.
- Lighthouse CI gate in Phase 1; fail builds if Performance < 85.

### 10.2 Image CDN
**Bunny.net Image Optimizer** — cheaper than Cloudflare Images, has São Paulo edge, on-the-fly WebP/AVIF + resize. Configure `next/image` with `loader: "custom"` pointing at Bunny pull zone.

### 10.3 Caching with App Router
- `"use cache"` + `cacheTag` on each server data fetch.
- `POST /api/revalidate` protected by shared secret; admin calls it on publish with tag(s) (`episode:<slug>`, `episode-list`, `news:<slug>`).
- Multi-instance scaling: Redis-backed cache handler when you exceed one container.

### 10.4 Preview mode
`draftMode()` for content previewed from admin. Admin sends `https://web.cafedebug.com.br/api/preview?slug=…&secret=…&type=news`, route enables draft mode and redirects.

### 10.5 `packages/ui` decision

Since design systems are now separate, `packages/ui` loses its main purpose. Three choices:

1. **Remove entirely** (recommended for Phase 1). One less workspace boundary. Each app's `src/components/` is the source of truth.
2. **Keep as headless-only utilities** — `<Slot>`, `<VisuallyHidden>`, `useMediaQuery`, error boundary HOCs, focus-trap hook. No styles, no tokens. Add only when behavior duplicated 3+ times.
3. **Repurpose as `@cafedebug/lib`** — non-UI helpers (Zod env validator, pt-BR date formatters, slug helpers). Honest name for what it'd contain.

**Pick option 1 for Phase 1**, revisit at Phase 4 if real duplication emerges.

When a future contributor sees `apps/admin/components/ui/button.tsx` and `apps/web/components/ui/button.tsx` and thinks "DRY!", they'll want to extract. **Write `docs/adr/0001-separate-design-systems.md`** (one short ADR) explaining why these stay independent — your README's spec-driven workflow already implies ADR-style governance, and this prevents well-meaning refactors from quietly recoupling the apps.

### 10.6 Error tracking — Sentry
Generous free tier, source-map upload integrates with Next.js build, self-hostable. Wire in `instrumentation.ts` (server) and `app/error.tsx` (client).

### 10.7 Cookie consent (LGPD)
Plausible is cookieless → analytics needs no banner. But you'll need one if you add YouTube embeds, ads, or GA. Build now using `react-cookie-consent` or custom shadcn component; default = essential-only.

### 10.8 RSS feed
Generate `/feed.xml` from `apps/web` as RSS 2.0 with `itunes:` and `atom:` namespaces. Required iTunes tags: `itunes:author`, `itunes:category`, `itunes:explicit`, `itunes:image`, plus per-episode `<enclosure url type length>` and `<guid isPermaLink="false">`. **Backend stores one canonical `<guid>` per episode** — if feed URL changes, podcast apps still recognize the show. Add `<podcast:guid>` (UUIDv5) for cross-directory portability.

### 10.9 Apple/Spotify submission
Once `/feed.xml` validates, submit once to Apple Podcasts Connect and Spotify for Podcasters. Both poll the feed — keep it available, Cache-Control: 5 minutes is fine.

### 10.10 Social meta cards
OG image generator (§4.2) + `twitter:card="summary_large_image"` covers Twitter/X, LinkedIn, WhatsApp, Discord. Pass `twitter:player` with audio URL on episode pages → inline play in tweet previews.

### 10.11 Accessibility (WCAG 2.1 AA)
- `@axe-core/playwright` in CI.
- Manual checklist: keyboard nav, focus rings on `--primary`, color contrast (Tailwind v4 `color-mix` opacity utilities help), labels on form fields, player keyboard shortcuts documented at `/keyboard-shortcuts`.

### 10.12 Security headers
Via `next.config.ts`:
- `Content-Security-Policy`: `default-src 'self'; script-src 'self' 'nonce-…' https://comments.cafedebug.com.br https://challenges.cloudflare.com; img-src 'self' data: https://cdn.cafedebug.com.br; media-src https://cdn.cafedebug.com.br; connect-src 'self' https://plausible.cafedebug.com.br;`
- `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, minimal `Permissions-Policy`.
- Keep canonical CSP in Next.js so it ships with previews; Traefik adds extras.

### 10.13 Rate limiting on forms
**Cloudflare Turnstile** — invisible Managed mode for 99% of users, no Google data sharing, free, GDPR/LGPD-friendly. Verify server-side in Server Action before forwarding to .NET. Pair with Traefik per-IP limiting (3 req/min for `/api/contact`, `/api/newsletter`).

### 10.14 Containerization parity
`apps/web/Dockerfile` matches `apps/admin` shape:
```dockerfile
FROM node:22-alpine AS base
RUN corepack enable
FROM base AS deps
WORKDIR /repo
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY apps/web/package.json apps/web/
COPY packages ./packages
RUN pnpm install --frozen-lockfile
FROM base AS builder
WORKDIR /repo
COPY --from=deps /repo/node_modules ./node_modules
COPY . .
RUN pnpm turbo run build --filter=@cafedebug/web
FROM base AS runner
WORKDIR /app
COPY --from=builder /repo/apps/web/.next/standalone ./
COPY --from=builder /repo/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /repo/apps/web/public ./apps/web/public
USER node
CMD ["node", "apps/web/server.js"]
```
Use `output: "standalone"`. Same Traefik labels as admin, different `Host()`.

### 10.15 Environment variables
Validate at boot with Zod:
```ts
// src/lib/env.ts
import { z } from "zod";
export const env = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NEXT_PUBLIC_API_URL:  z.string().url(),
  NEXT_PUBLIC_REMARK42_URL: z.string().url(),
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: z.string(),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string(),
  TURNSTILE_SECRET_KEY: z.string(),
  REVALIDATE_SECRET: z.string().min(32),
  SENTRY_DSN: z.string().url().optional(),
}).parse(process.env);
```
From C#/Java: this is `IOptions<T>` bound from configuration — fail-fast at startup, fully typed everywhere.

### 10.16 CI gate
Add `web-ci.yml` that runs only on `apps/web/**` changes. Steps: `pnpm install`, `pnpm turbo run lint typecheck test build --filter=@cafedebug/web`. Block merge to `main` on failure.

---

## Next 5 actions (do these this week)

1. **Scaffold the app.** `pnpm dlx create-next-app@latest apps/web --typescript --app --tailwind --turbo --src-dir`. Adjust `package.json` name to `@cafedebug/web`, extend `@cafedebug/tsconfig` and `@cafedebug/eslint-config`. Add to `pnpm-workspace.yaml` if not already.

2. **Create app-local design system.** Create `apps/web/src/styles/{tokens.css, theme.css, typography.css}` from §3.2/3.3. Decide whether to retire `packages/design-tokens` now (recommended) or rename it `@cafedebug/admin-tokens` and keep admin-only. Install `next-themes`, add the cookie-aware `ThemeProvider`, ship working dark/light toggle. Run `pnpm dlx shadcn@latest init` inside `apps/web` to create web's own `components/ui/` registry.

3. **Build the Zustand player store + provider + mini-player** (skeleton, no API yet). Mount in root layout. Verify `<audio>` survives a Next `<Link>` navigation.

4. **Generate the Stitch design for Home + Episode Detail** with the brand prompt in §7.2, extract tokens into `apps/web/src/styles/tokens.css`, build the two pages against mocked data; wire to real API once `GET /api/v1/public/episodes/{slug}` lands.

5. **Spin up Remark42 in the Swarm** with Discord OAuth + the `/slack` Discord webhook URL. Embed on episode detail. Confirm a test comment appears in your Discord channel within seconds.

6. **(Bonus)** Write `docs/adr/0001-separate-design-systems.md` — short, 1-page ADR explaining why `apps/admin` and `apps/web` have independent design systems. Future contributors will thank you.

---

## Caveats

- **Stitch output is volatile.** Every generation is a draft; production code lives in your repo. As of April 2026, Stitch still exports only HTML/Tailwind (React is on the roadmap), so plan to componentize by hand.
- **Next.js 16 cache semantics are new.** "Cache Components" is now explicit (`"use cache"`) rather than implicit; budget time in Phase 1 to learn this model before scaling to multiple containers.
- **Remark42 → Discord webhook payload:** the `/slack` endpoint trick works as a general pattern per Discord's docs, but I couldn't find a public, copy-pasteable Remark42-specific example. Test in staging first; fall back to the explicit Discord-JSON template in §6.3 if it fails.
- **LGPD legal advice is not in scope.** Newsletter double-opt-in and Remark42 privacy disclosures here align with ANPD guidance, but have a Brazilian lawyer review your privacy policy before launch.
- **Apple Podcasts validation can take 24h–2 weeks.** Submit early in Phase 1, not at launch.
- **Design-system divergence has a maintenance cost.** When admin and web both need (say) a date picker, you'll build it twice. That's the explicit trade-off — design freedom over DRY. Revisit this annually; if you find 5+ components reinvented per side, consider a slim shared headless package (§10.5 option 2).
