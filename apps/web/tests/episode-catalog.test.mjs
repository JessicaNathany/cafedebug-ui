import assert from "node:assert/strict";
import test from "node:test";

import { buildEpisodesUrl, parseEpisodeListQuery } from "../src/features/episodes/episode-list-query.ts";
import { createMockEpisodeCatalog, EPISODE_LIST_PAGE_SIZE, mockEpisodeCatalog } from "../src/features/episodes/services/episode-catalog.service.ts";
import { episodeCategoryKeys } from "../src/features/episodes/types.ts";

test("the mock catalogue is newest-first and keeps the established listEpisodes fixture shape", async () => {
  const episodes = await mockEpisodeCatalog.listAll();

  assert.deepEqual(
    episodes.map((episode) => episode.number),
    [142, 141, 140, 139, 138, 137, 136]
  );
  assert.equal(episodes[0]?.categoryKey, "carreira");
});

test("episode detail content is resolved through the typed mock catalogue seam", async () => {
  const detail = await mockEpisodeCatalog.getDetailBySlug("entrevista-tecnica-2026");

  assert.ok(detail);
  assert.equal(detail.episode.number, 142);
  assert.equal(detail.content.chapters.length, 8);
  assert.equal(detail.content.resources.length, 5);
  assert.equal(detail.content.comments.length, 3);
  assert.deepEqual(detail.content.comments.map((comment) => comment.likes), [34, 12, 28]);
  assert.equal(detail.content.chapters[0]?.startSeconds, 0);
  assert.equal(await mockEpisodeCatalog.getDetailBySlug("slug-inexistente"), null);
});

test("the catalogue uses six items per page and retains query state for subsequent pages", async () => {
  const firstPage = await mockEpisodeCatalog.list({ page: 1 });
  const secondPage = await mockEpisodeCatalog.list({ page: 2 });

  assert.equal(firstPage.pageSize, EPISODE_LIST_PAGE_SIZE);
  assert.equal(firstPage.items.length, 6);
  assert.equal(firstPage.totalItems, 7);
  assert.equal(firstPage.totalPages, 2);
  assert.equal(secondPage.items.length, 1);
  assert.equal(secondPage.items[0]?.number, 136);
  assert.deepEqual(secondPage.activeQuery, {});
});

test("the catalogue supports an oldest-first order without changing the mock data source", async () => {
  const result = await mockEpisodeCatalog.list({ sort: "antigos", page: 1 });

  assert.deepEqual(result.items.map((episode) => episode.number), [136, 137, 138, 139, 140, 141]);
  assert.deepEqual(result.activeQuery, { sort: "antigos" });
});

test("search is case- and accent-insensitive across episode fields", async () => {
  const titleSearch = await mockEpisodeCatalog.list({ q: "negociacao", page: 1 });
  const guestSearch = await mockEpisodeCatalog.list({ q: "MARCOS VINICIUS", page: 1 });
  const categorySearch = await mockEpisodeCatalog.list({ q: "testes", page: 1 });

  assert.deepEqual(titleSearch.items.map((episode) => episode.slug), ["negociacao-salarial-senior"]);
  assert.deepEqual(guestSearch.items.map((episode) => episode.slug), ["negociacao-salarial-senior"]);
  assert.deepEqual(categorySearch.items.map((episode) => episode.slug), ["tdd-sem-dogma"]);
});

test("every valid filter key is accepted, including valid keys with no mock fixtures", async () => {
  for (const category of episodeCategoryKeys) {
    const result = await mockEpisodeCatalog.list({ category, page: 1 });

    assert.equal(result.activeQuery.category, category);
    assert.ok(result.items.every((episode) => episode.categoryKey === category));
  }
});

test("a valid query with no matching episodes returns an empty result rather than an error", async () => {
  const result = await mockEpisodeCatalog.list({ category: "mobile", page: 1 });

  assert.equal(result.totalItems, 0);
  assert.equal(result.totalPages, 0);
  assert.deepEqual(result.items, []);
});

test("query parsing distinguishes canonicalization from not-found input", () => {
  const canonicalized = parseEpisodeListQuery({
    q: "  arquitetura   distribuida ",
    categoria: "BACKEND",
    ordenar: "ANTIGOS",
    pagina: "02"
  });
  const emptyValues = parseEpisodeListQuery({ q: "", categoria: "", pagina: "" });
  const unknownCategory = parseEpisodeListQuery({ categoria: "dados" });
  const invalidPage = parseEpisodeListQuery({ pagina: "0" });

  assert.deepEqual(canonicalized, {
    status: "valid",
    query: { q: "arquitetura distribuida", category: "backend", sort: "antigos", page: 2 },
    requiresRedirect: true
  });
  assert.deepEqual(emptyValues, {
    status: "valid",
    query: { page: 1 },
    requiresRedirect: true
  });
  assert.deepEqual(unknownCategory, { status: "not-found", reason: "unknown-category" });
  assert.deepEqual(invalidPage, { status: "not-found", reason: "invalid-page" });
  assert.deepEqual(parseEpisodeListQuery({ ordenar: "cronologico" }), { status: "not-found", reason: "unknown-sort" });
  assert.deepEqual(parseEpisodeListQuery({ ordenar: "recentes" }), {
    status: "valid",
    query: { page: 1 },
    requiresRedirect: true
  });
});

test("catalogue URLs use normalized q, categoria, ordenar, pagina order and omit defaults", () => {
  assert.equal(buildEpisodesUrl({}), "/episodes");
  assert.equal(buildEpisodesUrl({ page: 2 }), "/episodes?pagina=2");
  assert.equal(buildEpisodesUrl({ q: " api  design ", category: "backend", sort: "antigos", page: 2 }), "/episodes?q=api+design&categoria=backend&ordenar=antigos&pagina=2");
  assert.equal(buildEpisodesUrl({ category: "carreira", page: 1 }), "/episodes?categoria=carreira");
});

test("the test-only catalogue factory surfaces invalid fixtures through the feature schema", async () => {
  const catalog = createMockEpisodeCatalog({ fixtures: [{ slug: "invalid" }] });

  await assert.rejects(() => catalog.list({ page: 1 }));
});
