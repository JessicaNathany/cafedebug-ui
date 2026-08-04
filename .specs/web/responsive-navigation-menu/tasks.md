# Tasks: Responsive Navigation Menu

## Phase 1 — Design source and contracts

- [x] Update Pencil desktop header `m9zV96` to the four-item primary-navigation model.
- [x] Update Pencil footer `LSgoB` with visible `— Em breve` copy.
- [x] Add and inspect compact beta/fixed-dark closed/open nodes.
- [x] Record exact nodes, geometry, tokens, accessibility, and component boundaries in `design.md`.

## Phase 2 — Navigation implementation

- [x] Extract the canonical ordered navigation model.
- [x] Update desktop `Nav` to render only the canonical items at `lg` and above.
- [x] Add `MobileNav` as the isolated client interaction boundary.
- [x] Compose the trigger after the wordmark and anchor the open panel to the shared header.
- [x] Implement click, `Escape`, outside-pointer, link, and desktop-breakpoint dismissal.

## Phase 3 — Footer implementation

- [x] Add status metadata for `Notícias`, `Eventos`, and `Vagas`.
- [x] Render exact visible `— Em breve` copy while keeping the items inert and route-free.
- [x] Preserve unrelated footer geometry, content, and theme behavior.

## Phase 4 — Automated coverage

- [x] Replace assertions that require navigation to disappear without a replacement.
- [x] Assert canonical desktop/compact contents and absence of removed primary items.
- [x] Assert trigger semantics, client isolation, focus/dismissal code paths, and breakpoint rules.
- [x] Assert footer order, status copy, and lack of `href`.

## Phase 5 — Validation and documentation

- [x] Run focused and full web tests.
- [x] Run lint, typecheck, build, and `git diff --check`.
- [x] Validate desktop, breakpoint, below-breakpoint, tablet, and mobile runtime behavior.
- [x] Validate beta light/dark and fixed-dark open/closed visuals against Pencil.
- [x] Exercise keyboard, outside-pointer, link, and resize dismissal.
- [x] Record evidence and residual gaps in `validation.md`.
- [x] Update the spec index and lifecycle statuses to `Implemented` only after every gate passes.
