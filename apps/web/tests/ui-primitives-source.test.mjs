import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const root = process.cwd();
const primitiveFiles = [
  "src/components/ui/button.tsx",
  "src/components/ui/icon-button.tsx",
  "src/components/ui/label.tsx",
  "src/components/ui/input.tsx",
  "src/components/ui/search-box.tsx",
  "src/components/ui/card.tsx"
];

const readSource = (file) => readFileSync(join(root, file), "utf8");

test("web UI primitives keep colors token-backed", () => {
  for (const file of primitiveFiles) {
    const source = readSource(file);

    assert.equal(/#[0-9a-fA-F]{3,8}/.test(source), false, `${file} should not hardcode hex colors`);
  }
});

test("button primitive exposes Pencil-backed variants and sizes", () => {
  const source = readSource("src/components/ui/button.tsx");

  assert.match(source, /type ButtonVariant = "default" \| "primary" \| "secondary" \| "outline" \| "ghost"/);
  assert.match(source, /default: "h-10/);
  assert.match(source, /large: "h-12 px-6/);
  assert.match(source, /icon: "h-10 w-10"/);
  assert.match(source, /AccessibleIconName/);
  assert.match(source, /type NonIconButtonProps/);
  assert.match(source, /size\?: Exclude<ButtonSize, "icon">/);
  assert.match(source, /type IconOnlyButtonProps/);
  assert.match(source, /size: "icon"/);
  assert.doesNotMatch(source, /size: ButtonSize/);
});

test("icon button primitive exposes Pencil footprints and requires an accessible name", () => {
  const source = readSource("src/components/ui/icon-button.tsx");

  assert.match(source, /default: "h-10 w-10"/);
  assert.match(source, /large: "h-12 w-12"/);
  assert.match(source, /featured: "h-14 w-14"/);
  assert.match(source, /AccessibleIconName/);
  assert.match(source, /Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label" \| "aria-labelledby">/);
});

test("label primitive matches Pencil pill weight and variants", () => {
  const source = readSource("src/components/ui/label.tsx");

  assert.match(source, /type LabelVariant = "orange" \| "secondary"/);
  assert.match(source, /orange: "bg-warning text-warning-foreground"/);
  assert.match(source, /secondary: "bg-secondary text-secondary-foreground"/);
  assert.match(source, /font-normal/);
});

test("input and search primitives preserve Pencil anatomy", () => {
  const inputSource = readSource("src/components/ui/input.tsx");
  const searchSource = readSource("src/components/ui/search-box.tsx");

  assert.match(inputSource, /h-10 w-full/);
  assert.match(inputSource, /rounded-pill border bg-background px-4/);
  assert.match(inputSource, /border-input hover:border-ring/);
  assert.match(searchSource, /max-w-60/);
  assert.match(searchSource, /rounded-\[calc\(var\(--radius-m\)\/8\)\]/);
  assert.match(searchSource, /px-2 py-1\.5/);
});

test("card primitives map default and plain Pencil anatomy", () => {
  const source = readSource("src/components/ui/card.tsx");

  assert.match(source, /default: "bg-card text-card-foreground"/);
  assert.match(source, /plain: "bg-background text-foreground"/);
  assert.match(source, /rounded-\[var\(--radius-none\)\]/);
  assert.match(source, /shadow-pencil-subtle/);
  assert.match(source, /divided \? "border-b border-border"/);
  assert.match(source, /export function PlainCard/);
  assert.match(source, /actions \? <CardActions>/);
});

test("primitives use valid custom property syntax and named Pencil elevation", () => {
  for (const file of primitiveFiles) {
    const source = readSource(file);

    assert.equal(source.includes("rounded-[--"), false, `${file} should not use invalid arbitrary custom-property radius syntax`);
    assert.equal(source.includes("shadow-card"), false, `${file} should use the named Pencil subtle elevation token where Pencil asks for the 0/1/1.75 effect`);
  }
});
