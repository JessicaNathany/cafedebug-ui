import type { Metadata } from "next";

const aboutDescription =
  "Conheça a história, o propósito e a comunidade que fazem do CaféDebug um podcast para pessoas desenvolvedoras brasileiras.";

export function getAboutMetadata(): Metadata {
  const canonicalUrl = "/about";

  return {
    title: "Sobre o CaféDebug",
    description: aboutDescription,
    alternates: {
      canonical: canonicalUrl
    },
    robots: {
      follow: true,
      index: true
    },
    openGraph: {
      type: "website",
      title: "Sobre o CaféDebug",
      description: aboutDescription,
      url: canonicalUrl
    },
    twitter: {
      card: "summary_large_image"
    }
  };
}
