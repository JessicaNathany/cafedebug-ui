import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const root = process.cwd();
const readSource = (file) => readFileSync(join(root, file), "utf8");

test("Homepage Beta banner fixtures retain Pencil order, copy, CTA intent, and local provenance", () => {
  const source = readSource("src/features/banners/mock/homepage-banners.mock.ts");

  for (const copy of [
    "Dê o próximo passo na sua carreira dev",
    "Seis meses de conversas que mudam carreiras",
    "CaféDebug ao vivo, pela primeira vez",
    "Feito com a comunidade, para a comunidade",
    "Ouvir agora",
    "Ver todos os episódios",
    "Entrar na comunidade",
    "Ver episódios"
  ]) {
    assert.ok(source.includes(copy), `missing authored banner copy: ${copy}`);
  }

  assert.deepEqual(
    [...source.matchAll(/tabLabel: "([^"]+)"/g)].map((match) => match[1]),
    ["DESTAQUE", "TEMPORADA", "AO VIVO", "COMUNIDADE"]
  );
  assert.equal((source.match(/action: "disabled"/g) ?? []).length, 5);
  assert.equal((source.match(/action: "episodes-anchor"/g) ?? []).length, 2);
  assert.equal((source.match(/action: "play-featured"/g) ?? []).length, 1);
  assert.equal((source.match(/imageUrl: "\/mock\/home-beta-banner-/g) ?? []).length, 4);
  assert.equal((source.match(/sourcePhotoUrl: "https:\/\/images\.unsplash\.com\//g) ?? []).length, 4);
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
  assert.match(source, /<Link className=\{className\} href="#episodios">/);
  assert.match(source, /<button aria-disabled="true"[^>]+type="button">/);
  assert.doesNotMatch(source, /disabled=\{true\}|\sdisabled(?:\s|>)/);
});
