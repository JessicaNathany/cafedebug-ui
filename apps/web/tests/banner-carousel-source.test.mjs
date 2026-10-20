import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const root = process.cwd();
const readSource = (file) => readFileSync(join(root, file), "utf8");

test("Homepage Beta banners source uses backend endpoint without fixture fallback", () => {
  const source = readSource("src/features/banners/server/list-homepage-banners.ts");

  assert.match(source, /\/api\/v1\/public\/banners\/latest/);
  assert.match(source, /next: \{ revalidate: 60 \}/);
  assert.doesNotMatch(source, /mockHomepageBanners|homepage-banners\.mock/);
});

test("BannerCarousel is the only interactive banner boundary and never autoplays", () => {
  const source = readSource("src/features/banners/components/banner-carousel.tsx");

  assert.match(source, /^"use client";/);
  assert.match(source, /useState\(0\)/);
  assert.match(source, /aria-roledescription="carousel"/);
  assert.match(source, /role="tablist"/);
  assert.match(source, /role="tab"/);
  assert.match(source, /role="tabpanel"/);
  assert.match(source, /aria-selected=\{index === activeIndex\}/);
  assert.match(source, /tabIndex=\{index === activeIndex \? 0 : -1\}/);
  assert.match(source, /hidden=\{!isActive\}/);
  assert.match(source, /aria-controls=\{`homepage-banner-panel-\$\{banner\.id\}`\}/);
  assert.match(source, /case "ArrowLeft"/);
  assert.match(source, /case "ArrowRight"/);
  assert.match(source, /case "Home"/);
  assert.match(source, /case "End"/);
  assert.match(source, /\(index \+ banners\.length\) % banners\.length/);
  assert.doesNotMatch(source, /setInterval|setTimeout|autoplay/i);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /#[0-9a-fA-F]{3,8}/, "carousel colors must remain token-backed");
});

test("carousel CTA semantics distinguish playable, linked, and deferred actions", () => {
  const source = readSource("src/features/banners/components/banner-carousel.tsx");

  assert.match(source, /cta\.action === "play-featured"/);
  assert.match(source, /<PlayButton[^>]+episode=\{episode\}/);
  assert.match(source, /cta\.action === "episodes-anchor"/);
  assert.match(source, /<Link className=\{className\} href="\/episodes">/);
  assert.match(source, /cta\.action === "external-link"/);
  assert.match(source, /<a\s+className=\{className\}[\s\S]*href=\{cta\.href\}/);
  assert.match(source, /<button aria-disabled="true"[^>]+type="button">/);
  assert.doesNotMatch(source, /disabled=\{true\}|\sdisabled(?:\s|>)/);
});
