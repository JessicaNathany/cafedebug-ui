# Design: `apps/web` Foundation — Slice 1

| Field | Value |
|---|---|
| **Status** | `Draft` |
| **Domain** | `web/foundation` |
| **Spec** | `.specs/web/foundation/spec.md` |
| **Strategy source** | `.specs/web/cafedebug-web-foundation-v2.md` |
| **Affected app** | `apps/web` |

---

## 1. Architecture Overview

`apps/web` mirrors the **structural** conventions of `apps/admin` (feature-based vertical
slices, thin routes, `lib/` for infrastructure) while owning a **completely independent**
visual language. A developer who knows admin can navigate web immediately.

Rendering model: **Server Components by default.** Exactly two client concerns exist in this
slice — **theme** (toggle + provider) and the **player** (provider + UI + play buttons).
Everything else renders on the server.

### 1.1 Target folder structure (this slice)

Files marked ★ are created in Slice 1. Unmarked entries are structural placeholders documented
for orientation but **not** created yet (deferred per spec §3).

```
apps/web/
├─ src/
│  ├─ app/                                  # ROUTING ONLY (thin)
│  │  ├─ layout.tsx                    ★    # Server root layout: theme class, metadata, providers, shell
│  │  ├─ page.tsx                      ★    # Home (RSC, thin → feature components)
│  │  ├─ providers.tsx                 ★    # "use client" — ThemeProvider + PlayerProvider composition
│  │  ├─ loading.tsx                   ★    # Top-level skeleton
│  │  ├─ error.tsx                     ★    # "use client" — error boundary + reset
│  │  ├─ not-found.tsx                 ★    # 404
│  │  ├─ globals.css                   ★    # @import "tailwindcss" + token layers
│  │  ├─ robots.ts                     ★    # MetadataRoute.Robots
│  │  ├─ sitemap.ts                    ★    # MetadataRoute.Sitemap (from mock data)
│  │  └─ episodes/
│  │     └─ [slug]/
│  │        ├─ page.tsx                ★    # Episode detail (RSC) + generateMetadata + generateStaticParams
│  │        └─ loading.tsx             ★    # Segment skeleton
│  ├─ styles/                               # WEB-ONLY design system (not shared)
│  │  ├─ tokens.css                    ★    # :root (light) + .dark — raw CSS variables
│  │  ├─ theme.css                     ★    # @theme inline → maps tokens to Tailwind utilities + dark variant
│  │  └─ typography.css                ★    # font-face declarations + prose
│  ├─ components/
│  │  ├─ ui/
│  │  │  └─ button.tsx                 ★    # Minimal hand-rolled primitive (shadcn-style, token-themed)
│  │  ├─ layout/
│  │  │  ├─ header.tsx                 ★    # RSC — brand + nav + <ThemeToggle/>
│  │  │  ├─ footer.tsx                 ★    # RSC — brand + socials + copyright
│  │  │  └─ nav.tsx                    ★    # RSC — primary nav links (existing routes only)
│  │  ├─ theme-provider.tsx            ★    # "use client" — wraps next-themes
│  │  └─ theme-toggle.tsx              ★    # "use client" — useTheme + cookie sync
│  ├─ features/
│  │  ├─ episodes/
│  │  │  ├─ server/
│  │  │  │  ├─ get-episode.ts          ★    # returns one mock episode (real-API seam)
│  │  │  │  └─ list-episodes.ts        ★    # returns mock episode list
│  │  │  ├─ components/
│  │  │  │  ├─ episode-hero.tsx        ★    # RSC
│  │  │  │  ├─ episode-card.tsx        ★    # RSC
│  │  │  │  ├─ episode-related.tsx     ★    # RSC
│  │  │  │  ├─ show-notes.tsx          ★    # RSC — renders mock HTML
│  │  │  │  └─ play-button.tsx         ★    # "use client" — dispatches usePlayer.load(track)
│  │  │  ├─ mock/episodes.mock.ts      ★    # fixtures
│  │  │  ├─ structured-data.ts         ★    # schema-dts JSON-LD builders
│  │  │  ├─ schemas.ts                 ★    # Zod (mirrors backend DTO shape)
│  │  │  ├─ mappers.ts                 ★    # Episode → player Track
│  │  │  └─ types.ts                   ★    # domain types
│  │  └─ player/
│  │     ├─ store.ts                   ★    # Zustand store
│  │     ├─ player-provider.tsx        ★    # "use client" — owns <audio> + Media Session
│  │     ├─ mini-player.tsx            ★    # "use client" — sticky bottom bar (persistent)
│  │     ├─ full-player.tsx            ★    # "use client" — episode-detail controls (commands store)
│  │     ├─ media-session.ts           ★    # navigator.mediaSession wiring
│  │     └─ types.ts                   ★    # Track type
│  ├─ lib/
│  │  ├─ env.ts                        ★    # Zod-validated public env
│  │  ├─ theme.ts                      ★    # cookie name + server resolver
│  │  ├─ i18n.ts                       ★    # passthrough t() (pt-BR convention seed)
│  │  ├─ seo/
│  │  │  ├─ metadata.ts                ★    # default + per-route metadata helpers
│  │  │  └─ jsonld.ts                  ★    # Organization/PodcastSeries builders
│  │  └─ utils.ts                      ★    # cn() (clsx + tailwind-merge)
│  └─ types/                                # (shared ambient types; add as needed)
├─ public/
│  ├─ og-default.png                   ★    # static default OG image
│  └─ mock/                            ★    # placeholder artwork
├─ tests/
│  ├─ mock-episodes.test.mjs           ★
│  ├─ structured-data.test.mjs         ★
│  └─ theme-resolve.test.mjs           ★
├─ next.config.ts                      ★
├─ postcss.config.mjs                  ★    # Tailwind v4 plugin
├─ tsconfig.json                       ★
├─ eslint.config.mjs                   ★
├─ next-env.d.ts                       ★    # generated
├─ .env.example                        ★
└─ package.json                        ★    # replaces placeholder
```

**Deviation note (vs strategy doc §1):** the v2 doc sketches header/footer under
`src/components/layout` **and** `src/proxy.ts`, `manifest.ts`, `opengraph-image.tsx`, `news/`,
`(marketing)/`, `api/` routes. This slice keeps layout chrome in `components/layout/` (following
the v2 sketch) but omits everything not needed for the two mocked pages. No `proxy.ts` (no
middleware need yet). The shell is intentionally **not** placed in a `features/site-shell/`
slice — layout chrome is app-level presentation, and `components/layout/` matches the v2 doc the
user chose to follow.

### 1.2 Server vs Client map

| Concern | Kind | File(s) |
|---|---|---|
| Root layout, pages, header/footer/nav, hero/card/related/show-notes, SEO, data | **Server** | `app/*`, `components/layout/*`, `features/episodes/{server,components(except play-button),structured-data,...}` |
| Theme provider + toggle | **Client** | `components/theme-provider.tsx`, `components/theme-toggle.tsx` |
| Player provider + mini/full player + play button | **Client** | `features/player/{player-provider,mini-player,full-player}.tsx`, `features/episodes/components/play-button.tsx` |

---

## 2. Styling & Tokens (Tailwind v4, app-local)

### 2.1 Import order (`app/globals.css`)
```css
@import "tailwindcss";
@import "../styles/tokens.css";     /* :root + .dark raw variables */
@import "../styles/theme.css";      /* @theme inline mapping + dark variant */
@import "../styles/typography.css"; /* @font-face + prose */

body { @apply bg-background text-foreground font-sans antialiased; }
```

### 2.2 Tokens (`styles/tokens.css`) — condensed from strategy §3.2
`:root` holds brand primitives (the only place raw color lives) and light-theme semantic
tokens; `.dark` overrides the semantic layer. Header/footer stay charcoal in both themes.

```css
:root {
  /* brand primitives */
  --brand-charcoal-900: oklch(0.18 0.01 270);
  --brand-charcoal-800: oklch(0.22 0.01 270);   /* header/footer (both themes) */
  --brand-cream-50:     oklch(0.98 0.01 80);
  --brand-orange-500:   oklch(0.74 0.17 50);     /* primary accent */
  --brand-orange-600:   oklch(0.66 0.20 45);

  /* semantic — light */
  --background: var(--brand-cream-50);
  --foreground: oklch(0.15 0.01 270);
  --card: oklch(0.96 0.012 80);
  --card-foreground: oklch(0.15 0.01 270);
  --muted: oklch(0.92 0.008 80);
  --muted-foreground: oklch(0.45 0.01 270);
  --border: oklch(0.88 0.01 80);
  --primary: var(--brand-orange-500);
  --primary-foreground: oklch(0.12 0.01 270);
  --accent: oklch(0.92 0.07 60);

  --header: var(--brand-charcoal-800);
  --header-foreground: var(--brand-cream-50);

  --font-display: "Bricolage Grotesque", "Inter", system-ui, sans-serif;
  --font-body: "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  --radius-button: 0.5rem;
  --radius-card: 1rem;
  --shadow-card: 0 1px 2px oklch(0.15 0.01 270 / 0.06), 0 8px 24px oklch(0.15 0.01 270 / 0.08);
  --shadow-float: 0 12px 40px oklch(0.15 0.01 270 / 0.18);
}

.dark {
  --background: var(--brand-charcoal-900);
  --foreground: var(--brand-cream-50);
  --card: var(--brand-charcoal-800);
  --card-foreground: var(--brand-cream-50);
  --muted: oklch(0.28 0.01 270);
  --muted-foreground: oklch(0.70 0.01 80);
  --border: oklch(0.32 0.01 270);
  --primary: var(--brand-orange-500);
  --primary-foreground: oklch(0.10 0.01 270);
  --accent: oklch(0.30 0.05 50);
  --shadow-card: 0 1px 2px oklch(0 0 0 / 0.3), 0 8px 24px oklch(0 0 0 / 0.4);
  --shadow-float: 0 12px 40px oklch(0 0 0 / 0.6);
}
```

### 2.3 Tailwind mapping + dark variant (`styles/theme.css`)
```css
/* Class-based dark variant for Tailwind v4 */
@custom-variant dark (&:where(.dark, .dark *));

@theme inline {
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

  --font-display: var(--font-display);
  --font-sans: var(--font-body);
  --font-mono: var(--font-mono);

  --radius-button: var(--radius-button);
  --radius-card: var(--radius-card);
  --shadow-card: var(--shadow-card);
  --shadow-float: var(--shadow-float);
}
```
Result: `bg-background`, `text-foreground`, `bg-header`, `text-primary`, `rounded-card`,
`shadow-float`, `font-display` resolve to web-specific values. Admin knows nothing about them.

**Contrast with admin (why the split is intentional):** admin is light-first, neutral grays,
sparing orange, compact radii (v3, `@cafedebug/design-tokens`); web is dark-first, warm
charcoal + cream, dominant orange, generous radii (v4, app-local). Same names (`Card`,
`Button`) can render differently per app — that is the design-system independence the strategy
doc locks in.

---

## 3. Theme System (`next-themes`, cookie-backed)

### 3.1 Flow
```
Server layout
  │ read cookie "cd-theme" (lib/theme.ts) → resolveInitialThemeClass()
  │ <html class={initialClass} suppressHydrationWarning lang="pt-BR">
  ▼
providers.tsx ("use client")
  │ <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
  ▼
theme-toggle.tsx ("use client")
  │ const { setTheme, resolvedTheme } = useTheme()
  │ onClick → setTheme(next) AND document.cookie = "cd-theme=<next>; path=/; max-age=..."
  ▼
next-themes injects a pre-hydration <script> that sets .dark before paint (localStorage),
server already set the class from the cookie → no FOUC either way
```

### 3.2 `lib/theme.ts`
```ts
import { cookies } from "next/headers";
export const THEME_COOKIE = "cd-theme";
export type ThemePref = "light" | "dark" | "system";
export const DEFAULT_THEME: ThemePref = "dark";

export async function getThemePref(): Promise<ThemePref> {
  const v = (await cookies()).get(THEME_COOKIE)?.value;
  return v === "light" || v === "dark" || v === "system" ? v : DEFAULT_THEME;
}
// system resolves to dark on the server (web is dark-first); client reconciles.
export function resolveInitialThemeClass(pref: ThemePref): "" | "dark" {
  return pref === "light" ? "" : "dark";
}
```

Rationale for `next-themes` over admin's server-action approach: the strategy doc locks
`next-themes` for web, and its pre-hydration script plus `enableSystem` gives system-preference
support with less bespoke code. The cookie hint preserves admin's FOUC-free server render.

---

## 4. Layout & Shell

- `app/layout.tsx` (server): sets html/theme/metadata, renders `<Providers>` wrapping
  `<Header/>`, `{children}`, `<Footer/>`, `<MiniPlayer/>`, and injects `Organization`/
  `PodcastSeries` JSON-LD.
- `components/layout/header.tsx` (server): `bg-header text-header-foreground`, brand mark
  (text/logo placeholder), `<Nav/>`, `<ThemeToggle/>` (client island). Responsive: nav
  collapses to a simple menu on small screens (CSS-only for the skeleton).
- `components/layout/footer.tsx` (server): `bg-header text-header-foreground`, brand, social
  placeholders (`aria-label` in pt-BR, `rel="noopener"` if linked, else non-interactive), and
  pt-BR copyright.
- `components/layout/nav.tsx` (server): links limited to existing routes. For the skeleton:
  `Início` (`/`) and an in-page `#episodios` anchor to the Home episodes section. No links to
  `/news`, `/about`, etc. (they don't exist yet).

Header/footer read the `--header` token so they stay charcoal in both themes (brand rule).

---

## 5. Player Architecture (skeleton)

### 5.1 Store (`features/player/store.ts`)
```ts
import { create } from "zustand";
import type { Track } from "./types";

type PlayerState = {
  track: Track | null;
  isPlaying: boolean;
  position: number;
  rate: number;
  load: (t: Track) => void;
  toggle: () => void;
  play: () => void;
  pause: () => void;
  setPosition: (s: number) => void;
  setRate: (r: number) => void;
};

export const usePlayer = create<PlayerState>((set) => ({
  track: null, isPlaying: false, position: 0, rate: 1,
  load: (t) => set({ track: t, isPlaying: true, position: 0 }),
  toggle: () => set((s) => ({ isPlaying: !s.isPlaying })),
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  setPosition: (position) => set({ position }),
  setRate: (rate) => set({ rate }),
}));
```

### 5.2 Provider (`features/player/player-provider.tsx`, client)
Owns the **single** `<audio>` element and drives it from the store; wires Media Session.
Mounted once in the root layout (inside `providers.tsx`) so it and its `<audio>` persist across
navigation.
```tsx
"use client";
export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { track, isPlaying, rate } = usePlayer();
  useEffect(() => {
    const a = audioRef.current; if (!a || !track) return;
    if (a.src !== track.src) a.src = track.src;      // placeholder URL in skeleton
    if (isPlaying) void a.play().catch(() => {}); else a.pause();
    a.playbackRate = rate;
  }, [track, isPlaying, rate]);
  useMediaSession(audioRef);                          // features/player/media-session.ts
  return (<>{children}<audio ref={audioRef} preload="metadata" /></>);
}
```

### 5.3 Mini vs full player
- `mini-player.tsx`: sticky bottom bar rendered in the root layout; hidden when `track === null`;
  shows artwork/title + Play/Pause + a (non-seeking) progress placeholder. Persistent.
- `full-player.tsx`: on episode detail; **commands the same store** (never mounts a second
  `<audio>`); richer controls (play/pause, ±15/30s, rate). If the current store track equals the
  page's episode, it renders the "playing" state.
- `play-button.tsx` (in `features/episodes/components`): calls `usePlayer.getState().load(track)`
  using `episodeToTrack(ep)` from `features/episodes/mappers.ts`.

### 5.4 Accessibility & mobile
Buttons are `<button>` with pt-BR `aria-label` (`"Reproduzir"`, `"Pausar"`); Space/Enter
activate; Media Session `play`/`pause`/`seekbackward`/`seekforward` handlers wired for
lock-screen/headset control. `preload="metadata"`.

### 5.5 Skeleton boundary
No `media-chrome` (or any chrome library) in this slice. Controls are hand-rolled buttons. Track
`src`/`artwork` are placeholders. The **full control + state + persistence path** is real; only
real audio sources and polished chrome are deferred.

---

## 6. Data & Mock Strategy

### 6.1 Types & schema (`features/episodes/{types.ts,schemas.ts}`)
Model the expected backend DTO so the real-API swap is body-only. Illustrative:
```ts
// types.ts
export type Episode = {
  slug: string; number: number; title: string; summary: string;
  showNotesHtml: string; audioUrl: string; artworkUrl: string;
  hosts: string[]; category: string; durationMinutes: number; publishedAt: string; // ISO
};
// schemas.ts
export const episodeSchema = z.object({
  slug: z.string().min(1), number: z.number().int().positive(),
  title: z.string().min(1), summary: z.string(), showNotesHtml: z.string(),
  audioUrl: z.string(), artworkUrl: z.string(),
  hosts: z.array(z.string()), category: z.string(),
  durationMinutes: z.number().int().nonnegative(), publishedAt: z.string(),
});
```

### 6.2 Server functions (the API seam)
```ts
// features/episodes/server/list-episodes.ts
import { mockEpisodes } from "../mock/episodes.mock";
export async function listEpisodes(): Promise<Episode[]> { return mockEpisodes; }
// features/episodes/server/get-episode.ts
export async function getEpisode(slug: string): Promise<Episode | null> {
  return mockEpisodes.find((e) => e.slug === slug) ?? null;
}
```
Only these two function bodies change when the real API arrives (later they add
`"use cache"` + `cacheTag(...)` and call `@cafedebug/api-client`). Pages/components stay
untouched. Fixtures (`mock/episodes.mock.ts`) provide ≥4 episodes with pt-BR content and
placeholder `audioUrl`/`artworkUrl`.

---

## 7. Pages

### 7.1 Home (`app/page.tsx`, thin RSC)
```tsx
export default async function HomePage() {
  const episodes = await listEpisodes();
  const [featured, ...rest] = episodes;
  return (
    <>
      <EpisodeHero episode={featured} />
      <section id="episodios"><EpisodeGrid episodes={rest} /></section>
      <NewsPlaceholder />        {/* pt-BR "Novidades em breve" */}
      <NewsletterPlaceholder />  {/* copy only, NO form */}
      <SocialLinks />
    </>
  );
}
```
(`EpisodeGrid`, `NewsPlaceholder`, `NewsletterPlaceholder`, `SocialLinks` are small server
components; the placeholders live in `components/layout/` or `features/episodes/components/` as
appropriate — no forms, no client JS.)

### 7.2 Episode detail (`app/episodes/[slug]/page.tsx`, thin RSC)
```tsx
export async function generateStaticParams() {
  return (await listEpisodes()).map((e) => ({ slug: e.slug }));
}
export async function generateMetadata({ params }: PageProps<"/episodes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const ep = await getEpisode(slug);
  return ep ? buildEpisodeMetadata(ep) : {};
}
export default async function EpisodePage({ params }: PageProps<"/episodes/[slug]">) {
  const { slug } = await params;
  const ep = await getEpisode(slug);
  if (!ep) notFound();
  const related = (await listEpisodes()).filter((e) => e.slug !== slug).slice(0, 3);
  return (
    <article>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(podcastEpisodeJsonLd(ep, env.NEXT_PUBLIC_SITE_URL)) }} />
      <EpisodeHero episode={ep} />
      <FullPlayer episode={ep} />
      <ShowNotes html={ep.showNotesHtml} />
      <EpisodeRelated episodes={related} />
    </article>
  );
}
```

### 7.3 Route UX
`app/loading.tsx` (skeleton), `app/error.tsx` (`"use client"`, `{ error, reset }`),
`app/not-found.tsx`, and `app/episodes/[slug]/loading.tsx`.

---

## 8. SEO

### 8.1 Default metadata (`lib/seo/metadata.ts` → used by `app/layout.tsx`)
```ts
export const defaultMetadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: { default: "CafeDebug", template: "%s · CafeDebug" },
  description: "Podcast e comunidade brasileira sobre desenvolvimento de software.",
  openGraph: { type: "website", siteName: "CafeDebug", locale: "pt_BR",
    images: ["/og-default.png"] },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};
```
`buildEpisodeMetadata(ep)` sets `title: ep.title`, description, `alternates.canonical:
/episodes/${slug}`, OG `type: "music.song"` + `audio`, Twitter card.

### 8.2 JSON-LD (`schema-dts`)
- `lib/seo/jsonld.ts`: `organizationJsonLd()`, `podcastSeriesJsonLd()` (layout, once).
- `features/episodes/structured-data.ts`: `podcastEpisodeJsonLd(ep, baseUrl)` returning
  `WithContext<PodcastEpisode>` with `partOfSeries` → `PodcastSeries`.
Rendered as server `<script type="application/ld+json">`.

### 8.3 robots & sitemap
```ts
// app/robots.ts
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: "/" }], sitemap: `${env.NEXT_PUBLIC_SITE_URL}/sitemap.xml` };
}
// app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = env.NEXT_PUBLIC_SITE_URL;
  const episodes = await listEpisodes();
  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    ...episodes.map((e) => ({ url: `${base}/episodes/${e.slug}`, lastModified: new Date(e.publishedAt) })),
  ];
}
```
Deferred: dynamic `next/og` per episode, `/feed.xml` RSS (spec §3).

---

## 9. Config Files

### 9.1 `package.json` (replaces placeholder)
| Dependency | Purpose |
|---|---|
| `next` `^16.2.3`, `react` `^19.1.0`, `react-dom` `^19.1.0` | Framework (repo majors) |
| `next-themes` | Theme switching (strategy §2.2) |
| `zustand` | Player store (strategy §2.8) |
| `zod` `^4.3.6` | Schemas (repo version) |
| `lucide-react` | Icons (theme toggle, player) |
| `clsx`, `tailwind-merge` | `cn()` utility |

| Dev dependency | Purpose |
|---|---|
| `@cafedebug/eslint-config`, `@cafedebug/tsconfig` (`workspace:*`) | Shared config (already present) |
| `@next/eslint-plugin-next` `^16.2.3` | Next lint rules (parity with admin) |
| `tailwindcss` `^4`, `@tailwindcss/postcss` `^4`, `postcss` | Tailwind v4 toolchain |
| `schema-dts` | Typed JSON-LD |
| `typescript` `^6.0.0`, `@types/node`, `@types/react`, `@types/react-dom`, `eslint` | Types/lint (parity with admin) |

Scripts: `dev: "next dev --port 3000"`, `build: "next build"`, `start: "next start --port 3000"`,
`lint: "eslint ."`, `typecheck: "tsc --noEmit"`, `test: "node --test tests/**/*.test.mjs"`,
`clean: "rm -rf .next .turbo tsconfig.tsbuildinfo"`. Port `3000` is distinct from admin's `3001`
(R-6).

### 9.2 `next.config.ts`
Mirror admin minus Sentry: `reactStrictMode: true`, `outputFileTracingRoot` = repo root. No
`transpilePackages` (no workspace runtime deps this slice). `output: "standalone"` deferred to
the Docker slice.

### 9.3 `tsconfig.json`
Mirror admin: `extends "@cafedebug/tsconfig/nextjs"`, `paths: { "@/*": ["./src/*"] }`,
`plugins: [{ name: "next" }]`, `ignoreDeprecations: "6.0"`, `allowJs: true`,
`isolatedModules: true`; include `next-env.d.ts`, `**/*.ts`, `**/*.tsx`, `.next/types/**/*.ts`.

### 9.4 `eslint.config.mjs`
Mirror admin: spread `@cafedebug/eslint-config/next`, add `@next/next` core-web-vitals rules,
and the `next-env.d.ts` triple-slash exception.

### 9.5 `postcss.config.mjs` (Tailwind v4)
```js
const config = { plugins: { "@tailwindcss/postcss": {} } };
export default config;
```
(No `autoprefixer` line — v4's PostCSS plugin handles vendor prefixing. This is the key
divergence from admin's v3 `postcss.config.mjs`.)

### 9.6 `lib/env.ts`
```ts
import { z } from "zod";
export const env = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
}).parse({ NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL });
```
`.env.example`: `NEXT_PUBLIC_SITE_URL=http://localhost:3000`. (`NEXT_PUBLIC_API_URL` and others
are added when real integration lands.)

---

## 10. Monorepo Tailwind Version Strategy

**Current state:** `apps/admin` = Tailwind **v3** (`tailwind.config.ts`, `@tailwind`
directives, `autoprefixer`, tokens via `@cafedebug/design-tokens`). This slice introduces
`apps/web` = Tailwind **v4** (`@theme inline`, `@tailwindcss/postcss`, app-local tokens).

**Why coexistence is safe:** Tailwind config + PostCSS are resolved **per app** (each app has
its own `postcss.config.mjs` and CSS entry). There is **no shared styling surface** between the
apps (web does not use `packages/design-tokens`). `turbo run build` compiles each app with its
own toolchain (AC-16 verifies).

**Planned admin migration (R-2, docs-only here):** align admin to v4 under a dedicated platform
spec `.specs/platform/tailwind-v4-migration/`. That spec should: replace `tailwind.config.ts`
color/spacing/radius/shadow maps with `@theme inline`, swap `postcss` plugins
(`tailwindcss`+`autoprefixer` → `@tailwindcss/postcss`), migrate `@tailwind base/components/
utilities` → `@import "tailwindcss"`, convert `darkMode: ['selector','[data-theme="dark"]']` to
a v4 `@custom-variant`, and decide the fate of `@cafedebug/design-tokens` (retire vs
`@cafedebug/admin-tokens`). **No admin files change in this web slice** — Phase 11 only records
the pointer.

---

## 11. Directory-to-Responsibility Table

| Path | Responsibility | Client? |
|---|---|---|
| `app/*` | Routing, layout, metadata, SEO route handlers | No (except `error.tsx`) |
| `styles/*` | App-local design tokens + Tailwind mapping | n/a |
| `components/ui/*` | Web design-system primitives (minimal) | No |
| `components/layout/*` | Header, footer, nav | No |
| `components/theme-*` | Theme provider + toggle | Yes |
| `features/episodes/server/*` | Data access (mock now, API later) | No |
| `features/episodes/components/*` | Episode UI (`play-button` is the only client one) | Mixed |
| `features/episodes/{schemas,types,structured-data,mappers,mock}` | Contracts, JSON-LD, fixtures | No |
| `features/player/*` | Persistent audio player (store + provider + UI) | Yes |
| `lib/*` | Env, theme cookie, SEO helpers, i18n seed, utils | No |
| `tests/*` | `node --test` smoke tests | n/a |
