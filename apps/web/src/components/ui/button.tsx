import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "default" | "icon";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:opacity-95",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  outline: "border border-border bg-transparent text-foreground hover:bg-secondary/40",
  ghost: "bg-transparent text-foreground hover:bg-secondary/40"
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-10 px-4",
  icon: "h-10 w-10"
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  children,
  className,
  size = "default",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-pill font-medium transition focus-visible:outline-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-60",
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
