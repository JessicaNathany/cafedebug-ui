# CafeDebug Platform

[![Validation Gates](https://github.com/RegisBarros/cafedebug-ui/actions/workflows/validation-gates.yml/badge.svg?branch=main)](https://github.com/RegisBarros/cafedebug-ui/actions/workflows/validation-gates.yml)

![image](https://user-images.githubusercontent.com/11943572/234849730-c6b41618-6c13-4a87-9b5e-5b9d16ba4474.png)


🚧  Project 🚀 under construction (with coffee and bugs)...  ☕💻🚧


This repository is the planning and foundation space for the Cafe Debug modernization effort.

Cafe Debug is a podcast and community project about software development, software architecture, developer life, project management, and software engineering. The target state for this repository is a public monorepo that contains:

- the public website
- the admin backoffice
- the .NET REST API

## Status

The repo is currently in the architecture and project-definition phase. The first goal is to document a solid foundation before scaffolding code.

## Current Context

The modernization plan is based on the current public assets and repositories:

- live website: `https://cafedebug.com.br`
- backend API: [`JessicaNathany/cafedebug-backend.api`](https://github.com/JessicaNathany/cafedebug-backend.api)

What we confirmed from those sources:

- the current site is a legacy ASP.NET Core website with Bootstrap, jQuery, Owl Carousel, and custom SCSS
- the public brand is built around a dark charcoal header/footer and warm orange accents
- the backend already exposes public/admin concerns for episodes, banners, images, auth, categories, team members, and users
- the public website is SEO-sensitive because it is content-driven and episode pages need to be discoverable

## Product Goals

- modernize the website without losing the recognizable Cafe Debug identity
- create a separate admin app for episodes, banners, media, and related content
- keep the website responsive on mobile and desktop
- support white-label theming for colors, logo, and future brand variations
- integrate with the existing REST API instead of rebuilding content management from scratch
- keep SEO, analytics, testing, and clean architecture as first-class concerns
- keep the repository open-source friendly and easy to contribute to

## Tech Stack Decision

| Area | Decision | Notes |
| --- | --- | --- |
| Monorepo | `pnpm` workspaces + `Turborepo` | Great fit for the two Next.js apps and shared packages. The .NET API can live in the same repo under `services/api` with its own lifecycle. |
| Website | `Next.js` App Router + `TypeScript` | Server Components first, ISR/SSG for content pages, modern SEO support. |
| Admin | `Next.js` App Router + `TypeScript` | Separate app with authenticated CRUD workflows. |
| Styling | `Tailwind CSS v4` + CSS variables | Best fit for white-label design tokens and shared theming. |
| Components | `shadcn/ui` + custom primitives | Use as a base layer, not as the visual identity. |
| API contract | `Orval` (fetch client) | Generate typed API endpoint functions and models from the backend Swagger/OpenAPI output. |
| Data fetching | Server `fetch` by default on the website, `TanStack Query` in admin/client-heavy flows | Keep the public website SEO-first and the admin productivity-first. |
| Forms | `React Hook Form` + `Zod` | Strong DX for admin forms and validation. |
| Testing | `Vitest`, `React Testing Library`, `Playwright`, `MSW` | Unit, component, e2e, and API-mocking coverage. |
| Quality | `ESLint`, `Prettier`, `Husky`, `lint-staged`, `commitlint` | Good defaults for an open-source repo. |
| Containers | Multi-stage `Dockerfile` per app | Keep deployment consistent across apps. |
| Hosting | AWS EC2 + Docker Swarm stack + reverse proxy | Recommended proxy: `Traefik` for multi-service routing in Swarm. |

## Architecture Principles

- Public website pages should be server-rendered by default.
- SEO is part of the route definition, not an afterthought.
- The admin app should optimize for content operations and authenticated workflows.
- Shared logic should live in packages, not be copied between apps.
- API contracts should be generated from Swagger, not handwritten twice.
- Visual identity must come from tokens and theme config, never from hardcoded colors scattered across components.
- Non-trivial work should start with a spec before implementation.

## Monorepo Target Structure

```text
apps/
  web/                    # Public website
  admin/                  # Admin backoffice

packages/
  ui/                     # Shared components and primitives
  api-client/             # Generated API types + fetch client
  design-tokens/          # Brand tokens, theme CSS, logos metadata
  config/                 # Shared site/admin runtime config
  eslint-config/          # Shared lint config
  tsconfig/               # Shared TS config


infra/
  docker/                 # Dockerfiles and local compose helpers
  swarm/                  # Docker stack deploy manifests
  scripts/                # Build/deploy/ops scripts

docs/
  CONTRIBUTING.md
  design-system.md

.specs/
  README.md
  web/
  admin/

.github/
  copilot-instructions.md

AGENTS.md
README.md
```

## App-Level Folder Shape

Inside each Next.js app, prefer feature-based structure with strict domain boundaries:

```text
src/
  app/                    # Routes, layouts, metadata, route handlers
  features/
    <domain>/
      components/
      hooks/
      services/
      server/
      schemas/
      types/
  lib/                    # Utilities, adapters, config helpers
```

Keep reusable design primitives in `packages/ui`, not duplicated under both apps. For implementation constraints and anti-patterns, see `.github/copilot-instructions.md`.

## Website Modernization Direction

The new website should preserve the recognizable Cafe Debug feel while modernizing the UI:

- keep the dark header/footer and warm orange brand accents
- keep core sections like banners, latest episodes, team, and contact/community
- replace fragile carousel-heavy interactions with accessible responsive layouts when possible
- improve spacing, typography hierarchy, and mobile navigation
- make episode discovery easier with stronger filtering, cards, and internal linking
- prepare the layout so banners and sponsorship placements feel intentional, not bolted on

## Design System Rules

- never hardcode visual values in feature components; use tokens from `packages/design-tokens`
- preserve the dark header/footer and warm orange accent palette unless design tokens are intentionally updated
- prefer `packages/ui` primitives before creating new feature-level components
- modernize via spacing, hierarchy, accessibility, and responsiveness while preserving brand identity

For execution-level enforcement and anti-patterns, use `.github/copilot-instructions.md`.
For admin visual implementation references, use `.specs/admin/DESIGN_SYSTEM.md` and `.specs/admin/stitch/cafedebug-admin/*`.

## White-Label Strategy

White-label support should be based on configuration, not branching:

- brand tokens in `packages/design-tokens`
- logo and site metadata in a brand config file
- Tailwind theme aliases that resolve to CSS variables
- no app component should hardcode a Cafe Debug-specific color or logo path

## Website and Admin Scope

### Public website

- home page
- episodes listing
- episode details
- team/community pages
- banners and sponsorship placements
- SEO metadata, Open Graph, sitemap, robots, analytics

### Admin backoffice

- login/authentication
- episode CRUD
- banner CRUD
- team member/content management
- image/media upload
- category and supporting content management

## Content and API Strategy

The backend already separates public and admin controllers. That gives us a clean frontend split:

- `apps/web` consumes public endpoints only
- `apps/admin` consumes admin endpoints and authenticated flows
- `packages/api-client` becomes the single typed client shared by both apps

Because the API already exposes Swagger/OpenAPI, generate client types from the contract instead of maintaining manual request/response types in the frontends.

### Endpoint Context (from `.specs/admin/backend-openspec-api.json`)

Use this split as the default API boundary between frontend apps:

- `apps/admin`: authenticated backoffice and admin account flows
- `apps/web`: public read-only website flows

For the current endpoint catalog, see `.specs/admin/backend-openspec-api.json`.

## SEO and Analytics

For the public website:

- use the Next.js Metadata API for page title, description, Open Graph, and canonical URLs
- generate `sitemap.xml` and `robots.txt`
- add structured data for podcast and episode pages where useful
- wire Google Analytics or Google Tag Manager through environment-driven configuration

Analytics must stay optional by environment so local and preview deployments remain clean.

## Deployment Direction

Production target:

- AWS EC2
- Docker Swarm stack
- one reverse proxy service
- one service for `web`
- one service for `admin`
- one service for `api`

Recommended approach:

- local development with Docker Compose only where useful
- multi-stage Docker builds for each app
- GitHub Actions for CI, image build, and deployment
- environment variables managed per service

### Run `apps/admin` on Your Machine

Use this section when you want to run the admin app locally as a contributor.

#### Prerequisites

- Node.js `>= 22`
- pnpm `>= 10`
- a running backend API reachable by `ADMIN_API_BASE_URL` (default `http://localhost:8080`)

#### 1. Install dependencies

From repository root:

```bash
pnpm install
```

#### 2. Create your local environment file

From repository root:

```bash
cp .env.example .env
```

If you run admin directly on host (`pnpm --filter @cafedebug/admin dev`), also create an app-local env file:

```bash
cp .env.example apps/admin/.env.local
```

Why this is needed:

- Docker Compose reads the root `.env`.
- Next.js host-run reads `apps/admin/.env.local` (app directory).

Then confirm these values in `.env` for local development:

- `ADMIN_PORT=3010`
- `ADMIN_PUBLIC_URL=http://localhost:3010`
- `ADMIN_API_BASE_URL=http://localhost:8080`
- `ADMIN_COOKIE_DOMAIN=localhost`
- `ADMIN_COOKIE_SAMESITE=Lax`
- `ADMIN_COOKIE_SECURE=false`

Notes:

- If your API runs on another port/host, change `ADMIN_API_BASE_URL`.
- Example for local .NET HTTPS API: `ADMIN_API_BASE_URL=https://localhost:7211`
- `ADMIN_API_BASE_URL_DOCKER` is only for Docker-based runs.

#### 3. Start admin directly on host (recommended for daily coding)

From repository root:

```bash
pnpm --filter @cafedebug/admin dev
```

Open `http://localhost:3001`.

Why `3001`?

- The app script is `next dev --port 3001` in `apps/admin/package.json`.
- `ADMIN_PORT` is used by Docker Compose mapping, not by this host command.

#### 4. Alternative: start all apps in the monorepo

From repository root:

```bash
pnpm dev
```

This runs all workspace `dev` scripts in parallel via Turborepo.

#### 5. Run admin in Docker (if you prefer containerized local dev)

From repository root:

```bash
pnpm docker:admin:config
pnpm docker:admin:dev
```

Open `http://localhost:${ADMIN_PORT}` (default `http://localhost:3010`).

To stop:

```bash
pnpm docker:admin:down
```

### Admin Docker Local + Production Strategy

The admin app Docker strategy lives under `infra/docker` and follows a dev/prod split:

- `infra/docker/admin/Dockerfile`
  - `dev` stage: workspace-mounted local development with hot reload
  - `production` stage: immutable runtime image (`pnpm start`)
- `infra/docker/docker-compose.admin.yml`
  - local compose workflow for admin only
  - host/container env bridging and predictable port mapping

#### Local workflow

1. Copy env contract:
   - `cp .env.example .env`
2. Validate compose config:
   - `pnpm docker:admin:config`
3. Start admin dev container:
   - `pnpm docker:admin:dev`
4. Stop:
   - `pnpm docker:admin:down`

#### Production image sanity build

- `pnpm docker:admin:build`

This command builds the production target from the multi-stage Dockerfile without running a container.

#### Environment contract (admin-focused)

Use `.env.example` as the source of truth for admin-related variables:

- `ADMIN_PORT` / `ADMIN_CONTAINER_PORT`: host/container ports and collision avoidance
- `ADMIN_PUBLIC_URL`: browser-facing admin origin
- `ADMIN_API_BASE_URL`: host-run API URL
- `ADMIN_API_BASE_URL_DOCKER`: container-run API URL (`host.docker.internal` pattern)
- cookie/session hints:
  - `ADMIN_COOKIE_DOMAIN`
  - `ADMIN_COOKIE_SAMESITE`
  - `ADMIN_COOKIE_SECURE`

Dev vs prod expectations:

- **Development (Compose):**
  - mounted source + hot reload
  - installs dependencies inside the container on first boot if `/app/node_modules` volume is empty
  - Next dev server binds `0.0.0.0:${ADMIN_CONTAINER_PORT}` inside container and is published to `localhost:${ADMIN_PORT}`
  - permissive local cookie settings are expected (usually `Secure=false` over HTTP)
- **Production (image/runtime):**
  - immutable container filesystem and startup command
  - Next runtime binds `0.0.0.0:${PORT}` (default 3000), with no source bind mount
  - cookie settings must be hardened for HTTPS deployments (`Secure=true`, appropriate `SameSite`, domain/path alignment)
  - runtime environment should be injected by deployment platform, not baked into image layers

## Code Generation and Multi-Agent Coordination

This project should be AI-friendly without becoming AI-dependent.

1. [AGENTS.md](./AGENTS.md) defines governance, lifecycle, and handoff rules.
2. [.github/copilot-instructions.md](./.github/copilot-instructions.md) defines executable coding constraints.
3. [.specs/README.md](./.specs/README.md) defines the spec-driven workflow and required deliverables.

## Validation Gates (Root + CI)

CafeDebug CI now exposes a single admin-only validation workflow in `.github/workflows/validation-gates.yml`.

Use these root commands locally to match CI:

- `pnpm ci:admin:build` → runs `@cafedebug/admin` build
- `pnpm ci:admin:test` → runs `@cafedebug/admin` tests
- `pnpm ci:admin:validate` → runs `@cafedebug/admin` lint, then typecheck
- `pnpm ci:validation` → runs the full admin sequence in order: build → test → validate

Branch protection for `main` should require the single `admin-gate` job from the `Validation Gates` workflow.

`apps/web`, `packages/api-client`, and other packages are not part of this required CI gate.

## Phased Plan

1. Foundation
   - finalize repo structure
   - scaffold monorepo root
   - create shared lint, TypeScript, and design token packages

2. Admin V1
   - implement login, episodes CRUD, banners CRUD, media upload
   - integrate authenticated API endpoints

3. Website V1
   - implement shell, home page, episode listing, episode detail, SEO, analytics
   - integrate public API endpoints

4. Platform Consolidation
   - move or mirror the backend into `services/api`
   - finalize shared deployment and CI/CD flow
5. Production Hardening
   - tests, observability, performance passes, and deployment automation

## References

- live site: `https://cafedebug.com.br`
- legacy repo: `https://github.com/JessicaNathany/cafedebug.legacy`
- backend repo: `https://github.com/JessicaNathany/cafedebug-backend.api`
