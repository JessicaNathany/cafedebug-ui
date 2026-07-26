import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "default" | "large" | "icon";

const variantClasses: Record<ButtonVariant, string> = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  outline: "border border-border bg-background text-foreground shadow-pencil-subtle hover:bg-secondary/50",
  ghost: "bg-transparent text-foreground hover:bg-secondary/50"
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-10 px-4 text-sm leading-5",
  large: "h-12 px-6 text-sm leading-5",
  icon: "h-10 w-10"
};

type AccessibleIconName = { "aria-label": string; "aria-labelledby"?: string } | { "aria-label"?: string; "aria-labelledby": string };
type OptionalAccessibleName = { "aria-label"?: string; "aria-labelledby"?: string };

type ButtonBaseProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label" | "aria-labelledby"> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

type NonIconButtonProps = ButtonBaseProps & {
  size?: Exclude<ButtonSize, "icon">;
} & OptionalAccessibleName;

type IconOnlyButtonProps = ButtonBaseProps & {
  size: "icon";
} & AccessibleIconName;

type NamedButtonProps = ButtonBaseProps & {
  size: "default" | "large" | "icon";
} & AccessibleIconName;

type ButtonProps = NonIconButtonProps | IconOnlyButtonProps | NamedButtonProps;

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
        "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-pill font-primary font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60",
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
