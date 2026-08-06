# Plano de paridade — catálogo de episódios

| Campo | Valor |
| --- | --- |
| **Status** | `Superseded in part` — P11 aplica o shell Beta também ao detalhe |
| **Escopo** | A correção P7 original tratava `/episodes`; P11 estende somente a herança do shell a `/episodes/[slug]` |
| **Fonte autoritativa** | `cafedebug.pen` por Pencil MCP + imagem de comparação fornecida |

## Diferenças encontradas e contrato alvo

| Área | Estado encontrado | Contrato de correção | Evidência Pencil |
| --- | --- | --- | --- |
| Chrome | A listagem era descendente de `(content)`, portanto mostrava o Header/Footer fixos com `Assinar`. | P7 moveu `/episodes` para `(beta)`; P11 move também `/episodes/[slug]` para herdar o mesmo Header Beta com Search/ThemeToggle e Footer Beta, sem renderizar chrome nas páginas. | Header `M9Wiwt`, Footer `Q77OEY` |
| Largura da grade | `max-w-none` deixava as três colunas crescerem com o viewport. | Reutilizar a geometria da Homepage Beta: `max-width: 1312px`, `lg:w: calc(100vw - 8rem)`, gap 24px; em 1440, três cards de ~421.33px e 412px de altura. | Grade `Y2Tiu2`, card `FGSFI` |
| Filtros | Pills 40px, fonte mono 12px, superfícies laranja/cinza e gap 8px. | Label visual 32px, Geist 14px/500, padding 12px, gap 10px; ativo em `background` com `shadow-pencil-subtle`, inativo transparente em `muted-foreground`. | Ativo `KbyBJ`, inativo `BdBJJ` |
| Acessibilidade | Alinhar visual não pode reduzir área de toque. | Um único `Link` por filtro, `aria-current="page"`, foco tokenizado e hit target vertical de 40px sem alterar a dimensão visual de 32px. | Contrato de acessibilidade da feature |
| Seletor de ordenação | Em desktop, a largura fixa de 272px criava espaço vazio entre `Mais recentes` e o chevron. | O `details` é fluido no mobile e `fit-content` no desktop; o `summary` reproduz `FAVDG` em 231 × 50px, padding horizontal 18px e gap 8px. O chevron fica à direita somente no seletor fluido de mobile. | `FAVDG` (bounds 231 × 50; `bWM7E`, `SpHl9`, `S2JWgQ`) |
| Paginação | Pills laranja/cinza, fonte mono 12px e todos os números renderizados. | Linha centralizada com gap 8px: Previous/Next Ghost de 40px (Mono 14/500), itens 40px em Geist 14/500, ativo com background+borda+sombra e padrão transparente. Com 24 páginas: `Previous 1 2 3 4 … 24 Next`. | `9PVw5`, ativo `oT0d2`, padrão `Doslm`, elipse `Irk3I`, Ghost `Svd9t` |

## Validação necessária

- Browser em 1440, 768 e 390px: sem overflow, grade 3/2/1 colunas e cards não esticados.
- Claro e escuro: `/episodes` e `/episodes/[slug]` acompanham o ThemeToggle da Homepage Beta.
- Teclado: filtro ativo, foco visível e uma única parada de tabulação por categoria.
- Fonte: teste de rota aponta para `app/(beta)/episodes/page.tsx`; inspeção confirma ausência de
  Header/Footer na feature e nenhuma chamada `fetch(` em `app`/componentes.
- Seletor de ordenação: em desktop, largura intrínseca de 231px sem espaço residual; em mobile,
  largura útil total e chevron alinhado ao fim, sem overflow.
- Paginação: página 1, intermediária e final preservam URLs, disabled sem link, uma elipse
  decorativa e geometria 40px/8px sem os antigos pills coloridos.
