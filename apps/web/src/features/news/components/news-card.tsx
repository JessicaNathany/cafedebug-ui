import Image from "next/image";

import type { NewsArticle } from "../types";

export function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <article className="flex w-full min-w-0 flex-col overflow-hidden rounded-[var(--radius-m)] bg-card text-card-foreground ring-1 ring-inset ring-border shadow-card dark:shadow-none">
      <div className="relative h-50 shrink-0">
        <Image
          alt={article.artworkAlt}
          className="object-cover"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 430px"
          src={article.artworkUrl}
        />

        <span className="absolute left-4 top-4 rounded-pill bg-header/80 px-3 py-1.5 font-primary text-[11px] font-semibold leading-[15px] tracking-[1px] text-primary">
          {article.category}
        </span>
      </div>

      <div className="grid content-start gap-2.5 p-5">
        <h2 className="font-secondary text-lg font-semibold leading-[1.35] text-card-foreground">{article.title}</h2>
        <p className="font-secondary text-sm leading-[1.55] text-muted-foreground">{article.excerpt}</p>
        <div className="flex items-center gap-2 pt-1.5">
          <Image
            alt={article.authorAvatarAlt}
            className="size-6 rounded-pill object-cover"
            height={24}
            sizes="24px"
            src={article.authorAvatarUrl}
            width={24}
          />
          <p className="font-secondary text-[13px] font-medium text-card-foreground">{article.authorName}</p>
          <span aria-hidden className="font-secondary text-[13px] text-muted-foreground">
            ·
          </span>
          <p className="font-secondary text-[13px] text-muted-foreground">{article.readTimeLabel}</p>
        </div>
      </div>
    </article>
  );
}
