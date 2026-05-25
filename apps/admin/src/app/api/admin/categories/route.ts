import { categoriesListHandler } from "@/features/categories/server/categories-list.handler";

export async function GET(request: Request) {
  return categoriesListHandler(request);
}
