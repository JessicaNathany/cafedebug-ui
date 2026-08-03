import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const root = process.cwd();
const readSource = (file) => readFileSync(join(root, file), "utf8");

test("Homepage Beta is a server-first launch composition with six non-featured episodes", () => {
  const source = readSource("src/features/homepage/components/homepage-beta.tsx");

  assert.doesNotMatch(source, /["']use client["']/, "the beta composition should remain a Server Component");
  assert.match(source, /const recentEpisodes = episodes\.slice\(1, 7\)/);
  assert.match(source, /<BannerCarousel banners=\{homepageBanners\} featuredEpisode=\{featuredEpisode\} \/>/);
  assert.match(source, /<HeroPlayer episode=\{featuredEpisode\} \/>/);
  assert.match(source, /<RecentEpisodes episodes=\{recentEpisodes\} \/>/);
  assert.match(source, /<NewsletterSection \/>/);
  assert.doesNotMatch(source, /heroStats|NewsCard|mockNewsArticles|mockHomepageEvents|Agenda de Eventos|Últimas Notícias/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /#[0-9a-fA-F]{3,8}/, "beta feature colors must remain token-backed");
});

test("the root route uses a theme-following beta shell while content routes keep fixed-dark chrome", () => {
  const route = readSource("src/app/(beta)/page.tsx");
  const betaLayout = readSource("src/app/(beta)/layout.tsx");
  const contentLayout = readSource("src/app/(content)/layout.tsx");

  assert.match(route, /return <HomepageBeta \/>/);
  assert.match(betaLayout, /<Header initialTheme=\{theme\} variant="beta" \/>/);
  assert.match(betaLayout, /<Footer variant="beta" \/>/);
  assert.match(contentLayout, /<Header \/>/);
  assert.match(contentLayout, /<Footer \/>/);
});

test("beta recent episodes preserve exact desktop geometry and responsive tracks", () => {
  const source = readSource("src/features/homepage/components/recent-episodes.tsx");
  const cardSource = readSource("src/features/episodes/components/episode-card.tsx");

  assert.match(source, /lg:h-\[1084px\]/);
  assert.match(source, /grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-\[412px_412px\]/);
  assert.match(source, /<EpisodeCard episode=\{episode\} key=\{episode\.slug\} \/>/);
  assert.match(cardSource, /alt=\{`Capa do episódio \$\{episode\.number\}: \$\{episode\.title\}`\}/);
  assert.match(cardSource, /alt=\{episode\.guestName\}/);
});

test("beta fixtures append the exact six-card episode sequence without replacing EP 142", () => {
  const source = readSource("src/features/episodes/mock/episodes.mock.ts");
  const numbers = [...source.matchAll(/number: (\d+),/g)].map((match) => Number(match[1]));

  assert.deepEqual(numbers, [142, 141, 140, 139, 138, 137, 136]);
  for (const guest of ["Camila Ferreira", "Diego Andrade", "Juliana Prado"]) {
    assert.ok(source.includes(`guestName: "${guest}"`), `missing beta guest ${guest}`);
  }
});
