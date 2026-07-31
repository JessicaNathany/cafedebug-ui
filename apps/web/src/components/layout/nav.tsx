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
    <nav aria-label="Navegação principal" className="hidden items-center gap-7 font-secondary text-sm leading-5 lg:flex">
      {items.map((item) => {
        if ("href" in item) {
          return (
            <Link
              className={item.active ? "font-semibold text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" : "text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"}
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
            className="cursor-default text-muted-foreground"
            key={item.label}
          >
            {item.label}
          </span>
        );
      })}
    </nav>
  );
}
