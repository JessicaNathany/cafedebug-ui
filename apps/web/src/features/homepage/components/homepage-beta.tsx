import { BannerCarousel } from "@/features/banners/components/banner-carousel";
import { homepageBanners } from "@/features/banners/mock/homepage-banners.mock";
import { HeroPlayer } from "@/features/episodes/components/hero-player";
import { listEpisodes } from "@/features/episodes/server/list-episodes";

import { NewsletterSection } from "./newsletter-section";
import { RecentEpisodes } from "./recent-episodes";

export async function HomepageBeta() {
  const episodes = await listEpisodes();
  const featuredEpisode = episodes[0];

  if (!featuredEpisode) {
    return null;
  }

  const recentEpisodes = episodes.slice(1, 7);

  return (
    <main>
      <section
        className="box-border grid w-full items-center bg-background px-4 py-16 text-foreground sm:px-6 md:px-10 md:py-16 lg:h-[734px] lg:px-16 lg:py-20"
        style={{ backgroundImage: "var(--home-beta-hero-glow)" }}
      >
        <div className="mx-auto grid w-full max-w-[1312px] items-center gap-8 md:gap-10 lg:w-[calc(100vw-8rem)] lg:grid-cols-[minmax(0,728px)_minmax(0,520px)] lg:gap-16">
          <BannerCarousel banners={homepageBanners} featuredEpisode={featuredEpisode} />
          <HeroPlayer episode={featuredEpisode} />
        </div>
      </section>

      <RecentEpisodes episodes={recentEpisodes} />
      <NewsletterSection />
    </main>
  );
}
