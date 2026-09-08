import { AboutImpactMetrics } from "./about-impact-metrics";
import { AboutTimeline } from "./about-timeline";
import { AboutValueCard } from "./about-value-card";
import type { AboutContent } from "../types";

export function AboutPage({ content }: { content: AboutContent }) {
  return (
    <main className="min-w-0 bg-background text-foreground">
      <section aria-labelledby="about-page-title" className="px-4 pb-16 pt-20 sm:px-6 md:px-10 md:py-24 xl:min-h-[648px] xl:px-25 xl:pb-20 xl:pt-25">
        <div className="mx-auto flex w-full min-w-0 max-w-[1240px] flex-col gap-7">
          <p className="font-primary text-sm font-semibold leading-[1.3] tracking-[1.5px] text-primary">{content.hero.eyebrow}</p>
          <h1 className="max-w-[880px] font-secondary text-4xl font-bold leading-[1.1] text-foreground sm:text-5xl xl:text-[56px]" id="about-page-title">
            {content.hero.heading}
          </h1>
          <p className="max-w-[760px] font-secondary text-lg leading-[1.6] text-muted-foreground xl:text-[19px]">{content.hero.description}</p>
          <dl aria-label="Resumo do CaféDebug" className="flex w-fit flex-col gap-6 pt-7 sm:flex-row sm:gap-8 xl:gap-14">
            {content.hero.metrics.map((metric) => (
              <div className="flex shrink-0 flex-col gap-1" key={metric.label}>
                <dt className="order-2 font-secondary text-sm leading-[1.3] text-muted-foreground">{metric.label}</dt>
                <dd className="order-1 font-primary text-3xl font-bold leading-[1.3] text-foreground">{metric.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="about-purpose-title" className="border-y border-border bg-card px-4 py-16 sm:px-6 md:px-10 md:py-20 xl:min-h-[648px] xl:px-25">
        <div className="mx-auto flex w-full min-w-0 max-w-[1240px] flex-col gap-12">
          <div className="grid min-w-0 grid-cols-1 gap-8 xl:grid-cols-[380px_620px] xl:gap-35">
            <div className="flex flex-col gap-3">
              <p className="font-primary text-[13px] font-semibold leading-[1.3] tracking-[1.5px] text-primary">{content.mission.eyebrow}</p>
              <h2 className="font-secondary text-3xl font-bold leading-[1.15] text-foreground xl:text-[36px]" id="about-purpose-title">
                {content.mission.title}
              </h2>
            </div>
            <div className="flex min-w-0 flex-col gap-4 font-secondary text-[17px] leading-[1.6]">
              <p className="text-foreground">{content.mission.paragraphs[0]}</p>
              <p className="text-muted-foreground">{content.mission.paragraphs[1]}</p>
            </div>
          </div>
          <div className="grid min-w-0 grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {content.mission.values.map((value) => <AboutValueCard key={value.id} value={value} />)}
          </div>
        </div>
      </section>

      <section aria-labelledby="about-impact-title" className="px-4 py-16 sm:px-6 md:px-10 md:py-20 xl:min-h-[444px] xl:px-25">
        <div className="mx-auto flex w-full min-w-0 max-w-[1240px] flex-col gap-9">
          <div className="flex max-w-[680px] flex-col gap-3">
            <p className="font-primary text-[13px] font-semibold leading-[1.3] tracking-[1.5px] text-primary">{content.impact.eyebrow}</p>
            <h2 className="font-secondary text-3xl font-bold leading-[1.15] text-foreground xl:text-[36px]" id="about-impact-title">
              {content.impact.title}
            </h2>
          </div>
          <AboutImpactMetrics metrics={content.impact.metrics} />
        </div>
      </section>

      <section aria-labelledby="about-journey-title" className="border-t border-border bg-card px-4 py-16 sm:px-6 md:px-10 md:py-20 xl:min-h-[869px] xl:px-25">
        <div className="mx-auto flex w-full min-w-0 max-w-[1240px] flex-col gap-11">
          <div className="flex max-w-[720px] flex-col gap-3">
            <p className="font-primary text-[13px] font-semibold leading-[1.3] tracking-[1.5px] text-primary">{content.journey.eyebrow}</p>
            <h2 className="font-secondary text-3xl font-bold leading-[1.2] text-foreground xl:text-[36px]" id="about-journey-title">
              {content.journey.title}
            </h2>
          </div>
          <AboutTimeline milestones={content.journey.milestones} />
        </div>
      </section>
    </main>
  );
}
