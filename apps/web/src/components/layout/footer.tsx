export function Footer() {
  return (
    <footer className="bg-footer text-footer-foreground">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <p className="font-mono font-bold">Café<span className="text-primary">Debug</span></p>
        <p className="mt-3 max-w-md text-sm text-muted-foreground">Conversas profundas sobre carreira, tecnologia e a comunidade de desenvolvimento.</p>
        <p className="mt-8 text-xs text-muted-foreground">© {new Date().getFullYear()} CafeDebug.</p>
      </div>
    </footer>
  );
}
