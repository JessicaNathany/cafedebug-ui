import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { getThemePref, resolveInitialThemeClass } from "@/lib/theme";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: { default: "CafeDebug", template: "%s · CafeDebug" },
  description: "Podcast e comunidade brasileira sobre desenvolvimento de software."
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const theme = await getThemePref();
  return (
    <html className={resolveInitialThemeClass(theme)} lang="pt-BR" suppressHydrationWarning>
      <body>
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
