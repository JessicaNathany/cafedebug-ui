import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { inspectPlan, renderSummary } from "./validate-railway-plan.mjs";

// SavedPlan and changes mirror CLI v5.71.0 src/iac/saved_plan.rs and change_set.rs.
function plan(changes = []) {
  return {
    kind: "railway.config.plan", version: 1, cliVersion: "5.71.0",
    sourceTree: "test-tree", environmentId: "test-env", configEtag: "test-etag",
    changeSetHash: "sha256:test", destructive: false,
    changeSet: { version: 1, changes, diagnostics: [], partial: "ui", declared: ["service.web", "service.admin"] },
  };
}
const update = (address = "service.web") => ({
  kind: "resource.update", address, field: "deploy", before: {}, after: {},
  path: `resources.${address}.deploy`, summary: "Update deploy", severity: "safe", deployEffect: "deploy",
});
const create = (name = "web") => ({
  kind: "resource.create", address: `service.${name}`, resource: { type: "service", name, source: {}, build: {}, deploy: {} },
  path: `resources.service.${name}`, summary: "Create service", severity: "safe", deployEffect: "deploy",
});

test("accepts ui no-op, ownership claim, frontend creates, updates and variable sets", () => {
  const candidates = [plan(), { ...plan(), claim: true }, plan([create(), create("admin")]), plan([update(), update("service.admin")]), plan([{
    kind: "variable.set", address: "service.admin", variable: "ADMIN_COOKIE_SECURE", after: "true", severity: "safe",
  }])];
  for (const candidate of candidates) assert.equal(inspectPlan(candidate).accepted, true);
});

test("rejects backend, database and volume changes even when marked safe", () => {
  for (const address of ["service.cafedebug-backend.api", "database.cafedebugdb", "volume.mysql-volume-r-7X"]) {
    assert.equal(inspectPlan(plan([update(address)])).accepted, false);
  }
});

test("rejects every delete, destructive flag or severity, and any diagnostic", () => {
  for (const kind of ["resource.delete", "variable.delete"]) {
    assert.equal(inspectPlan(plan([{ ...update(), kind, variable: "OLD_VALUE" }])).accepted, false);
  }
  assert.equal(inspectPlan({ ...plan(), destructive: true }).accepted, false);
  assert.equal(inspectPlan(plan([{ ...update(), severity: "destructive" }])).accepted, false);
  const warning = plan();
  warning.changeSet.diagnostics.push({ severity: "warning", path: "partial", message: "Review ownership" });
  assert.equal(inspectPlan(warning).accepted, false);
});

test("fails closed on malformed and unsupported saved plans", () => {
  const invalid = [null, [], {}, { ...plan(), version: 2 }, { ...plan(), cliVersion: "5.72.0" }, { ...plan(), destructive: "false" }, { ...plan(), claim: "true" }];
  for (const key of ["kind", "version", "cliVersion", "sourceTree", "environmentId", "configEtag", "changeSetHash", "changeSet", "destructive"]) {
    const candidate = plan(); delete candidate[key]; invalid.push(candidate);
  }
  for (const key of ["version", "changes", "diagnostics", "partial", "declared"]) {
    const candidate = plan(); delete candidate.changeSet[key]; invalid.push(candidate);
  }
  for (const changes of [[null], ["text"], [{ ...update(), kind: "new.operation" }], [{ ...update(), field: "unexpected" }], [{ ...create(), resource: null }], [{ ...create(), resource: { type: "database", name: "web" } }]]) invalid.push(plan(changes));
  const duplicate = plan(); duplicate.changeSet.declared = ["service.web", "service.web"]; invalid.push(duplicate);
  const foreign = plan(); foreign.changeSet.partial = "api"; invalid.push(foreign);
  const missingAfter = update(); delete missingAfter.after; invalid.push(plan([missingAfter]));
  for (const candidate of invalid) assert.equal(inspectPlan(candidate).accepted, false, JSON.stringify(candidate));
});

test("reports include only allowlisted operations, addresses and fields, never values or arbitrary strings", () => {
  const secret = "representative-sensitive-value-123";
  const candidate = plan([
    { ...create(), summary: secret, details: [secret], resource: { ...create().resource, variables: { PASSWORD: secret }, [secret]: secret } },
    { ...update(), before: { token: secret }, after: { anything: secret }, summary: secret },
    { kind: "variable.set", address: "service.admin", variable: "ADMIN_API_BASE_URL", after: secret, before: secret, severity: "safe" },
    { ...update(), field: secret },
    { ...update(), address: secret, kind: secret },
  ]);
  candidate.diff = secret;
  candidate.sourceTree = secret;
  candidate.changeSet.diagnostics.push({ message: secret, path: secret, severity: secret });
  const report = inspectPlan(candidate);
  const emitted = `${JSON.stringify(report)}\n${renderSummary(report)}`;
  assert.equal(emitted.includes(secret), false);
  assert.match(emitted, /service.web/);
  assert.match(emitted, /variables.ADMIN_API_BASE_URL/);
  assert.match(emitted, /deploy/);
  assert.equal(report.accepted, false);
});

test("CLI writes safe artifacts and summaries before failing unsafe or invalid JSON", async () => {
  const directory = await mkdtemp(join(tmpdir(), "railway-plan-test-"));
  try {
    const input = join(directory, "raw.json");
    const output = join(directory, "review.json");
    const summary = join(directory, "summary.md");
    for (const raw of [JSON.stringify(plan([update("database.cafedebugdb")])), "{ invalid SECRET"] ) {
      await writeFile(input, raw);
      const result = spawnSync(process.execPath, ["infra/scripts/validate-railway-plan.mjs", input, output, summary], { encoding: "utf8" });
      assert.equal(result.status, 1);
      assert.equal(JSON.parse(await readFile(output, "utf8")).accepted, false);
      assert.match(await readFile(summary, "utf8"), /rejected/);
      assert.equal(`${result.stdout}${result.stderr}${await readFile(output)}${await readFile(summary)}`.includes("SECRET"), false);
    }
    await writeFile(input, JSON.stringify(plan()));
    assert.equal(spawnSync(process.execPath, ["infra/scripts/validate-railway-plan.mjs", input, output, summary]).status, 0);
    assert.equal(spawnSync(process.execPath, ["infra/scripts/redact-railway-plan.mjs", input, output]).status, 0);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
