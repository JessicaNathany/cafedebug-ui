# Spec: Descoberta da ação Play no Episode Card

| Campo | Valor |
| --- | --- |
| Status | Implemented — Spotify-like surface highlight validated |
| Domínio | web/episodes |
| Pacote | .specs/web/episode-card-play-discovery/ |
| Aplicação | apps/web |
| Rotas afetadas | /, /episodes e /episodes/[slug] (somente regiões que renderizam cards) |
| Fonte visual | cafedebug.pen, componente FGSFI (Episode Card), indexado por .specs/web/foundation/ux-design-reference.md |

## 1. Problema e motivação

O EpisodeCard exibe permanentemente o botão Play laranja sobre a capa. Em grades com muitos cards,
a ação recebe peso visual excessivo e reduz a leitura de artwork e metadata. Esta feature deve
tornar Play descobrível quando a pessoa demonstra intenção de interagir, preservando a identidade
aprovada no Pencil e sem redesenhar o card.

O resultado é uma interação compartilhada: com mouse/trackpad, Play aparece com destaque sutil em
hover/focus; em toque, Play continua acessível imediatamente. Navegação ao detalhe e playback
permanecem ações separadas.

## 2. Escopo

### Dentro do escopo

- Estados de descoberta do Play no EpisodeCard compartilhado.
- Hover, focus-visible, teclado, touch/coarse pointer e prefers-reduced-motion.
- Preservação da anatomia FGSFI, tokens, temas, dimensões, dados, rotas e player.
- Testes e validação de todos os consumidores, sem CSS ou lógica específica por página.
- Conferência de carregamento, vazio, erro e not-found: somente cards com Episode real têm
  interação; os demais estados preservam geometria e recuperação.

### Fora do escopo

- API, fixtures, schema, URLs, SEO, metadata, store/player, Track ou novo áudio.
- Tipografia, spacing, raio, badges, metadata, conteúdo, grids, Hero/Full/Mini Player ou cards
  de notícia.
- Variante de card por página, analytics remoto, experimento A/B ou alteração de cafedebug.pen.

## 3. Comportamento atual e inventário

| Item | Local atual | Achado |
| --- | --- | --- |
| Card canônico | apps/web/src/features/episodes/components/episode-card.tsx | Única implementação; contém artwork, category, Play, duração, metadata, título, resumo e convidado. |
| Play | features/episodes/components/play-button.tsx | Client component; chama usePlayer.getState().load(episodeToTrack(episode)). |
| Áudio | features/player/store.ts e player-provider.tsx | load seleciona faixa, inicia playback e zera posição; existe um único áudio persistente. |
| Homepage Beta | features/homepage/components/recent-episodes.tsx | Seis EpisodeCard em /. |
| HomepageV2 | features/homepage/components/homepage-v2.tsx | Consumidor preservado de cards recentes. |
| HomePage | features/episodes/components/home-page.tsx | Consumidor preservado que também usa EpisodeCard. |
| Catálogo | features/episodes/components/episodes-list-page.tsx | Cards em /episodes. |
| Relacionados | features/episodes/components/episode-related.tsx | Cards no detalhe /episodes/[slug]. |

Não foi encontrada implementação de card, CSS de card ou variante de Episode Card duplicada.
EpisodeHero, HeroPlayer, FullPlayer, banner CTA e MiniPlayer reutilizam PlayButton, mas não são
cards e ficam fora desta revelação.

### 3.1 Semântica de click a preservar

- O card declara links de detalhe na capa e título, ambos para /episodes/[slug], e um botão
  Reproduzir episódio separado.
- Play chama load para a faixa correta; não pode navegar, alternar/pausear ou criar outro áudio.
- O wrapper absoluto atual do Play ocupa a artwork acima do link. Fora do botão ele pode capturar
  pointer hit e tornar a capa uma superfície morta. A implementação deve provar que somente o
  botão recebe pointer events e que a capa continua navegável; isso restaura a semântica declarada,
  sem mudar URL ou contrato.
- Nunca aninhar botão em link, transformar o article inteiro em ação, nem usar stopPropagation
  para compensar markup inválido.

## 4. UX desejada

### Desktop e pointer preciso

No padrão, capa e anatomia medida de FGSFI aparecem normalmente e Play não fica visualmente
exposto. Em hover do card ou mídia, revelar o mesmo Play centrado e elevar discretamente a
superfície inteira do card com o tratamento tokenizado `secondary/50`, no espírito do exemplo
Spotify fornecido. A borda mantém o token Pencil `border`, sem realce laranja. Category e duração
permanecem legíveis. Na saída, reverter suavemente. Nenhum estado pode mudar tamanho, posição,
fluxo, truncamento ou grid.

Revisão P07: no tema claro, o lift usa `secondary/25` para ficar apenas perceptível; no tema
escuro, mantém `secondary/50`. Ambos derivam do mesmo token e conservam borda e geometria.

### Teclado e foco

- A ordem natural permanece: link de capa, Play e link de título.
- Focus-visible em qualquer ação revela Play e o mesmo destaque; o alvo focado conserva outline
  tokenizado. Não adicionar tabindex ao article nem uma parada extra.
- Enter/Espaço no Play reproduzem somente a faixa correspondente. Enter nos links abre o detalhe.

### Touch, mobile e tablet

Em hover:none e/ou pointer:coarse, Play fica visível em repouso. A pessoa não pode precisar de um
primeiro toque só para revelar controle. O alvo atual de 56px supera o mínimo de 40px. Toque no
Play reproduz; toque em capa/título navega. A capacidade de input, não o breakpoint, determina o
fallback.

### Movimento e reduced motion

- Somente transições curtas e não estruturais de opacidade e, se Pencil aprovar, transform de
  composição. Nunca width, height, margin, padding, grid/flex placement ou geometria de imagem.
- Em prefers-reduced-motion: reduce, o estado final aparece sem animação/transform perceptível.
- Visibilidade, foco e contraste devem comunicar estado mesmo sem movimento.

## 5. Arquitetura recomendada

apps/web/src/features/episodes/components/episode-card.tsx é o único owner: conhece composição de
artwork, links e PlayButton. PlayButton continua responsável apenas por carregar um Episode; o
player/store continua dono de áudio. Não criar CSS de consumidor, prop de variante por página ou
listener de hover em RecentEpisodes, EpisodesListPage ou EpisodeRelated.

O card pode continuar Server Component; PlayButton mantém a fronteira client. A revelação deve usar
CSS, tokens, focus e media features de capacidade de input, sem estado React, useEffect ou fetch.

    consumidores de página/seção
      └─ EpisodeCard (anatomia, hit testing e estados compartilhados)
           ├─ links de detalhe /episodes/[slug]
           └─ PlayButton (ilha client)
                └─ episodeToTrack → usePlayer.load → PlayerProvider / único áudio

Isso evita CSS page-specific, preserva app routing-only e mantém uma futura mudança de interação em
um único lugar.

## 6. Rotas, dados, estados e observabilidade

| Área | Contrato |
| --- | --- |
| Rotas | Nenhuma URL/destino novo. /, /episodes e /episodes/[slug] conservam os mesmos cards. |
| API | Nenhuma chamada, endpoint ou payload novo; Episode e episodeToTrack não mudam. |
| Loading | Skeleton mantém slot/dimensão, mas não expõe Play reproduzível sem Episode válido. |
| Vazio, erro, 404 | Não renderizam EpisodeCard; recovery e SEO existentes ficam inalterados. |
| Validação | Sem formulário, query param ou input novo; schema/tipos existentes seguem a fonte de dados. |
| Observabilidade | Sem analytics nesta entrega. Logs atuais de autoplay preservados; testes observam load e URL. Analytics futuro, se aprovado, nunca dispara por hover/focus. |

## 7. Tema, acessibilidade, desempenho e edge cases

- Claro/escuro usam somente aliases existentes de web-design-tokens: card, `secondary/50`, border,
  ring, primary e sombras existentes. Sem hex, opacidade customizada, raio ou shadow novo.
- Preservar Play laranja, ícone 56×56, labels pt-BR, alts, links distintos e ícones decorativos.
- Preservar referência 384×412, artwork 200px, radius-m, borda, body 20px e clamp; sem overflow
  em 1440/768/390.
- Títulos/resumos longos, todas as categorias/durações, imagem ausente, pointer híbrido, troca
  rápida de hover/focus/tema e faixa já tocando não deixam Play preso, não deslocam layout e não
  mudam load (card não ganha estado de pause).
- Evitar JavaScript/listeners globais/downloads adicionais em grids extensas.

## 8. Estratégia de testes e validação

1. Proteger anatomia FGSFI, ausência de raw colors e fonte compartilhada em teste de source, sem
   reduzir a validação a classes Tailwind.
2. Browser/componente: desktop repouso oculto, hover revelado, foco por teclado revelado e saída
   sem alteração em getBoundingClientRect.
3. Emular hover:none/coarse para Play visível e acionável; validar 1440×1200, 768×1024 e 390×844
   em claro/escuro, sem overflow.
4. Espionar store: Play chama load(episodeToTrack(episode)) e não muda URL; capa/título navegam ao
   slug e não chamam load. Confirmar hit testing fora do botão.
5. Exercitar Homepage Beta, HomepageV2/HomePage preservadas, catálogo e relacionados.
6. Emular reduced motion; rodar lint, typecheck, testes focados/completos, build e git diff --check.
   Comparar screenshot runtime e FGSFI por Pencil MCP.

## 9. Critérios de aceitação

| ID | Critério mensurável |
| --- | --- |
| AC-01 | Em desktop/pointer com hover, Play não fica visualmente exposto no estado padrão. |
| AC-02 | Hover do card/mídia revela Play centrado e aplica somente o surface lift `secondary/50`, sem borda laranja ou badges obscurecidos. |
| AC-03 | Focus-visible produz estado equivalente, Play visível e outline tokenizado. |
| AC-04 | Touch/coarse/no-hover tem Play disponível em repouso com alvo de pelo menos 40px. |
| AC-05 | Hover/focus/saída não alteram bounding box, fluxo, padding, gap ou posição de card vizinho. |
| AC-06 | FGSFI mantém 384×412 de referência, artwork 200px, raio, borda, metadata, badges, body e conteúdo. |
| AC-07 | Claro/escuro mantêm hierarquia e estados por tokens existentes; sem valor visual raw novo. |
| AC-08 | Homepage Beta, HomepageV2, HomePage preservada, /episodes e relacionados refletem o mesmo comportamento. |
| AC-09 | Reveal vive no EpisodeCard/subcomposição exclusiva, sem CSS, prop de variante ou handler em consumidores. |
| AC-10 | Play continua load sem navegar; capa/título continuam no mesmo slug sem load; Play não bloqueia pointer fora do botão. |
| AC-11 | Reduced motion remove/minimiza animação e não há animação estrutural em nenhum modo. |
| AC-12 | Testes cobrem compartilhamento, teclado, touch, reduced motion, layout shift e regressão play/link, além de lint/typecheck/test/build/Pencil. |

## 10. Questões abertas e gate de saída

| Questão | Dono | Bloqueia código? | Encaminhamento |
| --- | --- | --- | --- |
| FGSFI atual não possui estado hover/focus/input desenhado. | Architect Guardian | Não | Revisado pelo feedback do usuário: usar somente `secondary/50` na superfície em hover/focus e reveal por opacity; P06 deve rejeitar a execução se o lift não permanecer discreto. |
| O wrapper atual efetivamente bloqueia a capa fora do Play em runtime? | The Debugger | Sim | Validar no browser; corrigir somente hit testing que contradiz os links já declarados. |

Status de saída: a revisão P06 foi validada em runtime nos temas claro e escuro e passou todos os
portões de regressão; a feature permanece `Implemented`.
