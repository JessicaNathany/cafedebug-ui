import type { ReactNode } from "react";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

const footerColumns = [
  {
    title: "Conteúdo",
    links: [
      { label: "Episódios", href: "/episodes" },
      { label: "Notícias", status: "Em breve" },
      { label: "Eventos", status: "Em breve" },
      { label: "Vagas", status: "Em breve" }
    ]
  },
  {
    title: "Comunidade",
    links: [
      { label: "Time" },
      { label: "Discord" },
      { label: "Sobre", href: "/about" },
      { label: "Contato", href: "/contact" }
    ]
  },
  { title: "Empresa", links: [{ label: "Publicidade" }, { label: "Newsletter" }, { label: "Imprensa" }, { label: "RSS Feed" }] }
] as const;

const socialLinks: Array<{ icon: ReactNode; label: string }> = [
  {
    icon: (
      <svg aria-hidden viewBox="0 0 16 16">
        <path d="M8 0C3.6 0 0 3.7 0 8.2c0 3.6 2.3 6.6 5.5 7.7.4.1.5-.2.5-.4v-1.4c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.1-.9-1.1-.7-.5.1-.5.1-.5.8.1 1.2.9 1.2.9.7 1.2 1.8.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.2-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8.6-.2 1.3-.3 2-.3s1.4.1 2 .3c1.5-1 2.2-.8 2.2-.8.5 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.2 0 3.1-1.9 3.8-3.6 4 .3.2.5.7.5 1.4v2.1c0 .2.1.5.5.4A8.2 8.2 0 0 0 16 8.2C16 3.7 12.4 0 8 0Z" />
      </svg>
    ),
    label: "GitHub"
  },
  {
    icon: (
      <svg aria-hidden viewBox="0 0 16 16">
        <path d="M16 3.1c-.6.3-1.2.4-1.9.5.7-.4 1.2-1.1 1.4-1.9-.6.4-1.3.6-2.1.8a3.3 3.3 0 0 0-5.6 3c-2.7-.1-5.1-1.4-6.7-3.4-.3.5-.4 1.1-.4 1.7 0 1.1.6 2.1 1.4 2.7-.5 0-1-.2-1.5-.4v.1c0 1.6 1.1 2.9 2.6 3.2-.3.1-.6.1-.9.1-.2 0-.4 0-.6-.1.4 1.3 1.6 2.2 3 2.3A6.6 6.6 0 0 1 0 13.7 9.3 9.3 0 0 0 5 15.2c6 0 9.3-5 9.3-9.4v-.4c.7-.5 1.2-1 1.7-1.7Z" />
      </svg>
    ),
    label: "Twitter"
  },
  {
    icon: (
      <svg aria-hidden viewBox="0 0 16 16">
        <path d="M15.7 4.4a2 2 0 0 0-1.4-1.5C13 2.6 8 2.6 8 2.6s-5 0-6.3.3A2 2 0 0 0 .3 4.4 20.3 20.3 0 0 0 0 8a20.3 20.3 0 0 0 .3 3.6 2 2 0 0 0 1.4 1.5c1.3.3 6.3.3 6.3.3s5 0 6.3-.3a2 2 0 0 0 1.4-1.5A20.3 20.3 0 0 0 16 8a20.3 20.3 0 0 0-.3-3.6ZM6.4 10.3V5.7L10.6 8l-4.2 2.3Z" />
      </svg>
    ),
    label: "YouTube"
  },
  {
    icon: (
      <svg aria-hidden viewBox="0 0 16 16">
        <path d="M3.6 5.3H.5V16h3.1V5.3ZM2 0C.9 0 .2.7.2 1.7c0 1 .7 1.7 1.8 1.7s1.8-.7 1.8-1.7C3.8.7 3.1 0 2 0Zm13.9 9.9c0-3.3-1.8-4.9-4.1-4.9-1.9 0-2.7 1-3.2 1.8V5.3h-3V16h3.1v-6c0-.3 0-.6.1-.9.2-.6.8-1.2 1.7-1.2 1.2 0 1.7.9 1.7 2.3V16h3.1V9.9Z" />
      </svg>
    ),
    label: "LinkedIn"
  },
  {
    icon: (
      <svg aria-hidden viewBox="0 0 16 16">
        <path d="M8 3.9A4.1 4.1 0 1 0 8 12a4.1 4.1 0 0 0 0-8.1Zm0 6.6A2.5 2.5 0 1 1 8 5.5a2.5 2.5 0 0 1 0 5Zm5.3-6.8a1 1 0 1 1-1.9 0 1 1 0 0 1 1.9 0Z" />
        <path d="M4.7 0h6.6A4.7 4.7 0 0 1 16 4.7v6.6a4.7 4.7 0 0 1-4.7 4.7H4.7A4.7 4.7 0 0 1 0 11.3V4.7A4.7 4.7 0 0 1 4.7 0Zm0 1.5a3.2 3.2 0 0 0-3.2 3.2v6.6a3.2 3.2 0 0 0 3.2 3.2h6.6a3.2 3.2 0 0 0 3.2-3.2V4.7a3.2 3.2 0 0 0-3.2-3.2H4.7Z" />
      </svg>
    ),
    label: "Instagram"
  }
];

const iconButtonClass =
  "inline-flex size-9 items-center justify-center rounded-pill bg-secondary text-muted-foreground transition-colors hover:text-secondary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:cursor-default disabled:bg-secondary disabled:text-muted-foreground disabled:opacity-100 [&_svg]:size-4 [&_svg]:fill-current";

export type FooterVariant = "beta" | "fixed-dark";

export function Footer({ variant = "fixed-dark" }: { variant?: FooterVariant }) {
  return (
    <footer
      className={cn(
        variant === "fixed-dark" && "dark",
        "relative flex w-full flex-col gap-10 border-t border-border bg-card px-4 pb-8 pt-14 text-card-foreground sm:px-6 md:px-10 xl:h-[330px] xl:border-t-0 xl:before:pointer-events-none xl:before:absolute xl:before:inset-x-0 xl:before:top-0 xl:before:h-px xl:before:bg-border"
      )}
    >
      <div className="grid w-full gap-10 md:grid-cols-2 xl:h-36 xl:w-[calc(100vw-5rem)] xl:flex xl:justify-between xl:gap-16">
        <section className="flex max-w-80 flex-col gap-4 xl:w-80 xl:max-w-none">
          <p className="font-primary text-[22px] font-bold leading-none">
            Café<span className="text-primary">Debug</span>
          </p>
          <p className="font-secondary text-sm leading-[1.6] text-muted-foreground">
            Conversas profundas sobre carreira, tecnologia e a comunidade de desenvolvimento.
          </p>
          <div className="flex items-center gap-2.5">
            {socialLinks.map(({ icon, label }) => (
              <button aria-disabled="true" aria-label={`${label} do CaféDebug (em breve)`} className={iconButtonClass} disabled key={label} type="button">
                {icon}
              </button>
            ))}
          </div>
        </section>

        {footerColumns.map((column) => (
          <section className="flex flex-col gap-3.5" key={column.title}>
            <h2 className="font-primary text-xs font-semibold leading-4 tracking-[1.5px] text-card-foreground">{column.title}</h2>
            <ul className="flex flex-col gap-3.5 font-secondary text-sm leading-[1.3] text-muted-foreground">
              {column.links.map((item) => (
                <li key={item.label}>
                  {"href" in item ? (
                    <Link className="hover:text-card-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" href={item.href}>
                      {item.label}
                    </Link>
                  ) : (
                    <span
                      aria-disabled="true"
                      aria-label={"status" in item ? `${item.label} — ${item.status}` : item.label}
                      className="cursor-default"
                    >
                      {item.label}
                      {"status" in item ? <span aria-hidden="true"> — {item.status}</span> : null}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section className="flex max-w-75 flex-col gap-3 xl:w-75 xl:max-w-none">
          <h2 className="font-primary text-xs font-semibold leading-4 tracking-[1.5px] text-card-foreground">Newsletter semanal</h2>
          <p className="font-secondary text-sm leading-[1.5] text-muted-foreground">As melhores discussões da semana no seu email.</p>
          <div
            aria-label="Newsletter semanal"
            className="flex h-11 w-full items-center justify-between gap-2 rounded-pill border border-border bg-background py-0 pl-4 pr-1"
            role="group"
          >
            <span className="min-w-0 truncate font-secondary text-[13px] leading-none text-muted-foreground">seu@email.com</span>
            <button
              aria-disabled="true"
              aria-label="Enviar email da newsletter (em breve)"
              className="inline-flex size-9 items-center justify-center rounded-pill bg-primary text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:cursor-default disabled:bg-primary disabled:text-primary-foreground disabled:opacity-100"
              disabled
              type="button"
            >
              <ArrowRight aria-hidden size={16} />
            </button>
          </div>
        </section>
      </div>

      <div className="h-px w-full shrink-0 bg-border xl:w-[calc(100vw-5rem)]" />

      <div className="flex w-full flex-col gap-4 font-secondary text-[13px] leading-[1.3] text-muted-foreground md:flex-row md:items-center md:justify-between xl:w-[calc(100vw-5rem)]">
        <p>© 2026 CaféDebug. Todos os direitos reservados.</p>
        <div className="flex flex-wrap items-center gap-5">
          <span aria-disabled="true">Privacidade</span>
          <span aria-disabled="true">Termos</span>
          <span aria-disabled="true">Cookies</span>
        </div>
      </div>
    </footer>
  );
}
