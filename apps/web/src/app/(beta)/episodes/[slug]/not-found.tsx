import Link from "next/link";

export default function EpisodeDetailNotFound() {
  return (
    <main className="w-full bg-background px-4 py-16 text-foreground sm:px-6 md:px-10 lg:px-16">
      <section aria-labelledby="episode-detail-not-found-title" className="mx-auto grid w-full max-w-xl gap-4 rounded-m bg-card p-6 ring-1 ring-inset ring-border">
        <p className="font-primary text-xs font-semibold tracking-widest text-primary">EPISÓDIO</p>
        <h1 className="font-secondary text-2xl font-bold" id="episode-detail-not-found-title">
          Episódio não encontrado
        </h1>
        <p className="font-secondary text-sm leading-relaxed text-muted-foreground">O episódio que você procurou não está disponível no catálogo.</p>
        <Link className="inline-flex h-10 w-fit items-center justify-center rounded-pill bg-primary px-4 font-primary text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" href="/episodes">
          Ver todos os episódios
        </Link>
      </section>
    </main>
  );
}
