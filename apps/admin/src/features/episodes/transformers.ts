import type { EpisodeRequest } from "@cafedebug/api-client";

import type {
  EpisodeEditorFormValues,
  EpisodeMutationAction,
  EpisodeRecord
} from "./types/episode.types";

const toTrimmedValue = (value: string): string => value.trim();

const DATE_TIME_WITH_MINUTES_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
const DATE_TIME_WITH_SECONDS_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
const DATE_TIME_EXTRACT_PATTERN =
  /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})(?::(\d{2}))?(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?$/;

const parseOptionalInteger = (value: string): number | undefined => {
  const normalizedValue = value.trim();

  if (normalizedValue.length === 0) {
    return undefined;
  }

  const parsedValue = Number(normalizedValue);

  return Number.isInteger(parsedValue) ? parsedValue : undefined;
};

const maybeString = (value: string): string | undefined => {
  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : undefined;
};

const toTagsList = (value: string): string[] => {
  const tags = value
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);

  return Array.from(new Set(tags));
};

const toApiDateTimeValue = (value: string): string | undefined => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return undefined;
  }

  if (DATE_TIME_WITH_SECONDS_PATTERN.test(trimmedValue)) {
    return trimmedValue;
  }

  if (DATE_TIME_WITH_MINUTES_PATTERN.test(trimmedValue)) {
    return `${trimmedValue}:00`;
  }

  const extractedDateTime = DATE_TIME_EXTRACT_PATTERN.exec(trimmedValue);

  if (extractedDateTime) {
    const [, minutesValue, secondsValue] = extractedDateTime;
    return `${minutesValue}:${secondsValue ?? "00"}`;
  }

  const parsedDate = new Date(trimmedValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return undefined;
  }

  return parsedDate.toISOString().slice(0, 19);
};

const toCurrentApiDateTimeValue = (): string => new Date().toISOString().slice(0, 19);

export const toEpisodeEditorDefaults = (
  episode: EpisodeRecord | null
): EpisodeEditorFormValues => {
  if (!episode) {
    return {
      title: "",
      shortDescription: "",
      description: "",
      url: "",
      imageUrl: "",
      tags: "",
      publishedAt: "",
      number: "",
      categoryId: ""
    };
  }

  return {
    title: episode.title,
    shortDescription: episode.shortDescription,
    description: episode.description,
    url: episode.url,
    imageUrl: episode.imageUrl,
    tags: episode.tags.join(", "),
    publishedAt: episode.publishedAt,
    number: typeof episode.number === "number" ? String(episode.number) : "",
    categoryId: typeof episode.categoryId === "number" ? String(episode.categoryId) : ""
  };
};

const toStatusForAction = (
  action: EpisodeMutationAction
): NonNullable<EpisodeRequest["status"]> => {
  if (action === "save-draft") {
    return "draft";
  }

  if (action === "archive") {
    return "archived";
  }

  return "published";
};

export const toEpisodeRequestPayload = ({
  values,
  action
}: {
  values: EpisodeEditorFormValues;
  action: EpisodeMutationAction;
}): EpisodeRequest => {
  const title = toTrimmedValue(values.title);
  const shortDescription = toTrimmedValue(values.shortDescription);
  const description = values.description.trim();
  const url = toTrimmedValue(values.url);
  const imageUrl = toTrimmedValue(values.imageUrl);
  const publishedAt = toTrimmedValue(values.publishedAt);
  const number = parseOptionalInteger(values.number);
  const categoryId = parseOptionalInteger(values.categoryId);
  const tags = toTagsList(values.tags);

  const payload: EpisodeRequest = {
    title
  };

  const status = toStatusForAction(action);
  payload.status = status;

  const maybeShortDescription = maybeString(shortDescription);
  if (maybeShortDescription) {
    payload.shortDescription = maybeShortDescription;
  }

  const maybeDescription = maybeString(description);
  if (maybeDescription) {
    payload.description = maybeDescription;
  }

  const maybeUrl = maybeString(url);
  if (maybeUrl) {
    payload.url = maybeUrl;
  }

  const maybeImageUrl = maybeString(imageUrl);
  if (maybeImageUrl) {
    payload.imageUrl = maybeImageUrl;
  }

  if (tags.length > 0) {
    payload.tags = tags;
  }

  payload.publishedAt = toApiDateTimeValue(publishedAt) ?? toCurrentApiDateTimeValue();

  if (typeof number === "number" && Number.isInteger(number)) {
    payload.number = number;
  }

  if (typeof categoryId === "number" && Number.isInteger(categoryId)) {
    payload.categoryId = categoryId;
  }

  return payload;
};
