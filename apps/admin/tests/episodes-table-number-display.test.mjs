import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const source = readFileSync(
  resolve(process.cwd(), "src/features/episodes/components/episodes-table.tsx"),
  "utf8"
);

test("episodes table keeps Number as the first column header", () => {
  assert.match(source, />Number<\/th>/, "episodes table should label the number column clearly");
});

test("episodes table no longer prefixes episode numbers with #", () => {
  assert.doesNotMatch(
    source,
    /`#\$\{episode\.number\}`/,
    "episodes table should render plain numeric values without the hash prefix"
  );
  assert.match(
    source,
    /\? episode\.number : "—"/,
    "episodes table should keep the numeric value and preserve the fallback dash"
  );
});
