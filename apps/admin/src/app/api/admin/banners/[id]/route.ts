import { bannersDetailHandler } from "@/features/banners/server/banners-detail.handler";
import { bannersUpdateHandler } from "@/features/banners/server/banners-update.handler";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  return bannersDetailHandler(request, context);
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  return bannersUpdateHandler(request, context);
}
