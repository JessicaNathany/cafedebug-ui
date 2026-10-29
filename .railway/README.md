# Railway UI infrastructure

This repository owns only `web` and `admin` through the stable named partial `ui` in `.railway/railway.ts`. API, MySQL, volumes and backend variables are external resources. Admin references the existing private API endpoint without declaring its service.

## Pinned tools and checks

Use Node 22, pnpm 12.15.0, Railway CLI **5.71.0**, and SDK **3.16.0** (installed by the frozen workspace install):

```bash
npm install --global @railway/cli@5.71.0
pnpm install --frozen-lockfile
pnpm ci:iac
railway login
railway link --project 8bbaed6f-c14a-400b-b2a6-e4c332c31ed7 --environment production
railway config partials list --json
railway config plan --environment production --out railway-plan.raw.json
node infra/scripts/validate-railway-plan.mjs railway-plan.raw.json railway-plan.json railway-plan-summary.md
```

The partial is selected by the file export, not a CLI `--partial` flag. Do not use whole-project `config pull` to overwrite this file. Treat raw plans and ownership inventories as local sensitive operational files; never commit or upload them.

## Safe first apply (operator only)

1. Inspect ownership with `railway config partials list --json`; record the configuration etag and frontend addresses. If neither service exists or they are unowned, the first reviewed UI apply claims them. If already owned by `ui`, no transfer is needed.
2. If a frontend belongs to another partial, transfer only its exact address. For example, replace `OLD_OWNER` and `ETAG` with the recorded values:

   ```bash
   railway config partials transfer OLD_OWNER ui --resource service.web --dry-run
   railway config partials transfer OLD_OWNER ui --resource service.web --base-config-etag ETAG
   ```

   Repeat for admin with a fresh inventory/etag if necessary. Transfer requires environment ADMIN access. Never omit `--resource`; never move API, database, or volumes. A stale etag requires a new inventory and preview.
3. Coordinate updates to previous authoring configurations before any later apply; once named partials exist, other configurations targeting the environment must also use named partials. This PR does not modify the backend repository.
4. Generate a fresh plan after ownership changes and run the repository validator. Accept only intended frontend creates/updates with zero diagnostics, deletions, or destructive changes. Verify the admin reference uses the actual API service name and resolves to the existing private endpoint before applying; current expected URL is `http://cafedebug-backendapi.railway.internal:8080`.
5. Apply manually with `railway config apply --environment production`, reviewing its fresh preview. Then follow [Jessica's deployment checklist](../docs/railway-deployment-handoff.md) for domains, build-time website URL, deployment and smoke.

Ownership transfer changes metadata only; ordinary apply is a separate operation. No live transfer, apply, deployment or variable mutation is part of the implementation PR. Live planning remains pending until authentication is restored.

## Workflow responsibilities

- `application-gate` validates the UI graph, plan safety and workflows alongside existing application checks. PR workflows receive no Railway token.
- `Railway IaC Plan` runs only from `main`, uses the protected `production` environment's project token, and validates the pinned plan before publishing an allowlisted artifact for 14 days. Review output includes operation, resource address and field names, never values or textual diffs. It never applies or changes ownership.
- Manual `Production Smoke` uses the three public URL environment variables and no Railway credential. Human login/read-only acceptance remains required.

Keep one always-on replica per frontend in `ams`, private admin-to-API traffic, secure host-only cookies, and no frontend volumes or database credentials.

## Rollback

Application rollback selects the previous successful deployment of the affected frontend. An IaC rollback needs a fresh plan and ownership review. Restoring the former whole-project file with a Git revert alone is unsafe: it can conflict with named ownership or propose changes to resources outside this repository.
