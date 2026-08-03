import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const root = process.cwd();
const readSource = (file) => readFileSync(join(root, file), "utf8");

test("G09 News and Events composes the inspected Pencil layout from approved feature components", () => {
  const source = readSource("src/features/homepage/components/homepage-v2.tsx");
  const sectionSource = source.match(/<section[^>]*id="noticias">[\s\S]*?<\/section>/)?.[0] ?? "";

  assert.match(source, /import \{ NewsCard \} from "\.\.\/\.\.\/news\/components\/news-card"/);
  assert.match(source, /import \{ mockNewsArticles \} from "\.\.\/\.\.\/news\/mock\/news\.mock"/);
  assert.match(source, /import \{ mockHomepageEvents \} from "\.\.\/\.\.\/events\/mock\/homepage-events\.mock"/);
  assert.match(source, /Calendar, MapPin/);
  assert.match(source, /id="noticias"/);
  assert.match(source, /relative w-full border-t-border border-b-border bg-background.*before:h-px before:bg-border.*after:h-px after:bg-border.*dark:bg-card/);
  assert.match(source, /mx-auto grid w-full max-w-\[1312px\] items-start gap-12 lg:w-\[calc\(100vw-8rem\)\] lg:grid-cols-\[minmax\(0,1fr\)_380px\]/);
  assert.match(source, /lg:px-16 lg:py-18/);
  assert.match(source, /grid min-w-0 gap-6/);
  assert.match(source, /grid min-w-0 gap-6 md:grid-cols-2/);
  assert.match(source, /<NewsCard article=\{article\} key=\{article\.slug\} \/>/);
  assert.match(source, /w-full min-w-0 gap-5 rounded-\[var\(--radius-m\)\] border border-border bg-card p-6 dark:bg-background lg:min-h-\[569px\]/);
  assert.match(source, /h-\[57px\] w-13 shrink-0 flex-col items-center rounded-xl bg-secondary py-2/);
  assert.match(source, /divide-y divide-border/);
  assert.match(source, /h-11 w-full items-center justify-center rounded-pill bg-secondary/);
  assert.match(source, /h-10 items-end gap-1\.5 font-secondary text-sm font-semibold leading-\[18px\] text-primary/);
  assert.match(source, /aria-label="Ver todas as notícias"/);
  assert.match(source, /aria-label="Ver agenda completa"/);
  assert.match(source, /focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring/);
  assert.doesNotMatch(source, /href="#noticias"/, "visual-only G09 actions must not use self-referential links");
  assert.doesNotMatch(source, /newsItems|eventItems|NEWSROOM|Agenda da comunidade/);
  assert.doesNotMatch(source, /#[0-9a-fA-F]{3,8}/, "G09 source should use semantic token utilities instead of raw colors");
  assert.doesNotMatch(source, /fetch\(/, "G09 homepage composition must not fetch directly");
  assert.doesNotMatch(sectionSource, /className="dark\b/, "G09 must follow the document theme rather than pin a dark subtree");
});

test("G09 events retain the deterministic o5gLmf agenda fixtures", () => {
  const source = readSource("src/features/events/mock/homepage-events.mock.ts");

  for (const copy of [
    "OUT",
    "12",
    "ONLINE",
    "Workshop: Clean Architecture na prática",
    "Online · 19h",
    "24",
    "PRESENCIAL",
    "CaféDebug Conf 2026",
    "São Paulo, SP",
    "NOV",
    "08",
    "Live: Carreira internacional para devs",
    "Online · 20h",
    "21",
    "Meetup CaféDebug Rio",
    "Rio de Janeiro, RJ"
  ]) {
    assert.match(source, new RegExp(copy.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});
