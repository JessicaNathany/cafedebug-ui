import { ArrowUpRight, BookOpen, Code2, FileText, Link as LinkIcon, PlayCircle } from "lucide-react";

import type { EpisodeResource, EpisodeResourceIcon } from "../types";

const resourceIcons: Record<EpisodeResourceIcon, typeof FileText> = {
  "book-open": BookOpen,
  "file-text": FileText,
  github: Code2,
  link: LinkIcon,
  "play-circle": PlayCircle
};

export function EpisodeResources({ resources }: { resources: readonly EpisodeResource[] }) {
  return (
    <section aria-labelledby="episode-resources-title" className="grid content-start gap-3 rounded-m border border-border bg-card px-4 pb-4 pt-6 xl:h-[359px]" id="recursos">
      <h2 className="font-primary text-xs font-semibold tracking-[0.15em] text-muted-foreground" id="episode-resources-title">
        RECURSOS &amp; LINKS
      </h2>
      <ul className="grid gap-1">
        {resources.map((resource, index) => {
          const Icon = resourceIcons[resource.icon];

          return (
            <li key={resource.label}>
              <a className={`flex items-center gap-3 rounded-m px-2 font-secondary text-sm leading-[1.4] text-foreground transition-colors hover:bg-secondary/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${index === 1 ? "h-10" : "h-15"}`} href={resource.href} rel="noreferrer" target="_blank">
                <Icon aria-hidden className="shrink-0 text-primary" size={18} />
                <span className="min-w-0 flex-1">{resource.label}</span>
                <ArrowUpRight aria-hidden className="shrink-0 text-muted-foreground" size={16} />
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
