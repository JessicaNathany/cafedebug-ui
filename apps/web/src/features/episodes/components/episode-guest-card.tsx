import Image from "next/image";
import { Link as LinkIcon } from "lucide-react";

import type { Episode, EpisodeDetailContent } from "../types";

type EpisodeGuestCardProps = {
  content: EpisodeDetailContent;
  episode: Episode;
};

function GuestSocialIcon({ label }: { label: string }) {
  if (label === "GitHub") {
    return (
      <svg aria-hidden className="size-4 fill-current" viewBox="0 0 16 16">
        <path d="M8 0C3.6 0 0 3.7 0 8.2c0 3.6 2.3 6.6 5.5 7.7.4.1.5-.2.5-.4v-1.4c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.1-.9-1.1-.7-.5.1-.5.1-.5.8.1 1.2.9 1.2.9.7 1.2 1.8.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.2-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8.6-.2 1.3-.3 2-.3s1.4.1 2 .3c1.5-1 2.2-.8 2.2-.8.5 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.2 0 3.1-1.9 3.8-3.6 4 .3.2.5.7.5 1.4v2.1c0 .2.1.5.5.4A8.2 8.2 0 0 0 16 8.2C16 3.7 12.4 0 8 0Z" />
      </svg>
    );
  }

  if (label === "LinkedIn") {
    return (
      <svg aria-hidden className="size-4 fill-current" viewBox="0 0 16 16">
        <path d="M3.6 5.3H.5V16h3.1V5.3ZM2 0C.9 0 .2.7.2 1.7c0 1 .7 1.7 1.8 1.7s1.8-.7 1.8-1.7C3.8.7 3.1 0 2 0Zm13.9 9.9c0-3.3-1.8-4.9-4.1-4.9-1.9 0-2.7 1-3.2 1.8V5.3h-3V16h3.1v-6c0-.3 0-.6.1-.9.2-.6.8-1.2 1.7-1.2 1.2 0 1.7.9 1.7 2.3V16h3.1V9.9Z" />
      </svg>
    );
  }

  if (label === "X" || label === "Twitter") {
    return (
      <svg aria-hidden className="size-4 fill-current" viewBox="0 0 16 16">
        <path d="M16 3.1c-.6.3-1.2.4-1.9.5.7-.4 1.2-1.1 1.4-1.9-.6.4-1.3.6-2.1.8a3.3 3.3 0 0 0-5.6 3c-2.7-.1-5.1-1.4-6.7-3.4-.5.5-.4 1.1-.4 1.7 0 1.1.6 2.1 1.4 2.7-.5 0-1-.2-1.5-.4v.1c0 1.6 1.1 2.9 2.6 3.2-.3.1-.6.1-.9.1-.2 0-.4 0-.6-.1.4 1.3 1.6 2.2 3 2.3A6.6 6.6 0 0 1 0 13.7 9.3 9.3 0 0 0 5 15.2c6 0 9.3-5 9.3-9.4v-.4c.7-.5 1.2-1 1.7-1.7Z" />
      </svg>
    );
  }

  return <LinkIcon aria-hidden size={16} />;
}

export function EpisodeGuestCard({ content, episode }: EpisodeGuestCardProps) {
  return (
    <section aria-labelledby="episode-guest-title" className="grid gap-4 rounded-m border border-border bg-card p-6 xl:h-[291px]">
      <h2 className="font-primary text-xs font-semibold tracking-[0.15em] text-muted-foreground" id="episode-guest-title">
        SOBRE O CONVIDADO
      </h2>
      <div className="flex items-center gap-3">
        <Image alt={episode.guestName} className="size-14 rounded-pill object-cover" height={56} sizes="56px" src={episode.guestAvatarUrl} width={56} />
        <div className="min-w-0">
          <p className="truncate font-secondary text-[15px] font-semibold text-foreground">{episode.guestName}</p>
          <p className="truncate font-secondary text-[13px] text-muted-foreground">{episode.guestRole}</p>
        </div>
      </div>
      <p className="font-secondary text-sm leading-[1.55] text-muted-foreground">{content.guestBio}</p>
      <div className="flex flex-wrap gap-2">
        {content.guestSocials.map((social) => {
          return (
            <a aria-label={social.label} className="inline-flex size-9 items-center justify-center rounded-pill bg-secondary text-secondary-foreground transition-colors hover:bg-secondary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" href={social.href} key={social.label} rel="noreferrer" target="_blank">
              <GuestSocialIcon label={social.label} />
            </a>
          );
        })}
      </div>
    </section>
  );
}
