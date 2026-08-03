import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const root = process.cwd();
const readSource = (file) => readFileSync(join(root, file), "utf8");

test("G05 homepage hero preserves the Pencil information anatomy", () => {
  const source = readSource("src/features/homepage/components/homepage-v2.tsx");

  assert.match(source, /dark grid min-h-180/);
  assert.match(source, /lg:min-h-\[719px\]/);
  assert.match(source, /mx-auto grid w-full max-w-\[1312px\] items-center gap-16 lg:w-\[calc\(100vw-8rem\)\]/);
  assert.match(source, /lg:grid-cols-\[minmax\(0,728px\)_minmax\(0,520px\)\]/);
  assert.match(source, /EP \{featured.number\} · EPISÓDIO EM DESTAQUE/);
  assert.match(source, /Novos episódios toda semana\./);
  assert.match(source, /h-13 w-\[174px\] gap-2\.5 px-7/);
  assert.match(source, /h-13 w-\[226px\] shrink-0 whitespace-nowrap[^\n]+px-7/);
  assert.match(source, /<dl className="flex flex-wrap items-center gap-4 pt-5 sm:gap-9">/);
  assert.match(source, /<div className="flex items-center gap-4 sm:gap-9" key=\{stat\.label\}>/);
  assert.match(source, /Episódios/, "Pencil metric label should remain present");
  assert.match(source, /Ouvintes\/mês/);
  assert.match(source, /Avaliação/);
  assert.doesNotMatch(source, /#[0-9a-fA-F]{3,8}/, "hero source should keep colors token-backed");
});

test("G05 hero player matches the Pencil controls without active placeholder actions", () => {
  const source = readSource("src/features/episodes/components/hero-player.tsx");

  assert.match(source, /max-w-130/);
  assert.match(source, /lg:h-\[559px\]/);
  assert.match(source, /h-60/);
  assert.match(source, /NOVO/);
  assert.match(source, /18:24/);
  assert.match(source, /48:12/);
  assert.match(source, /1\.0x/);
  assert.match(source, /aria-label="Voltar 15 segundos"/);
  assert.match(source, /Pause/);
  assert.match(source, /aria-label="Pausar episódio em reprodução"/);
  assert.match(source, /aria-pressed="true"/);
  assert.match(source, /aria-label="Avançar 15 segundos"/);
  assert.match(source, /disabled/);
  assert.doesNotMatch(source, /#[0-9a-fA-F]{3,8}/, "player source should keep colors token-backed");
});

test("G05 binds Pencil font names to Next-managed production fonts", () => {
  const layoutSource = readSource("src/app/layout.tsx");
  const globalsSource = readSource("src/app/globals.css");

  assert.match(layoutSource, /import \{ Geist, JetBrains_Mono \} from "next\/font\/google"/);
  assert.match(layoutSource, /variable: "--font-geist"/);
  assert.match(layoutSource, /variable: "--font-jetbrains-mono"/);
  assert.match(layoutSource, /geist\.variable/);
  assert.match(layoutSource, /jetBrainsMono\.variable/);
  assert.match(globalsSource, /--font-primary: var\(--font-jetbrains-mono\)/);
  assert.match(globalsSource, /--font-secondary: var\(--font-geist\)/);
});
