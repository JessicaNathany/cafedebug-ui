export const episodeCategoryKeys = [
  "carreira",
  "backend",
  "frontend",
  "ia-dados",
  "devops",
  "mobile",
  "comunidade"
] as const;

export type EpisodeCategoryKey = (typeof episodeCategoryKeys)[number];

export const episodeSortKeys = ["recentes", "antigos"] as const;

export type EpisodeSort = (typeof episodeSortKeys)[number];

export type EpisodeSortOption = {
  key: EpisodeSort;
  label: string;
};

export const episodeSortOptions = [
  { key: "recentes", label: "Mais recentes" },
  { key: "antigos", label: "Mais antigos" }
] as const satisfies readonly EpisodeSortOption[];

export type EpisodeCategory = {
  key: EpisodeCategoryKey;
  label: string;
};

export const episodeCategories: readonly EpisodeCategory[] = [
  { key: "carreira", label: "Carreira" },
  { key: "backend", label: "Backend" },
  { key: "frontend", label: "Frontend" },
  { key: "ia-dados", label: "IA & Dados" },
  { key: "devops", label: "DevOps" },
  { key: "mobile", label: "Mobile" },
  { key: "comunidade", label: "Comunidade" }
];

export function isEpisodeCategoryKey(value: string): value is EpisodeCategoryKey {
  return (episodeCategoryKeys as readonly string[]).includes(value);
}

export function isEpisodeSort(value: string): value is EpisodeSort {
  return (episodeSortKeys as readonly string[]).includes(value);
}

export function getEpisodeCategoryLabel(category: EpisodeCategoryKey): string {
  return episodeCategories.find((item) => item.key === category)?.label ?? category;
}

export type Episode = {
  slug: string;
  number: number;
  category: string;
  categoryKey: EpisodeCategoryKey;
  title: string;
  summary: string;
  publishedAt: string;
  dateLabel: string;
  durationMinutes: number;
  durationLabel: string;
  plays: string;
  audioUrl: string;
  artworkUrl: string;
  guestName: string;
  guestAvatarUrl: string;
  guestRole: string;
  showNotesHtml: string;
};

export type EpisodeChapter = {
  id: string;
  startSeconds: number;
  timestamp: string;
  title: string;
};

export type EpisodeGuestSocial = {
  href: string;
  label: string;
};

export type EpisodeResourceIcon = "book-open" | "file-text" | "github" | "link" | "play-circle";

export type EpisodeResource = {
  href: string;
  icon: EpisodeResourceIcon;
  label: string;
};

export type EpisodeComment = {
  author: string;
  avatarUrl: string;
  body: string;
  id: string;
  likes: number;
  meta: string;
};

export type EpisodeDetailContent = {
  chapters: readonly EpisodeChapter[];
  comments: readonly EpisodeComment[];
  guestBio: string;
  guestSocials: readonly EpisodeGuestSocial[];
  resources: readonly EpisodeResource[];
};

export type EpisodeDetail = {
  content: EpisodeDetailContent;
  episode: Episode;
};

export type EpisodeListActiveQuery = {
  q?: string;
  category?: EpisodeCategoryKey;
  sort?: EpisodeSort;
};

export type EpisodeListQuery = EpisodeListActiveQuery & {
  page: number;
};

export type EpisodeListUrlInput = Partial<EpisodeListQuery>;

export type EpisodeListResult = {
  items: Episode[];
  totalItems: number;
  totalPages: number;
  page: number;
  pageSize: 6;
  activeQuery: EpisodeListActiveQuery;
};
