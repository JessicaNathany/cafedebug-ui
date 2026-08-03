"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ListMusic, Play, Ticket, Users } from "lucide-react";
import { type KeyboardEvent, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { PlayButton } from "@/features/episodes/components/play-button";
import type { Episode } from "@/features/episodes/types";
import { cn } from "@/lib/utils";

import type { BannerCta, HomepageBanner } from "../types";

type BannerCarouselProps = {
  banners: readonly HomepageBanner[];
  featuredEpisode: Episode;
};

const ctaIcons = [Play, ListMusic, Ticket, Users] as const;

function formatSlideNumber(value: number): string {
  return String(value).padStart(2, "0");
}

function CarouselCta({
  cta,
  episode,
  icon,
  primary
}: {
  cta: BannerCta;
  episode: Episode;
  icon?: (typeof ctaIcons)[number];
  primary: boolean;
}) {
  const Icon = icon;
  const className = cn(
    "inline-flex h-[50px] w-full items-center justify-center gap-2 rounded-pill px-[26px] font-secondary text-base font-semibold leading-[19px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:w-auto",
    primary ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border border-white/40 bg-transparent text-white hover:bg-white/10"
  );

  if (cta.action === "play-featured") {
    return <PlayButton className={className} episode={episode} iconSize={18} label={cta.label} />;
  }

  if (cta.action === "episodes-anchor") {
    return (
      <Link className={className} href="#episodios">
        {cta.label}
      </Link>
    );
  }

  return (
    <button aria-disabled="true" className={cn(className, "cursor-default")} type="button">
      {primary && Icon ? <Icon aria-hidden size={18} /> : null}
      {cta.label}
    </button>
  );
}

export function BannerCarousel({ banners, featuredEpisode }: BannerCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function selectSlide(index: number, moveFocus = false) {
    const normalizedIndex = (index + banners.length) % banners.length;
    setActiveIndex(normalizedIndex);
    if (moveFocus) {
      tabRefs.current[normalizedIndex]?.focus();
    }
  }

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        selectSlide(index - 1, true);
        break;
      case "ArrowRight":
        event.preventDefault();
        selectSlide(index + 1, true);
        break;
      case "Home":
        event.preventDefault();
        selectSlide(0, true);
        break;
      case "End":
        event.preventDefault();
        selectSlide(banners.length - 1, true);
        break;
    }
  }

  return (
    <section aria-label="Destaques do CaféDebug" aria-roledescription="carousel" className="w-full max-w-[728px]" role="region">
      <div className="relative h-[420px] overflow-hidden rounded-[var(--radius-m)] bg-secondary sm:aspect-[91/65] sm:h-auto lg:h-[520px] lg:aspect-auto">
        {banners.map((banner, index) => {
          const PrimaryIcon = ctaIcons[index] ?? Play;
          const isActive = index === activeIndex;

          return (
            <div
              aria-labelledby={`homepage-banner-tab-${banner.id}`}
              className="absolute inset-0"
              hidden={!isActive}
              id={`homepage-banner-panel-${banner.id}`}
              key={banner.id}
              role="tabpanel"
              tabIndex={0}
            >
              <Image
                alt=""
                className="object-cover"
                fill
                priority={index === 0}
                sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1023px) calc(100vw - 80px), 728px"
                src={banner.imageUrl}
                style={{ objectPosition: banner.imagePosition }}
              />
              <span aria-hidden className="absolute inset-0 bg-[image:var(--home-beta-banner-overlay)]" />

              <div className="absolute inset-x-6 bottom-6 grid gap-3 text-white sm:inset-x-8 sm:bottom-8 sm:gap-4 lg:inset-x-9 lg:bottom-9">
                <div className="inline-flex h-[30px] w-fit items-center gap-2 rounded-pill bg-white/15 px-3.5 font-primary text-[11px] font-semibold tracking-[1px] sm:text-xs">
                  <span aria-hidden className="size-[7px] rounded-pill bg-primary" />
                  <span>{banner.eyebrow}</span>
                </div>
                <h1 className="max-w-[656px] font-secondary text-[32px] font-bold leading-[1.12] sm:text-[38px] lg:text-[42px]">{banner.headline}</h1>
                <p className="max-w-[520px] font-secondary text-sm leading-[1.5] text-white/85 sm:text-[15px]">{banner.subtitle}</p>
                <div className="grid gap-3 sm:flex sm:flex-wrap">
                  <CarouselCta cta={banner.primaryCta} episode={featuredEpisode} icon={PrimaryIcon} primary />
                  <CarouselCta cta={banner.secondaryCta} episode={featuredEpisode} primary={false} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3.5 flex flex-col gap-3 lg:h-10 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        <div aria-label="Selecione um destaque" className="grid h-10 grid-cols-4 gap-3 sm:gap-5 lg:w-[540px]" role="tablist">
          {banners.map((banner, index) => (
            <button
              aria-controls={`homepage-banner-panel-${banner.id}`}
              aria-selected={index === activeIndex}
              className="group grid min-w-0 grid-rows-[3px_1fr] gap-2.5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              id={`homepage-banner-tab-${banner.id}`}
              key={banner.id}
              onClick={() => selectSlide(index)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              role="tab"
              tabIndex={index === activeIndex ? 0 : -1}
              type="button"
            >
              <span aria-hidden className={cn("h-[3px] w-full", index === activeIndex ? "bg-primary" : "bg-border")} />
              <span className="sr-only sm:not-sr-only sm:truncate sm:font-primary sm:text-[11px] sm:font-semibold sm:leading-[15px] sm:text-muted-foreground group-aria-selected:text-foreground">{banner.tabLabel}</span>
            </button>
          ))}
        </div>

        <div className="flex h-10 items-center justify-end gap-4">
          <p aria-live="polite" className="min-w-[59px] font-primary text-xs text-muted-foreground">
            {formatSlideNumber(activeIndex + 1)} / {formatSlideNumber(banners.length)}
          </p>
          <div className="flex gap-2">
            <Button aria-label="Destaque anterior" onClick={() => selectSlide(activeIndex - 1)} size="icon" variant="secondary">
              <ChevronLeft aria-hidden size={18} />
            </Button>
            <Button aria-label="Próximo destaque" onClick={() => selectSlide(activeIndex + 1)} size="icon" variant="secondary">
              <ChevronRight aria-hidden size={18} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
