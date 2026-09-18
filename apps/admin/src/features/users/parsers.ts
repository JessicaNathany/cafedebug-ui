import type { UserListItem, UserRecord, UsersPageData, UsersQueryParams } from "./types/users.types";

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

const toPositiveInteger = (value: unknown): number | undefined => {
  const parsedValue = toInteger(value);
  return typeof parsedValue === "number" && parsedValue > 0
    ? parsedValue
    : undefined;
};

export const parseUserRouteId = (raw: string | undefined): number | null => {
  if (typeof raw !== "string" || !/^[1-9]\d*$/.test(raw)) {
    return null;
  }

  const value = Number(raw);
  return Number.isSafeInteger(value) ? value : null;
};

export const parseUserRecord = (
  source: unknown,
  routeId?: number
): UserRecord | null => {
  const payload = resolveResultPayload(source);
  const candidate = Array.isArray(payload)
    ? payload[0]
    : isRecord(payload) && isRecord(payload.item)
      ? payload.item
      : payload;

  if (!isRecord(candidate)) {
    return null;
  }

  const id = toPositiveInteger(candidate.id);
  if (!id || (typeof routeId === "number" && id !== routeId)) {
    return null;
  }

  return {
    id,
    name: toTrimmedString(candidate.name) ?? `Users #${id}`,
    email: toTrimmedString(candidate.email) ?? "",
    createdAt: toTrimmedString(candidate.createdAt) ?? "",
    updatedAt: toTrimmedString(candidate.updatedAt) ?? ""
  };
};

const readUserListItem = (source: unknown): UserListItem | null => {
  if (!isRecord(source)) return null;
  const id = toInteger(source.id) ?? toInteger(source.userId) ?? toInteger(source.userID) ?? null;
  const name = toTrimmedString(source.name) ?? (typeof id === "number" ? `Users #${id}` : "Users");
  return {
    id,
    name,
    email: toTrimmedString(source.email) ?? "—",
    isActive: toBoolean(source.isActive) ?? false,
    createdAt: toTrimmedString(source.createdAt) ?? "",
    updatedAt: toTrimmedString(source.updatedAt) ?? ""
  };
};

const readUserItems = (payload: unknown): UserListItem[] => {
  if (Array.isArray(payload)) return payload.map(readUserListItem).filter((entry): entry is UserListItem => Boolean(entry));
  if (!isRecord(payload)) return [];
  const collection = (Array.isArray(payload.items) ? payload.items : undefined) ?? (Array.isArray(payload.results) ? payload.results : undefined) ?? (Array.isArray(payload.records) ? payload.records : undefined);
  return collection ? collection.map(readUserListItem).filter((entry): entry is UserListItem => Boolean(entry)) : [];
};

export const parseUsersPageData = (source: unknown, fallbackParams: UsersQueryParams): UsersPageData => {
  const payload = resolveResultPayload(source);
  const items = readUserItems(payload);
  const payloadRecord = isRecord(payload) ? payload : {};
  const page = toInteger(payloadRecord.page) ?? fallbackParams.page;
  const pageSize = toInteger(payloadRecord.pageSize) ?? fallbackParams.pageSize;
  const totalCount = toInteger(payloadRecord.totalCount) ?? items.length;
  const pageCount = toInteger(payloadRecord.pageCount) ?? Math.max(1, Math.ceil(totalCount / Math.max(pageSize, 1)));

  return {
    items,
    page,
    pageSize,
    totalCount,
    pageCount,
    hasPrevious: toBoolean(payloadRecord.hasPrevious) ?? page > 1,
    hasNext: toBoolean(payloadRecord.hasNext) ?? page < pageCount,
    sortBy: toTrimmedString(payloadRecord.sortBy) ?? fallbackParams.sortBy,
    descending: toBoolean(payloadRecord.descending) ?? fallbackParams.descending
  };
};
