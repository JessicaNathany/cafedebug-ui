# Deploy do Website e Backoffice no Railway

Checklist para Jessica configurar e publicar os dois frontends no ambiente de produção de pré-lançamento.

## Escopo

| Item | Configuração |
| --- | --- |
| Repositório | `JessicaNathany/cafedebug-ui` |
| Branch | `main` |
| Projeto Railway | `cafedebug-backend.api-railway` |
| ID do projeto | `8bbaed6f-c14a-400b-b2a6-e4c332c31ed7` |
| Ambiente | `production` |
| Novos serviços | `web` e `admin` |
| Capacidade inicial | Uma réplica por frontend, sempre ativa, na região atual da API (`ams`, a confirmar no plano) |

O website continua usando fixtures. Este deploy não inclui alterações na API, MySQL, volumes, migrações ou DNS de `cafedebug.com.br`. Os frontends usarão domínios HTTPS temporários do Railway.

## 1. Concluir a revisão da infraestrutura

Esta revisão implementa o partial `ui`. Antes de aplicar, revisar o PR e executar o procedimento de ownership:

- [ ] Confirmar o partial `ui`, responsável somente por `web` e `admin`.
- [ ] Executar `railway config partials list --json`; serviços ausentes/sem owner são assumidos no primeiro apply. Se pertencem a outro partial, transferir somente `service.web`/`service.admin`, com dry-run e etag, conforme [.railway/README.md](../.railway/README.md).
- [ ] Declarar `branch: "main"` nas duas fontes GitHub.
- [ ] Fazer o workflow rejeitar alterações em recursos fora de `web` e `admin`.
- [ ] Revisar e fazer merge desses ajustes.

**Não remover simplesmente API, banco e volumes da configuração atual:** em uma configuração que gerencia o projeto inteiro, omitir recursos pode representar exclusão. A migração deve produzir um plano sem alterações indesejadas.

Referência: [Railway IaC para múltiplos repositórios](https://docs.railway.com/infrastructure-as-code#multi-repo-projects).

## 2. Configurar o ambiente no GitHub

No repositório, abrir **Settings → Environments → production**.

- [ ] Permitir somente a branch `main`.
- [ ] Configurar Jessica como revisora obrigatória, conforme disponibilidade do plano GitHub.
- [ ] Adicionar o secret abaixo ao ambiente `production`.

| Tipo | Nome | Valor |
| --- | --- | --- |
| Environment secret | `RAILWAY_TOKEN` | Token de projeto Railway para o projeto existente e ambiente `production` |

Criar o token nas configurações do projeto Railway, selecionando o ambiente correto. Não enviar seu valor por mensagem nem incluí-lo no código.

Depois de gerar os domínios no Railway, adicionar também:

| Tipo | Nome | Valor |
| --- | --- | --- |
| Environment variable | `WEB_BASE_URL` | URL HTTPS do website, sem barra final |
| Environment variable | `ADMIN_BASE_URL` | URL HTTPS do backoffice, sem barra final |
| Environment variable | `API_PUBLIC_BASE_URL` | URL HTTPS pública atual da API, sem barra final e sem `/health/ready` |

Essas três URLs são utilizadas pelo workflow manual **Production Smoke**. O token é utilizado somente pelo **Railway IaC Plan**.

## 3. Gerar e revisar o plano

- [ ] Confirmar que o `application-gate` passou no commit de `main` escolhido.
- [ ] Em **Actions → Railway IaC Plan → Run workflow**, selecionar `main`.
- [ ] Aprovar a execução do ambiente, quando solicitado.
- [ ] Revisar o resumo e o artefato do plano.
- [ ] Confirmar ausência de diagnósticos, exclusões, alterações destrutivas e mudanças em API, banco ou volumes.

Para aplicar localmente, usar um checkout limpo do mesmo commit e as versões de CLI/SDK definidas pelo projeto:

```bash
npm install --global @railway/cli@5.71.0
pnpm install --frozen-lockfile
railway login
railway link --project 8bbaed6f-c14a-400b-b2a6-e4c332c31ed7 --environment production
railway config partials list --json
# Revisar ownership e transferir apenas os frontends, se necessário, antes de continuar.
railway config plan --environment production --out railway-plan.raw.json
node infra/scripts/validate-railway-plan.mjs railway-plan.raw.json railway-plan.json
railway config apply --environment production
```

Revisar novamente o plano local antes de confirmar o apply. Se o estado remoto mudou, revisar o novo plano. Os workflows existentes não executam `apply`.

## 4. Gerar domínios e conferir variáveis no Railway

Após criar os serviços, abrir **Settings → Networking → Generate Domain** em cada frontend. Registrar as duas URLs HTTPS.

Conferir as variáveis abaixo; elas devem ser declaradas pela IaC:

| Serviço | Variável | Valor |
| --- | --- | --- |
| `web` | `NEXT_PUBLIC_SITE_URL` | `https://${{RAILWAY_PUBLIC_DOMAIN}}` |
| `admin` | `ADMIN_API_BASE_URL` | Referência ao domínio privado do serviço API, com protocolo `http` e porta `8080` |
| `admin` | `ADMIN_COOKIE_SECURE` | `true` |
| `admin` | `ADMIN_COOKIE_SAMESITE` | `Lax` |

A URL privada esperada atualmente é `http://cafedebug-backendapi.railway.internal:8080`. Confirmar o nome real do serviço e a resolução da referência no Railway; o identificador usado na referência deve corresponder ao serviço API.

- Deixar `ADMIN_COOKIE_DOMAIN` ausente para cookies restritos ao host do backoffice.
- Railway fornece `PORT` automaticamente.
- Os frontends não recebem credenciais do banco.
- O website não precisa de URL da API nesta fase.

**O domínio do website precisa estar disponível durante o build**, porque `NEXT_PUBLIC_SITE_URL` é consumida nessa etapa. Se um build começou antes da criação do domínio, executar um novo deploy após a variável resolver corretamente.

Referência: [Domínios Railway](https://docs.railway.com/networking/domains/working-with-domains).

## 5. Conferir e executar o deploy

| Configuração | `web` | `admin` |
| --- | --- | --- |
| Repositório | `JessicaNathany/cafedebug-ui` | `JessicaNathany/cafedebug-ui` |
| Branch | `main` | `main` |
| Contexto do build | Raiz do repositório | Raiz do repositório |
| Dockerfile | `infra/docker/web/Dockerfile` | `infra/docker/admin/Dockerfile` |
| Health check | `/api/health` | `/api/health` |
| Timeout do health check | 120 segundos | 120 segundos |
| Réplicas | 1 | 1 |
| App Sleep | Desativado | Desativado |
| Restart policy | `ON_FAILURE` | `ON_FAILURE` |
| Overlap / draining | 20 / 30 segundos | 20 / 30 segundos |

- [ ] Confirmar automatic deploys e **Wait for CI** nos dois serviços.
- [ ] Confirmar os watch paths definidos pela IaC.
- [ ] Publicar o commit escolhido e acompanhar os logs de build e runtime.
- [ ] Confirmar que os dois serviços estão saudáveis.

O health check do admin retorna sucesso somente quando consegue acessar a prontidão da API pela rede privada. Uma réplica é suficiente para a fase inicial, mas não oferece alta disponibilidade.

## 6. Validar a publicação

- [ ] Preencher as três variáveis de URL no ambiente GitHub `production`.
- [ ] Executar **Actions → Production Smoke → Run workflow**, na branch `main`.
- [ ] Confirmar saúde do website e admin, com `Cache-Control: no-store`.
- [ ] Confirmar sitemap, robots e canonical de `/about` com o domínio do website.
- [ ] Confirmar bloqueio de indexação do admin.
- [ ] Confirmar `/health/ready` da API.
- [ ] Fazer um login autorizado no admin e uma operação de consulta de conteúdo.

O login e a consulta são verificações humanas; não são realizados pelo workflow de smoke.

## Registro da publicação

| Campo | Valor a preencher |
| --- | --- |
| Data e responsável | |
| Commit publicado | |
| ID do serviço `web` | |
| URL do website | |
| ID do deployment `web` | |
| ID do serviço `admin` | |
| URL do backoffice | |
| ID do deployment `admin` | |
| URL pública da API | |
| Link do Railway IaC Plan | |
| Link do Production Smoke | |
| Resultado do login e consulta | |

## Rollback e próximos deploys

Se um frontend apresentar problema, abrir seu histórico de deployments no Railway e restaurar o último deployment bem-sucedido. No primeiro deploy, pode não existir uma versão anterior; corrigir a falha e publicar novamente. Alterações de infraestrutura exigem revisão e um novo plano, mesmo quando há rollback da aplicação.

Depois da configuração inicial, merges em `main` passam pelo CI e acionam os deploys automáticos do Railway quando os watch paths correspondem às alterações. Mudanças de infraestrutura continuam exigindo plano revisado e apply manual.

Após sete dias de uso, revisar métricas de CPU, memória e custo antes de definir limites de recursos.

### Evidência pendente e rollback de infraestrutura

A CLI anterior 5.57.6 não oferece os comandos de ownership. Usar CLI 5.71.0 / SDK 3.16.0. A validação remota do novo partial depende de restaurar a autenticação Railway; os planos históricos do projeto completo não comprovam esta revisão. Não fazer commit de planos brutos ou inventários. Um rollback de IaC exige nova revisão de ownership e plano; reverter o Git para o antigo arquivo de projeto completo não é suficiente nem seguro.
