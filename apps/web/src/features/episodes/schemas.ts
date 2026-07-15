import { z } from "zod";

export const episodeSchema = z.object({
  slug: z.string().min(2),
  number: z.number().int().positive(),
  category: z.string().min(2),
  title: z.string().min(4),
  summary: z.string().min(10),
  publishedAt: z.iso.date(),
  dateLabel: z.string().min(4),
  durationMinutes: z.number().positive(),
  plays: z.string().min(2),
  audioUrl: z.string().min(1),
  artworkUrl: z.string().min(1),
  guestName: z.string().min(2),
  guestRole: z.string().min(2),
  showNotesHtml: z.string().min(10)
});

export type EpisodeSchema = z.infer<typeof episodeSchema>;
