import type { Metadata } from "next";

import { EpisodesListRoute, getEpisodesListMetadata } from "@/features/episodes/server/episodes-list-route";
import type { EpisodeListSearchParams } from "@/features/episodes/episode-list-query";

type EpisodesPageProps = {
  searchParams: Promise<EpisodeListSearchParams>;
};

export async function generateMetadata({ searchParams }: EpisodesPageProps): Promise<Metadata> {
  return getEpisodesListMetadata(await searchParams);
}

export default async function EpisodesPage({ searchParams }: EpisodesPageProps) {
  return <EpisodesListRoute searchParams={await searchParams} />;
}
