"use client";

import { useEffect, useRef, useState } from "react";

import { Menu, X } from "lucide-react";
import Link from "next/link";

import { primaryNavigationItems } from "@/components/layout/navigation-items";
import { Button } from "@/components/ui/button";

const desktopNavigationQuery = "(min-width: 64rem)";
const menuId = "compact-primary-navigation";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const closeAndFocusTrigger = () => {
      setOpen(false);
      rootRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeAndFocusTrigger();
      }
    };

    const handleOutsideClick = (event: MouseEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) {
        event.preventDefault();
        event.stopPropagation();
        closeAndFocusTrigger();
      }
    };

    const mediaQuery = window.matchMedia(desktopNavigationQuery);
    const handleBreakpointChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleOutsideClick, true);
    mediaQuery.addEventListener("change", handleBreakpointChange);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleOutsideClick, true);
      mediaQuery.removeEventListener("change", handleBreakpointChange);
    };
  }, [open]);

  return (
    <div className="lg:hidden" ref={rootRef}>
      <Button
        aria-controls={menuId}
        aria-expanded={open}
        aria-label={open ? "Fechar menu principal" : "Abrir menu principal"}
        onClick={() => setOpen((current) => !current)}
        size="icon"
        variant="secondary"
      >
        {open ? <X aria-hidden size={18} /> : <Menu aria-hidden size={18} />}
      </Button>

      {open ? (
        <nav
          aria-label="Navegação principal"
          className="absolute inset-x-0 top-full z-50 flex flex-col gap-1 border-b border-border bg-popover px-4 pb-5 pt-3 font-secondary sm:px-6 md:px-10 lg:hidden"
          id={menuId}
        >
          {primaryNavigationItems.map((item) => {
            if ("href" in item) {
              return (
                <Link
                  className={item.active
                    ? "flex h-11 items-center rounded-m bg-secondary px-3 text-[15px] font-semibold text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    : "flex h-11 items-center rounded-m px-3 text-[15px] text-foreground hover:bg-secondary/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"}
                  href={item.href}
                  key={item.label}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              );
            }

            return (
              <span
                aria-disabled="true"
                className="flex h-11 cursor-default items-center rounded-m px-3 text-[15px] text-muted-foreground"
                key={item.label}
              >
                {item.label}
              </span>
            );
          })}
        </nav>
      ) : null}
    </div>
  );
}
