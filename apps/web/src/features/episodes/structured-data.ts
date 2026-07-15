import type { PodcastEpisode, WithContext } from "schema-dts";

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
