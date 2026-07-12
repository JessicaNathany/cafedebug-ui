import { teamMembersListHandler } from "@/features/team-members/server/team-members-list.handler";

export async function GET(request: Request) {
  return teamMembersListHandler(request);
}