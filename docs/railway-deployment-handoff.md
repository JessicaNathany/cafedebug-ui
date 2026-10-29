# Jessica: publicar Website e Backoffice no Railway

**Destino:** projeto `cafedebug-backend.api-railway`, ambiente `production`.
**Código:** `JessicaNathany/cafedebug-ui`, branch `main`.

Serão publicados `web` e `admin`, usando domínios temporários do Railway. API, banco e `cafedebug.com.br` ficam fora desta alteração.

## 1. Preparar o GitHub

- [ ] Fazer merge do [PR de infraestrutura #25](https://github.com/JessicaNathany/cafedebug-ui/pull/25) e aguardar `application-gate` passar em `main`.
- [ ] Abrir **Settings → Environments → production**. Permitir somente `main` e configurar Jessica como revisora, se o plano GitHub permitir.
- [ ] No Railway, criar um token de projeto para o ambiente `production` e cadastrá-lo no GitHub:

| Onde | Tipo | Nome | Valor |
| --- | --- | --- | --- |
| GitHub → ambiente `production` | Secret | `RAILWAY_TOKEN` | Token do projeto Railway para `production` |

## 2. Revisar e aplicar a infraestrutura

- [ ] No GitHub, executar **Actions → Railway IaC Plan → Run workflow → main**. O resultado deve ser aprovado e afetar somente `web` e `admin`.
- [ ] Em um checkout limpo do mesmo commit de `main`, executar com Node 22 e pnpm 12.15.0:

```bash
npm install --global @railway/cli@5.71.0
pnpm install --frozen-lockfile
railway login
railway link --project 8bbaed6f-c14a-400b-b2a6-e4c332c31ed7 --environment production
railway config partials list --json
```

Se `web` e `admin` estiverem ausentes, sem proprietário ou pertencendo a `ui`, continuar. Se pertencerem a outro partial, seguir o [procedimento de transferência](../.railway/README.md#safe-first-apply-operator-only) antes de continuar.

```bash
railway config plan --environment production --out railway-plan.raw.json
node infra/scripts/validate-railway-plan.mjs railway-plan.raw.json railway-plan.json
```

- [ ] Somente após o validador passar, executar o comando abaixo e conferir sua prévia antes de confirmar. Parar se houver alteração fora dos dois frontends, exclusão ou diagnóstico.

```bash
railway config apply --environment production
```

## 3. Configurar os domínios e conferir as variáveis

No Railway, abrir cada serviço → **Settings → Networking → Generate Domain**.

A IaC configura estas variáveis. Conferir em **Variables**:

| Serviço | Nome | Valor esperado |
| --- | --- | --- |
| `web` | `NEXT_PUBLIC_SITE_URL` | `https://${{RAILWAY_PUBLIC_DOMAIN}}` |
| `admin` | `ADMIN_API_BASE_URL` | Referência ao domínio privado da API; deve resolver para `http://cafedebug-backendapi.railway.internal:8080` — confirmar no projeto |
| `admin` | `ADMIN_COOKIE_SECURE` | `true` |
| `admin` | `ADMIN_COOKIE_SAMESITE` | `Lax` |

Deixar `ADMIN_COOKIE_DOMAIN` ausente. Railway fornece `PORT` automaticamente.

**Após gerar o domínio do website, executar um novo deploy de `web` se o primeiro build já começou.** A URL precisa estar disponível durante o build.

## 4. Confirmar o deploy

- [ ] Conferir automatic deploys e **Wait for CI** nos dois serviços, com branch `main`.
- [ ] Aguardar os deployments saudáveis e abrir as duas URLs HTTPS.

| Serviço | Dockerfile | Contexto | Health check |
| --- | --- | --- | --- |
| `web` | `infra/docker/web/Dockerfile` | Raiz do repositório | `/api/health` |
| `admin` | `infra/docker/admin/Dockerfile` | Raiz do repositório | `/api/health` |

O health check do admin só passa quando ele consegue acessar a API pela rede privada.

## 5. Validar a publicação

Adicionar em **GitHub → Settings → Environments → production → Variables**:

| Nome | Valor |
| --- | --- |
| `WEB_BASE_URL` | URL HTTPS gerada para `web`, sem barra final |
| `ADMIN_BASE_URL` | URL HTTPS gerada para `admin`, sem barra final |
| `API_PUBLIC_BASE_URL` | URL HTTPS pública da API, sem barra final e sem `/health/ready` |

- [ ] Executar **Actions → Production Smoke → Run workflow → main** e confirmar sucesso. Ele verifica saúde, URLs do website e bloqueio de indexação do admin.
- [ ] Fazer login no admin e consultar um conteúdo existente.
- [ ] Registrar URLs, IDs dos serviços/deployments, commit publicado e resultados em [workflow-state.md](../.specs/platform/railway-production-deployment/workflow-state.md).

## Se algo falhar

No serviço afetado, abrir **Deployments** e restaurar o último deployment bem-sucedido. Se for o primeiro deploy, corrigir a falha e publicar novamente.

Para desfazer infraestrutura, revisar ownership e gerar outro plano; não restaurar o antigo arquivo de projeto completo apenas com `git revert`.
