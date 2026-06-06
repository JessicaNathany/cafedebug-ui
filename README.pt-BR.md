# Plataforma Cafe Debug

![image](https://user-images.githubusercontent.com/11943572/234849730-c6b41618-6c13-4a87-9b5e-5b9d16ba4474.png)

🚧  Projeto 🚀 em construção (com café e bugs)...  ☕💻🚧

Este repositório é o espaço de planejamento e fundação para o esforço de modernização do Cafe Debug.

Cafe Debug é um projeto de podcast e comunidade sobre desenvolvimento de software, arquitetura de software, vida de desenvolvedor, gerenciamento de projetos e engenharia de software. O estado alvo para este repositório é um monorepo público que contém:

- o site público
- o backoffice administrativo  
- a API REST .NET

## Status

O repositório está atualmente na fase de arquitetura e definição de projeto. O primeiro objetivo é documentar uma base sólida antes de estruturar o código.

## Contexto Atual

O plano de modernização é baseado nos assets públicos e repositórios atuais:

- site ao vivo: `https://cafedebug.com.br`
- frontend legado: [`JessicaNathany/cafedebug.legacy`](https://github.com/JessicaNathany/cafedebug.legacy)
- API backend: [`JessicaNathany/cafedebug-backend.api`](https://github.com/JessicaNathany/cafedebug-backend.api)

O que confirmamos dessas fontes:

- o site atual é um website ASP.NET Core legado com Bootstrap, jQuery, Owl Carousel e SCSS customizado
- a marca pública é construída em torno de um cabeçalho/rodapé escuro e acentos laranja quentes
- o backend já expõe preocupações públicas/administrativas para episódios, banners, imagens, auth, categorias, membros da equipe e usuários
- o site público é sensível ao SEO porque é orientado por conteúdo e as páginas de episódios precisam ser descobríveis

## Objetivos do Produto

- modernizar o site sem perder a identidade reconhecível do CafeDebug
- criar um aplicativo administrativo separado para episódios, banners, mídia e conteúdo relacionado
- manter o site responsivo em mobile e desktop
- suportar temas white-label para cores, logo e variações futuras da marca
- integrar com a API REST existente em vez de reconstruir o gerenciamento de conteúdo do zero
- manter SEO, analytics, testes e arquitetura limpa como preocupações de primeira classe
- manter o repositório amigável ao open-source e fácil de contribuir

## Decisão de Stack Tecnológica

| Área | Decisão | Notas |
| --- | --- | --- |
| Monorepo | `pnpm` workspaces + `Turborepo` | Ótimo ajuste para os dois apps Next.js e pacotes compartilhados. A API .NET pode viver no mesmo repo sob `services/api` com seu próprio ciclo de vida. |
| Website | `Next.js` App Router + `TypeScript` | Server Components primeiro, ISR/SSG para páginas de conteúdo, suporte SEO moderno. |
| Admin | `Next.js` App Router + `TypeScript` | App separado com fluxos de trabalho CRUD autenticados. |
| Estilização | `Tailwind CSS v4` + variáveis CSS | Melhor ajuste para tokens de design white-label e temas compartilhados. |
| Componentes | `shadcn/ui` + primitivos customizados | Usar como camada base, não como identidade visual. |
| Contrato de API | `Orval` (cliente fetch) | Gerar funções de endpoint da API tipadas e modelos a partir da saída Swagger/OpenAPI do backend. |
| Busca de dados | `fetch` do servidor por padrão no website, `TanStack Query` em admin/fluxos pesados do cliente | Manter o site público SEO-primeiro e o admin produtividade-primeiro. |
| Formulários | `React Hook Form` + `Zod` | DX forte para formulários administrativos e validação. |
| Testes | `Vitest`, `React Testing Library`, `Playwright`, `MSW` | Cobertura unitária, de componente, e2e e mock de API. |
| Qualidade | `ESLint`, `Prettier`, `Husky`, `lint-staged`, `commitlint` | Bons padrões para um repo open-source. |
| Contêineres | `Dockerfile` multi-estágio por app | Manter deployment consistente entre apps. |
| Hospedagem | AWS EC2 + stack Docker Swarm + proxy reverso | Proxy recomendado: `Traefik` para roteamento multi-serviço no Swarm. |

## Princípios de Arquitetura

- Páginas do site público devem ser renderizadas no servidor por padrão.
- SEO é parte da definição da rota, não uma reflexão tardia.
- O app administrativo deve otimizar para operações de conteúdo e fluxos de trabalho autenticados.
- Lógica compartilhada deve viver em pacotes, não ser copiada entre apps.
- Contratos de API devem ser gerados a partir do Swagger, não escritos à mão duas vezes.
- A identidade visual deve vir de tokens e configuração de tema, nunca de cores hardcoded espalhadas pelos componentes.
- Trabalho não trivial deve começar com uma especificação antes da implementação.

## Estrutura Alvo do Monorepo

```text
apps/
  web/                    # Site público
  admin/                  # Backoffice administrativo

packages/
  ui/                     # Componentes compartilhados e primitivos
  api-client/             # Tipos de API gerados + cliente fetch
  design-tokens/          # Tokens da marca, CSS de tema, metadados de logos
  config/                 # Configuração de runtime compartilhada site/admin
  eslint-config/          # Configuração de lint compartilhada
  tsconfig/               # Configuração TS compartilhada

infra/
  docker/                 # Dockerfiles e helpers de compose local
  swarm/                  # Manifestos de deploy do stack Docker
  scripts/                # Scripts de build/deploy/ops

docs/
  CONTRIBUTING.md
  design-system.md

.specs/
  README.md
  web/
  admin/

.github/
  copilot-instructions.md

AGENTS.md
README.md
```

## Formato de Pasta a Nível de App

Dentro de cada app Next.js, preferir estrutura baseada em feature com limites de domínio rigorosos:

```text
src/
  app/                    # Rotas, layouts, metadados, manipuladores de rota
  features/
    <domain>/
      components/
      hooks/
      services/
      server/
      schemas/
      types/
  lib/                    # Utilitários, adaptadores, helpers de config
```

Manter primitivos de design reutilizáveis em `packages/ui`, não duplicados em ambos os apps. Para restrições de implementação e anti-padrões, veja `.github/copilot-instructions.md`.

## Direção de Modernização do Website

O novo site deve preservar a sensação reconhecível do CafeDebug enquanto moderniza a UI:

- manter o cabeçalho/rodapé escuro e os acentos da marca laranja quente
- manter seções principais como banners, episódios mais recentes, equipe e contato/comunidade
- substituir interações pesadas de carrossel frágeis por layouts responsivos acessíveis quando possível
- melhorar espaçamento, hierarquia tipográfica e navegação mobile
- tornar a descoberta de episódios mais fácil com filtros mais fortes, cards e links internos
- preparar o layout para que banners e placements de patrocínio pareçam intencionais, não anexados

## Regras do Design System

- nunca hardcodar valores visuais em componentes de feature; use tokens de `packages/design-tokens`
- preservar o cabeçalho/rodapé escuro e paleta de acentos laranja quente a menos que os tokens de design sejam intencionalmente atualizados
- preferir primitivos de `packages/ui` antes de criar novos componentes a nível de feature
- modernizar via espaçamento, hierarquia, acessibilidade e responsividade preservando a identidade da marca

Para imposição a nível de execução e anti-padrões, use `.github/copilot-instructions.md`.
Para referências de implementação visual admin, use `.specs/admin/DESIGN_SYSTEM.md` e `.specs/admin/stitch/cafedebug-admin/*`.

## Estratégia White-Label

O suporte white-label deve ser baseado em configuração, não ramificação:

- tokens da marca em `packages/design-tokens`
- logo e metadados do site em um arquivo de configuração da marca
- aliases de tema Tailwind que resolvem para variáveis CSS
- nenhum componente do app deve hardcodar uma cor específica do CafeDebug ou caminho de logo

## Escopo do Website e Admin

### Site público

- página inicial
- listagem de episódios
- detalhes do episódio
- páginas da equipe/comunidade
- banners e placements de patrocínio
- metadados SEO, Open Graph, sitemap, robots, analytics

### Backoffice administrativo

- login/autenticação
- CRUD de episódio
- CRUD de banner
- gerenciamento de membros da equipe/conteúdo
- upload de imagem/mídia
- gerenciamento de categoria e conteúdo de suporte

## Estratégia de Conteúdo e API

O backend já separa controladores públicos e administrativos. Isso nos dá uma divisão limpa de frontend:

- `apps/web` consome apenas endpoints públicos
- `apps/admin` consome endpoints administrativos e fluxos autenticados
- `packages/api-client` torna-se o cliente tipado único compartilhado por ambos os apps

Como a API já expõe Swagger/OpenAPI, gere tipos de cliente a partir do contrato em vez de manter tipos de request/response manuais nos frontends.

### Contexto de Endpoint (de `.specs/admin/backend-openspec-api.json`)

Use essa divisão como limite de API padrão entre apps frontend:

- `apps/admin`: backoffice autenticado e fluxos de conta administrativa
- `apps/web`: fluxos públicos somente leitura do website

Para o catálogo de endpoints atual, veja `.specs/admin/backend-openspec-api.json`.

## SEO e Analytics

Para o site público:

- use a API de Metadados do Next.js para título da página, descrição, Open Graph e URLs canônicas
- gere `sitemap.xml` e `robots.txt`
- adicione dados estruturados para páginas de podcast e episódio onde útil
- conecte Google Analytics ou Google Tag Manager através de configuração orientada por ambiente

Analytics devem permanecer opcionais por ambiente para que deployments locais e de preview permaneçam limpos.

## Direção de Deployment

Alvo de produção:

- AWS EC2
- stack Docker Swarm
- um serviço de proxy reverso
- um serviço para `web`
- um serviço para `admin`
- um serviço para `api`

Abordagem recomendada:

- desenvolvimento local com Docker Compose apenas onde útil
- builds Docker multi-estágio para cada app
- GitHub Actions para CI, build de imagem e deployment
- variáveis de ambiente gerenciadas por serviço

### Executar `apps/admin` na Sua Máquina

Use esta seção quando quiser executar o app administrativo localmente como contribuidor.

#### Pré-requisitos

- Node.js `>= 20`
- pnpm `>= 10`
- uma API backend em execução acessível por `ADMIN_API_BASE_URL` (padrão `http://localhost:8080`)

**Instalando o pnpm:**

Se você não tem o pnpm instalado globalmente, instale-o primeiro:

```bash
npm install -g pnpm
```

Em seguida, verifique a instalação:

```bash
pnpm --version
```

#### 1. Instalar dependências

Da raiz do repositório:

```bash
pnpm install
```

#### 2. Criar seu arquivo de ambiente local

Da raiz do repositório:

```bash
cp .env.example .env
```

Se você executar admin diretamente no host (`pnpm --filter @cafedebug/admin dev`), também crie um arquivo env local do app:

```bash
cp .env.example apps/admin/.env.local
```

Por que isso é necessário:

- Docker Compose lê o `.env` da raiz.
- Next.js executado no host lê `apps/admin/.env.local` (diretório do app).

Então confirme esses valores no `.env` para desenvolvimento local:

- `ADMIN_PORT=3010`
- `ADMIN_PUBLIC_URL=http://localhost:3010`
- `ADMIN_API_BASE_URL=http://localhost:8080`
- `ADMIN_COOKIE_DOMAIN=localhost`
- `ADMIN_COOKIE_SAMESITE=Lax`
- `ADMIN_COOKIE_SECURE=false`

Notas:

- Se sua API executa em outra porta/host, mude `ADMIN_API_BASE_URL`.
- Exemplo para API .NET HTTPS local: `ADMIN_API_BASE_URL=https://localhost:7211`
- `ADMIN_API_BASE_URL_DOCKER` é apenas para execuções baseadas em Docker.

#### 3. Iniciar admin diretamente no host (recomendado para codificação diária)

Da raiz do repositório:

```bash
pnpm --filter @cafedebug/admin dev
```

Abra `http://localhost:3001`.

**Notas de Plataforma:**
- **macOS/Linux:** Funciona com a sintaxe original de variável de ambiente
- **Windows:** Usa `cross-env` para compatibilidade cross-platform (instalado automaticamente com `pnpm install`)

**Por que `3001`?**

- O script do app é `next dev --port 3001` em `apps/admin/package.json`.
- `ADMIN_PORT` é usado pelo mapeamento do Docker Compose, não por esse comando do host.

#### 4. Alternativa: iniciar todos os apps no monorepo

Da raiz do repositório:

```bash
pnpm dev
```

Isso executa todos os scripts `dev` do workspace em paralelo via Turborepo.

#### 5. Executar admin no Docker (se você preferir dev local containerizado)

Da raiz do repositório:

```bash
pnpm docker:admin:config
pnpm docker:admin:dev
```

Abra `http://localhost:${ADMIN_PORT}` (padrão `http://localhost:3010`).

Para parar:

```bash
pnpm docker:admin:down
```

### Estratégia Docker Local + Produção do Admin

A estratégia Docker do app administrativo vive sob `infra/docker` e segue uma divisão dev/prod:

- `infra/docker/admin/Dockerfile`
  - estágio `dev`: desenvolvimento local com workspace montado com hot reload
  - estágio `production`: imagem de runtime imutável (`pnpm start`)
- `infra/docker/docker-compose.admin.yml`
  - fluxo de trabalho compose local apenas para admin
  - ponte de env host/container e mapeamento de porta previsível

#### Fluxo de trabalho local

1. Copiar contrato env:
   - `cp .env.example .env`
2. Validar configuração compose:
   - `pnpm docker:admin:config`
3. Iniciar container dev admin:
   - `pnpm docker:admin:dev`
4. Parar:
   - `pnpm docker:admin:down`

#### Build de sanidade de imagem de produção

- `pnpm docker:admin:build`

Este comando constrói o alvo de produção do Dockerfile multi-estágio sem executar um container.

#### Contrato de ambiente (focado em admin)

Use `.env.example` como fonte da verdade para variáveis relacionadas ao admin:

- `ADMIN_PORT` / `ADMIN_CONTAINER_PORT`: portas host/container e prevenção de colisão
- `ADMIN_PUBLIC_URL`: origem admin voltada ao navegador
- `ADMIN_API_BASE_URL`: URL da API executada no host
- `ADMIN_API_BASE_URL_DOCKER`: URL da API executada no container (padrão `host.docker.internal`)
- dicas de cookie/sessão:
  - `ADMIN_COOKIE_DOMAIN`
  - `ADMIN_COOKIE_SAMESITE`
  - `ADMIN_COOKIE_SECURE`

Expectativas dev vs prod:

- **Desenvolvimento (Compose):**
  - fonte montada + hot reload
  - instala dependências dentro do container na primeira inicialização se o volume `/app/node_modules` estiver vazio
  - servidor Next dev vincula `0.0.0.0:${ADMIN_CONTAINER_PORT}` dentro do container e é publicado em `localhost:${ADMIN_PORT}`
  - configurações de cookie locais permissivas são esperadas (geralmente `Secure=false` sobre HTTP)
- **Produção (imagem/runtime):**
  - sistema de arquivos de container imutável e comando de inicialização
  - runtime Next vincula `0.0.0.0:${PORT}` (padrão 3000), sem montagem de bind de fonte
  - configurações de cookie devem ser enrijecidas para deployments HTTPS (`Secure=true`, `SameSite` apropriado, alinhamento de domínio/caminho)
  - ambiente de runtime deve ser injetado pela plataforma de deployment, não assado em camadas de imagem

## Geração de Código e Coordenação Multi-Agente

Este projeto deve ser amigável à IA sem se tornar dependente de IA.

1. [AGENTS.md](./AGENTS.md) define governança, ciclo de vida e regras de handoff.
2. [.github/copilot-instructions.md](./.github/copilot-instructions.md) define restrições de codificação executáveis.
3. [.specs/README.md](./.specs/README.md) define o fluxo de trabalho orientado por spec e entregáveis necessários.

## Portões de Validação (Raiz + CI)

Use os comandos de validação da raiz antes do merge e no CI:

- `pnpm gate:contract` → verifica se o cliente gerado OpenAPI está atualizado (`orval --config orval.config.ts`)
- `pnpm gate:quality` → executa `lint`, `typecheck` e `build`
- `pnpm gate:states` → executa verificações de cobertura de estados loading/empty/error do admin
- `pnpm gate:validation` (ou `pnpm ci:validation`) → executa todos os portões em ordem

## Plano Faseado

1. Fundação
   - finalizar estrutura do repo
   - estruturar raiz do monorepo
   - criar pacotes compartilhados de lint, TypeScript e tokens de design

2. Admin V1
   - implementar login, CRUD de episódios, CRUD de banners, upload de mídia
   - integrar endpoints de API autenticados

3. Website V1
   - implementar shell, página inicial, listagem de episódio, detalhe do episódio, SEO, analytics
   - integrar endpoints de API públicos

4. Consolidação da Plataforma
   - mover ou espelhar o backend para `services/api`
   - finalizar fluxo de deployment e CI/CD compartilhado

5. Enrijecimento de Produção
   - testes, observabilidade, passes de performance e automação de deployment

## Referências

- site ao vivo: `https://cafedebug.com.br`
- repo legado: `https://github.com/JessicaNathany/cafedebug.legacy`
- repo backend: `https://github.com/JessicaNathany/cafedebug-backend.api`