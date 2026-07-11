import { bannersCreateHandler } from "@/features/banners/server/banners-create.handler";
import { bannersListHandler } from "@/features/banners/server/banners-list.handler";

export async function GET(request: Request) {
  return bannersListHandler(request);
}

export async function POST(request: Request) {
  return bannersCreateHandler(request);
}
