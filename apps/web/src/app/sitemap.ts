import type { MetadataRoute } from "next";

import { listEpisodes } from "@/features/episodes/server/list-episodes";
import { env } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const episodes = await listEpisodes();

  return [
    { url: env.NEXT_PUBLIC_SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${env.NEXT_PUBLIC_SITE_URL}/episodes`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${env.NEXT_PUBLIC_SITE_URL}/about`, changeFrequency: "monthly", priority: 0.7 },
    ...episodes.map((episode) => ({
      url: `${env.NEXT_PUBLIC_SITE_URL}/episodes/${episode.slug}`,
      lastModified: new Date(`${episode.publishedAt}T00:00:00.000Z`),
      changeFrequency: "weekly" as const,
      priority: 0.8
    }))
  ];
}
