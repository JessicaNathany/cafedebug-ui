# Tasks: Contact Page

> `tasks.md` is the sole execution plan. Product and Pencil evidence gates were resolved on 2026-08-16; implementation and validation are ready for formal review.

## Traceability

| Acceptance | Atomic work and evidence |
| --- | --- |
| AC-01 | 2.1–2.2, 3.1, 4.1 |
| AC-02 | 1.1–1.3, 4.1–4.2 |
| AC-03 | 2.5, 3.1, 4.1, 5.1 |
| AC-04 | 1.4–1.6, 2.4–2.5, 3.2, 4.2 |
| AC-05 | 1.5, 1.7–1.8, 2.3, 3.3, 4.3 |
| AC-06 | 1.9, 2.6, 3.3, 4.3 |
| AC-07 | 1.2, 2.7, 4.1–4.2, 5.1–5.5 |
| AC-08 | 2.1–2.7, 3.1–3.4, 4.1–4.2, 5.1–5.5, 6.1–6.2 |

## Phase 1 — Evidence and approval (all blocking)

- [x] **1.1 Pencil baseline collection.** **Files:** `design.md`, source screenshot references in the feature package. **Layer:** design evidence. **Result:** Pencil MCP connected on 2026-08-16; `hBoyk`/`Glg7r` hierarchy, screenshots, measurements, typography, tokens, assets, radii, borders, and theme deltas are recorded in `design.md`. **Depends:** active Pencil app. **Checkpoint:** completed without promoting uninspected responsive/interactive states to Pencil evidence. *(AC-02)*
- [x] **1.2 Responsive evidence.** **Files:** `design.md`, `workflow-state.md`, `validation.md`. **Layer:** design evidence. **Result:** no Contact tablet/mobile artboards exist; the inherited foundation stack/reflow contract was exercised at 768×1024 and 390×844 in both themes. **Depends:** 1.1. **Checkpoint:** browser evidence confirms no overflow or clipping. *(AC-02, AC-07)*
- [x] **1.3 Beta-shell comparison.** **Files:** `design.md`, `validation.md`. **Layer:** shared layout. **Result:** scanned Contact Header/Footer and confirmed the implementation inherits `(beta)` layout with Beta variants in both themes. **Depends:** 1.1. **Checkpoint:** no local shell design is needed. *(AC-01, AC-02)*
- [x] **1.4 Form-control decision.** **Files:** `spec.md`, `design.md`, `workflow-state.md`. **Layer:** product/form contract. **Result:** product owner approved visible labels, requiredness, placeholders, Email semantics, native Assunto select, and local validation messages on 2026-08-16. **Depends:** 1.1. **Checkpoint:** implementation and browser evidence match the recorded contract. *(AC-04)*
- [x] **1.5 Subject decision.** **Files:** `spec.md`, `workflow-state.md`. **Layer:** fixture contract. **Result:** product owner supplied and approved the exact ordered default/options on 2026-08-16. **Depends:** 1.4. **Checkpoint:** deterministic fixture test passes. *(AC-04, AC-05)*
- [x] **1.6 Contact-state decision.** **Files:** `spec.md`, `design.md`, `workflow-state.md`, `validation.md`. **Layer:** local form behavior. **Result:** product owner approved deterministic mock success, reset/default, loading/disabled CTA, focus, and accessible error/success behavior on 2026-08-16. **Depends:** 1.4. **Checkpoint:** browser mock-submit check passes without a network request. *(AC-04)*
- [x] **1.7 Destination decision.** **Files:** `spec.md`, `workflow-state.md`, `validation.md`. **Layer:** fixture/link contract. **Result:** product owner approved deterministic non-production external URLs, mail actions, and `target="_blank" rel="noreferrer"` on 2026-08-16. **Depends:** 1.1. **Checkpoint:** browser attribute check passes. *(AC-05)*
- [x] **1.8 Community/business visual decision.** **Files:** `design.md`, `workflow-state.md`. **Layer:** design/fixture contract. **Result:** Pencil-confirmed card icons/copy/online indicator/geometry and business-card anatomy are recorded. **Depends:** 1.1. **Checkpoint:** destination URLs remain separately blocked by 1.7. *(AC-03, AC-05)*
- [x] **1.9 Newsletter ownership decision.** **Files:** `spec.md`, `design.md`, `workflow-state.md`. **Layer:** shared-form composition. **Result:** the Contact composition reuses the existing UI-only prevent-default/no-network newsletter responsibility; copy/layout adapts without a second state owner. **Depends:** 1.1. **Checkpoint:** no duplicate logic/network behavior. *(AC-06)*
- [x] **1.10 Approval gate.** **Files:** `workflow-state.md`. **Layer:** lifecycle. **Result:** product/Pencil evidence outcomes are recorded; implementation was authorized on 2026-08-16. **Depends:** 1.1–1.9. **Checkpoint:** no Phase 2 work began before the resolved mock-only contract. *(all)*

## Phase 2 — Approved implementation only

- [x] **2.1 Route and metadata boundary.** **Files:** `apps/web/src/app/(beta)/contact/page.tsx`. **Layer:** app route. **Result:** thin route/metadata composition; no fixtures, validation, or `fetch`; inherits `(beta)`. **Depends:** 1.10. **Checkpoint:** route smoke/source review passes. `app/api`, `services`, and `server` are N/A—no integration is authorized. *(AC-01, AC-08)*
- [x] **2.2 Canonical Footer destination.** **Files:** `apps/web/src/components/layout/footer.tsx`, focused footer test. **Layer:** shared nav. **Result:** activate only `Contato → /contact`; retain the existing community destinations. **Depends:** 2.1. **Checkpoint:** shared-nav tests pass. *(AC-01)*
- [x] **2.3 Feature data/types.** **Files:** `features/contact/types/*`, `mock/*`. **Layer:** deterministic data. **Result:** typed local subject/social/business contracts contain only approved values. **Depends:** 1.5, 1.7–1.8. **Checkpoint:** fixture test preserves order and mock destinations. *(AC-05)*
- [x] **2.4 Form schema/hook.** **Files:** `features/contact/schemas/contact-form.ts`, `hooks/use-contact-form.ts`. **Layer:** validation/orchestration. **Result:** Zod + React Hook Form with an approved local no-network submit; components render only. **Depends:** 1.4–1.6. **Checkpoint:** browser invalid/valid/reset checks pass. *(AC-04)*
- [x] **2.5 Contact components.** **Files:** `features/contact/components/contact-page.tsx`. **Layer:** rendering. **Result:** inspected semantic order, labels, native Assunto control, cards, and token-backed state/focus styles. **Depends:** 2.3–2.4. **Checkpoint:** DOM/heading/landmark test passes. *(AC-03–AC-05, AC-08)*
- [x] **2.6 Newsletter composition.** **Files:** shared `features/episodes/components/newsletter-form.tsx`. **Layer:** composition. **Result:** Contact visual variant composes the one existing no-network newsletter owner. **Depends:** 1.9, 2.5. **Checkpoint:** source test proves no duplicate hook/submit owner or `fetch`. *(AC-06)*
- [x] **2.7 Responsive/theme completion.** **Files:** Contact components and focused UI/source tests. **Layer:** presentation. **Result:** approved stack/reflow and token behavior at all required viewports/themes with no horizontal overflow. **Depends:** 1.1–1.3, 1.8, 2.5–2.6. **Checkpoint:** route smoke, visual review, and typecheck pass. *(AC-07, AC-08)*

## Phase 3 — Automated verification

- [x] **3.1 Structure/architecture tests.** **Files:** `apps/web/tests/contact-source.test.mjs`. **Layer:** test. **Result:** asserts Beta route/layout, Footer mapping, route thinness, no route/component `fetch`, and resolved Pencil contact-card anatomy; browser DOM confirms ordered landmarks/headings. **Depends:** 2.1–2.7. **Checkpoint:** 86 focused/project tests pass. *(AC-01, AC-03, AC-08)*
- [x] **3.2 Form tests.** **Files:** focused source/browser checks. **Layer:** test. **Result:** verifies Zod/RHF, semantic Email and native Assunto, all validation associations, local submit/reset, and keyboard-capable controls. **Depends:** 2.4–2.5. **Checkpoint:** browser and focused tests pass. *(AC-04)*
- [x] **3.3 Fixture/newsletter/link tests.** **Files:** `apps/web/tests/contact-source.test.mjs`. **Layer:** test. **Result:** verifies deterministic order, accessible names, mock destinations/external convention, mail action, one newsletter owner, and no `fetch`. **Depends:** 2.3, 2.6. **Checkpoint:** focused tests pass. *(AC-05, AC-06)*
- [x] **3.4 Project commands.** **Files:** `workflow-state.md`, `validation.md`. **Layer:** validation. **Result:** `test` (86/86), `lint`, `typecheck`, `build`, and `git diff --check` pass. **Depends:** 3.1–3.3. **Checkpoint:** all pass. *(AC-08)*

## Phase 4 — Visual design review (`web-design-reviewer`)

- [x] **4.1 Component-by-component Pencil comparison.** **Files:** `validation.md`, `design.md`. **Layer:** visual review. **Result:** direct dark/light Pencil screenshots were compared with the rendered page before browser behavior testing. **Depends:** 1.1–1.3, 3.4. **Checkpoint:** visual evidence and scrollbar measurement are recorded. *(AC-02, AC-03, AC-07, AC-08)*
- [x] **4.2 Visual correction checkpoint.** **Files:** `apps/web/src/features/contact/components/contact-page.tsx`, `apps/web/src/components/ui/input.tsx`, `validation.md`. **Layer:** implementation/visual review. **Result:** corrected Pencil copy deltas and made all required-field messages consistently announce; affected checks reran. **Depends:** 4.1. **Checkpoint:** visual baseline is fit for browser behavior testing. *(AC-02, AC-08)*

## Phase 5 — Browser validation (`webapp-testing`) and correction

- [x] **5.1 Responsive/theme matrix.** **Files:** `validation.md`. **Layer:** browser. **Result:** `/contact` checked at 1440×1200, 768×1024, and 390×844 in both themes. **Depends:** 4.2. **Checkpoint:** six captures/results are recorded. *(AC-01, AC-03, AC-07)*
- [x] **5.2 Keyboard/form matrix.** **Files:** `validation.md`. **Layer:** browser accessibility. **Result:** native controls, invalid association, local reset/success, theme toggle, and compact-menu Escape close pass. **Depends:** 1.4–1.6, 4.2. **Checkpoint:** behavior evidence recorded. *(AC-04)*
- [x] **5.3 Link/newsletter matrix.** **Files:** `validation.md`. **Layer:** browser. **Result:** six safe mock external links, mail actions, accessible names, and no-network newsletter ownership pass. **Depends:** 1.7, 1.9, 4.2. **Checkpoint:** no guessed production destination. *(AC-05, AC-06)*
- [x] **5.4 Resilience/a11y matrix.** **Files:** `validation.md`. **Layer:** browser accessibility. **Result:** landmark/heading, contrast, 40px target, long-content, clipping, and overflow checks pass; the product owner completed the literal 200% zoom observation without reporting clipping or horizontal overflow. **Depends:** 4.2. **Checkpoint:** recorded 200% evidence completes the resilience matrix. *(AC-07, AC-08)*
- [x] **5.5 Correction loop.** **Files:** affected code/tests, `validation.md`. **Layer:** implementation/validation. **Result:** corrected required-message announcement consistency, then reran automated and browser evidence. **Depends:** 5.1–5.3. **Checkpoint:** no blocking implementation difference remains. *(AC-08)*

## Phase 6 — Documentation and final handoff

- [x] **6.1 Documentation impact.** **Files:** `.specs/README.md`, `validation.md`, `workflow-state.md`. **Layer:** documentation. **Result:** index and implementation/Pencil/browser evidence are current. **Depends:** 5.5. **Checkpoint:** impact is explicit. *(AC-08)*
- [x] **6.2 Final handoff.** **Files:** `workflow-state.md`, `validation.md`. **Layer:** final gate. **Result:** formal `$review` recorded final acceptance and Architect approval on 2026-08-16. **Depends:** 6.1. **Checkpoint:** final gate approved. *(AC-08)*
