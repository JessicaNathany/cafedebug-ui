import type { Episode } from "../types";

type ShowNotesProps = {
  episode: Episode;
};

export function ShowNotes({ episode }: ShowNotesProps) {
  return (
    <section className="rounded-[--radius-m] border border-border bg-card p-6">
      <h2 className="text-2xl font-semibold">Sobre este episódio</h2>
      <div className="prose mt-4 text-muted-foreground" dangerouslySetInnerHTML={{ __html: episode.showNotesHtml }} />
    </section>
  );
}
