import type { BannerEditorSchemaValues } from "./schemas/banner.schema";
import type {
  BannerEditorMode,
  BannerMutationAction,
  BannerRecord,
  BannerRequestPayload
} from "./types/banner.types";

const toTrimmedValue = (value: string): string => value.trim();

const toNullableString = (value: string): string | null => {
  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : null;
};

export const toDateTimeLocalValue = (value: string | null | undefined): string => {
  if (!value) {
    return "";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");
  const hour = String(parsedDate.getHours()).padStart(2, "0");
  const minute = String(parsedDate.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hour}:${minute}`;
};

export const toBackendDateTimeValue = (value: string): string => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "";
  }

  const parsedDate = new Date(trimmedValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return trimmedValue;
  }

  return parsedDate.toISOString();
};

export const toBannerEditorDefaults = (
  banner: BannerRecord | null
): BannerEditorSchemaValues => {
  if (!banner) {
    return {
      name: "",
      urlImage: "",
      url: "",
      startDate: "",
      endDate: ""
    };
  }

  return {
    name: banner.name,
    urlImage: banner.urlImage,
    url: banner.url,
    startDate: toDateTimeLocalValue(banner.startDate),
    endDate: toDateTimeLocalValue(banner.endDate)
  };
};

export const toBannerRequestPayload = ({
  mode,
  values,
  action,
  existingBanner
}: {
  mode: BannerEditorMode;
  values: BannerEditorSchemaValues;
  action: BannerMutationAction;
  existingBanner?: Pick<BannerRecord, "order"> | null;
}): BannerRequestPayload => {
  const payload: BannerRequestPayload = {
    name: toTrimmedValue(values.name),
    urlImage: toNullableString(values.urlImage),
    url: toNullableString(values.url),
    startDate: toBackendDateTimeValue(values.startDate),
    active: action === "publish"
  };

  const endDate = toTrimmedValue(values.endDate);
  payload.endDate = endDate.length > 0 ? toBackendDateTimeValue(endDate) : null;

  if (mode === "edit" && typeof existingBanner?.order === "number") {
    payload.order = existingBanner.order;
  }

  return payload;
};
