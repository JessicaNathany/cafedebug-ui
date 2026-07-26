import type { InputHTMLAttributes, ReactNode } from "react";
import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";

type SearchBoxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  clearLabel?: string;
  onClear?: () => void;
  rightSlot?: ReactNode;
  showClearButton?: boolean;
};

export function SearchBox({
  className,
  clearLabel = "Limpar busca",
  disabled,
  onClear,
  placeholder = "Search...",
  rightSlot,
  showClearButton = false,
  ...props
}: SearchBoxProps) {
  return (
    <div
      className={cn(
        "flex min-h-8 w-full max-w-60 items-center gap-2 rounded-[calc(var(--radius-m)/8)] bg-background px-2 py-1.5 text-foreground transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring",
        disabled ? "cursor-not-allowed opacity-60" : "hover:bg-secondary/50",
        className
      )}
    >
      <Search aria-hidden className="shrink-0 text-muted-foreground" size={16} />
      <input
        className="min-w-0 flex-1 bg-transparent font-secondary text-sm leading-5 text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
        disabled={disabled}
        placeholder={placeholder}
        type="search"
        {...props}
      />
      {rightSlot}
      {showClearButton ? (
        <button
          aria-label={clearLabel}
          className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-pill text-foreground transition-colors hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-60"
          disabled={disabled}
          onClick={onClear}
          type="button"
        >
          <X aria-hidden size={16} />
        </button>
      ) : null}
    </div>
  );
}
