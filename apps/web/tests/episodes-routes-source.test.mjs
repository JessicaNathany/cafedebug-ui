import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const root = process.cwd();
const readSource = (file) => readFileSync(join(root, file), "utf8");

test("episode list app route stays a thin routing and metadata adapter", () => {
  const source = readSource("src/app/(beta)/episodes/page.tsx");

  assert.match(source, /EpisodesListRoute, getEpisodesListMetadata/);
  assert.match(source, /return getEpisodesListMetadata\(await searchParams\)/);
  assert.match(source, /return <EpisodesListRoute searchParams=\{await searchParams\} \/>/);
  assert.doesNotMatch(source, /fetch\(|mockEpisodes|episodeListQuerySchema/);
});

test("episode catalogue and detail inherit the Homepage Beta shell without duplicating chrome", () => {
  const betaLayoutSource = readSource("src/app/(beta)/layout.tsx");
  const listRouteSource = readSource("src/app/(beta)/episodes/page.tsx");
  const detailRouteSource = readSource("src/app/(beta)/episodes/[slug]/page.tsx");

  assert.match(betaLayoutSource, /<Header initialTheme=\{theme\} variant="beta" \/>/);
  assert.match(betaLayoutSource, /<Footer variant="beta" \/>/);
  assert.match(listRouteSource, /EpisodesListRoute/);
  assert.match(detailRouteSource, /EpisodeDetailRoute/);
  assert.doesNotMatch(detailRouteSource, /Header|Footer/);
  assert.equal(existsSync(join(root, "src/app/(content)/episodes/[slug]/page.tsx")), false);
});

test("episode list feature route owns query parsing, canonical redirects, and list state", () => {
  const source = readSource("src/features/episodes/server/episodes-list-route.tsx");

  assert.match(source, /parseEpisodeListQuery\(searchParams\)/);
  assert.match(source, /if \(parsed\.requiresRedirect\)/);
  assert.match(source, /redirect\(buildEpisodesUrl\(parsed\.query\)\)/);
  assert.match(source, /result\.totalItems > 0 && result\.page > result\.totalPages/);
  assert.match(source, /episodeCollectionJsonLd/);
  assert.doesNotMatch(source, /fetch\(/);
});

test("episode catalogue controls preserve GET search, semantic filters, and pagination state", () => {
  const searchSource = readSource("src/features/episodes/components/episode-search-form.tsx");
  const filtersSource = readSource("src/features/episodes/components/episode-category-filters.tsx");
  const paginationSource = readSource("src/features/episodes/components/episode-pagination.tsx");
  const sortSource = readSource("src/features/episodes/components/episode-sort-selector.tsx");

  assert.match(searchSource, /action="\/episodes"/);
  assert.match(searchSource, /method="get"/);
  assert.match(searchSource, /role="search"/);
  assert.match(filtersSource, /aria-label="Filtrar episódios por categoria"/);
  assert.match(filtersSource, /buildEpisodesUrl/);
  assert.match(filtersSource, /h-10 items-center/);
  assert.match(filtersSource, /h-8 items-center/);
  assert.match(filtersSource, /gap-2\.5/);
  assert.match(filtersSource, /shadow-pencil-subtle/);
  assert.match(paginationSource, /aria-label="Paginação de episódios"/);
  assert.match(paginationSource, /aria-current=\{isCurrentPage \? "page" : undefined\}/);
  assert.match(paginationSource, /getVisiblePageItems/);
  assert.match(paginationSource, /aria-hidden="true"/);
  assert.match(paginationSource, /Previous/);
  assert.match(paginationSource, /Next/);
  assert.match(paginationSource, /font-primary text-sm font-medium/);
  assert.match(paginationSource, /font-secondary text-sm font-medium/);
  assert.match(paginationSource, /ring-1 ring-inset ring-border shadow-pencil-subtle/);
  assert.match(searchSource, /name="ordenar"/);
  assert.match(filtersSource, /activeQuery\.sort/);
  assert.match(sortSource, /<details/);
  assert.match(sortSource, /<summary/);
  assert.match(sortSource, /w-full shrink-0 lg:w-fit/);
  assert.match(sortSource, /h-\[50px\].*px-\[18px\].*text-\[15px\]/);
  assert.match(sortSource, /ml-auto.*lg:ml-0/);
  assert.match(sortSource, /episodeSortOptions\.map/);
  assert.match(sortSource, /buildEpisodesUrl/);
  assert.match(sortSource, /option\.key === "recentes"/);
  assert.match(readSource("src/features/episodes/types.ts"), /Mais antigos/);
});

test("episode cards distinguish opening the detail page from playback", () => {
  const source = readSource("src/features/episodes/components/episode-card.tsx");

  assert.match(source, /const episodeHref = `\/episodes\/\$\{episode\.slug\}`/);
  assert.match(source, /aria-label=\{`Abrir episódio \$\{episode\.number\}: \$\{episode\.title\}`\}/);
  assert.match(source, /<PlayButton[^>]+label=\{`Reproduzir episódio \$\{episode\.number\}`\}/);
  assert.match(source, /<h2[^>]*>[\s\S]*?<Link[^>]+href=\{episodeHref\}/);
  assert.doesNotMatch(source, />\s*Abrir episódio\s*<\/Link>/);
});

test("SEO additions keep collection and detail links canonical and sitemap-safe", () => {
  const structuredDataSource = readSource("src/features/episodes/structured-data.ts");
  const sitemapSource = readSource("src/app/sitemap.ts");

  assert.match(structuredDataSource, /episodeCollectionJsonLd/);
  assert.match(structuredDataSource, /episodeBreadcrumbJsonLd/);
  assert.match(structuredDataSource, /"@type": "CollectionPage"/);
  assert.match(structuredDataSource, /"@type": "BreadcrumbList"/);
  assert.match(sitemapSource, /\$\{env\.NEXT_PUBLIC_SITE_URL\}\/episodes/);
  assert.match(sitemapSource, /lastModified: new Date\(`\$\{episode\.publishedAt\}T00:00:00\.000Z`\)/);
});

test("episode detail owns a recovery boundary distinct from the catalogue error state", () => {
  const source = readSource("src/app/(beta)/episodes/[slug]/error.tsx");

  assert.match(source, /Não foi possível carregar este episódio/);
  assert.match(source, /onClick=\{reset\}/);
  assert.match(source, /href="\/episodes"/);
});

test("episode detail composes P10 regions and P12 controls through the feature seam", () => {
  const detailPageSource = readSource("src/features/episodes/components/episode-detail-page.tsx");
  const detailRouteSource = readSource("src/features/episodes/server/episode-detail-route.tsx");
  const detailServiceSource = readSource("src/features/episodes/services/episode-catalog.service.ts");
  const heroActionsSource = readSource("src/features/episodes/components/episode-hero-actions.tsx");
  const guestCardSource = readSource("src/features/episodes/components/episode-guest-card.tsx");
  const commentsSource = readSource("src/features/episodes/components/episode-comments.tsx");
  const commentTypesSource = readSource("src/features/episodes/types.ts");
  const playerSource = readSource("src/features/player/full-player.tsx");
  const loadingSource = readSource("src/app/(beta)/episodes/[slug]/loading.tsx");

  assert.match(detailPageSource, /EpisodeChapters/);
  assert.match(detailPageSource, /EpisodeGuestCard/);
  assert.match(detailPageSource, /EpisodeResources/);
  assert.match(detailPageSource, /EpisodeComments/);
  assert.match(detailRouteSource, /getEpisodeDetail\(slug\)/);
  assert.match(detailServiceSource, /getDetailBySlug/);
  assert.doesNotMatch(detailRouteSource, /fetch\(/);
  assert.match(playerSource, /TOCANDO AGORA/);
  assert.match(playerSource, /Voltar 15s/);
  assert.match(playerSource, /Avançar 15s/);
  assert.match(playerSource, /href="#capitulos"/);
  assert.match(playerSource, /Capítulos/);
  assert.match(heroActionsSource, /border border-border bg-card/);
  assert.match(guestCardSource, /label === "LinkedIn"/);
  assert.match(guestCardSource, /label === "GitHub"/);
  assert.match(commentsSource, /Heart/);
  assert.match(commentsSource, /Reply/);
  assert.match(commentsSource, /aria-pressed=\{isLiked\}/);
  assert.match(commentsSource, /replyToComment/);
  assert.match(commentTypesSource, /likes: number/);
  assert.match(loadingSource, /h-103/);
  assert.match(loadingSource, /lg:grid-cols-\[minmax\(0,1fr\)_360px\]/);
});
