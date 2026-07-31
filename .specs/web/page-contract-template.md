# Web Page Implementation Contract Template

Copy this template into `/.specs/web/<feature>/design.md` or a dedicated contract section before implementing a non-trivial web page or section.

## Design Source

| Field | Value |
| --- | --- |
| Pencil file | `/cafedebug.pen` |
| Node index | `/.specs/web/foundation/ux-design-reference.md` |
| Dark node | `<node-id>` |
| Light-content node | `<node-id or n/a>` |
| Component nodes | `<node-id list>` |
| Route | `<app route>` |
| Feature folder | `apps/web/src/features/<domain>` |

## Viewports

| Name | Size | Required |
| --- | --- | --- |
| Desktop | `1440 x 1200` | Yes |
| Tablet | `768 x 1024` | Yes |
| Mobile | `390 x 844` | Yes |

Add more viewports only when Pencil or the feature behavior requires them.

## Layout Contract

- Page shell:
- Header/footer behavior:
- Main container width:
- Desktop gutters:
- Tablet gutters:
- Mobile gutters:
- Section order:
- Section spacing tokens:
- Grid/column behavior:
- Image aspect ratios:
- Overflow constraints:

## Typography Contract

| Element | Token/class | Weight | Size/line-height | Notes |
| --- | --- | --- | --- | --- |
| H1 |  |  |  |  |
| Section heading |  |  |  |  |
| Body |  |  |  |  |
| Caption/metadata |  |  |  |  |

## Token Contract

- Background:
- Foreground:
- Card/surface:
- Primary action:
- Muted text:
- Border/outline if present:
- Radius:
- Shadow/elevation:

No raw color values or arbitrary Tailwind values are allowed in feature components unless the value is first promoted to `packages/web-design-tokens`.

## Component Contract

| Component | Source | Responsibility |
| --- | --- | --- |
| `<ComponentName>` | existing/new |  |

Reuse existing feature components before creating new ones. Create a shared component only when it represents a stable primitive or appears in more than one page.

## Data And Fixtures

Visual implementation must start with deterministic fixture content.

- Fixture location:
- Titles:
- Descriptions:
- Dates:
- Tags/categories:
- Episode numbers:
- Durations:
- Images/assets:
- Empty/loading/error dimensions:

When real API data is added, preserve the approved layout dimensions and keep fixture mode available for screenshot tests.

## Responsive Behavior

- Desktop:
- Tablet:
- Mobile:
- Navigation:
- Primary actions:
- Long text/wrapping:
- Touch target requirements:

If no mobile Pencil frame exists, document the inferred behavior here before implementation.

## Theme Behavior

- Dark behavior:
- Light behavior:
- Always-dark areas:
- Theme-specific content bands:
- Interaction states:

The UI is not complete unless the layout and hierarchy work in both themes.

## Accessibility Contract

- Landmarks:
- Heading order:
- Keyboard navigation:
- Focus states:
- Image alt text:
- Icon-only labels:
- Contrast concerns:

## Acceptance Criteria

- Pencil nodes inspected with `get_editor_state`, `get_screenshot`, and `batch_get`.
- Implementation screenshots captured at every required viewport.
- No horizontal overflow.
- Typography, spacing, wrapping, colors, radii, and assets match the approved Pencil nodes.
- Loading, empty, and error states preserve layout dimensions.
- `apps/web/src/app` remains routing-only.
- No direct `fetch` in pages or components.
- No hardcoded visual values in feature components.
- `pnpm --filter @cafedebug/web run lint` passes.
- `pnpm --filter @cafedebug/web run typecheck` passes.
- `pnpm --filter @cafedebug/web run test` passes.

## Open Questions

| Question | Owner | Blocking? | Resolution |
| --- | --- | --- | --- |
|  |  |  |  |
