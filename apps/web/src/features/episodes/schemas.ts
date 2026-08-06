import { z } from "zod";

import { episodeCategoryKeys, episodeSortKeys } from "./types";

export const episodeCategoryKeySchema = z.enum(episodeCategoryKeys);
export const episodeSortSchema = z.enum(episodeSortKeys);

export const episodeSchema = z.object({
  slug: z.string().min(2),
  number: z.number().int().positive(),
  category: z.string().min(2),
  categoryKey: episodeCategoryKeySchema,
  title: z.string().min(4),
  summary: z.string().min(10),
  publishedAt: z.iso.date(),
  dateLabel: z.string().min(4),
  durationMinutes: z.number().positive(),
  durationLabel: z.string().min(3),
  plays: z.string().min(2),
  audioUrl: z.string().min(1),
  artworkUrl: z.string().min(1),
  guestName: z.string().min(2),
  guestAvatarUrl: z.string().min(1),
  guestRole: z.string().min(2),
  showNotesHtml: z.string().min(10)
});

export const episodeCollectionSchema = z.array(episodeSchema);

export const episodeChapterSchema = z.object({
  id: z.string().min(1),
  startSeconds: z.number().int().nonnegative(),
  timestamp: z.string().min(4),
  title: z.string().min(2)
});

export const episodeGuestSocialSchema = z.object({
  href: z.string().url(),
  label: z.string().min(1)
});

export const episodeResourceSchema = z.object({
  href: z.string().url(),
  icon: z.enum(["book-open", "file-text", "github", "link", "play-circle"]),
  label: z.string().min(2)
});

export const episodeCommentSchema = z.object({
  author: z.string().min(2),
  avatarUrl: z.string().min(1),
  body: z.string().min(2),
  id: z.string().min(1),
  likes: z.number().int().nonnegative(),
  meta: z.string().min(2)
});

export const episodeDetailContentSchema = z.object({
  chapters: z.array(episodeChapterSchema).length(8),
  comments: z.array(episodeCommentSchema).length(3),
  guestBio: z.string().min(10),
  guestSocials: z.array(episodeGuestSocialSchema).min(1),
  resources: z.array(episodeResourceSchema).length(5)
});

export const episodeDetailSchema = z.object({
  content: episodeDetailContentSchema,
  episode: episodeSchema
});

export const episodeListActiveQuerySchema = z.object({
  q: z.string().trim().min(1).max(100).optional(),
  category: episodeCategoryKeySchema.optional(),
  sort: episodeSortSchema.optional()
});

export const episodeListQuerySchema = episodeListActiveQuerySchema.extend({
  page: z.number().int().positive()
});

export const episodeListResultSchema = z.object({
  items: episodeCollectionSchema,
  totalItems: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.literal(6),
  activeQuery: episodeListActiveQuerySchema
});

export type EpisodeSchema = z.infer<typeof episodeSchema>;
