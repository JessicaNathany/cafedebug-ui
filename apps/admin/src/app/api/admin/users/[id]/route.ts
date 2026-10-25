import { usersDetailHandler } from "@/features/users/server/users-detail.handler";
import { usersUpdateHandler } from "@/features/users/server/users-update.handler";

type UserRouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: UserRouteContext) {
  return usersDetailHandler(request, context);
}

export async function PUT(request: Request, context: UserRouteContext) {
  return usersUpdateHandler(request, context);
}
