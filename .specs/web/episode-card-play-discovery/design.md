# Design: Descoberta da ação Play no Episode Card

| Campo | Valor |
| --- | --- |
| Status | Implemented — Spotify-like surface highlight validated |
| Feature folder | apps/web/src/features/episodes/ |
| Rotas | /, /episodes e /episodes/[slug], como consumidores; sem mudança de URL |
| Fonte de dados | Episode existente; nenhuma API nova |
| Fonte visual autoritativa | cafedebug.pen via Pencil MCP |
| Índice de nós | .specs/web/foundation/ux-design-reference.md |

## 1. Contrato de evidência Pencil

| Campo | Valor |
| --- | --- |
| Pencil file | /cafedebug.pen |
| Dark node | FGSFI |
| Light-content node | Não identificado como variante separada; tema resolve pelos tokens |
| Component nodes | FGSFI Episode Card; icon button existente somente como vocabulário, se necessário |
| Consumidores | Homepage Beta, HomepageV2, HomePage preservada, lista /episodes e relacionados /episodes/[slug] |
| Evidência coletada | get_app_state, batch_get via Get(FGSFI) e get_screenshot em 2026-08-06 |

O node FGSFI medido é 384×412, clipado, raio 16, artwork de 200px, Play 56×56 centrado,
category em 16px, duração em 16px/18px do limite apropriado, body padding 20px e gap 10px. A
captura confirma Play visível no default. O canvas não fornece state/variant hover, focus, touch
ou reduced-motion. Este documento não inventa cor, opacidade, escala, shadow ou duração para o
novo destaque.

Decisões de revisão P06/P07: o destaque é somente a superfície tokenizada do card, aplicada em
hover e focus-within sem trocar largura, borda, raio ou introduzir shadow. No claro é
`bg-secondary/25`; no escuro, `dark:bg-secondary/50`. Isso segue o lift discreto do exemplo
Spotify fornecido pelo usuário. O Play revela apenas por opacity e a revisão deve rejeitar o
resultado se o tratamento não permanecer discreto em ambos os temas.

## 2. Arquitetura e fluxo

    RecentEpisodes / HomepageV2 / HomePage / EpisodesListPage / EpisodeRelated
      └─ EpisodeCard({episode})                    Server component
           ├─ links de mídia/título → /episodes/[slug]
           ├─ estado de reveal por CSS/media/focus compartilhado
           └─ PlayButton({episode, iconOnly})      client boundary existente
                └─ episodeToTrack → usePlayer.load → PlayerProvider / um áudio

| Componente | Local | Responsabilidade |
| --- | --- | --- |
| EpisodeCard | features/episodes/components/episode-card.tsx | Único owner da composição, hit testing, reveal, foco e fallback por capacidade de input. |
| PlayButton | features/episodes/components/play-button.tsx | Mantém nome acessível e o único efeito de load; não conhece hover, rota ou consumidor. |
| usePlayer / PlayerProvider | features/player/ | Sem alteração: única fonte de reprodução e áudio. |
| Consumidores | homepage/episodes | Sem interação própria; apenas mapeiam Episode para EpisodeCard. |

Não acrescentar estado React, hook, prop variant, evento global, API route ou fetch. Se uma
subcomposição de media for necessária, ela fica privada ao EpisodeCard e não vira outro card/API.

## 3. Contrato visual e de input

### 3.1 Estados

| Capacidade/estado | Play | Destaque | Semântica |
| --- | --- | --- | --- |
| Fine pointer, repouso | Visualmente oculto, mas ainda focável | Nenhum | Link e botão preservam ações distintas |
| Fine pointer, hover | Visível centrado | Superfície do card em `secondary/50`; borda Pencil inalterada | Play reproduz; links navegam |
| Keyboard, focus-visible | Visível | Mesmo surface lift, outline adicional no alvo focado | Sem nova parada de tabulação |
| No hover e/ou coarse | Visível em repouso | Hover não obrigatório | Play acessível no primeiro toque |
| Reduced motion | Estado final imediato | Sem transform/animação perceptível | Mesma semântica |

O estado é derivado por seletores de grupo/focus e media feature de capacidade de input, nunca
por largura de viewport. Visibilidade não equivale a remover DOM: Play precisa receber foco no
desktop, mas foco nunca pode cair em alvo invisível. Preferir opacidade/camada coerente com focus,
não display:none/visibility:hidden.

### 3.2 Hit testing e camadas

1. Link de artwork continua cobrir a mídia e apontar ao slug atual.
2. Category e duração permanecem decorativas/não interativas acima do link.
3. Somente o botão Play recebe pointer event acima do link. Wrapper de centralização é
   pointer-transparent fora do botão ou não cobre a capa.
4. Botão não é descendente de link; clicar/tocar Play não navega e chama apenas load.
5. Título continua link independente. O article não ganha onClick.

### 3.3 Layout, tokens e motion

| Item | Contrato |
| --- | --- |
| Geometria | Referência 384×412; artwork h=200, Play 56×56, radius-m, body 20; nenhum estado altera fluxo. |
| Tipografia/conteúdo | Fonts, pesos, labels, metadata, clamps e alts existentes. |
| Tema | Tokens existentes: card, `secondary/50`, border, ring, primary e shadows existentes. |
| Destaque | Somente `bg-secondary/50` na superfície em hover/focus; borda continua `border`, sem hex, gradient, glow, raio ou shadow novo. |
| Motion | Transições de cor da superfície e reveal por opacity. Reduced motion desabilita ambas; não há transform. |
| Overflow | Clip/overflow existente protege artwork; badge/duração/Play não vazam nem bloqueiam conteúdo. |

## 4. Responsividade, tema e acessibilidade

| Viewport | Contrato |
| --- | --- |
| Desktop 1440×1200 | Grades atuais; fine pointer inicia oculto e revela em hover/focus. |
| Tablet 768×1024 | Duas colunas onde a rota define; capacidade de input, não largura, decide fallback. |
| Mobile 390×844 | Uma coluna; Play visível em no-hover/coarse, alvo 56px, capa/título continuam navegáveis. |

- Article não recebe foco artificial. Links/botão mantêm labels pt-BR e focus-visible tokenizado.
- Não alterar alt de artwork nem heading/link hierarchy da lista e relacionados.
- Preservar contraste de category, duração e Play sobre a imagem em ambos os temas.
- Não usar hover como pré-condição para clicar; não depender de JavaScript para a11y de
  pointer/focus.

## 5. Rotas, dados e estados

| Estado | Comportamento |
| --- | --- |
| Card populado | Aplica a tabela de estados §3.1 ao mesmo Episode já recebido. |
| Loading | Skeleton preserva dimensão e não possui Play real nem load. |
| Empty | Sem card, Play ou interação nova. |
| Error / not-found | Boundaries existentes, sem card acionável e sem mudança de recovery. |
| Tema/rota | CSS recalcula visual sem persistir hover; player store conserva comportamento atual. |

Não há contrato HTTP, payload, schema, validação de input ou observabilidade novos. App continua
routing-only e componentes não fazem fetch. A única observação de execução existente é a falha de
autoplay do PlayerProvider.

## 6. Validação para a implementação futura

1. Confirmar que todo consumidor importa EpisodeCard; sem variante/CSS page-specific.
2. Browser: hover/saída, Tab/Shift+Tab, Enter/Espaço no Play e Enter nos links; observar URL e
   store/mini-player para ações separadas.
3. Medir getBoundingClientRect de card/artwork/badges antes, durante e depois; exigir igualdade e
   sem overflow em 1440/768/390.
4. Emular no-hover/coarse e reduced motion; confirmar primeiro toque e ausência de transição/
   transform reduzida.
5. Repetir em claro/escuro e cada classe de consumidor; comparar runtime com FGSFI e documentar a
   nova evidência de estado.
6. Rodar testes focados/completos, lint, typecheck, build e git diff --check.

## 7. Critérios de aceite do contrato de design

- FGSFI é inspecionado por Pencil MCP e seu default continua reconhecível, com geometria idêntica.
- Estado interativo tokenizado é aprovado por Design/Pencil antes de estilização final.
- Hover, focus, no-hover/coarse e reduced-motion obedecem §3.1 sem layout shift.
- Links e Play têm hit targets independentes, foco e labels verificáveis.
- Claro/escuro, 1440/768/390 e todos consumidores não têm overflow nem variação por página.
- App permanece routing-only; sem fetch em páginas/componentes nem valores visuais raw.

## 8. Perguntas abertas

| Pergunta | Owner | Bloqueia? | Resolução |
| --- | --- | --- | --- |
| FGSFI contém apenas default, sem estado hover/focus. | Architect Guardian + web-design-reviewer | Não para execução | Decisão revisada: surface lift `secondary/50`; P06 valida que ele é discreto e rejeita divergência. |
| A capa recebe clique fora do Play em runtime apesar do wrapper absoluto? | The Debugger | Sim | Testar hit target; corrigir somente interceptação que contradiz links já declarados. |
