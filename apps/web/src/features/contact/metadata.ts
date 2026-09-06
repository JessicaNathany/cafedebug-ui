import type { Metadata } from "next";

export function getContactMetadata(): Metadata {
  const title = "Contato";
  const description = "Fale com a comunidade e o time do CaféDebug.";

  return {
    title,
    description,
    alternates: { canonical: "/contact" },
    openGraph: { description, title: `${title} | CaféDebug`, type: "website", url: "/contact" },
    robots: { follow: true, index: true }
  };
}
