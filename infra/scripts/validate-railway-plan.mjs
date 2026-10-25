import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

// Schema: railwayapp/cli v5.71.0 src/iac/{saved_plan,change_set}.rs.
// Reports copy no values, diffs, summaries, diagnostic messages or metadata.
const resources = new Set(["service.web", "service.admin"]);
const operations = new Set(["resource.create", "resource.update", "resource.delete", "variable.set", "variable.delete"]);
const fields = new Set(["name", "source", "build", "deploy", "groupId", "networking", "tracing", "cdn", "config", "volumeAttachments"]);
const variableNames = new Set(["NEXT_PUBLIC_SITE_URL", "ADMIN_API_BASE_URL", "ADMIN_COOKIE_SECURE", "ADMIN_COOKIE_SAMESITE"]);
const object = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const own = (value, key) => Object.hasOwn(value, key);
const nonempty = (value) => typeof value === "string" && value.length > 0;

export function inspectPlan(plan) {
  const errors = new Set();
  const changes = [];
  const reject = (reason) => errors.add(reason);
  if (!object(plan)) {
    reject("Plan must be an object.");
  } else {
    if (plan.kind !== "railway.config.plan" || plan.version !== 1 || plan.cliVersion !== "5.71.0") {
      reject("Unsupported saved-plan kind, version, or CLI version.");
    }
    for (const key of ["sourceTree", "environmentId", "configEtag", "changeSetHash"]) {
      if (!nonempty(plan[key])) reject("Saved-plan metadata is missing or malformed.");
    }
    if (typeof plan.destructive !== "boolean") reject("Destructive flag must be boolean.");
    if (plan.destructive === true) reject("Destructive plans are forbidden.");
    if (own(plan, "claim") && typeof plan.claim !== "boolean") reject("Ownership claim flag must be boolean.");
    const set = plan.changeSet;
    if (!object(set) || set.version !== 1 || !Array.isArray(set.changes) || !Array.isArray(set.diagnostics)) {
      reject("Unsupported or malformed change set.");
    } else {
      if (set.partial !== "ui") reject("Plan must target the ui partial.");
      if (!Array.isArray(set.declared) || set.declared.length !== 2 || new Set(set.declared).size !== 2 || !set.declared.every((address) => resources.has(address))) {
        reject("The ui partial must declare exactly service.web and service.admin.");
      }
      if (set.diagnostics.length !== 0) reject("Plans with diagnostics are forbidden.");
      for (const change of set.changes) {
        if (!object(change)) {
          reject("Malformed change entry.");
          continue;
        }
        const operation = operations.has(change.kind) ? change.kind : "[UNSUPPORTED]";
        const address = resources.has(change.address) ? change.address : "[OUTSIDE_UI]";
        if (operation === "[UNSUPPORTED]") reject("Unsupported change operation.");
        if (address === "[OUTSIDE_UI]") reject("Changes outside service.web and service.admin are forbidden.");
        if (change.severity !== "safe") reject("Only safe changes are allowed.");
        if (operation.endsWith(".delete")) reject("All deletions are forbidden.");
        let changedFields = [];
        if (operation === "resource.create") {
          const resource = change.resource;
          if (!object(resource) || resource.type !== "service" || `service.${resource.name}` !== change.address || (own(resource, "address") && resource.address !== change.address)) {
            reject("Malformed or mismatched created service.");
          } else {
            changedFields = Object.keys(resource).filter((field) => fields.has(field));
            if (own(resource, "variables")) changedFields.push("variables");
          }
        } else if (operation === "resource.update") {
          if (!fields.has(change.field) || !own(change, "before") || !own(change, "after")) {
            reject("Malformed or unsupported resource update.");
          } else {
            changedFields = [change.field];
          }
        } else if (operation === "variable.set" || operation === "variable.delete") {
          if (!nonempty(change.variable) || (operation === "variable.set" && !own(change, "after"))) reject("Malformed variable change.");
          changedFields = [variableNames.has(change.variable) ? `variables.${change.variable}` : "variables.[REDACTED]"];
        }
        changes.push({ operation, address, fields: changedFields.sort() });
      }
    }
  }
  return {
    kind: "cafedebug.railway-plan-review", version: 1, partial: "ui",
    accepted: errors.size === 0, changes, errors: [...errors],
    redaction: "Review report only; values and free-form text omitted. This artifact cannot be applied.",
  };
}

export function renderSummary(report) {
  const lines = ["## Railway ui infrastructure plan", "", `Result: **${report.accepted ? "accepted" : "rejected"}**`, ""];
  if (report.changes.length === 0) lines.push("No resource changes reported.");
  for (const change of report.changes) lines.push(`- ${change.operation}: ${change.address}; fields: ${change.fields.join(", ") || "none"}`);
  for (const error of report.errors) lines.push(`- ${error}`);
  lines.push("", "Values, textual diffs, and diagnostic messages are omitted. Review a fresh local plan before applying.", "");
  return lines.join("\n");
}

export async function reviewPlanFile(inputPath, outputPath, summaryPath) {
  let report;
  try {
    report = inspectPlan(JSON.parse(await readFile(inputPath, "utf8")));
  } catch {
    report = inspectPlan(null);
    report.errors = ["Plan file is unreadable or is not valid JSON."];
  }
  await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);
  if (summaryPath) await writeFile(summaryPath, renderSummary(report));
  return report;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [input, output, summary] = process.argv.slice(2);
  if (!input || !output) {
    console.error("Usage: node validate-railway-plan.mjs <raw-plan> <review-json> [summary-markdown]");
    process.exitCode = 1;
  } else {
    try {
      const report = await reviewPlanFile(input, output, summary);
      if (!report.accepted) {
        console.error("Railway ui plan rejected; inspect the safe review report.");
        process.exitCode = 1;
      }
    } catch {
      console.error("Unable to write Railway plan review outputs.");
      process.exitCode = 1;
    }
  }
}
