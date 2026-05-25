import type {
  EpisodeDisplayStatus,
  EpisodeRecord,
  EpisodesPageData,
  EpisodesQueryParams
} from "./types/episode.types";

type UnknownRecord = Record<string, unknown>;

const supportedEpisodeStatuses = new Set(["draft", "scheduled", "published", "archived"]);

const isEpisodeStatus = (value: string): value is Exclude<EpisodeDisplayStatus, "unknown"> =>
  supportedEpisodeStatuses.has(value);

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null;

const toTrimmedString = (value: unknown): string | undefined => {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : undefined;
};

const toInteger = (value: unknown): number | undefined =>
  typeof value === "number" && Number.isInteger(value) ? value : undefined;

const toBoolean = (value: unknown): boolean | undefined =>
  typeof value === "boolean" ? value : undefined;

const toStringList = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => toTrimmedString(entry))
    .filter((entry): entry is string => typeof entry === "string");
};

const readNestedRecord = (
  source: UnknownRecord,
  fieldName: string
): UnknownRecord | undefined => {
  const value = source[fieldName];
  return isRecord(value) ? value : undefined;
};

const resolveResultPayload = (source: unknown): unknown => {
  if (!isRecord(source)) {
    return source;
  }

  const directValue =
    source.value ??
    source.data ??
    source.payload ??
    readNestedRecord(source, "result")?.value;

  return typeof directValue === "undefined" ? source : directValue;
};

const toEpisodeDisplayStatus = (value: unknown): EpisodeDisplayStatus => {
  const status = toTrimmedString(value);

  if (!status) {
    return "unknown";
  }

  return isEpisodeStatus(status) ? status : "unknown";
};

const readEpisodeRecord = (
  source: unknown,
  fallbackId?: number
): EpisodeRecord | null => {
  if (!isRecord(source)) {
    return null;
  }

  const id =
    toInteger(source.id) ??
    toInteger(source.episodeId) ??
    toInteger(source.episodeID) ??
    fallbackId;

  if (typeof id !== "number") {
    return null;
  }

  const title =
    toTrimmedString(source.title) ??
    toTrimmedString(source.name) ??
    `Episode #${id}`;

  const description = toTrimmedString(source.description) ?? "";
  const shortDescription =
    toTrimmedString(source.shortDescription) ??
    toTrimmedString(source.summary) ??
    "";
  const url = toTrimmedString(source.url) ?? toTrimmedString(source.audioUrl) ?? "";
  const imageUrl =
    toTrimmedString(source.imageUrl) ?? toTrimmedString(source.coverUrl) ?? "";
  const publishedAt =
    toTrimmedString(source.publishedAt) ?? toTrimmedString(source.publishDate) ?? "";
  const number = toInteger(source.number) ?? toInteger(source.episodeNumber) ?? null;
  const categoryId = toInteger(readNestedRecord(source, "category")?.id) ?? null;
  const createdAt = toTrimmedString(source.createdAt) ?? "";
  const updatedAt = toTrimmedString(source.updatedAt) ?? "";

  return {
    id,
    title,
    description,
    shortDescription,
    url,
    imageUrl,
    tags: toStringList(source.tags),
    publishedAt,
    status: toEpisodeDisplayStatus(source.status),
    number,
    categoryId,
    createdAt,
    updatedAt
  };
};

export const parseEpisodeRecord = (
  source: unknown,
  fallbackId?: number
): EpisodeRecord | null => {
  const payload = resolveResultPayload(source);

  if (Array.isArray(payload)) {
    return readEpisodeRecord(payload[0], fallbackId);
  }

  const directRecord = readEpisodeRecord(payload, fallbackId);

  if (directRecord) {
    return directRecord;
  }

  if (!isRecord(payload)) {
    return null;
  }

  return readEpisodeRecord(payload.item, fallbackId);
};

const readEpisodesList = (payload: unknown): EpisodeRecord[] => {
  if (Array.isArray(payload)) {
    return payload
      .map((entry) => readEpisodeRecord(entry))
      .filter((entry): entry is EpisodeRecord => Boolean(entry));
  }

  if (!isRecord(payload)) {
    return [];
  }

  const itemCollection =
    (Array.isArray(payload.items) ? payload.items : undefined) ??
    (Array.isArray(payload.results) ? payload.results : undefined);

  if (!itemCollection) {
    return [];
  }

  return itemCollection
    .map((entry) => readEpisodeRecord(entry))
    .filter((entry): entry is EpisodeRecord => Boolean(entry));
};

export const parseEpisodesPageData = (
  source: unknown,
  fallbackParams: EpisodesQueryParams
): EpisodesPageData => {
  const payload = resolveResultPayload(source);
  const items = readEpisodesList(payload);
  const payloadRecord = isRecord(payload) ? payload : {};

  const page = toInteger(payloadRecord.page) ?? fallbackParams.page;
  const pageSize = toInteger(payloadRecord.pageSize) ?? fallbackParams.pageSize;
  const totalCount = toInteger(payloadRecord.totalCount) ?? items.length;
  const pageCount =
    toInteger(payloadRecord.pageCount) ??
    Math.max(1, Math.ceil(totalCount / Math.max(pageSize, 1)));
  const hasPrevious = toBoolean(payloadRecord.hasPrevious) ?? page > 1;
  const hasNext = toBoolean(payloadRecord.hasNext) ?? page < pageCount;
  const sortBy =
    toTrimmedString(payloadRecord.sortBy) ?? fallbackParams.sortBy;
  const descending =
    toBoolean(payloadRecord.descending) ?? fallbackParams.descending;

  return {
    items,
    page,
    pageSize,
    pageCount,
    totalCount,
    hasPrevious,
    hasNext,
    sortBy,
    descending
  };
};

export const parseEpisodeMutationResult = (
  source: unknown
): {
  id?: number;
} => {
  const payload = resolveResultPayload(source);

  if (!isRecord(payload)) {
    return {};
  }

  const id =
    toInteger(payload.id) ??
    toInteger(payload.episodeId) ??
    toInteger(payload.value && isRecord(payload.value) ? payload.value.id : undefined);

  return typeof id === "number" ? { id } : {};
};
