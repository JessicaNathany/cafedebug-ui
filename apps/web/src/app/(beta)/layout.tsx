import type { ReactNode } from "react";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { getThemePref } from "@/lib/theme";

export default async function BetaLayout({ children }: Readonly<{ children: ReactNode }>) {
  const theme = await getThemePref();

  return (
    <>
      <Header initialTheme={theme} variant="beta" />
      {children}
      <Footer variant="beta" />
    </>
  );
}
