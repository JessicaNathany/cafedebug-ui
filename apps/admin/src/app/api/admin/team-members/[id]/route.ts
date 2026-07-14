import { teamMembersDetailHandler } from "@/features/team-members/server/team-members-detail.handler";
import { teamMembersUpdateHandler } from "@/features/team-members/server/team-members-update.handler";

type TeamMemberRouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: TeamMemberRouteContext) {
  return teamMembersDetailHandler(request, context);
}

export async function PUT(request: Request, context: TeamMemberRouteContext) {
  return teamMembersUpdateHandler(request, context);
}
