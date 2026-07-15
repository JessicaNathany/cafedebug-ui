export default function NotFound() {
  return (
    <main className="px-6 py-16 md:px-10">
      <div className="mx-auto max-w-xl rounded-[--radius-m] border border-border bg-card p-6">
        <h1 className="text-2xl font-semibold">Página não encontrada</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          O conteúdo que você tentou acessar ainda não existe nesta fase da implementação.
        </p>
      </div>
    </main>
  );
}
