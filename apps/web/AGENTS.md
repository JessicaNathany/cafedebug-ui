# CafeDebug Web Agent Instructions

These instructions apply to all work under `apps/web`.

## Required Reading

Before editing a route, component, style, fixture, or web token:

1. `/AGENTS.md`
2. `/README.md`
3. `/.specs/README.md`
4. `/.github/copilot-instructions.md`
5. `/.specs/web/foundation/ux-design-reference.md`
6. The relevant `/.specs/web/<feature>/spec.md`, `design.md`, and `tasks.md`

If the relevant web feature has no spec/design/tasks folder, stop and create or update the spec first.

## Source Of Truth

For web visual implementation, use this priority order:

1. Approved Pencil node in `/cafedebug.pen`
2. Feature implementation contract in `/.specs/web/<feature>/`
3. Web design tokens in `packages/web-design-tokens`
4. Existing web components and feature patterns
5. Agent judgment only for gaps explicitly documented in the spec

`/cafedebug.pen` is encrypted. Inspect it only through Pencil MCP. Do not open, parse, rewrite, move, or duplicate the `.pen` file during implementation work.

If a future task wants `cafedebug.pen` moved into `designs/`, treat that as a separate migration. Update every reference in specs, skills, agent instructions, and validation tooling in the same change.

## Pencil Inspection Workflow

For every visual or UX change:

1. Read `/.specs/web/foundation/ux-design-reference.md` and identify the target node IDs.
2. Call Pencil MCP `get_editor_state({ include_schema: true })`.
3. Inspect the target nodes with `get_screenshot` and `batch_get`.
4. Record the inspected node IDs in the feature tasks or validation notes.
5. Implement the inspected component anatomy, spacing, typography, copy, assets, responsive behavior, and light/dark treatment.
6. Recompare the implementation against Pencil before handoff.

Do not implement a visual substitute when Pencil defines the UI.

## Implementation Rules

- Use Next.js App Router and TypeScript.
- Default to Server Components.
- Use Client Components only for real browser interaction or client state.
- Keep `src/app` routing-only: `page.tsx`, `layout.tsx`, route handlers, metadata, and composition.
- Put feature UI and behavior under `src/features/<domain>`.
- Use server-only reads in `features/<domain>/server`.
- Do not call `fetch` directly inside pages or components.
- Use generated API contracts from `packages/api-client` when real backend data is in scope.
- Use `packages/web-design-tokens` and semantic Tailwind classes only.
- Do not hardcode hex colors, named colors, shadows, arbitrary spacing, or one-off radii when a token exists.
- Do not change shared tokens to force one page to match; first confirm the Pencil variable and update the feature spec.
- Do not replace an approved Pencil layout with a shadcn/ui or template layout.

## Screen Contracts

Every non-trivial page or section must have a contract in its feature spec folder. Use:

`/.specs/web/page-contract-template.md`

The contract must define:

- Pencil node IDs for dark and light variants
- fixed validation viewports
- deterministic fixture content
- required components
- responsive behavior
- theme behavior
- visual acceptance criteria
- unresolved design gaps

The implementation agent must not reinterpret the design beyond the approved contract.

## Deterministic Visual Data

Visual parity work must use stable fixture data until the page is approved:

- fixed titles, descriptions, dates, tags, numbers, durations, and images
- local assets from `apps/web/public` when possible
- stable theme and viewport settings
- no dynamic time, analytics, random content, or remote images in screenshot tests

After approval, real API integration may replace the fixture adapter, but fixture mode must remain available for visual regression tests.

## Visual Validation

Use these baseline viewports unless the feature spec defines a stricter set:

| Name | Size |
| --- | --- |
| Desktop | `1440 x 1200` |
| Tablet | `768 x 1024` |
| Mobile | `390 x 844` |

For each relevant viewport:

1. Capture the Pencil reference node.
2. Run the local app.
3. Capture the implemented route.
4. Compare layout, spacing, typography, wrapping, color tokens, radii, assets, and responsive behavior.
5. Fix measurable differences without redesigning the screen.

Also verify:

- no horizontal overflow
- keyboard reachable controls
- visible focus states
- alt text for meaningful images
- light/dark parity as defined by Pencil

## Completion Requirements

Before handoff:

- run `pnpm --filter @cafedebug/web run lint`
- run `pnpm --filter @cafedebug/web run typecheck`
- run `pnpm --filter @cafedebug/web run test`
- run any feature-specific Playwright or screenshot checks defined by the spec
- report the Pencil node IDs reviewed
- list any remaining visual differences or blocked checks
- update the feature spec if delivered behavior changed
