import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@cafedebug/design-tokens/styles.css";
import "./globals.css";
import { getThemeCookie, resolveDataTheme } from "@/lib/auth/theme";
import { AppProviders } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "Café Debug Admin",
    template: "%s | Café Debug Admin"
  },
  description: "Café Debug backoffice scaffold for authenticated admin workflows."
};

export default async function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  const theme = await getThemeCookie();
  const dataTheme = resolveDataTheme(theme);

  return (
    <html lang="en-US" data-theme={dataTheme}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
