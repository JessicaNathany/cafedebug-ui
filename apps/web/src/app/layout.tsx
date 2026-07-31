import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, JetBrains_Mono } from "next/font/google";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MiniPlayer } from "@/features/player/mini-player";
import { env } from "@/lib/env";
import { organizationJsonLd, podcastSeriesJsonLd } from "@/lib/seo/jsonld";
import { defaultMetadata } from "@/lib/seo/metadata";
import { getThemePref, resolveInitialThemeClass } from "@/lib/theme";

import "./globals.css";
import { Providers } from "./providers";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist"
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono"
});

export const metadata: Metadata = defaultMetadata;

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const theme = await getThemePref();
  const organization = organizationJsonLd(env.NEXT_PUBLIC_SITE_URL);
  const podcastSeries = podcastSeriesJsonLd(env.NEXT_PUBLIC_SITE_URL);

  return (
    <html className={`${resolveInitialThemeClass(theme)} ${geist.variable} ${jetBrainsMono.variable}`} lang="pt-BR" suppressHydrationWarning>
      <body>
        <Providers initialTheme={theme}>
          <Header />
          {children}
          <MiniPlayer />
          <Footer />

          <script dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} type="application/ld+json" />
          <script dangerouslySetInnerHTML={{ __html: JSON.stringify(podcastSeries) }} type="application/ld+json" />
        </Providers>
      </body>
    </html>
  );
}
