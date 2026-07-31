import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const root = process.cwd();
const readSource = (file) => readFileSync(join(root, file), "utf8");

test("site header maps to the G03 Pencil geometry and dark scope", () => {
  const source = readSource("src/components/layout/header.tsx");

  assert.match(source, /className="dark h-18 overflow-x-clip border-b border-border bg-background text-foreground"/);
  assert.match(source, /h-full w-full[^"]+md:w-screen/);
  assert.match(source, /md:px-10/);
  assert.doesNotMatch(source, /max-w-\[1440px\]/);
  assert.doesNotMatch(source, /ThemeToggle/);
});

test("site header right controls match Pencil sizing and labels", () => {
  const source = readSource("src/components/layout/header.tsx");

  assert.match(source, /gap-3\.5/);
  assert.match(source, /aria-label="Pesquisar"/);
  assert.match(source, /size=\{18\}/);
  assert.match(source, /<Mic aria-hidden size=\{16\}/);
  assert.match(source, /gap-2 px-4\.5 font-secondary font-semibold/);
  assert.match(source, />\s*Assinar\s*</);
});

test("site navigation preserves allowed links and inert placeholders", () => {
  const source = readSource("src/components/layout/nav.tsx");

  assert.match(source, /\{ label: "Início", href: "\/", active: true \}/);
  assert.match(source, /\{ label: "Episódios", href: "\/#episodios" \}/);
  for (const label of ["Notícias", "Eventos", "Vagas", "Time", "Sobre"]) {
    assert.match(source, new RegExp(`\\{ label: "${label}", disabled: true \\}`));
  }
  assert.match(source, /aria-disabled="true"/);
  assert.match(source, /hidden items-center gap-7 font-secondary text-sm leading-5 lg:flex/);
  assert.doesNotMatch(source, /md:flex/);
});

test("site header keeps tablet and mobile navigation hidden to avoid overflow", () => {
  const headerSource = readSource("src/components/layout/header.tsx");
  const navSource = readSource("src/components/layout/nav.tsx");

  assert.match(navSource, /className="hidden items-center gap-7 font-secondary text-sm leading-5 lg:flex"/);
  assert.doesNotMatch(navSource, /\bmd:flex\b/);
  assert.match(headerSource, /flex min-w-0 items-center gap-10/);
  assert.match(headerSource, /flex shrink-0 items-center gap-3\.5/);
});
