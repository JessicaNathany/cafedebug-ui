import { readFile, writeFile } from "node:fs/promises";

const [inputPath, outputPath] = process.argv.slice(2);

if (!inputPath || !outputPath) {
  throw new Error("Usage: node redact-railway-plan.mjs <input> <output>");
}

const sensitiveKey =
  /(?:token|secret|password|credential|private|database|api[-_]?key)/i;

function redact(value, parentKey = "") {
  if (Array.isArray(value)) {
    return value.map((item) => redact(item, parentKey));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => {
        if (key === "diff") {
          return [key, "[REDACTED: see the safe job-summary counts]"];
        }

        if (
          parentKey === "variables" ||
          key === "variables" ||
          sensitiveKey.test(key)
        ) {
          return [key, "[REDACTED]"];
        }

        return [key, redact(child, key)];
      }),
    );
  }

  return sensitiveKey.test(parentKey) ? "[REDACTED]" : value;
}

const plan = JSON.parse(await readFile(inputPath, "utf8"));
const redactedPlan = {
  ...redact(plan),
  redaction:
    "Variable values, sensitive fields, and textual diffs are removed. Review the safe job summary for change counts.",
};

await writeFile(outputPath, `${JSON.stringify(redactedPlan, null, 2)}\n`);
