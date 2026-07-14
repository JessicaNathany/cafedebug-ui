import { teamMembersCreateHandler } from "@/features/team-members/server/team-members-create.handler";
import { teamMembersListHandler } from "@/features/team-members/server/team-members-list.handler";

export async function GET(request: Request) {
  return teamMembersListHandler(request);
}

export async function POST(request: Request) {
  return teamMembersCreateHandler(request);
}
