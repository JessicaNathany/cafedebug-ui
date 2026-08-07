# Validation: Descoberta da ação Play no Episode Card

| Campo | Valor |
| --- | --- |
| Status | Passed — P06 Spotify-like surface highlight revalidated |
| Spec | `.specs/web/episode-card-play-discovery/spec.md` |
| Design | `.specs/web/episode-card-play-discovery/design.md` |
| Tasks | `.specs/web/episode-card-play-discovery/tasks.md` |
| Implementação | `apps/web/src/features/episodes/components/episode-card.tsx` |
| Data | 2026-08-06 |

## 1. Alteração entregue

> P06 amendment: at the user's request, the former primary inset ring was replaced by a
> Spotify-like `secondary/50` surface lift. The historic P05 evidence remains valid for geometry,
> playback and input semantics; the new hover/focus treatment is recorded below.

> P07 refinement: the light-theme lift was reduced from `secondary/50` to `secondary/25` after
> visual feedback. Dark mode retains `secondary/50`. Live review confirmed a subtly distinct light
> card, a neutral border, `Play` opacity `1` on hover, and the same `297.67×412` card geometry.

`EpisodeCard` continua sendo o único owner da interação compartilhada. Em ambiente com
`(hover: hover)` e `(pointer: fine)`, o Play fica com opacidade zero em repouso e é revelado por
hover ou `focus-within`; o card recebe somente o lift de superfície `secondary/50` e conserva o
ring inset de 1px `border`. Fora dessa capacidade de input, o Play permanece visível em repouso.
A redução de movimento desabilita as transições de opacidade e cor.

O wrapper centralizador, a category e a duração são `pointer-events: none`; o `PlayButton` é o
único elemento sobre a artwork que volta a receber pointer events. Assim, o clique fora do botão
continua no link de detalhe e o botão continua carregando o player sem navegação.

Não houve mudança em `PlayButton`, store/player, rotas, dados, tokens ou consumidores. Os testes
de fonte cobrem Homepage Beta, HomepageV2, HomePage preservada, catálogo e relacionados como
consumidores do mesmo `EpisodeCard` sem variantes específicas por página.

## 2. Evidência de navegador

| Checagem | Resultado |
| --- | --- |
| P06, light, repouso | Card `rgb(255,255,255)`; Play opacity `0`; border permanece o token Pencil neutro |
| P06, light, hover | Card passa a `secondary/50`; Play opacity `1`; nenhuma borda laranja é adicionada |
| P06, dark, repouso | Card `rgb(26,26,26)`; Play opacity `0`; border permanece o token Pencil neutro |
| P06, dark, hover | Card passa a `secondary/50`; Play opacity `1`; border e Play `56×56` permanecem inalterados |
| P05, desktop 1440×1200 | Card `421.33×412`, artwork `421.33×200`, Play `56×56`, sem overflow; P06 altera somente background-color |
| P05, teclado | Focus dentro do card revela Play e preserva outline tokenizado; P06 aplica o mesmo lift de superfície |
| Semântica de Play | Click/Space em `Reproduzir episódio 141` mantém URL `/` e monta o mini player para a faixa correta |
| Semântica de artwork | Ponto da artwork fora do Play resolve para o link `/episodes/negociacao-salarial-senior`; não é capturado por overlays decorativos |
| Tablet 768×1024 | Card `324.5×412`, artwork h=200, Play 56×56 e sem overflow horizontal |
| Mobile 390×844 | Card `343×412`, artwork h=200, Play 56×56 e sem overflow horizontal |
| Light theme | Card, surface lift, border e Play continuam tokenizados; em repouso de fine pointer Play opacity `0`; sem overflow |

O navegador integrado era fine-pointer/hover em todos os viewports. Por isso, o fallback
no-hover/coarse e `prefers-reduced-motion` foram confirmados pelo CSS compilado e pelos testes de
fonte, não por emulação de dispositivo: somente o media query fine-pointer aplica `opacity-0`, e
`motion-reduce:transition-none` remove as transições. P06 adiciona somente `transition-colors` e
`bg-secondary/50`, portanto não altera os resultados de geometria responsiva do P05.

## 3. Revisão Pencil / web-design-reviewer

Pencil MCP inspecionou o componente `FGSFI`:

- Card base 384×412, clipado, radius 16 e stroke inset 1px;
- artwork h=200;
- Play central 56×56 com ícone 22px;
- body padding 20px; category e duration preservados.

O design reviewer comparou o runtime em 1440×1200, 768×1024 e 390×844, nos temas light e dark.
P06 também foi inspecionado ao vivo nos dois temas: **approved**. Não houve transform, scale,
filter, sombra adicional, mudança de geometria, clipping indevido ou overflow. A mudança visual
ficou limitada à opacidade do Play e ao lift `secondary/50`, sem borda laranja.

## 4. Portões de regressão

| Comando | Resultado |
| --- | --- |
| `pnpm --filter @cafedebug/web run test` | Passou: 73/73 |
| `pnpm --filter @cafedebug/web run lint` | Passou |
| `pnpm --filter @cafedebug/web run typecheck` | Passou |
| `git diff --check` | Passou |
| `pnpm --filter @cafedebug/web run build` | Passou |

Durante a validação final, uma mudança concorrente fora do escopo em
`features/player/full-player.tsx` passou temporariamente `setPosition` não definido para
`PlayerProgress`. A sua correção pelo owner foi confirmada sem absorver mudança de player nesta
feature; a execução final completa acima passou.

## 5. Rastreabilidade de aceite

| Critério | Evidência | Estado |
| --- | --- | --- |
| AC-01, AC-02 | runtime P06 light/dark rest/hover + revisão visual | Pass |
| AC-03 | runtime focus-within e outlines existentes | Pass |
| AC-04 | source/compiled capability query; emulação indisponível | Pass with static evidence |
| AC-05, AC-06 | medidas de navegador + Pencil `FGSFI` | Pass |
| AC-07 | light/dark runtime, tokens e revisão visual | Pass |
| AC-08, AC-09 | inventário/teste de consumidores e diff compartilhado | Pass |
| AC-10 | browser hit testing, URL e player | Pass |
| AC-11 | source/compiled reduced-motion rule; emulação indisponível | Pass with static evidence |
| AC-12 | testes, lint, typecheck, design review e build gate | Pass |

## 6. Condição de promoção

A Architect Guardian confirma a promoção para `Implemented`: a execução final verde e a revisão
dos caminhos desta feature (`EpisodeCard`, seu teste e sua documentação) comprovam que a borda
laranja foi removida em favor do lift `secondary/50`, sem incluir mudança de player nesta entrega.
