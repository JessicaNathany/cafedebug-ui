import type { Episode } from "../types";

type ShowNotesProps = {
  episode: Episode;
};

export function ShowNotes({ episode }: ShowNotesProps) {
  return (
    <section aria-labelledby="episode-show-notes-title" className="grid min-w-0 grid-cols-1 gap-4" id="show-notes">
      <h2 className="font-primary text-2xl font-bold leading-tight text-foreground" id="episode-show-notes-title">Sobre este episódio</h2>
      <div className="prose font-secondary text-base text-muted-foreground" dangerouslySetInnerHTML={{ __html: episode.showNotesHtml }} />
    </section>
  );
}
