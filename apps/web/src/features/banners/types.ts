export type BannerPencilNodes = {
  dark: string;
  light: string;
};

export type BannerCta = {
  label: string;
  action: "play-featured" | "episodes-anchor" | "external-link" | "disabled";
  href?: string;
};

export type HomepageBanner = {
  id: string;
  tabLabel: string;
  eyebrow: string;
  headline: string;
  subtitle: string;
  imageUrl: string;
  imagePosition: string;
  sourcePhotoUrl: string;
  pencilSourceNodes: BannerPencilNodes;
  primaryCta?: BannerCta | null;
  secondaryCta: BannerCta;
};
