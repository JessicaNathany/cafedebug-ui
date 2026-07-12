import type {
  TeamMemberListItem,
  TeamMembersPageData,
  TeamMembersQueryParams
} from "./types/team-member.types";

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null;

const toTrimmedString = (value: unknown): string | undefined => {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : undefined;
};

const toInteger = (value: unknown): number | undefined => {
  if (typeof value === "number" && Number.isInteger(value)) {
    return value;
  }

  if (typeof value === "string") {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return undefined;
    }

    const parsedValue = Number(trimmedValue);
    return Number.isInteger(parsedValue) ? parsedValue : undefined;
  }

  return undefined;
};

const toBoolean = (value: unknown): boolean | undefined => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value !== "string") {
    return undefined;
  }

  const normalizedValue = value.trim().toLowerCase();

  if (["true", "1", "active", "yes"].includes(normalizedValue)) {
    return true;
  }

  if (["false", "0", "inactive", "no"].includes(normalizedValue)) {
    return false;
  }

  return undefined;
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

const readTeamMemberListItem = (source: unknown): TeamMemberListItem | null => {
  if (!isRecord(source)) {
    return null;
  }

  const id = toInteger(source.id) ?? toInteger(source.teamMemberId) ?? toInteger(source.teamMemberID) ?? null;
  const name =
    toTrimmedString(source.name) ??
    (typeof id === "number" ? `Team Member #${id}` : "Team Member");

  return {
    id,
    name,
    email: toTrimmedString(source.email) ?? "—",
    podcastRole: toTrimmedString(source.podcastRole) ?? "—",
    gitHubUrl: toTrimmedString(source.gitHubUrl) ?? "",
    linkedInUrl: toTrimmedString(source.linkedInUrl) ?? "",
    isActive: toBoolean(source.isActive) ?? false,
    createdAt: toTrimmedString(source.createdAt) ?? "",
    updatedAt: toTrimmedString(source.updatedAt) ?? ""
  };
};

const readTeamMemberItems = (payload: unknown): TeamMemberListItem[] => {
  if (Array.isArray(payload)) {
    return payload
      .map((entry) => readTeamMemberListItem(entry))
      .filter((entry): entry is TeamMemberListItem => Boolean(entry));
  }

  if (!isRecord(payload)) {
    return [];
  }

  const collection =
    (Array.isArray(payload.items) ? payload.items : undefined) ??
    (Array.isArray(payload.results) ? payload.results : undefined) ??
    (Array.isArray(payload.records) ? payload.records : undefined);

  if (!collection) {
    return [];
  }

  return collection
    .map((entry) => readTeamMemberListItem(entry))
    .filter((entry): entry is TeamMemberListItem => Boolean(entry));
};

export const parseTeamMembersPageData = (
  source: unknown,
  fallbackParams: TeamMembersQueryParams
): TeamMembersPageData => {
  const payload = resolveResultPayload(source);
  const items = readTeamMemberItems(payload);
  const payloadRecord = isRecord(payload) ? payload : {};

  const page = toInteger(payloadRecord.page) ?? fallbackParams.page;
  const pageSize = toInteger(payloadRecord.pageSize) ?? fallbackParams.pageSize;
  const totalCount = toInteger(payloadRecord.totalCount) ?? items.length;
  const pageCount =
    toInteger(payloadRecord.pageCount) ??
    Math.max(1, Math.ceil(totalCount / Math.max(pageSize, 1)));
  const hasPrevious = toBoolean(payloadRecord.hasPrevious) ?? page > 1;
  const hasNext = toBoolean(payloadRecord.hasNext) ?? page < pageCount;
  const sortBy = toTrimmedString(payloadRecord.sortBy) ?? fallbackParams.sortBy;
  const descending = toBoolean(payloadRecord.descending) ?? fallbackParams.descending;

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