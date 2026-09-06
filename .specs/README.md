# Specs Directory

This repository follows **Spec-Driven Development (SDD)** for all non-trivial work.

Specs ensure humans, Copilot, and AI agents stay aligned before implementation begins.

---

## Spec-Driven Workflow

All features must follow this lifecycle:
Specify → Design → Tasks → Execute

### 1. spec.md (Specify)

Defines the **problem and expected behavior**.

Focus:

- what we are building
- why it matters
- user and business context

---

### 2. design.md (Design)

Defines the **solution and architecture**.

Focus:

- UI structure and layout
- component composition
- API contracts
- data flow
- state management

---

### 3. tasks.md (Tasks)

Defines the **implementation plan**.

Focus:

- step-by-step tasks
- safe execution order
- validation steps
- dependencies between tasks

---

### 4. Execute

Implementation must follow:

- the spec
- the design
- the task breakdown

For non-trivial `apps/web` visual or UX work, the feature design must also include
a Pencil implementation contract. Use `.specs/web/page-contract-template.md` and
the node index in `.specs/web/foundation/ux-design-reference.md`.

Web visual implementation must use `cafedebug.pen` at the repository root as the
authoritative source via Pencil MCP, not screenshots alone. Do not move the `.pen`
file or invent a visual substitute unless a dedicated spec updates every affected
reference.

---

## Spec Index

### `admin`

| Feature | Status | Path | Description |
| --- | --- | --- | --- |
| Admin Login | `Implemented` | `.specs/admin/login/` | Full feature spec for admin login flow against POST /api/v1/admin/auth/token |
| Login Page Refactor | `Implemented` | `.specs/admin/login-refactor/` | Aligns the login page UI to the Stitch theme design reference |
| Auth Handler Error Normalization | `Draft` | `.specs/admin/auth-error-normalization/` | Extracts shared error response building and normalizes error shapes across all auth API routes |
| Banner List Refactor | `Draft` | `.specs/admin/banner-list-refactor/` | Replaces the `/banners` placeholder with the real admin banner list flow backed by the backend list endpoint. |
| Banner Editor Refactor | `Draft` | `.specs/admin/banner-editor-refactor/` | Refactors the admin banner editor to match the Stitch split-pane layout for create and edit flows. |
| Episode Show Notes Editor (Tiptap) | `Draft` | `.specs/admin/episode-editor-tiptap/` | Replaces the Show Notes textarea with a Tiptap-based editor while preserving existing episode API behavior |
| API Client Refactor | `Implemented` | `.specs/admin/api-client-refactor/` | Refactors API contract and client organization around Orval, with TanStack Query in admin and server-first fetching in web |
| Episode Category Selector | `Implemented` | `.specs/admin/episode-category-selector/` | Replaces hardcoded category options in the episode editor with a dynamic list fetched from the backend categories API |
| Episode List Search | `Draft` | `.specs/admin/episode-search/` | Replaces client-side filtering with server-side search via `GET /api/v1/admin/episodes?search=` |
| Episode List Number Display | `Implemented` | `.specs/admin/episode-list-number-display/` | Removes the `#` prefix from the episodes list number column while keeping the same numeric content and table behavior |
| Team Members List Refactor | `Implemented` | `.specs/admin/team-member-list-refactor/` | Replaces the `/team-members` placeholder with the real admin team members list flow backed by the backend list endpoint. |
| Team Members Editor | `Implemented — manual backend acceptance pending` | `.specs/admin/team-member-edit-refactor/` | Delivers create and edit workflows for `/team-members/new` and `/team-members/[id]/edit` without changing the implemented Team Members list. |

### `platform`

| Feature | Status | Path | Description |
| --- | --- | --- | --- |
| Next.js 16 Migration | `Implemented` | `.specs/platform/nextjs-16-migration/` | Framework upgrade from Next.js 15 to 16 with middleware-to-proxy migration |
| Node.js & TypeScript Upgrade | `Implemented` | `.specs/platform/node-ts-upgrade/` | Node.js 20 to 22, TypeScript 5.9 to 6.0 with tsconfig and CI updates |
| GitHub Actions CI Validation Redesign | `Implemented` | `.specs/platform/ci-validation-redesign/` | Revises CI to one admin-only validation job with sequential build, test, and validate steps |

### `web`

| Feature | Status | Path | Description |
| --- | --- | --- | --- |
| Web Foundation (Slice 1) | `Implemented` | `.specs/web/foundation/` | Next.js 16 App Router scaffold: independent web token package, Tailwind v4, next-themes, shell, mocked Home + episode detail, persistent audio player skeleton, and SEO basics. Includes `ux-design-reference.md` — full visual/UX guidance for all designed pages (from `cafedebug.pen`) |
| Homepage Visual Parity with Pencil | `Implemented` | `.specs/web/homepage-visual-parity/` | Enforces full homepage visual parity with Pencil for Hero, Recent Episodes, News & Events, and Newsletter using mandatory node references `tWWON`, `k71CIc`, `m9zV96`, `LSgoB`, and `FGSFI`. |
| Homepage Beta Launch Parity | `Implemented` | `.specs/web/homepage-beta-launch/` | Makes `/` match the launch Homepage (Beta) nodes `fm0R5`/`b3Kzt` and `B3qM0p`/`F0E1s`, while preserving the implemented homepage as an importable website 2.0 composition. |
| Responsive Navigation Menu | `Implemented` | `.specs/web/responsive-navigation-menu/` | Replaces the disappearing below-`lg` navigation with an accessible three-line menu, removes Notícias/Eventos/Vagas from the top menu, and marks those footer destinations as `Em breve`. |
| Episode List and Detail | `Implemented` | `.specs/web/episode-list-and-detail/` | Mock-only `/episodes` catalog and Pencil-validated `/episodes/[slug]` detail with search, category filters, pagination, route states, SEO, full detail regions, accessibility, future API seam, Homepage Beta shell, and P12 action/comment parity. |
| Compact Persistent Episode Player | `Implemented` | `.specs/web/compact-persistent-player/` | Evolves the shared sticky footer player with accessible seek, common playback controls, responsive priority, and one persistent audio owner. |
| Episode Card Play Discovery | `Implemented` | `.specs/web/episode-card-play-discovery/` | Shared hover/focus/touch Play discovery contract for every website Episode Card, preserving Pencil anatomy, routing/play semantics, themes and reduced-motion behavior. |
| Contact Page | `Ready for review` | `.specs/web/contact-page/` | Mock-only `/contact` with Beta Header/Footer reuse, deterministic contact/community/business content, and recorded Pencil/browser validation. |
