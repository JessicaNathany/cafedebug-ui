export default function EpisodeLoading() {
  return (
    <main aria-busy="true" className="w-full bg-background px-4 pb-20 pt-9 text-foreground sm:px-6 md:px-10">
      <p className="sr-only" role="status">
        Carregando episódio
      </p>
      <div className="mx-auto grid w-full max-w-340 gap-12">
        <div className="h-4 w-48 animate-pulse rounded-pill bg-secondary" />
        <div className="grid gap-8 md:grid-cols-[380px_minmax(0,1fr)] md:gap-11">
          <div className="aspect-square animate-pulse rounded-m bg-card" />
          <div className="grid content-center gap-4">
            <div className="h-8 w-20 animate-pulse rounded-pill bg-secondary" />
            <div className="h-14 w-full animate-pulse rounded-m bg-card" />
            <div className="h-10 w-2/3 animate-pulse rounded-m bg-card" />
            <div className="h-12 w-1/2 animate-pulse rounded-m bg-card" />
          </div>
        </div>
        <div className="h-45 animate-pulse rounded-m bg-card" />
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="grid gap-12">
            <div className="h-45 animate-pulse rounded-m bg-card" />
            <div className="h-103 animate-pulse rounded-m bg-card" />
          </div>
          <div className="grid gap-12">
            <div className="h-72 animate-pulse rounded-m bg-card" />
            <div className="h-90 animate-pulse rounded-m bg-card" />
          </div>
        </div>
        <div className="grid max-w-215 gap-4">
          <div className="h-8 w-48 animate-pulse rounded-pill bg-secondary" />
          <div className="h-20 animate-pulse rounded-m bg-card" />
          <div className="h-30 animate-pulse rounded-m bg-card" />
        </div>
        <div className="grid gap-6">
          <div className="h-8 w-72 animate-pulse rounded-pill bg-secondary" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2].map((slot) => <div className="h-103 animate-pulse rounded-m bg-card" key={slot} />)}
          </div>
        </div>
      </div>
    </main>
  );
}
