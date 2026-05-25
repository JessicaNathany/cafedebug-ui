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

---

## Spec Index

### `admin`

| Feature | Status | Path | Description |
|---|---|---|---|
| Admin Login | `Implemented` | `.specs/admin/login/` | Full feature spec for admin login flow against POST /api/v1/admin/auth/token |
| Login Page Refactor | `Implemented` | `.specs/admin/login-refactor/` | Aligns the login page UI to the Stitch theme design reference |
| Auth Handler Error Normalization | `Draft` | `.specs/admin/auth-error-normalization/` | Extracts shared error response building and normalizes error shapes across all auth API routes |
| Episode Show Notes Editor (Tiptap) | `Draft` | `.specs/admin/episode-editor-tiptap/` | Replaces the Show Notes textarea with a Tiptap-based editor while preserving existing episode API behavior |
| API Client Refactor | `Implemented` | `.specs/admin/api-client-refactor/` | Refactors API contract and client organization around Orval, with TanStack Query in admin and server-first fetching in web |
| Episode Category Selector | `Implemented` | `.specs/admin/episode-category-selector/` | Replaces hardcoded category options in the episode editor with a dynamic list fetched from the backend categories API |
| Episode List Search | `Draft` | `.specs/admin/episode-search/` | Replaces client-side filtering with server-side search via `GET /api/v1/admin/episodes?search=` |

### `platform`

| Feature | Status | Path | Description |
|---|---|---|---|
| Next.js 16 Migration | `Implemented` | `.specs/platform/nextjs-16-migration/` | Framework upgrade from Next.js 15 to 16 with middleware-to-proxy migration |
| Node.js & TypeScript Upgrade | `Implemented` | `.specs/platform/node-ts-upgrade/` | Node.js 20 to 22, TypeScript 5.9 to 6.0 with tsconfig and CI updates |
| GitHub Actions CI Validation Redesign | `Implemented` | `.specs/platform/ci-validation-redesign/` | Revises CI to one admin-only validation job with sequential build, test, and validate steps |
