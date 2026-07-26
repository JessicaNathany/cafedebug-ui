import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type CardVariant = "default" | "plain";

const variantClasses: Record<CardVariant, string> = {
  default: "bg-card text-card-foreground",
  plain: "bg-background text-foreground"
};

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  variant?: CardVariant;
};

export function Card({ children, className, variant = "default", ...props }: CardProps) {
  return (
    <div
      className={cn("overflow-hidden rounded-[var(--radius-none)] border border-border shadow-pencil-subtle", variantClasses[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
}

type CardSectionProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

type CardHeaderProps = CardSectionProps & {
  divided?: boolean;
};

export function CardHeader({ children, className, divided = false, ...props }: CardHeaderProps) {
  return (
    <div className={cn("flex min-h-[68px] flex-col justify-center p-6", divided ? "border-b border-border" : null, className)} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ children, className, ...props }: CardSectionProps) {
  return (
    <div className={cn("grid gap-2 p-6", className)} {...props}>
      {children}
    </div>
  );
}

export function CardActions({ children, className, ...props }: CardSectionProps) {
  return (
    <div className={cn("flex min-h-[68px] items-center gap-2 p-6", className)} {...props}>
      {children}
    </div>
  );
}

type PlainCardProps = Omit<CardProps, "children" | "variant"> & {
  actions?: ReactNode;
  children: ReactNode;
  header?: ReactNode;
};

export function PlainCard({ actions, children, className, header, ...props }: PlainCardProps) {
  return (
    <Card className={className} variant="plain" {...props}>
      {header ? <CardHeader divided>{header}</CardHeader> : null}
      <CardContent>{children}</CardContent>
      {actions ? <CardActions>{actions}</CardActions> : null}
    </Card>
  );
}
