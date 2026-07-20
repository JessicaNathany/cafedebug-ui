import Link from "next/link";

const items: Array<
  | { label: string; href: string; active?: boolean }
  | { label: string; disabled: true }
> = [
  { label: "Início", href: "/", active: true },
  { label: "Episódios", href: "/#episodios" },
  { label: "Notícias", disabled: true },
  { label: "Eventos", disabled: true },
  { label: "Vagas", disabled: true },
  { label: "Time", disabled: true },
  { label: "Sobre", disabled: true }
];

export function Nav() {
  return (
    <nav aria-label="Navegação principal" className="hidden items-center gap-7 text-sm md:flex">
      {items.map((item) => {
        if ("href" in item) {
          return (
            <Link
              className={item.active ? "font-semibold text-foreground" : "text-muted-foreground hover:text-foreground"}
              href={item.href}
              key={item.label}
            >
              {item.label}
            </Link>
          );
        }

        return (
          <span
            aria-disabled="true"
            className="cursor-not-allowed text-muted-foreground/70"
            key={item.label}
          >
            {item.label}
          </span>
        );
      })}
    </nav>
  );
}
