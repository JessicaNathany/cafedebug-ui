# Design: Lista e Detalhe de Episódios

| Campo | Valor |
| --- | --- |
| **Status** | `Implemented` — P12: ações e comentários do detalhe validados contra Pencil |
| **Feature folder** | `apps/web/src/features/episodes/` |
| **Rotas** | `/episodes`, `/episodes/[slug]` |
| **Fonte de dados** | Fixtures locais tipadas por trás de serviço da feature |
| **Fonte visual autoritativa** | `/cafedebug.pen` via Pencil MCP |
| **Índice de nós** | `.specs/web/foundation/ux-design-reference.md` |

## 1. Arquitetura e fluxo de dados

### 1.1 Limites de camada

```text
app/(beta)/episodes/page.tsx
  └─ delega searchParams à entrada server da feature
       └─ features/episodes/server/get-episode-list-page.ts
            └─ features/episodes/services/episode-catalog.service.ts
                 └─ features/episodes/mock/episodes.mock.ts (somente nesta entrega)

app/(beta)/episodes/[slug]/page.tsx
  └─ delega params à entrada server da feature
       └─ features/episodes/server/get-episode-detail-page.ts
            └─ features/episodes/services/episode-catalog.service.ts
                 └─ fixtures locais
```

O route group é parte do contrato de chrome: `/episodes` e `/episodes/[slug]` herdam
`app/(beta)/layout.tsx`, que obtém a preferência de tema no servidor e entrega
`Header variant="beta"` e `Footer variant="beta"`. Nenhuma página ou componente da feature
renderiza layout chrome.

- Arquivos em `app/` são adaptadores de rota: composição, metadata/boundary e passagem de
  parâmetros. Eles não importam fixtures, schemas, `fetch`, nem contêm regras de domínio.
- `server/` interpreta a consulta já normalizada, obtém o resultado tipado, decide vazio versus
  not-found e fornece o modelo da página. O nome final de arquivo pode seguir a convenção atual,
  mas as responsabilidades não podem se misturar.
- `services/episode-catalog.service.ts` é a fronteira única de leitura. Na fase mock ela delega
  ao repositório/fixture local; a troca futura para `@cafedebug/api-client` ocorre somente atrás
  dela. Não criar endpoint proxy ou chamada HTTP nesta entrega.
- `components/` recebem props já resolvidas. `hooks/` só podem sincronizar controles
  client-side com a URL e devem preservar a submissão GET sem JavaScript; não leem a API.
- `schemas` validam fixture, query e resultado de listagem. `types` modelam `Episode`, chave de
  categoria, `EpisodeListQuery` e `EpisodeListResult`.

### 1.2 Contratos de domínio mock

```text
EpisodeListQuery
  q?: string
  category?: EpisodeCategoryKey
  page: positive integer

EpisodeListResult
  items: Episode[]
  totalItems: number
  totalPages: number
  page: number
  pageSize: 6
  activeQuery: normalized q/category
```

`listEpisodes` mantém a compatibilidade com consumidores existentes, mas a lista de rota deve
usar uma consulta tipada própria, para que filtro e paginação não acabem dentro de um componente.
`getEpisode(slug)` retorna `Episode | null`; somente a entrada server decide o 404 da rota.

O schema de query deve distinguir:

- consulta válida sem item → resultado vazio;
- categoria não permitida ou página sintaticamente inválida → not-found;
- página além de `totalPages` quando `totalItems > 0` → not-found;
- dados mock que falham no schema → erro capturado por boundary.

## 2. Contrato de URL, metadata e SEO

### 2.1 Construção de URLs

Uma função pura da feature constrói toda URL de catálogo, recebe a consulta normalizada e aplica
a ordem `q`, `categoria`, `ordenar`, `pagina`. Ela omite valores default e é usada por formulário, chips,
paginações, canonical, breadcrumbs quando aplicável e testes. Não espalhar `URLSearchParams` em
componentes.

| Situação | URL resultante | Canonical / robots |
| --- | --- | --- |
| catálogo inicial | `/episodes` | self, indexável |
| página browse posterior | `/episodes?pagina=2` | self, indexável |
| busca | `/episodes?q=arquitetura` | `/episodes`, `noindex, follow` |
| categoria | `/episodes?categoria=backend` | `/episodes`, `noindex, follow` |
| ordenação alternativa | `/episodes?ordenar=antigos` | `/episodes`, `noindex, follow` |
| busca + categoria + ordenação + página | `/episodes?q=api&categoria=backend&ordenar=antigos&pagina=2` | `/episodes`, `noindex, follow` |
| detalhe | `/episodes/[slug]` | self, indexável se o slug existir |

`q=` vazio, valores duplicados, `ordenar=recentes`, `pagina=1` e valores conhecidos que só diferem na normalização
redirecionam à forma canônica de navegação. Tracking não entra no canonical nem nos links
gerados. A rota não serializa o rótulo humano de categoria, apenas sua chave estável.

### 2.2 Metadata e dados estruturados

| Superfície | Metadata | JSON-LD | Sitemap |
| --- | --- | --- | --- |
| `/episodes` canônica | título/descrição de catálogo, OG/Twitter da marca, canonical absoluto | `CollectionPage` + `ItemList` de links de detalhe visíveis | uma entrada |
| `/episodes?pagina=N` | título com página quando N > 1, canonical próprio | `CollectionPage` opcional sem duplicar org/series | não listar |
| busca/filtro/ordenação alternativa | título pode descrever consulta para leitor, canonical `/episodes`, `noindex, follow` | não obrigatório; não tratar como landing editorial | não listar |
| `/episodes/[slug]` | título, resumo, canonical, OG/Twitter com artwork | `PodcastEpisode` + `BreadcrumbList`; `Organization`/`PodcastSeries` permanecem no root | uma entrada por slug mock válido |
| erros/404 | metadata segura da rota | nenhum item de conteúdo | nunca listar |

`metadataBase` e `NEXT_PUBLIC_SITE_URL` existentes continuam sendo a fonte da origem. Metadados e
builders residem em `lib/seo` ou na feature conforme a convenção já adotada, mas obtêm dados por
meio de serviços da feature. Não produzir markup para episode inexistente nem URL de áudio que
não conste de fixture curada.

## 3. Contrato visual Pencil

### 3.1 Fonte e gate de evidência

| Superfície | Nó escuro | Nó claro | Nós/componentes reutilizados | Estado da evidência |
| --- | --- | --- | --- | --- |
| Lista de episódios | `iDkzC` | `S0iYm0` | `FGSFI` Episode Card, Header Beta `M9Wiwt`, Footer Beta `Q77OEY`, filtros `KbyBJ`/`BdBJJ` | inspecionado em 2026-08-04; tablet/mobile são inferidos e validados no runtime |
| Detalhe de episódio | `VkDts` | `Oh9Bv` | `E53fPU` player, `FGSFI`, Header `m9zV96`, Footer `LSgoB` | indexado no UX reference; implementação deve inspecionar ao vivo |

Antes de qualquer código visual, o responsável deve usar Pencil MCP para `get_editor_state`,
`get_screenshot` e `batch_get` nos nós acima. Esta especificação não afirma que frames novos ou
responsivos existem. A falta de uma artboard tablet/mobile é uma lacuna de evidência: o
comportamento inferido abaixo precisa ser registrado na validação e não pode ser chamado de
paridade pixel-perfect.

### 3.2 Viewports obrigatórios

| Nome | Tamanho | Obrigatório |
| --- | --- | --- |
| Desktop | `1440 × 1200` (captura full-page quando necessário) | Sim |
| Tablet | `768 × 1024` | Sim |
| Mobile | `390 × 844` | Sim |

### 3.3 Estrutura da lista

Ordem semântica e visual de `/episodes`:

1. Header herdado pelo layout `(beta)`, com Search e ThemeToggle, seguindo o tema persistido da
   Homepage Beta; não renderizar Assinar neste catálogo.
2. `<main>` com breadcrumb/contexto de podcast, eyebrow `PODCAST`, H1 `Episódios` e subtítulo
   indicado em `iDkzC`.
3. Toolbar: formulário de busca com o texto do Pencil `Buscar episódios, convidados ou temas…`,
   seletor dropdown `Ordenar: Mais recentes` e chips de filtro. O estado fechado usa o frame
   Pencil `FAVDG`: 231 × 50px no desktop, com padding horizontal de 18px, `gap` de 8px,
   superfície `card`, borda `border`, texto de valor em destaque e chevron. A largura é
   intrínseca ao conteúdo — nunca uma coluna/flex width fixa que deixe espaço à direita. No
   mobile, o seletor pode ocupar toda a largura útil sem overflow. O menu aberto usa a superfície
   `popover` tokenizada e não cria nova cor ou token.
4. Região de resultados anunciada de forma contida, grade de `EpisodeCard` e estado apropriado.
5. Navegação de paginação quando há mais de uma página.
6. Footer herdado pelo layout `(beta)`, seguindo o mesmo tema do documento.

A grade e todos os controles da lista ficam no container da Homepage Beta: `max-width: 1312px`,
`lg:w: calc(100vw - 8rem)` e gutter de 64px em desktop. Em 1440px isso produz três cards de
aproximadamente 421.33px com gap de 24px; a largura não aumenta em telas maiores. Os filtros
usam gap 10px. Cada label tem 32px de altura, Geist 14px/500 e padding 12px; `KbyBJ` adiciona
`background` e `shadow-pencil-subtle`, enquanto `BdBJJ` permanece transparente e em
`muted-foreground`. O alvo interativo é um link de 40px de altura com foco tokenizado e uma
única ação focável.

No desktop, a grade representa duas linhas de três cards e reutiliza a anatomia `FGSFI`:
artwork, chip, play sobreposto, duração, metadados, título, resumo e convidado. O card não deve
ganhar uma segunda navegação sobre a ação de play; usar link textual/título/artwork com nomes
acessíveis que distingam `Abrir episódio…` de `Reproduzir episódio…`.

### 3.4 Estrutura do detalhe

O detalhe mantém a ordem do contrato `VkDts`/`Oh9Bv` já definida pela fundação:

1. Header herdado, escuro.
2. `<main>` com breadcrumb, hero de episódio, painel de player, lower de duas colunas, comentários
   e relacionados.
3. Em desktop, `VkDts`/`Oh9Bv` usam gutter de 40px, container de 1360px, breadcrumb em y=108,
   hero 1360 × 380 em y=173, player `E53fPU` 1360 × 179 em y=601 e gap vertical de 48px.
4. Hero tem artwork 380px, gap de 44px e coluna de informações: `Label/Violet` 75 × 32,
   eyebrow Mono 13px/600, título Mono 38px/700/1.2, metadados com ícones 16px, avatar 48px e
   ações Play 215 × 48, Compartilhar 146 × 48 e Salvar 102 × 48. `Label/Violet` mapeia aos tokens
   existentes `info`/`info-foreground`; não cria uma cor nova.
5. O lower começa 48px após o player e é `952px + 48px + 360px`: show notes sem cartão, títulos
   Mono 24px/700, corpo Geist 16px/1.7; oito capítulos de 48px (ativo em `secondary`), guest
   card 360 × 291 e resources card 360 × 359 usando `card`, `border` e `radius-m`.
6. Comentários ocupam coluna de 860px: título Mono 24px/700, composer com avatar 40px e campo
   80px, seguido de três itens mockados. O estado local de envio deve acrescentar o comentário
   visível, sem API ou persistência.
7. Relacionados usam cabeçalho com link `Ver todos` à direita, gap de 24px e três `EpisodeCard`
   de 412px; o link não fica fora da seção.
8. Footer Beta herdado, seguindo o tema persistido.

### 3.4.1 Auditoria visual P10 — registrada antes da implementação

| Região | Pencil observado | Runtime atual | Correção mandatória |
| --- | --- | --- | --- |
| Hero | `A9veS`/`T9rs9`: label, título Mono 38px, meta com ícones, avatar e três ações | artwork 380px e ritmo base corretos, mas label, ícones, avatar, tipografia e ações estão ausentes ou divergentes | completar somente componentes do detalhe, preservando artwork e shell |
| Player | `E53fPU`/`otKVn`: `TOCANDO AGORA`, gauge, knob, 15s em ambos os sentidos e sete controles | card e um único áudio existem, mas copy/anatomia/progresso/controles não correspondem | reconstruir as três linhas sobre o mesmo store/audio |
| Lower | `fct3A`/`xtN8C`: 952px de leitura + sidebar 360px | show notes é um card de largura total; não há chapters, guest ou resources | adicionar lower responsivo com fixtures tipadas e sem fetch |
| Comentários | `ZMkyF`/`unSzO`: composer e três itens em coluna 860px | região ausente | criar fluxo client local acessível, sem persistência remota |
| Relacionados | `TKM8R`/`n4H1k`: cabeçalho com `Ver todos` e cards 3-up | o link está fora da seção e heading não segue o nó | mover o link e aplicar geometria/tipografia do canvas |
| Loading | o layout final prevê todas as regiões | skeleton para em notes | completar skeleton equivalente sem alterar boundaries |

### 3.5 Responsividade e overflow

| Área | Desktop (1440) | Tablet (768) | Mobile (390) |
| --- | --- | --- | --- |
| Gutter | respeita o container e ritmo do Pencil | 40px horizontais, salvo inspeção Pencil divergente | 16px horizontais |
| Lista | toolbar horizontal quando couber; grade 3 colunas | busca em largura disponível; controles podem quebrar em linhas estáveis; grade 2 colunas | busca e controles em pilha; chips com rolagem horizontal acessível ou quebra sem clipping; grade 1 coluna |
| Paginação | links alinhados após a grade | preserva ordem, não sobrepõe cards | rótulos e alvos de toque legíveis; elipses não focáveis |
| Detalhe | hero e lower em duas colunas (380px + info; 952px + 360px) | hero e lower empilham; artwork limitado e centralizado | hero, lower, comentários e ações empilham; controles preservam 40px de alvo e textos longos quebram sem sobrepor |
| Header/footer da lista | herda exatamente a Homepage Beta | usa nav responsiva Beta | usa menu responsivo Beta |
| Header/footer do detalhe | herda exatamente a Homepage Beta | usa nav responsiva Beta | usa menu responsivo Beta |

Todos os media usam razão estável e `object-fit` compatível com o card/hero aprovado. O documento
inteiro não pode ter rolagem horizontal, inclusive com termos de busca ou títulos longos.

### 3.5.1 Paginação

O componente Pencil `9PVw5` define uma linha centralizada com gap de 8px. `Previous` e `Next`
reutilizam o Ghost Button `Svd9t`: altura 40px, padding horizontal 16px, JetBrains Mono 14px/500
e nenhuma superfície permanente. Cada item de página mede 40px; o ativo `oT0d2` usa
`background`, borda interna `border` e `shadow-pencil-subtle`, e o padrão `Doslm` não tem fill,
borda ou sombra, com texto Geist 14px/500. A elipse `Irk3I` é texto/ícone decorativo de 40px e
não recebe foco.

Quando há mais de seis páginas, a primeira página apresenta `1 2 3 4 … última`, como no canvas;
o meio preserva primeira, página atual e vizinhos, com elipses, e o fim preserva as quatro últimas.
Os labels visíveis `Previous`/`Next` seguem a referência Pencil; os nomes acessíveis permanecem
em pt-BR. Os controles de limite continuam não clicáveis, expõem `aria-disabled`, e todos os
links clicáveis preservam 40px, foco tokenizado, `aria-current="page"` na atual e URLs geradas
pelo helper da feature.

### 3.6 Tema, tokens e estados visuais

- Lista e detalhe, incluindo Header/Footer Beta, seguem o tema do documento. `VkDts`/`Oh9Bv`
  definem flip completo do detalhe; não forçar hero ou player a escuro no modo claro.
- Usar apenas tokens semânticos de `@cafedebug/web-design-tokens`, primitives existentes e
  aliases Tailwind já mapeados. Nenhum hex, cor nomeada, raio, sombra, gradiente ou espaçamento
  arbitrário novo em componente da feature.
- Hover, foco, disabled, seleção de chip/página, loading, vazio, erro e not-found mantêm
  contraste e hierarquia nos dois temas. Skeleton usa superfícies tokenizadas e ocupa a mesma
  região estrutural do conteúdo final.

## 4. Componentes planejados

| Componente/entrada | Local | Responsabilidade |
| --- | --- | --- |
| `EpisodesListRoute` | `features/episodes/server/` | resolve query, dados, metadata state e delega a página visual |
| `EpisodeDetailRoute` | `features/episodes/server/` | resolve slug, not-found, detalhe e dados relacionados |
| `EpisodesListPage` | `features/episodes/components/` | composição sem lógica de busca de dados |
| `EpisodeSearchForm` | `features/episodes/components/` | formulário GET acessível, valor `q`, submit/limpar |
| `EpisodeSortSelector` | `features/episodes/components/` | dropdown progressivo que mostra a ordem ativa e gera links canonizados para `recentes`/`antigos` |
| `EpisodeCategoryFilters` | `features/episodes/components/` | links/chips canonizados com estado selecionado |
| `EpisodePagination` | `features/episodes/components/` | nav semântica e links construídos pelo helper |
| `EpisodesEmptyState` | `features/episodes/components/` | mensagem contextual + limpar filtros |
| `EpisodeRouteError` | rota/boundary | recuperação pt-BR sem exibir stack |
| `EpisodeCard` | existente, evoluído se necessário | link de detalhe e ação de play separados |
| `EpisodeChapters`, `EpisodeGuestCard`, `EpisodeResources`, `EpisodeComments` | `features/episodes/components/` | regiões locais tipadas do detalhe; capítulos comandam o store existente e comentários não persistem |
| Header/Footer | `components/layout/`, herdados | chrome compartilhado; não duplicar |

A entrada visual pode reutilizar `EpisodeHero`, `FullPlayer`, `ShowNotes` e `EpisodeRelated` da
fundação. O planejamento deve evitar mover componentes estáveis apenas por estética de pasta;
qualquer nova divisão precisa preservar imports, testes e contrato do player.

## 5. Acessibilidade

- Cada rota possui `header`, `main`, `footer` únicos pela herança de layout; a lista usa um
  `<form role="search" aria-label="Buscar episódios">` e região de resultados nomeada.
- Heading hierarchy é `h1` da página, seguido de `h2` de regiões (resultados, relacionados e
  notas no detalhe). Breadcrumb usa `<nav aria-label="Breadcrumb">` e marca o item atual.
- Chips são links ou botões com nome e estado selecionado exposto (`aria-current` ou
  `aria-pressed`, de acordo com o elemento final). A solução escolhida não pode duplicar dois
  controles focáveis para a mesma ação.
- O seletor de ordenação usa `details`/`summary` nativos e uma lista de links: Enter/Espaço
  abre ou fecha o menu, cada opção tem nome claro e a ativa expõe `aria-current="true"`. A
  seleção não depende de script e o menu não usa um popover sem semântica de foco.
- Página atual na paginação recebe `aria-current="page"`; links indisponíveis não são links
  clicáveis; `Anterior`/`Próxima` revelam por que estão desabilitados apenas quando necessário.
- Imagens de capa usam `Capa do episódio {number}: {title}`; avatar preserva nome do convidado;
  ícones isolados têm label em pt-BR. O play já possui label distinta do link de detalhe.
- Todo controle é alcançável pelo teclado, com foco visível tokenizado e alvo mínimo de 40px.
  A troca de resultados não rouba foco; uma mudança disparada por submit leva foco ao H1 ou à
  região de resultados de forma previsível, se JavaScript for usado para esse aprimoramento.
- Mensagens de loading/erro usam anúncio não intrusivo, não expõem detalhes internos e respeitam
  `prefers-reduced-motion`.

## 6. Contrato de estados e testes de UI

Fixtures determinísticas precisam conseguir produzir os seguintes cenários por injeção de teste:

| Cenário | Lista | Detalhe |
| --- | --- | --- |
| loading | intro/toolbars + seis slots + paginação | hero + player + notas + relacionados em skeleton |
| vazio | consulta válida zero; limpar filtros | não aplicável |
| erro | serviço/schema falha; boundary e reset | serviço/schema falha; boundary e reset |
| not-found | categoria/ordenação/página inválida | slug não encontrado |
| tema | todos os cenários relevantes em claro/escuro | todos os cenários relevantes em claro/escuro |

Não adicionar query strings escondidas de "modo de erro" em produção. Testes podem injetar o
serviço mock/failure seam diretamente.

## 7. Critérios de aceite do contrato de design

- Os nós Pencil listados em §3.1 foram inspecionados ao vivo e as capturas runtime foram
  comparadas em 1440/768/390 nos dois temas.
- Lista respeita introdução, toolbar, cards `FGSFI`, paginação, geometria e overflow aprovados;
  detalhe respeita `VkDts`/`Oh9Bv` e `E53fPU` sem regressão do player persistente.
- Header/Footer continuam instâncias herdadas e não duplicadas: Beta nas duas rotas.
- Estados de loading, vazio, erro e not-found preservam hierarquia, dimensão e acessibilidade.
- A rota e componentes obedecem aos limites de §1; busca estrutural confirma que não existe
  `fetch(` em `app`, componentes ou hooks da feature.
- Nenhum valor visual novo evade os tokens e todos os controles funcionam com teclado e leitor de
  tela nas verificações focadas.

## 8. Perguntas de design abertas

| Pergunta | Bloqueia planejamento? | Gate |
| --- | --- | --- |
| A inspeção atual de `iDkzC`/`S0iYm0` mantém anatomia/medidas descritas no UX reference? | Não | Confirmado em 2026-08-04; ver `validation.md`. |
| Há direção editorial para o conteúdo de estados vazios além de mensagem funcional em pt-BR? | Não | Master Planner propõe copy curta para aprovação no task de UI. |
| Deve existir controle de ordenação real nesta versão? | Não | Resolvido em 2026-08-04: o pedido de produto aprovou o dropdown com `Mais recentes` e `Mais antigos`; ver §2.1 e §3.3. |

## 9. Contrato P12 — controles de detalhe

| Região | Nó Pencil | Implementação da feature |
| --- | --- | --- |
| Ações do hero | `TMQxS` e `sq9SK` | `EpisodeHeroActions`: 48px, `bg-card`, `border-border`, ícone de 16px e texto 14px/500; preservar os handlers locais existentes. |
| Link de capítulos | `WS7ZJ` | `FullPlayer`: âncora para `#capitulos` com `List` e texto `Capítulos`, sem criar segundo player. |
| Sociais do convidado | `R50WG` | `EpisodeGuestCard`: pills `secondary` de 36px, ícones Lucide Twitter, Linkedin e Github de 16px para os destinos mock existentes. |
| Ações de comentário | `RSDAS` / `kLaSt` | `EpisodeComments`: Heart + contagem e Reply + `Responder` em cada item, 15px/13px e `muted-foreground`; like/reply ficam no estado local e o reply foca o compositor. |
