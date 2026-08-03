export type BannerPencilNodes = {
  dark: string;
  light: string;
};

export type BannerCta = {
  label: string;
  action: "play-featured" | "episodes-anchor" | "disabled";
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
  primaryCta: BannerCta;
  secondaryCta: BannerCta;
};
