import assert from "node:assert/strict";
import test from "node:test";

const podcastEpisodeJsonLd = (episode, baseUrl) => ({
  "@context": "https://schema.org",
  "@type": "PodcastEpisode",
  name: episode.title,
  datePublished: episode.publishedAt,
  url: `${baseUrl}/episodes/${episode.slug}`
});

test("podcastEpisodeJsonLd returns required fields", () => {
  const jsonLd = podcastEpisodeJsonLd(
    {
      slug: "entrevista-tecnica-2026",
      title: "Como passar numa entrevista técnica em 2026",
      publishedAt: "2026-06-12"
    },
    "https://cafedebug.com.br"
  );

  assert.equal(jsonLd["@context"], "https://schema.org");
  assert.equal(jsonLd["@type"], "PodcastEpisode");
  assert.equal(jsonLd.name, "Como passar numa entrevista técnica em 2026");
  assert.equal(jsonLd.url, "https://cafedebug.com.br/episodes/entrevista-tecnica-2026");
  assert.equal(jsonLd.datePublished, "2026-06-12");
});
