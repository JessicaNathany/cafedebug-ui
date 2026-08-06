# Tasks: Lista e Detalhe de Episódios

| Campo | Valor |
| --- | --- |
| **Status** | `Implemented` — P12: ações e comentários do detalhe validados contra Pencil |
| **Pré-condição global** | Aprovação explícita de `spec.md` e `design.md` pelo Architect Guardian |
| **Regra de execução** | Nenhuma fase de implementação pode iniciar enquanto a fase anterior não passar pelo gate indicado |
| **Dados** | Somente mock; integração de API é explicitamente adiada |

## Dependências e sequência

```text
P0 Aprovação de especificação e inspeção Pencil
  → P1 Contratos, query e seam mock
    → P2 Rota e UI do catálogo
      → P3 Alinhamento do detalhe e links internos
        → P4 SEO, canonical e sitemap
          → P5 Acessibilidade, responsividade e paridade visual
            → P6 Validação final e documentação
              → P7 Correção de paridade da lista
```

P2 e P3 podem ser subdivididas pelo Master Planner somente se os write sets não se sobrepõem e
se os respectivos gates forem mantidos. A sequência de aprovação Specification → Planning →
Implementation → Debug/validation → Documentation é obrigatória.

## P0 — Aprovação e evidência de design

**Responsável primário:** Architect Guardian / Spec Writer / Master Planner

**Objetivo:** transformar o Draft em entrada de planejamento sem começar implementação.

1. Revisar `spec.md`, `design.md` e este arquivo contra README, `.github/copilot-instructions.md`
   e a fundação web.
2. Registrar a decisão de taxonomia das fixtures: não converter silenciosamente categorias
   editoriais legadas em chips novos.
3. Antes de escrever UI, inspecionar `cafedebug.pen` pelo Pencil MCP: `get_editor_state`,
   `get_screenshot` e `batch_get` para `iDkzC`, `S0iYm0`, `VkDts`, `Oh9Bv`, `FGSFI` e `E53fPU`.
   Não editar o arquivo `.pen`.
4. Registrar divergências materiais entre nós atuais e `design.md`; se houver, devolver à
   especificação antes de implementar.

**Gate P0 — aprovação para planejamento:**

- Status do pacote continua `Draft` até aprovação; não há código de produto criado nesta fase.
- A inspeção confirma fontes ou cria um issue/decisão explícita para qualquer lacuna de Pencil.
- Master Planner aceita as questões abertas não bloqueantes e confirma que não implementará API
  ou busca global; a ordenação aprovada limita-se a `Mais recentes` e `Mais antigos`.

## P1 — Contratos de domínio e seam mock

**Responsável primário:** Frontend Blacksmith, após plano aprovado

**Dependências:** P0 aprovada.

**Write scope esperado:** `apps/web/src/features/episodes/{types,schema(s),mock,services,server}`
e testes focados. Não alterar API, token package, Pencil ou dados reais.

1. Definir/estender tipos e schemas para chave de categoria, `EpisodeListQuery` e
   `EpisodeListResult`; manter compatibilidade deliberada com consumidores da fixture atual.
2. Criar parser/normalizador único de query e construtor de URL, com todos os defaults e regras
   da seção FR-02.
3. Criar serviço de catálogo mock e entradas server-only que executem ordenação, busca
   accent-insensitive, filtro e paginação de seis itens.
4. Injetar seam de falha apenas nos testes para validar boundary, sem query pública de debug.
5. Migrar fixtures somente após registrar a taxonomia aprovada; manter assets locais e schema
   válido.

**Gate P1 — critérios de aceite:**

- Testes unitários cobrem busca com e sem acentos, cada categoria válida, página 1/default,
  página posterior, resultado vazio, categoria/página inválida, URL canonizada e erro de schema.
- Não há `fetch(`, base URL ou endpoint de API em `app`, componentes, hooks ou serviço mock.
- `listEpisodes`/`getEpisode` e os novos resultados passam por schemas e não vazam fixture crua
  para páginas.

## P2 — Rota, UI e estados da lista

**Responsável primário:** Frontend Blacksmith

**Dependências:** P1 aprovada e nós de lista inspecionados em P0.

**Write scope esperado:** `apps/web/src/app/(content)/episodes/` e
`apps/web/src/features/episodes/components/`, com ajustes mínimos a primitives existentes quando
necessários para o contrato. Não criar Header/Footer por feature.

1. Adicionar a página `/episodes` como adaptador routing-only que delega `searchParams` para a
   feature; adicionar loading/error/not-found de segmento com responsabilidades de rota.
2. Compor introdução, busca GET, dropdown de ordem, filtros, grid, paginação e estado vazio com
   componentes de feature e fixtures resolvidas no servidor.
3. Implementar redirects de normalização e separação entre vazio e 404 conforme FR-02/FR-03.
4. Evoluir `EpisodeCard` para oferecer navegação de detalhe sem colidir com o controle de play.
5. Preservar Header/Footer exclusivamente pelo `(content)/layout.tsx` e não repetir landmarks.

**Gate P2 — critérios de aceite:**

- `/episodes`, pesquisa, dropdown de ordenação, chips, paginação, vazio, erro e 404 obedecem à URL e às mensagens de
  `spec.md`; Enter no formulário funciona sem aprimoramento client-side.
- O loading apresenta introdução/toolbars/seis slots/paginação estáveis; nenhum estado gera
  overflow horizontal.
- Todo card oferece uma ação de abrir e uma ação de reproduzir semanticamente distintas.
- Inspeção de `app/` prova que a página só adapta rota/composição e que componentes não fazem
  acesso de dados direto.

## P3 — Detalhe, navegação compartilhada e descoberta interna

**Responsável primário:** Frontend Blacksmith

**Dependências:** P1 e P2 aprovadas; nós de detalhe inspecionados em P0.

**Write scope esperado:** `apps/web/src/app/(beta)/episodes/[slug]/`,
`apps/web/src/features/episodes/`, `apps/web/src/components/layout/` apenas para ativar links
existentes de Episódios quando estritamente necessário.

1. Refatorar o detalhe para que sua página seja adaptador de rota e a resolução de slug,
   relacionados, JSON-LD e decisões not-found sejam da feature server-only.
2. Completar loading, erro e not-found específicos do detalhe sem segundo áudio ou dados parciais.
3. Adicionar breadcrumb, links de retorno, relacionados e semântica de link/play especificada.
4. Atualizar Header e Footer existentes para que o destino `Episódios` seja `/episodes`, incluindo
   estado ativo acessível; manter demais destinos deferidos sem link inventado.

**Gate P3 — critérios de aceite:**

- Cada slug mock válido renderiza detalhe; slug inválido é 404 noindex; erro recuperável tem
  `reset` e retorno ao catálogo.
- Há no máximo um `<audio>` e a navegação entre lista/detalhe não cria player paralelo.
- Header/Footer continuam herdados pelo layout Beta, seguem o tema persistido e não são
  duplicados dentro das páginas.
- Links internos existentes e novos apontam somente a rotas reais.

## P4 — SEO e superfície rastreável

**Responsável primário:** Frontend Blacksmith; revisão do The Debugger

**Dependências:** P2 e P3 aprovadas.

**Write scope esperado:** helpers de metadata/JSON-LD existentes, adaptadores de rota e
`apps/web/src/app/{sitemap.ts,robots.ts}`; nenhum endpoint de dados novo.

1. Implementar metadata da lista e detalhes usando builders tipados e origem de ambiente já
   existente; declarar canonical e robots por estado de query.
2. Adicionar `CollectionPage`/`ItemList` no catálogo canônico e `BreadcrumbList` no detalhe;
   preservar `Organization`/`PodcastSeries` no root, sem emitir duplicatas por card.
3. Atualizar sitemap para `/episodes` e todos os slugs mock válidos, usando `publishedAt` como
   base de `lastModified`; excluir search/filter/paginação/404.
4. Verificar robots e páginas noindex com requests/runtime ou testes de metadata.

**Gate P4 — critérios de aceite:**

- Canonicals e robots correspondem à tabela de `design.md` §2.1 para browse, page 2, busca,
  filtro, ordenação alternativa e detalhe.
- JSON-LD não contém URL inexistente nem recurso ausente; `PodcastEpisode` e breadcrumbs passam
  validação estrutural focada.
- Sitemap possui `/episodes` uma vez e um item por slug mock, sem query string.

## P5 — Paridade visual, responsividade e acessibilidade

**Responsável primário:** Frontend Blacksmith; validação independente do The Debugger/design
reviewer

**Dependências:** P2–P4 aprovadas.

1. Comparar runtime aos nós Pencil em claro/escuro em 1440, 768 e 390px; registrar que tablet e
   mobile são inferências se o Pencil não fornecer artboards.
2. Corrigir somente através de tokens, primitives e componentes definidos no contrato; promover
   valores estáveis a `packages/web-design-tokens` apenas se a inspeção Pencil demonstrar que
   são novos tokens globais.
3. Exercitar teclado, foco, labels, landmarks, breadcrumbs, busca, seletor de ordenação, chips, paginação, play/link,
   loading, vazio, erro, 404 e `prefers-reduced-motion`.
4. Capturar screenshots para os estados essenciais e validar ausência de overflow/hydration
   warnings/regressões do player.

**Gate P5 — critérios de aceite:**

- Geometria, tipografia, cards, toolbar, controles, themes e chrome satisfazem `design.md`;
  qualquer diferença deliberada de responsividade está documentada como inferência.
- Header/Footer Beta e o conteúdo do detalhe apresentam contraste e interação equivalentes nos
  dois temas.
- Nenhuma ação depende exclusivamente de mouse, não há foco invisível, nem landmark/heading
  duplicado.

## P6 — Validação final e documentação

**Responsável primário:** The Debugger, depois Documentation Monk

**Dependências:** P1–P5 aprovadas.

1. Executar testes focados de fixtures/consulta/URL/metadata/JSON-LD e testes de componente/E2E
   definidos pelo plano aprovado.
2. Executar `pnpm --filter @cafedebug/web run lint`, `typecheck`, `test` e `build`, além de
   `git diff --check`.
3. Fazer auditoria de arquitetura: `app` routing-only, ausência de `fetch` proibido, serviço
   único de catálogo, dados mock apenas, tokens sem valores visuais locais, nenhum segundo player.
4. Atualizar documentação final e índice de specs somente quando a implementação e todos os gates
   estiverem aprovados; preservar registro da futura integração de API como trabalho separado.

**Gate P6 — definição de pronto:**

- Todos os AC-01 a AC-09 de `spec.md` possuem evidência objetiva (teste, screenshot, inspeção de
  source ou runtime) e não apenas intenção.
- Não existem falhas nos comandos de qualidade nem perguntas bloqueantes sem decisão.
- Architect Guardian recebe handoff com paths, resultados de validação, riscos residuais e status
  explícito de aprovação/rejeição da implementação.

## Checklist de handoff para Master Planner

- [x] Ler `.specs/web/episode-list-and-detail/spec.md` e `design.md` junto com
  `.specs/web/foundation/ux-design-reference.md` e `.specs/web/page-contract-template.md`.
- [x] Confirmar P0 e registrar resultado da inspeção Pencil, inclusive lacunas mobile/tablet.
- [x] Converter P1–P6 em tarefas atômicas com owner, write set, dependência e evidência de aceite.
- [x] Manter fixtures/mock no plano; excluir qualquer API, endpoint, cache remoto ou dado real.
- [x] Reservar mudanças de Header/Footer para links herdados/ativos apenas; não criar chrome na
  feature.
- [x] Incluir testes para URL/canonical, vazio/erro/404, acessibilidade, paridade temática e
  persistência do player.
- [x] Não iniciar Frontend Blacksmith antes de aprovação formal do Architect Guardian.

**Status de handoff:** Implementação concluída e validada; evidências estão em `validation.md`.

## P7 — Correção de paridade da listagem com Homepage Beta

**Responsável primário:** Frontend Blacksmith; validação independente do web-design reviewer

**Pré-condição:** inspeção Pencil reaberta e registrada para `M9Wiwt`, `Q77OEY`, `KbyBJ`,
`BdBJJ`, `FGSFI` e a grade Beta `Y2Tiu2`.

1. Histórico P7: mover somente os boundaries da rota `/episodes` para `app/(beta)/episodes/`.
   A condição de manter `/episodes/[slug]` em `(content)` foi substituída pela P11.
2. Limitar conteúdo, loading skeleton e grade da lista ao container `1312px` da Homepage Beta,
   com os gutters responsivos equivalentes. Preservar cards de altura 412px e suas ações.
3. Trocar os filtros 40px visuais por labels 32px conforme Pencil, mantendo links com alvos de
   40px, `aria-current`, foco visível e uma única ação navegável.
4. Atualizar testes de fonte/rota e o contrato de design; não alterar mocks, SEO, query params,
   player, tokens globais ou `cafedebug.pen`.

**Gate P7 — critérios de aceite:**

- Histórico P7: `/episodes` exibe Search + ThemeToggle e Footer Beta em claro e escuro. A
  condição anterior de shell escuro para o detalhe foi substituída pela P11.
- Em 1440px o grid inicia no gutter de 64px, mede no máximo 1312px e seus cards não excedem
  aproximadamente 421.33px; 768/390px não apresentam overflow horizontal.
- Filtros têm 32px visuais, 10px de gap, fonte Geist 14px/500 e a aparência ativo/inativo de
  `KbyBJ`/`BdBJJ`, mas continuam alcançáveis por teclado e com alvo de toque de ao menos 40px.
- Testes, typecheck, lint, build, `git diff --check`, inspeção estrutural e revisão independente
  recebem evidência explícita antes da atualização de `validation.md`.

## P8 — Paridade da paginação com Pencil

**Responsável primário:** Frontend Blacksmith

1. Aplicar os componentes Pencil `9PVw5`, `Svd9t`, `oT0d2`, `Doslm` e `Irk3I` a
   `EpisodePagination`, sem alterar query params, dados mockados ou a camada de rota.
2. Resumir páginas extensas em uma faixa acessível com elipse decorativa, mantendo a página
   atual, vizinhos necessários e a última página alcançáveis.
3. Atualizar testes de fonte e `validation.md` com medidas, tipografia, estados de limite e
   evidência runtime.

**Gate P8 — critérios de aceite:**

- Desktop reproduz `Previous 1 2 3 4 … 24 Next` para o primeiro estado de uma lista longa:
  gap 8px, controles e itens 40px, Previous/Next Mono 14px/500, números Geist 14px/500.
- A página ativa tem somente superfície `background`, borda `border` e
  `shadow-pencil-subtle`; itens padrão, elipse e controles Ghost não recebem os pills
  laranja/cinza anteriores.
- URLs de página, `aria-current`, disabled sem link, nomes acessíveis pt-BR e a elipse sem foco
  continuam corretos; testes, lint, typecheck, build e `git diff --check` passam.

## P9 — Ajuste de largura do seletor de ordenação

**Responsável primário:** Frontend Blacksmith

1. Substituir a largura desktop fixa do `EpisodeSortSelector` pela largura intrínseca do conteúdo,
   mantendo `w-full` para a adaptação mobile.
2. Reproduzir `FAVDG` em 231 × 50px no desktop, incluindo padding de 18px e `gap` de 8px, sem
   criar valores de cor ou dados novos.
3. Registrar a medição Pencil e cobrir a regra de fonte; validar o menu, navegação por teclado e
   overflow em desktop e mobile.

**Gate P9 — critérios de aceite:**

- O seletor fechado de desktop não possui espaço residual à direita: o chevron segue o valor com
  `gap` de 8px e a largura intrínseca reproduz os 231px do Pencil dentro de 2px de métrica de
  fonte, com 50px de altura.
- Em mobile, o controle continua com largura útil total, o menu possui a largura do trigger e não
  há overflow horizontal.
- URL/canonical, opções, estado ativo, foco e fallback nativo de `details` permanecem inalterados;
  testes, lint, typecheck, build e `git diff --check` passam.

## P10 — Paridade integral da página de detalhe

**Responsável primário:** Frontend Blacksmith; revisão final do web-design-reviewer e The Debugger.

**Pré-condição:** inspeção Pencil ao vivo registrada para `VkDts`, `Oh9Bv`, `A9veS`, `T9rs9`,
`E53fPU`, `otKVn`, `fct3A`, `xtN8C`, `ZMkyF`, `unSzO`, `TKM8R` e `n4H1k`.

1. Manter o app route routing-only e registrar os dados complementares de detalhe como fixtures
   tipadas acessíveis através de serviço/server da feature; não introduzir API, fetch ou assets
   remotos novos.
2. Reconstruir o hero e o `FullPlayer` com as dimensões e anatomia observadas, mantendo o único
   `<audio>` do provider e conectando capítulos ao store existente.
3. Criar lower, guest/resources, comentários locais e relacionados conforme os nós, usando apenas
   tokens semânticos existentes; Header, Footer e navegação global não podem ser editados.
4. Completar loading e testes de fonte para proteger estrutura, controles, dados mockados e
   limites de arquitetura.
5. Validar no runtime desktop 1440, tablet 768 e mobile 390, nos temas escuro e claro, incluindo
   overflow, foco, console/hydration, play/pause, seeks de capítulo, compartilhar, salvar e envio
   local de comentário.

**Gate P10 — critérios de aceite:**

- As regiões, ordem, geometria, tipografia, tokens e controles de `VkDts`/`Oh9Bv`/`E53fPU` são
  reproduzidas sem alterar Header/Footer ou criar outro áudio.
- As diferenças listadas em `design.md` §3.4.1 não permanecem no runtime; tablet/mobile são
  explicitamente validados como comportamento responsivo inferido.
- Lint, typecheck, testes, build, `git diff --check`, revisão de design e auditoria do Debugger
  passam antes de promover o pacote novamente a `Implemented`.

**Resultado P10:** concluída em 2026-08-05. A validação independente confirmou as regiões de
detalhe, o único áudio mock local, play/pause, seek de capítulos, ausência de overflow em
1440/768/390px e superfícies claro/escuro. Evidências completas em `validation.md`.

## P11 — Shell do detalhe igual à Homepage Beta

**Responsável primário:** Architect Guardian; execução Frontend Blacksmith; gate final The Debugger.

**Pré-condição:** a decisão de produto de que Header e Footer de `/episodes/[slug]` devem manter
o comportamento da Homepage Beta foi registrada em `spec.md` §10 e `design.md` §1.1.

1. Mover o segmento completo `app/(content)/episodes/[slug]/` para
   `app/(beta)/episodes/[slug]/`, preservando `page.tsx`, `loading.tsx`, `error.tsx` e
   `not-found.tsx` como adaptadores de rota. Não deixar segmentos concorrentes para a mesma URL.
2. Manter cada adaptador routing-only e sem `fetch`; a página continua delegando à entrada server
   da feature. Não editar nem importar Header/Footer na feature ou na rota.
3. Atualizar testes de fonte para verificar que lista e detalhe estão sob `(beta)` e que o layout
   compartilhado fornece uma única instância de `Header variant="beta"` e `Footer variant="beta"`.
4. Validar `/episodes/[slug]` em claro e escuro, incluindo Search, ThemeToggle, Footer, ausência
   de `Assinar` no Header e inexistência de overflow ou erros de rota. Registrar a evidência.

**Gate P11 — critérios de aceite:**

- `/episodes` e `/episodes/[slug]` mantêm as mesmas URLs públicas e herdam o layout `(beta)`;
  o detalhe contém um único Header com Search/ThemeToggle e um único Footer Beta, em claro e
  escuro.
- `generateStaticParams`, `generateMetadata`, loading, erro e not-found do detalhe continuam
  presentes após a mudança, sem duplicação de segmento e sem mudança dos dados mockados.
- Testes, typecheck, lint, build, `git diff --check`, auditoria de `fetch(` e validação runtime
  passam antes de promover o pacote novamente a `Implemented`.

**Resultado P11:** concluída em 2026-08-05. O detalhe mantém URL, metadata, boundaries e seam
mock, mas seus quatro adaptadores de rota agora residem em `(beta)`. A validação runtime confirmou
um único Header/Footer Beta, Search e ThemeToggle, ausência de `Assinar`, 404 herdado e os dois
temas sem overflow; os gates automatizados passaram.

## P12 — Ações do hero, capítulos, sociais e comentários

**Responsável primário:** Frontend Blacksmith; gate final Architect Guardian.

1. Aplicar `bg-card` e `border-border` aos botões Compartilhar/Salvar, mantendo suas larguras,
   ícones e comportamentos locais existentes.
2. Exibir `Capítulos` ao lado de `List` no link do player, preservando `href="#capitulos"`, foco
   e o único áudio provider-owned.
3. Substituir os ícones genéricos dos destinos sociais por Twitter, Linkedin e Github, sem mudar
   URLs mockadas nem a anatomia de 36px do cartão.
4. Estender o contrato mock de comentário com likes e implementar Like/Responder acessíveis como
   estado exclusivamente local; Responder leva o foco ao compositor e não envia dados remotos.
5. Cobrir os contratos de fonte, validar desktop/tablet/mobile e claro/escuro, e executar os
   gates de qualidade.

**Gate P12 — critérios de aceite:**

- O hero tem botões secundários de 48px com `card + border`; o player mostra iconografia e texto
  `Capítulos` sem regressão do áudio ou do link de âncora.
- LinkedIn e GitHub usam seus ícones reconhecíveis e todos os três destinos sociais seguem pills
  de 36px. Cada comentário tem Like com número e Responder com ícone, foco visível e nomes
  acessíveis.
- Likes e replies permanecem mock locais; não há `fetch(`, alteração de URL, API ou persistência.
- Testes, lint, typecheck, build, `git diff --check` e inspeção runtime passam antes da promoção
  de status.

**Resultado P12:** concluída em 2026-08-05. Os botões de ação renderizam `card + border` em
48px, o atalho do player mostra `Capítulos`, LinkedIn/GitHub/Twitter usam ícones reconhecíveis e
cada comentário oferece like e resposta locais. A inspeção runtime confirmou tema escuro/claro,
foco do reply no compositor, contagem de like de 34 para 35, ausência de overflow e nenhum erro
novo no console.
