import type { InputHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

export function Input({ className, disabled, invalid = false, leftIcon, rightIcon, ...props }: InputProps) {
  return (
    <span
      className={cn(
        "flex h-10 w-full items-center gap-2 rounded-pill border bg-background px-4 text-foreground transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring",
        invalid ? "border-error" : "border-input hover:border-ring",
        disabled ? "cursor-not-allowed opacity-60" : null,
        className
      )}
    >
      {leftIcon ? <span className="shrink-0 text-muted-foreground">{leftIcon}</span> : null}
      <input
        className="min-w-0 flex-1 bg-transparent font-secondary text-sm leading-5 text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
        disabled={disabled}
        aria-invalid={invalid || undefined}
        {...props}
      />
      {rightIcon ? <span className="shrink-0 text-muted-foreground">{rightIcon}</span> : null}
    </span>
  );
}

type InputGroupProps = {
  className?: string;
  error?: string;
  inputClassName?: string;
  label?: ReactNode;
} & InputProps;

export function InputGroup({ className, error, id, inputClassName, invalid = false, label, ...props }: InputGroupProps) {
  return (
    <label className={cn("grid w-full gap-1.5", className)} htmlFor={id}>
      {label ? <span className="font-secondary text-sm font-medium leading-5 text-foreground">{label}</span> : null}
      <Input className={inputClassName} id={id} invalid={Boolean(error) || invalid} {...props} />
      {error ? <span className="font-secondary text-xs leading-4 text-error-foreground">{error}</span> : null}
    </label>
  );
}
