import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const root = process.cwd();
const readSource = (file) => readFileSync(join(root, file), "utf8");

test("site footer maps to the G04 Pencil shell geometry and preserves fixed-dark as the default", () => {
  const source = readSource("src/components/layout/footer.tsx");

  assert.match(source, /export function Footer\(\{ variant = "fixed-dark" \}: \{ variant\?: FooterVariant \}\)/);
  assert.match(source, /variant === "fixed-dark" && "dark"/);
  assert.match(source, /relative flex w-full flex-col gap-10 border-t border-border bg-card px-4 pb-8 pt-14 text-card-foreground sm:px-6 md:px-10 xl:h-\[330px\]/);
  assert.match(source, /grid w-full gap-10 md:grid-cols-2 xl:h-36 xl:w-\[calc\(100vw-5rem\)\] xl:flex xl:justify-between xl:gap-16/);
  assert.match(source, /max-w-80 flex-col gap-4 xl:w-80/);
  assert.match(source, /max-w-75 flex-col gap-3 xl:w-75/);
  assert.match(source, /h-px w-full shrink-0 bg-border xl:w-\[calc\(100vw-5rem\)\]/);
  assert.doesNotMatch(source, /max-w-\[1440px\]|mx-auto/);
  assert.doesNotMatch(source, /#[0-9a-fA-F]{3,8}/);
});

test("beta footer explicitly inherits the root theme", () => {
  const source = readSource("src/components/layout/footer.tsx");

  assert.match(source, /export type FooterVariant = "beta" \| "fixed-dark"/);
  assert.match(source, /variant === "fixed-dark" && "dark"/);
  assert.doesNotMatch(source, /variant === "beta" && "dark"/);
});

test("site footer preserves Pencil content, typography, and inert deferred links", () => {
  const source = readSource("src/components/layout/footer.tsx");

  assert.match(source, /font-primary text-\[22px\] font-bold leading-none/);
  assert.match(source, /Conversas profundas sobre carreira, tecnologia e a comunidade de desenvolvimento\./);
  assert.match(source, /font-primary text-xs font-semibold leading-4 tracking-\[1\.5px\] text-card-foreground/);
  assert.match(source, /flex flex-col gap-3\.5 font-secondary text-sm leading-\[1\.3\] text-muted-foreground/);

  for (const heading of ["Conteúdo", "Comunidade", "Empresa"]) {
    assert.match(source, new RegExp(`title: "${heading}"`));
  }

  for (const placeholder of ["Notícias", "Eventos", "Vagas", "Time", "Discord", "Sobre", "Contato", "Publicidade", "Newsletter", "Imprensa", "RSS Feed"]) {
    assert.match(source, new RegExp(`"${placeholder}"`));
  }

  assert.match(source, /aria-disabled="true"/);
  assert.doesNotMatch(source, /href=/);
});

test("deferred content destinations expose the exact Pencil coming-soon status", () => {
  const source = readSource("src/components/layout/footer.tsx");

  for (const label of ["Notícias", "Eventos", "Vagas"]) {
    assert.match(source, new RegExp(`\\{ label: "${label}", status: "Em breve" \\}`));
  }

  assert.equal((source.match(/status: "Em breve"/g) ?? []).length, 3);
  assert.match(source, /aria-label=\{"status" in item \? `\$\{item\.label\} — \$\{item\.status\}` : item\.label\}/);
  assert.match(source, /<span aria-hidden="true"> — \{item\.status\}<\/span>/);
  assert.doesNotMatch(source, /href=/);
});

test("site footer uses the exact Pencil social and newsletter controls", () => {
  const source = readSource("src/components/layout/footer.tsx");

  assert.match(source, /import \{ ArrowRight \} from "lucide-react"/);
  for (const label of ["GitHub", "Twitter", "YouTube", "LinkedIn", "Instagram"]) {
    assert.match(source, new RegExp(`label: "${label}"`));
  }
  assert.match(source, /inline-flex size-9 items-center justify-center rounded-pill bg-secondary text-muted-foreground/);
  assert.match(source, /disabled:pointer-events-none disabled:cursor-default disabled:bg-secondary disabled:text-muted-foreground disabled:opacity-100/);
  assert.match(source, /\[&_svg\]:size-4 \[&_svg\]:fill-current/);
  assert.match(source, /h-11 w-full items-center justify-between gap-2 rounded-pill border border-border bg-background py-0 pl-4 pr-1/);
  assert.match(source, /font-secondary text-\[13px\] leading-none text-muted-foreground/);
  assert.match(source, /inline-flex size-9 items-center justify-center rounded-pill bg-primary text-primary-foreground/);
  assert.match(source, /disabled:pointer-events-none disabled:cursor-default disabled:bg-primary disabled:text-primary-foreground disabled:opacity-100/);
  assert.match(source, /<ArrowRight aria-hidden size=\{16\} \/>/);
  assert.match(source, /type="button"/);
  assert.doesNotMatch(source, /size="icon"|variant="secondary"|variant="primary"|↗|Globe|MessageCircle|Radio|Rss/);
});

test("site footer copy-only controls are natively disabled", () => {
  const source = readSource("src/components/layout/footer.tsx");

  assert.match(source, /<button aria-disabled="true" aria-label=\{`\$\{label\} do CaféDebug \(em breve\)`\} className=\{iconButtonClass\} disabled key=\{label\} type="button">/);
  assert.match(source, /aria-label="Enviar email da newsletter \(em breve\)"[\s\S]*?disabled[\s\S]*?type="button"/);
});

test("site footer keeps tablet and mobile order without horizontal overflow helpers", () => {
  const source = readSource("src/components/layout/footer.tsx");

  assert.match(source, /grid w-full gap-10 md:grid-cols-2 xl:h-36 xl:w-\[calc\(100vw-5rem\)\] xl:flex xl:justify-between xl:gap-16/);
  assert.doesNotMatch(source, /lg:flex/);
  assert.match(source, /flex max-w-80 flex-col gap-4/);
  assert.match(source, /flex max-w-75 flex-col gap-3/);
  assert.match(source, /min-w-0 truncate/);
  assert.match(source, /flex flex-wrap items-center gap-5/);
});
