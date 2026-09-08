import { Compass, Heart, Mic, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { AboutValue, AboutValueIcon } from "../types";

const valueIcons: Record<AboutValueIcon, LucideIcon> = {
  mic: Mic,
  users: Users,
  heart: Heart,
  compass: Compass
};

export function AboutValueCard({ value }: { value: AboutValue }) {
  const Icon = valueIcons[value.icon];

  return (
    <article className="flex min-w-0 flex-col gap-3.5 rounded-m border border-border bg-background p-6">
      <div aria-hidden className="flex size-11 items-center justify-center rounded-pill bg-secondary text-primary">
        <Icon size={20} strokeWidth={2} />
      </div>
      <div className="flex min-w-0 flex-col gap-1.5">
        <h3 className="font-secondary text-lg font-semibold leading-[1.3] text-foreground">{value.title}</h3>
        <p className="font-secondary text-sm leading-[1.55] text-muted-foreground">{value.description}</p>
      </div>
    </article>
  );
}
