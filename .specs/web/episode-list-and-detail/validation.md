# Validação: Lista e Detalhe de Episódios

| Campo | Evidência |
| --- | --- |
| **Data** | 2026-08-05 |
| **Dados** | Fixtures locais tipadas; nenhuma integração de API foi introduzida |
| **Fonte visual** | `cafedebug.pen` inspecionado via Pencil MCP |
| **Nós comparados** | Lista: `iDkzC`, `S0iYm0`, `Y2Tiu2`, `FGSFI`, filtros `KbyBJ`/`BdBJJ`, paginação `9PVw5`/`Svd9t`/`oT0d2`/`Doslm`/`Irk3I`, Header Beta `M9Wiwt`, Footer Beta `Q77OEY`; detalhe: `VkDts`, `Oh9Bv`, `A9veS`, `T9rs9`, `E53fPU`, `otKVn`, `fct3A`, `xtN8C`, `ZMkyF`, `unSzO`, `TKM8R`, `n4H1k` |
| **Runtime** | In-app Browser em `localhost:3000`; revisão P10 independente em 1440/768/390px e validação P11 do shell Beta do detalhe nos temas claro/escuro |

## Resultado

**Aprovado para o escopo da feature, incluindo P10 de paridade integral, P11 de shell Beta e P12 de controles/comentários.**
A lista e o detalhe usam fixtures locais por trás do serviço da feature, preservam os layouts
herdados corretos e foram comparados diretamente com os frames Pencil disponíveis. A conexão
Pencil foi revalidada nesta rodada; nenhum frame foi editado.

A correção P8 alinha a paginação aos componentes do canvas sem alterar dados mockados, URLs,
SEO ou o adaptador de rota. A correção P9 remove a largura desktop residual do seletor de
ordenação, mantendo os mesmos dados, navegação e comportamento de mobile. A P10 completa a
anatomia de detalhe que antes era ausente: hero, player, notas, capítulos, sidebar, comentários,
relacionados e loading, todos alimentados pela mesma seam mock tipada.

A correção P11 substitui a exceção histórica de chrome escuro fixo do detalhe: os quatro
adaptadores de `/episodes/[slug]` agora são descendentes de `(beta)`, portanto usam exatamente o
Header e Footer da Homepage Beta sem os duplicar na feature. URLs, SEO, dados mockados e o player
não foram alterados.

A correção P12 fecha quatro diferenças do detalhe apontadas por comparação direta: ações
Compartilhar/Salvar, o atalho textual de capítulos, iconografia de LinkedIn/GitHub/Twitter e ações
Like/Responder em comentários. Todos os comportamentos continuam locais e mockados.

Em 2026-08-04, a revisão do controle `Ordenar` promoveu o antigo indicador estático a um
seletor dropdown: `Mais recentes` continua o default e `Mais antigos` é uma ordem canônica
alternativa mockada. A mudança não introduz API, fetch ou outro dado externo.

## Evidência visual e responsiva

| Superfície | Pencil / contrato | Evidência de runtime |
| --- | --- | --- |
| Lista desktop P7 | Grade Beta `Y2Tiu2`: container máximo 1312px, gutter 64px em 1440, três colunas com gap 24px; `FGSFI` mantém card de 412px | A 2520px de viewport (2505px úteis), o container foi centralizado e os três primeiros cards mediram 421.328px, 421.328px e 421.344px, todos com 412px de altura. Em 1440px, a mesma geometria Beta limita a grade a 1312px e produz tracks de aproximadamente 421.33px; não há expansão em telas maiores. |
| Chrome da lista P7 | Header Beta `M9Wiwt` e Footer Beta `Q77OEY` | `/episodes` herda `(beta)`: Header único de 72px com Search e ThemeToggle, sem `Assinar`; Footer único. A alternância runtime confirmou escuro e claro (neste último, Header/Footer e conteúdo usam superfícies claras coerentes). |
| Chrome do detalhe P11 | Mesmo Header Beta `M9Wiwt` e Footer Beta `Q77OEY` da Homepage Beta | `/episodes/[slug]` herda `(beta)`: há um único Header e Footer, Search e ThemeToggle estão presentes e `Assinar` não aparece. No escuro, Header/Footer mediram `rgb(17,17,17)`/`rgb(26,26,26)`; no claro, `rgb(242,243,240)`/`rgb(255,255,255)`. |
| Filtros P7 | Ativo `KbyBJ`: 32px, padding [6,12], Geist 14px/500, `background` e shadow; inativo `BdBJJ`: transparente e `muted-foreground` | Todos os labels mediram 32px; `Todos` mediu 62.906px e o link 40px. Os demais valores, da largura de Carreira (76.266px) à Comunidade (106.609px), seguem o padding de 12px e gap de 10px. Runtime confirmou Geist 14px/500, sombra do ativo, inativo transparente, `aria-current="page"` e foco no único link por filtro. |
| Paginação P8 | `9PVw5` tem gap 8px; `Svd9t` aplica Ghost 40px/Mono 14px/500; `oT0d2` é ativo 40px com background, borda e shadow; `Doslm` é transparente em Geist 14px/500; `Irk3I` é decorativo | Runtime em `/episodes` mediu Previous com 99.203px × 40px e números com 40px × 40px. Previous usou JetBrains Mono 14px/500; os números usaram Geist 14px/500; a página ativa teve `background` + borda interna `border` + `shadow-pencil-subtle` e os controles padrão não receberam surface. Em página 2, Previous navegou para `/episodes`, Next ficou `aria-disabled` sem link e a página atual foi exposta por `aria-current="page"`. |
| Seletor `Ordenar` P9 | `FAVDG`: pill de `card` de 231 × 50px, padding horizontal de 18px, `gap` 8px, label, valor destacado e chevron | Runtime mediu 232.234 × 50px no desktop — a variação de 1.234px vem da métrica de fonte — sem espaço residual após `Mais recentes`; em mobile o trigger permanece fluido em 343px na largura útil. A lista aberta em `popover`, as opções, o indicador ativo e o foco tokenizado permanecem equivalentes. |
| Card de episódio | `FGSFI`: artwork 200px + corpo 212px, total 412px | Card usa altura estável de 412px, link de detalhe separado do botão de play e conteúdo truncado sem alterar a grade. |
| Detalhe desktop P10 | `VkDts` / `Oh9Bv`: content gutter 40px, hero 1360 × 380, player 1360 × 179, lower de duas colunas 952/360 com gap 48, comentários 860px e três relacionados | A revisão independente em 1440px confirmou todas as regiões na ordem Pencil, uma única superfície de player de 180px, sidebar com gap de 20px e relacionados em largura total; sem overflow horizontal. |
| Claro/escuro P10/P11 | `VkDts` é escuro, `Oh9Bv` é claro; Header/Footer acompanham a Homepage Beta | O Debugger validou as superfícies de detalhe clara e escura em 1440px. P11 confirmou que o chrome herdado permanece único, troca de tema com o documento e não é renderizado pela feature. |
| Controles P12 | Ações `TMQxS`/`sq9SK`, capítulos `WS7ZJ`, sociais `R50WG` e comentários `RSDAS`/`kLaSt` | No escuro, Compartilhar/Salvar mediram 48px com `rgb(26,26,26)` e borda `rgb(46,46,46)`; em claro usaram `rgb(255,255,255)` e borda `rgb(203,204,201)`. O link de capítulos mediu ~80px e exibiu texto. Os três ícones sociais renderizaram; Like alternou 34→35 e Responder focou o compositor. |
| Tablet P10 | Inferência exigida pelo contrato: hero e lower empilham antes da largura de desktop, sem esconder controles | Em 768px a revisão independente confirmou empilhamento responsivo, controles alcançáveis e `scrollWidth` sem exceder a viewport. |
| Mobile P10 | Inferência exigida pelo contrato: uma coluna, gutter 16px, sem descendants largos | Em 390px a revisão confirmou `scrollWidth=375` para `innerWidth=390` e nenhuma descendant larga. `EpisodeChapters` usa coluna explícita `minmax(0, 1fr)` para impedir a expansão pelo título de capítulo. |

## Interações e estados exercitados no Browser

- Chip `Backend` navega para `/episodes?categoria=backend` e preserva o domínio da consulta.
- Busca GET por texto sem resultado navega para `/episodes?q=termo+inexistente` e exibe o estado vazio.
- `Ordenar` abre uma lista de links HTML nomeados; selecionar `Mais antigos` navega para
  `/episodes?ordenar=antigos`, mostra EP 136 primeiro, preserva a ordenação em chips/paginação
  e recarrega o seletor fechado. A alternativa usa canonical `/episodes` e `noindex, follow`.
- Em 390px, o seletor ocupa 343px dentro do gutter de 16px, tem alvo de 48px e não cria overflow
  horizontal. A implementação usa `details`/`summary` nativos, portanto também preserva a
  ativação por teclado e o fallback sem JavaScript.
- Player do detalhe muda para pausa ao reproduzir, alterna para 1.25x, silencia/restaura o
  volume e mantém apenas um elemento `<audio>`.
- O fixture AAC local tem 4.331,4s (cobre todos os capítulos); capítulo 2 ativa o estado corrente
  e posiciona o áudio em aproximadamente 382s. O ciclo play→pause não produz erros novos no
  console, inclusive para a interrupção normal `AbortError`.
- Salvar alterna localmente para `Salvo`; um comentário local é renderizado e incrementa o total.
- Todos os controles do player têm alvo real de pelo menos 40px; o pill de velocidade preserva
  36px visuais conforme `E53fPU` dentro de seu alvo de 40px.
- Slug inexistente exibe o estado not-found, link de retorno ao catálogo e `meta[name=robots]`
  com `noindex`.
- A rota de detalhe possui boundary própria de erro, com copy específica, `reset` e retorno a
  `/episodes`.
- O slug inexistente, após a migração P11, continua exibindo o boundary de detalhe com um único
  Header/Footer Beta, Search, ThemeToggle e `robots=noindex`.
- P12: Compartilhar/Salvar preservam seus handlers locais; o link de `Capítulos` chega à âncora;
  Like expõe `aria-pressed` e a resposta altera o placeholder para o autor, leva foco ao campo e
  pode ser cancelada sem persistência.
- O Browser não mostrou avisos de overflow nas superfícies aprovadas após o ajuste da grade do
  detalhe para uma única coluna base.
- A correção P7 mantém um único controle focável por categoria: a label visual de 32px fica
  centralizada dentro do `Link` de 40px; foco por teclado foi confirmado no link ativo sem criar
  uma segunda parada de tabulação.
- A correção P8 exercitou a paginação mock disponível (duas páginas) no Browser. O helper puro
  possui testes para a sequência Pencil de 24 páginas (`1 2 3 4 … 24`), meio e fim; a elipse
  renderiza um `span aria-hidden`, portanto não cria uma parada de tabulação.

## Regiões P10 entregues

Hero, player, notas, capítulos, perfil do convidado, recursos, comentários e relacionados agora
integram `/episodes/[slug]`. Todos permanecem alimentados por fixtures locais tipadas via
`episode-catalog.service.ts`; não há API, `fetch`, persistência remota ou segundo player.

## Gates automatizados

Executados no diretório raiz do repositório:

```text
pnpm --filter @cafedebug/web run lint       PASS
pnpm --filter @cafedebug/web run typecheck  PASS
pnpm --filter @cafedebug/web run test       PASS (69/69)
pnpm --filter @cafedebug/web run build      PASS
git diff --check                            PASS
auditoria de fetch proibido                 PASS
revisão independente de design/Debugger     APPROVE (P10, após atualização desta evidência)
P11: shell Beta, testes e build              PASS
P12: 69/69 testes, lint, typecheck e build  PASS
```

## Risco residual

O asset AAC local é intencionalmente sintético e permite validar seek e o único elemento de
reprodução, mas não representa streaming de produção. A integração de áudio real, contrato da
API e cache continuam trabalho posterior, conforme `spec.md`.
