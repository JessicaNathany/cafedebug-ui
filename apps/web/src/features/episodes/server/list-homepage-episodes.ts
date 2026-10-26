import { z } from "zod";

import { env } from "@/lib/env";

import { episodeCollectionSchema } from "../schemas";
import type { Episode, EpisodeCategoryKey } from "../types";

const apiEpisodeSchema = z.object({
  id: z.number().optional(),
  title: z.string().nullish(),
  description: z.string().nullish(),
  shortDescription: z.string().nullish(),
  summary: z.string().nullish(),
  url: z.string().nullish(),
  audioUrl: z.string().nullish(),
  imageUrl: z.string().nullish(),
  coverUrl: z.string().nullish(),
  publishedAt: z.string().nullish(),
  publishDate: z.string().nullish(),
  number: z.number().nullish(),
  episodeNumber: z.number().nullish(),
  category: z
    .union([
      z.string(),
      z.object({
        name: z.string().nullish()
      })
    ])
    .nullish()
});

const apiEpisodesPayloadSchema = z.union([
  z.array(apiEpisodeSchema),
  z.object({
    items: z.array(apiEpisodeSchema)
  }),
  z.object({
    data: z.array(apiEpisodeSchema)
  }),
  z.object({
    result: z.array(apiEpisodeSchema)
  }),
  z.object({
    value: z.array(apiEpisodeSchema)
  })
]);

const monthLabels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"] as const;

function normalizeUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  const normalizedPath = url.startsWith("/") ? url : `/${url}`;
  return new URL(normalizedPath, env.WEB_API_BASE_URL).toString();
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function inferCategoryKey(category: string): EpisodeCategoryKey {
  const normalized = category.toLowerCase();

  if (normalized.includes("carreira")) return "carreira";
  if (normalized.includes("front")) return "frontend";
  if (normalized.includes("devops")) return "devops";
  if (normalized.includes("mobile")) return "mobile";
  if (normalized.includes("ia") || normalized.includes("dados")) return "ia-dados";
  if (normalized.includes("backend") || normalized.includes("arquitet")) return "backend";
  return "comunidade";
}

function formatDateLabel(dateInput: string): string {
  const date = new Date(dateInput);

  if (Number.isNaN(date.getTime())) {
    return "Data indisponível";
  }

  const day = date.getUTCDate();
  const month = monthLabels[date.getUTCMonth()] ?? monthLabels[0];
  const year = date.getUTCFullYear();
  return `${day} ${month} ${year}`;
}

function toIsoDate(dateInput: string): string {
  const date = new Date(dateInput);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid episode publish date: "${dateInput}".`);
  }

  return date.toISOString().slice(0, 10);
}

function extractEpisodes(payload: unknown) {
  const parsed = apiEpisodesPayloadSchema.parse(payload);

  if (Array.isArray(parsed)) {
    return parsed;
  }

  if ("items" in parsed) {
    return parsed.items;
  }

  if ("data" in parsed) {
    return parsed.data;
  }

  if ("result" in parsed) {
    return parsed.result;
  }

  return parsed.value;
}

function mapApiEpisodeToHomepage(entry: z.infer<typeof apiEpisodeSchema>, index: number): Episode {
  const title = entry.title?.trim();
  const publishedAt = entry.publishedAt?.trim() || entry.publishDate?.trim();
  const imageUrl = entry.imageUrl?.trim() || entry.coverUrl?.trim();
  const audioUrl = entry.url?.trim() || entry.audioUrl?.trim();
  const number = entry.number ?? entry.episodeNumber;
  const categoryName = typeof entry.category === "string" ? entry.category : entry.category?.name;
  const category = categoryName?.trim() || "COMUNIDADE";

  if (!title) {
    throw new Error(`Episode at index ${index} is missing "title".`);
  }

  if (!publishedAt) {
    throw new Error(`Episode "${title}" is missing "publishedAt".`);
  }

  if (!imageUrl) {
    throw new Error(`Episode "${title}" is missing "imageUrl".`);
  }

  if (!audioUrl) {
    throw new Error(`Episode "${title}" is missing "url".`);
  }

  if (!number) {
    throw new Error(`Episode "${title}" is missing "number".`);
  }

  const summary = entry.shortDescription?.trim() || entry.summary?.trim() || entry.description?.trim();

  if (!summary) {
    throw new Error(`Episode "${title}" is missing description/summary.`);
  }

  const episode: Episode = {
    slug: slugify(title),
    number,
    category: category.toUpperCase(),
    categoryKey: inferCategoryKey(category),
    title,
    summary,
    publishedAt: toIsoDate(publishedAt),
    dateLabel: formatDateLabel(publishedAt),
    durationMinutes: 45,
    durationLabel: "45 min",
    plays: "N/A",
    audioUrl: normalizeUrl(audioUrl),
    artworkUrl: normalizeUrl(imageUrl),
    guestName: "Convidado CaféDebug",
    guestAvatarUrl: normalizeUrl(imageUrl),
    guestRole: "Convidado(a)",
    showNotesHtml: `<p>${summary}</p>`
  };

  return episode;
}

export async function listHomepageEpisodes(): Promise<Episode[]> {
  const endpoint = new URL("/api/v1/public/episodes", env.WEB_API_BASE_URL);
  endpoint.searchParams.set("page", "1");
  endpoint.searchParams.set("pageSize", "7");
  endpoint.searchParams.set("sortBy", "publishedAt");
  endpoint.searchParams.set("descending", "true");

  const response = await fetch(endpoint.toString(), {
    method: "GET",
    headers: { Accept: "application/json" },
    next: { revalidate: 60 }
  });

  if (!response.ok) {
    throw new Error(`Failed to load homepage episodes from ${endpoint.toString()} (status ${response.status}).`);
  }

  const episodes = extractEpisodes(await response.json()).map(mapApiEpisodeToHomepage);
  const parsed = episodeCollectionSchema.safeParse(episodes);

  if (!parsed.success) {
    throw new Error(`Homepage episodes payload is invalid: ${parsed.error.message}`);
  }

  if (parsed.data.length < 2) {
    throw new Error(`Homepage requires at least 2 episodes (featured + recent). Received ${parsed.data.length}.`);
  }

  return parsed.data;
}
