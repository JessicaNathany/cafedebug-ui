import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const root = process.cwd();
const readSource = (file) => readFileSync(join(root, file), "utf8");

test("G06 episode card preserves the FGSFI anatomy with token-backed theme behavior", () => {
  const source = readSource("src/features/episodes/components/episode-card.tsx");

  assert.match(source, /h-103/);
  assert.match(source, /h-50 shrink-0/);
  assert.match(source, /rounded-m/);
  assert.match(source, /ring-1 ring-inset ring-border/);
  assert.doesNotMatch(source, /rounded-\[/, "episode-card should use named radius utilities");
  assert.match(source, /shadow-card dark:shadow-none/);
  assert.match(source, /left-4 top-4/);
  assert.match(source, /leading-\[15px\]/);
  assert.match(source, /h-14 w-14/);
  assert.match(source, /iconSize=\{22\}/);
  assert.match(source, /bottom-\[18px\] right-4/);
  assert.match(source, /Headphones aria-hidden size=\{12\}/);
  assert.match(source, /p-5/);
  assert.match(source, /gap-2\.5/);
  assert.match(source, /size-7 rounded-pill object-cover/);
  assert.match(source, /alt=\{episode\.guestName\}/);
  assert.match(source, /guestAvatarUrl/);
  assert.match(source, /Reproduzir episódio \$\{episode\.number\}/);
  assert.doesNotMatch(source, /#[0-9a-fA-F]{3,8}/, "episode-card source should keep colors token-backed");
});

test("episode card owns the shared, capability-aware Play discovery interaction", () => {
  const source = readSource("src/features/episodes/components/episode-card.tsx");

  assert.match(source, /<article className="group /, "the shared card should own the interaction group");
  assert.match(source, /\[@media\(hover:hover\)_and_\(pointer:fine\)\]:hover:bg-secondary\/25/);
  assert.match(source, /dark:\[@media\(hover:hover\)_and_\(pointer:fine\)\]:hover:bg-secondary\/50/);
  assert.match(source, /focus-within:bg-secondary\/25/);
  assert.match(source, /dark:focus-within:bg-secondary\/50/);
  assert.match(source, /transition-colors/);
  assert.doesNotMatch(source, /ring-primary/, "the hover treatment must not restore the orange card border");
  assert.match(source, /\[@media\(hover:hover\)_and_\(pointer:fine\)\]:opacity-0/);
  assert.match(source, /\[@media\(hover:hover\)_and_\(pointer:fine\)\]:group-hover:opacity-100/);
  assert.match(source, /\[@media\(hover:hover\)_and_\(pointer:fine\)\]:group-focus-within:opacity-100/);
  assert.match(source, /transition-opacity/);
  assert.match(source, /motion-reduce:transition-none/);
  assert.match(source, /pointer-events-none/);
  assert.match(source, /pointer-events-auto h-14 w-14/);
  assert.doesNotMatch(source, /<article[^>]*onClick=/, "the card must not collapse detail navigation and playback into one action");

  for (const file of [
    "src/features/homepage/components/recent-episodes.tsx",
    "src/features/homepage/components/homepage-v2.tsx",
    "src/features/episodes/components/home-page.tsx",
    "src/features/episodes/components/episodes-list-page.tsx",
    "src/features/episodes/components/episode-related.tsx"
  ]) {
    const consumer = readSource(file);

    assert.match(consumer, /EpisodeCard/, `${file} should consume the shared EpisodeCard`);
    assert.doesNotMatch(consumer, /<EpisodeCard[^>]+variant=/, `${file} must not introduce a page-specific card variant`);
  }
});

test("G06 fixtures retain inspected Pencil copy and local visual assets", () => {
  const source = readSource("src/features/episodes/mock/episodes.mock.ts");

  assert.match(source, /durationLabel: "52 min"/);
  assert.match(source, /guestName: "Marcos Vinícius"/);
  assert.match(source, /Negociação salarial: como pedir o aumento que você merece/);
  assert.match(source, /durationLabel: "1h 04min"/);
  assert.match(source, /guestName: "Letícia Souza"/);
  assert.match(source, /Microsserviços valem a pena\? Lições de quem migrou/);
  assert.match(source, /durationLabel: "47 min"/);
  assert.match(source, /guestName: "Rafael Lima"/);
  assert.match(source, /Programando com IA: o novo fluxo de trabalho do dev/);

  for (const asset of [
    "public/mock/episode-141.jpg",
    "public/mock/episode-140.jpg",
    "public/mock/episode-139.jpg",
    "public/mock/guest-marcos.jpg",
    "public/mock/guest-leticia.jpg",
    "public/mock/guest-rafael.jpg"
  ]) {
    assert.equal(existsSync(join(root, asset)), true, `${asset} should be available locally`);
  }
});
