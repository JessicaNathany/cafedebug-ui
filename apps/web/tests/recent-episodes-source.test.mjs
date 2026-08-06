import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const root = process.cwd();
const readSource = (file) => readFileSync(join(root, file), "utf8");

test("G07 Recent Episodes preserves the Pencil band, header, responsive grid, and wide desktop cap", () => {
  const source = readSource("src/features/homepage/components/homepage-v2.tsx");
  const recentEpisodesSource = source.match(/<section className="w-full bg-background[\s\S]*?<\/section>/)?.[0] ?? "";

  assert.match(recentEpisodesSource, /w-full bg-background px-4 py-18[^"]*lg:px-16/);
  assert.match(recentEpisodesSource, /mx-auto grid w-full max-w-\[1312px\] gap-7 lg:w-\[calc\(100vw-8rem\)\]/);
  assert.doesNotMatch(recentEpisodesSource, /max-w-\[1440px\]/);
  assert.doesNotMatch(recentEpisodesSource, /EPISÓDIOS RECENTES/);
  assert.match(recentEpisodesSource, /font-secondary text-\[30px\] font-bold/);
  assert.match(recentEpisodesSource, /Novas conversas toda semana com a comunidade dev\./);
  assert.match(recentEpisodesSource, /relative inline-flex h-10 items-end gap-1\.5 font-secondary text-sm font-semibold leading-\[18px\] text-primary/);
  assert.match(recentEpisodesSource, /ArrowRight aria-hidden size=\{16\}/);
  assert.match(recentEpisodesSource, /href="\/episodes"/);
  assert.match(recentEpisodesSource, /grid gap-6 md:grid-cols-2 lg:grid-cols-3/);
  assert.match(recentEpisodesSource, /<EpisodeCard episode=\{episode\} key=\{episode\.slug\} \/>/);
  assert.doesNotMatch(recentEpisodesSource, /#[0-9a-fA-F]{3,8}/, "Recent Episodes source should keep colors token-backed");
});
