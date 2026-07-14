import type {
  TeamMemberListItem,
  TeamMemberRecord,
  TeamMembersPageData,
  TeamMembersQueryParams
} from "./types/team-member.types";

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null;

const toTrimmedString = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined;
  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : undefined;
};

const toInteger = (value: unknown): number | undefined => {
  if (typeof value === "number" && Number.isInteger(value)) return value;
  if (typeof value !== "string") return undefined;
  const trimmedValue = value.trim();
  if (!trimmedValue) return undefined;
  const parsedValue = Number(trimmedValue);
  return Number.isInteger(parsedValue) ? parsedValue : undefined;
};

const toPositiveInteger = (value: unknown): number | undefined => {
  const parsed = toInteger(value);
  return typeof parsed === "number" && Number.isSafeInteger(parsed) && parsed > 0 ? parsed : undefined;
};

const toBoolean = (value: unknown): boolean | undefined => {
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") return undefined;
  const normalized = value.trim().toLowerCase();
  if (["true", "1", "active", "yes"].includes(normalized)) return true;
  if (["false", "0", "inactive", "no"].includes(normalized)) return false;
  return undefined;
};

const readNestedRecord = (source: UnknownRecord, fieldName: string): UnknownRecord | undefined => {
  const value = source[fieldName];
  return isRecord(value) ? value : undefined;
};

const resolveResultPayload = (source: unknown): unknown => {
  if (!isRecord(source)) return source;
  const directValue = source.value ?? source.data ?? source.payload ?? readNestedRecord(source, "result")?.value;
  return typeof directValue === "undefined" ? source : directValue;
};

/** Accepts only the raw, positive decimal route segment. Whitespace and numeric coercion are rejected. */
export const parseTeamMemberRouteId = (raw: string | undefined): number | null => {
  if (typeof raw !== "string" || !/^[1-9]\d*$/.test(raw)) return null;
  const value = Number(raw);
  return Number.isSafeInteger(value) && value > 0 ? value : null;
};

export const parseTeamMemberRecord = (source: unknown, routeId?: number): TeamMemberRecord | null => {
  const payload = resolveResultPayload(source);
  const candidate = Array.isArray(payload) ? payload[0] : isRecord(payload) && isRecord(payload.item) ? payload.item : payload;
  if (!isRecord(candidate)) return null;

  const id = toPositiveInteger(candidate.id);
  if (!id || (typeof routeId === "number" && id !== routeId)) return null;

  return {
    id,
    name: typeof candidate.name === "string" ? candidate.name : "",
    podcastRole: typeof candidate.podcastRole === "string" ? candidate.podcastRole : "",
    nickname: typeof candidate.nickname === "string" ? candidate.nickname : "",
    email: typeof candidate.email === "string" ? candidate.email : "",
    bio: typeof candidate.bio === "string" ? candidate.bio : "",
    jobTitle: typeof candidate.jobTitle === "string" ? candidate.jobTitle : "",
    gitHubUrl: typeof candidate.gitHubUrl === "string" ? candidate.gitHubUrl : "",
    linkedInUrl: typeof candidate.linkedInUrl === "string" ? candidate.linkedInUrl : "",
    instagramUrl: typeof candidate.instagramUrl === "string" ? candidate.instagramUrl : "",
    profilePhotoUrl: typeof candidate.profilePhotoUrl === "string" ? candidate.profilePhotoUrl : "",
    joinedAt: typeof candidate.joinedAt === "string" ? candidate.joinedAt : "",
    ...(typeof candidate.isActive === "boolean" ? { isActive: candidate.isActive } : {}),
    createdAt: typeof candidate.createdAt === "string" ? candidate.createdAt : "",
    updatedAt: typeof candidate.updatedAt === "string" ? candidate.updatedAt : ""
  };
};

const readTeamMemberListItem = (source: unknown): TeamMemberListItem | null => {
  if (!isRecord(source)) return null;
  const id = toInteger(source.id) ?? toInteger(source.teamMemberId) ?? toInteger(source.teamMemberID) ?? null;
  const name = toTrimmedString(source.name) ?? (typeof id === "number" ? `Team Member #${id}` : "Team Member");
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
  if (Array.isArray(payload)) return payload.map(readTeamMemberListItem).filter((entry): entry is TeamMemberListItem => Boolean(entry));
  if (!isRecord(payload)) return [];
  const collection = (Array.isArray(payload.items) ? payload.items : undefined) ?? (Array.isArray(payload.results) ? payload.results : undefined) ?? (Array.isArray(payload.records) ? payload.records : undefined);
  return collection ? collection.map(readTeamMemberListItem).filter((entry): entry is TeamMemberListItem => Boolean(entry)) : [];
};

export const parseTeamMembersPageData = (source: unknown, fallbackParams: TeamMembersQueryParams): TeamMembersPageData => {
  const payload = resolveResultPayload(source);
  const items = readTeamMemberItems(payload);
  const payloadRecord = isRecord(payload) ? payload : {};
  const page = toInteger(payloadRecord.page) ?? fallbackParams.page;
  const pageSize = toInteger(payloadRecord.pageSize) ?? fallbackParams.pageSize;
  const totalCount = toInteger(payloadRecord.totalCount) ?? items.length;
  const pageCount = toInteger(payloadRecord.pageCount) ?? Math.max(1, Math.ceil(totalCount / Math.max(pageSize, 1)));
  return {
    items, page, pageSize, totalCount, pageCount,
    hasPrevious: toBoolean(payloadRecord.hasPrevious) ?? page > 1,
    hasNext: toBoolean(payloadRecord.hasNext) ?? page < pageCount,
    sortBy: toTrimmedString(payloadRecord.sortBy) ?? fallbackParams.sortBy,
    descending: toBoolean(payloadRecord.descending) ?? fallbackParams.descending
  };
};
