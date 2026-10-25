import { usersCreateHandler } from "@/features/users/server/users-create.handler";
import { usersListHandler } from "@/features/users/server/users-list.handler";

export async function GET(request: Request) {
  return usersListHandler(request);
}

export async function POST(request: Request) {
  return usersCreateHandler(request);
}
