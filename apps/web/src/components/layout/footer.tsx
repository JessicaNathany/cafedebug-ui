import type { ReactNode } from "react";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
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

const socialLinks: Array<{ href: string; icon: ReactNode; label: string }> = [
  {
    href: "https://github.com/cafedebug",
    icon: (
      <svg aria-hidden viewBox="0 0 16 16">
        <path d="M8 0C3.6 0 0 3.7 0 8.2c0 3.6 2.3 6.6 5.5 7.7.4.1.5-.2.5-.4v-1.4c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.1-.9-1.1-.7-.5.1-.5.1-.5.8.1 1.2.9 1.2.9.7 1.2 1.8.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.2-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8.6-.2 1.3-.3 2-.3s1.4.1 2 .3c1.5-1 2.2-.8 2.2-.8.5 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.2 0 3.1-1.9 3.8-3.6 4 .3.2.5.7.5 1.4v2.1c0 .2.1.5.5.4A8.2 8.2 0 0 0 16 8.2C16 3.7 12.4 0 8 0Z" />
      </svg>
    ),
    label: "GitHub"
  },
  {
    href: "https://bsky.app/profile/cafedebug.bsky.social",
    icon: (
      <svg aria-hidden viewBox="0 0 16 16">
        <path d="M3.8 2.2c1.5 1.1 3.1 3.2 4.2 5.4 1-2.2 2.7-4.3 4.2-5.4 1.1-.8 3-.9 3 1.2 0 .4-.2 3.2-.3 3.8-.4 2-1.8 2.5-3.1 2.3 2.2.4 2.8 1.6 1.6 2.9-2.3 2.5-3.3-.6-3.6-1.4-.1-.2-.1-.3-.2-.3s-.1.1-.2.3c-.3.8-1.3 3.9-3.6 1.4-1.2-1.3-.6-2.5 1.6-2.9-1.3.2-2.7-.3-3.1-2.3-.1-.6-.3-3.4-.3-3.8 0-2.1 1.9-2 3-1.2Z" />
      </svg>
    ),
    label: "Bluesky"
  },
  {
    href: "https://discord.gg/hGpFPsV2gB",
    icon: (
      <svg aria-hidden viewBox="0 0 16 16">
        <path d="M13.4 3.1A12.2 12.2 0 0 0 10.6 2c-.1.2-.3.6-.4.9a11.3 11.3 0 0 0-4.4 0c-.1-.3-.3-.7-.4-.9a12.4 12.4 0 0 0-2.8 1.1C.8 5.3.2 7.4.4 9.6a12.4 12.4 0 0 0 3.5 1.8c.3-.4.6-.8.8-1.2-.4-.2-.8-.4-1.1-.6l.3-.2c2.1 1 4.4 1 6.5 0l.3.2c-.3.2-.7.4-1.1.6.2.4.5.8.8 1.2a12.4 12.4 0 0 0 3.5-1.8c.3-2.4-.3-4.4-1.9-6.5ZM5.5 8.8c-.6 0-1-.5-1-1s.4-1 1-1 1 .5 1 1-.4 1-1 1Zm5 0c-.6 0-1-.5-1-1s.4-1 1-1 1 .5 1 1-.4 1-1 1Z" />
      </svg>
    ),
    label: "Discord"
  },
  {
    href: "https://www.linkedin.com/company/83067356",
    icon: (
      <svg aria-hidden viewBox="0 0 16 16">
        <path d="M3.6 5.3H.5V16h3.1V5.3ZM2 0C.9 0 .2.7.2 1.7c0 1 .7 1.7 1.8 1.7s1.8-.7 1.8-1.7C3.8.7 3.1 0 2 0Zm13.9 9.9c0-3.3-1.8-4.9-4.1-4.9-1.9 0-2.7 1-3.2 1.8V5.3h-3V16h3.1v-6c0-.3 0-.6.1-.9.2-.6.8-1.2 1.7-1.2 1.2 0 1.7.9 1.7 2.3V16h3.1V9.9Z" />
      </svg>
    ),
    label: "LinkedIn"
  },
  {
    href: "https://www.instagram.com/cafedebugpodcast/",
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
  "inline-flex size-9 items-center justify-center rounded-pill bg-secondary text-muted-foreground transition-colors hover:text-secondary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&_svg]:size-4 [&_svg]:fill-current";

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
          <div aria-label="Café Debug" className="inline-flex h-24 shrink-0 items-center">
            <Image alt="" aria-hidden className="h-24 w-auto dark:hidden" height={768} src="/Logo-Vert.png" width={768} />
            <Image alt="" aria-hidden className="hidden h-24 w-auto dark:block" height={768} src="/logo-fundo-dark.png" width={768} />
            <span className="sr-only">Café Debug</span>
          </div>
          <p className="font-secondary text-sm leading-[1.6] text-muted-foreground">Um podcast sobre ciêcnai e tecnologia</p>
          <div className="flex items-center gap-2.5">
            {socialLinks.map(({ href, icon, label }) => (
              <Link
                aria-label={`${label} do Café Debug`}
                className={iconButtonClass}
                href={href}
                key={label}
                rel="noopener noreferrer"
                target="_blank"
              >
                {icon}
              </Link>
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
        <p>© 2026 Café Debug. Todos os direitos reservados.</p>
        <div className="flex flex-wrap items-center gap-5">
          <span aria-disabled="true">Privacidade</span>
          <span aria-disabled="true">Termos</span>
          <span aria-disabled="true">Cookies</span>
        </div>
      </div>
    </footer>
  );
}
