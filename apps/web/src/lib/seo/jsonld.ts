import type { Organization, PodcastSeries, WithContext } from "schema-dts";

export function organizationJsonLd(baseUrl: string): WithContext<Organization> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CafeDebug",
    url: baseUrl
  };
}

export function podcastSeriesJsonLd(baseUrl: string): WithContext<PodcastSeries> {
  return {
    "@context": "https://schema.org",
    "@type": "PodcastSeries",
    name: "CafeDebug",
    url: baseUrl,
    inLanguage: "pt-BR"
  };
}
