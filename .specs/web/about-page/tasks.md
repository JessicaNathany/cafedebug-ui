# Tasks: About Page

| Field | Value |
| --- | --- |
| Status | Draft — planning approved, implementation not authorized by this command |
| Spec | `.specs/web/about-page/spec.md` |
| Design contract | `.specs/web/about-page/design.md` |
| Change class | Visual web |
| Canonical execution plan | Yes |

Every task below maps to an acceptance criterion. Do not create a parallel
`plan.md`; this file is the sole implementation plan.

## Phase 1 — Evidence refresh and implementation approval

- [ ] **1.1 Reconfirm design source.**
  - Files/evidence: `cafedebug.pen`; `.specs/web/about-page/design.md`
  - Owner: Architect Guardian + Spec Writer
  - Action: Call Pencil MCP app state, read `MwqyG` / `td6q3` and their
    section nodes, then capture current reference screenshots before source
    changes can invalidate this Draft contract.
  - Expected result: Node map/copy/measurements still match the contract, or
    the spec is corrected before code begins.
  - Dependencies: Active Pencil MCP connection and the current `cafedebug.pen`.
  - Architecture note: Design evidence is read-only; do not edit the encrypted
    Pencil file or production source in this task.
  - Validation: Capture and compare Hero, Mission, Impact, Timeline, Header,
    and Footer evidence.
  - Maps: AC-03, AC-07.

- [ ] **1.2 Record responsive-source status.**
  - Files/evidence: `Wax7y`, `CCkvq`; `design.md`
  - Owner: Spec Writer
  - Action: Search the active Pencil parent frames for dedicated tablet/mobile
    About artboards. If absent, retain the documented 768px/390px adaptations
    and do not label them Pencil-derived.
  - Expected result: Responsive source is either added with node IDs or remains
    an explicit evidence gap.
  - Dependencies: 1.1.
  - Architecture note: An adaptation may use project responsiveness conventions,
    but it cannot be represented as authored Pencil geometry.
  - Validation: Architect Guardian reviews the evidence classification.
  - Maps: AC-06, AC-07.

- [ ] **1.3 Resolve shared-chrome review path.**
  - Files/evidence: `design.md`; `apps/web/src/app/(beta)/layout.tsx`;
    `apps/web/src/components/layout/header.tsx`;
    `apps/web/src/components/layout/footer.tsx`
  - Owner: Architect Guardian
  - Action: Reconcile or explicitly retain the recorded conflict between
    light-frame dark Pencil chrome and root-theme-following Beta shell
    behavior. Do not add an About-only header/footer variant.
  - Expected result: A shared-component decision exists before visual approval.
  - Dependencies: 1.1 and the current Beta layout/component source inspection.
  - Architecture note: The decision must retain one shared Header/Footer and
    cannot introduce an About-local chrome branch.
  - Validation: Record the decision/risk in `workflow-state.md`.
  - Maps: AC-02, AC-03, AC-06, AC-07.

- [ ] **1.4 Approve implementation handoff.**
  - Files: `spec.md`, `design.md`, `tasks.md`, `workflow-state.md`
  - Owner: Architect Guardian
  - Action: Verify the evidence gate, exact fixture copy, architecture
    boundaries, and all acceptance mappings. If any remains materially
    ambiguous, return it to Spec Writer rather than coding around it.
  - Expected result: Explicit approved/rejected outcome for
    Frontend Blacksmith.
  - Dependencies: 1.1–1.3.
  - Architecture note: An unresolved visual-source or shared-shell conflict
    rejects implementation rather than becoming a feature-local workaround.
  - Validation: Update workflow-state handoff record.
  - Maps: AC-01–AC-08.

**Gate:** no production implementation until 1.1–1.4 pass. This `$spec`
delivery stops at this gate.

**Mock-only layer rationale:** This feature has no form, remote integration, or
route handler. Hooks, schemas, `app/api`, feature server handlers, loading,
empty, and error states are **N/A**; do not create empty layers to imitate a
generic feature diagram. The only allowed data boundary is the local
`get-about-content.ts` read seam described below, which must not call `fetch`.

## Phase 2 — Approved implementation only

- [ ] **2.1 Create thin About route and metadata boundary.**
  - Files: `apps/web/src/app/(beta)/about/page.tsx`;
    `apps/web/src/features/about/metadata.ts`
  - Layer: route / feature metadata
  - Owner: Frontend Blacksmith
  - Action: Export canonical, indexable website metadata for `/about` and
    render/delegate to the feature boundary. Keep fixtures, display logic, and
    data reads out of `app/`.
  - Expected result: The route inherits the existing Beta shell and contains no
    `fetch`, business logic, or duplicated chrome.
  - Dependencies: 1.4.
  - Architecture note: `app/(beta)/about/page.tsx` imports only the feature
    route/composition and metadata helper; no fixtures, JSX layout, or shell
    ownership belongs in `app/`.
  - Validation: Route-source test and metadata assertions.
  - Maps: AC-01, AC-02.

- [ ] **2.2 Establish typed deterministic About content.**
  - Files: `apps/web/src/features/about/types.ts`;
    `apps/web/src/features/about/mock/about.mock.ts`;
    `apps/web/src/features/about/services/get-about-content.ts`
  - Layer: types / local service
  - Owner: Frontend Blacksmith
  - Action: Model the four values, four impact metrics, and five milestones
    from the exact Pencil copy. Add only the local content seam needed for
    server-first composition.
  - Expected result: Stable fixture IDs/order, no remote or derived values, and
    no visual Tailwind values inside data.
  - Dependencies: 1.4.
  - Architecture note: This is a feature-local service, not an API client;
    hooks, remote readers, and API routes remain N/A.
  - Validation: Fixture content/order and no-network tests.
  - Maps: AC-04, AC-08.

- [ ] **2.3 Compose semantic About page structure.**
  - Files: `apps/web/src/features/about/components/about-page.tsx`
  - Layer: server component
  - Owner: Frontend Blacksmith
  - Action: Build one `main` with Hero, Purpose, Impact, and Journey sections
    in confirmed order. Keep static editorial copy close to this composition
    unless it is repeated fixture content.
  - Expected result: One `h1`, logical `h2` order, clear section labels,
    and no page-local player/episode responsibility.
  - Dependencies: 2.2.
  - Architecture note: This server-first feature component owns main-content
    composition only; the `(beta)` layout remains the sole Header/Footer owner.
  - Validation: Component/render tests and DOM landmark/headings assertions.
  - Maps: AC-02, AC-03, AC-05.

- [ ] **2.4 Implement Hero and Purpose editorial anatomy.**
  - Files: `apps/web/src/features/about/components/about-page.tsx`;
    `apps/web/src/features/about/components/about-value-card.tsx`
  - Layer: component
  - Owner: Frontend Blacksmith
  - Action: Match the 1440px Hero and Mission measurements/copy in
    `design.md`; render all four value cards through one shared component.
  - Expected result: Token-backed typography/surfaces/icon discs, 880px hero
    heading treatment, 380px/620px editorial relationship, and 4-up cards
    without local hardcoded palette values.
  - Dependencies: 2.2–2.3.
  - Architecture note: `AboutValueCard` is the only repeated-card visual
    responsibility; Lucide icon selection stays fixture-driven and decorative.
  - Validation: Source token review and desktop dark/light screenshot
    comparison.
  - Maps: AC-03, AC-04, AC-06.

- [ ] **2.5 Implement metric surface and accessible timeline.**
  - Files: `apps/web/src/features/about/components/about-impact-metrics.tsx`;
    `apps/web/src/features/about/components/about-timeline.tsx`
  - Layer: component
  - Owner: Frontend Blacksmith
  - Action: Render the four 310px desktop metrics and five timeline milestones
    from fixtures. Keep year, title, and description together in semantic DOM
    order; hide decorative rails/dots from assistive technology.
  - Expected result: The desktop 96px year/24px rail/32px-gap relationship,
    2px border rail, 16px dots, intrinsic long descriptions, and no rigid
    text-height clipping.
  - Dependencies: 2.2–2.3.
  - Architecture note: Components render typed fixture content in DOM order;
    the rail/dots are decorative and no client state or analytics counter is
    introduced.
  - Validation: Accessibility and long-content render tests; desktop Pencil
    review.
  - Maps: AC-03, AC-04, AC-05.

- [ ] **2.6 Activate shared About destinations and sitemap entry.**
  - Files: `apps/web/src/components/layout/navigation-items.ts`;
    `apps/web/src/components/layout/footer.tsx`;
    `apps/web/src/app/sitemap.ts`
  - Layer: shared configuration / route discovery
  - Owner: Frontend Blacksmith
  - Action: Change only the canonical disabled `Sobre` entries to
    `/about` and add a static sitemap entry. Preserve existing Debuggers,
    Contact, deferred destinations, compact menu behavior, and shared
    accessible labels.
  - Expected result: Desktop header, compact menu, and Footer navigate to the
    same route; no copied navigation list exists under the feature.
  - Dependencies: 2.1 and the current shared navigation/Footer conventions.
  - Architecture note: Change the single shared navigation inventory and the
    existing Footer data only; retain `Nav` pathname-driven `aria-current` and
    `MobileNav` ownership rather than adding About-specific state.
  - Validation: Navigation/sitemap route tests and browser navigation checks.
  - Maps: AC-01, AC-02, AC-08.

- [ ] **2.7 Implement theme and responsive adaptations.**
  - Files: `apps/web/src/features/about/components/about-page.tsx`;
    `apps/web/src/features/about/components/about-value-card.tsx`;
    `apps/web/src/features/about/components/about-impact-metrics.tsx`;
    `apps/web/src/features/about/components/about-timeline.tsx`; and
    `packages/web-design-tokens/styles.css` only if an approved measured token
    gap cannot map to an existing semantic alias
  - Layer: component styling
  - Owner: Frontend Blacksmith
  - Action: Use the single token-driven tree in both themes. Preserve desktop
    measurements at 1440px; add documented responsive reflow for 768px and
    390px without horizontal scrolling, timeline collisions, or player
    obstruction.
  - Expected result: Page hierarchy and content order stay readable; compact
    navigation remains owned by `MobileNav`.
  - Dependencies: 1.2–1.3 and 2.4–2.6.
  - Architecture note: Use one token-driven component tree. A new token needs
    documented Pencil evidence and shared-token review; never add a light/dark
    About component copy or modify player ownership.
  - Validation: all six theme/viewport captures and
    `scrollWidth <= clientWidth`.
  - Maps: AC-02, AC-03, AC-05, AC-06.

**Gate:** Frontend Blacksmith hands off only after every Phase 2 task is
implemented, focused tests are present, and shared responsibilities remain
unforked.

## Phase 3 — Automated checks

- [ ] **3.1 Add focused coverage.**
  - Files: `apps/web/tests/about-source.test.mjs`
  - Owner: Frontend Blacksmith
  - Action: Test fixture values/order; landmarks/headings; decorative icon
    hiding; accessible metric/timeline relationships; no feature `fetch`;
    shared route/nav/footer/sitemap composition; and long-content resilience.
  - Expected result: Tests cover the feature contract rather than source-string
    coincidence only.
  - Dependencies: 2.1–2.7.
  - Architecture note: Test the public boundary and semantic result, including
    feature-wide no-network behavior, without duplicating production logic.
  - Validation: targeted test output.
  - Maps: AC-01, AC-02, AC-04, AC-05, AC-08.

- [ ] **3.2 Run repository validation commands.**
  - Owner: The Debugger
  - Commands:
    - `pnpm ci:web:validation`
    - `pnpm --filter @cafedebug/web run test`
    - `pnpm --filter @cafedebug/web run lint`
    - `pnpm --filter @cafedebug/web run typecheck`
    - `pnpm --filter @cafedebug/web run build`
    - `git diff --check`
  - Expected result: All pass, or failures are investigated by The Debugger and
    corrected by the responsible role.
  - Dependencies: 3.1.
  - Architecture note: Validation failures never authorize unrelated cleanup or
    weakening the spec contract.
  - Validation: Record exact output/result in `validation.md` and
    `workflow-state.md`.
  - Maps: AC-08.

- [ ] **3.3 Perform architecture/responsibility audit.**
  - Owner: The Debugger + Architect Guardian
  - Action: Verify route-only `app/`, feature-owned data/UI, no direct
    `fetch`, token-only visual values, no duplicate navigation/shell/player
    state, deterministic content, and N/A rationale for API/loading/error
    layers.
  - Expected result: Explicit acceptance/rejection with actionable corrections.
  - Dependencies: 2.1–2.7 and 3.1–3.2.
  - Architecture note: Confirm the mock-only N/A layers are deliberate and the
    shared player/shell/navigation still have exactly one owner.
  - Validation: Architecture audit in `workflow-state.md`.
  - Maps: AC-01, AC-02, AC-04, AC-08.

## Phase 4 — Pencil comparison and visual correction loop (`web-design-reviewer`)

- [ ] **4.1 Complete the mandatory Pencil comparison matrix.**
  - Owner: web-design-reviewer
  - Target: running `/about`
  - Matrix: 1440×1200, 768×1024, and 390×844 in dark and light.
  - Action: Compare the rendered 1440px dark/light page section-by-section to
    `MwqyG` / `td6q3`: Header, Hero/metrics, Mission/cards, Impact/metrics,
    Journey/timeline, and Footer. Capture the same sections at 768px and 390px
    in both themes, explicitly labeling those captures responsive-adaptation
    evidence because Pencil supplies no authored tablet/mobile frame.
  - Expected result: `validation.md` contains expected and actual geometry,
    typography/wrapping, token surface, radii, icon anatomy, copy/order, and
    shared-chrome findings for every desktop comparison; source-only review is
    insufficient.
  - Dependencies: 1.1–1.3, 2.7, and 3.2.
  - Architecture note: A light-chrome mismatch follows the shared-shell
    decision path from 1.3; it cannot be hidden by an About-only variant.
  - Validation: Screenshot artifacts plus one concrete `validation.md` row per
    visual finding.
  - Maps: AC-02, AC-03, AC-05, AC-06, AC-07.

- [ ] **4.2 Correct and re-review every material difference.**
  - Owner: Frontend Blacksmith, then web-design-reviewer
  - Action: For each P0/P1/P2 difference, correct the smallest architectural
    source and repeat render → screenshot → comparison. Do not redesign or
    conceal a mismatch with a feature-local token/variant.
  - Expected result: No unresolved blocking/high-severity mismatch; approved
    minor/shared-shell deviations are concrete and accepted in writing.
  - Dependencies: 4.1.
  - Architecture note: Correct the smallest responsible source, then rerun
    affected focused/automated checks. Escalate a shared-shell change back to
    specification; never fork feature-local chrome or tokens.
  - Validation: One actionable `validation.md` row per finding.
  - Maps: AC-03, AC-06, AC-07.

**Gate:** the required Pencil comparison and re-review are complete before
`webapp-testing` begins. Any high-severity visual difference or unresolved
shared-shell decision returns the work to Frontend Blacksmith or specification.

## Phase 5 — Browser behavior and accessibility validation (`webapp-testing`)

- [ ] **5.1 Capture the responsive/theme browser matrix.**
  - Files: `.specs/web/about-page/validation.md`
  - Owner: webapp-testing
  - Action: Exercise `/about` at 1440×1200, 768×1024, and 390×844 in dark and
    light after Phase 4 visual approval. Check Header, Hero/metrics,
    Mission/cards, Impact/metrics, Journey/timeline, Footer, compact navigation,
    and persistent-player clearance.
  - Expected result: No horizontal overflow, clipping, overlap, unreadable
    wrapping, or player obstruction. Tablet/mobile records remain adaptation
    validation, not Pencil pixel-parity claims.
  - Dependencies: 4.2.
  - Architecture note: The check validates the shared shell/player in place;
    it does not authorize an About-owned navigation, theme, or audio state.
  - Validation: Six screenshot links/artifacts and DOM
    `scrollWidth <= clientWidth` results in `validation.md`.
  - Maps: AC-02, AC-03, AC-05, AC-06, AC-07.

- [ ] **5.2 Validate keyboard, semantics, and state resilience.**
  - Files: `.specs/web/about-page/validation.md`
  - Owner: webapp-testing; The Debugger when a defect appears
  - Action: Test tab order through shared chrome; Menu/Escape/focus return;
    theme persistence; visible focus; screen-reader-relevant landmarks,
    headings, metric/timeline reading order; long copy; and browser zoom or a
    documented equivalent limitation.
  - Expected result: Decorative graphics are not the only semantic indicator
    and static page content creates no dead interactive controls.
  - Dependencies: 4.2.
  - Architecture note: Test existing shared interactions as consumers, without
    adding page-local controls or duplicated state.
  - Validation: Browser evidence and any defect report.
  - Maps: AC-02, AC-05, AC-06, AC-08.

## Phase 6 — Documentation and final handoff

- [ ] **6.1 Record feature and documentation impact.**
  - Files: `.specs/web/about-page/validation.md`;
    `.specs/web/about-page/workflow-state.md`; `.specs/README.md`
  - Owner: Documentation Monk
  - Action: Record the final implementation evidence, source/gap decisions,
    screenshot comparison, changed paths, and any approved deviation. Update
    the spec index only when completion is proven.
  - Expected result: Documentation matches shipped behavior; standalone
    `documentation-writer` remains N/A unless new contributor documentation
    is introduced.
  - Dependencies: 3.3, 4.2, and 5.1–5.2.
  - Architecture note: Documentation records the actual shared-system decision
    and responsive evidence rather than retrospectively declaring adaptation
    behavior to be Pencil-authored.
  - Validation: Documentation Monk handoff.
  - Maps: AC-07, AC-08.

- [ ] **6.2 Perform final architecture gate.**
  - Owner: Architect Guardian
  - Action: Verify each AC’s evidence, the shared shell/player boundaries,
    reviewer verdict, automated checks, documentation state, and unresolved
    risks.
  - Expected result: Explicit approved/rejected delivery decision.
  - Dependencies: 6.1 and complete evidence for AC-01–AC-08.
  - Architecture note: This gate may reject implementation; it cannot waive
    a missing visual, architecture, test, or documentation record.
  - Validation: Final gate in `workflow-state.md`.
  - Maps: AC-01–AC-08.
