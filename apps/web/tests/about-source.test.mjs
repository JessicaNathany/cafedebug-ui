import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { getAboutMetadata } from "../src/features/about/metadata.ts";
import { mockAboutContent } from "../src/features/about/mock/about.mock.ts";
import { createMockAboutContentReader } from "../src/features/about/services/get-about-content.ts";

const root = process.cwd();
const readSource = (file) => readFileSync(join(root, file), "utf8");

test("About fixtures preserve the Pencil content and chronology", () => {
  assert.deepEqual(mockAboutContent.hero.metrics.map((metric) => `${metric.value} ${metric.label}`), [
    "180+ episódios publicados",
    "6 anos no ar, sem pausa",
    "320k+ ouvintes na comunidade"
  ]);
  assert.deepEqual(mockAboutContent.mission.values.map((value) => [value.title, value.icon]), [
    ["Conversas reais", "mic"],
    ["Comunidade primeiro", "users"],
    ["Acesso aberto", "heart"],
    ["Carreira sem hype", "compass"]
  ]);
  assert.deepEqual(mockAboutContent.impact.metrics.map((metric) => metric.value), ["320k+", "12.4k", "8.7M", "1.2k+"]);
  assert.deepEqual(mockAboutContent.journey.milestones.map((milestone) => `${milestone.year} ${milestone.title}`), [
    "2018 O primeiro episódio",
    "2019 A comunidade nasce",
    "2021 100 episódios",
    "2023 Eventos presenciais",
    "2026 CaféDebug 2.0"
  ]);
});

test("About's local reader returns deterministic fixture content without a network boundary", async () => {
  const reader = createMockAboutContentReader();

  assert.deepEqual(await reader.read(), mockAboutContent);
  assert.doesNotMatch(readSource("src/features/about/services/get-about-content.ts"), /fetch\(/);
});

test("About route is thin, indexable, and delegates to the feature server composition", () => {
  const routeSource = readSource("src/app/(beta)/about/page.tsx");
  const metadata = getAboutMetadata();

  assert.match(routeSource, /getAboutMetadata/);
  assert.match(routeSource, /AboutRoute/);
  assert.doesNotMatch(routeSource, /<Header|<Footer|fetch\(|mock/);
  assert.equal(metadata.alternates?.canonical, "/about");
  assert.equal(metadata.robots?.index, true);
  assert.equal(metadata.robots?.follow, true);
  assert.equal(metadata.openGraph?.type, "website");
  assert.match(readSource("src/app/sitemap.ts"), /\$\{env\.NEXT_PUBLIC_SITE_URL\}\/about/);
});

test("About content uses semantic landmarks and keeps decoration outside the accessibility tree", () => {
  const pageSource = readSource("src/features/about/components/about-page.tsx");
  const valueCardSource = readSource("src/features/about/components/about-value-card.tsx");
  const metricsSource = readSource("src/features/about/components/about-impact-metrics.tsx");
  const timelineSource = readSource("src/features/about/components/about-timeline.tsx");

  assert.match(pageSource, /<main/);
  assert.match(pageSource, /<h1/);
  assert.match(pageSource, /aria-labelledby="about-purpose-title"/);
  assert.match(pageSource, /aria-labelledby="about-impact-title"/);
  assert.match(pageSource, /aria-labelledby="about-journey-title"/);
  assert.match(pageSource, /about-purpose-title" className="border-y border-border/);
  assert.match(pageSource, /about-journey-title" className="border-t border-border/);
  assert.match(valueCardSource, /<article/);
  assert.match(valueCardSource, /rounded-m border border-border bg-background/);
  assert.match(valueCardSource, /aria-hidden/);
  assert.match(metricsSource, /<dl/);
  assert.match(metricsSource, /rounded-m border border-border bg-card/);
  assert.match(metricsSource, /xl:divide-x xl:divide-border/);
  assert.match(metricsSource, /<dt/);
  assert.match(metricsSource, /<dd/);
  assert.match(pageSource, /<dt className="order-2[\s\S]*<dd className="order-1/);
  assert.match(metricsSource, /<dt className="order-2[\s\S]*<dd className="order-1/);
  assert.match(timelineSource, /<ol/);
  assert.match(timelineSource, /<time/);
  assert.match(timelineSource, /dateTime=\{milestone\.year\}/);
  assert.match(timelineSource, /aria-hidden/);
  assert.match(timelineSource, /<article/);
});

test("About's feature tree is server-first, token-backed, and reflows without page-local shared chrome", () => {
  const featureSources = [
    "src/features/about/components/about-impact-metrics.tsx",
    "src/features/about/components/about-page.tsx",
    "src/features/about/components/about-timeline.tsx",
    "src/features/about/components/about-value-card.tsx",
    "src/features/about/metadata.ts",
    "src/features/about/mock/about.mock.ts",
    "src/features/about/server/about-route.tsx",
    "src/features/about/services/get-about-content.ts",
    "src/features/about/types.ts"
  ].map(readSource);
  const pageSource = readSource("src/features/about/components/about-page.tsx");
  const timelineSource = readSource("src/features/about/components/about-timeline.tsx");

  assert.ok(featureSources.every((source) => !source.includes("fetch(")));
  assert.ok(featureSources.every((source) => !source.includes('"use client"')));
  assert.ok(featureSources.every((source) => !source.includes("'use client'")));
  assert.doesNotMatch(pageSource, /<Header|<Footer|MiniPlayer/);
  assert.match(pageSource, /grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4/);
  assert.match(pageSource, /xl:min-h-\[648px\]/);
  assert.match(timelineSource, /grid-cols-\[24px_minmax\(0,1fr\)\]/);
  assert.doesNotMatch(featureSources.join("\n"), /#[0-9a-fA-F]{3,8}/);
});
