import type { HomepageBanner } from "../types";

export const homepageBanners = [
  {
    id: "featured-episode",
    tabLabel: "DESTAQUE",
    eyebrow: "EP 142 · EPISÓDIO EM DESTAQUE",
    headline: "Dê o próximo passo na sua carreira dev",
    subtitle:
      "Conversas profundas com os melhores desenvolvedores sobre carreira, tecnologia e crescimento profissional.",
    imageUrl: "/mock/home-beta-banner-featured.jpg",
    imagePosition: "center",
    sourcePhotoUrl: "https://images.unsplash.com/photo-1561726976-e4fb49f9813b",
    pencilSourceNodes: { dark: "H9W1S", light: "L26kS" },
    primaryCta: {
      label: "Ouvir agora",
      action: "play-featured"
    },
    secondaryCta: {
      label: "Ver todos os episódios",
      action: "episodes-anchor"
    }
  },
  {
    id: "season-2026",
    tabLabel: "TEMPORADA",
    eyebrow: "NOVA TEMPORADA · 2026",
    headline: "Seis meses de conversas que mudam carreiras",
    subtitle: "Uma temporada inteira dedicada a quem quer crescer de verdade na engenharia de software.",
    imageUrl: "/mock/home-beta-banner-season.jpg",
    imagePosition: "center",
    sourcePhotoUrl: "https://images.unsplash.com/photo-1546900703-cf06143d1239",
    pencilSourceNodes: { dark: "qxdnq", light: "tbKTl" },
    primaryCta: {
      label: "Ver a temporada",
      action: "disabled"
    },
    secondaryCta: {
      label: "Assinar o feed",
      action: "disabled"
    }
  },
  {
    id: "live-sao-paulo",
    tabLabel: "AO VIVO",
    eyebrow: "AO VIVO · 24 JUN · SÃO PAULO",
    headline: "CaféDebug ao vivo, pela primeira vez",
    subtitle: "Gravação aberta, painéis com convidados e networking com a comunidade dev.",
    imageUrl: "/mock/home-beta-banner-live.jpg",
    imagePosition: "center",
    sourcePhotoUrl: "https://images.unsplash.com/photo-1762968280286-0bfcc4afd0ea",
    pencilSourceNodes: { dark: "pmTiN", light: "WzOur" },
    primaryCta: {
      label: "Garantir ingresso",
      action: "disabled"
    },
    secondaryCta: {
      label: "Saber mais",
      action: "disabled"
    }
  },
  {
    id: "community",
    tabLabel: "COMUNIDADE",
    eyebrow: "COMUNIDADE · 85 MIL DEVS",
    headline: "Feito com a comunidade, para a comunidade",
    subtitle: "Sugira pautas, indique convidados e participe das gravações ao vivo toda semana.",
    imageUrl: "/mock/home-beta-banner-community.jpg",
    imagePosition: "center",
    sourcePhotoUrl: "https://images.unsplash.com/photo-1576085898323-218337e3e43c",
    pencilSourceNodes: { dark: "VjfSh", light: "mB3ox" },
    primaryCta: {
      label: "Entrar na comunidade",
      action: "disabled"
    },
    secondaryCta: {
      label: "Ver episódios",
      action: "episodes-anchor"
    }
  }
] as const satisfies readonly HomepageBanner[];
