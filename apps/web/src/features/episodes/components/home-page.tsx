import Link from "next/link";
import Image from "next/image";
import { Circle, Headphones, Radio, Send, SkipBack, SkipForward, SlidersHorizontal, Volume2 } from "lucide-react";

import { listEpisodes } from "../server/list-episodes";
import { PlayButton } from "./play-button";
import { EpisodeCard } from "./episode-card";

const heroStats = [
  { label: "Episódios publicados", value: "140+" },
  { label: "Pessoas ouvintes", value: "50k+" },
  { label: "Comunidade ativa", value: "9 anos" }
] as const;

const newsItems = [
  {
    category: "COMUNIDADE",
    date: "14 Jul 2026",
    title: "Guia de carreira em engenharia já está no ar",
    summary: "Publicamos uma curadoria prática com caminhos para transição e progressão técnica no mercado atual."
  },
  {
    category: "PODCAST",
    date: "10 Jul 2026",
    title: "Novo episódio com foco em arquitetura evolutiva",
    summary: "Discussão sobre decisões incrementais, trade-offs e organização de times para escalar sistemas sem perder clareza."
  }
] as const;

const eventItems = [
  { date: "18 Jul", title: "Live: Entrevistas técnicas", time: "19:00 · Online" },
  { date: "25 Jul", title: "Meetup: Carreira em produto", time: "20:00 · São Paulo" },
  { date: "01 Ago", title: "Painel: Engenharia e IA", time: "19:30 · Online" }
] as const;

export async function HomePage() {
  const episodes = await listEpisodes();
  const featured = episodes[0];

  if (!featured) {
    return null;
  }

  const recentEpisodes = episodes.slice(1);

  return (
    <main>
      <section className="dark bg-background px-6 py-20 md:px-10">
        <div className="mx-auto grid w-full max-w-[1440px] gap-10 md:grid-cols-2 md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-pill bg-secondary px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.15em] text-secondary-foreground">
              <Circle className="fill-primary text-primary" size={10} />
              Ao vivo agora
            </div>
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.15em] text-primary">EP {featured.number} · EPISÓDIO EM DESTAQUE</p>
            <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-tight text-foreground md:text-6xl">
              Dê o próximo passo <span className="text-primary">na sua carreira dev</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
              Conversas profundas com os melhores desenvolvedores sobre carreira, tecnologia e crescimento profissional. Aqui você encontra clareza para tomar melhores decisões na sua jornada.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <PlayButton episode={featured} label="Ouvir agora" />
              <Link className="inline-flex h-10 items-center rounded-pill border border-border px-4 text-foreground hover:bg-secondary/40" href="#episodios">
                Ver todos os episódios
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {heroStats.map((stat) => (
                <div className="rounded-[--radius-m] border border-border bg-card p-4" key={stat.label}>
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{stat.label}</p>
                  <p className="mt-2 text-xl font-semibold text-foreground">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          <article className="overflow-hidden rounded-[--radius-m] border border-border bg-card p-5 shadow-card md:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 rounded-pill bg-secondary px-3 py-1 text-xs text-secondary-foreground">
                <Radio aria-hidden size={14} />
                Player ao vivo
              </div>
              <span className="font-mono text-xs text-muted-foreground">{featured.dateLabel}</span>
            </div>

            <div className="relative mb-5 h-[180px] overflow-hidden rounded-[--radius-m] border border-border">
              <Image alt={`Capa do episódio ${featured.number}`} className="object-cover" fill sizes="(max-width: 768px) 100vw, 560px" src={featured.artworkUrl} />
            </div>

            <p className="font-mono text-xs text-primary">EP {featured.number}</p>
            <h2 className="mt-2 text-xl font-semibold md:text-2xl">{featured.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              com <span className="text-foreground">{featured.guestName}</span>
            </p>

            <div className="mt-5 space-y-2">
              <div className="h-2 w-full overflow-hidden rounded-pill bg-secondary">
                <div className="h-full w-1/3 rounded-pill bg-primary" />
              </div>
              <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
                <span>08:24</span>
                <span>{featured.durationMinutes}:00</span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2">
                <button aria-label="Retroceder" className="inline-flex h-10 w-10 items-center justify-center rounded-pill border border-border bg-secondary text-secondary-foreground" type="button">
                  <SkipBack aria-hidden size={16} />
                </button>
                <PlayButton className="h-12 px-5" episode={featured} iconSize={18} label="Tocar" />
                <button aria-label="Avançar" className="inline-flex h-10 w-10 items-center justify-center rounded-pill border border-border bg-secondary text-secondary-foreground" type="button">
                  <SkipForward aria-hidden size={16} />
                </button>
              </div>

              <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <SlidersHorizontal aria-hidden size={14} />
                <span>1.25x</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <div className="inline-flex items-center gap-1.5">
                <Volume2 aria-hidden size={14} />
                <span>Volume 72%</span>
              </div>
              <div className="inline-flex items-center gap-1.5">
                <Headphones aria-hidden size={14} />
                <span>{featured.plays}</span>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="px-6 py-16" id="episodios">
        <div className="mx-auto w-full max-w-[1440px]">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="font-mono text-sm text-primary">EPISÓDIOS RECENTES</p>
              <h2 className="mt-3 text-3xl font-semibold">Episódios Recentes</h2>
              <p className="mt-2 text-sm text-muted-foreground">Novos episódios todas as semanas com discussões práticas para carreira e engenharia.</p>
            </div>
            <Link className="text-sm text-primary hover:underline" href="#episodios">
              Ver todos
            </Link>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentEpisodes.map((episode) => (
              <EpisodeCard episode={episode} key={episode.slug} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-12 md:px-10">
        <div className="mx-auto w-full max-w-[1440px]">
          <div className="mb-6">
            <p className="font-mono text-sm text-primary">NEWSROOM</p>
            <h2 className="mt-2 text-3xl font-semibold">Notícias & Eventos</h2>
            <p className="mt-2 text-sm text-muted-foreground">Atualizações da comunidade e agenda com os próximos encontros do CaféDebug.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
            <div className="grid gap-4">
              {newsItems.map((item) => (
                <article className="rounded-[--radius-m] border border-border bg-card p-5 shadow-card" key={item.title}>
                  <p className="font-mono text-xs text-primary">
                    {item.category} · {item.date}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.summary}</p>
                </article>
              ))}
            </div>

            <div className="rounded-[--radius-m] border border-border bg-card p-5 shadow-card">
              <h3 className="text-xl font-semibold">Agenda da comunidade</h3>
              <div className="mt-4 space-y-3">
                {eventItems.map((event) => (
                  <div className="flex items-start justify-between gap-4 rounded-[--radius-m] border border-border p-3" key={event.title}>
                    <span className="font-mono text-sm text-primary">{event.date}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">{event.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="dark px-6 py-16 md:px-10">
        <div className="mx-auto w-full max-w-[960px] rounded-[--radius-m] border border-border bg-card p-8 shadow-card">
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-primary">Newsletter semanal</p>
          <h2 className="text-3xl font-semibold">Fique por dentro do universo dev</h2>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
            As melhores discussões da semana no seu email. Conteúdo curado sobre carreira, tecnologia e decisões reais de engenharia.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="inline-flex h-12 flex-1 items-center rounded-pill border border-border bg-secondary px-4 text-sm text-muted-foreground">seu@email.com</div>
            <button aria-label="Enviar newsletter" className="inline-flex h-12 items-center justify-center gap-2 rounded-pill bg-primary px-5 text-sm font-medium text-primary-foreground" type="button">
              <Send aria-hidden size={16} />
              Enviar
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <span className="rounded-pill bg-secondary px-4 py-2 text-secondary-foreground">GitHub</span>
            <span className="rounded-pill bg-secondary px-4 py-2 text-secondary-foreground">YouTube</span>
            <span className="rounded-pill bg-secondary px-4 py-2 text-secondary-foreground">LinkedIn</span>
          </div>
        </div>
      </section>
    </main>
  );
}
