// Compatibility entry point: emit only the same allowlisted review report.
import { pathToFileURL } from "node:url";
import { reviewPlanFile } from "./validate-railway-plan.mjs";

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [input, output] = process.argv.slice(2);
  if (!input || !output) {
    console.error("Usage: node redact-railway-plan.mjs <raw-plan> <review-json>");
    process.exitCode = 1;
  } else {
    try {
      const report = await reviewPlanFile(input, output);
      if (!report.accepted) process.exitCode = 1;
    } catch {
      console.error("Unable to write Railway plan review report.");
      process.exitCode = 1;
    }
  }
}
