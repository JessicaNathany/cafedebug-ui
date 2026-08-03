# Plan: Responsive Navigation Menu Differences

| ID | Component/state | Current implementation difference | Target evidence | Status |
| --- | --- | --- | --- | --- |
| G01 | Desktop navigation | Contains inert `Notícias`, `Eventos`, and `Vagas`. | Pencil `m9zV96`; exact four-item DOM assertion. | Completed |
| G02 | Compact closed header | Entire nav is hidden below `lg`; no replacement control exists. | Pencil `sYLaO`, `jHEKy`, `l3At9Z`; viewport checks. | Completed |
| G03 | Compact open menu | No open state, panel, focus order, or dismissal behavior exists. | Pencil `p4ky3`, `wahud`, `fWEbw`; keyboard/pointer checks. | Completed |
| G04 | Shared information architecture | Desktop and future compact variants do not share a canonical model. | Shared `navigation-items.ts` source and tests. | Completed |
| G05 | Theme variants | No compact beta light/dark or fixed-dark contract exists. | Pencil node comparisons and runtime screenshots. | Completed |
| G06 | Footer deferred destinations | Deferred labels are inert but have no visible status. | Pencil `LSgoB`; exact visible `— Em breve` copy. | Completed |
| G07 | Accessibility | No trigger state, accessible name, focus return, outside dismissal, or resize dismissal. | Runtime interaction checks and focused assertions. | Completed |
| G08 | Regression coverage | Existing tests explicitly require mobile navigation to remain hidden. | Updated focused tests plus full web validation. | Completed |

Implementation is complete only when every row is marked `Completed` with matching evidence in `validation.md`.
