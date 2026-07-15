import type { MetadataRoute } from "next";

import { listEpisodes } from "@/features/episodes/server/list-episodes";
import { env } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const episodes = await listEpisodes();

  return [
    { url: env.NEXT_PUBLIC_SITE_URL, changeFrequency: "weekly", priority: 1 },
    ...episodes.map((episode) => ({
      url: `${env.NEXT_PUBLIC_SITE_URL}/episodes/${episode.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8
    }))
  ];
}
