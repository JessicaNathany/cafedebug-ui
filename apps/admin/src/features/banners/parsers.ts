import type {
  BannerImageUploadResult,
  BannerListItem,
  BannerMutationResult,
  BannerRecord,
  BannersPageData,
  BannersQueryParams
} from "./types/banner.types";

type UnknownRecord = Record<string, unknown>;

type BannerSharedFields = {
  id: number | null;
  name: string;
  urlImage: string;
  url: string;
  startDate: string;
  endDate: string;
  updateDate: string;
  active: boolean;
  order: number | null;
};

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

  if (normalizedValue === "true") {
    return true;
  }

  if (normalizedValue === "false") {
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

const readBannerId = (source: UnknownRecord, fallbackId?: number | null): number | null =>
  toInteger(source.id) ??
  toInteger(source.bannerId) ??
  toInteger(source.bannerID) ??
  fallbackId ??
  null;

export const parseBannerActive = (value: unknown): boolean => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value !== "string") {
    return false;
  }

  const normalizedValue = value.trim().toLowerCase();

  if (["true", "1", "active", "published", "yes"].includes(normalizedValue)) {
    return true;
  }

  if (["false", "0", "inactive", "draft", "no"].includes(normalizedValue)) {
    return false;
  }

  return false;
};

const readBannerSharedFields = (
  source: UnknownRecord,
  fallbackId?: number | null
): BannerSharedFields => {
  const id = readBannerId(source, fallbackId);

  return {
    id,
    name:
      toTrimmedString(source.name) ??
      (typeof id === "number" ? `Banner #${id}` : "Banner"),
    urlImage: toTrimmedString(source.urlImage) ?? "",
    url: toTrimmedString(source.url) ?? "",
    startDate: toTrimmedString(source.startDate) ?? "",
    endDate: toTrimmedString(source.endDate) ?? "",
    updateDate: toTrimmedString(source.updateDate) ?? "",
    active: parseBannerActive(source.active),
    order: toInteger(source.order) ?? null
  };
};

const readBannerRecord = (source: unknown, fallbackId?: number): BannerRecord | null => {
  if (!isRecord(source)) {
    return null;
  }

  const fields = readBannerSharedFields(source, fallbackId);

  if (typeof fields.id !== "number") {
    return null;
  }

  return {
    id: fields.id,
    name: fields.name,
    urlImage: fields.urlImage,
    url: fields.url,
    startDate: fields.startDate,
    endDate: fields.endDate,
    active: fields.active,
    order: fields.order
  };
};

const readBannerListItem = (source: unknown): BannerListItem | null => {
  if (!isRecord(source)) {
    return null;
  }

  return readBannerSharedFields(source);
};

export const parseBannerRecord = (source: unknown, fallbackId?: number): BannerRecord | null => {
  const payload = resolveResultPayload(source);

  if (Array.isArray(payload)) {
    return readBannerRecord(payload[0], fallbackId);
  }

  const directRecord = readBannerRecord(payload, fallbackId);

  if (directRecord) {
    return directRecord;
  }

  if (!isRecord(payload)) {
    return null;
  }

  return readBannerRecord(payload.item, fallbackId);
};

const readBannerItemsCollection = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!isRecord(payload)) {
    return [];
  }

  const collection =
    (Array.isArray(payload.items) ? payload.items : undefined) ??
    (Array.isArray(payload.results) ? payload.results : undefined) ??
    (Array.isArray(payload.records) ? payload.records : undefined);

  return collection ?? [];
};

const readMetadataRecords = (payload: unknown): UnknownRecord[] => {
  if (!isRecord(payload)) {
    return [];
  }

  const metadataRecords = [
    payload,
    readNestedRecord(payload, "pagination"),
    readNestedRecord(payload, "pageInfo"),
    readNestedRecord(payload, "meta"),
    readNestedRecord(payload, "pager")
  ];

  return metadataRecords.filter((record): record is UnknownRecord => Boolean(record));
};

const readIntegerField = (
  records: UnknownRecord[],
  fieldNames: string[]
): number | undefined => {
  for (const record of records) {
    for (const fieldName of fieldNames) {
      const value = toInteger(record[fieldName]);

      if (typeof value === "number") {
        return value;
      }
    }
  }

  return undefined;
};

const readBooleanField = (
  records: UnknownRecord[],
  fieldNames: string[]
): boolean | undefined => {
  for (const record of records) {
    for (const fieldName of fieldNames) {
      const value = toBoolean(record[fieldName]);

      if (typeof value === "boolean") {
        return value;
      }
    }
  }

  return undefined;
};

const readStringField = (
  records: UnknownRecord[],
  fieldNames: string[]
): string | undefined => {
  for (const record of records) {
    for (const fieldName of fieldNames) {
      const value = toTrimmedString(record[fieldName]);

      if (typeof value === "string") {
        return value;
      }
    }
  }

  return undefined;
};

export const parseBannersPageData = (
  source: unknown,
  fallbackParams: BannersQueryParams
): BannersPageData => {
  const payload = resolveResultPayload(source);
  const items = readBannerItemsCollection(payload)
    .map((entry) => readBannerListItem(entry))
    .filter((entry): entry is BannerListItem => Boolean(entry));
  const metadataRecords = readMetadataRecords(payload);

  const page =
    readIntegerField(metadataRecords, ["page", "currentPage", "pageNumber"]) ??
    fallbackParams.page;
  const pageSize =
    readIntegerField(metadataRecords, ["pageSize", "size", "perPage", "itemsPerPage"]) ??
    fallbackParams.pageSize;
  const totalCount =
    readIntegerField(metadataRecords, ["totalCount", "total", "totalItems", "itemCount"]) ??
    items.length;
  const pageCount =
    readIntegerField(metadataRecords, ["pageCount", "totalPages"]) ??
    Math.max(1, Math.ceil(totalCount / Math.max(pageSize, 1)));
  const hasPrevious =
    readBooleanField(metadataRecords, ["hasPrevious", "hasPrev"]) ?? page > 1;
  const hasNext =
    readBooleanField(metadataRecords, ["hasNext", "hasMore"]) ?? page < pageCount;
  const sortBy = readStringField(metadataRecords, ["sortBy"]) ?? fallbackParams.sortBy;
  const descending =
    readBooleanField(metadataRecords, ["descending", "isDescending"]) ??
    fallbackParams.descending;

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

export const parseBannerMutationResult = (
  source: unknown,
  fallbackId?: number
): BannerMutationResult => {
  const banner = parseBannerRecord(source, fallbackId);

  if (banner) {
    return {
      id: banner.id,
      active: banner.active,
      order: banner.order
    };
  }

  const payload = resolveResultPayload(source);

  if (!isRecord(payload)) {
    return {};
  }

  const id = toInteger(payload.id) ?? toInteger(payload.bannerId) ?? fallbackId;

  return typeof id === "number" ? { id } : {};
};

export const parseBannerImageUploadResult = (source: unknown): BannerImageUploadResult | null => {
  const payload = resolveResultPayload(source);

  if (!isRecord(payload)) {
    return null;
  }

  const imageUrl =
    toTrimmedString(payload.imageUrl) ??
    toTrimmedString(readNestedRecord(payload, "value")?.imageUrl);

  if (!imageUrl) {
    return null;
  }

  return { imageUrl };
};
