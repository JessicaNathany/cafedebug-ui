# Tasks: Homepage Visual Parity with Pencil

| Field | Value |
| --- | --- |
| **Status** | `Implemented` |
| **Spec** | `.specs/web/homepage-visual-parity/spec.md` |
| **Design** | `.specs/web/homepage-visual-parity/design.md` |
| **Lifecycle** | `spec -> plan -> implementation -> debug -> documentation` |

---

## Phase 1 - Spec Lock (Current)

- [x] Define mandatory visual references (`tWWON`, `k71CIc`, `m9zV96`, `LSgoB`, `FGSFI`)
- [x] Define Decision Gate outcomes and scope boundaries
- [x] Define objective acceptance criteria per section
- [x] Architecture Guardian approval for spec completeness gate

---

## Phase 2 - Planning (Master Planner)

- [x] Break implementation into ordered file-level tasks
- [x] Map each task to corresponding acceptance criteria IDs
- [x] Add dependency order and risk notes (hero, card, news/events, newsletter)
- [x] Produce execution checklist for desktop/mobile + dark/light validation

### 2.1 Ordered File-Level Plan

1. `apps/web/src/features/episodes/components/home-page.tsx`
   - Rebuild Hero to include live-dot, full description copy, stats row, and rich player card shell.
   - Rebuild News & Events into two columns (news cards + events schedule).
   - Rebuild Newsletter main block with email pill and send button (UI-only).
2. `apps/web/src/features/episodes/components/episode-card.tsx`
   - Align card anatomy to node `FGSFI` (centered 56x56 play control and duration pill with icon).
3. `apps/web/src/components/layout/header.tsx`
   - Validate parity against `m9zV96` and apply minimal corrective changes only if homepage updates reveal mismatch.
4. `apps/web/src/components/layout/footer.tsx`
   - Validate parity against `LSgoB` and apply minimal corrective changes only if homepage updates reveal mismatch.
5. `apps/web/src/app/page.tsx`
   - Keep routing-only composition intact (no business logic introduction).

### 2.2 Task to Acceptance-Criteria Mapping

| Task ID | File(s) | Scope | AC IDs |
| --- | --- | --- | --- |
| P1 | `apps/web/src/features/episodes/components/home-page.tsx` | Hero reconstruction | `AC-HERO-01`, `AC-HERO-02`, `AC-HERO-03`, `AC-HERO-04` |
| P2 | `apps/web/src/features/episodes/components/episode-card.tsx` | Recent Episodes card anatomy | `AC-REC-02`, `AC-REC-03`, `AC-REC-04` |
| P3 | `apps/web/src/features/episodes/components/home-page.tsx` | Recent Episodes subtitle/hierarchy | `AC-REC-01` |
| P4 | `apps/web/src/features/episodes/components/home-page.tsx` | News & Events full section | `AC-NEWS-01`, `AC-NEWS-02`, `AC-NEWS-03` |
| P5 | `apps/web/src/features/episodes/components/home-page.tsx` | Newsletter full section | `AC-NEWSLETTER-01`, `AC-NEWSLETTER-02`, `AC-NEWSLETTER-03` |
| P6 | `apps/web/src/components/layout/header.tsx` | Header non-regression (`m9zV96`) | `AC-THEME-01`, `AC-THEME-02` |
| P7 | `apps/web/src/components/layout/footer.tsx` | Footer non-regression (`LSgoB`) | `AC-THEME-01`, `AC-THEME-02` |
| P8 | `apps/web/src/app/page.tsx` and updated files | Architecture guardrails | `AC-ARCH-01`, `AC-ARCH-02`, `AC-ARCH-03` |
| P9 | All updated homepage files | Mobile and theme equivalence | `AC-RESP-01`, `AC-THEME-01`, `AC-THEME-02` |

### 2.3 Dependency Order

1. Complete Hero and section structure in `home-page.tsx` before card tuning.
2. Complete `episode-card.tsx` parity before final spacing calibration in Recent Episodes section.
3. Run header/footer regression checks after homepage structural updates.
4. Run architecture and token compliance checks before debug visual validation.

### 2.4 Risk Notes and Mitigation

1. Risk: Hero rich player shell can conflict with existing reusable play interactions.
   - Mitigation: keep current interaction wiring and only adjust visual anatomy.
2. Risk: Episode card icon/overlay updates can break image layering.
   - Mitigation: validate absolute positioning and z-index in both themes.
3. Risk: News & Events complexity can cause mobile overflow.
   - Mitigation: define explicit mobile stacking order and spacing tokens.
4. Risk: Newsletter main pill/button can drift from token usage.
   - Mitigation: enforce semantic token classes and avoid hardcoded values.
5. Risk: Header/footer accidental drift while touching homepage.
   - Mitigation: treat `header.tsx` and `footer.tsx` as regression-only checkpoints.

### 2.5 Execution Checklist (Desktop/Mobile + Dark/Light)

1. Desktop dark parity check vs `tWWON` for Hero, Episodes, News & Events, Newsletter.
2. Desktop light-content parity check vs `k71CIc` for same sections.
3. Mobile dark check for hierarchy and no clipping/overlap.
4. Mobile light-content check for hierarchy and no clipping/overlap.
5. Header/footer parity checkpoints vs `m9zV96` and `LSgoB` in both modes.
6. Card anatomy checkpoint vs `FGSFI` in both modes.

---

## Phase 3 - Implementation (Frontend Blacksmith)

- [x] Architecture Guardian approval to start implementation phase
- [x] Inspect mandatory nodes with Pencil MCP before coding (get_editor_state(include_schema: true), get_screenshot and batch_get for tWWON, k71CIc, m9zV96, LSgoB, FGSFI)
- [x] Capture current homepage baseline screenshot from local app for before/after parity tracking
- [x] Implementation kickoff packet delivered to Frontend Blacksmith
- [x] Batch 1 execution started: Hero parity plus episode card anatomy parity
- [x] Update homepage hero structure to include live-dot, full copy, stats row, and rich player card
- [x] Align recent episodes section subtitle and episode card anatomy to `FGSFI`
- [x] Replace News & Events placeholder with full two-column section
- [x] Replace simplified newsletter with full Pencil-aligned main block
- [x] Preserve header/footer parity with `m9zV96` and `LSgoB`
- [x] Keep `apps/web/src/app/page.tsx` routing-only
- [x] Avoid direct `fetch` in components and avoid hardcoded visual values

---

## Phase 4 - Debug and Validation (The Debugger)

- [x] Re-run Pencil MCP comparison after implementation for `tWWON`, `k71CIc`, `m9zV96`, `LSgoB`, `FGSFI`
- [x] Validate visual parity for dark reference (`tWWON`)
- [x] Validate visual parity for light-content reference (`k71CIc`)
- [x] Validate `m9zV96` and `LSgoB` non-regression
- [x] Validate `FGSFI` anatomy on cards
- [x] Validate mobile responsive equivalence across all corrected sections
- [x] Run lint/type/test gates and record any gaps

---

## Phase 5 - Documentation (Documentation Monk)

- [x] Update relevant web specs/docs to reflect delivered homepage parity
- [x] Record final node-to-implementation mapping
- [x] Mark spec/tasks status as Implemented after all gates pass

### 5.1 Final Node-to-Implementation Mapping

1. `tWWON` and `k71CIc` (Homepage dark/light-content):
   - `apps/web/src/features/episodes/components/home-page.tsx`
2. `m9zV96` (Site Header):
   - `apps/web/src/components/layout/header.tsx`
3. `LSgoB` (Site Footer):
   - `apps/web/src/components/layout/footer.tsx`
4. `FGSFI` (Episode Card anatomy):
   - `apps/web/src/features/episodes/components/episode-card.tsx`
5. Shared control behavior used by hero and cards:
   - `apps/web/src/features/episodes/components/play-button.tsx`
