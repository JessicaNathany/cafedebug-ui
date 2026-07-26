import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type LabelVariant = "orange" | "secondary";

const variantClasses: Record<LabelVariant, string> = {
  orange: "bg-warning text-warning-foreground",
  secondary: "bg-secondary text-secondary-foreground"
};

type LabelProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  icon?: ReactNode;
  variant?: LabelVariant;
};

export function Label({ children, className, icon, variant = "orange", ...props }: LabelProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center gap-1 rounded-pill px-2 py-2 font-primary text-sm leading-4",
        "font-normal",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </span>
  );
}
