"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { primaryNavigationItems } from "@/components/layout/navigation-items";

export function Nav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Navegação principal" className="hidden items-center gap-7 font-secondary text-sm leading-5 lg:flex">
      {primaryNavigationItems.map((item) => {
        if ("href" in item) {
          const isCurrentPage = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              aria-current={isCurrentPage ? "page" : undefined}
              className={isCurrentPage ? "font-semibold text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" : "text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"}
              href={item.href}
              key={item.label}
            >
              {item.label}
            </Link>
          );
        }

        return (
          <span
            aria-disabled="true"
            className="cursor-default text-muted-foreground"
            key={item.label}
          >
            {item.label}
          </span>
        );
      })}
    </nav>
  );
}
