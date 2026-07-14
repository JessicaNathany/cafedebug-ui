import type { Episode } from "../types";

export function EpisodeCard({ episode }: { episode: Episode }) {
  return (
    <article className="rounded-[--radius-m] bg-card p-6 shadow-card">
      <p className="font-mono text-xs text-primary">EP {episode.number}</p>
      <h2 className="mt-3 text-xl font-semibold">{episode.title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{episode.summary}</p>
    </article>
  );
}
