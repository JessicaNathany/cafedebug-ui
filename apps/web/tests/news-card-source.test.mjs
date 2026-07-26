import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const root = process.cwd();
const readSource = (file) => readFileSync(join(root, file), "utf8");

test("G08 news card preserves the wQPNg anatomy with token-backed theme behavior", () => {
  const source = readSource("src/features/news/components/news-card.tsx");

  assert.match(source, /import Image from "next\/image"/);
  assert.match(source, /w-full min-w-0 flex-col overflow-hidden/);
  assert.doesNotMatch(source, /min-h-\[/, "news cards must retain Pencil content-height behavior");
  assert.doesNotMatch(source, /h-\[\d+px\]/, "news cards must not impose a fixed card height");
  assert.match(source, /rounded-\[var\(--radius-m\)\]/);
  assert.match(source, /ring-1 ring-inset ring-border/);
  assert.match(source, /shadow-card dark:shadow-none/);
  assert.match(source, /h-50 shrink-0/);
  assert.match(source, /left-4 top-4/);
  assert.match(source, /px-3 py-1.5/);
  assert.match(source, /font-primary text-\[11px\] font-semibold leading-\[15px\] tracking-\[1px\] text-primary/);
  assert.match(source, /grid content-start gap-2\.5 p-5/);
  assert.match(source, /text-lg font-semibold leading-\[1\.35\] text-card-foreground/);
  assert.match(source, /text-sm leading-\[1\.55\] text-muted-foreground/);
  assert.match(source, /gap-2 pt-1\.5/);
  assert.match(source, /size-6 rounded-pill object-cover/);
  assert.match(source, /text-\[13px\] font-medium text-card-foreground/);
  assert.doesNotMatch(source, /PlayButton|Headphones|duration|date/i, "news cards must not inherit episode controls");
  assert.doesNotMatch(source, /#[0-9a-fA-F]{3,8}/, "news card source should keep colors token-backed");
});

test("G08 fixtures retain inspected Pencil copy and local visual assets", () => {
  const source = readSource("src/features/news/mock/news.mock.ts");

  assert.match(source, /category: "SEGURANÇA"/);
  assert.match(source, /authorName: "Camila Torres"/);
  assert.match(source, /Vulnerabilidade crítica em framework JS é corrigida/);
  assert.match(source, /Patch de emergência lançado após descoberta de falha que afetava milhões de aplicações\./);
  assert.match(source, /readTimeLabel: "4 min de leitura"/);
  assert.match(source, /category: "COMUNIDADE"/);
  assert.match(source, /authorName: "Pedro Antunes"/);
  assert.match(source, /CaféDebug Conf 2026: inscrições abertas/);
  assert.match(source, /O maior evento da comunidade dev brasileira volta em outubro, agora em formato híbrido\./);
  assert.match(source, /readTimeLabel: "3 min de leitura"/);

  for (const asset of [
    "public/mock/news-security.jpg",
    "public/mock/news-community.jpg",
    "public/mock/author-camila.jpg",
    "public/mock/author-pedro.jpg"
  ]) {
    assert.equal(existsSync(join(root, asset)), true, `${asset} should be available locally`);
  }
});
