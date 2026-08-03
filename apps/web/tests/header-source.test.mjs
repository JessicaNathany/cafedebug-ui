import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const root = process.cwd();
const readSource = (file) => readFileSync(join(root, file), "utf8");

test("site header maps to the G03 Pencil geometry and preserves fixed-dark as the default", () => {
  const source = readSource("src/components/layout/header.tsx");

  assert.match(source, /export function Header\(props: HeaderProps = \{\}\)/);
  assert.match(source, /!isBeta && "dark"/);
  assert.match(source, /relative h-18 border-b border-border bg-background text-foreground/);
  assert.match(source, /h-full w-full[^"]+md:w-screen/);
  assert.match(source, /md:px-10/);
  assert.doesNotMatch(source, /max-w-\[1440px\]/);
});

test("site header preserves the V2 subscription action and its Pencil sizing", () => {
  const source = readSource("src/components/layout/header.tsx");

  assert.match(source, /export function SubscriptionAction\(\)/);
  assert.match(source, /gap-3\.5/);
  assert.match(source, /aria-label="Pesquisar"/);
  assert.match(source, /size=\{18\}/);
  assert.match(source, /<Mic aria-hidden size=\{16\}/);
  assert.match(source, /gap-2 px-4\.5 font-secondary font-semibold/);
  assert.match(source, />\s*Assinar\s*</);
  assert.match(source, /isBeta \? <ThemeToggle initialTheme=\{props\.initialTheme\} \/> : <SubscriptionAction \/>/);
});

test("beta header explicitly follows the root theme and replaces Assinar with the theme control", () => {
  const source = readSource("src/components/layout/header.tsx");

  assert.match(source, /type BetaHeaderProps = \{[\s\S]*?initialTheme: ThemePref;[\s\S]*?variant: "beta";/);
  assert.match(source, /const isBeta = props\.variant === "beta"/);
  assert.match(source, /!isBeta && "dark"/);
  assert.match(source, /<ThemeToggle initialTheme=\{props\.initialTheme\} \/>/);
  assert.match(source, /<Button aria-label="Pesquisar" className="inline-flex" size="icon" variant="secondary">/);
});

test("site navigation preserves allowed links and inert placeholders", () => {
  const itemsSource = readSource("src/components/layout/navigation-items.ts");
  const navSource = readSource("src/components/layout/nav.tsx");

  assert.match(itemsSource, /\{ label: "Início", href: "\/", active: true \}/);
  assert.match(itemsSource, /\{ label: "Episódios", href: "\/#episodios" \}/);
  for (const label of ["Time", "Sobre"]) {
    assert.match(itemsSource, new RegExp(`\\{ label: "${label}", disabled: true \\}`));
  }
  for (const removedLabel of ["Notícias", "Eventos", "Vagas"]) {
    assert.doesNotMatch(itemsSource, new RegExp(`label: "${removedLabel}"`));
  }
  assert.match(navSource, /primaryNavigationItems\.map/);
  assert.match(navSource, /aria-disabled="true"/);
  assert.match(navSource, /hidden items-center gap-7 font-secondary text-sm leading-5 lg:flex/);
  assert.doesNotMatch(navSource, /md:flex/);
});

test("site header composes the compact trigger after the wordmark and keeps the desktop breakpoint", () => {
  const headerSource = readSource("src/components/layout/header.tsx");

  assert.match(headerSource, /import \{ MobileNav \} from "@\/components\/layout\/mobile-nav"/);
  assert.match(headerSource, /flex min-w-0 items-center gap-3 lg:gap-10/);
  assert.match(headerSource, /<\/Link>\s*<MobileNav \/>\s*<Nav \/>/);
  assert.match(headerSource, /flex shrink-0 items-center gap-3\.5/);
  assert.match(headerSource, /inline-flex h-10 shrink-0 items-center font-primary/, "the logo link must keep a 40px touch target");
});
