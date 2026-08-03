import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const root = process.cwd();
const source = readFileSync(join(root, "src/components/layout/mobile-nav.tsx"), "utf8");

test("compact navigation is the isolated client disclosure boundary", () => {
  assert.match(source, /^"use client";/);
  assert.match(source, /const \[open, setOpen\] = useState\(false\)/);
  assert.match(source, /className="lg:hidden"/);
  assert.match(source, /aria-controls=\{menuId\}/);
  assert.match(source, /aria-expanded=\{open\}/);
  assert.match(source, /open \? "Fechar menu principal" : "Abrir menu principal"/);
  assert.match(source, /open \? <X aria-hidden size=\{18\} \/> : <Menu aria-hidden size=\{18\} \/>/);
  assert.match(source, /id=\{menuId\}/);
  assert.match(source, /aria-label="Navegação principal"/);
});

test("compact menu renders the canonical items with Pencil geometry", () => {
  assert.match(source, /import \{ primaryNavigationItems \}/);
  assert.match(source, /primaryNavigationItems\.map/);
  assert.match(source, /absolute inset-x-0 top-full z-50/);
  assert.match(source, /gap-1 border-b border-border bg-popover px-4 pb-5 pt-3/);
  assert.match(source, /flex h-11 items-center rounded-m bg-secondary px-3 text-\[15px\]/);
  assert.match(source, /aria-disabled="true"/);
  assert.match(source, /onClick=\{\(\) => setOpen\(false\)\}/);
});

test("compact menu supports escape, outside activation, focus return, and breakpoint dismissal", () => {
  assert.match(source, /event\.key === "Escape"/);
  assert.match(source, /querySelector<HTMLButtonElement>\("button"\)\?\.focus\(\)/);
  assert.match(source, /!rootRef\.current\?\.contains\(event\.target\)/);
  assert.match(source, /event\.preventDefault\(\)/);
  assert.match(source, /event\.stopPropagation\(\)/);
  assert.match(source, /document\.addEventListener\("click", handleOutsideClick, true\)/);
  assert.match(source, /window\.matchMedia\(desktopNavigationQuery\)/);
  assert.match(source, /const desktopNavigationQuery = "\(min-width: 64rem\)"/);
  assert.match(source, /if \(event\.matches\) \{\s*setOpen\(false\)/);
});
