# Railway configuration

This project defines its Railway infrastructure in code.

```txt
.railway/railway.ts
```

Use this file to describe the Railway project you want: services, databases, buckets, custom domains, replicas, groups, and environment variables.

The TypeScript file imports `railway/iac`. Install the SDK from the repository root:

```bash
pnpm add --save-dev --workspace-root railway
```

## Common commands

Create the configuration files:

```bash
railway config init
```

Import an existing Railway project into code:

```bash
railway config pull
```

Preview what Railway would change:

```bash
railway config plan
```

Apply the planned changes:

```bash
railway config apply
```

## Notes

- `railway config plan` is safe and does not change Railway.
- `railway config apply` previews changes and asks before applying unless you pass `--yes`.
- Destructive changes in non-interactive or agent sessions require `railway config apply --confirm-destructive` after reviewing the plan.
- GitHub Actions never applies this configuration, redeploys a service, or mutates service variables. The trusted `Railway IaC Plan` workflow only links the existing production project and writes a redacted `railway config plan --out` artifact after `main` changes. A human reviews a safe, non-destructive plan before any local or Railway-console apply.
- The `RAILWAY_TOKEN` used by that plan workflow is a project-scoped secret in the protected GitHub `production` environment. It must not be added to repository secrets, exposed to pull-request workflows, or used by the `Production Smoke` workflow.
- `Production Smoke` is manual-only, has no Railway credential, and reads the three public base URLs from protected-environment variables. It proves public health and SEO contracts after Railway has deployed a trusted `main` commit.
- Services already managed by `railway.json` must be migrated before `.railway/railway.ts` can manage them.
- Keep one `.railway` file for the whole project. A named `export const partial` (or `PARTIAL` / `const Partial`) is a last resort for separate repos that cannot share that file. Do not add it unless omit=delete across repos is a blocker.
- The imported API, database, and volume definitions are managed as preserved state. A plan containing their deletion is a stop condition, never an apply candidate.
- `web` and `admin` are single-replica, persistent production services in `ams`; `admin` reaches the API through private networking and neither frontend receives database credentials.
- Use `replicas` for scaling; advanced placement can still specify region names.
- Use `group("Name", [resources])` to keep large projects organized on the Railway canvas.
- Secrets imported from Railway are rendered as `preserve()` so existing values are retained without writing secret values to source. Use `railway config pull --omit-preserved-variables` for a smaller import. `railway config pull --include-variables` decrypts and inlines non-sealed values (including secrets that were never sealed).
- `railway config migrate` finds every `railway.json` / `railway.toml` in the repository and writes them into this one file.
