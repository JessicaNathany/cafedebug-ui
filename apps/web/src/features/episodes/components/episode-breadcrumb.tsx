import Link from "next/link";

import type { Episode } from "../types";

type EpisodeBreadcrumbProps = {
  episode?: Episode;
};

export function EpisodeBreadcrumb({ episode }: EpisodeBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 font-primary text-xs text-muted-foreground">
        <li>
          <Link className="hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" href="/">
            Início
          </Link>
        </li>
        <li aria-hidden>/</li>
        <li>
          {episode ? (
            <Link className="hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" href="/episodes">
              Episódios
            </Link>
          ) : (
            <span aria-current="page" className="text-foreground">
              Episódios
            </span>
          )}
        </li>
        {episode ? (
          <>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-foreground">
              EP {episode.number}
            </li>
          </>
        ) : null}
      </ol>
    </nav>
  );
}
