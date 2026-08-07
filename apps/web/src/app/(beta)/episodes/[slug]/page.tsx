import type { Metadata } from "next";

import { EpisodeDetailRoute, getEpisodeDetailMetadata, getEpisodeStaticParams } from "@/features/episodes/server/episode-detail-route";

type EpisodePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getEpisodeStaticParams();
}

export async function generateMetadata({ params }: EpisodePageProps): Promise<Metadata> {
  const { slug } = await params;
  return getEpisodeDetailMetadata(slug);
}

export default async function EpisodePage({ params }: EpisodePageProps) {
  const { slug } = await params;
  return <EpisodeDetailRoute slug={slug} />;
}
