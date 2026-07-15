# Design: Homepage Visual Parity with Pencil

| Field | Value |
| --- | --- |
| **Status** | `Implemented` |
| **Spec** | `.specs/web/homepage-visual-parity/spec.md` |
| **Design source** | `cafedebug.pen` |
| **Node index** | `.specs/web/foundation/ux-design-reference.md` |
| **Mandatory node IDs** | `tWWON`, `k71CIc`, `m9zV96`, `LSgoB`, `FGSFI` |

---

## 1. Architecture Guardrails

1. `apps/web/src/app/page.tsx` remains thin and delegates to feature composition.
2. Homepage implementation stays in `apps/web/src/features/episodes/components/home-page.tsx`.
3. Reusable shell remains in:
   - `apps/web/src/components/layout/header.tsx`
   - `apps/web/src/components/layout/footer.tsx`
4. Episode card parity is implemented in `apps/web/src/features/episodes/components/episode-card.tsx`.
5. No direct network calls in page/component layer.

---

## 2. Section-Level Design Mapping

### 2.1 Hero (from `tWWON` and `k71CIc`)

Must include:

1. Left content cluster: eyebrow, title, full description, CTA row, stats row.
2. Live indicator element (dot + label) in the hero information hierarchy.
3. Right rich player card containing:
   - artwork
   - playback controls group
   - time labels and progress affordance
   - speed indicator/control
   - volume indicator/control

### 2.2 Recent Episodes (card uses `FGSFI`)

Must include:

1. Section subtitle + title hierarchy.
2. Card image block with:
   - category label
   - centered play icon button (56x56)
   - duration pill with icon
3. Card body text rhythm aligned to Pencil spacing and typography hierarchy.

### 2.3 News & Events

Must include:

1. News column with cards mirroring Pencil structure.
2. Events column with schedule anatomy mirroring Pencil.
3. No placeholder-only panel.

### 2.4 Newsletter

Must include:

1. Correct title/body copy.
2. Main email pill input-style element with send button.
3. UI-only treatment (no submit integration in this phase).

---

## 3. Theme Behavior Mapping

1. Dark reference: `tWWON`.
2. Light-content reference: `k71CIc`.
3. Header and footer parity is anchored to `m9zV96` and `LSgoB` in both modes.
4. Homepage sections that are dark-pinned vs light-content must follow Pencil section behavior.

---

## 4. Verification Strategy

1. Visual check per section against required node IDs.
2. Verify no regressions on header/footer while updating homepage sections.
3. Verify mobile responsive equivalence for hero, cards, news/events, newsletter.
4. Verify token-only styling and no architecture violations.
