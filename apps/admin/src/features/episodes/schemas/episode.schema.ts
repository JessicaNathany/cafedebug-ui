import { z } from "zod";

const isValidUrl = (value: string): boolean => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const isValidDateTime = (value: string): boolean => {
  const parsedDate = new Date(value);
  return !Number.isNaN(parsedDate.getTime());
};

export const episodeEditorSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(140, "Title must have at most 140 characters."),
  shortDescription: z
    .string()
    .trim()
    .max(500, "Short description must have at most 500 characters."),
  description: z
    .string()
    .trim()
    .max(20_000, "Description is too long."),
  url: z
    .string()
    .trim()
    .refine(
      (value) => value.length === 0 || isValidUrl(value),
      "Audio URL must be a valid URL."
    ),
  imageUrl: z
    .string()
    .trim()
    .refine(
      (value) => value.length === 0 || isValidUrl(value),
      "Cover image URL must be a valid URL."
    ),
  tags: z
    .string()
    .trim()
    .max(500, "Tags field is too long."),
  publishedAt: z
    .string()
    .trim()
    .refine(
      (value) => value.length === 0 || isValidDateTime(value),
      "Publish datetime is invalid."
    ),
  number: z
    .string()
    .trim()
    .regex(/^\d*$/, "Episode number must be numeric."),
  categoryId: z
    .string()
    .trim()
    .regex(/^\d*$/, "Category ID must be numeric.")
});

export type EpisodeEditorSchemaValues = z.output<typeof episodeEditorSchema>;
