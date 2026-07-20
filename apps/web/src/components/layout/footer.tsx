import { Globe, Link, MessageCircle, Radio, Rss } from "lucide-react";

import { Button } from "@/components/ui/button";

const contentColumns = [
  { title: "Conteúdo", links: ["Episódios", "Notícias", "Eventos", "Vagas"] },
  { title: "Comunidade", links: ["Time", "Discord", "Sobre", "Contato"] },
  { title: "Empresa", links: ["Publicidade", "Newsletter", "Imprensa", "RSS Feed"] }
] as const;

const socialIcons = [
  { icon: Link, label: "GitHub" },
  { icon: MessageCircle, label: "Twitter" },
  { icon: Radio, label: "YouTube" },
  { icon: Globe, label: "LinkedIn" },
  { icon: Rss, label: "Instagram" }
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border bg-footer text-footer-foreground">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-6 py-14 md:px-10">
        <div className="grid gap-8 md:grid-cols-[minmax(280px,1fr)_repeat(3,minmax(150px,220px))_minmax(240px,300px)]">
          <section className="space-y-4">
            <p className="font-mono text-xl font-bold">
              Café<span className="text-primary">Debug</span>
            </p>
            <p className="max-w-xs text-sm text-muted-foreground">
              Conversas profundas sobre carreira, tecnologia e a comunidade de desenvolvimento.
            </p>
            <div className="flex items-center gap-2">
              {socialIcons.map(({ icon: Icon, label }) => (
                <Button aria-label={`Abrir ${label} (em breve)`} disabled key={label} size="icon" variant="secondary">
                  <Icon aria-hidden size={16} />
                </Button>
              ))}
            </div>
          </section>

          {contentColumns.map((column) => (
            <section key={column.title}>
              <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">{column.title}</h2>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {column.links.map((item) => (
                  <li aria-disabled="true" className="cursor-not-allowed" key={item}>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <section className="space-y-3">
            <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">Newsletter semanal</h2>
            <p className="text-sm text-muted-foreground">As melhores discussões da semana no seu email.</p>
            <div className="flex items-center gap-2 rounded-pill border border-border bg-secondary p-2">
              <span className="truncate px-3 text-sm text-muted-foreground">seu@email.com</span>
              <Button aria-label="Newsletter em breve" disabled size="icon" variant="primary">
                ↗
              </Button>
            </div>
          </section>
        </div>

        <div className="h-px w-full bg-border" />

        <div className="flex flex-col gap-3 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© 2026 CaféDebug. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <span aria-disabled="true">Privacidade</span>
            <span aria-disabled="true">Termos</span>
            <span aria-disabled="true">Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
