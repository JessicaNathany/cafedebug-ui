import { FullPlayer } from "@/features/player/full-player";

import { episodeToTrack } from "../mappers";
import type { Episode, EpisodeDetailContent } from "../types";
import { EpisodeBreadcrumb } from "./episode-breadcrumb";
import { EpisodeChapters } from "./episode-chapters";
import { EpisodeComments } from "./episode-comments";
import { EpisodeGuestCard } from "./episode-guest-card";
import { EpisodeHero } from "./episode-hero";
import { EpisodeRelated } from "./episode-related";
import { EpisodeResources } from "./episode-resources";
import { ShowNotes } from "./show-notes";

type EpisodeDetailPageProps = {
  content: EpisodeDetailContent;
  episode: Episode;
  relatedEpisodes: Episode[];
};

export function EpisodeDetailPage({ content, episode, relatedEpisodes }: EpisodeDetailPageProps) {
  const track = episodeToTrack(episode);

  return (
    <main className="w-full bg-background px-4 pb-20 pt-9 text-foreground sm:px-6 md:px-10">
      <div className="mx-auto grid w-full min-w-0 max-w-340 grid-cols-1 gap-12">
        <EpisodeBreadcrumb episode={episode} />
        <EpisodeHero episode={episode} />
        <FullPlayer track={track} />
        <section className="grid min-w-0 grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="grid min-w-0 grid-cols-1 content-start gap-12">
            <ShowNotes episode={episode} />
            <EpisodeChapters chapters={content.chapters} track={track} />
          </div>
          <aside className="grid min-w-0 grid-cols-1 content-start gap-5">
            <EpisodeGuestCard content={content} episode={episode} />
            <EpisodeResources resources={content.resources} />
          </aside>
        </section>
        <EpisodeComments avatarUrl={episode.guestAvatarUrl} comments={content.comments} />
        <EpisodeRelated episodes={relatedEpisodes} />
      </div>
    </main>
  );
}
