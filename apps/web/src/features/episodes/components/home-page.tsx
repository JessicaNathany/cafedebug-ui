import { listEpisodes } from "../server/list-episodes";
import { EpisodeCard } from "./episode-card";

export async function HomePage() {
  const episodes = await listEpisodes();

  return (
    <main>
      <section className="bg-background px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-sm text-primary">PODCAST E COMUNIDADE</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold sm:text-6xl">Conversas que ajudam a construir software melhor.</h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">Conteúdo para quem vive tecnologia, arquitetura e carreira todos os dias.</p>
        </div>
      </section>
      <section className="px-6 py-16" id="episodios">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-sm text-primary">EPISÓDIOS RECENTES</p>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {episodes.map((episode) => <EpisodeCard episode={episode} key={episode.slug} />)}
          </div>
        </div>
      </section>
    </main>
  );
}
