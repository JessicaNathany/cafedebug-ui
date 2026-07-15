import type { Metadata } from "next";

import { env } from "@/lib/env";

import type { Episode } from "@/features/episodes/types";

export const defaultMetadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: { default: "CafeDebug", template: "%s · CafeDebug" },
  description: "Podcast e comunidade brasileira sobre desenvolvimento de software.",
  openGraph: {
    type: "website",
    siteName: "CafeDebug",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "CafeDebug" }]
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-default.png"]
  }
};

export function buildEpisodeMetadata(episode: Episode): Metadata {
  const canonicalUrl = `/episodes/${episode.slug}`;
  return {
    title: `EP ${episode.number} · ${episode.title}`,
    description: episode.summary,
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      type: "article",
      title: episode.title,
      description: episode.summary,
      url: canonicalUrl,
      images: [{ url: episode.artworkUrl, alt: episode.title }]
    },
    twitter: {
      card: "summary_large_image",
      images: [episode.artworkUrl]
    }
  };
}
