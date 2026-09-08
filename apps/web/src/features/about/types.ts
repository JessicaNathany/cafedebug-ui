export const aboutValueIds = ["real-conversations", "community-first", "open-access", "career-without-hype"] as const;

export type AboutValueId = (typeof aboutValueIds)[number];

export const aboutValueIcons = ["mic", "users", "heart", "compass"] as const;

export type AboutValueIcon = (typeof aboutValueIcons)[number];

export type AboutValue = {
  description: string;
  icon: AboutValueIcon;
  id: AboutValueId;
  title: string;
};

export const aboutImpactMetricIds = ["listeners", "discord-members", "downloads", "jobs"] as const;

export type AboutImpactMetricId = (typeof aboutImpactMetricIds)[number];

export type AboutImpactMetric = {
  description: string;
  id: AboutImpactMetricId;
  label: string;
  value: string;
};

export const aboutMilestoneIds = ["2018", "2019", "2021", "2023", "2026"] as const;

export type AboutMilestoneId = (typeof aboutMilestoneIds)[number];

export type AboutMilestone = {
  description: string;
  id: AboutMilestoneId;
  title: string;
  year: string;
};

export type AboutHeroMetric = {
  label: string;
  value: string;
};

export type AboutContent = {
  hero: {
    description: string;
    eyebrow: string;
    heading: string;
    metrics: readonly AboutHeroMetric[];
  };
  impact: {
    eyebrow: string;
    metrics: readonly AboutImpactMetric[];
    title: string;
  };
  journey: {
    eyebrow: string;
    milestones: readonly AboutMilestone[];
    title: string;
  };
  mission: {
    eyebrow: string;
    paragraphs: readonly [string, string];
    title: string;
    values: readonly AboutValue[];
  };
};
