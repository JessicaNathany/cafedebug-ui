export default function EpisodesLoading() {
  return (
    <main aria-busy="true" className="w-full bg-background px-4 pb-20 pt-14 text-foreground sm:px-6 md:px-10 lg:px-16">
      <p className="sr-only" role="status">
        Carregando episódios
      </p>
      <div className="mx-auto grid w-full max-w-[1312px] gap-10 lg:w-[calc(100vw-8rem)]">
        <div className="grid min-h-40 max-w-3xl gap-3">
          <div className="h-4 w-24 animate-pulse rounded-pill bg-secondary" />
          <div className="h-14 w-full animate-pulse rounded-m bg-card" />
          <div className="h-5 w-2/3 animate-pulse rounded-pill bg-secondary" />
        </div>
        <div className="grid gap-11">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="h-12 w-full animate-pulse rounded-pill bg-card lg:max-w-130" />
            <div className="h-12 w-58 animate-pulse rounded-pill bg-card" />
          </div>
          <div className="h-10 w-full animate-pulse rounded-pill bg-secondary" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div className="h-103 animate-pulse rounded-m bg-card" key={index} />
          ))}
        </div>
        <div className="flex h-16 items-end justify-center">
          <div className="h-10 w-64 animate-pulse rounded-pill bg-secondary" />
        </div>
      </div>
    </main>
  );
}
