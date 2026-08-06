import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { env } from "@/lib/env";
import { buildEpisodeMetadata } from "@/lib/seo/metadata";

import { EpisodeDetailPage } from "../components/episode-detail-page";
import { getEpisode, getEpisodeDetail } from "./get-episode";
import { listEpisodes } from "./list-episodes";
import { episodeBreadcrumbJsonLd, podcastEpisodeJsonLd } from "../structured-data";

export async function getEpisodeStaticParams() {
  const episodes = await listEpisodes();
  return episodes.map((episode) => ({ slug: episode.slug }));
}

export async function getEpisodeDetailMetadata(slug: string): Promise<Metadata> {
  const episode = await getEpisode(slug);
  return episode ? buildEpisodeMetadata(episode) : {};
}

export async function EpisodeDetailRoute({ slug }: { slug: string }) {
  const detail = await getEpisodeDetail(slug);

  if (!detail) {
    notFound();
  }

  const { content, episode } = detail;

  const relatedEpisodes = (await listEpisodes()).filter((item) => item.slug !== episode.slug).slice(0, 3);
  const jsonLd = podcastEpisodeJsonLd(episode, env.NEXT_PUBLIC_SITE_URL);
  const breadcrumbJsonLd = episodeBreadcrumbJsonLd(episode, env.NEXT_PUBLIC_SITE_URL);

  return (
    <>
      <EpisodeDetailPage content={content} episode={episode} relatedEpisodes={relatedEpisodes} />
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} type="application/ld+json" />
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} type="application/ld+json" />
    </>
  );
}
