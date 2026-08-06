import type { BreadcrumbList, CollectionPage, PodcastEpisode, WithContext } from "schema-dts";

import type { Episode } from "./types";

export function podcastEpisodeJsonLd(
  episode: Episode,
  baseUrl: string
): WithContext<PodcastEpisode> {
  return {
    "@context": "https://schema.org",
    "@type": "PodcastEpisode",
    name: episode.title,
    description: episode.summary,
    datePublished: episode.publishedAt,
    duration: `PT${episode.durationMinutes}M`,
    url: `${baseUrl}/episodes/${episode.slug}`,
    associatedMedia: {
      "@type": "MediaObject",
      contentUrl: `${baseUrl}${episode.audioUrl}`
    },
    partOfSeries: {
      "@type": "PodcastSeries",
      name: "CafeDebug",
      url: baseUrl
    }
  };
}

export function episodeCollectionJsonLd(episodes: Episode[], baseUrl: string): WithContext<CollectionPage> {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Episódios do CaféDebug",
    url: `${baseUrl}/episodes`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: episodes.map((episode, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${baseUrl}/episodes/${episode.slug}`
      }))
    }
  } as WithContext<CollectionPage>;
}

export function episodeBreadcrumbJsonLd(episode: Episode, baseUrl: string): WithContext<BreadcrumbList> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Episódios", item: `${baseUrl}/episodes` },
      { "@type": "ListItem", position: 3, name: `EP ${episode.number}`, item: `${baseUrl}/episodes/${episode.slug}` }
    ]
  } as WithContext<BreadcrumbList>;
}
