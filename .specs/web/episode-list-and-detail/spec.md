# Spec: Lista e Detalhe de Episódios

| Campo | Valor |
| --- | --- |
| **Status** | `Implemented` — P12: ações e comentários do detalhe validados contra Pencil |
| **Domínio** | `web/episodes` |
| **Pacote** | `.specs/web/episode-list-and-detail/` |
| **Aplicação afetada** | `apps/web` |
| **Rotas** | `/episodes` e `/episodes/[slug]` |
| **Dados nesta entrega** | Fixtures locais tipadas; sem acesso à API real |
| **Fonte visual** | `cafedebug.pen`, indexado em `.specs/web/foundation/ux-design-reference.md` |
| **Dependências** | `.specs/web/foundation/`, `.specs/web/responsive-navigation-menu/` |

## 1. Problema e objetivo

O website já possui um detalhe de episódio com fixtures, mas não possui uma rota pública de
descoberta para o catálogo. O menu e o rodapé ainda não podem encaminhar visitantes para uma
lista canônica de episódios. Isso reduz descoberta, navegação interna e a superfície de SEO do
podcast.

Esta feature cria o contrato para a lista pública `/episodes` e consolida o contrato de
`/episodes/[slug]`. O visitante deve conseguir descobrir episódios por texto e categoria,
navegar entre páginas de resultados, abrir um episódio e retornar ao catálogo sem perder um
URL compreensível. A entrega continua inteiramente mockada: a futura integração à API é um
seam arquitetural, não uma parte desta especificação.

### Valor

- **Para pessoas ouvintes:** um catálogo navegável, previsível e acessível para encontrar e
  consumir episódios.
- **Para o produto:** novas URLs públicas indexáveis, melhor ligação entre Home, catálogo e
  detalhes, e uma base que troca fixtures por contratos gerados sem redesenho de UI.

## 2. Escopo

### Dentro do escopo

- Rota de catálogo `/episodes` com busca, filtro por categoria, paginação, estados de rota e
  URLs canônicas.
- Rota `/episodes/[slug]` com estados de rota explícitos, links de retorno, SEO e dados
  estruturados compatíveis com a lista.
- Fixtures locais determinísticas, tipos, schemas, filtro/ordenação e serviços da feature.
- Metadados, Open Graph, Twitter cards, JSON-LD, `robots`, `sitemap` e links internos relativos
  às duas rotas.
- Contrato visual Pencil, comportamento desktop/tablet/mobile, paridade claro/escuro e critérios
  de acessibilidade.
- Paridade de todas as regiões específicas de `/episodes/[slug]` presentes em `VkDts`/`Oh9Bv`:
  hero completo, player, notas, capítulos, cartão do convidado, recursos, comentários e cabeçalho
  de relacionados. Estas regiões continuam alimentadas por fixtures locais tipadas.
- Ajustes de navegação compartilhada estritamente necessários para apontar `Episódios` a
  `/episodes`; lista e detalhe herdam o Header e Footer da Homepage Beta pela rota `(beta)`,
  sem duplicá-los na feature.

### Fora do escopo

- Qualquer chamada para a API .NET, `@cafedebug/api-client`, autenticação, cache remoto,
  revalidação remota ou dados de produção.
- Busca global do ícone no Header, autocomplete, sugestões, busca por voz e analytics de busca.
- Ordenações além de `Mais recentes` e `Mais antigos`, ordenação por relevância, duração,
  popularidade ou qualquer métrica remota.
- Feed RSS, OG dinâmico por imagem, newsletter, autenticação e persistência remota de salvar ou
  comentários. Os controles de detalhe usam somente comportamentos locais acessíveis enquanto a
  integração de dados real permanece adiada.
- Criação ou alteração de frames no `cafedebug.pen`, mudanças de tokens globais e duplicação de
  Header/Footer dentro da feature.

## 3. Decisões de produto e dados mockados

1. **Fonte única nesta fase.** Toda leitura vem de fixtures locais validadas por schema dentro
   de `features/episodes`; nenhuma rota, componente ou hook usa `fetch`.
2. **Seam para a API.** O servidor da feature depende de um serviço/repositório de catálogo.
   Nesta entrega ele delega a fixtures; a entrega futura poderá trocar somente a implementação do
   serviço pela API gerada, preservando tipos, resultados de consulta e componentes.
3. **Ordenação explícita.** O controle `Ordenar` é um seletor dropdown progressivo com as
   opções `Mais recentes` (default, por `publishedAt` decrescente) e `Mais antigos`
   (`publishedAt` crescente). A seleção gera uma URL canônica, preserva busca/categoria e sempre
   remove `pagina` para recomeçar na primeira página.
4. **Taxonomia de filtro.** Os chips visíveis seguem o Pencil: `Todos`, `Carreira`, `Backend`,
   `Frontend`, `IA & Dados`, `DevOps`, `Mobile` e `Comunidade`. Fixtures devem usar uma chave
   estável correspondente; categorias sem fixture ainda são filtros válidos e mostram o estado
   vazio, não um erro. O mapeamento editorial das categorias legadas de fixture é uma decisão a
   registrar na implementação, antes de substituir valores existentes.
5. **Tamanho de página.** Seis episódios por página: duas linhas de três no desktop, antes da
   adaptação responsiva. É constante de domínio, não um parâmetro público.

## 4. Requisitos funcionais

### FR-01 — Catálogo `/episodes`

- A página mostra breadcrumb/contexto de podcast, título `Episódios`, texto de apoio, barra de
  busca, seletor dropdown de ordenação, chips de categoria, grade de cards e paginação quando há mais
  de uma página.
- O formulário de busca é um `GET` progressivo: submeter por Enter ou pelo botão explícito
  atualiza `q` e volta à primeira página. Não há busca por tecla nem debounce nesta fase.
- A busca é case-insensitive e insensível a acentos, com espaço normalizado, contra título,
  resumo, convidado e rótulo/categoria do episódio.
- Um chip de categoria conserva `q`, troca `categoria` e remove `pagina`. `Todos` remove
  `categoria`, conserva `ordenar` e volta à primeira página.
- O seletor mostra `Ordenar: Mais recentes` por padrão e expõe `Mais recentes` e `Mais antigos`
  como links de uma lista dropdown. É acionável por teclado, exibe a opção corrente e não exige
  JavaScript; selecionar uma opção preserva `q`/`categoria`, troca `ordenar` e remove `pagina`.
- A paginação conserva `q`, `categoria` e `ordenar`; `Anterior`/`Próxima` ficam desabilitados nos limites.
  O elemento é um `<nav aria-label="Paginação de episódios">`, informa a página atual e não
  produz links para uma página inválida.
- A paginação longa segue o componente Pencil: na primeira página exibe
  `Previous 1 2 3 4 … última Next`; no meio preserva a primeira, a atual, vizinhos e a última.
  `Previous`/`Next` são a cópia visual do canvas, mas seus nomes acessíveis continuam em pt-BR;
  a elipse é decorativa e não focável.
- Título, artwork e uma ação textual acessível de cada card levam a `/episodes/[slug]`; o play
  existente continua sendo uma ação distinta e não substitui o link de detalhe.
- A lista não cria Header ou Footer: ambas as rotas são filhas do layout `(beta)` e herdam os
  componentes compartilhados da Homepage Beta (busca e ThemeToggle, tema lido no servidor).
  Nenhuma página ou componente da feature pode instanciar chrome próprio.

### FR-02 — URL, consulta e canonicidade da lista

Os únicos parâmetros pertencentes ao domínio são `q`, `categoria`, `ordenar` e `pagina`, nesta ordem quando
uma URL é gerada. Os valores devem ser codificados por `URLSearchParams`, nunca concatenados.

| Parâmetro | Valores válidos | Regra de normalização |
| --- | --- | --- |
| `q` | texto de 1–100 caracteres após trim | colapsar espaços internos; valor vazio é removido |
| `categoria` | `carreira`, `backend`, `frontend`, `ia-dados`, `devops`, `mobile`, `comunidade` | minúsculo; `Todos` não é serializado |
| `ordenar` | `recentes`, `antigos` | minúsculo; `recentes` é default e não é serializado |
| `pagina` | inteiro decimal positivo | `1` não é serializado; valores maiores usam a página solicitada |

- Uma URL com parâmetro conhecido vazio, repetido, malformado ou com `pagina=1` deve ser
  redirecionada para sua forma normalizada. Parâmetros externos, inclusive UTM, não alteram o
  resultado e não precisam ser removidos da navegação; eles nunca entram no canonical.
- Categoria conhecida sem resultados e busca válida sem resultados exibem estado **vazio**.
- Categoria ou ordenação desconhecida, `pagina` não inteira/menor que 1 ou página além do total de uma
  consulta que possui resultados exibem **not-found** com status 404. Não confundir esse caso com
  uma busca válida de zero resultados.
- `/episodes` sem consulta é a primeira página. Página 2+ sem busca/filtro/ordenação usa canonical próprio
  (`/episodes?pagina=N`) e pode ser indexada. Resultado com `q` e/ou `categoria` usa canonical
  `/episodes` e `robots: noindex, follow`, pois é uma superfície transitória de busca/filtro. A
  ordenação alternativa `ordenar=antigos` também usa canonical `/episodes` e `noindex, follow`,
  para não gerar uma landing indexada que só reordena os mesmos itens.

### FR-03 — Estados da lista

| Estado | Gatilho | Conteúdo e recuperação |
| --- | --- | --- |
| Loading | transição/suspense da rota | skeleton preserva introdução, toolbar, seis slots de card e região de paginação; `aria-busy` e texto somente para leitor de tela |
| Populado | consulta com resultados | contagem contextual, cards, controles e página atual coerentes com a URL |
| Vazio | consulta válida sem resultado | mensagem que repete a busca/filtro ativo, ação `Limpar filtros` para `/episodes`; sem grade vazia nem paginação enganosa |
| Error | schema/serviço mock lança erro inesperado | boundary da rota informa indisponibilidade sem expor detalhes e oferece `Tentar novamente` (`reset`) e retorno ao catálogo |
| Not found | categoria/ordenação/página inválida conforme FR-02 | página 404 sem indexação, link para `/episodes` e chrome herdado |

O estado de erro deve ser exercitável por um seam de teste/fixture controlado, não por um query
param público que simule falha.

### FR-04 — Detalhe `/episodes/[slug]`

- Resolve um slug exclusivamente pelo servidor da feature e renderiza o detalhe aprovado:
  breadcrumb `Início / Episódios / EP {número}`, hero, player completo que comanda o player
  persistente, notas, capítulos, cartão do convidado, recursos, comentários, relacionados e links
  de volta ao catálogo.
- Slug desconhecido chama `notFound()` e não tenta montar dados ou JSON-LD de episódio.
- O detalhe não monta um segundo elemento `<audio>`; o player atual continua como a única fonte
  de reprodução. Capítulos movem a posição desse player; compartilhar usa a capacidade nativa do
  navegador com fallback local; salvar e o envio de comentário são estados locais mockados, sem
  `fetch`, autenticação ou persistência remota.
- Cards relacionados devem excluir o episódio corrente, levar ao detalhe correspondente e usar a
  mesma semântica de link/play da lista.
- Header e Footer são exclusivamente herdados do layout Beta da Homepage. Ambos acompanham o
  tema persistido, inclusive quando o conteúdo do detalhe está claro.

### FR-05 — Estados do detalhe

| Estado | Gatilho | Conteúdo e recuperação |
| --- | --- | --- |
| Loading | suspense de `/episodes/[slug]` | skeleton de hero, player, lower de duas colunas, comentários e cards relacionados; sem deslocamento horizontal |
| Populado | slug mock conhecido | hero, player, notas, capítulos, sidebar, comentários, relacionados e JSON-LD do episódio |
| Vazio | não aplicável ao recurso singular | não renderizar um pseudo-detalhe vazio; um recurso ausente é not-found |
| Error | erro inesperado do serviço/schema | boundary específica da rota com `Tentar novamente`, retorno a `/episodes` e sem dados parcialmente misturados |
| Not found | slug inexistente ou inválido | status 404, `noindex`, mensagem em pt-BR e link para o catálogo |

### FR-06 — SEO, descobrimento e ligação interna

- `/episodes` tem título, descrição, Open Graph e Twitter card próprios, URL canônica e dados
  `CollectionPage` + `ItemList` na primeira página canônica. O ItemList referencia URLs de
  detalhe, não inventa URLs de áudio ou páginas que não existem.
- Cada `/episodes/[slug]` usa título e descrição do episódio, canonical absoluto equivalente a
  `/episodes/[slug]`, Open Graph/Twitter com artwork local e `PodcastEpisode` tipado. Mantém
  `Organization` e `PodcastSeries` emitidos uma vez pelo root layout e acrescenta
  `BreadcrumbList` no detalhe.
- Erros, 404s e resultados filtrados/buscados não devem ser incluídos no sitemap. Páginas 404
  recebem `noindex`.
- `app/sitemap.ts` passa a listar `/episodes` uma única vez e cada slug mock válido com
  `lastModified` derivado de `publishedAt`; não lista páginas, buscas ou filtros. `robots.ts`
  continua permitindo conteúdo público e anuncia o sitemap.
- A Home, Header, Footer e o link `Ver todos` de episódios apontam para `/episodes`. Header marca
  a rota ativa de forma acessível; Footer ativa apenas o link de conteúdo correspondente. Cards,
  breadcrumbs e relacionados criam links HTML reais entre catálogo e detalhes.

## 5. Restrições de arquitetura

- `apps/web/src/app` é camada de **roteamento, layouts, metadata exports e boundaries de rota**.
  As páginas apenas delegam parâmetros/props a entradas da feature; não contêm busca, filtro,
  acesso a fixture, schema, regra de paginação ou `fetch`.
- A feature permanece em `apps/web/src/features/episodes/`, com responsabilidades explícitas:
  `components/` para UI, `hooks/` apenas para comportamento de cliente/URL quando necessário,
  `services/` para a delegação do catálogo, `server/` para orquestração server-only,
  `schemas/`/`schemas.ts` e `types/`/`types.ts` para contratos. A forma exata deve respeitar a
  convenção existente sem duplicar domínios.
- Nenhum componente, hook ou arquivo sob `app/` chama `fetch` diretamente. Quando a API real
  chegar, somente a implementação de serviço da feature chama o cliente gerado; páginas e
  componentes continuam consumindo os resultados tipados do servidor da feature.
- Server Components são o padrão. Apenas controles que precisam de estado de interface podem ser
  Client Components; a busca deve manter fallback HTML `GET` e não exigir JavaScript.
- Reutilizar `EpisodeCard`, player, primitives, tokens de `@cafedebug/web-design-tokens` e os
  componentes de layout existentes antes de introduzir novos componentes. Não há cores, medidas
  arbitrárias ou assets remotos hardcoded em componentes da feature.

## 6. Requisitos não funcionais

| Área | Requisito |
| --- | --- |
| Idioma | Conteúdo, nomes acessíveis, erros e metadados em pt-BR; a cópia visível `Previous`/`Next` da paginação é a exceção deliberada para paridade com o Pencil; `<html lang="pt-BR">` permanece no root layout |
| Renderização | Server-first; nenhum acesso de rede nesta entrega mockada |
| Tema | Lista e detalhe herdam o Header/Footer Beta e seguem o tema claro/escuro persistido; os conteúdos mantêm paridade nos dois temas |
| Acessibilidade | Landmarks, ordem de headings, foco visível, contraste por tokens, labels pt-BR, teclados, alt de artwork e semântica de paginação/chips/breadcrumb |
| Responsividade | Sem overflow horizontal a 1440, 768 e 390px; alvos de toque mínimos de 40px onde interativos |
| Performance | Imagens locais com `next/image` quando aplicável; URL de consulta não deve disparar loops de navegação; skeleton mantém a geometria |
| Segurança | Fixtures de show notes usam HTML local curado; a troca para API exige contrato sanitizado antes de renderização HTML |

## 7. Critérios de aceitação de produto

| ID | Critério mensurável |
| --- | --- |
| AC-01 | `/episodes` mostra fixtures mockadas em `Mais recentes` ou `Mais antigos`, seis por página, e cada card fornece detalhe e play como ações distintas |
| AC-02 | Busca, categoria, ordenação e paginação respeitam FR-01/FR-02, preservam/removem parâmetros corretos e não dependem de JavaScript para navegar entre opções de ordenação ou submeter busca |
| AC-03 | Resultados vazios válidos, erro recuperável e 404 de lista são visual e semanticamente distintos; o detalhe também cobre loading/error/not-found |
| AC-04 | Todo dado de ambas as rotas vem de fixtures tipadas por um serviço da feature; busca no código confirma ausência de `fetch(` em páginas/componentes/hooks da feature |
| AC-05 | App layer continua routing-only; `/episodes` e `/episodes/[slug]` herdam exclusivamente o shell `(beta)`, sem Header/Footer duplicados dentro da feature |
| AC-06 | Lista e detalhe geram metadata, canonical, OG/Twitter, JSON-LD e robots conforme FR-06; sitemap inclui somente `/episodes` e slugs mock válidos |
| AC-07 | Desktop, tablet e mobile seguem o contrato de `design.md`, sem overflow, em claro e escuro; o chrome de lista e detalhe acompanha a Homepage Beta |
| AC-08 | Controles são acessíveis por teclado, têm foco e nomes em pt-BR; pagination, filtros e breadcrumb expõem estado atual corretamente |
| AC-09 | Lint, typecheck, testes focados, build, validação estrutural/SEO e `git diff --check` passam antes de qualquer promoção de status |
| AC-10 | Compartilhar/Salvar, o atalho para capítulos, os ícones sociais e as ações Like/Responder reproduzem os nós P12 sem rede, com foco e nomes acessíveis |

## 8. Questões em aberto

| Questão | Dono | Bloqueia planejamento? | Encaminhamento |
| --- | --- | --- | --- |
| Como categorias editoriais legadas das fixtures atuais serão mapeadas para a taxonomia de chips do Pencil? | Produto + Master Planner | Não | Registrar o mapeamento ao planejar a migração das fixtures; não inventar equivalências silenciosas. |
| Há novos frames Pencil mobile/tablet para a lista e o detalhe? | Design | Não | O contrato usa comportamento inferido; a inspeção Pencil obrigatória antes de implementar registra qualquer divergência. |
| Qual contrato e política de cache da API pública substituirá o catálogo mock? | API + Produto | Não para esta feature mock; sim para integração futura | Abrir spec de integração posterior; não antecipar endpoint nem cache nesta entrega. |
| A página 2+ deve permanecer indexável após conteúdo real suficiente? | SEO + Produto | Não | O Draft a permite; revalidar com volume real e estratégia editorial antes da integração. |

**Status de saída:** Implementado e validado pelo Architect Guardian. As questões abertas são
decisões não bloqueantes para a futura integração de dados reais.

## 9. Emenda de paridade visual — 2026-08-04

- O catálogo `/episodes` usa o route group `(beta)` para herdar o Header e Footer da Homepage
  Beta; isso mantém Search, ThemeToggle e o tema persistido sem criar um segundo chrome.
- A área de lista usa o mesmo container central da Homepage Beta: máximo de `1312px`, gutter de
  `64px` no desktop (`lg:px-16`) e três trilhas de aproximadamente `421.33px` em `1440px`, com
  gap de `24px`. Em larguras maiores os cards não se expandem; tablet e mobile mantêm as regras
  de duas e uma colunas, respectivamente.
- Os filtros obedecem aos frames `KbyBJ` (ativo) e `BdBJJ` (inativo): visual de `32px`, fonte
  Geist 14px/500, padding horizontal 12px, gap 10px, ativo `background` +
  `shadow-pencil-subtle` e inativo transparente com `muted-foreground`. O link mantém uma caixa
  de foco e toque de 40px sem alterar a geometria visual de 32px.

## 10. Emenda P11 — shell de detalhe da Homepage Beta — 2026-08-05

- A decisão de produto substitui a exceção histórica do detalhe: `/episodes/[slug]` deve usar o
  mesmo `app/(beta)/layout.tsx` já empregado por `/episodes`.
- O mecanismo é exclusivamente estrutural: mover `page.tsx`, `loading.tsx`, `error.tsx` e
  `not-found.tsx` do segmento de detalhe ao route group `(beta)`. A URL pública, metadata,
  dados mockados, boundaries e todos os componentes da feature permanecem os mesmos.
- O resultado esperado contém exatamente um Header Beta e um Footer Beta, com Search e
  ThemeToggle, em claro e escuro. Não é permitido importar ou montar Header/Footer na página,
  nos boundaries ou em componentes de `features/episodes`.
- A mudança não altera frames Pencil, tokens globais, consultas, canonical, sitemap, player ou a
  futura seam de API; ela só faz o detalhe herdar o chrome já aprovado da Homepage Beta.

## 11. Emenda P12 — ações de detalhe e comentários — 2026-08-05

- `Compartilhar` e `Salvar` usam a superfície semântica `card`, borda `border` e a geometria
  Pencil de 48px de altura (146px e 102px respectivamente). Mantêm compartilhamento nativo/
  fallback de clipboard e o estado mock local de salvo.
- O atalho do player preserva o destino `#capitulos`, mas exibe o ícone de lista e o texto visível
  `Capítulos`; o hit target continua tendo 40px e foco visível.
- O cartão do convidado exibe os ícones Lucide corretos para LinkedIn e GitHub (e Twitter para o
  destino social `X` atual), sem alterar URLs ou criar novos destinos externos.
- Cada comentário mock tipado contém uma contagem inicial de likes. `Like` alterna somente seu
  estado local/contagem e `Responder` marca o autor no compositor e lhe dá foco. Nenhuma ação de
  comentário usa API, `fetch`, autenticação ou persistência remota.
