import { z } from "zod";

const isValidUrl = (value: string): boolean => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const isValidImageLocation = (value: string): boolean =>
  value.startsWith("/") || isValidUrl(value);

const isValidDateTime = (value: string): boolean => {
  const parsedDate = new Date(value);
  return !Number.isNaN(parsedDate.getTime());
};

export const bannerEditorSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Banner name is required.")
      .max(180, "Banner name must have at most 180 characters."),
    urlImage: z
      .string()
      .trim()
      .refine(
        (value) => value.length === 0 || isValidImageLocation(value),
        "Cover artwork location must be a valid URL."
      ),
    url: z
      .string()
      .trim()
      .refine(
        (value) => value.length === 0 || isValidUrl(value),
        "Banner URL must be a valid URL."
      ),
    startDate: z
      .string()
      .trim()
      .min(1, "Start date is required.")
      .refine(isValidDateTime, "Start date is invalid."),
    endDate: z
      .string()
      .trim()
      .refine(
        (value) => value.length === 0 || isValidDateTime(value),
        "End date is invalid."
      )
  })
  .superRefine(({ startDate, endDate }, context) => {
    if (!startDate.trim() || !endDate.trim()) {
      return;
    }

    const startTime = new Date(startDate).getTime();
    const endTime = new Date(endDate).getTime();

    if (Number.isNaN(startTime) || Number.isNaN(endTime)) {
      return;
    }

    if (endTime < startTime) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date must be later than start date.",
        path: ["endDate"]
      });
    }
  });

export type BannerEditorSchemaValues = z.output<typeof bannerEditorSchema>;
