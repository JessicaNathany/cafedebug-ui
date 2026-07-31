import Link from "next/link";
import { ArrowRight, Calendar, MapPin, Mail } from "lucide-react";

import { NewsCard } from "../../news/components/news-card";
import { mockNewsArticles } from "../../news/mock/news.mock";
import { mockHomepageEvents } from "../../events/mock/homepage-events.mock";
import { listEpisodes } from "../server/list-episodes";
import { PlayButton } from "./play-button";
import { EpisodeCard } from "./episode-card";
import { HeroPlayer } from "./hero-player";
import { NewsletterForm } from "./newsletter-form";

const heroStats = [
  { label: "Episódios", value: "142" },
  { label: "Ouvintes/mês", value: "85k" },
  { label: "Avaliação", value: "4.9" }
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
      <section className="dark grid min-h-180 w-full items-center bg-background px-4 py-16 text-foreground sm:px-6 md:px-10 lg:min-h-[719px] lg:px-16 lg:py-20">
        <div className="mx-auto grid w-full max-w-[1312px] items-center gap-16 lg:w-[calc(100vw-8rem)] lg:grid-cols-[minmax(0,728px)_minmax(0,520px)]">
          <div className="grid gap-6">
            <div className="inline-flex items-center gap-2 font-primary text-[13px] font-semibold tracking-[1.5px] text-primary">
              <span aria-hidden className="size-2 rounded-pill bg-primary" />
              <span>EP {featured.number} · EPISÓDIO EM DESTAQUE</span>
            </div>
            <h1 className="max-w-182 font-secondary text-4xl font-bold leading-[1.05] tracking-normal text-foreground sm:text-5xl lg:text-[56px]">
              <span className="block">Dê o próximo passo</span>
              <span className="block text-primary">na sua carreira dev</span>
            </h1>
            <p className="max-w-140 font-secondary text-base leading-[1.6] text-muted-foreground lg:text-[17px]">
              Conversas profundas com os melhores desenvolvedores sobre carreira, tecnologia e crescimento profissional. Novos episódios toda semana.
            </p>
            <div className="flex flex-wrap items-center gap-3.5 pt-1.5">
              <PlayButton className="h-13 w-[174px] gap-2.5 px-7 font-secondary text-base font-semibold leading-6" episode={featured} iconSize={18} label="Ouvir agora" />
              <Link className="inline-flex h-13 w-[226px] shrink-0 whitespace-nowrap items-center justify-center rounded-pill border border-border bg-background px-7 font-secondary text-base font-medium leading-6 text-foreground transition-colors hover:bg-secondary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" href="#episodios">
                Ver todos os episódios
              </Link>
            </div>

            <dl className="flex flex-wrap items-center gap-4 pt-5 sm:gap-9">
              {heroStats.map((stat, index) => (
                <div className="flex items-center gap-4 sm:gap-9" key={stat.label}>
                  {index > 0 ? <span aria-hidden className="h-9 w-px bg-border" /> : null}
                  <div className="grid gap-0.5">
                    <dt className="order-2 font-secondary text-[13px] text-muted-foreground">{stat.label}</dt>
                    <dd className="order-1 font-primary text-2xl font-bold text-foreground">{stat.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
          <HeroPlayer episode={featured} />
        </div>
      </section>

      <section className="w-full bg-background px-4 py-18 text-foreground sm:px-6 md:px-10 lg:px-16" id="episodios">
        <div className="mx-auto grid w-full max-w-[1312px] gap-7 lg:w-[calc(100vw-8rem)]">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="grid gap-1.5">
              <h2 className="font-secondary text-[30px] font-bold leading-[1.3] tracking-normal text-foreground">Episódios Recentes</h2>
              <p className="font-secondary text-[15px] leading-[19px] text-muted-foreground">Novas conversas toda semana com a comunidade dev.</p>
            </div>
            <Link className="relative inline-flex h-10 items-end gap-1.5 font-secondary text-sm font-semibold leading-[18px] text-primary after:absolute after:-inset-3 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" href="#episodios">
              Ver todos
              <ArrowRight aria-hidden size={16} />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentEpisodes.map((episode) => (
              <EpisodeCard episode={episode} key={episode.slug} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative w-full border-t-border border-b-border bg-background px-4 py-12 text-foreground before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-border after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-border dark:bg-card sm:px-6 sm:py-16 md:px-10 lg:px-16 lg:py-18" id="noticias">
        <div className="mx-auto grid w-full max-w-[1312px] items-start gap-12 lg:w-[calc(100vw-8rem)] lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="grid min-w-0 gap-6">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-0">
              <div className="grid gap-1.5">
                <h2 className="font-secondary text-[30px] font-bold leading-[1.3] tracking-normal text-foreground">Últimas Notícias</h2>
                <p className="font-secondary text-[15px] leading-[19px] text-muted-foreground">O que está acontecendo no mundo do desenvolvimento.</p>
              </div>

              <button aria-label="Ver todas as notícias" className="relative inline-flex h-10 items-end gap-1.5 font-secondary text-sm font-semibold leading-[18px] text-primary after:absolute after:-inset-3 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" type="button">
                Ver todas
                <ArrowRight aria-hidden size={16} />
              </button>
            </div>

            <div className="grid min-w-0 gap-6 md:grid-cols-2">
              {mockNewsArticles.map((article) => (
                <NewsCard article={article} key={article.slug} />
              ))}
            </div>
          </div>

          <aside aria-labelledby="agenda-title" className="grid w-full min-w-0 gap-5 rounded-[var(--radius-m)] border border-border bg-card p-6 dark:bg-background lg:min-h-[569px]">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-secondary text-xl font-bold leading-[26px] text-foreground" id="agenda-title">
                Agenda de Eventos
              </h2>
              <Calendar aria-hidden className="shrink-0 text-primary" size={18} />
            </div>

            <div className="divide-y divide-border">
              {mockHomepageEvents.map((event) => (
                <article className="flex min-w-0 gap-3.5 py-4" key={event.slug}>
                  <div className="flex h-[57px] w-13 shrink-0 flex-col items-center rounded-xl bg-secondary py-2">
                    <span className="font-primary text-[11px] font-semibold leading-[13px] tracking-[1px] text-primary">{event.month}</span>
                    <span className="font-secondary text-xl font-bold leading-6 text-foreground">{event.day}</span>
                  </div>

                  <div className="grid min-w-0 content-start gap-1.25">
                    <p className="font-primary text-[10px] font-semibold leading-[12px] tracking-[1px] text-primary">{event.format}</p>
                    <h3 className="font-secondary text-[15px] font-semibold leading-[1.3] text-foreground">{event.title}</h3>
                    <p className="flex items-center gap-1.25 font-secondary text-[13px] leading-[18px] text-muted-foreground">
                      <MapPin aria-hidden className="shrink-0" size={13} />
                      {event.locationLabel}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <button aria-label="Ver agenda completa" className="inline-flex h-11 w-full items-center justify-center rounded-pill bg-secondary px-4 font-secondary text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" type="button">
              Ver agenda completa
            </button>
          </aside>
        </div>
      </section>

      <section className="dark box-border w-full bg-background px-4 py-16 text-foreground sm:px-6 sm:py-20 md:px-10 lg:h-[574px] lg:px-16 lg:py-20" id="newsletter">
        <div className="mx-auto flex w-full max-w-[1312px] flex-col items-center gap-5 rounded-[var(--radius-m)] bg-card p-6 ring-1 ring-inset ring-border sm:p-12 lg:w-[calc(100vw-8rem)] lg:h-[414px] lg:p-14 lg:px-12">
          <span aria-hidden className="inline-flex size-14 items-center justify-center rounded-pill bg-secondary text-primary">
            <Mail size={24} />
          </span>
          <h2 className="w-full max-w-160 text-center font-secondary text-3xl font-bold leading-[1.15] text-foreground sm:text-[34px]">Fique por dentro do universo dev</h2>
          <p className="w-full max-w-140 text-center font-secondary text-base leading-[1.55] text-muted-foreground">
            Receba os melhores episódios, notícias e vagas direto no seu email. Toda semana, sem ruído.
          </p>
          <NewsletterForm />
          <p className="text-center font-secondary text-[13px] leading-[17px] text-muted-foreground">Sem spam. Cancele quando quiser.</p>
        </div>
      </section>
    </main>
  );
}
