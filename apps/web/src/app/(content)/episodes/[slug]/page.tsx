import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EpisodeHero } from "@/features/episodes/components/episode-hero";
import { EpisodeRelated } from "@/features/episodes/components/episode-related";
import { ShowNotes } from "@/features/episodes/components/show-notes";
import { episodeToTrack } from "@/features/episodes/mappers";
import { getEpisode } from "@/features/episodes/server/get-episode";
import { listEpisodes } from "@/features/episodes/server/list-episodes";
import { podcastEpisodeJsonLd } from "@/features/episodes/structured-data";
import { FullPlayer } from "@/features/player/full-player";
import { env } from "@/lib/env";
import { buildEpisodeMetadata } from "@/lib/seo/metadata";

type EpisodePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const episodes = await listEpisodes();
  return episodes.map((episode) => ({ slug: episode.slug }));
}

export async function generateMetadata({ params }: EpisodePageProps): Promise<Metadata> {
  const { slug } = await params;
  const episode = await getEpisode(slug);
  if (!episode) {
    return {};
  }
  return buildEpisodeMetadata(episode);
}

export default async function EpisodePage({ params }: EpisodePageProps) {
  const { slug } = await params;
  const episode = await getEpisode(slug);

  if (!episode) {
    notFound();
  }

  const allEpisodes = await listEpisodes();
  const related = allEpisodes.filter((item) => item.slug !== episode.slug).slice(0, 3);
  const jsonLd = podcastEpisodeJsonLd(episode, env.NEXT_PUBLIC_SITE_URL);

  return (
    <main className="space-y-10 px-6 py-10 md:px-10">
      <div className="mx-auto w-full max-w-[1200px] space-y-10">
        <EpisodeHero episode={episode} />
        <FullPlayer track={episodeToTrack(episode)} />
        <ShowNotes episode={episode} />
        <EpisodeRelated episodes={related} />
      </div>

      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} type="application/ld+json" />
    </main>
  );
}
