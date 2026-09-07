import type { AboutMilestone } from "../types";

export function AboutTimeline({ milestones }: { milestones: readonly AboutMilestone[] }) {
  return (
    <ol aria-label="Linha do tempo do CaféDebug" className="flex min-w-0 flex-col">
      {milestones.map((milestone, index) => {
        const isFirst = index === 0;
        const isLast = index === milestones.length - 1;
        const rowClass = `grid min-w-0 grid-cols-[24px_minmax(0,1fr)] gap-x-4 xl:grid-cols-[96px_24px_minmax(0,1fr)] xl:gap-x-8 ${isLast ? "" : "pb-11"}`;

        return (
          <li className={rowClass} key={milestone.id}>
            <time className="col-span-2 mb-3 font-primary text-[22px] font-bold leading-[1.4] text-primary xl:col-span-1 xl:mb-0" dateTime={milestone.year}>
              {milestone.year}
            </time>
            <div aria-hidden className="relative col-start-1 flex justify-center xl:col-start-2 xl:row-start-1">
              <span className={isFirst ? "relative z-10 mt-1.5 size-4 rounded-pill bg-primary" : "relative z-10 mt-1.5 size-4 rounded-pill border-2 border-primary bg-card"} />
              {isLast ? null : <span className="absolute bottom-0 top-5 w-0.5 bg-border" />}
            </div>
            <article className="col-start-2 min-w-0 xl:col-start-3 xl:row-start-1">
              <h3 className="font-secondary text-[22px] font-semibold leading-[1.25] text-foreground">{milestone.title}</h3>
              <p className="mt-2 max-w-[720px] font-secondary text-[15px] leading-[1.6] text-muted-foreground">{milestone.description}</p>
            </article>
          </li>
        );
      })}
    </ol>
  );
}
