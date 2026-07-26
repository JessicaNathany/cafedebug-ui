import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type IconButtonVariant = "default" | "primary" | "secondary" | "outline" | "ghost";
type IconButtonSize = "default" | "large" | "featured";

const variantClasses: Record<IconButtonVariant, string> = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  outline: "border border-border bg-background text-foreground shadow-pencil-subtle hover:bg-secondary/50",
  ghost: "bg-transparent text-foreground hover:bg-secondary/50"
};

const sizeClasses: Record<IconButtonSize, string> = {
  default: "h-10 w-10",
  large: "h-12 w-12",
  featured: "h-14 w-14"
};

type AccessibleIconName = { "aria-label": string; "aria-labelledby"?: string } | { "aria-label"?: string; "aria-labelledby": string };

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label" | "aria-labelledby"> & {
  children: ReactNode;
  size?: IconButtonSize;
  variant?: IconButtonVariant;
} & AccessibleIconName;

export function IconButton({ children, className, size = "default", type = "button", variant = "default", ...props }: IconButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-pill transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
