import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { env } from "@/lib/env";

import { EpisodesListPage } from "../components/episodes-list-page";
import { buildEpisodesUrl, parseEpisodeListQuery } from "../episode-list-query";
import { episodeCollectionJsonLd } from "../structured-data";
import type { EpisodeListSearchParams } from "../episode-list-query";
import { getEpisodeList } from "./get-episode-list";

function hasTransientQuery(searchParams: EpisodeListSearchParams) {
  const parsed = parseEpisodeListQuery(searchParams);
  return parsed.status === "valid" && (parsed.query.q !== undefined || parsed.query.category !== undefined || parsed.query.sort !== undefined);
}

export async function getEpisodesListMetadata(searchParams: EpisodeListSearchParams): Promise<Metadata> {
  const parsed = parseEpisodeListQuery(searchParams);
  const isTransientQuery = hasTransientQuery(searchParams);
  const canonical = parsed.status === "valid" && !isTransientQuery ? buildEpisodesUrl({ page: parsed.query.page }) : "/episodes";
  const pageTitle = parsed.status === "valid" && parsed.query.page > 1 ? `Episódios — Página ${parsed.query.page}` : "Episódios";

  return {
    title: pageTitle,
    description: "Explore os episódios do CaféDebug sobre carreira, tecnologia e a comunidade de desenvolvimento.",
    alternates: { canonical },
    robots: isTransientQuery ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      type: "website",
      title: "Episódios do CaféDebug",
      description: "Explore os episódios do CaféDebug sobre carreira, tecnologia e a comunidade de desenvolvimento.",
      url: canonical
    },
    twitter: { card: "summary_large_image" }
  };
}

export async function EpisodesListRoute({ searchParams }: { searchParams: EpisodeListSearchParams }) {
  const parsed = parseEpisodeListQuery(searchParams);

  if (parsed.status === "not-found") {
    notFound();
  }

  if (parsed.requiresRedirect) {
    redirect(buildEpisodesUrl(parsed.query));
  }

  const result = await getEpisodeList(parsed.query);
  if (result.totalItems > 0 && result.page > result.totalPages) {
    notFound();
  }

  const jsonLd = result.page === 1 && result.activeQuery.q === undefined && result.activeQuery.category === undefined && result.activeQuery.sort === undefined
    ? episodeCollectionJsonLd(result.items, env.NEXT_PUBLIC_SITE_URL)
    : null;

  return (
    <>
      <EpisodesListPage result={result} />
      {jsonLd ? <script dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} type="application/ld+json" /> : null}
    </>
  );
}
