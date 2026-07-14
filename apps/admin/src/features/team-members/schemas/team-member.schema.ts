import { z } from "zod";

const LOCAL_DATE_TIME_PATTERN = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/;

const isValidLocalDateTime = (value: string): boolean => {
  const match = LOCAL_DATE_TIME_PATTERN.exec(value);

  if (!match) return false;

  const [, year, month, day, hour, minute, second] = match;
  const numericYear = Number(year);
  const numericMonth = Number(month);
  const numericDay = Number(day);
  const numericHour = Number(hour);
  const numericMinute = Number(minute);
  const numericSecond = second ? Number(second) : 0;

  if (
    numericMonth < 1 || numericMonth > 12 || numericDay < 1 || numericHour > 23 ||
    numericMinute > 59 || numericSecond > 59
  ) return false;

  const date = new Date(numericYear, numericMonth - 1, numericDay);
  return date.getFullYear() === numericYear && date.getMonth() === numericMonth - 1 && date.getDate() === numericDay;
};

const optionalHttpUrl = z.string().trim().refine((value) => {
  if (!value) return true;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}, "Enter a valid http or https URL.");

export const teamMemberEditorSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  podcastRole: z.string().trim().min(1, "Podcast role is required."),
  nickname: z.string(),
  email: z.string().trim().refine((value) => value.length === 0 || z.email().safeParse(value).success, "Enter a valid email address."),
  bio: z.string(),
  jobTitle: z.string(),
  gitHubUrl: optionalHttpUrl,
  linkedInUrl: optionalHttpUrl,
  instagramUrl: optionalHttpUrl,
  profilePhotoUrl: optionalHttpUrl,
  joinedAt: z.string().trim().refine((value) => value.length === 0 || isValidLocalDateTime(value), "Enter a valid local date and time."),
  isActive: z.boolean()
});

export type TeamMemberEditorValues = z.output<typeof teamMemberEditorSchema>;
