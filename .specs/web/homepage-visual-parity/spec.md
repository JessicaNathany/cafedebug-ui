# Spec: Homepage Visual Parity with Pencil

| Field | Value |
| --- | --- |
| **Status** | `Implemented` |
| **Domain** | `web/homepage` |
| **Spec path** | `.specs/web/homepage-visual-parity/` |
| **Affected app** | `apps/web` |
| **Design source (mandatory)** | `cafedebug.pen` |
| **Node index (mandatory)** | `.specs/web/foundation/ux-design-reference.md` |
| **Mandatory node IDs** | `tWWON`, `k71CIc`, `m9zV96`, `LSgoB`, `FGSFI` |
| **Lifecycle** | `spec -> plan -> implementation -> debug -> documentation` |

---

## 1. Problem Statement

The homepage implementation diverges from the Pencil source of truth in critical visual sections. The current experience does not match the required anatomy and content for Hero, Recent Episodes, News & Events, and Newsletter.

This spec defines the exact requirements to reach full visual parity with the official Pencil nodes while preserving CafeDebug architecture constraints and theme behavior.

---

## 2. Scope

### In scope

1. Homepage parity against node `tWWON` (dark) and `k71CIc` (light-content).
2. Header parity against node `m9zV96` and footer parity against node `LSgoB`.
3. Episode card parity against node `FGSFI`.
4. Desktop and mobile responsive equivalence.
5. Theme behavior parity for dark/light with dark-first homepage treatment.

### Out of scope

1. New backend integrations for homepage sections.
2. New routes outside homepage scope.
3. Refactors unrelated to parity and architecture compliance.

---

## 3. Decision Gate Outcomes (Locked)

1. Visual source is strict: full parity with Pencil, no creative substitutions.
2. Hero rich player is visual-first in this phase (minimal interactions only).
3. News & Events uses static mock content aligned to Pencil.
4. Newsletter section remains UI-only (no real submit integration).
5. Mobile requires responsive structural equivalence, not desktop pixel mirroring.

---

## 4. Functional Requirements

### FR-1 Hero Parity

Homepage hero must match Pencil anatomy including:

1. Live indicator dot and associated label.
2. Full description copy, including the currently missing final sentence.
3. Stats row with all required metric items.
4. Rich player card with artwork, control cluster, time markers, speed, and volume elements.

### FR-2 Recent Episodes Parity

1. Section subtitle must be present and match Pencil hierarchy.
2. Episode cards must follow node `FGSFI` anatomy.
3. Duration pill must include icon.
4. Play action must be centered icon button with 56x56 footprint.

### FR-3 News & Events Parity

1. Remove simplified placeholder treatment.
2. Implement complete section anatomy with:
   - news cards column
   - events schedule column
3. Use static mocked content that follows Pencil copy and structure.

### FR-4 Newsletter Parity

1. Replace simplified block with Pencil structure and copy.
2. Include main email pill + send button in the primary newsletter block.
3. Keep behavior UI-only for this phase (no real submit).

### FR-5 Header/Footer Parity

1. Header must keep parity with `m9zV96`.
2. Footer must keep parity with `LSgoB`.
3. Any homepage updates cannot regress these two components.

### FR-6 Theme Parity

1. Homepage must preserve dark-first behavior based on `tWWON`/`k71CIc` reference.
2. Light-content treatment must only affect sections defined by Pencil.
3. Typography, contrast, and hierarchy must remain equivalent in both modes.

---

## 5. Architecture and Constraints

1. Files under `apps/web/src/app` remain routing-only.
2. Homepage business composition remains in `features` layer.
3. No direct `fetch` in page/component layer for this parity work.
4. Styling must use web design tokens; no hardcoded visual overrides.
5. Keep Next.js + Tailwind conventions from `.github/instructions/nextjs-tailwind.instructions.md`.

---

## 6. Acceptance Criteria (Objective)

### Hero

1. AC-HERO-01: Live-dot is visible and correctly positioned.
2. AC-HERO-02: Hero description includes final required sentence from Pencil.
3. AC-HERO-03: Stats row includes all metrics defined in the target node.
4. AC-HERO-04: Rich player card includes artwork, controls, time, speed, and volume UI.

### Recent Episodes

1. AC-REC-01: Section subtitle exists and matches visual hierarchy.
2. AC-REC-02: Episode card layout matches `FGSFI` anatomy.
3. AC-REC-03: Duration pill includes icon.
4. AC-REC-04: Play button is centered and 56x56.

### News & Events

1. AC-NEWS-01: No placeholder-only container remains.
2. AC-NEWS-02: News column and events schedule column are both present.
3. AC-NEWS-03: Content is static mock but structurally identical to Pencil.

### Newsletter

1. AC-NEWSLETTER-01: Main block copy matches Pencil wording.
2. AC-NEWSLETTER-02: Email pill + send button exist in the main block.
3. AC-NEWSLETTER-03: Submit remains disabled/non-integrated by design.

### Theme + Responsiveness

1. AC-THEME-01: Dark mode matches `tWWON` section behavior.
2. AC-THEME-02: Light-content mode matches `k71CIc` section behavior.
3. AC-RESP-01: Mobile preserves hierarchy and anatomy across all updated sections.

### Architecture

1. AC-ARCH-01: `apps/web/src/app/page.tsx` stays thin (routing/composition only).
2. AC-ARCH-02: No direct `fetch` introduced in homepage component files.
3. AC-ARCH-03: No hardcoded color values introduced in updated homepage components.

---

## 7. Validation Matrix (Required in Debug Phase)

1. Visual comparison: homepage dark (`tWWON`) vs implementation.
2. Visual comparison: homepage light-content (`k71CIc`) vs implementation.
3. Component comparison: header (`m9zV96`) and footer (`LSgoB`) non-regression.
4. Component comparison: episode card (`FGSFI`) anatomy.
5. Breakpoints: desktop and mobile evidence captured for all corrected sections.

---

## 8. Implementation Notes

1. Hero parity and section rebuild delivered in `apps/web/src/features/episodes/components/home-page.tsx`.
2. Episode card parity (`FGSFI`) delivered in `apps/web/src/features/episodes/components/episode-card.tsx`.
3. Play action support for icon-only usage delivered in `apps/web/src/features/episodes/components/play-button.tsx`.
4. Validation gates completed with lint, typecheck, tests, and Pencil MCP comparison against required node IDs.
