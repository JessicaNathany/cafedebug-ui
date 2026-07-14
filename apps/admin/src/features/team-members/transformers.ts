import type { TeamMemberRequest } from "@cafedebug/api-client";

import type { TeamMemberEditorValues } from "./schemas/team-member.schema";
import type { TeamMemberRecord } from "./types/team-member.types";

const withSeconds = (value: string): string => value.length === 16 ? `${value}:00` : value;
const nullableTrimmed = (value: string): string | null => {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const toLocalDateTimeInput = (value: string): string => {
  const match = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2})(?::(\d{2}))?/.exec(value.trim());
  return match ? `${match[1]}T${match[2]}:${match[3] ?? "00"}` : "";
};

export const toTeamMemberEditorDefaults = (record: TeamMemberRecord): TeamMemberEditorValues => ({
  name: record.name,
  podcastRole: record.podcastRole,
  nickname: record.nickname,
  email: record.email,
  bio: record.bio,
  jobTitle: record.jobTitle,
  gitHubUrl: record.gitHubUrl,
  linkedInUrl: record.linkedInUrl,
  instagramUrl: record.instagramUrl,
  profilePhotoUrl: record.profilePhotoUrl,
  joinedAt: toLocalDateTimeInput(record.joinedAt),
  isActive: record.isActive ?? false
});

export const toTeamMemberRequestPayload = (values: TeamMemberEditorValues): TeamMemberRequest => ({
  name: values.name.trim(),
  podcastRole: values.podcastRole.trim(),
  nickname: nullableTrimmed(values.nickname),
  email: nullableTrimmed(values.email),
  bio: nullableTrimmed(values.bio),
  jobTitle: nullableTrimmed(values.jobTitle),
  gitHubUrl: nullableTrimmed(values.gitHubUrl),
  linkedInUrl: nullableTrimmed(values.linkedInUrl),
  instagramUrl: nullableTrimmed(values.instagramUrl),
  profilePhotoUrl: nullableTrimmed(values.profilePhotoUrl),
  joinedAt: values.joinedAt.trim() ? withSeconds(values.joinedAt.trim()) : null,
  isActive: values.isActive
});
